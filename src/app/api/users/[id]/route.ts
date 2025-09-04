import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, email, isActive } = body;

    // Validar que el usuario existe
    const existingUser = await prisma.user.findUnique({
      where: { id }
    });

    if (!existingUser) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Usuario no encontrado' 
        },
        { status: 404 }
      );
    }

    // Validar email único si se está cambiando
    if (email && email !== existingUser.email) {
      const emailExists = await prisma.user.findFirst({
        where: { 
          email,
          id: { not: id }
        }
      });

      if (emailExists) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'El email ya está en uso por otro usuario' 
          },
          { status: 400 }
        );
      }
    }

    // Actualizar el usuario
    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(email && { email }),
        ...(typeof isActive === 'boolean' && { isActive })
      },
      include: {
        role: {
          select: {
            id: true,
            name: true,
            displayName: true,
            description: true
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      data: {
        user: updatedUser
      }
    });

  } catch (error) {
    console.error('Error actualizando usuario:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error interno del servidor' 
      },
      { status: 500 }
    );
  }
}
