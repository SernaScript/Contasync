import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

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
          error: 'ID de la regla es requerido' 
        },
        { status: 400 }
      );
    }

    // Verificar que la regla existe
    const existingRule = await prisma.accountingRule.findUnique({
      where: { id }
    });

    if (!existingRule) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Regla contable no encontrada' 
        },
        { status: 404 }
      );
    }

    // Eliminar la regla
    await prisma.accountingRule.delete({
      where: { id }
    });

    return NextResponse.json({
      success: true,
      message: 'Regla contable eliminada exitosamente'
    });
  } catch (error) {
    console.error('Error deleting accounting rule:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error interno del servidor al eliminar la regla contable' 
      },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'ID de la regla es requerido' 
        },
        { status: 400 }
      );
    }

    const rule = await prisma.accountingRule.findUnique({
      where: { id }
    });

    if (!rule) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Regla contable no encontrada' 
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: { rule }
    });
  } catch (error) {
    console.error('Error fetching accounting rule:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error interno del servidor al obtener la regla contable' 
      },
      { status: 500 }
    );
  }
}
