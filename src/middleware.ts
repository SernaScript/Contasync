// Next.js middleware for authentication and authorization

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

// JWT Configuration
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production'
)

// Public routes that don't require authentication
const PUBLIC_ROUTES = [
  '/',
  '/login',
  '/api/auth/login',
  '/api/auth/logout'
]

// Routes that require specific permissions
const PROTECTED_ROUTES: Record<string, { resource: string; action: string }> = {
  '/dashboard': { resource: 'dashboard', action: 'VIEW' },
  '/settings': { resource: 'settings', action: 'VIEW' },
  '/users': { resource: 'users', action: 'VIEW' },
  '/reports': { resource: 'reports', action: 'VIEW' },
  '/database': { resource: 'database', action: 'VIEW' },
}

// Area-specific route patterns
const AREA_ROUTE_PATTERNS = [
  { pattern: /^\/areas\/accounting(\/.*)?$/, areaId: 'accounting' },
  { pattern: /^\/areas\/treasury(\/.*)?$/, areaId: 'treasury' },
  { pattern: /^\/areas\/logistics(\/.*)?$/, areaId: 'logistics' },
  { pattern: /^\/areas\/billing(\/.*)?$/, areaId: 'billing' }
]

// Module-specific route patterns
const MODULE_ROUTE_PATTERNS = [
  { pattern: /^\/areas\/accounting\/automatizacion-f2x$/, areaId: 'accounting', moduleId: 'f2x-automation' },
  { pattern: /^\/areas\/accounting\/reconciliation$/, areaId: 'accounting', moduleId: 'reconciliation' },
  { pattern: /^\/areas\/treasury\/portfolio$/, areaId: 'treasury', moduleId: 'portfolio' }
]

// Admin-only routes
const ADMIN_ROUTES = [
  '/settings/permissions',
  '/settings/roles',
  '/settings/users'
]

// Super admin-only routes
const SUPER_ADMIN_ROUTES = [
  '/settings/system'
]

// JWT utilities for middleware (no Prisma dependency)
const getTokenFromRequest = (request: NextRequest): string | null => {
  // Try to get token from Authorization header
  const authHeader = request.headers.get('authorization')
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7)
  }

  // Try to get token from cookie
  const tokenCookie = request.cookies.get('auth-token')
  return tokenCookie?.value || null
}

const verifyToken = async (token: string): Promise<{ userId: string } | null> => {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    return { userId: payload.userId as string }
  } catch (error) {
    console.error('Token verification failed:', error)
    return null
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  console.log(`🔒 Middleware processing: ${pathname}`)

  // Skip middleware for static files and API routes (except auth)
  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/api/') && !pathname.startsWith('/api/auth') ||
    pathname.includes('.') // Static files
  ) {
    return NextResponse.next()
  }

  // Allow public routes
  if (PUBLIC_ROUTES.includes(pathname)) {
    console.log(`✅ Public route allowed: ${pathname}`)
    return NextResponse.next()
  }

  // Check for auth token
  const token = getTokenFromRequest(request)
  
  if (!token) {
    console.log(`❌ No auth token found for: ${pathname}`)
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Verify token without database call (JWT verification only)
  try {
    const payload = await verifyToken(token)
    if (!payload) {
      console.log(`❌ Invalid token for: ${pathname}`)
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }
    console.log(`✅ Token verified for: ${pathname}`)
  } catch (error) {
    console.log(`❌ Token verification failed for: ${pathname}`)
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // For now, we only verify JWT token in middleware
  // Role-based permissions will be checked in the actual pages/components
  console.log(`✅ Access granted to: ${pathname}`)
  return NextResponse.next()
}

// Configure which routes the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}

