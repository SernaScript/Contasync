import { NextRequest, NextResponse } from 'next/server';
import { executeFlypassScraping, FlypassCredentials } from '@/lib/FlypassScraper';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validar que tenemos todos los campos necesarios
    const { nit, password, startDate, endDate } = body;
    
    if (!nit || !password || !startDate || !endDate) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Todos los campos son requeridos: NIT, contraseña, fecha inicial y fecha final' 
        },
        { status: 400 }
      );
    }

    // Validar formato de fechas
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(startDate) || !dateRegex.test(endDate)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Las fechas deben estar en formato YYYY-MM-DD' 
        },
        { status: 400 }
      );
    }

    // Validar que la fecha inicial sea menor que la final
    if (new Date(startDate) > new Date(endDate)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'La fecha inicial debe ser menor que la fecha final' 
        },
        { status: 400 }
      );
    }

    console.log('🚀 Iniciando scraping de Flypass para NIT:', nit);
    
    const credentials: FlypassCredentials = {
      nit,
      password,
      startDate,
      endDate,
      processToDatabase: body.processToDatabase || false
    };

    // Ejecutar el scraping
    const result = await executeFlypassScraping(credentials);
    
    if (result.success) {
      console.log('✅ Scraping completado exitosamente');
      return NextResponse.json(result);
    } else {
      console.error('❌ Error en scraping:', result.error);
      return NextResponse.json(result, { status: 500 });
    }
    
  } catch (error) {
    console.error('❌ Error en API route:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Error interno del servidor',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    );
  }
}

// Método GET para obtener el estado del servicio
export async function GET() {
  return NextResponse.json({
    service: 'Flypass Scraping API',
    status: 'active',
    version: '1.0.0',
    endpoints: {
      POST: '/api/flypass-scraping - Ejecutar scraping con credenciales'
    }
  });
}
