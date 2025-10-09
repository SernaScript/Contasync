import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const filePath = searchParams.get('path');
    
    if (!filePath) {
      return NextResponse.json({
        success: false,
        message: 'Ruta del archivo no proporcionada',
        error: 'Missing file path'
      }, { status: 400 });
    }

    // Validar que la ruta esté dentro del directorio de descargas permitido
    const downloadsDir = path.resolve('./downloads');
    const fullPath = path.resolve(filePath);
    
    console.log('Requested filePath for viewing:', filePath);
    console.log('Downloads directory:', downloadsDir);
    console.log('Resolved fullPath:', fullPath);
    
    if (!fullPath.startsWith(downloadsDir)) {
      console.log('Path validation failed - not in downloads directory');
      return NextResponse.json({
        success: false,
        message: 'Ruta de archivo no permitida',
        error: 'Invalid file path'
      }, { status: 403 });
    }

    // Verificar que el archivo existe
    if (!fs.existsSync(fullPath)) {
      console.log('File does not exist at path:', fullPath);
      return NextResponse.json({
        success: false,
        message: 'Archivo no encontrado',
        error: 'File not found'
      }, { status: 404 });
    }

    const stats = fs.statSync(fullPath);
    if (!stats.isFile()) {
      return NextResponse.json({
        success: false,
        message: 'La ruta especificada no es un archivo',
        error: 'Not a file'
      }, { status: 400 });
    }

    // Verificar que es un archivo PDF
    const fileName = path.basename(fullPath);
    const ext = path.extname(fileName).toLowerCase();
    
    if (ext !== '.pdf') {
      return NextResponse.json({
        success: false,
        message: 'Solo se pueden visualizar archivos PDF',
        error: 'Invalid file type'
      }, { status: 400 });
    }

    const fileBuffer = fs.readFileSync(fullPath);

    // Headers específicos para visualización en iframe (sin descarga)
    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Length': fileBuffer.length.toString(),
        'Cache-Control': 'public, max-age=3600', // Cache por 1 hora
        'X-Frame-Options': 'SAMEORIGIN', // Permite iframe desde el mismo origen
        'Content-Security-Policy': "frame-ancestors 'self'", // Permite iframe desde el mismo origen
      },
    });

  } catch (error) {
    console.error('Error viewing PDF:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Error interno del servidor durante la visualización',
      error: error instanceof Error ? error.message : 'Error desconocido'
    }, { status: 500 });
  }
}
