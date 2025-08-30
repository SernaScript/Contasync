import { NextRequest, NextResponse } from 'next/server';
import { processDownloadedExcel } from '@/lib/ExcelProcessor';

export async function POST(request: NextRequest) {
  try {
    const { nit, startDate, endDate, fileName } = await request.json();
    
    // Validar parámetros requeridos
    if (!nit || !startDate || !endDate) {
      return NextResponse.json(
        { error: 'NIT, fecha de inicio y fecha final son requeridos' },
        { status: 400 }
      );
    }
    
    console.log(`🗄️ Iniciando procesamiento de Excel para NIT: ${nit}`);
    
    // Procesar el archivo Excel
    const result = await processDownloadedExcel(
      nit,
      new Date(startDate),
      new Date(endDate)
    );
    
    console.log(`✅ Procesamiento completado: ${result.processedRecords}/${result.totalRecords} registros`);
    
    return NextResponse.json({
      success: true,
      message: `Procesamiento completado exitosamente`,
      data: result
    });
    
  } catch (error) {
    console.error('❌ Error procesando Excel:', error);
    
    return NextResponse.json(
      { 
        success: false,
        error: 'Error procesando archivo Excel',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'API para procesar archivos Excel de facturas',
    endpoints: {
      POST: 'Procesar archivo Excel a la base de datos',
      parameters: {
        nit: 'NIT de la empresa',
        startDate: 'Fecha de inicio (YYYY-MM-DD)',
        endDate: 'Fecha final (YYYY-MM-DD)',
        fileName: 'Nombre del archivo (opcional)'
      }
    }
  });
}
