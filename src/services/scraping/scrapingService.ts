import { chromium, Page, Browser, BrowserContext } from 'playwright';
import fs from 'fs';
import path from 'path';
import { ScrapingConfig, defaultScrapingConfig } from './config';
import { ScrapingRequest, ScrapingResult, DownloadedFile, ScrapingProgress } from './types';

export class ScrapingService {
  private config: ScrapingConfig;
  private browser: Browser | null = null;
  private context: BrowserContext | null = null;
  private page: Page | null = null;

  constructor(config?: Partial<ScrapingConfig>) {
    this.config = { ...defaultScrapingConfig, ...config };
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
            
            // Check Emisor field (column 8) - Skip if contains "F2X S.A.S."
            const emisorCell = row.locator(this.config.selectors.emisorColumn);
            let emisorText = '';
            
            if (await emisorCell.count() > 0) {
              emisorText = await emisorCell.textContent() || '';
              console.log(`Emisor in row ${i + 1}: "${emisorText.trim()}"`);
              
              if (emisorText.includes('F2X S.A.S.')) {
                console.log(`Skipping row ${i + 1} - Emisor is F2X S.A.S.`);
                continue;
              }
            } else {
              console.log(`Emisor field not found in row ${i + 1}`);
            }
            
            // Check Application response field (column 6) - Skip if contains "Application response"
            const responseCell = row.locator(this.config.selectors.responseColumn);
            let responseText = '';
            
            if (await responseCell.count() > 0) {
              responseText = await responseCell.textContent() || '';
              console.log(`Response in row ${i + 1}: "${responseText.trim()}"`);
              
              if (responseText.includes('Application response')) {
                console.log(`Skipping row ${i + 1} - Contains Application response`);
                continue;
              }
            } else {
              console.log(`Response field not found in row ${i + 1}`);
            }
            
            const downloadButton = row.locator(this.config.selectors.downloadButton);

            if (await downloadButton.count() > 0) {
              const downloadPromise = this.page.waitForEvent('download');
              await downloadButton.click();
              console.log(`Clicked download button in row ${i + 1} - Emisor: "${emisorText.trim()}", Response: "${responseText.trim()}"`);

              const download = await downloadPromise;
              const filename = download.suggestedFilename();
              const downloadPath = path.join(this.config.downloadDirectory, filename);
              
              await download.saveAs(downloadPath);
              console.log(`Descargando el archivo: ${filename} en ${this.config.downloadDirectory}`);
              
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

      // Process downloads
      console.log('Iniciando el proceso de descarga de los documentos.');
      const downloadedFiles = await this.processTbodyDownloads();
      console.log(`Proceso de descarga completado. Total de archivos: ${downloadedFiles.length}`);

      return {
        success: true,
        message: `Se han descargado ${downloadedFiles.length} archivos`,
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
