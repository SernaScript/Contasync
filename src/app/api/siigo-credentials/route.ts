import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { encrypt, decrypt, encryptIfNeeded, decryptIfNeeded } from '@/lib/encryption';

// GET - Obtener credenciales SIIGO
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const includeRealKey = searchParams.get('includeRealKey') === 'true';

    const credentials = await prisma.siigoCredentials.findFirst({
      where: {
        isActive: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    if (!credentials) {
      return NextResponse.json({
        success: true,
        data: {
          credentials: null
        }
      });
    }

    // Si se solicita la clave real (para edición), descifrarla
    const responseCredentials = includeRealKey 
      ? {
          ...credentials,
          accessKey: credentials.accessKey ? decryptIfNeeded(credentials.accessKey) : ''
        }
      : {
          ...credentials,
          accessKey: credentials.accessKey ? '••••••••••••••••••••••••••••••••' : ''
        };

    return NextResponse.json({
      success: true,
      data: {
        credentials: responseCredentials
      }
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Error interno del servidor'
    }, { status: 500 });
  }
}

// POST - Crear nuevas credenciales SIIGO
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { apiUser, accessKey, applicationType } = body;

    // Validaciones
    if (!apiUser || !accessKey || !applicationType) {
      return NextResponse.json({
        success: false,
        error: 'Todos los campos son requeridos'
      }, { status: 400 });
    }

    // Desactivar credenciales existentes
    await prisma.siigoCredentials.updateMany({
      where: {
        isActive: true
      },
      data: {
        isActive: false
      }
    });

    // Crear nuevas credenciales con accessKey cifrada
    const newCredentials = await prisma.siigoCredentials.create({
      data: {
        apiUser,
        accessKey: encrypt(accessKey),
        applicationType,
        isActive: true
      }
    });

    // Ocultar la access key para seguridad
    const safeCredentials = {
      ...newCredentials,
      accessKey: '••••••••••••••••••••••••••••••••'
    };

    return NextResponse.json({
      success: true,
      data: {
        credentials: safeCredentials
      }
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Error interno del servidor'
    }, { status: 500 });
  }
}

// PUT - Actualizar credenciales SIIGO existentes
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, apiUser, accessKey, applicationType } = body;

    if (!id) {
      return NextResponse.json({
        success: false,
        error: 'ID de credenciales requerido'
      }, { status: 400 });
    }

    // Verificar que las credenciales existen
    const existingCredentials = await prisma.siigoCredentials.findUnique({
      where: { id }
    });

    if (!existingCredentials) {
      return NextResponse.json({
        success: false,
        error: 'Credenciales no encontradas'
      }, { status: 404 });
    }

    // Preparar datos para actualizar
    const updateData: any = {};
    if (apiUser !== undefined) updateData.apiUser = apiUser;
    if (accessKey !== undefined) updateData.accessKey = encrypt(accessKey);
    if (applicationType !== undefined) updateData.applicationType = applicationType;

    // Actualizar credenciales
    const updatedCredentials = await prisma.siigoCredentials.update({
      where: { id },
      data: updateData
    });

    // Ocultar la access key para seguridad
    const safeCredentials = {
      ...updatedCredentials,
      accessKey: '••••••••••••••••••••••••••••••••'
    };

    return NextResponse.json({
      success: true,
      data: {
        credentials: safeCredentials
      }
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Error interno del servidor'
    }, { status: 500 });
  }
}
