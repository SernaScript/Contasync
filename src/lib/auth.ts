// Authentication utilities and helpers

import { NextRequest } from 'next/server'
import { SignJWT, jwtVerify } from 'jose'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { 
  User, 
  Role, 
  Permission, 
  AuthSession, 
  RoleName, 
  PermissionAction,
  AREA_PERMISSIONS_MAP
} from '@/types/auth'

// JWT Configuration
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production'
)
const JWT_EXPIRES_IN = '7d'

// Password utilities
export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 12
  return await bcrypt.hash(password, saltRounds)
}

export const verifyPassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  return await bcrypt.compare(password, hashedPassword)
}

// JWT utilities
export const createToken = async (userId: string): Promise<string> => {
  const token = await new SignJWT({ userId })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(JWT_EXPIRES_IN)
    .sign(JWT_SECRET)
  
  return token
}

export const verifyToken = async (token: string): Promise<{ userId: string } | null> => {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    return { userId: payload.userId as string }
  } catch (error) {
    console.error('Token verification failed:', error)
    return null
  }
}

// Session management
export const createSession = async (userId: string): Promise<AuthSession> => {
  const token = await createToken(userId)
  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + 7) // 7 days

  const session = await prisma.session.create({
    data: {
      userId,
      token,
      expiresAt
    },
    include: {
      user: {
        include: {
          role: {
            include: {
              rolePermissions: {
                include: {
                  permission: true
                }
              }
            }
          }
        }
      }
    }
  })

  return {
    id: session.id,
    userId: session.userId,
    token: session.token,
    expiresAt: session.expiresAt,
    user: transformPrismaUser(session.user)
  }
}

export const getSessionFromToken = async (token: string): Promise<AuthSession | null> => {
  try {
    const session = await prisma.session.findUnique({
      where: { token },
      include: {
        user: {
          include: {
            role: {
              include: {
                rolePermissions: {
                  include: {
                    permission: true
                  }
                }
              }
            }
          }
        }
      }
    })

    if (!session || session.expiresAt < new Date()) {
      if (session) {
        await prisma.session.delete({ where: { id: session.id } })
      }
      return null
    }

    return {
      id: session.id,
      userId: session.userId,
      token: session.token,
      expiresAt: session.expiresAt,
      user: transformPrismaUser(session.user)
    }
  } catch (error) {
    console.error('Error getting session:', error)
    return null
  }
}

export const deleteSession = async (token: string): Promise<void> => {
  try {
    await prisma.session.delete({
      where: { token }
    })
  } catch (error) {
    console.error('Error deleting session:', error)
  }
}

// User utilities
export const getUserById = async (userId: string): Promise<User | null> => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        role: {
          include: {
            rolePermissions: {
              include: {
                permission: true
              }
            }
          }
        }
      }
    })

    return user ? transformPrismaUser(user) : null
  } catch (error) {
    console.error('Error getting user:', error)
    return null
  }
}

export const getUserByEmail = async (email: string): Promise<User | null> => {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        role: {
          include: {
            rolePermissions: {
              include: {
                permission: true
              }
            }
          }
        }
      }
    })

    return user ? transformPrismaUser(user) : null
  } catch (error) {
    console.error('Error getting user by email:', error)
    return null
  }
}

// Permission utilities
export const hasPermission = (
  userPermissions: Permission[],
  resource: string,
  action: PermissionAction
): boolean => {
  return userPermissions.some(
    permission => 
      permission.resource === resource && 
      (permission.action === action || permission.action === PermissionAction.MANAGE)
  )
}

export const canAccessArea = (userPermissions: Permission[], areaId: string): boolean => {
  const areaConfig = AREA_PERMISSIONS_MAP[areaId]
  if (!areaConfig) return false

  return hasPermission(
    userPermissions,
    areaConfig.requiredPermission.resource,
    areaConfig.requiredPermission.action
  )
}

export const canAccessModule = (
  userPermissions: Permission[],
  areaId: string,
  moduleId: string
): boolean => {
  const areaConfig = AREA_PERMISSIONS_MAP[areaId]
  if (!areaConfig) return false

  const moduleConfig = areaConfig.modules.find(m => m.moduleId === moduleId)
  if (!moduleConfig) {
    // If module not configured, check area permission
    return canAccessArea(userPermissions, areaId)
  }

  return hasPermission(
    userPermissions,
    moduleConfig.requiredPermission.resource,
    moduleConfig.requiredPermission.action
  )
}

// Route protection utilities
export const getTokenFromRequest = (request: NextRequest): string | null => {
  // Try to get token from Authorization header
  const authHeader = request.headers.get('authorization')
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7)
  }

  // Try to get token from cookie
  const tokenCookie = request.cookies.get('auth-token')
  return tokenCookie?.value || null
}

export const getUserRole = async (token: string): Promise<RoleName | null> => {
  const session = await getSessionFromToken(token)
  return session?.user.role.name || null
}

// Transform Prisma models to our types
const transformPrismaUser = (prismaUser: any): User => {
  return {
    id: prismaUser.id,
    email: prismaUser.email,
    name: prismaUser.name,
    password: prismaUser.password, // Include password for auth verification
    isActive: prismaUser.isActive,
    lastLogin: prismaUser.lastLogin,
    createdAt: prismaUser.createdAt,
    updatedAt: prismaUser.updatedAt,
    role: {
      id: prismaUser.role.id,
      name: prismaUser.role.name,
      displayName: prismaUser.role.displayName,
      description: prismaUser.role.description,
      isActive: prismaUser.role.isActive,
      permissions: prismaUser.role.rolePermissions.map((rp: any) => ({
        id: rp.permission.id,
        name: rp.permission.name,
        resource: rp.permission.resource,
        action: rp.permission.action,
        description: rp.permission.description
      }))
    }
  }
}

// Authentication middleware helper
export const authenticateRequest = async (request: NextRequest): Promise<User | null> => {
  const token = getTokenFromRequest(request)
  if (!token) return null

  const session = await getSessionFromToken(token)
  if (!session) return null

  // Update last login
  await prisma.user.update({
    where: { id: session.userId },
    data: { lastLogin: new Date() }
  })

  return session.user
}
