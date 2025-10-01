import { WebScraper, WebScraperOptions } from './WebScraper';
import fs from 'fs';
import path from 'path';

export interface FlypassScrapingRequest {
  nit: string;
  password: string;
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
}

export interface FlypassScrapingResult {
  success: boolean;
  message: string;
  downloadedFile?: string;
  error?: string;
}

export class FlypassScraper {
  private scraper: WebScraper;
  private downloadDirectory: string;

  constructor(options?: WebScraperOptions) {
    this.downloadDirectory = options?.downloadDirectory || './downloads/f2x';
    
    // Crear directorio de descargas si no existe
    if (!fs.existsSync(this.downloadDirectory)) {
      fs.mkdirSync(this.downloadDirectory, { recursive: true });
    }

    this.scraper = new WebScraper({
      browserType: 'chromium',
      headless: false, // Mostrar navegador para debugging
      timeout: 30000,
      downloadDirectory: this.downloadDirectory
    });
  }

  async scrapeInvoices(request: FlypassScrapingRequest): Promise<FlypassScrapingResult> {
    try {
      console.log('Iniciando scraping de F2X/Flypass...');
      
      // Inicializar el navegador
      await this.scraper.initialize();

      // Navegar al portal de Flypass
      await this.scraper.navigateTo('https://clientes.flypass.com.co/');

      // Realizar login
      await this.performLogin(request.nit, request.password);

      // Navegar a la sección de facturas
      await this.navigateToInvoices();

      // Configurar filtros de fecha
      await this.configureDateFilters(request.startDate, request.endDate);

      // Ejecutar búsqueda y descargar
      const downloadedFile = await this.downloadInvoices();

      console.log('Scraping de F2X completado exitosamente');
      
      return {
        success: true,
        message: 'Scraping completado exitosamente. Archivo descargado.',
        downloadedFile
      };

    } catch (error) {
      console.error('Error durante scraping de F2X:', error);
      
      // Tomar captura de pantalla para debugging
      try {
        await this.scraper.takeScreenshot(`f2x-error-${Date.now()}.png`);
      } catch (screenshotError) {
        console.error('Error tomando captura de pantalla:', screenshotError);
      }

      return {
        success: false,
        message: `Error durante el scraping: ${error instanceof Error ? error.message : 'Error desconocido'}`,
        error: error instanceof Error ? error.message : 'Error desconocido'
      };
    } finally {
      // Cerrar navegador
      await this.scraper.close();
    }
  }

