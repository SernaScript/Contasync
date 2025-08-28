import WebScraper, { ScrapingResult } from './WebScraper';
import * as XLSX from 'xlsx';
import { Pool } from 'pg';
import path from 'path';
import fs from 'fs/promises';

export interface FlypassCredentials {
  nit: string;
  password: string;
  startDate: string; // YYYY-MM-DD format
  endDate: string;   // YYYY-MM-DD format
}

export interface FacturaData {
  nit: string;
  fecha_factura?: string;
  numero_factura: string;
  valor_factura: number;
  estado: string;
  descripcion?: string;
  fecha_vencimiento?: string;
  raw_data?: string;
  [key: string]: any; // Para campos adicionales del Excel
}

// Configuración de PostgreSQL con Supabase
function cleanPassword(connectionString: string): string {
  return connectionString.replace(/\[([^\]]+)\]/g, '$1');
}

const dbConfig = {
  connectionString: cleanPassword(process.env.DATABASE_URL || 'postgresql://postgres.qeblzfldprvwxjscajlh:Nutabe*2020@aws-1-us-east-2.pooler.supabase.com:5432/postgres'),
  ssl: {
    rejectUnauthorized: false
  }
};

export class FlypassScraper {
  private scraper: WebScraper;
  private downloadPath: string;

