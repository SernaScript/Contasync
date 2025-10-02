import { NextRequest, NextResponse } from 'next/server';
import { FlypassScraper } from '@/lib/FlypassScraper';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validar campos requeridos
    const { nit, password, startDate, endDate } = body;
    
    if (!nit || !password || !startDate || !endDate) {
      return NextResponse.json({
        success: false,
        message: 'Todos los campos son requeridos: NIT, contraseña, fecha inicial y fecha final',
        error: 'Missing required fields'
      }, { status: 400 });
    }

    // Validar formato de fechas
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return NextResponse.json({
        success: false,
        message: 'Formato de fecha inválido. Use YYYY-MM-DD',
        error: 'Invalid date format'
      }, { status: 400 });
    }

    // Validar que la fecha inicial no sea mayor que la final
    if (start > end) {
      return NextResponse.json({
        success: false,
        message: 'La fecha inicial no puede ser mayor que la fecha final',
        error: 'Invalid date range'
      }, { status: 400 });
    }

    // Validar que el rango no exceda 1 año
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays > 365) {
      return NextResponse.json({
        success: false,
        message: 'El rango de fechas no puede exceder 365 días',
        error: 'Date range too large'
      }, { status: 400 });
    }

    console.log(`Starting F2X scraping for NIT: ${nit}, dates: ${startDate} to ${endDate}`);

    // Inicializar el scraper de Flypass
    const flypassScraper = new FlypassScraper();
    
    // Ejecutar el scraping
    const result = await flypassScraper.scrapeInvoices({
      nit,
      password,
      startDate,
      endDate
    });

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'Scraping de F2X completado exitosamente. Archivo descargado.',
        data: {
          nit,
          dateRange: `${startDate} - ${endDate}`,
          downloadTime: new Date().toISOString(),
          downloadedFile: result.downloadedFile
        }
      });
    } else {
      return NextResponse.json({
        success: false,
        message: result.message || 'Error durante el scraping de F2X',
        error: result.error
      }, { status: 500 });
    }

  } catch (error) {
    console.error('F2X Scraping API error:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Error interno del servidor durante el proceso de scraping F2X',
      error: error instanceof Error ? error.message : 'Error desconocido'
    }, { status: 500 });
  }
}
