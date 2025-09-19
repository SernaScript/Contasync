import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    const documentNumber = searchParams.get('documentNumber');
    const senderName = searchParams.get('senderName');
    const senderNit = searchParams.get('senderNit');

    const whereConditions: any = {};
    
    if (documentNumber) {
      whereConditions.documentNumber = {
        contains: documentNumber,
        mode: 'insensitive'
      };
    }
    
    if (senderName) {
      whereConditions.senderName = {
        contains: senderName,
        mode: 'insensitive'
      };
    }
    
    if (senderNit) {
      whereConditions.senderNit = {
        contains: senderNit,
        mode: 'insensitive'
      };
    }

    const documents = await (prisma as any).scrapedDocument.findMany({
      where: whereConditions,
      skip,
      take: limit,
      orderBy: {
        createdAt: 'desc'
      }
    });

    const total = await (prisma as any).scrapedDocument.count({
      where: whereConditions
    });

    const mappedDocuments = documents.map((doc: any, index: number) => ({
      id: doc.id,
      documentNumber: doc.documentNumber || `DOC-${index + 1}`,
      date: doc.documentDate || doc.createdAt.toISOString().split('T')[0],
      totalValue: doc.totalValue || '0',
      status: doc.isDownloaded ? 'downloaded' : 'pending',
      senderName: doc.senderName || 'N/A',
      senderNit: doc.senderNit || 'N/A',
      type: doc.documentType || 'Documento',
      downloadPath: doc.downloadPath,
      downloadDate: doc.downloadDate
    }));

    return NextResponse.json({
      success: true,
      data: {
        documents: mappedDocuments,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      }
    });

  } catch (error) {
    console.error('Error fetching scraped documents:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Error al obtener los documentos',
        error: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    );
  }
}
