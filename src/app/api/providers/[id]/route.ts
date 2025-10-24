import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { id } = params;
    
    // Validar datos requeridos
    if (!body.identification || !body.name) {
      return NextResponse.json({
        success: false,
        error: 'El NIT y el nombre son requeridos'
      }, { status: 400 });
    }

    // Actualizar el proveedor
    const provider = await (prisma as any).provider.update({
      where: { id },
      data: {
        type: body.type,
        personType: body.personType,
        idTypeCode: body.idTypeCode,
        idTypeName: body.idTypeName,
        identification: body.identification,
        name: body.name,
        active: body.active,
        isMigrated: body.isMigrated,
        updatedBy: body.updatedBy || 'manual'
      }
    });

    return NextResponse.json({
      success: true,
      data: { provider },
      message: 'Proveedor actualizado exitosamente'
    });

  } catch (error) {
    console.error('Error actualizando proveedor:', error);
    
    if (error instanceof Error && error.message.includes('Record to update not found')) {
      return NextResponse.json({
        success: false,
        error: 'Proveedor no encontrado'
      }, { status: 404 });
    }
    
    return NextResponse.json({
      success: false,
      error: 'Error interno del servidor',
      details: error instanceof Error ? error.message : 'Error desconocido'
    }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Verificar si el proveedor tiene facturas asociadas
    const invoicesCount = await (prisma as any).invoice.count({
      where: { providerId: id }
    });

    if (invoicesCount > 0) {
      return NextResponse.json({
        success: false,
        error: `No se puede eliminar el proveedor porque tiene ${invoicesCount} factura(s) asociada(s)`
      }, { status: 400 });
    }

    // Eliminar el proveedor
    await (prisma as any).provider.delete({
      where: { id }
    });

    return NextResponse.json({
      success: true,
      message: 'Proveedor eliminado exitosamente'
    });

  } catch (error) {
    console.error('Error eliminando proveedor:', error);
    
    if (error instanceof Error && error.message.includes('Record to delete does not exist')) {
      return NextResponse.json({
        success: false,
        error: 'Proveedor no encontrado'
      }, { status: 404 });
    }
    
    return NextResponse.json({
      success: false,
      error: 'Error interno del servidor',
      details: error instanceof Error ? error.message : 'Error desconocido'
    }, { status: 500 });
  }
}
