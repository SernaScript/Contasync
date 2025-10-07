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

    const providerMappings = await prisma.providerAccountMapping.findMany({
      where: { accountingRuleId: id },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({
      success: true,
      data: { providerMappings }
    });
  } catch (error) {
    console.error('Error fetching provider mappings:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error interno del servidor al obtener los mapeos de proveedores' 
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
    const { providerNit, providerName, description, accountingAccount, paymentId, isActive, createdBy } = body;

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
    if (!providerNit || !providerName || !description || !accountingAccount || !paymentId || !createdBy) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'NIT del proveedor, nombre, descripción, cuenta de contabilización, ID del pago y creado por son requeridos' 
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

    // Verificar que no exista un mapeo para este proveedor en esta regla
    const existingMapping = await prisma.providerAccountMapping.findFirst({
      where: { 
        providerNit,
        accountingRuleId: id
      }
    });

    if (existingMapping) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Ya existe una asignación para este proveedor en esta regla' 
        },
        { status: 409 }
      );
    }

    const providerMapping = await prisma.providerAccountMapping.create({
      data: {
        providerNit,
        providerName,
        description,
        accountingAccount,
        paymentId,
        isActive: isActive ?? true,
        createdBy,
        accountingRuleId: id
      }
    });

    return NextResponse.json({
      success: true,
      data: { providerMapping },
      message: 'Asignación de proveedor creada exitosamente'
    });
  } catch (error) {
    console.error('Error creating provider mapping:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error interno del servidor al crear la asignación de proveedor' 
      },
      { status: 500 }
    );
  }
}
