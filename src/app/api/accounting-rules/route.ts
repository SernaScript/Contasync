import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const rules = await prisma.accountingRule.findMany({
      orderBy: [
        { priority: 'asc' },
        { createdAt: 'desc' }
      ]
    });

    return NextResponse.json({
      success: true,
      data: { rules }
    });
  } catch (error) {
    console.error('Error fetching accounting rules:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error interno del servidor al obtener las reglas contables' 
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, condition, debitAccount, creditAccount, isActive, priority } = body;

    // Validaciones básicas
    if (!name || !description || !condition || !debitAccount || !creditAccount) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Todos los campos son requeridos' 
        },
        { status: 400 }
      );
    }

    // Verificar que no exista una regla con el mismo nombre
    const existingRule = await prisma.accountingRule.findFirst({
      where: { name }
    });

    if (existingRule) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Ya existe una regla contable con este nombre' 
        },
        { status: 409 }
      );
    }

    const rule = await prisma.accountingRule.create({
      data: {
        name,
        description,
        condition,
        debitAccount,
        creditAccount,
        isActive: isActive ?? true,
        priority: priority ?? 1
      }
    });

    return NextResponse.json({
      success: true,
      data: { rule },
      message: 'Regla contable creada exitosamente'
    });
  } catch (error) {
    console.error('Error creating accounting rule:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error interno del servidor al crear la regla contable' 
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, name, description, condition, debitAccount, creditAccount, isActive, priority } = body;

    // Validaciones básicas
    if (!id) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'ID de la regla es requerido' 
        },
        { status: 400 }
      );
    }

    if (!name || !description || !condition || !debitAccount || !creditAccount) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Todos los campos son requeridos' 
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

    // Verificar que no exista otra regla con el mismo nombre (excluyendo la actual)
    const duplicateRule = await prisma.accountingRule.findFirst({
      where: { 
        name,
        id: { not: id }
      }
    });

    if (duplicateRule) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Ya existe otra regla contable con este nombre' 
        },
        { status: 409 }
      );
    }

    const rule = await prisma.accountingRule.update({
      where: { id },
      data: {
        name,
        description,
        condition,
        debitAccount,
        creditAccount,
        isActive: isActive ?? true,
        priority: priority ?? 1
      }
    });

    return NextResponse.json({
      success: true,
      data: { rule },
      message: 'Regla contable actualizada exitosamente'
    });
  } catch (error) {
    console.error('Error updating accounting rule:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error interno del servidor al actualizar la regla contable' 
      },
      { status: 500 }
    );
  }
}
