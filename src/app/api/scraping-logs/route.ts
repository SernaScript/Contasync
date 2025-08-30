import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const nit = searchParams.get('nit');
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    
    // Construir filtros
    const whereClause: any = {};
    
    if (nit) {
      whereClause.companyNit = nit;
    }
    
    if (status) {
      whereClause.status = status;
    }
    
    // Ejecutar consulta con paginación
    const [logs, totalCount] = await Promise.all([
      prisma.scrapingLog.findMany({
        where: whereClause,
        orderBy: {
          createdAt: 'desc'
        },
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.scrapingLog.count({
        where: whereClause
      })
    ]);
    
    return NextResponse.json({
      success: true,
      data: {
        logs,
        pagination: {
          page,
          limit,
          totalCount,
          totalPages: Math.ceil(totalCount / limit)
        }
      }
    });
    
  } catch (error) {
    console.error('❌ Error consultando logs:', error);
    
    return NextResponse.json(
      { 
        success: false,
        error: 'Error consultando logs de scraping',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const logId = searchParams.get('id');
    const olderThan = searchParams.get('olderThan'); // Días
    
    if (logId) {
      // Eliminar log específico
      await prisma.scrapingLog.delete({
        where: { id: logId }
      });
      
      return NextResponse.json({
        success: true,
        message: 'Log eliminado exitosamente'
      });
    }
    
    if (olderThan) {
      // Eliminar logs antiguos
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - parseInt(olderThan));
      
      const deleteResult = await prisma.scrapingLog.deleteMany({
        where: {
          createdAt: {
            lt: cutoffDate
          }
        }
      });
      
      return NextResponse.json({
        success: true,
        message: `${deleteResult.count} logs eliminados`,
        data: { deletedCount: deleteResult.count }
      });
    }
    
    return NextResponse.json(
      { error: 'Se requiere ID del log o parámetro olderThan' },
      { status: 400 }
    );
    
  } catch (error) {
    console.error('❌ Error eliminando logs:', error);
    
    return NextResponse.json(
      { 
        success: false,
        error: 'Error eliminando logs',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    );
  }
}
