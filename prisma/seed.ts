// Prisma seed script for initial data

import { PrismaClient } from '@prisma/client'
import { RoleName, PermissionAction } from '../src/types/auth'
import { hashPassword } from '../src/lib/auth'

const prisma = new PrismaClient()

console.log('Debug PermissionAction:', PermissionAction)
console.log('Debug DOWNLOAD:', PermissionAction.DOWNLOAD)

// Test user credentials - CHANGE IN PRODUCTION!
const TEST_USERS = [
  {
    email: 'admin@contasync.com',
    password: 'Admin2024!',
    name: 'System Administrator',
    role: RoleName.ADMIN
  },
  {
    email: 'accountant@contasync.com',
    password: 'Accountant2024!',
    name: 'Senior Accountant',
    role: RoleName.ACCOUNTANT
  },
  {
    email: 'assistant@contasync.com',
    password: 'Assistant2024!',
    name: 'Accounting Assistant',
    role: RoleName.ACCOUNTING_ASSISTANT
  }
]

const ROLES_DATA = [
  {
    name: RoleName.ADMIN,
    displayName: 'Administrator',
    description: 'Full system access including user management and system configuration'
  },
  {
    name: RoleName.ACCOUNTANT,
    displayName: 'Accountant',
    description: 'Access to review invoices and generate reports'
  },
  {
    name: RoleName.ACCOUNTING_ASSISTANT,
    displayName: 'Accounting Assistant',
    description: 'Access to view invoices and perform bulk downloads'
  }
]

const PERMISSIONS_DATA = [
  // Dashboard permissions
  { name: 'dashboard:view', resource: 'dashboard', action: PermissionAction.VIEW, description: 'View main dashboard' },
  
  // Invoice permissions
  { name: 'invoices:view', resource: 'invoices', action: PermissionAction.VIEW, description: 'View invoices' },
  { name: 'invoices:create', resource: 'invoices', action: PermissionAction.CREATE, description: 'Create invoices' },
  { name: 'invoices:edit', resource: 'invoices', action: PermissionAction.EDIT, description: 'Edit invoices' },
  { name: 'invoices:delete', resource: 'invoices', action: PermissionAction.DELETE, description: 'Delete invoices' },
  { name: 'invoices:download', resource: 'invoices', action: 'DOWNLOAD', description: 'Download invoices in bulk' },
  { name: 'invoices:manage', resource: 'invoices', action: PermissionAction.MANAGE, description: 'Full invoice management' },
  
  // Reports permissions
  { name: 'reports:view', resource: 'reports', action: PermissionAction.VIEW, description: 'View reports' },
  { name: 'reports:create', resource: 'reports', action: PermissionAction.CREATE, description: 'Create reports' },
  { name: 'reports:manage', resource: 'reports', action: PermissionAction.MANAGE, description: 'Full report management' },
  
  // Users permissions
  { name: 'users:view', resource: 'users', action: PermissionAction.VIEW, description: 'View users' },
  { name: 'users:edit', resource: 'users', action: PermissionAction.EDIT, description: 'Edit users' },
  { name: 'users:create', resource: 'users', action: PermissionAction.CREATE, description: 'Create users' },
  { name: 'users:delete', resource: 'users', action: PermissionAction.DELETE, description: 'Delete users' },
  { name: 'users:manage', resource: 'users', action: PermissionAction.MANAGE, description: 'Full user management' },
  
  // Settings permissions
  { name: 'settings:view', resource: 'settings', action: PermissionAction.VIEW, description: 'View settings' },
  { name: 'settings:edit', resource: 'settings', action: PermissionAction.EDIT, description: 'Edit settings' },
  { name: 'settings:manage', resource: 'settings', action: PermissionAction.MANAGE, description: 'Full settings management' }
]

// Role-Permission mappings
const ROLE_PERMISSIONS_MAPPING = {
  [RoleName.ADMIN]: [
    'dashboard:view',
    'invoices:manage',
    'reports:manage',
    'users:manage',
    'settings:manage'
  ],
  [RoleName.ACCOUNTANT]: [
    'dashboard:view',
    'invoices:view',
    'reports:view'
  ],
  [RoleName.ACCOUNTING_ASSISTANT]: [
    'dashboard:view',
    'invoices:view',
    'invoices:download'
  ]
}

async function main() {
  console.log('🌱 Starting database seeding...')

  // Create permissions first
  console.log('📋 Creating permissions...')
  const createdPermissions = new Map<string, string>()
  
  for (const permission of PERMISSIONS_DATA) {
    console.log(`Debug: ${permission.name} - action: ${permission.action}`)
    const created = await prisma.permission.upsert({
      where: { name: permission.name },
      update: permission,
      create: permission
    })
    createdPermissions.set(permission.name, created.id)
    console.log(`  ✅ Permission: ${permission.name}`)
  }

  // Create roles
  console.log('👥 Creating roles...')
  const createdRoles = new Map<RoleName, string>()
  
  for (const role of ROLES_DATA) {
    const created = await prisma.role.upsert({
      where: { name: role.name },
      update: role,
      create: role
    })
    createdRoles.set(role.name, created.id)
    console.log(`  ✅ Role: ${role.displayName}`)
  }

  // Create role-permission mappings
  console.log('🔗 Creating role-permission mappings...')
  
  for (const [roleName, permissionNames] of Object.entries(ROLE_PERMISSIONS_MAPPING)) {
    const roleId = createdRoles.get(roleName as RoleName)
    if (!roleId) continue

    // Clear existing permissions for this role
    await prisma.rolePermission.deleteMany({
      where: { roleId }
    })

    // Add new permissions
    for (const permissionName of permissionNames) {
      const permissionId = createdPermissions.get(permissionName)
      if (!permissionId) continue

      await prisma.rolePermission.create({
        data: {
          roleId,
          permissionId
        }
      })
    }
    console.log(`  ✅ Mapped ${permissionNames.length} permissions to ${roleName}`)
  }

  // Create test users
  console.log('👤 Creating test users...')
  
  for (const userData of TEST_USERS) {
    const roleId = createdRoles.get(userData.role)
    if (!roleId) continue

    const hashedPassword = await hashPassword(userData.password)
    
    const user = await prisma.user.upsert({
      where: { email: userData.email },
      update: {
        name: userData.name,
        password: hashedPassword,
        roleId,
        isActive: true
      },
      create: {
        email: userData.email,
        name: userData.name,
        password: hashedPassword,
        roleId,
        isActive: true
      }
    })
    console.log(`  ✅ User: ${userData.name} (${userData.email})`)
  }

  console.log('\n🎉 Database seeding completed!')
  console.log('\n📧 Test User Credentials:')
  console.log('=' .repeat(50))
  
  for (const user of TEST_USERS) {
    console.log(`${user.name}:`)
    console.log(`  📧 Email: ${user.email}`)
    console.log(`  🔑 Password: ${user.password}`)
    console.log(`  👤 Role: ${user.role}`)
    console.log('')
  }
  
  console.log('⚠️  IMPORTANT: Change these passwords in production!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('❌ Seeding failed:', e)
    await prisma.$disconnect()
    process.exit(1)
  })