import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; partyId: string } }
) {
  try {
    const { id, partyId } = params;

    if (!id || !partyId) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'ID de la regla y ID del tercero son requeridos' 
        },
        { status: 400 }
      );
    }

    // Verificar que el tercero excluido existe y pertenece a la regla
    const existingParty = await prisma.excludedThirdParty.findFirst({
      where: { 
        id: partyId,
        accountingRuleId: id
      }
    });

    if (!existingParty) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Tercero excluido no encontrado' 
        },
        { status: 404 }
      );
    }

    // Eliminar el tercero excluido
    await prisma.excludedThirdParty.delete({
      where: { id: partyId }
    });

    return NextResponse.json({
      success: true,
      message: 'Tercero excluido eliminado exitosamente'
    });
  } catch (error) {
    console.error('Error deleting excluded third party:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error interno del servidor al eliminar el tercero excluido' 
      },
      { status: 500 }
    );
  }
}
