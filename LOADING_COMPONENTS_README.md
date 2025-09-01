# Sistema de Componentes de Carga - Contasync

Este documento describe el sistema completo de indicadores de carga implementado en la aplicación Contasync para mejorar la experiencia del usuario durante las operaciones asíncronas.

## 🎯 Objetivo

Proporcionar una experiencia de usuario intuitiva y consistente que comunique claramente cuando la aplicación está procesando datos, realizando llamadas a API, o cargando contenido.

## 🧩 Componentes Disponibles

### 1. LoadingSpinner

Componente básico para mostrar un spinner de carga con texto opcional.

```tsx
import { LoadingSpinner } from '@/components/ui/loading'

// Uso básico
<LoadingSpinner />

// Con texto y tamaño personalizado
<LoadingSpinner 
  size="lg" 
  text="Cargando datos..." 
  textPosition="bottom" 
/>

// Diferentes variantes
<LoadingSpinner variant="secondary" />
<LoadingSpinner variant="muted" />
<LoadingSpinner variant="white" />
```

**Props:**
- `size`: "sm" | "default" | "lg" | "xl" | "2xl"
- `variant`: "default" | "secondary" | "muted" | "white"
- `text`: string (texto opcional)
- `textPosition`: "top" | "bottom" | "left" | "right"

### 2. LoadingButton

Botón que muestra un spinner durante la carga y se deshabilita automáticamente.

```tsx
import { LoadingButton } from '@/components/ui/loading'

<LoadingButton
  isLoading={isLoading}
  loadingText="Procesando..."
  onClick={handleSubmit}
>
  Enviar Formulario
</LoadingButton>
```

**Props:**
- `isLoading`: boolean - Controla el estado de carga
- `loadingText`: string - Texto mostrado durante la carga
- `loadingSpinnerSize`: Tamaño del spinner (por defecto "sm")
- Extiende todas las props del componente Button

### 3. LoadingOverlay

Overlay que cubre un elemento completo durante la carga.

```tsx
import { LoadingOverlay } from '@/components/ui/loading'

<LoadingOverlay 
  isLoading={isLoading} 
  text="Cargando facturas..."
  spinnerSize="xl"
>
  <div className="p-6">
    {/* Contenido que se cubrirá durante la carga */}
    <h2>Lista de Facturas</h2>
    {/* ... */}
  </div>
</LoadingOverlay>
```

**Props:**
- `isLoading`: boolean - Controla la visibilidad del overlay
- `text`: string - Texto mostrado en el overlay
- `spinnerSize`: Tamaño del spinner
- `backdrop`: boolean - Si mostrar fondo con blur (por defecto true)
- `className`: string - Clases CSS adicionales
- `overlayClassName`: string - Clases CSS para el overlay

### 4. Skeleton

Placeholders animados que muestran la estructura del contenido mientras se carga.

```tsx
import { Skeleton, SkeletonVariants } from '@/components/ui/loading'

// Skeleton básico
<Skeleton className="h-4 w-full" />

// Usando variantes predefinidas
<Skeleton className={SkeletonVariants.title} />
<Skeleton className={SkeletonVariants.avatar} />
<Skeleton className={SkeletonVariants.button} />
```

**Variantes Disponibles:**
- `text`, `textSm`, `textLg`, `textXl`
- `title`, `titleLg`
- `avatar`, `avatarSm`, `avatarLg`
- `button`, `buttonSm`, `buttonLg`
- `card`, `cardSm`, `cardLg`
- `input`, `inputSm`, `inputLg`
- `tableRow`, `tableCell`
- `listItem`, `listItemSm`
- `image`, `imageSm`, `imageLg`
- `badge`, `badgeSm`

### 5. SkeletonGroup

Grupo de skeletons para crear múltiples placeholders.

```tsx
import { SkeletonGroup } from '@/components/ui/loading'

<SkeletonGroup 
  count={5} 
  skeletonClassName="h-4 w-3/4" 
/>
```

### 6. TableSkeleton

Skeleton especializado para tablas.

```tsx
import { TableSkeleton } from '@/components/ui/loading'

<TableSkeleton rows={10} columns={6} />
```

### 7. CardSkeleton

Skeleton especializado para cards.

```tsx
import { CardSkeleton } from '@/components/ui/loading'

<CardSkeleton showImage={true} showActions={true} />
```

### 8. PageLoader

Componente para mostrar carga durante transiciones de página.

```tsx
import { PageLoader } from '@/components/ui/loading'

// En el layout principal
<PageLoader>
  {children}
</PageLoader>
```

## 🪝 Hooks Disponibles

### useLoading

Hook básico para manejar estados de carga.

```tsx
import { useLoading } from '@/hooks/useLoading'

const { isLoading, loadingText, startLoading, stopLoading, withLoading } = useLoading({
  initialLoading: false,
  loadingText: 'Cargando...',
  onLoadingStart: () => console.log('Carga iniciada'),
  onLoadingComplete: () => console.log('Carga completada')
})

// Uso básico
const handleClick = () => {
  startLoading('Procesando...')
  // ... operación asíncrona
  stopLoading()
}

// Uso con withLoading
const handleSubmit = async () => {
  await withLoading(async () => {
    // ... operación asíncrona
  }, 'Enviando formulario...')
}
```

