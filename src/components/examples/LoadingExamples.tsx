"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  LoadingSpinner, 
  LoadingOverlay, 
  LoadingButton, 
  Skeleton, 
  SkeletonGroup, 
  TableSkeleton, 
  CardSkeleton 
} from "@/components/ui/loading"
import { useLoading, useApiLoading } from "@/hooks/useLoading"

export function LoadingExamples() {
  const [showOverlay, setShowOverlay] = useState(false)
  const [showSkeletons, setShowSkeletons] = useState(false)
  
  const { isLoading, startLoading, stopLoading } = useLoading()
  const { isLoading: apiLoading, apiCall } = useApiLoading()

  const simulateApiCall = async () => {
    await apiCall(async () => {
      await new Promise(resolve => setTimeout(resolve, 3000))
      return { success: true }
    }, 'Simulando llamada a API...')
  }

  const simulateLoading = () => {
    startLoading('Procesando datos...')
    setTimeout(() => {
      stopLoading()
    }, 3000)
  }

  return (
    <div className="space-y-8 p-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">Ejemplos de Componentes de Carga</h1>
        <p className="text-gray-600">
          Esta página muestra todos los componentes de carga disponibles en la aplicación
        </p>
      </div>

      {/* LoadingSpinner Examples */}
      <Card>
        <CardHeader>
          <CardTitle>LoadingSpinner - Diferentes Tamaños</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-8">
            <LoadingSpinner size="sm" text="Pequeño" />
            <LoadingSpinner size="default" text="Normal" />
            <LoadingSpinner size="lg" text="Grande" />
            <LoadingSpinner size="xl" text="Extra Grande" />
            <LoadingSpinner size="2xl" text="Muy Grande" />
          </div>
        </CardContent>
      </Card>

      {/* LoadingSpinner Variants */}
      <Card>
        <CardHeader>
          <CardTitle>LoadingSpinner - Diferentes Variantes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-8">
            <LoadingSpinner variant="default" text="Default" />
            <LoadingSpinner variant="secondary" text="Secondary" />
            <LoadingSpinner variant="muted" text="Muted" />
            <LoadingSpinner variant="white" text="White" />
          </div>
        </CardContent>
      </Card>

      {/* LoadingSpinner Text Positions */}
      <Card>
        <CardHeader>
          <CardTitle>LoadingSpinner - Posiciones de Texto</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-8">
            <LoadingSpinner textPosition="top" text="Arriba" />
            <LoadingSpinner textPosition="right" text="Derecha" />
            <LoadingSpinner textPosition="bottom" text="Abajo" />
            <LoadingSpinner textPosition="left" text="Izquierda" />
          </div>
        </CardContent>
      </Card>

      {/* LoadingButton Examples */}
      <Card>
        <CardHeader>
          <CardTitle>LoadingButton - Botones con Estado de Carga</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <LoadingButton 
              isLoading={isLoading} 
              loadingText="Procesando..."
              onClick={simulateLoading}
            >
              Simular Carga
            </LoadingButton>
            
            <LoadingButton 
              isLoading={apiLoading} 
              loadingText="Llamando API..."
              onClick={simulateApiCall}
              variant="outline"
            >
              Simular API Call
            </LoadingButton>
          </div>
          
          <div className="text-sm text-gray-600">
            <p>• El botón se deshabilita automáticamente durante la carga</p>
            <p>• Muestra un spinner y texto personalizado</p>
            <p>• El contenido original se oculta durante la carga</p>
          </div>
        </CardContent>
      </Card>

      {/* LoadingOverlay Examples */}
      <Card>
        <CardHeader>
          <CardTitle>LoadingOverlay - Overlays de Carga</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <Button onClick={() => setShowOverlay(!showOverlay)}>
              {showOverlay ? 'Ocultar' : 'Mostrar'} Overlay
            </Button>
          </div>
          
          <LoadingOverlay 
            isLoading={showOverlay} 
            text="Cargando contenido..."
            spinnerSize="xl"
          >
            <div className="p-8 border-2 border-dashed border-gray-300 rounded-lg text-center">
              <p className="text-lg font-medium mb-2">Contenido de Ejemplo</p>
              <p className="text-gray-600">
                Este contenido se muestra cuando no hay overlay activo.
                El overlay se puede usar para cubrir cualquier elemento
                mientras se carga.
              </p>
            </div>
          </LoadingOverlay>
        </CardContent>
      </Card>

      {/* Skeleton Examples */}
      <Card>
        <CardHeader>
          <CardTitle>Skeleton - Placeholders de Carga</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex gap-4">
            <Button onClick={() => setShowSkeletons(!showSkeletons)}>
              {showSkeletons ? 'Ocultar' : 'Mostrar'} Skeletons
            </Button>
          </div>
          
          {showSkeletons ? (
            <div className="space-y-6">
              {/* Text Skeletons */}
              <div>
                <h4 className="font-medium mb-3">Skeletons de Texto</h4>
                <div className="space-y-2">
                  <Skeleton className={SkeletonVariants.title} />
                  <Skeleton className={SkeletonVariants.text} />
                  <Skeleton className={SkeletonVariants.textSm} />
                </div>
              </div>

              {/* Avatar Skeletons */}
              <div>
                <h4 className="font-medium mb-3">Skeletons de Avatar</h4>
                <div className="flex gap-4">
                  <Skeleton className={SkeletonVariants.avatarSm} />
                  <Skeleton className={SkeletonVariants.avatar} />
                  <Skeleton className={SkeletonVariants.avatarLg} />
                </div>
              </div>

              {/* Button Skeletons */}
              <div>
                <h4 className="font-medium mb-3">Skeletons de Botones</h4>
                <div className="flex gap-4">
                  <Skeleton className={SkeletonVariants.buttonSm} />
                  <Skeleton className={SkeletonVariants.button} />
                  <Skeleton className={SkeletonVariants.buttonLg} />
                </div>
              </div>

              {/* Card Skeleton */}
              <div>
                <h4 className="font-medium mb-3">Skeleton de Card</h4>
                <CardSkeleton />
              </div>

              {/* Table Skeleton */}
              <div>
                <h4 className="font-medium mb-3">Skeleton de Tabla</h4>
                <TableSkeleton rows={5} columns={4} />
              </div>

              {/* Skeleton Group */}
              <div>
                <h4 className="font-medium mb-3">Grupo de Skeletons</h4>
                <SkeletonGroup count={4} />
              </div>
            </div>
          ) : (
            <div className="p-8 border-2 border-dashed border-gray-300 rounded-lg text-center">
              <p className="text-lg font-medium mb-2">Contenido Real</p>
              <p className="text-gray-600">
                Aquí se mostraría el contenido real de la aplicación.
                Los skeletons se usan para mostrar la estructura mientras se carga.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Hook Examples */}
      <Card>
        <CardHeader>
          <CardTitle>Hooks de Carga - Gestión de Estado</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">useLoading</h4>
              <p className="text-sm text-gray-600 mb-3">
                Hook básico para manejar estados de carga
              </p>
              <div className="space-y-2">
                <p className="text-sm">
                  <span className="font-medium">Estado:</span> {isLoading ? 'Cargando' : 'Inactivo'}
                </p>
                <div className="flex gap-2">
                  <Button size="sm" onClick={startLoading}>
                    Iniciar
                  </Button>
                  <Button size="sm" variant="outline" onClick={stopLoading}>
                    Detener
                  </Button>
                </div>
              </div>
            </div>

            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">useApiLoading</h4>
              <p className="text-sm text-gray-600 mb-3">
                Hook especializado para operaciones de API
              </p>
              <div className="space-y-2">
                <p className="text-sm">
                  <span className="font-medium">Estado:</span> {apiLoading ? 'Llamando API' : 'Inactivo'}
                </p>
                <Button size="sm" onClick={simulateApiCall}>
                  Simular API
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Best Practices */}
      <Card>
        <CardHeader>
          <CardTitle>Mejores Prácticas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
              <p><strong>LoadingSpinner:</strong> Usar para indicadores de carga pequeños y simples</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
              <p><strong>LoadingButton:</strong> Ideal para botones que ejecutan acciones asíncronas</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
              <p><strong>LoadingOverlay:</strong> Perfecto para cubrir contenido completo durante la carga</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
              <p><strong>Skeleton:</strong> Excelente para mostrar la estructura del contenido mientras se carga</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
              <p><strong>Hooks:</strong> Usar para gestionar estados de carga de manera consistente</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
