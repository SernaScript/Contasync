// Payment domain types following TypeScript/React naming conventions

export enum PaymentStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled'
}

export enum PaymentMethod {
  BANK_TRANSFER = 'bank_transfer',
  CHECK = 'check',
  ELECTRONIC_TRANSFER = 'electronic_transfer'
}

export interface PaymentData {
  id: string
  providerId: string
  tripId: string
  amount: number
  currency: string
  status: PaymentStatus
  method: PaymentMethod
  createdAt: Date
  updatedAt: Date
  scheduledDate?: Date
  completedDate?: Date
  description: string
  referenceNumber?: string
}

export interface PaymentSummary {
  totalAmount: number
  pendingAmount: number
  completedAmount: number
  totalTransactions: number
  pendingTransactions: number
  completedTransactions: number
}

export interface PaymentFilter {
  status?: PaymentStatus[]
  dateFrom?: Date
  dateTo?: Date
  amountMin?: number
  amountMax?: number
  method?: PaymentMethod[]
}

export interface PaymentListResponse {
  payments: PaymentData[]
  totalCount: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}

// API request/response types
export interface CreatePaymentRequest {
  tripId: string
  amount: number
  description: string
  scheduledDate?: Date
}

export interface UpdatePaymentStatusRequest {
  paymentId: string
  status: PaymentStatus
  completedDate?: Date
  referenceNumber?: string
}
