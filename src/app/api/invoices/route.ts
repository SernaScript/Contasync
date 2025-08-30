import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const nit = searchParams.get('nit');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const status = searchParams.get('status');
    
    // Construir filtros
    const whereClause: any = {};
    
    if (nit) {
      whereClause.company = {
        nit: nit
      };
    }
    
    if (startDate && endDate) {
      whereClause.issueDate = {
        gte: new Date(startDate),
        lte: new Date(endDate)
      };
    }
    
    if (status) {
      whereClause.status = status;
    }
    
    // Ejecutar consulta con paginación
    const [invoices, totalCount] = await Promise.all([
      prisma.invoice.findMany({
        where: whereClause,
        include: {
          company: {
            select: {
              nit: true,
              name: true
            }
          }
        },
        orderBy: {
          issueDate: 'desc'
        },
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.invoice.count({
        where: whereClause
      })
    ]);
    
    // Calcular totales
    const totals = await prisma.invoice.aggregate({
      where: whereClause,
      _sum: {
        subtotal: true,
        tax: true,
        total: true
      },
      _count: {
        _all: true
      }
    });
    
    return NextResponse.json({
      success: true,
      data: {
        invoices,
        pagination: {
          page,
          limit,
          totalCount,
          totalPages: Math.ceil(totalCount / limit)
        },
        summary: {
          totalInvoices: totals._count._all,
          totalSubtotal: totals._sum.subtotal || 0,
          totalTax: totals._sum.tax || 0,
          totalAmount: totals._sum.total || 0
        }
      }
    });
    
  } catch (error) {
    console.error('❌ Error consultando facturas:', error);
    
    return NextResponse.json(
      { 
        success: false,
        error: 'Error consultando facturas',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action, invoiceId, data } = await request.json();
    
    switch (action) {
      case 'update-status':
        const updatedInvoice = await prisma.invoice.update({
          where: { id: invoiceId },
          data: { status: data.status },
          include: {
            company: {
              select: {
                nit: true,
                name: true
              }
            }
          }
        });
        
        return NextResponse.json({
          success: true,
          message: 'Estado de factura actualizado',
          data: updatedInvoice
        });
        
      case 'bulk-update':
        const { invoiceIds, updateData } = data;
        
        const bulkUpdate = await prisma.invoice.updateMany({
          where: {
            id: {
              in: invoiceIds
            }
          },
          data: updateData
        });
        
        return NextResponse.json({
          success: true,
          message: `${bulkUpdate.count} facturas actualizadas`,
          data: { updatedCount: bulkUpdate.count }
        });
        
      default:
        return NextResponse.json(
          { error: 'Acción no válida' },
          { status: 400 }
        );
    }
    
  } catch (error) {
    console.error('❌ Error en operación POST:', error);
    
    return NextResponse.json(
      { 
        success: false,
        error: 'Error en la operación',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    );
  }
}
