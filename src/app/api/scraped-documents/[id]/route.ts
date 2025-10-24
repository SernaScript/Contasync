import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const documentId = params.id;

    if (!documentId) {
      return NextResponse.json({
        success: false,
        message: 'ID del documento es requerido'
      }, { status: 400 });
    }

    // Buscar el documento por ID
    const document = await prisma.scrapedDocument.findUnique({
      where: {
        id: documentId
      }
    });

    if (!document) {
      return NextResponse.json({
        success: false,
        message: 'Documento no encontrado'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: document
    });

  } catch (error) {
    console.error('Error fetching document:', error);
    return NextResponse.json({
      success: false,
      message: 'Error interno del servidor'
    }, { status: 500 });
  }
}
