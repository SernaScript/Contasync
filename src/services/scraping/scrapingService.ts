import { chromium, Page, Browser, BrowserContext } from 'playwright';
import fs from 'fs';
import path from 'path';
import { PrismaClient } from '@prisma/client';
import { ScrapingConfig, defaultScrapingConfig } from './config';
<<<<<<< HEAD
import { ScrapingRequest, ScrapingResult, DownloadedFile, ScrapingProgress } from './types';
import { FileProcessor } from '../file-processing/fileProcessor';
=======
import { ScrapingRequest, ScrapingResult, DownloadedFile, ScrapingProgress, ScrapedDocumentData } from './types';
import * as yauzl from 'yauzl';
>>>>>>> c668f1ec8ae6c6d136da9d3f879ab4a632208027

export class ScrapingService {
  private config: ScrapingConfig;
  private browser: Browser | null = null;
  private context: BrowserContext | null = null;
  private page: Page | null = null;
<<<<<<< HEAD
  private fileProcessor: FileProcessor;

  constructor(config?: Partial<ScrapingConfig>) {
    this.config = { ...defaultScrapingConfig, ...config };
    this.fileProcessor = new FileProcessor(path.join(this.config.downloadDirectory, 'processed'));
=======
  private prisma: PrismaClient;

  constructor(config?: Partial<ScrapingConfig>) {
    this.config = { ...defaultScrapingConfig, ...config };
    this.prisma = new PrismaClient();
>>>>>>> c668f1ec8ae6c6d136da9d3f879ab4a632208027
  }

  async initialize(): Promise<void> {
    this.browser = await chromium.launch({ 
      headless: this.config.browserConfig.headless,
      slowMo: 100, // Slow down operations by 100ms for better visibility
      args: [
        '--start-maximized', // Start browser maximized
        '--disable-web-security',
        '--disable-features=VizDisplayCompositor'
      ]
    });
    
    this.context = await this.browser.newContext({
      acceptDownloads: this.config.browserConfig.acceptDownloads,
      extraHTTPHeaders: this.config.browserConfig.extraHTTPHeaders,
      viewport: { width: 1920, height: 1080 } // Set a large viewport
    });
    
    this.page = await this.context.newPage();
  }

  async close(): Promise<void> {
    if (this.page) {
      await this.page.close();
      this.page = null;
    }
    if (this.context) {
      await this.context.close();
      this.context = null;
    }
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
    await this.prisma.$disconnect();
  }

  private async closeMenuIfPresent(): Promise<void> {
    if (!this.page) return;

    try {
      const closeButtons = await this.page.locator(this.config.selectors.closeMenuButton).all();

      if (closeButtons.length > 0) {
        for (const button of closeButtons) {
          try {
            if (await button.isVisible()) {
              await button.click();
              console.log("Menu closed automatically.");
              await this.page.waitForTimeout(this.config.timeouts.shortDelay);
            }
          } catch (e) {
            console.error(`Error closing menu: ${e}`);
          }
        }
      }
    } catch (e) {
      console.error(`Error searching for close menu button: ${e}`);
    }
  }

  private async selectRecordsPerPage(): Promise<void> {
    if (!this.page) return;

    try {
      console.log("Seleccionando 100 registros por página...");
      
      // Wait for the select element to be visible
      await this.page.waitForSelector(this.config.selectors.recordsPerPageSelect, { 
        timeout: this.config.timeouts.elementWait 
      });
      
      // Select the option with value "100"
      await this.page.selectOption(this.config.selectors.recordsPerPageSelect, "100");
      
      console.log("Seleccionado 100 registros por página correctamente.");
      
      // Wait a bit for the page to update with the new selection
      await this.page.waitForTimeout(this.config.timeouts.mediumDelay);
      await this.closeMenuIfPresent();
      
    } catch (e) {
      console.error(`Error selecting records per page: ${e}`);
      // Don't throw error, continue with the process even if this fails
    }
  }

  private async smartWaitForPageLoad(documentCount: number): Promise<void> {
    if (!this.page) return;

    // If we have 4 or more documents, use normal wait
    if (documentCount >= 4) {
      console.log(`Page has ${documentCount} documents (>=4), using normal wait.`);
      await this.page.waitForTimeout(this.config.timeouts.mediumDelay);
      return;
    }

    console.log(`Page has only ${documentCount} documents (<4), implementing smart wait mechanism...`);
    
    const maxWaitTime = 15000; // 15 seconds maximum
    const startTime = Date.now();
    
    try {
      // Wait for the table to be stable (no more loading indicators)
      await this.page.waitForFunction(() => {
        // Check if there are any loading indicators or spinners
        const loadingElements = document.querySelectorAll('[class*="loading"], [class*="spinner"], [class*="loader"]');
        return loadingElements.length === 0;
      }, { timeout: maxWaitTime });
      
      const elapsedTime = Date.now() - startTime;
      console.log(`Page loaded in ${elapsedTime}ms, continuing immediately.`);
      
    } catch (error) {
      // If the function times out, wait for the remaining time
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, maxWaitTime - elapsedTime);
      
      if (remainingTime > 0) {
        console.log(`Page load detection timed out, waiting remaining ${remainingTime}ms...`);
        await this.page.waitForTimeout(remainingTime);
      }
    }
    
    // Additional small delay to ensure page is fully stable
    await this.page.waitForTimeout(1000);
    console.log("Smart wait completed, proceeding to next page.");
  }

