# 📋 Estándares de Codificación - Portal TYVG

## 🎯 Principios Generales

- **Código en Inglés**: Todas las variables, funciones, tipos, rutas y archivos en inglés
- **UI en Español**: Todo el contenido visible para el usuario en español
- **Consistencia**: Seguir las convenciones establecidas en todo el proyecto
- **Legibilidad**: Código auto-documentado con nombres descriptivos

## 📁 Estructura de Carpetas

```
src/
├── components/           # Componentes reutilizables
│   ├── ui/              # Componentes base de shadcn/ui
│   ├── forms/           # Componentes de formularios
│   ├── layout/          # Componentes de layout
│   └── feature-name/    # Componentes específicos de funcionalidad
├── pages/ o app/        # Páginas/rutas de la aplicación
├── hooks/               # Custom hooks
├── utils/               # Funciones utilitarias
├── types/               # Definiciones de tipos TypeScript
├── constants/           # Constantes de la aplicación
├── services/            # Servicios API y lógica de negocio
├── store/               # Estado global (si aplica)
└── styles/              # Estilos globales
```

## 🏷️ Convenciones de Nomenclatura

### Archivos y Carpetas
- **Carpetas**: `kebab-case` → `payment-management/`, `trip-registration/`
- **Componentes**: `PascalCase.tsx` → `PaymentStatusCard.tsx`, `TripForm.tsx`
- **Páginas**: `kebab-case` → `payment-status/page.tsx`, `trip-registration/page.tsx`
- **Utilidades**: `camelCase.ts` → `formatCurrency.ts`, `validateTripData.ts`
- **Tipos**: `camelCase.ts` → `payment.ts`, `trip.ts`, `provider.ts`
- **Constantes**: `UPPER_SNAKE_CASE.ts` → `API_ENDPOINTS.ts`, `PAYMENT_STATUSES.ts`

### Variables y Funciones
```typescript
// ✅ Correcto
const paymentAmount = 1000
const isLoading = false
const userData = { name: 'Juan', email: 'juan@example.com' }

function calculateTotalPayment(trips: TripData[]): number { }
function handlePaymentSubmit(data: PaymentData): void { }

// ❌ Incorrecto
const payment_amount = 1000
const IsLoading = false
const user_data = { name: 'Juan', email: 'juan@example.com' }
```

### Tipos e Interfaces
```typescript
// ✅ Correcto
interface PaymentData {
  id: string
  amount: number
  status: PaymentStatus
}

enum PaymentStatus {
  PENDING = 'pending',
  COMPLETED = 'completed'
}

type TripRegistrationProps = {
  onSubmit: (data: TripData) => void
  isLoading: boolean
}

// ❌ Incorrecto
interface paymentData { }
enum paymentStatus { }
type tripRegistrationProps = { }
```

### Componentes React
```typescript
// ✅ Correcto
interface PaymentCardProps {
  paymentData: PaymentData
  onPaymentClick: (id: string) => void
  isLoading?: boolean
}

export function PaymentCard({ 
  paymentData, 
  onPaymentClick, 
  isLoading = false 
}: PaymentCardProps) {
  const handleClick = () => {
    onPaymentClick(paymentData.id)
  }

  return (
    <Card>
      {/* UI en español */}
      <h3>Estado del Pago</h3>
      <p>Monto: {formatCurrency(paymentData.amount)}</p>
    </Card>
  )
}
```

### Event Handlers
```typescript
// ✅ Correcto
const handleSubmit = (data: FormData) => { }
const handlePaymentChange = (paymentId: string) => { }
const handleTripRegistration = (trip: TripData) => { }

// ❌ Incorrecto
const onSubmit = (data: FormData) => { } // Usar 'handle' en lugar de 'on'
const submitHandler = (data: FormData) => { }
```

### Hooks Personalizados
```typescript
// ✅ Correcto
function usePaymentStatus(providerId: string) {
  const [paymentData, setPaymentData] = useState<PaymentData[]>([])
  const [isLoading, setIsLoading] = useState(false)
  
  return { paymentData, isLoading, refetch }
}

function useTripRegistration() {
  // Hook logic
}
```

## 🛣️ Rutas y URLs

```typescript
// ✅ Correcto
/payment-management
/trip-registration
/certification-status
/api/payment-status
/api/trip-registration

// ❌ Incorrecto
/PaymentManagement
/trip_registration
/certificationStatus
```

## 📝 Comentarios y Documentación

