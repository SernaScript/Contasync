import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { code, name, description, isActive, updatedBy } = body;

    if (!id) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'ID del centro de costo es requerido' 
        },
        { status: 400 }
      );
    }

    // Validaciones básicas
    if (!code || !name || !description) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Código, nombre y descripción son requeridos' 
        },
        { status: 400 }
      );
    }

    // Verificar que el centro de costo existe
    const existingCostCenter = await prisma.costCenter.findUnique({
      where: { id }
    });

    if (!existingCostCenter) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Centro de costo no encontrado' 
        },
        { status: 404 }
      );
    }

    // Verificar que el código no esté en uso por otro centro de costo
    const codeInUse = await prisma.costCenter.findFirst({
      where: { 
        code,
        id: { not: id }
      }
    });

    if (codeInUse) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Ya existe otro centro de costo con este código' 
        },
        { status: 409 }
      );
    }

    const costCenter = await prisma.costCenter.update({
      where: { id },
      data: {
        code,
        name,
        description,
        isActive: isActive ?? true,
        updatedBy
      }
    });

    return NextResponse.json({
      success: true,
      data: { costCenter },
      message: 'Centro de costo actualizado exitosamente'
    });
  } catch (error) {
    console.error('Error updating cost center:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error interno del servidor al actualizar el centro de costo' 
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'ID del centro de costo es requerido' 
        },
        { status: 400 }
      );
    }

    // Verificar que el centro de costo existe
    const existingCostCenter = await prisma.costCenter.findUnique({
      where: { id }
    });

    if (!existingCostCenter) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Centro de costo no encontrado' 
        },
        { status: 404 }
      );
    }

    await prisma.costCenter.delete({
      where: { id }
    });

    return NextResponse.json({
      success: true,
      message: 'Centro de costo eliminado exitosamente'
    });
  } catch (error) {
    console.error('Error deleting cost center:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error interno del servidor al eliminar el centro de costo' 
      },
      { status: 500 }
    );
  }
}
