import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const providers = await (prisma as any).provider.findMany({
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({
      success: true,
      data: { providers }
    });

  } catch (error) {
    console.error('Error obteniendo proveedores:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Error interno del servidor',
      details: error instanceof Error ? error.message : 'Error desconocido'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validar datos requeridos
    if (!body.identification || !body.name) {
      return NextResponse.json({
        success: false,
        error: 'El NIT y el nombre son requeridos'
      }, { status: 400 });
    }

    // Crear el proveedor
    const provider = await (prisma as any).provider.create({
      data: {
        siigoId: body.siigoId || `manual-${Date.now()}`, // ID manual si no viene de Siigo
        type: body.type || 'Customer',
        personType: body.personType || 'Person',
        idTypeCode: body.idTypeCode || '',
        idTypeName: body.idTypeName || '',
        identification: body.identification,
        name: body.name,
        active: body.active !== false,
        isMigrated: body.isMigrated || false,
        migrationDate: body.isMigrated ? new Date() : null,
        createdBy: body.createdBy || 'manual'
      }
    });

    return NextResponse.json({
      success: true,
      data: { provider },
      message: 'Proveedor creado exitosamente'
    });

  } catch (error) {
    console.error('Error creando proveedor:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Error interno del servidor',
      details: error instanceof Error ? error.message : 'Error desconocido'
    }, { status: 500 });
  }
}
