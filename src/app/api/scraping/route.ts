import { NextRequest, NextResponse } from 'next/server';
import { ScrapingService } from '@/services/scraping/scrapingService';
import { ScrapingRequest } from '@/services/scraping/types';

export async function POST(request: NextRequest) {
  try {
    const body: ScrapingRequest = await request.json();
    
    console.log('Received scraping request:', {
      token: body.token ? `${body.token.substring(0, 10)}...` : 'missing',
      startDate: body.startDate,
      endDate: body.endDate
    });
    
    // Validate required fields
    if (!body.token || !body.startDate || !body.endDate) {
      const missingFields = [];
      if (!body.token) missingFields.push('token');
      if (!body.startDate) missingFields.push('startDate');
      if (!body.endDate) missingFields.push('endDate');
      
      console.log('Missing required fields:', missingFields);
      
      return NextResponse.json({
        success: false,
        message: `Campos requeridos faltantes: ${missingFields.join(', ')}`,
        error: `Missing required fields: ${missingFields.join(', ')}`
      }, { status: 400 });
    }

    // Extract token from URL if it's a full URL
    let actualToken: string = body.token;
    if (body.token.includes('http') && body.token.includes('token=')) {
      try {
        const url = new URL(body.token);
        const extractedToken = url.searchParams.get('token');
        if (!extractedToken) {
          console.log('No token found in URL');
          return NextResponse.json({
            success: false,
            message: 'No se encontró el token en la URL proporcionada',
            error: 'Token not found in URL'
          }, { status: 400 });
        }
        actualToken = extractedToken;
        console.log('Token extracted from URL successfully');
      } catch (error) {
        console.log('Invalid URL format');
        return NextResponse.json({
          success: false,
          message: 'La URL proporcionada no tiene un formato válido',
          error: 'Invalid URL format'
        }, { status: 400 });
      }
    }

    // Validate date format (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(body.startDate) || !dateRegex.test(body.endDate)) {
      console.log('Invalid date format:', { startDate: body.startDate, endDate: body.endDate });
      return NextResponse.json({
        success: false,
        message: 'Las fechas deben estar en formato YYYY-MM-DD',
        error: 'Dates must be in YYYY-MM-DD format'
      }, { status: 400 });
    }

    // Validate date range
    const startDate = new Date(body.startDate);
    const endDate = new Date(body.endDate);
    
    if (startDate > endDate) {
      console.log('Invalid date range:', { startDate: body.startDate, endDate: body.endDate });
      return NextResponse.json({
        success: false,
        message: 'La fecha de inicio debe ser anterior a la fecha de fin',
        error: 'Start date must be before end date'
      }, { status: 400 });
    }

    // Check if date range is not too large (max 1 year)
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays > 365) {
      console.log('Date range too large:', { diffDays });
      return NextResponse.json({
        success: false,
        message: 'El rango de fechas no puede exceder 365 días',
        error: 'Date range cannot exceed 365 days'
      }, { status: 400 });
    }

    console.log(`Starting scraping process for dates: ${body.startDate} to ${body.endDate}`);

    // Initialize scraping service
    const scrapingService = new ScrapingService({
      downloadDirectory: './downloads/scraping-results'
    });

    // Create scraping request with extracted token
    const scrapingRequest = {
      token: actualToken,
      startDate: body.startDate,
      endDate: body.endDate
    };

    // Run scraping
    const result = await scrapingService.runScraping(scrapingRequest);

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: result.message,
        data: {
          downloadedFiles: result.downloadedFiles,
          totalFiles: result.downloadedFiles?.length || 0
        }
      });
    } else {
      return NextResponse.json({
        success: false,
        message: result.message,
        error: result.error
      }, { status: 500 });
    }

  } catch (error) {
    console.error('Scraping API error:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Internal server error during scraping process',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
