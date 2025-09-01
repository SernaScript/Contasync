// Exportar todos los componentes de carga desde un solo lugar
export { LoadingSpinner } from './loading-spinner'
export { LoadingOverlay } from './loading-overlay'
export { LoadingButton } from './loading-button'
export { PageLoader } from './page-loader'
export { Skeleton, SkeletonGroup, TableSkeleton, CardSkeleton, SkeletonVariants } from './skeleton'

// Re-exportar hooks de carga
export { useLoading, useApiLoading, useMultipleLoading } from '@/hooks/useLoading'
