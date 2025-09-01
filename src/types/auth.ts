// Authentication and Authorization Types

export interface User {
  id: string
  email: string
  name: string | null
  password?: string // Optional for security, only included during auth
  isActive: boolean
  lastLogin: Date | null
  createdAt: Date
  updatedAt: Date
  role: Role
}

export interface Role {
  id: string
  name: RoleName
  displayName: string
  description: string | null
  isActive: boolean
  permissions: Permission[]
}

export interface Permission {
  id: string
  name: string
  resource: string
  action: PermissionAction
  description: string | null
}

export enum RoleName {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  ACCOUNTING = 'ACCOUNTING',
  TREASURY = 'TREASURY',
  LOGISTICS = 'LOGISTICS',
  BILLING = 'BILLING',
  VIEWER = 'VIEWER'
}

export enum PermissionAction {
  VIEW = 'VIEW',
  CREATE = 'CREATE',
  EDIT = 'EDIT',
  DELETE = 'DELETE',
  MANAGE = 'MANAGE'
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface AuthSession {
  id: string
  userId: string
  token: string
  expiresAt: Date
  user: User
}

export interface AuthContextType {
  user: User | null
  role: Role | null
  permissions: Permission[]
  isAuthenticated: boolean
  isLoading: boolean
  login: (credentials: LoginCredentials) => Promise<void>
  logout: () => Promise<void>
  hasPermission: (resource: string, action: PermissionAction) => boolean
  canAccessArea: (areaId: string) => boolean
  canAccessModule: (areaId: string, moduleId: string) => boolean
}

// Route protection types
export interface RoutePermission {
  resource: string
  action: PermissionAction
  allowedRoles?: RoleName[]
}

export interface ProtectedRouteConfig {
  [path: string]: RoutePermission
}

// Permission matrix for areas and modules
export interface AreaPermission {
  areaId: string
  displayName: string
  requiredPermission: {
    resource: string
    action: PermissionAction
  }
  modules: ModulePermission[]
}

export interface ModulePermission {
  moduleId: string
  displayName: string
  requiredPermission: {
    resource: string
    action: PermissionAction
  }
}

// Default role permissions configuration
export const ROLE_PERMISSIONS_CONFIG: Record<RoleName, string[]> = {
  [RoleName.SUPER_ADMIN]: [
    'accounting:MANAGE',
    'treasury:MANAGE',
    'logistics:MANAGE',
    'billing:MANAGE',
    'users:MANAGE',
    'roles:MANAGE',
    'settings:MANAGE',
    'reports:MANAGE'
  ],
  [RoleName.ADMIN]: [
    'accounting:MANAGE',
    'treasury:MANAGE',
    'logistics:MANAGE',
    'billing:MANAGE',
    'reports:VIEW',
    'users:VIEW'
  ],
  [RoleName.ACCOUNTING]: [
    'accounting:MANAGE',
    'reports:VIEW',
    'treasury:VIEW',
    'billing:VIEW'
  ],
  [RoleName.TREASURY]: [
    'treasury:MANAGE',
    'reports:VIEW',
    'accounting:VIEW',
    'billing:VIEW'
  ],
  [RoleName.LOGISTICS]: [
    'logistics:MANAGE',
    'reports:VIEW',
    'billing:VIEW'
  ],
  [RoleName.BILLING]: [
    'billing:MANAGE',
    'reports:VIEW',
    'accounting:VIEW'
  ],
  [RoleName.VIEWER]: [
    'accounting:VIEW',
    'treasury:VIEW',
    'logistics:VIEW',
    'billing:VIEW',
    'reports:VIEW'
  ]
}

// Area-specific permissions mapping
export const AREA_PERMISSIONS_MAP: Record<string, AreaPermission> = {
  accounting: {
    areaId: 'accounting',
    displayName: 'Contabilidad',
    requiredPermission: {
      resource: 'accounting',
      action: PermissionAction.VIEW
    },
    modules: [
      {
        moduleId: 'f2x-automation',
        displayName: 'Automatización F2X',
        requiredPermission: {
          resource: 'accounting',
          action: PermissionAction.EDIT
        }
      },
      {
        moduleId: 'reconciliation',
        displayName: 'Conciliación Bancaria',
        requiredPermission: {
          resource: 'accounting',
          action: PermissionAction.EDIT
        }
      }
    ]
  },
  treasury: {
    areaId: 'treasury',
    displayName: 'Tesorería',
    requiredPermission: {
      resource: 'treasury',
      action: PermissionAction.VIEW
    },
    modules: [
      {
        moduleId: 'portfolio',
        displayName: 'Gestión de Cartera',
        requiredPermission: {
          resource: 'treasury',
          action: PermissionAction.EDIT
        }
      }
    ]
  },
  logistics: {
    areaId: 'logistics',
    displayName: 'Logística',
    requiredPermission: {
      resource: 'logistics',
      action: PermissionAction.VIEW
    },
    modules: []
  },
  billing: {
    areaId: 'billing',
    displayName: 'Facturación',
    requiredPermission: {
      resource: 'billing',
      action: PermissionAction.VIEW
    },
    modules: []
  }
}