### useApiLoading

Hook especializado para operaciones de API.

```tsx
import { useApiLoading } from '@/hooks/useLoading'

const { isLoading, apiCall } = useApiLoading({
  loadingText: 'Procesando solicitud...'
})

const handleApiCall = async () => {
  await apiCall(async () => {
    const response = await fetch('/api/data')
    return response.json()
  }, 'Cargando datos...')
}
```

### useMultipleLoading

Hook para manejar múltiples operaciones simultáneas.

```tsx
import { useMultipleLoading } from '@/hooks/useLoading'

const { loadingStates, startOperation, stopOperation, isAnyLoading, isLoading } = useMultipleLoading([
  'fetchUsers',
  'fetchRoles',
  'fetchPermissions'
])

const loadUsers = async () => {
  startOperation('fetchUsers')
  try {
    // ... operación
  } finally {
    stopOperation('fetchUsers')
  }
}
```

## 📱 Casos de Uso Comunes

### 1. Formularios

```tsx
const { isLoading, apiCall } = useApiLoading()

const handleSubmit = async (data) => {
  await apiCall(async () => {
    await submitForm(data)
  }, 'Enviando formulario...')
}

return (
  <form onSubmit={handleSubmit}>
    {/* ... campos del formulario */}
    <LoadingButton
      type="submit"
      isLoading={isLoading}
      loadingText="Enviando..."
    >
      Enviar
    </LoadingButton>
  </form>
)
```

### 2. Listas y Tablas

```tsx
const [data, setData] = useState(null)
const { isLoading, apiCall } = useApiLoading({ initialLoading: true })

useEffect(() => {
  loadData()
}, [])

const loadData = async () => {
  await apiCall(async () => {
    const response = await fetch('/api/data')
    const result = await response.json()
    setData(result)
  }, 'Cargando datos...')
}

return (
  <LoadingOverlay isLoading={isLoading} text="Cargando datos...">
    {data ? (
      <table>
        {/* ... contenido de la tabla */}
      </table>
    ) : (
      <TableSkeleton rows={10} columns={5} />
    )}
  </LoadingOverlay>
)
```

### 3. Operaciones de Acción

```tsx
const { isLoading, apiCall } = useApiLoading()

const handleDelete = async (id) => {
  if (confirm('¿Estás seguro?')) {
    await apiCall(async () => {
      await deleteItem(id)
      // Recargar datos
      loadData()
    }, 'Eliminando elemento...')
  }
}

return (
  <LoadingButton
    onClick={() => handleDelete(item.id)}
    isLoading={isLoading}
    loadingText="Eliminando..."
    variant="destructive"
  >
    Eliminar
  </LoadingButton>
)
```

## 🎨 Personalización

### Temas y Colores

Los componentes usan las variables CSS del tema de la aplicación:

```css
/* En tu archivo CSS */
:root {
  --loading-primary: #3b82f6;
  --loading-secondary: #64748b;
  --loading-muted: #94a3b8;
  --loading-background: rgba(255, 255, 255, 0.9);
}
```

### Animaciones

Las animaciones están basadas en Tailwind CSS:

```css
.animate-spin {
  animation: spin 1s linear infinite;
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
```

## 🚀 Mejores Prácticas

### 1. Consistencia
- Usar el mismo tipo de indicador para operaciones similares
- Mantener textos de carga descriptivos y útiles
- Usar colores y estilos consistentes

### 2. Performance
- Evitar mostrar spinners para operaciones muy rápidas (< 200ms)
- Usar skeletons para contenido que tarda en cargar
- Implementar lazy loading cuando sea apropiado

### 3. Accesibilidad
- Incluir textos descriptivos para lectores de pantalla
- Usar `aria-label` y `aria-describedby` cuando sea necesario
- Asegurar que los indicadores de carga sean visibles para todos los usuarios

### 4. UX
- Mostrar progreso cuando sea posible
- Proporcionar feedback inmediato para acciones del usuario
- Usar estados de carga apropiados para cada contexto

## 🔧 Instalación y Configuración

Los componentes están listos para usar y no requieren configuración adicional. Solo asegúrate de:

1. Tener Tailwind CSS configurado
2. Importar los componentes desde `@/components/ui/loading`
3. Usar los hooks desde `@/hooks/useLoading`

## 📚 Ejemplos Completos

Revisa el archivo `src/components/examples/LoadingExamples.tsx` para ver ejemplos completos de todos los componentes en acción.

## 🤝 Contribución

Para agregar nuevos componentes de carga o modificar los existentes:

1. Mantén la consistencia con el diseño actual
2. Asegúrate de que sean accesibles
3. Incluye documentación y ejemplos
4. Prueba en diferentes dispositivos y navegadores

---

**Nota:** Este sistema está diseñado para ser extensible y fácil de usar. Si tienes necesidades específicas que no están cubiertas, considera crear un componente personalizado o contactar al equipo de desarrollo.
