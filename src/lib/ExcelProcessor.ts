import * as XLSX from 'xlsx';
import { prisma } from './prisma';
import path from 'path';
import fs from 'fs';    

export interface ExcelInvoiceData {
  invoiceNumber: string;
  documentType: string;
  issueDate: Date;
  dueDate?: Date;
  subtotal: number;
  tax: number;
  total: number;
  status: string;
  supplierName?: string;
  supplierNit?: string;
  description?: string;
  observations?: string;
}

export interface ProcessResult {
  success: boolean;
  totalRecords: number;
  processedRecords: number;
  errorRecords: number;
  errors: string[];
  logId: string;
}

export class ExcelProcessor {
  
  /**
   * Procesa un archivo Excel y carga los datos a la base de datos
   */
  async processExcelFile(
    filePath: string, 
    companyNit: string, 
    startDate: Date, 
    endDate: Date
  ): Promise<ProcessResult> {
    const startTime = Date.now();
    let logId = '';
    
    try {
      // Crear log inicial
      const scrapingLog = await prisma.scrapingLog.create({
        data: {
          companyNit,
          startDate,
          endDate,
          status: 'processing',
          fileName: path.basename(filePath),
          message: 'Iniciando procesamiento del archivo Excel'
        }
      });
      
      logId = scrapingLog.id;
      
      // Verificar que el archivo existe
      if (!fs.existsSync(filePath)) {
        throw new Error(`Archivo no encontrado: ${filePath}`);
      }
      
      // Leer el archivo Excel
      console.log('📊 Leyendo archivo Excel...');
      const workbook = XLSX.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      
      // Convertir a JSON
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
      console.log(`📋 Encontrados ${jsonData.length} registros en el Excel`);
      
      // Obtener o crear la empresa
      const company = await this.getOrCreateCompany(companyNit);
      
      // Procesar cada fila
      const errors: string[] = [];
      let processedCount = 0;
      
      for (let i = 0; i < jsonData.length; i++) {
        try {
          const row = jsonData[i] as any;
          const invoiceData = this.parseExcelRow(row, i + 2); // +2 porque Excel empieza en 1 y hay header
          
          // Crear la factura en la base de datos
          await prisma.invoice.create({
            data: {
              ...invoiceData,
              companyId: company.id,
              sourceFile: path.basename(filePath),
            }
          });
          
          processedCount++;
        } catch (error) {
          const errorMsg = `Fila ${i + 2}: ${error instanceof Error ? error.message : 'Error desconocido'}`;
          errors.push(errorMsg);
          console.error(errorMsg);
        }
      }
      
      // Actualizar log final
      const duration = Math.round((Date.now() - startTime) / 1000);
      
      await prisma.scrapingLog.update({
        where: { id: logId },
        data: {
          status: errors.length === 0 ? 'success' : 'partial',
          recordsFound: jsonData.length,
          recordsProcessed: processedCount,
          recordsErrors: errors.length,
          duration,
          errorDetails: errors.length > 0 ? errors.join('\n') : null,
          message: `Procesamiento completado. ${processedCount}/${jsonData.length} registros procesados exitosamente`
        }
      });
      
      return {
        success: errors.length === 0,
        totalRecords: jsonData.length,
        processedRecords: processedCount,
        errorRecords: errors.length,
        errors,
        logId
      };
      
    } catch (error) {
      console.error('❌ Error procesando archivo Excel:', error);
      
      // Actualizar log con error
      if (logId) {
        await prisma.scrapingLog.update({
          where: { id: logId },
          data: {
            status: 'error',
            errorDetails: error instanceof Error ? error.message : 'Error desconocido',
            message: 'Error durante el procesamiento del archivo'
          }
        });
      }
      
      throw error;
    }
  }
  