  private async mapCurrentPageData(): Promise<ScrapedDocumentData[]> {
    if (!this.page) throw new Error('Page not initialized');

    const mappedDocuments: ScrapedDocumentData[] = [];

    try {
      await this.page.waitForSelector(this.config.selectors.tbody, { 
        timeout: this.config.timeouts.elementWait 
      });
      console.log("Mapping current page data...");

      const rows = await this.page.locator(this.config.selectors.tableRows).all();
      console.log(`Found ${rows.length} rows to map on current page.`);

      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        try {
          console.log(`Mapping row ${i + 1}...`);
          
          // Map all table columns
          const documentData: ScrapedDocumentData = {
            documentUUID: await this.getDownloadButtonUUID(row),
            reception: await this.getCellText(row, this.config.selectors.receptionColumn),
            documentDate: await this.getCellText(row, this.config.selectors.documentDateColumn),
            prefix: await this.getCellText(row, this.config.selectors.prefixColumn),
            documentNumber: await this.getCellText(row, this.config.selectors.documentNumberColumn),
            documentType: await this.getCellText(row, this.config.selectors.documentTypeColumn),
            senderNit: await this.getCellText(row, this.config.selectors.senderNitColumn),
            senderName: await this.getCellText(row, this.config.selectors.senderNameColumn),
            receiverNit: await this.getCellText(row, this.config.selectors.receiverNitColumn),
            receiverName: await this.getCellText(row, this.config.selectors.receiverNameColumn),
            result: await this.getCellText(row, this.config.selectors.resultColumn),
            radianStatus: await this.getCellText(row, this.config.selectors.radianStatusColumn),
            totalValue: await this.getCellText(row, this.config.selectors.totalValueColumn),
          };

          // Save document to database immediately after mapping
          await this.saveSingleDocumentToDatabase(documentData);
          console.log(`Saved document to database immediately: ${documentData.documentNumber} - ${documentData.senderName} - UUID: ${documentData.documentUUID || 'N/A'}`);

          mappedDocuments.push(documentData);
          console.log(`Mapped document: ${documentData.documentNumber} - ${documentData.senderName} - UUID: ${documentData.documentUUID || 'N/A'}`);
        } catch (e) {
          console.error(`Error mapping row ${i + 1}: ${e}`);
          continue;
        }
      }

      console.log(`Mapped and saved ${mappedDocuments.length} documents from current page.`);
      return mappedDocuments;
    } catch (e) {
      console.error(`Error mapping current page: ${e}`);
      return [];
    }
  }

  private async hasNextPage(): Promise<boolean> {
    if (!this.page) return false;

    try {
      const nextButton = this.page.locator(this.config.selectors.nextButton);
      const isNextDisabled = await nextButton.getAttribute('class');
      
      return !isNextDisabled?.includes('disabled') && await nextButton.isVisible();
    } catch (e) {
      console.error(`Error checking next page: ${e}`);
      return false;
    }
  }

  private async goToNextPage(): Promise<boolean> {
    if (!this.page) return false;

    try {
      const nextButton = this.page.locator(this.config.selectors.nextButton);
      await nextButton.click();
      await this.page.waitForTimeout(this.config.timeouts.longDelay);
      await this.closeMenuIfPresent();
      return true;
    } catch (e) {
      console.error(`Error going to next page: ${e}`);
      return false;
    }
  }

  private async getCellText(row: any, selector: string): Promise<string | undefined> {
    try {
      const cell = row.locator(selector);
      if (await cell.count() > 0) {
        const text = await cell.textContent();
        return text?.trim() || undefined;
      }
    } catch (e) {
      console.error(`Error getting cell text for selector ${selector}: ${e}`);
    }
    return undefined;
  }

  private async getDownloadButtonUUID(row: any): Promise<string | undefined> {
    try {
      const downloadButton = row.locator(this.config.selectors.downloadButtonUUID);
      if (await downloadButton.count() > 0) {
        
        const dataId = await downloadButton.getAttribute('data-id');
        if (dataId) {
          console.log(`Extracted data-id from download button: ${dataId}`);
          return dataId;
        }
        
        console.log(`No data-id found in download button. Available attributes:`, {
          dataId: await downloadButton.getAttribute('data-id'),
          id: await downloadButton.getAttribute('id'),
          class: await downloadButton.getAttribute('class'),
          onclick: await downloadButton.getAttribute('onclick'),
          href: await downloadButton.getAttribute('href')
        });
      }
    } catch (e) {
      console.error(`Error getting download button data-id: ${e}`);
    }
    return undefined;
  }

