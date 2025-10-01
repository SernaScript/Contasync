import { chromium, Browser, BrowserContext, Page } from 'playwright';
import fs from 'fs';
import path from 'path';

export interface WebScraperOptions {
  browserType?: 'chromium' | 'firefox' | 'webkit';
  headless?: boolean;
  timeout?: number;
  downloadDirectory?: string;
}

export class WebScraper {
  protected browser: Browser | null = null;
  protected context: BrowserContext | null = null;
  protected page: Page | null = null;
  protected options: Required<WebScraperOptions>;

  constructor(options: WebScraperOptions = {}) {
    this.options = {
      browserType: options.browserType || 'chromium',
      headless: options.headless !== false, // Default to true
      timeout: options.timeout || 30000,
      downloadDirectory: options.downloadDirectory || './downloads'
    };

    // Crear directorio de descargas si no existe
    if (!fs.existsSync(this.options.downloadDirectory)) {
      fs.mkdirSync(this.options.downloadDirectory, { recursive: true });
    }
  }

  async initialize(): Promise<void> {
    try {
      console.log('Inicializando navegador...');
      
      this.browser = await chromium.launch({
        headless: this.options.headless,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });

      this.context = await this.browser.newContext({
        acceptDownloads: true,
        viewport: { width: 1280, height: 720 }
      });

      this.page = await this.context.newPage();
      
      // Configurar timeout
      this.page.setDefaultTimeout(this.options.timeout);
      
      console.log('Navegador inicializado correctamente');
    } catch (error) {
      console.error('Error inicializando navegador:', error);
      throw new Error(`Error inicializando navegador: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  async navigateTo(url: string): Promise<void> {
    if (!this.page) {
      throw new Error('Navegador no inicializado');
    }

    try {
      console.log(`Navegando a: ${url}`);
      await this.page.goto(url, { waitUntil: 'networkidle' });
      console.log('Navegación completada');
    } catch (error) {
      console.error(`Error navegando a ${url}:`, error);
      throw new Error(`Error navegando a ${url}: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  async fillInput(selector: string, value: string): Promise<void> {
    if (!this.page) {
      throw new Error('Navegador no inicializado');
    }

    try {
      console.log(`Llenando campo ${selector} con valor: ${value.substring(0, 10)}...`);
      await this.page.fill(selector, value);
      console.log('Campo llenado correctamente');
    } catch (error) {
      console.error(`Error llenando campo ${selector}:`, error);
      throw new Error(`Error llenando campo ${selector}: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  async clickButton(selector: string): Promise<void> {
    if (!this.page) {
      throw new Error('Navegador no inicializado');
    }

    try {
      console.log(`Haciendo clic en botón: ${selector}`);
      await this.page.click(selector);
      console.log('Clic realizado correctamente');
    } catch (error) {
      console.error(`Error haciendo clic en ${selector}:`, error);
      throw new Error(`Error haciendo clic en ${selector}: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  async waitForElement(selector: string, timeout?: number): Promise<void> {
    if (!this.page) {
      throw new Error('Navegador no inicializado');
    }

    try {
      console.log(`Esperando elemento: ${selector}`);
      await this.page.waitForSelector(selector, { timeout: timeout || this.options.timeout });
      console.log('Elemento encontrado');
    } catch (error) {
      console.error(`Error esperando elemento ${selector}:`, error);
      throw new Error(`Error esperando elemento ${selector}: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  async takeScreenshot(filename?: string): Promise<string> {
    if (!this.page) {
      throw new Error('Navegador no inicializado');
    }

    try {
      const screenshotName = filename || `screenshot-${Date.now()}.png`;
      const screenshotPath = path.join(this.options.downloadDirectory, screenshotName);
      
      console.log(`Tomando captura de pantalla: ${screenshotPath}`);
      await this.page.screenshot({ path: screenshotPath, fullPage: true });
      console.log('Captura de pantalla guardada');
      
      return screenshotPath;
    } catch (error) {
      console.error('Error tomando captura de pantalla:', error);
      throw new Error(`Error tomando captura de pantalla: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  async downloadFile(selector: string): Promise<string> {
    if (!this.page) {
      throw new Error('Navegador no inicializado');
    }

    try {
      console.log(`Iniciando descarga desde: ${selector}`);
      
      // Configurar el listener de descarga antes de hacer clic
      const downloadPromise = this.page.waitForEvent('download');
      
      // Hacer clic en el elemento que inicia la descarga
      await this.page.click(selector);
      
      // Esperar a que se complete la descarga
      const download = await downloadPromise;
      const filename = download.suggestedFilename();
      const downloadPath = path.join(this.options.downloadDirectory, filename);
      
      // Guardar el archivo
      await download.saveAs(downloadPath);
      
      console.log(`Archivo descargado: ${filename} en ${downloadPath}`);
      return downloadPath;
    } catch (error) {
      console.error(`Error descargando archivo desde ${selector}:`, error);
      throw new Error(`Error descargando archivo: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  async close(): Promise<void> {
    try {
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
      
      console.log('Navegador cerrado correctamente');
    } catch (error) {
      console.error('Error cerrando navegador:', error);
      // No lanzar error aquí para evitar problemas de limpieza
    }
  }

  // Método para obtener el estado actual del navegador
  isInitialized(): boolean {
    return this.browser !== null && this.context !== null && this.page !== null;
  }

  // Método para obtener la página actual
  getPage(): Page | null {
    return this.page;
  }
}
