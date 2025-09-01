// Trip domain types following TypeScript/React naming conventions

export enum TripStatus {
  DRAFT = 'draft',
  SUBMITTED = 'submitted',
  UNDER_REVIEW = 'under_review',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  PAID = 'paid'
}

export enum MaterialType {
  CONSTRUCTION_MATERIALS = 'construction_materials',
  INDUSTRIAL_MATERIALS = 'industrial_materials',
  MINING_MATERIALS = 'mining_materials',
  AGRICULTURAL_MATERIALS = 'agricultural_materials',
  OTHER = 'other'
}

export enum VehicleType {
  TRUCK = 'truck',
  TRAILER = 'trailer',
  DUMP_TRUCK = 'dump_truck',
  TANKER = 'tanker',
  FLATBED = 'flatbed'
}

export interface TripLocation {
  address: string
  city: string
  department: string
  coordinates?: {
    latitude: number
    longitude: number
  }
}

export interface TripData {
  id: string
  providerId: string
  tripNumber: string
  status: TripStatus
  materialType: MaterialType
  materialDescription: string
  quantity: number
  unit: string
  vehicleType: VehicleType
  vehiclePlate: string
  driverName: string
  driverLicense: string
  origin: TripLocation
  destination: TripLocation
  scheduledDate: Date
  completedDate?: Date
  distance: number
  rate: number
  totalAmount: number
  createdAt: Date
  updatedAt: Date
  notes?: string
  attachments?: TripAttachment[]
}

export interface TripAttachment {
  id: string
  fileName: string
  fileType: string
  fileSize: number
  uploadedAt: Date
  url: string
  description?: string
}

export interface TripSummary {
  totalTrips: number
  pendingTrips: number
  approvedTrips: number
  rejectedTrips: number
  totalRevenue: number
  averageRate: number
}

export interface TripFilter {
  status?: TripStatus[]
  materialType?: MaterialType[]
  dateFrom?: Date
  dateTo?: Date
  vehicleType?: VehicleType[]
  amountMin?: number
  amountMax?: number
}

export interface TripListResponse {
  trips: TripData[]
  totalCount: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}

// API request/response types
export interface CreateTripRequest {
  materialType: MaterialType
  materialDescription: string
  quantity: number
  unit: string
  vehicleType: VehicleType
  vehiclePlate: string
  driverName: string
  driverLicense: string
  origin: TripLocation
  destination: TripLocation
  scheduledDate: Date
  notes?: string
}

export interface UpdateTripRequest extends Partial<CreateTripRequest> {
  tripId: string
}

export interface UpdateTripStatusRequest {
  tripId: string
  status: TripStatus
  completedDate?: Date
  notes?: string
}
