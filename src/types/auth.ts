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
  ADMIN = 'ADMIN',
  ACCOUNTANT = 'ACCOUNTANT',
  ACCOUNTING_ASSISTANT = 'ACCOUNTING_ASSISTANT'
}

export enum PermissionAction {
  VIEW = 'VIEW',
  CREATE = 'CREATE',
  EDIT = 'EDIT',
  DELETE = 'DELETE',
  MANAGE = 'MANAGE',
  DOWNLOAD = 'DOWNLOAD'
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
  [RoleName.ADMIN]: [
    'invoices:MANAGE',
    'reports:MANAGE',
    'users:MANAGE',
    'settings:MANAGE',
    'dashboard:VIEW'
  ],
  [RoleName.ACCOUNTANT]: [
    'invoices:VIEW',
    'reports:VIEW',
    'dashboard:VIEW'
  ],
  [RoleName.ACCOUNTING_ASSISTANT]: [
    'invoices:VIEW',
    'invoices:DOWNLOAD',
    'dashboard:VIEW'
  ]
}

// Area-specific permissions mapping
export const AREA_PERMISSIONS_MAP: Record<string, AreaPermission> = {
  invoices: {
    areaId: 'invoices',
    displayName: 'Invoice Management',
    requiredPermission: {
      resource: 'invoices',
      action: PermissionAction.VIEW
    },
    modules: [
      {
        moduleId: 'bulk-download',
        displayName: 'Bulk Download',
        requiredPermission: {
          resource: 'invoices',
          action: PermissionAction.DOWNLOAD
        }
      }
    ]
  },
  reports: {
    areaId: 'reports',
    displayName: 'Reports',
    requiredPermission: {
      resource: 'reports',
      action: PermissionAction.VIEW
    },
    modules: []
  },
  users: {
    areaId: 'users',
    displayName: 'User Management',
    requiredPermission: {
      resource: 'users',
      action: PermissionAction.MANAGE
    },
    modules: []
  }
}