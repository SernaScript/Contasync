import WebScraper, { ScrapingResult } from './WebScraper';
import { processDownloadedExcel, ProcessResult } from './ExcelProcessor';

export interface FlypassCredentials {
  nit: string;
  password: string;
  startDate: string; // YYYY-MM-DD format
  endDate: string;   // YYYY-MM-DD format
  processToDatabase?: boolean; // Nueva opción para procesar automáticamente a la BD
}

export class FlypassScraper {
  private scraper: WebScraper;

  constructor() {
    this.scraper = new WebScraper({
      browserType: 'chromium',
      headless: false, // Cambiar a true en producción
      timeout: 30000
    });
  }

  async scrapeFlypass(credentials: FlypassCredentials): Promise<ScrapingResult> {
    console.log('🚀 Iniciando scraper de Flypass...');
    
    try {
      // PASO 1: Inicializar el navegador
      console.log('📱 Inicializando navegador...');
      await this.scraper.init();
      
      // PASO 2: Ir a la página de Flypass
      console.log('🌐 Navegando a Flypass...');
      this.scraper.navigateTo('https://clientes.flypass.com.co/');
      
      // PASO 3: Esperar y llenar el formulario de login
      await this.scraper.waitForSelector('input[name="username"]');
      await this.scraper.waitForSelector('input[name="password"]');

      console.log('✍️ Llenando credenciales...');
      await this.scraper.type('input[name="username"]', credentials.nit);
      await this.scraper.type('input[name="password"]', credentials.password);
      
      // PASO 4: Intentar hacer login con diferentes selectores
      console.log('🔐 Intentando hacer login...');
      await this.attemptLogin();
      
      console.log('✅ Login realizado con éxito!');
      
      // PASO 5: Navegar a la sección de facturas
      console.log('⏳ Esperando que cargue la página principal...');
      await this.navigateToInvoices();
      
      // PASO 6: Configurar filtros de búsqueda
      console.log('🔧 Configurando filtros de búsqueda...');
      await this.configureSearchFilters(credentials.startDate, credentials.endDate);
      
      // PASO 7: Descargar resultados
      console.log('📥 Iniciando descarga...');
      await this.downloadResults();
      
      // PASO 8: Esperar a que termine la descarga
      console.log('⏳ Esperando descarga...');
      await new Promise(resolve => setTimeout(resolve, 30000));
      
      // PASO 9: Procesar a la base de datos si está habilitado
      let processResult: ProcessResult | undefined;
      if (credentials.processToDatabase) {
        console.log('🗄️ Procesando archivo a la base de datos...');
        try {
          processResult = await processDownloadedExcel(
            credentials.nit,
            new Date(credentials.startDate),
            new Date(credentials.endDate)
          );
          console.log(`✅ Procesamiento completado: ${processResult.processedRecords}/${processResult.totalRecords} registros`);
        } catch (dbError) {
          console.error('❌ Error procesando a la base de datos:', dbError);
          // No fallar el scraping, solo reportar el error
        }
      }
      
      return {
        success: true,
        message: credentials.processToDatabase 
          ? `Scraping y procesamiento completados. ${processResult?.processedRecords || 0} registros guardados en la base de datos.`
          : 'Scraping completado exitosamente. Archivo descargado.',
        data: {
          nit: credentials.nit,
          dateRange: `${credentials.startDate} - ${credentials.endDate}`,
          downloadTime: new Date().toISOString(),
          databaseProcessing: processResult ? {
            totalRecords: processResult.totalRecords,
            processedRecords: processResult.processedRecords,
            errorRecords: processResult.errorRecords,
            logId: processResult.logId
          } : undefined
        }
      };
      
    } catch (error) {
      console.error('❌ Error en el scraper:', error);
      
      // Tomar captura de pantalla para debug
      try {
        await this.scraper.takeScreenshot(`error-debug-${Date.now()}.png`);
      } catch (screenshotError) {
        console.error('No se pudo tomar captura de pantalla:', screenshotError);
      }
      
      return {
        success: false,
        message: 'Error durante el scraping',
        error: error instanceof Error ? error.message : 'Error desconocido'
      };
      
    } finally {
      // Siempre cerrar el navegador
      await this.scraper.close();
    }
  }

  private async attemptLogin(): Promise<void> {
    try {
      // Intento 1: Buscar por ID
      await this.scraper.waitForSelector('#btnEnterpriseLoginLogin', 5000);
      console.log('✅ Botón encontrado con ID!');
      await this.scraper.click('#btnEnterpriseLoginLogin');
      return;
    } catch (error1) {
      console.log('❌ No se encontró con ID, probando con type=submit...');
      
      try {
        // Intento 2: Buscar por type=submit
        await this.scraper.waitForSelector('button[type="submit"]', 5000);
        console.log('✅ Botón encontrado con type=submit!');
        await this.scraper.click('button[type="submit"]');
        return;
      } catch (error2) {
        console.log('❌ No se encontró con type=submit, probando con texto...');
        
        try {
          // Intento 3: Buscar por texto
          await this.scraper.waitForSelector('button:has-text("sesión")', 5000);
          console.log('✅ Botón encontrado con texto!');
          await this.scraper.click('button:has-text("sesión")');
          return;
        } catch (error3) {
          console.log('❌ No se pudo encontrar el botón de ninguna manera');
          console.log('📸 Tomando captura para debug...');
          await this.scraper.takeScreenshot('debug-no-se-encuentra-boton.png');
          throw new Error('No se pudo encontrar el botón de login');
        }
      }
    }
  }

  private async navigateToInvoices(): Promise<void> {
    // Cancelar cualquier modal que aparezca
    try {
      await this.scraper.click('button:has-text("Cancelar")');
    } catch {
      // No hacer nada si no hay modal
    }
    
    // Navegar a facturas
    await this.scraper.click('button:has-text("Facturas")');
    await this.scraper.click('a:has-text("Consulta tus facturas")');
    await this.scraper.click('#consolidatedInform');

    console.log('🔄 Esperando nueva ventana...');
    await this.scraper.page!.waitForTimeout(2000);

    // Cambiar a la nueva ventana si existe
    const pages = await this.scraper.page!.context().pages();
    console.log(`📊 Ventanas abiertas: ${pages.length}`);

    if (pages.length > 1) {
      const nuevaVentana = pages[pages.length - 1];
      this.scraper.page = nuevaVentana;
      
      console.log('✅ Cambiado a la nueva ventana!');
      console.log(`🌐 URL nueva ventana: ${await this.scraper.page.url()}`);
    } else {
      console.log('ℹ️ No se detectó nueva ventana, continuando...');
    }

    await this.scraper.page!.waitForLoadState('networkidle');
  }

  private async configureSearchFilters(startDate: string, endDate: string): Promise<void> {
    // Configurar tipo de documento
    await this.scraper.waitForSelector('#docGLTipo', 10000);
    await this.scraper.page!.selectOption('#docGLTipo', 'todos');
    
    // Configurar fechas
    await this.scraper.type('input[title="Fecha Inicial"]', startDate);
    await this.scraper.type('input[title="Fecha Final"]', endDate);
    
    // Ejecutar búsqueda
    await this.scraper.waitForSelector('i[title="Buscar"]', 10000);
    await this.scraper.click('i[title="Buscar"]');
  }

  private async downloadResults(): Promise<void> {
    await this.scraper.click('i[title="Descargar Listado"]');
  }
}

// Función helper para usar en el API route
export async function executeFlypassScraping(credentials: FlypassCredentials): Promise<ScrapingResult> {
  const scraper = new FlypassScraper();
  return await scraper.scrapeFlypass(credentials);
}