  /**
   * Parsea una fila del Excel y la convierte al formato de la base de datos
   */
  private parseExcelRow(row: any, rowNumber: number): ExcelInvoiceData {
    try {
      // Mapear los campos del Excel a nuestro modelo
      // NOTA: Estos nombres de columnas pueden cambiar según el formato del Excel de Flypass
      const invoiceData: ExcelInvoiceData = {
        invoiceNumber: this.getStringValue(row['Número de Factura'] || row['No. Factura'] || row['Invoice Number']),
        documentType: this.getStringValue(row['Tipo Documento'] || row['Document Type'] || 'Factura'),
        issueDate: this.getDateValue(row['Fecha Emisión'] || row['Issue Date'] || row['Fecha']) || new Date(),
        dueDate: this.getDateValue(row['Fecha Vencimiento'] || row['Due Date'], true),
        subtotal: this.getNumberValue(row['Subtotal'] || row['Sub Total'] || 0),
        tax: this.getNumberValue(row['IVA'] || row['Tax'] || row['Impuesto'] || 0),
        total: this.getNumberValue(row['Total'] || row['Valor Total'] || 0),
        status: this.mapStatus(row['Estado'] || row['Status'] || 'pending'),
        supplierName: this.getStringValue(row['Proveedor'] || row['Supplier'] || row['Razón Social'], true),
        supplierNit: this.getStringValue(row['NIT Proveedor'] || row['Supplier NIT'] || row['NIT'], true),
        description: this.getStringValue(row['Descripción'] || row['Description'] || row['Concepto'], true),
        observations: this.getStringValue(row['Observaciones'] || row['Observations'] || row['Notas'], true),
      };
      
      // Validar campos requeridos
      if (!invoiceData.invoiceNumber) {
        throw new Error('Número de factura es requerido');
      }
      
      if (!invoiceData.issueDate) {
        throw new Error('Fecha de emisión es requerida');
      }
      
      return invoiceData;
      
    } catch (error) {
      throw new Error(`Error parseando fila ${rowNumber}: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }
  
  /**
   * Obtiene o crea una empresa en la base de datos
   */
  private async getOrCreateCompany(nit: string) {
    let company = await prisma.company.findUnique({
      where: { nit }
    });
    
    if (!company) {
      company = await prisma.company.create({
        data: {
          nit,
          name: `Empresa ${nit}` // Nombre temporal
        }
      });
    }
    
    return company;
  }
  
  /**
   * Utilidades para parsear valores del Excel
   */
  private getStringValue(value: any, optional = false): string {
    if (value === null || value === undefined || value === '') {
      if (optional) return '';
      throw new Error('Valor requerido no encontrado');
    }
    return String(value).trim();
  }
  
  private getNumberValue(value: any): number {
    if (value === null || value === undefined || value === '') {
      return 0;
    }
    
    // Si es string, limpiar formato de moneda
    if (typeof value === 'string') {
      const cleaned = value.replace(/[^\d.-]/g, '');
      return parseFloat(cleaned) || 0;
    }
    
    return Number(value) || 0;
  }
  
  private getDateValue(value: any, optional = false): Date | undefined {
    if (value === null || value === undefined || value === '') {
      if (optional) return undefined;
      throw new Error('Fecha requerida no encontrada');
    }
    
    // Si es un número de Excel (fecha serial)
    if (typeof value === 'number') {
      const excelEpoch = new Date(1900, 0, 1);
      const days = value - 2; // Excel cuenta desde 1900-01-01 pero tiene un bug con 1900
      return new Date(excelEpoch.getTime() + days * 24 * 60 * 60 * 1000);
    }
    
    // Si es string, intentar parsear
    if (typeof value === 'string') {
      const parsed = new Date(value);
      if (isNaN(parsed.getTime())) {
        throw new Error(`Formato de fecha inválido: ${value}`);
      }
      return parsed;
    }
    
    // Si ya es Date
    if (value instanceof Date) {
      return value;
    }
    
    throw new Error(`Tipo de fecha no soportado: ${typeof value}`);
  }
  
  private mapStatus(status: string): string {
    const statusMap: { [key: string]: string } = {
      'pagado': 'paid',
      'pendiente': 'pending',
      'vencido': 'overdue',
      'cancelado': 'cancelled',
      'paid': 'paid',
      'pending': 'pending',
      'overdue': 'overdue',
      'cancelled': 'cancelled'
    };
    
    return statusMap[status.toLowerCase()] || 'pending';
  }
}

// Función helper para usar en API routes
export async function processDownloadedExcel(
  companyNit: string,
  startDate: Date,
  endDate: Date,
  downloadDir = 'downloads'
): Promise<ProcessResult> {
  const processor = new ExcelProcessor();
  
  // Buscar el archivo más reciente en el directorio de descargas
  const downloadsPath = path.join(process.cwd(), downloadDir);
  
  if (!fs.existsSync(downloadsPath)) {
    throw new Error(`Directorio de descargas no encontrado: ${downloadsPath}`);
  }
  
  const files = fs.readdirSync(downloadsPath)
    .filter(file => file.endsWith('.xlsx') || file.endsWith('.xls'))
    .map(file => ({
      name: file,
      path: path.join(downloadsPath, file),
      stats: fs.statSync(path.join(downloadsPath, file))
    }))
    .sort((a, b) => b.stats.mtime.getTime() - a.stats.mtime.getTime());
  
  if (files.length === 0) {
    throw new Error('No se encontraron archivos Excel en el directorio de descargas');
  }
  
  const latestFile = files[0];
  console.log(`📄 Procesando archivo: ${latestFile.name}`);
  
  return await processor.processExcelFile(latestFile.path, companyNit, startDate, endDate);
}
