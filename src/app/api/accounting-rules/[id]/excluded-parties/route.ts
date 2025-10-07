import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

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

    const excludedParties = await prisma.excludedThirdParty.findMany({
      where: { accountingRuleId: id },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({
      success: true,
      data: { excludedParties }
    });
  } catch (error) {
    console.error('Error fetching excluded third parties:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error interno del servidor al obtener los terceros excluidos' 
      },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { nit, description, isActive, createdBy } = body;

    if (!id) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'ID de la regla es requerido' 
        },
        { status: 400 }
      );
    }

    // Validaciones básicas
    if (!nit || !description || !createdBy) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'NIT, descripción y creado por son requeridos' 
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

    // Verificar que no exista un tercero excluido con este NIT
    const existingParty = await prisma.excludedThirdParty.findFirst({
      where: { nit }
    });

    if (existingParty) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Ya existe un tercero excluido con este NIT' 
        },
        { status: 409 }
      );
    }

    const excludedParty = await prisma.excludedThirdParty.create({
      data: {
        nit,
        description,
        isActive: isActive ?? true,
        createdBy,
        accountingRuleId: id
      }
    });

    return NextResponse.json({
      success: true,
      data: { excludedParty },
      message: 'Tercero excluido creado exitosamente'
    });
  } catch (error) {
    console.error('Error creating excluded third party:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error interno del servidor al crear el tercero excluido' 
      },
      { status: 500 }
    );
  }
}
