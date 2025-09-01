// Prisma client configuration

import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Check if we're in Edge Runtime
const isEdgeRuntime = typeof globalThis.EdgeRuntime !== 'undefined'

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  // Edge Runtime specific configuration
  ...(isEdgeRuntime && {
    datasources: {
      db: {
        url: process.env.DATABASE_URL
      }
    }
  })
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// Export a function to check if Prisma is available
export const isPrismaAvailable = () => {
  try {
    return !!prisma
  } catch {
    return false
  }
}