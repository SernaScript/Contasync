import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; mappingId: string } }
) {
  try {
    const { id, mappingId } = params;

    if (!id || !mappingId) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'ID de la regla y ID del mapeo son requeridos' 
        },
        { status: 400 }
      );
    }

    // Verificar que el mapeo existe y pertenece a la regla
    const existingMapping = await prisma.providerAccountMapping.findFirst({
      where: { 
        id: mappingId,
        accountingRuleId: id
      }
    });

    if (!existingMapping) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Mapeo de proveedor no encontrado' 
        },
        { status: 404 }
      );
    }

    // Eliminar el mapeo
    await prisma.providerAccountMapping.delete({
      where: { id: mappingId }
    });

    return NextResponse.json({
      success: true,
      message: 'Mapeo de proveedor eliminado exitosamente'
    });
  } catch (error) {
    console.error('Error deleting provider mapping:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error interno del servidor al eliminar el mapeo de proveedor' 
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string; mappingId: string } }
) {
  try {
    const { id, mappingId } = params;
    const body = await request.json();
    const { providerNit, providerName, debitAccount, creditAccount, description, isActive } = body;

    if (!id || !mappingId) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'ID de la regla y ID del mapeo son requeridos' 
        },
        { status: 400 }
      );
    }

    // Validaciones básicas
    if (!providerNit || !debitAccount || !creditAccount) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'NIT del proveedor, cuenta débito y cuenta crédito son requeridos' 
        },
        { status: 400 }
      );
    }

    // Verificar que el mapeo existe y pertenece a la regla
    const existingMapping = await prisma.providerAccountMapping.findFirst({
      where: { 
        id: mappingId,
        accountingRuleId: id
      }
    });

    if (!existingMapping) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Mapeo de proveedor no encontrado' 
        },
        { status: 404 }
      );
    }

    // Verificar que no exista otro mapeo para este proveedor en esta regla (excluyendo el actual)
    const duplicateMapping = await prisma.providerAccountMapping.findFirst({
      where: { 
        providerNit,
        accountingRuleId: id,
        id: { not: mappingId }
      }
    });

    if (duplicateMapping) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Ya existe otro mapeo para este proveedor en esta regla' 
        },
        { status: 409 }
      );
    }

    const providerMapping = await prisma.providerAccountMapping.update({
      where: { id: mappingId },
      data: {
        providerNit,
        providerName: providerName || null,
        debitAccount,
        creditAccount,
        description: description || null,
        isActive: isActive ?? true
      }
    });

    return NextResponse.json({
      success: true,
      data: { providerMapping },
      message: 'Mapeo de proveedor actualizado exitosamente'
    });
  } catch (error) {
    console.error('Error updating provider mapping:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error interno del servidor al actualizar el mapeo de proveedor' 
      },
      { status: 500 }
    );
  }
}
