import { chromium, Page, Browser, BrowserContext } from 'playwright';
import fs from 'fs';
import path from 'path';
import { PrismaClient } from '@prisma/client';
import { ScrapingConfig, defaultScrapingConfig } from './config';
import { ScrapingRequest, ScrapingResult, DownloadedFile, ScrapingProgress, ScrapedDocumentData } from './types';

export class ScrapingService {
  private config: ScrapingConfig;
  private browser: Browser | null = null;
  private context: BrowserContext | null = null;
  private page: Page | null = null;
  private prisma: PrismaClient;

  constructor(config?: Partial<ScrapingConfig>) {
    this.config = { ...defaultScrapingConfig, ...config };
    this.prisma = new PrismaClient();
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

  private async mapTableData(): Promise<ScrapedDocumentData[]> {
    if (!this.page) throw new Error('Page not initialized');

    const mappedDocuments: ScrapedDocumentData[] = [];
    let currentPage = 1;

    while (true) {
      try {
        await this.page.waitForSelector(this.config.selectors.tbody, { 
          timeout: this.config.timeouts.elementWait 
        });
        console.log("Mapping table data...");

        const rows = await this.page.locator(this.config.selectors.tableRows).all();
        console.log(`Found ${rows.length} rows to map.`);

        for (let i = 0; i < rows.length; i++) {
          const row = rows[i];
          try {
            console.log(`Mapping row ${i + 1}...`);
            
            // Map all table columns
            const documentData: ScrapedDocumentData = {
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

            mappedDocuments.push(documentData);
            console.log(`Mapped document: ${documentData.documentNumber} - ${documentData.senderName}`);
          } catch (e) {
            console.error(`Error mapping row ${i + 1}: ${e}`);
            continue;
          }
        }

        // Check if there's a next page
        const nextButton = this.page.locator(this.config.selectors.nextButton);
        const isNextDisabled = await nextButton.getAttribute('class');
        
        if (isNextDisabled?.includes('disabled') || !(await nextButton.isVisible())) {
          console.log("No more pages to map.");
          break;
        }

        // Go to next page
        console.log(`Going to page ${currentPage + 1}...`);
        await nextButton.click();
        await this.page.waitForTimeout(this.config.timeouts.longDelay);
        currentPage++;
        
      } catch (e) {
        console.error(`Error mapping page ${currentPage}: ${e}`);
        break;
      }
    }

    console.log(`Total documents mapped: ${mappedDocuments.length}`);
    return mappedDocuments;
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

  private async saveDocumentsToDatabase(documents: ScrapedDocumentData[]): Promise<void> {
    try {
      console.log(`Saving ${documents.length} documents to database...`);
      
      for (const doc of documents) {
        await (this.prisma as any).scrapedDocument.create({
          data: {
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
          }
        });
      }
      
      console.log(`Successfully saved ${documents.length} documents to database.`);
    } catch (error) {
      console.error('Error saving documents to database:', error);
      throw error;
    }
  }

  private shouldSkipDocument(documentData: ScrapedDocumentData): boolean {
    // Filter 1: Skip if sender name contains "F2X S.A.S."
    if (documentData.senderName?.includes('F2X S.A.S.')) {
      console.log(`Filtered out - Sender is F2X S.A.S.: ${documentData.senderName}`);
      return true;
    }

    // Filter 2: Skip if result contains "Application response"
    if (documentData.result?.includes('Application response')) {
      console.log(`Filtered out - Contains Application response: ${documentData.result}`);
      return true;
    }

    return false;
  }

  private async updateDocumentAsDownloaded(documentData: ScrapedDocumentData, downloadPath: string): Promise<void> {
    try {
      await (this.prisma as any).scrapedDocument.updateMany({
        where: {
          documentNumber: documentData.documentNumber,
          senderName: documentData.senderName
        },
        data: {
          isDownloaded: true,
          downloadPath: downloadPath,
          downloadDate: new Date()
        }
      });
    } catch (error) {
      console.error('Error updating document as downloaded:', error);
    }
  }

  private async processTbodyDownloads(): Promise<DownloadedFile[]> {
    if (!this.page) throw new Error('Page not initialized');

    const downloadedFiles: DownloadedFile[] = [];
    let currentPage = 1;

    while (true) {
      try {
        await this.page.waitForSelector(this.config.selectors.tbody, { 
          timeout: this.config.timeouts.elementWait 
        });
        console.log("tbody detected.");

        const rows = await this.page.locator(this.config.selectors.tableRows).all();
        console.log(`Found ${rows.length} rows.`);

        for (let i = 0; i < rows.length; i++) {
          const row = rows[i];
          try {
            console.log(`Processing row ${i + 1}...`);
            
            // Get document data for filtering
            const documentData: ScrapedDocumentData = {
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

            // Apply filters
            if (this.shouldSkipDocument(documentData)) {
              console.log(`Skipping row ${i + 1} - Document filtered out`);
              continue;
            }
            
            const downloadButton = row.locator(this.config.selectors.downloadButton);

            if (await downloadButton.count() > 0) {
              const downloadPromise = this.page.waitForEvent('download');
              await downloadButton.click();
              console.log(`Clicked download button in row ${i + 1} - Document: ${documentData.documentNumber} - Sender: ${documentData.senderName}`);

              const download = await downloadPromise;
              const filename = download.suggestedFilename();
              const downloadPath = path.join(this.config.downloadDirectory, filename);
              
              await download.saveAs(downloadPath);
              console.log(`Downloading file: ${filename} to ${this.config.downloadDirectory}`);
              
              // Update database record
              await this.updateDocumentAsDownloaded(documentData, downloadPath);
              
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

        // Pagination logic
        const nextButton = this.page.locator(this.config.selectors.nextButton);
        if (await nextButton.count() > 0) {
          const buttonClass = await nextButton.getAttribute("class");
          if (!buttonClass || !buttonClass.includes("disabled")) {
            await nextButton.click();
            await this.page.waitForTimeout(this.config.timeouts.longDelay);
            await this.closeMenuIfPresent();
            currentPage++;
            console.log(`Navigating to page ${currentPage}...`);
            continue;
          } else {
            console.log("Next button is disabled. No more pages.");
            break;
          }
        } else {
          console.log("Pagination button '#tableDocuments_next' not found.");
          break;
        }
      } catch (e) {
        console.error(`General error in processTbodyDownloads: ${e}`);
        break;
      }
    }

    return downloadedFiles;
  }

  private createDownloadDirectory(): void {
    const downloadDirectory = path.resolve(this.config.downloadDirectory);
    if (!fs.existsSync(downloadDirectory)) {
      fs.mkdirSync(downloadDirectory, { recursive: true });
    }
  }

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
      } else {
        throw new Error("Se ha encontrado un error al buscar los documentos.");
      }

      await this.page.waitForTimeout(this.config.timeouts.pageLoad);
      await this.closeMenuIfPresent();

      // First, map all table data and save to database
      console.log('Starting table data mapping...');
      const mappedDocuments = await this.mapTableData();
      console.log(`Mapped ${mappedDocuments.length} documents from table.`);
      
      // Save documents to database
      await this.saveDocumentsToDatabase(mappedDocuments);
      console.log('All documents saved to database successfully.');

      // Process downloads with filtering
      console.log('Starting filtered download process...');
      const downloadedFiles = await this.processTbodyDownloads();
      console.log(`Download process completed. Total files: ${downloadedFiles.length}`);

      return {
        success: true,
        message: `Mapped ${mappedDocuments.length} documents and downloaded ${downloadedFiles.length} files`,
        downloadedFiles
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
