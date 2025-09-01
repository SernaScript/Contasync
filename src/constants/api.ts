// API configuration and endpoints following naming conventions

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '/api'

export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    PROFILE: '/auth/profile'
  },

  // Payments
  PAYMENTS: {
    LIST: '/payments',
    DETAILS: (id: string) => `/payments/${id}`,
    CREATE: '/payments',
    UPDATE_STATUS: (id: string) => `/payments/${id}/status`,
    SUMMARY: '/payments/summary'
  },

  // Trips
  TRIPS: {
    LIST: '/trips',
    DETAILS: (id: string) => `/trips/${id}`,
    CREATE: '/trips',
    UPDATE: (id: string) => `/trips/${id}`,
    UPDATE_STATUS: (id: string) => `/trips/${id}/status`,
    ATTACHMENTS: (id: string) => `/trips/${id}/attachments`,
    SUMMARY: '/trips/summary'
  },

  // Providers
  PROVIDERS: {
    LIST: '/providers',
    DETAILS: (id: string) => `/providers/${id}`,
    CREATE: '/providers',
    UPDATE: (id: string) => `/providers/${id}`,
    CERTIFICATIONS: (id: string) => `/providers/${id}/certifications`,
    STATS: '/providers/stats'
  },

  // Certifications
  CERTIFICATIONS: {
    LIST: '/certifications',
    DETAILS: (id: string) => `/certifications/${id}`,
    CREATE: '/certifications',
    UPDATE: (id: string) => `/certifications/${id}`,
    DELETE: (id: string) => `/certifications/${id}`,
    UPLOAD: (id: string) => `/certifications/${id}/upload`
  },

  // File uploads
  FILES: {
    UPLOAD: '/files/upload',
    DOWNLOAD: (id: string) => `/files/${id}`,
    DELETE: (id: string) => `/files/${id}`
  }
} as const

export const HTTP_STATUS_CODES = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500
} as const

export const REQUEST_TIMEOUT = 30000 // 30 seconds

export const DEFAULT_PAGE_SIZE = 20
export const MAX_PAGE_SIZE = 100

export const FILE_UPLOAD_LIMITS = {
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_TYPES: [
    'application/pdf',
    'image/jpeg',
    'image/png',
    'image/jpg',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-excel'
  ]
} as const