```typescript
/**
 * Calculate the total payment amount for a provider
 * @param trips - Array of trip data
 * @param taxRate - Tax rate to apply (default: 0.19)
 * @returns Total payment amount including taxes
 */
function calculateTotalPayment(trips: TripData[], taxRate = 0.19): number {
  // Implementation details in English
  const subtotal = trips.reduce((sum, trip) => sum + trip.amount, 0)
  return subtotal * (1 + taxRate)
}
```

## 🎨 Estilos y CSS

```typescript
// ✅ Correcto - Usando Tailwind CSS
<div className="bg-orange-600 text-white p-4 rounded-lg">
  <h2 className="text-xl font-bold mb-2">Estado del Pago</h2>
</div>

// Variables CSS si es necesario
:root {
  --primary-orange: #ea580c;
  --text-primary: #1f2937;
}
```

## 📊 Manejo de Estado

```typescript
// ✅ Correcto
const [paymentData, setPaymentData] = useState<PaymentData | null>(null)
const [isLoading, setIsLoading] = useState(false)
const [error, setError] = useState<string | null>(null)

// Para objetos complejos
const [formData, setFormData] = useState<TripRegistrationForm>({
  materialType: MaterialType.CONSTRUCTION_MATERIALS,
  quantity: 0,
  vehiclePlate: '',
  // ...
})
```

## 🔄 Async/Await y Promises

```typescript
// ✅ Correcto
async function fetchPaymentData(providerId: string): Promise<PaymentData[]> {
  try {
    const response = await fetch(`/api/payments?providerId=${providerId}`)
    
    if (!response.ok) {
      throw new Error('Failed to fetch payment data')
    }
    
    return await response.json()
  } catch (error) {
    console.error('Error fetching payment data:', error)
    throw error
  }
}
```

## 🧪 Testing (Convenciones futuras)

```typescript
// ✅ Correcto
describe('PaymentCard', () => {
  it('should display payment amount correctly', () => {
    // Test implementation
  })
  
  it('should handle payment click events', () => {
    // Test implementation
  })
})
```

## 📋 Checklist de Revisión

Antes de hacer commit, verificar:

- [ ] Nombres de variables/funciones en inglés
- [ ] UI/textos en español
- [ ] Convenciones de nomenclatura seguidas
- [ ] Tipos TypeScript definidos correctamente
- [ ] Funciones documentadas
- [ ] Sin errores de linting
- [ ] Imports organizados
- [ ] Código formateado consistentemente

## 🚀 Ejemplos de Buenas Prácticas

### Componente Completo
```typescript
// components/payment/PaymentStatusCard.tsx
import { formatCurrency, formatDate } from '@/utils/formatters'
import { PaymentData, PaymentStatus } from '@/types/payment'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface PaymentStatusCardProps {
  paymentData: PaymentData
  onViewDetails: (paymentId: string) => void
  className?: string
}

export function PaymentStatusCard({ 
  paymentData, 
  onViewDetails,
  className 
}: PaymentStatusCardProps) {
  const handleViewDetails = () => {
    onViewDetails(paymentData.id)
  }
  
  const getStatusBadgeVariant = (status: PaymentStatus) => {
    switch (status) {
      case PaymentStatus.COMPLETED:
        return 'success'
      case PaymentStatus.PENDING:
        return 'warning'
      case PaymentStatus.FAILED:
        return 'destructive'
      default:
        return 'secondary'
    }
  }
  
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Pago #{paymentData.referenceNumber}</span>
          <Badge variant={getStatusBadgeVariant(paymentData.status)}>
            {getStatusDisplayName(paymentData.status)}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p><strong>Monto:</strong> {formatCurrency(paymentData.amount)}</p>
          <p><strong>Fecha:</strong> {formatDate(paymentData.createdAt)}</p>
          <p><strong>Descripción:</strong> {paymentData.description}</p>
        </div>
        <Button onClick={handleViewDetails} className="mt-4">
          Ver Detalles
        </Button>
      </CardContent>
    </Card>
  )
}

function getStatusDisplayName(status: PaymentStatus): string {
  const statusNames = {
    [PaymentStatus.PENDING]: 'Pendiente',
    [PaymentStatus.PROCESSING]: 'Procesando',
    [PaymentStatus.COMPLETED]: 'Completado',
    [PaymentStatus.FAILED]: 'Fallido',
    [PaymentStatus.CANCELLED]: 'Cancelado'
  }
  
  return statusNames[status] || 'Desconocido'
}
```

Esta guía asegura que todo el código siga las mejores prácticas de TypeScript/React mientras mantiene la interfaz de usuario en español para los usuarios finales.