  constructor() {
    this.downloadPath = path.join(process.cwd(), 'downloads');
    this.scraper = new WebScraper({
      browserType: 'chromium',
      headless: false, // Cambiar a true en producción
      timeout: 30000,
      downloadPath: this.downloadPath
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
      const downloadedFile = await this.downloadResults();
      
      // PASO 8: Procesar el archivo Excel
      console.log('📊 Procesando archivo Excel...');
      const processedData = await this.processExcelFile(downloadedFile, credentials.nit);
      
      // PASO 9: Insertar datos en PostgreSQL
      console.log('💾 Guardando en base de datos...');
      const insertedCount = await this.saveToDatabase(processedData);
      
      return {
        success: true,
        message: `Scraping completado exitosamente. ${insertedCount} registros guardados en la base de datos.`,
        data: {
          nit: credentials.nit,
          dateRange: `${credentials.startDate} - ${credentials.endDate}`,
          downloadTime: new Date().toISOString(),
          fileName: downloadedFile,
          recordsProcessed: processedData.length,
          recordsInserted: insertedCount
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

  private async downloadResults(): Promise<string> {
    await this.scraper.click('i[title="Descargar Listado"]');
    return await this.scraper.waitForDownload();
  }

  private async processExcelFile(filePath: string, nit: string): Promise<FacturaData[]> {
    try {
      console.log(`📖 Leyendo archivo Excel: ${filePath}`);
      
      // Leer el archivo Excel
      const workbook = XLSX.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      
      // Convertir a JSON
      const rawData = XLSX.utils.sheet_to_json(worksheet);
      
      console.log(`📊 Registros encontrados en Excel: ${rawData.length}`);
      
      // Procesar y mapear los datos
      const processedData: FacturaData[] = rawData
        .map((row: any) => this.mapExcelRowToFactura(row, nit))
        .filter((item): item is FacturaData => item !== null); // Type guard para filtrar nulls
      
      console.log(`✅ Registros procesados válidos: ${processedData.length}`);
      
      return processedData;
      
    } catch (error) {
      console.error('❌ Error procesando archivo Excel:', error);
      throw new Error(`Error procesando Excel: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  private mapExcelRowToFactura(row: any, nit: string): FacturaData | null {
    try {
      // Mapear los campos del Excel a nuestra estructura
      // Ajustar estos campos según la estructura real del Excel de Flypass
      return {
        nit: nit,
        fecha_factura: this.parseDate(row['Fecha'] || row['Fecha Factura'] || row['Date']),
        numero_factura: row['Número'] || row['Numero Factura'] || row['Number'] || '',
        valor_factura: this.parseNumber(row['Valor'] || row['Total'] || row['Amount'] || 0),
        estado: row['Estado'] || row['Status'] || 'Pendiente',
        descripcion: row['Descripción'] || row['Description'] || '',
        fecha_vencimiento: this.parseDate(row['Vencimiento'] || row['Due Date']),
        // Datos adicionales del Excel
        raw_data: JSON.stringify(row)
      };
    } catch (error) {
      console.warn('⚠️ Error mapeando fila:', row, error);
      return null;
    }
  }

  private parseDate(dateValue: any): string | undefined {
    if (!dateValue) return undefined;
    
    try {
      // Si es un número de serie de Excel
      if (typeof dateValue === 'number') {
        const excelDate = new Date((dateValue - 25569) * 86400 * 1000);
        return excelDate.toISOString().split('T')[0];
      }
      
      // Si es string, intentar parsearlo
      if (typeof dateValue === 'string') {
        const parsed = new Date(dateValue);
        if (!isNaN(parsed.getTime())) {
          return parsed.toISOString().split('T')[0];
        }
      }
      
      return undefined;
    } catch {
      return undefined;
    }
  }

  private parseNumber(value: any): number {
    if (typeof value === 'number') return value;
    if (typeof value === 'string') {
      // Remover caracteres no numéricos excepto punto y coma
      const cleaned = value.replace(/[^\d.,-]/g, '');
      return parseFloat(cleaned.replace(',', '.')) || 0;
    }
    return 0;
  }

  private async saveToDatabase(facturas: FacturaData[]): Promise<number> {
    const pool = new Pool(dbConfig);
    let insertedCount = 0;
    
    try {
      // Crear tabla si no existe
      await this.createTableIfNotExists(pool);
      
      // Insertar facturas una por una (o usar batch insert para mejor performance)
      for (const factura of facturas) {
        try {
          const query = `
            INSERT INTO facturas (
              nit, fecha_factura, numero_factura, valor_factura, 
              estado, descripcion, fecha_vencimiento, raw_data, 
              created_at, updated_at
            ) VALUES (
              $1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW()
            )
            ON CONFLICT (nit, numero_factura) 
            DO UPDATE SET 
              valor_factura = EXCLUDED.valor_factura,
              estado = EXCLUDED.estado,
              descripcion = EXCLUDED.descripcion,
              fecha_vencimiento = EXCLUDED.fecha_vencimiento,
              raw_data = EXCLUDED.raw_data,
              updated_at = NOW()
          `;
          
          await pool.query(query, [
            factura.nit,
            factura.fecha_factura,
            factura.numero_factura,
            factura.valor_factura,
            factura.estado,
            factura.descripcion,
            factura.fecha_vencimiento,
            factura.raw_data || null
          ]);
          
          insertedCount++;
          
        } catch (error) {
          console.error('❌ Error insertando factura:', factura.numero_factura, error);
        }
      }
      
      console.log(`✅ ${insertedCount} facturas guardadas en la base de datos`);
      
    } catch (error) {
      console.error('❌ Error en base de datos:', error);
      throw error;
    } finally {
      await pool.end();
    }
    
    return insertedCount;
  }

  private async createTableIfNotExists(pool: Pool): Promise<void> {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS facturas (
        id SERIAL PRIMARY KEY,
        nit VARCHAR(20) NOT NULL,
        fecha_factura DATE,
        numero_factura VARCHAR(50) NOT NULL,
        valor_factura DECIMAL(15,2) DEFAULT 0,
        estado VARCHAR(50) DEFAULT 'Pendiente',
        descripcion TEXT,
        fecha_vencimiento DATE,
        raw_data JSONB,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW(),
        UNIQUE(nit, numero_factura)
      );
      
      CREATE INDEX IF NOT EXISTS idx_facturas_nit ON facturas(nit);
      CREATE INDEX IF NOT EXISTS idx_facturas_fecha ON facturas(fecha_factura);
      CREATE INDEX IF NOT EXISTS idx_facturas_estado ON facturas(estado);
    `;
    
    await pool.query(createTableQuery);
    console.log('✅ Tabla facturas verificada/creada');
  }
}

// Función helper para usar en el API route
export async function executeFlypassScraping(credentials: FlypassCredentials): Promise<ScrapingResult> {
  const scraper = new FlypassScraper();
  return await scraper.scrapeFlypass(credentials);
}