  private async performLogin(nit: string, password: string): Promise<void> {
    try {
      console.log('Realizando login en Flypass...');

      // Esperar a que aparezca el formulario de login
      await this.scraper.waitForElement('input[name="username"], input[type="text"], #username, #nit');
      
      // Intentar diferentes selectores para el campo NIT
      const nitSelectors = [
        'input[name="username"]',
        'input[name="nit"]',
        'input[name="document"]',
        '#username',
        '#nit',
        '#document',
        'input[placeholder*="NIT"]',
        'input[placeholder*="Documento"]'
      ];

      let nitFieldFound = false;
      for (const selector of nitSelectors) {
        try {
          await this.scraper.fillInput(selector, nit);
          nitFieldFound = true;
          console.log(`Campo NIT llenado con selector: ${selector}`);
          break;
        } catch (error) {
          console.log(`Selector ${selector} no funcionó, intentando siguiente...`);
        }
      }

      if (!nitFieldFound) {
        throw new Error('No se pudo encontrar el campo para ingresar el NIT');
      }

      // Esperar un momento para que se complete el campo
      await this.scraper.getPage()?.waitForTimeout(1000);

      // Intentar diferentes selectores para el campo contraseña
      const passwordSelectors = [
        'input[name="password"]',
        'input[type="password"]',
        '#password',
        'input[placeholder*="contraseña"]',
        'input[placeholder*="password"]'
      ];

      let passwordFieldFound = false;
      for (const selector of passwordSelectors) {
        try {
          await this.scraper.fillInput(selector, password);
          passwordFieldFound = true;
          console.log(`Campo contraseña llenado con selector: ${selector}`);
          break;
        } catch (error) {
          console.log(`Selector ${selector} no funcionó, intentando siguiente...`);
        }
      }

      if (!passwordFieldFound) {
        throw new Error('No se pudo encontrar el campo para ingresar la contraseña');
      }

      // Esperar un momento para que se complete el campo
      await this.scraper.getPage()?.waitForTimeout(1000);

      // Intentar diferentes selectores para el botón de login
      const loginButtonSelectors = [
        'button[type="submit"]',
        'input[type="submit"]',
        'button:has-text("Iniciar")',
        'button:has-text("Login")',
        'button:has-text("Entrar")',
        '.btn-login',
        '#login-button',
        'button[class*="login"]'
      ];

      let loginButtonFound = false;
      for (const selector of loginButtonSelectors) {
        try {
          await this.scraper.clickButton(selector);
          loginButtonFound = true;
          console.log(`Botón de login clickeado con selector: ${selector}`);
          break;
        } catch (error) {
          console.log(`Selector ${selector} no funcionó, intentando siguiente...`);
        }
      }

      if (!loginButtonFound) {
        throw new Error('No se pudo encontrar el botón de login');
      }

      // Esperar a que se complete el login (buscar indicadores de éxito)
      try {
        await this.scraper.waitForElement('a[href*="factura"], a[href*="invoice"], .menu, .dashboard', 10000);
        console.log('Login exitoso');
      } catch (error) {
        // Si no encuentra elementos específicos, esperar un poco más
        await this.scraper.getPage()?.waitForTimeout(3000);
        console.log('Login completado (sin verificación específica)');
      }

    } catch (error) {
      console.error('Error durante login:', error);
      throw new Error(`Error durante login: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  private async navigateToInvoices(): Promise<void> {
    try {
      console.log('Navegando a la sección de facturas...');

      // Intentar diferentes selectores para encontrar la sección de facturas
      const invoiceSelectors = [
        'a[href*="factura"]',
        'a[href*="invoice"]',
        'a:has-text("Facturas")',
        'a:has-text("Invoices")',
        'a:has-text("Documentos")',
        '.menu a:has-text("Facturas")',
        '.nav a:has-text("Facturas")'
      ];

      let invoiceLinkFound = false;
      for (const selector of invoiceSelectors) {
        try {
          await this.scraper.clickButton(selector);
          invoiceLinkFound = true;
          console.log(`Navegación a facturas exitosa con selector: ${selector}`);
          break;
        } catch (error) {
          console.log(`Selector ${selector} no funcionó, intentando siguiente...`);
        }
      }

      if (!invoiceLinkFound) {
        // Si no encuentra enlaces específicos, intentar navegar directamente
        console.log('No se encontró enlace específico, intentando navegación directa...');
        await this.scraper.navigateTo('https://clientes.flypass.com.co/facturas');
      }

      // Esperar a que se cargue la página de facturas
      await this.scraper.getPage()?.waitForTimeout(2000);

    } catch (error) {
      console.error('Error navegando a facturas:', error);
      throw new Error(`Error navegando a facturas: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  private async configureDateFilters(startDate: string, endDate: string): Promise<void> {
    try {
      console.log('Configurando filtros de fecha...');

      // Convertir fechas de YYYY-MM-DD a formato esperado por la interfaz
      const startDateFormatted = this.formatDateForInterface(startDate);
      const endDateFormatted = this.formatDateForInterface(endDate);

      // Intentar diferentes selectores para campos de fecha
      const dateSelectors = [
        'input[name="fecha_inicio"]',
        'input[name="start_date"]',
        'input[name="fechaInicio"]',
        '#fecha_inicio',
        '#start_date',
        'input[type="date"]',
        'input[placeholder*="fecha"]'
      ];

      // Configurar fecha inicial
      let startDateFieldFound = false;
      for (const selector of dateSelectors) {
        try {
          await this.scraper.fillInput(selector, startDateFormatted);
          startDateFieldFound = true;
          console.log(`Fecha inicial configurada con selector: ${selector}`);
          break;
        } catch (error) {
          console.log(`Selector ${selector} no funcionó para fecha inicial, intentando siguiente...`);
        }
      }

      // Configurar fecha final
      let endDateFieldFound = false;
      for (const selector of dateSelectors) {
        try {
          await this.scraper.fillInput(selector, endDateFormatted);
          endDateFieldFound = true;
          console.log(`Fecha final configurada con selector: ${selector}`);
          break;
        } catch (error) {
          console.log(`Selector ${selector} no funcionó para fecha final, intentando siguiente...`);
        }
      }

      // Configurar tipo de documento a "todos"
      const typeSelectors = [
        'select[name="tipo"]',
        'select[name="type"]',
        '#tipo',
        '#type',
        'select[class*="tipo"]'
      ];

      for (const selector of typeSelectors) {
        try {
          await this.scraper.getPage()?.selectOption(selector, 'todos');
          console.log(`Tipo configurado a "todos" con selector: ${selector}`);
          break;
        } catch (error) {
          console.log(`Selector ${selector} no funcionó para tipo, intentando siguiente...`);
        }
      }

      // Esperar un momento para que se apliquen los filtros
      await this.scraper.getPage()?.waitForTimeout(1000);

    } catch (error) {
      console.error('Error configurando filtros:', error);
      throw new Error(`Error configurando filtros: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  private async downloadInvoices(): Promise<string> {
    try {
      console.log('Ejecutando búsqueda y descarga...');

      // Buscar y hacer clic en el botón de búsqueda/consulta
      const searchButtonSelectors = [
        'button:has-text("Buscar")',
        'button:has-text("Consultar")',
        'button:has-text("Filtrar")',
        'input[type="submit"]',
        'button[type="submit"]',
        '.btn-search',
        '.btn-query'
      ];

      let searchButtonFound = false;
      for (const selector of searchButtonSelectors) {
        try {
          await this.scraper.clickButton(selector);
          searchButtonFound = true;
          console.log(`Búsqueda ejecutada con selector: ${selector}`);
          break;
        } catch (error) {
          console.log(`Selector ${selector} no funcionó, intentando siguiente...`);
        }
      }

      if (!searchButtonFound) {
        throw new Error('No se pudo encontrar el botón de búsqueda');
      }

      // Esperar a que se carguen los resultados
      await this.scraper.getPage()?.waitForTimeout(3000);

      // Buscar y hacer clic en el botón de descarga/exportar
      const downloadButtonSelectors = [
        'button:has-text("Descargar")',
        'button:has-text("Exportar")',
        'a:has-text("Descargar")',
        'a:has-text("Exportar")',
        '.btn-download',
        '.btn-export',
        'button[class*="download"]',
        'a[href*="download"]'
      ];

      let downloadButtonFound = false;
      for (const selector of downloadButtonSelectors) {
        try {
          const downloadedFile = await this.scraper.downloadFile(selector);
          downloadButtonFound = true;
          console.log(`Descarga exitosa con selector: ${selector}`);
          return downloadedFile;
        } catch (error) {
          console.log(`Selector ${selector} no funcionó, intentando siguiente...`);
        }
      }

      if (!downloadButtonFound) {
        throw new Error('No se pudo encontrar el botón de descarga');
      }

      throw new Error('Error inesperado durante la descarga');

    } catch (error) {
      console.error('Error durante descarga:', error);
      throw new Error(`Error durante descarga: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  private formatDateForInterface(dateString: string): string {
    // Convertir de YYYY-MM-DD a DD/MM/YYYY
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  }
}
