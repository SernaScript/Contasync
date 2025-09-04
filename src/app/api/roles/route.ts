import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    // Obtener roles con sus permisos
    const roles = await prisma.role.findMany({
      where: {
        isActive: true
      },
      include: {
        rolePermissions: {
          include: {
            permission: {
              select: {
                id: true,
                name: true,
                resource: true,
                action: true,
                description: true
              }
            }
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    });

    // Transformar la respuesta para que sea más fácil de usar en el frontend
    const transformedRoles = roles.map(role => ({
      id: role.id,
      name: role.name,
      displayName: role.displayName,
      description: role.description,
      isActive: role.isActive,
      permissions: role.rolePermissions.map(rp => rp.permission)
    }));

    return NextResponse.json({
      success: true,
      data: {
        roles: transformedRoles
      }
    });

  } catch (error) {
    console.error('Error obteniendo roles:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error interno del servidor' 
      },
      { status: 500 }
    );
  }
}
