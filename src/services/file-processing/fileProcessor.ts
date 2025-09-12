import fs from 'fs';
import path from 'path';
import yauzl from 'yauzl';
import AdmZip from 'adm-zip';
import { createReadStream, createWriteStream } from 'fs';
import { pipeline } from 'stream/promises';

export interface ProcessedFile {
  originalName: string;
  extractedName: string;
  fileType: 'xml' | 'pdf' | 'other';
  size: number;
  path: string;
  extractedDate: string;
}

export interface ExtractionResult {
  success: boolean;
  message: string;
  processedFiles: ProcessedFile[];
  error?: string;
}

export class FileProcessor {
  private outputDirectory: string;

  constructor(outputDirectory: string = './downloads/processed-files') {
    this.outputDirectory = outputDirectory;
    this.ensureOutputDirectory();
  }

  private ensureOutputDirectory(): void {
    if (!fs.existsSync(this.outputDirectory)) {
      fs.mkdirSync(this.outputDirectory, { recursive: true });
    }
    
    // Create subdirectories for different file types
    const subdirs = ['xml', 'pdf', 'other'];
    subdirs.forEach(subdir => {
      const subdirPath = path.join(this.outputDirectory, subdir);
      if (!fs.existsSync(subdirPath)) {
        fs.mkdirSync(subdirPath, { recursive: true });
      }
    });
  }

  private getFileType(filename: string): 'xml' | 'pdf' | 'other' {
    const ext = path.extname(filename).toLowerCase();
    switch (ext) {
      case '.xml':
        return 'xml';
      case '.pdf':
        return 'pdf';
      default:
        return 'other';
    }
  }

  private async extractZipFile(filePath: string): Promise<ProcessedFile[]> {
    return new Promise((resolve, reject) => {
      const processedFiles: ProcessedFile[] = [];
      
      yauzl.open(filePath, { lazyEntries: true }, (err: any, zipfile: any) => {
        if (err) {
          reject(err);
          return;
        }

        zipfile.readEntry();
        zipfile.on('entry', (entry: any) => {
          if (/\/$/.test(entry.fileName)) {
            // Directory entry, skip
            zipfile.readEntry();
            return;
          }

          const fileType = this.getFileType(entry.fileName);
          const outputPath = path.join(this.outputDirectory, fileType, path.basename(entry.fileName));
          
          zipfile.openReadStream(entry, (err: any, readStream: any) => {
            if (err) {
              console.error(`Error opening read stream for ${entry.fileName}:`, err);
              zipfile.readEntry();
              return;
            }

            const writeStream = createWriteStream(outputPath);
            
            pipeline(readStream, writeStream)
              .then(() => {
                const stats = fs.statSync(outputPath);
                processedFiles.push({
                  originalName: path.basename(filePath),
                  extractedName: path.basename(entry.fileName),
                  fileType,
                  size: stats.size,
                  path: outputPath,
                  extractedDate: new Date().toISOString()
                });
                zipfile.readEntry();
              })
              .catch((err) => {
                console.error(`Error extracting ${entry.fileName}:`, err);
                zipfile.readEntry();
              });
          });
        });

        zipfile.on('end', () => {
          resolve(processedFiles);
        });

        zipfile.on('error', (err: any) => {
          reject(err);
        });
      });
    });
  }

  private async extractRarFile(filePath: string): Promise<ProcessedFile[]> {
    // For RAR files, we'll use a different approach since rar-stream might not work on Windows
    // We'll try to use 7zip command line tool or fallback to a different method
    try {
      // First, let's try to extract using AdmZip (it might work for some RAR files)
      const zip = new AdmZip(filePath);
      const entries = zip.getEntries();
      const processedFiles: ProcessedFile[] = [];

      for (const entry of entries) {
        if (entry.isDirectory) continue;

        const fileType = this.getFileType(entry.entryName);
        const outputPath = path.join(this.outputDirectory, fileType, path.basename(entry.entryName));
        
        // Extract the file
        zip.extractEntryTo(entry, path.dirname(outputPath), false, true);
        
        // Rename to the correct filename
        const tempPath = path.join(path.dirname(outputPath), entry.entryName);
        if (fs.existsSync(tempPath) && tempPath !== outputPath) {
          fs.renameSync(tempPath, outputPath);
        }

        const stats = fs.statSync(outputPath);
        processedFiles.push({
          originalName: path.basename(filePath),
          extractedName: path.basename(entry.entryName),
          fileType,
          size: stats.size,
          path: outputPath,
          extractedDate: new Date().toISOString()
        });
      }

      return processedFiles;
    } catch (error) {
      console.error('Error extracting RAR file:', error);
      throw new Error(`No se pudo extraer el archivo RAR: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  async processFile(filePath: string): Promise<ExtractionResult> {
    try {
      if (!fs.existsSync(filePath)) {
        return {
          success: false,
          message: 'El archivo no existe',
          processedFiles: [],
          error: 'File not found'
        };
      }

      const ext = path.extname(filePath).toLowerCase();
      let processedFiles: ProcessedFile[] = [];

      console.log(`Procesando archivo: ${filePath}`);

      if (ext === '.zip') {
        processedFiles = await this.extractZipFile(filePath);
      } else if (ext === '.rar') {
        processedFiles = await this.extractRarFile(filePath);
      } else {
        // For other file types, just copy to appropriate directory
        const fileType = this.getFileType(filePath);
        const outputPath = path.join(this.outputDirectory, fileType, path.basename(filePath));
        fs.copyFileSync(filePath, outputPath);
        
        const stats = fs.statSync(outputPath);
        processedFiles = [{
          originalName: path.basename(filePath),
          extractedName: path.basename(filePath),
          fileType,
          size: stats.size,
          path: outputPath,
          extractedDate: new Date().toISOString()
        }];
      }

      // Count files by type
      const xmlCount = processedFiles.filter(f => f.fileType === 'xml').length;
      const pdfCount = processedFiles.filter(f => f.fileType === 'pdf').length;
      const otherCount = processedFiles.filter(f => f.fileType === 'other').length;

      return {
        success: true,
        message: `Archivo procesado exitosamente. Extraídos: ${xmlCount} XML, ${pdfCount} PDF, ${otherCount} otros archivos`,
        processedFiles
      };

    } catch (error) {
      console.error('Error processing file:', error);
      return {
        success: false,
        message: `Error procesando archivo: ${error instanceof Error ? error.message : 'Error desconocido'}`,
        processedFiles: [],
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async processMultipleFiles(filePaths: string[]): Promise<ExtractionResult[]> {
    const results: ExtractionResult[] = [];
    
    for (const filePath of filePaths) {
      const result = await this.processFile(filePath);
      results.push(result);
    }

    return results;
  }

  getProcessedFiles(): ProcessedFile[] {
    const allFiles: ProcessedFile[] = [];
    
    const fileTypes = ['xml', 'pdf', 'other'];
    
    for (const fileType of fileTypes) {
      const typeDir = path.join(this.outputDirectory, fileType);
      if (fs.existsSync(typeDir)) {
        const files = fs.readdirSync(typeDir);
        
        for (const file of files) {
          const filePath = path.join(typeDir, file);
          const stats = fs.statSync(filePath);
          
          allFiles.push({
            originalName: file,
            extractedName: file,
            fileType: fileType as 'xml' | 'pdf' | 'other',
            size: stats.size,
            path: filePath,
            extractedDate: stats.mtime.toISOString()
          });
        }
      }
    }
    
    return allFiles;
  }
}