<<<<<<< HEAD
        const rows = await this.page.locator(this.config.selectors.tableRows).all();
        console.log(`Found ${rows.length} rows.`);

        for (let i = 0; i < rows.length; i++) {
          const row = rows[i];
          try {
            console.log(`Processing row ${i + 1}...`);
            const downloadButton = row.locator(this.config.selectors.downloadButton);

            if (await downloadButton.count() > 0) {
              const downloadPromise = this.page.waitForEvent('download');
              await downloadButton.click();
              console.log(`Clicked download button in row ${i + 1}.`);

              const download = await downloadPromise;
              const filename = download.suggestedFilename();
              const downloadPath = path.join(this.config.downloadDirectory, filename);
              
              await download.saveAs(downloadPath);
              console.log(`Descargando el archivo: ${filename} en ${this.config.downloadDirectory}`);
              
              const stats = fs.statSync(downloadPath);
              
              // Process file immediately after download
              const processedFile = await this.processSingleFile({
                filename,
                size: stats.size,
                downloadPath,
                downloadDate: new Date().toISOString()
              });
              
              downloadedFiles.push(processedFile);
              
              await this.page.waitForTimeout(this.config.timeouts.shortDelay);
            } else {
              console.log(`Row ${i + 1}: Download button not found.`);
            }
          } catch (e) {
            console.error(`Error processing row ${i + 1}: ${e}`);
            continue;
          }
=======
  private async saveSingleDocumentToDatabase(doc: ScrapedDocumentData): Promise<void> {
    try {
      const documentUUID = doc.documentUUID || `unknown-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      // Use upsert to handle duplicates gracefully
      await this.prisma.scrapedDocument.upsert({
        where: {
          documentUUID: documentUUID
        },
        update: {
          // Update existing record with latest data
          reception: doc.reception,
          documentDate: doc.documentDate,
          prefix: doc.prefix,
          documentNumber: doc.documentNumber,
          documentType: doc.documentType,
          senderNit: doc.senderNit,
          senderName: doc.senderName,
          receiverNit: doc.receiverNit,
          receiverName: doc.receiverName,
          result: doc.result,
          radianStatus: doc.radianStatus,
          totalValue: doc.totalValue,
          updatedAt: new Date()
        },
        create: {
          documentUUID: documentUUID,
          reception: doc.reception,
          documentDate: doc.documentDate,
          prefix: doc.prefix,
          documentNumber: doc.documentNumber,
          documentType: doc.documentType,
          senderNit: doc.senderNit,
          senderName: doc.senderName,
          receiverNit: doc.receiverNit,
          receiverName: doc.receiverName,
          result: doc.result,
          radianStatus: doc.radianStatus,
          totalValue: doc.totalValue,
          isDownloaded: false
>>>>>>> c668f1ec8ae6c6d136da9d3f879ab4a632208027
        }
      });
    } catch (error) {
      console.error('Error saving single document to database:', error);
      console.error('Document data:', doc);
      throw error;
    }
  }

  private async saveDocumentsToDatabase(documents: ScrapedDocumentData[]): Promise<void> {
    try {
      console.log(`Saving ${documents.length} documents to database...`);
      
      for (const doc of documents) {
        await this.saveSingleDocumentToDatabase(doc);
      }
      
      console.log(`Successfully saved ${documents.length} documents to database.`);
    } catch (error) {
      console.error('Error saving documents to database:', error);
      throw error;
    }
  }

  private async isDocumentAlreadyInDatabase(documentUUID: string): Promise<boolean> {
    try {
      if (!documentUUID) return false;
      
      const existingDocument = await this.prisma.scrapedDocument.findUnique({
        where: {
          documentUUID: documentUUID
        }
      });
      
      return existingDocument !== null;
    } catch (error) {
      console.error('Error checking if document exists in database:', error);
      return false; // If error, don't skip (allow download)
    }
  }

  private async isDocumentAlreadyDownloaded(documentUUID: string): Promise<boolean> {
    try {
      if (!documentUUID) return false;
      
      const existingDocument = await this.prisma.scrapedDocument.findUnique({
        where: {
          documentUUID: documentUUID
        }
      });
      
      // Only skip if document exists AND is already downloaded
      return existingDocument !== null && existingDocument.isDownloaded === true;
    } catch (error) {
      console.error('Error checking if document is already downloaded:', error);
      return false; // If error, don't skip (allow download)
    }
  }

  private async shouldSkipDocument(documentData: ScrapedDocumentData): Promise<boolean> {
    // Filter 1: Skip if sender name contains "F2X S.A.S." - DISABLED to allow F2X downloads
    // if (documentData.senderName?.includes('F2X S.A.S.')) {
    //   console.log(`Filtered out - Sender is F2X S.A.S.: ${documentData.senderName}`);
    //   return true;
    // }

    // Filter 2: Skip if document type contains "Application response" (column 6)
    if (documentData.documentType?.includes('Application response')) {
      console.log(`Filtered out - Contains Application response: ${documentData.documentType}`);
      return true;
    }

    // Filter 3: Skip if document is already downloaded (not just exists in database)
    if (documentData.documentUUID) {
      const isAlreadyDownloaded = await this.isDocumentAlreadyDownloaded(documentData.documentUUID);
      if (isAlreadyDownloaded) {
        console.log(`Filtered out - Document already downloaded: ${documentData.documentUUID}`);
        return true;
      }
    }

    return false;
  }

  private async updateDocumentAsDownloaded(documentData: ScrapedDocumentData, downloadPath: string, extractedFiles?: string[]): Promise<void> {
    try {
      // Determine the display path - prefer PDF over ZIP
      let displayPath = downloadPath;
      
      if (extractedFiles && extractedFiles.length > 0) {
        // Look for PDF files in extracted files
        const pdfFiles = extractedFiles.filter(file => file.toLowerCase().endsWith('.pdf'));
        if (pdfFiles.length > 0) {
          // Use the first PDF file as the display path
          displayPath = pdfFiles[0];
          console.log(`Using PDF path for display: ${displayPath}`);
        }
      }

      const updateData: any = {
        isDownloaded: true,
        downloadPath: displayPath, // Store the PDF path instead of ZIP path
        downloadDate: new Date(),
        updatedAt: new Date()
      };

      // Add extracted files info if available
      if (extractedFiles && extractedFiles.length > 0) {
        updateData.extractedFiles = JSON.stringify(extractedFiles);
        updateData.extractedFilesCount = extractedFiles.length;
      }

      console.log(`Updating document as downloaded:`, {
        documentUUID: documentData.documentUUID,
        documentNumber: documentData.documentNumber,
        originalDownloadPath: downloadPath,
        displayPath: displayPath
      });

      if (documentData.documentUUID) {
        const result = await this.prisma.scrapedDocument.updateMany({
          where: {
            documentUUID: documentData.documentUUID
          },
          data: updateData
        });
        console.log(`Updated ${result.count} documents with UUID: ${documentData.documentUUID}`);
      } else {
        // Fallback to old method if UUID is not available
        const result = await this.prisma.scrapedDocument.updateMany({
          where: {
            documentNumber: documentData.documentNumber,
            senderName: documentData.senderName
          },
          data: updateData
        });
        console.log(`Updated ${result.count} documents with documentNumber: ${documentData.documentNumber}`);
      }
    } catch (error) {
      console.error('Error updating document as downloaded:', error);
      console.error('Document data:', documentData);
      console.error('Download path:', downloadPath);
    }
  }

  private async processCurrentPageDownloads(mappedDocuments: ScrapedDocumentData[]): Promise<DownloadedFile[]> {
    if (!this.page) throw new Error('Page not initialized');

    const downloadedFiles: DownloadedFile[] = [];

    try {
      await this.page.waitForSelector(this.config.selectors.tbody, { 
        timeout: this.config.timeouts.elementWait 
      });
      console.log("Processing downloads for current page...");

      const rows = await this.page.locator(this.config.selectors.tableRows).all();
      console.log(`Found ${rows.length} rows to process on current page.`);

      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        try {
          console.log(`Processing row ${i + 1}...`);
          
          // Use the already mapped document data instead of re-extracting
          const documentData = mappedDocuments[i];
          if (!documentData) {
            console.log(`No mapped data for row ${i + 1}, skipping...`);
            continue;
          }

          // Apply filters
          if (await this.shouldSkipDocument(documentData)) {
            console.log(`Skipping row ${i + 1} - Document filtered out`);
            continue;
          }
          
          const downloadButton = row.locator(this.config.selectors.downloadButton);

          if (await downloadButton.count() > 0) {
            const downloadPromise = this.page.waitForEvent('download');
            await downloadButton.click();
            console.log(`Clicked download button in row ${i + 1} - Document: ${documentData.documentNumber} - Sender: ${documentData.senderName} - UUID: ${documentData.documentUUID || 'N/A'}`);

            const download = await downloadPromise;
            const filename = download.suggestedFilename();
            const downloadPath = path.join(this.config.downloadDirectory, filename);
            
            await download.saveAs(downloadPath);
            console.log(`Downloading file: ${filename} to ${this.config.downloadDirectory}`);
            
            // Extract and classify ZIP file immediately after download
            if (filename.toLowerCase().endsWith('.zip')) {
              try {
                console.log(`Extracting and classifying ZIP file: ${filename}`);
                const extractedFiles = await this.extractAndClassifyZip(downloadPath, documentData);
                console.log(`Successfully extracted and classified ${extractedFiles.length} files from ${filename}`);
                
                // Update database record with extraction info
                await this.updateDocumentAsDownloaded(documentData, downloadPath, extractedFiles);
                console.log(`Updated database record with download path and extracted files: ${downloadPath}`);
              } catch (extractionError) {
                console.error(`Error extracting ZIP file ${filename}:`, extractionError);
                // Continue with the process even if extraction fails
                await this.updateDocumentAsDownloaded(documentData, downloadPath);
              }
            } else {
              // Update database record immediately after successful download (non-ZIP files)
              await this.updateDocumentAsDownloaded(documentData, downloadPath);
              console.log(`Updated database record with download path: ${downloadPath}`);
            }
            
            const stats = fs.statSync(downloadPath);
            downloadedFiles.push({
              filename,
              size: stats.size,
              downloadPath,
              downloadDate: new Date().toISOString()
            });
            
            await this.page.waitForTimeout(this.config.timeouts.shortDelay);
          } else {
            console.log(`Row ${i + 1}: Download button not found.`);
          }
        } catch (e) {
          console.error(`Error processing row ${i + 1}: ${e}`);
          continue;
        }
      }

      console.log(`Downloaded ${downloadedFiles.length} files from current page.`);
      return downloadedFiles;
    } catch (e) {
      console.error(`Error processing current page downloads: ${e}`);
      return [];
    }
  }

  private createDownloadDirectory(): void {
    const downloadDirectory = path.resolve(this.config.downloadDirectory);
    if (!fs.existsSync(downloadDirectory)) {
      fs.mkdirSync(downloadDirectory, { recursive: true });
    }
  }

<<<<<<< HEAD
  private async processSingleFile(file: DownloadedFile): Promise<DownloadedFile> {
    try {
      console.log(`Procesando archivo inmediatamente: ${file.filename}`);
      
      // Check if file is a compressed file that needs extraction
      const ext = path.extname(file.filename).toLowerCase();
      const isCompressed = ['.zip', '.rar'].includes(ext);
      
      if (isCompressed) {
        const result = await this.fileProcessor.processFile(file.downloadPath);
        
        if (result.success) {
          console.log(`Archivo ${file.filename} procesado exitosamente. Extraídos: ${result.processedFiles.length} archivos`);
          return {
            ...file,
            processedFiles: result.processedFiles,
            isProcessed: true
          };
        } else {
          console.error(`Error procesando ${file.filename}: ${result.message}`);
          return {
            ...file,
            isProcessed: false
          };
        }
      } else {
        // For non-compressed files, just mark as processed
        console.log(`Archivo ${file.filename} no requiere descompresión`);
        return {
          ...file,
          isProcessed: true
        };
      }
    } catch (error) {
      console.error(`Error procesando archivo ${file.filename}:`, error);
      return {
        ...file,
        isProcessed: false
      };
    }
  }

=======
  private createExtractionDirectories(): void {
    const downloadDirectory = path.resolve(this.config.downloadDirectory);
    const xmlDirectory = path.join(downloadDirectory, 'XML');
    const pdfDirectory = path.join(downloadDirectory, 'PDF');
    
    if (!fs.existsSync(xmlDirectory)) {
      fs.mkdirSync(xmlDirectory, { recursive: true });
    }
    if (!fs.existsSync(pdfDirectory)) {
      fs.mkdirSync(pdfDirectory, { recursive: true });
    }
  }

  private async extractAndClassifyZip(zipPath: string, documentData: ScrapedDocumentData): Promise<string[]> {
    return new Promise((resolve, reject) => {
      const extractedFiles: string[] = [];
      const downloadDirectory = path.resolve(this.config.downloadDirectory);
      const xmlDirectory = path.join(downloadDirectory, 'XML');
      const pdfDirectory = path.join(downloadDirectory, 'PDF');

      yauzl.open(zipPath, { lazyEntries: true }, (err, zipfile) => {
        if (err) {
          console.error(`Error opening ZIP file ${zipPath}:`, err);
          reject(err);
          return;
        }

        if (!zipfile) {
          reject(new Error('Failed to open ZIP file'));
          return;
        }

        zipfile.readEntry();
        
        zipfile.on('entry', (entry) => {
          if (/\/$/.test(entry.fileName)) {
            // Directory entry, skip
            zipfile.readEntry();
            return;
          }

          zipfile.openReadStream(entry, (err, readStream) => {
            if (err) {
              console.error(`Error reading entry ${entry.fileName}:`, err);
              zipfile.readEntry();
              return;
            }

            if (!readStream) {
              zipfile.readEntry();
              return;
            }

            const fileName = path.basename(entry.fileName);
            const fileExtension = path.extname(fileName).toLowerCase();
            
            let targetDir: string;
            if (fileExtension === '.xml') {
              targetDir = xmlDirectory;
            } else if (fileExtension === '.pdf') {
              targetDir = pdfDirectory;
            } else {
              // Skip files that are not XML or PDF
              console.log(`Skipping file ${fileName} - not XML or PDF`);
              zipfile.readEntry();
              return;
            }

            const targetPath = path.join(targetDir, fileName);
            const writeStream = fs.createWriteStream(targetPath);

            readStream.pipe(writeStream);

            writeStream.on('close', () => {
              extractedFiles.push(targetPath);
              console.log(`Extracted ${fileName} to ${targetDir}`);
              zipfile.readEntry();
            });

            writeStream.on('error', (err) => {
              console.error(`Error writing file ${fileName}:`, err);
              zipfile.readEntry();
            });
          });
        });

        zipfile.on('end', () => {
          console.log(`Finished extracting ZIP file ${zipPath}. Extracted ${extractedFiles.length} files.`);
          resolve(extractedFiles);
        });

        zipfile.on('error', (err) => {
          console.error(`Error processing ZIP file ${zipPath}:`, err);
          reject(err);
        });
      });
    });
  }
>>>>>>> c668f1ec8ae6c6d136da9d3f879ab4a632208027

  async runScraping(request: ScrapingRequest): Promise<ScrapingResult> {
    try {
      await this.initialize();
      
      if (!this.page) {
        throw new Error('Failed to initialize page');
      }

      // Update config with request data
      // The token should be just the token value, not the full URL
      this.config.tokenUrl = `https://catalogo-vpfe.dian.gov.co/User/AuthToken?pk=10910094%7C70322015&rk=900698993&token=${request.token}`;
      this.config.startDate = request.startDate;
      this.config.endDate = request.endDate;

      this.createDownloadDirectory();
      this.createExtractionDirectories();

      // Navigate to token URL
      console.log('Ingresando al portal de la DIAN.');
      await this.page.goto(this.config.tokenUrl);
      await this.page.waitForTimeout(this.config.timeouts.pageLoad);
      await this.closeMenuIfPresent();
      console.log('Autenticado con la DIAN satisfactoriamente.');

      // Navigate to documents page
      console.log('Navigating to documents page...');
      const currentUrl = this.page.url();
      const newUrl = currentUrl.replace(/\/$/, '') + '/Document/Received';
      await this.page.goto(newUrl);
      await this.page.waitForTimeout(this.config.timeouts.longDelay);
      await this.closeMenuIfPresent();
      console.log('Navegando a la pagina de documentos descarganos');

      // Set date range if provided
      if (this.config.startDate && this.config.endDate) {
        console.log(`Setting date range: ${this.config.startDate} to ${this.config.endDate}`);
        await this.page.click(this.config.selectors.dateRangePicker);
        await this.page.waitForTimeout(this.config.timeouts.mediumDelay);
        await this.closeMenuIfPresent();

        const startDateInput = this.page.locator(this.config.selectors.startDateInput);
        await startDateInput.fill(this.config.startDate);
        await this.closeMenuIfPresent();

        const endDateInput = this.page.locator(this.config.selectors.endDateInput);
        await endDateInput.fill(this.config.endDate);
        await this.closeMenuIfPresent();
        console.log('Seleccionando el rango de fechas.');
      }

      // Click sender code
      
      await this.page.click(this.config.selectors.senderCode);
      await this.page.waitForTimeout(this.config.timeouts.mediumDelay);
      await this.closeMenuIfPresent();

      // Submit form
      console.log('Buscando los documentos.');
      const submitButton = this.page.locator(this.config.selectors.submitButton);
      if (await submitButton.count() > 0) {
        await submitButton.click();
        
        await this.page.waitForTimeout(this.config.timeouts.mediumDelay * 2);
        await this.closeMenuIfPresent();

        console.log("Esperando que la tabla de facturas se cargue.");
        await this.page.waitForSelector(this.config.selectors.tbody, { 
          timeout: this.config.timeouts.tableWait 
        });
        console.log("Los documentos se han cargado correctamente.");
        await this.page.waitForTimeout(this.config.timeouts.mediumDelay * 2);

        // Select 100 records per page after the table loads
        await this.selectRecordsPerPage();
      } else {
        throw new Error("Se ha encontrado un error al buscar los documentos.");
      }

      await this.page.waitForTimeout(this.config.timeouts.pageLoad);
      await this.closeMenuIfPresent();

<<<<<<< HEAD
      // Process downloads (with immediate processing)
      console.log('Iniciando el proceso de descarga de los documentos.');
      const downloadedFiles = await this.processTbodyDownloads();
      console.log(`Proceso de descarga completado. Total de archivos: ${downloadedFiles.length}`);
=======
      // Process page by page: map -> download (with filters) -> save to DB -> next page
      console.log('Starting page-by-page processing...');
      let totalMappedDocuments = 0;
      let totalDownloadedFiles: DownloadedFile[] = [];
      let currentPage = 1;

      while (true) {
        try {
          console.log(`\n=== PROCESSING PAGE ${currentPage} ===`);
          
          // Step 1: Map current page data (documents are saved to database immediately during mapping)
          console.log(`Step 1: Mapping page ${currentPage} data...`);
          const pageDocuments = await this.mapCurrentPageData();
          console.log(`Mapped and saved ${pageDocuments.length} documents from page ${currentPage}.`);
          totalMappedDocuments += pageDocuments.length;
          
          // Step 2: Download files from current page (with filters)
          console.log(`Step 2: Downloading files from page ${currentPage} (with filters)...`);
          const pageDownloadedFiles = await this.processCurrentPageDownloads(pageDocuments);
          totalDownloadedFiles = totalDownloadedFiles.concat(pageDownloadedFiles);
          console.log(`Downloaded ${pageDownloadedFiles.length} files from page ${currentPage}. Total downloaded: ${totalDownloadedFiles.length}`);
          
          // Step 3: Check if there's a next page
          console.log(`Step 3: Checking for next page...`);
          const hasNext = await this.hasNextPage();
          
          if (!hasNext) {
            console.log('No more pages to process. Finished all pages.');
            break;
          }
          
          // Step 4: Smart wait before moving to next page
          console.log(`Step 4: Smart wait before moving to page ${currentPage + 1}...`);
          await this.smartWaitForPageLoad(pageDocuments.length);
          
          // Step 5: Go to next page
          console.log(`Step 5: Moving to page ${currentPage + 1}...`);
          const movedToNext = await this.goToNextPage();
          
          if (!movedToNext) {
            console.log('Failed to move to next page. Stopping process.');
            break;
          }
          
          currentPage++;
          console.log(`Successfully moved to page ${currentPage}.`);
          
        } catch (error) {
          console.error(`Error processing page ${currentPage}: ${error}`);
          break;
        }
      }

      console.log(`\n=== PROCESSING COMPLETED ===`);
      console.log(`Total pages processed: ${currentPage}`);
      console.log(`Total documents mapped: ${totalMappedDocuments}`);
      console.log(`Total files downloaded: ${totalDownloadedFiles.length}`);
>>>>>>> c668f1ec8ae6c6d136da9d3f879ab4a632208027

      // Count processed files by type (files are already processed)
      const totalProcessedFiles = downloadedFiles.reduce((total, file) => {
        return total + (file.processedFiles?.length || 0);
      }, 0);
      
      const xmlCount = downloadedFiles.reduce((total, file) => {
        return total + (file.processedFiles?.filter(f => f.fileType === 'xml').length || 0);
      }, 0);
      
      const pdfCount = downloadedFiles.reduce((total, file) => {
        return total + (file.processedFiles?.filter(f => f.fileType === 'pdf').length || 0);
      }, 0);

      return {
        success: true,
<<<<<<< HEAD
        message: `Se han descargado ${downloadedFiles.length} archivos y procesado ${totalProcessedFiles} archivos (${xmlCount} XML, ${pdfCount} PDF)`,
        downloadedFiles
=======
        message: `Processed ${currentPage} pages, mapped ${totalMappedDocuments} documents and downloaded ${totalDownloadedFiles.length} files`,
        downloadedFiles: totalDownloadedFiles
>>>>>>> c668f1ec8ae6c6d136da9d3f879ab4a632208027
      };

    } catch (error) {
      console.error(`Error en el proceso de descarga de los documentos: ${error}`);
      return {
        success: false,
        message: `Error en el proceso de descarga de los documentos: ${error instanceof Error ? error.message : 'Unknown error'}`,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    } finally {
      await this.close();
    }
  }
}