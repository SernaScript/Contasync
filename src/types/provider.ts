// Provider domain types following TypeScript/React naming conventions

export enum ProviderStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
  PENDING_APPROVAL = 'pending_approval'
}

export enum CertificationType {
  RUNT_CERTIFICATE = 'runt_certificate',
  INSURANCE_POLICY = 'insurance_policy',
  VEHICLE_REGISTRATION = 'vehicle_registration',
  DRIVER_LICENSE = 'driver_license',
  TECHNICAL_INSPECTION = 'technical_inspection',
  ENVIRONMENTAL_CERTIFICATE = 'environmental_certificate'
}

export enum CertificationStatus {
  VALID = 'valid',
  EXPIRED = 'expired',
  EXPIRING_SOON = 'expiring_soon',
  PENDING_RENEWAL = 'pending_renewal'
}

export interface ProviderContact {
  name: string
  position: string
  phone: string
  email: string
  isPrimary: boolean
}

export interface ProviderAddress {
  street: string
  city: string
  department: string
  postalCode?: string
  country: string
}

export interface BankAccount {
  bankName: string
  accountNumber: string
  accountType: 'savings' | 'checking'
  accountHolderName: string
  isActive: boolean
}

export interface ProviderData {
  id: string
  companyName: string
  taxId: string // NIT
  status: ProviderStatus
  registrationDate: Date
  lastActivityDate?: Date
  address: ProviderAddress
  contacts: ProviderContact[]
  bankAccounts: BankAccount[]
  totalTrips: number
  totalRevenue: number
  averageRating: number
  createdAt: Date
  updatedAt: Date
  notes?: string
}

export interface CertificationData {
  id: string
  providerId: string
  type: CertificationType
  certificateNumber: string
  issuedBy: string
  issuedDate: Date
  expirationDate: Date
  status: CertificationStatus
  fileUrl?: string
  notes?: string
  createdAt: Date
  updatedAt: Date
}

export interface ProviderStats {
  totalProviders: number
  activeProviders: number
  inactiveProviders: number
  pendingApproval: number
  totalCertifications: number
  expiredCertifications: number
  expiringSoonCertifications: number
}

// API request/response types
export interface CreateProviderRequest {
  companyName: string
  taxId: string
  address: ProviderAddress
  contacts: Omit<ProviderContact, 'isPrimary'>[]
  bankAccounts: Omit<BankAccount, 'isActive'>[]
}

export interface UpdateProviderRequest extends Partial<CreateProviderRequest> {
  providerId: string
}

export interface CreateCertificationRequest {
  providerId: string
  type: CertificationType
  certificateNumber: string
  issuedBy: string
  issuedDate: Date
  expirationDate: Date
  notes?: string
}

export interface UpdateCertificationRequest extends Partial<CreateCertificationRequest> {
  certificationId: string
}
