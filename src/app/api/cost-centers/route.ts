import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const costCenters = await prisma.costCenter.findMany({
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({
      success: true,
      data: { costCenters }
    });
  } catch (error) {
    console.error('Error fetching cost centers:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error interno del servidor al obtener los centros de costo' 
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code, name, description, isActive, createdBy } = body;

    // Validaciones básicas
    if (!code || !name || !description || !createdBy) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Código, nombre, descripción y creado por son requeridos' 
        },
        { status: 400 }
      );
    }

    // Verificar que el código no exista
    const existingCostCenter = await prisma.costCenter.findFirst({
      where: { code }
    });

    if (existingCostCenter) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Ya existe un centro de costo con este código' 
        },
        { status: 409 }
      );
    }

    const costCenter = await prisma.costCenter.create({
      data: {
        code,
        name,
        description,
        isActive: isActive ?? true,
        createdBy
      }
    });

    return NextResponse.json({
      success: true,
      data: { costCenter },
      message: 'Centro de costo creado exitosamente'
    });
  } catch (error) {
    console.error('Error creating cost center:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error interno del servidor al crear el centro de costo' 
      },
      { status: 500 }
    );
  }
}
