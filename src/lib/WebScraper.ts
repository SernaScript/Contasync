import { Browser, BrowserContext, Page, chromium, firefox, webkit } from 'playwright';
import path from 'path';

export interface WebScraperConfig {
  browserType?: 'chromium' | 'firefox' | 'webkit';
  headless?: boolean;
  timeout?: number;
  downloadPath?: string;
}

export interface ScrapingResult {
  success: boolean;
  message: string;
  data?: any;
  error?: string;
}

export default class WebScraper {
  private browser: Browser | null = null;
  private context: BrowserContext | null = null;
  public page: Page | null = null;
  private config: WebScraperConfig;

  constructor(config: WebScraperConfig = {}) {
    this.config = {
      browserType: config.browserType || 'chromium',
      headless: config.headless !== undefined ? config.headless : true,
      timeout: config.timeout || 30000,
      downloadPath: config.downloadPath
    };
  }

  async init(): Promise<void> {
    try {
      console.log('📱 Inicializando navegador...');
      
      switch (this.config.browserType) {
        case 'firefox':
          this.browser = await firefox.launch({ headless: this.config.headless });
          break;
        case 'webkit':
          this.browser = await webkit.launch({ headless: this.config.headless });
          break;
        default:
          this.browser = await chromium.launch({ headless: this.config.headless });
      }

      // Configurar contexto con directorio de descarga si se especifica
      const contextOptions: any = {};
      if (this.config.downloadPath) {
        contextOptions.acceptDownloads = true;
        // Crear el directorio si no existe
        const fs = require('fs');
        if (!fs.existsSync(this.config.downloadPath)) {
          fs.mkdirSync(this.config.downloadPath, { recursive: true });
        }
      }

      this.context = await this.browser.newContext(contextOptions);
      this.page = await this.context.newPage();
      
      // Configurar timeout por defecto
      this.page.setDefaultTimeout(this.config.timeout!);
      
      console.log('✅ Navegador inicializado correctamente');
    } catch (error) {
      console.error('❌ Error inicializando navegador:', error);
      throw error;
    }
  }

  async navigateTo(url: string): Promise<void> {
    if (!this.page) {
      throw new Error('El navegador no está inicializado. Llama a init() primero.');
    }
    
    console.log(`🌐 Navegando a: ${url}`);
    await this.page.goto(url);
  }

  async waitForSelector(selector: string, timeout?: number): Promise<void> {
    if (!this.page) {
      throw new Error('El navegador no está inicializado.');
    }
    
    await this.page.waitForSelector(selector, { timeout: timeout || this.config.timeout });
  }

  async type(selector: string, text: string): Promise<void> {
    if (!this.page) {
      throw new Error('El navegador no está inicializado.');
    }
    
    await this.page.fill(selector, text);
  }

  async click(selector: string): Promise<void> {
    if (!this.page) {
      throw new Error('El navegador no está inicializado.');
    }
    
    await this.page.click(selector);
  }

  async takeScreenshot(filename: string): Promise<void> {
    if (!this.page) {
      throw new Error('El navegador no está inicializado.');
    }
    
    await this.page.screenshot({ path: filename });
    console.log(`📸 Captura guardada: ${filename}`);
  }

  async waitForDownload(timeout: number = 30000): Promise<string> {
    if (!this.page) {
      throw new Error('El navegador no está inicializado.');
    }

    console.log('⏳ Esperando descarga...');
    
    const download = await this.page.waitForEvent('download', { timeout });
    const filePath = path.join(this.config.downloadPath || './downloads', download.suggestedFilename() || 'download');
    
    await download.saveAs(filePath);
    console.log(`📥 Archivo descargado: ${filePath}`);
    
    return filePath;
  }

  getDownloadPath(): string | undefined {
    return this.config.downloadPath;
  }

  async close(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      console.log('🔒 Navegador cerrado');
    }
  }
}
