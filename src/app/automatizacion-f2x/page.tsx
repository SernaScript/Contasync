"use client"

import { MainLayout } from "@/components/MainLayout"
import { LoginForm } from "@/components/LoginForm"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Clock, CheckCircle, AlertCircle } from "lucide-react"

export default function AutomatizacionF2X() {
  const handleFormSubmit = (data: any) => {
    console.log('Datos del formulario F2X:', data)
    // Aquí puedes agregar la lógica para procesar los datos del formulario
    alert('Procesando automatización F2X...')
  }

  return (
    <MainLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Automatización F2X
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Procesamiento automático de documentos F2X con validación y análisis de datos
            </p>
          </div>
          <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-secondary text-secondary-foreground">
            <FileText className="mr-1 h-3 w-3" />
            Módulo Activo
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulario Principal */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Configuración de Proceso F2X</CardTitle>
                <CardDescription>
                  Ingrese los parámetros necesarios para iniciar el procesamiento automático
                </CardDescription>
              </CardHeader>
              <CardContent>
                <LoginForm 
                  onSubmit={handleFormSubmit}
                  title=""
                />
              </CardContent>
            </Card>
          </div>

          {/* Panel de Estado */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Estado del Sistema</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Conexión a BD: Activa</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Servicio F2X: Operativo</span>
                </div>
                <div className="flex items-center space-x-2">
                  <AlertCircle className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm">Cola de procesamiento: 3 pendientes</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Estadísticas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Procesados hoy:</span>
                  <span className="font-semibold">127</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Tiempo promedio:</span>
                  <span className="font-semibold">2.3 min</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Éxito:</span>
                  <span className="font-semibold text-green-600">98.5%</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Procesos Recientes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-2 text-sm">
                  <Clock className="h-3 w-3 text-gray-400" />
                  <span>10:30 - Proceso completado</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Clock className="h-3 w-3 text-gray-400" />
                  <span>10:25 - Validación exitosa</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Clock className="h-3 w-3 text-gray-400" />
                  <span>10:20 - Iniciando proceso</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Información adicional */}
        <Card>
          <CardHeader>
            <CardTitle>Información del Módulo F2X</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
              <div>
                <h4 className="font-semibold mb-2">Funcionalidades</h4>
                <ul className="space-y-1 text-gray-600">
                  <li>• Validación automática de datos</li>
                  <li>• Procesamiento en lotes</li>
                  <li>• Generación de reportes</li>
                  <li>• Notificaciones en tiempo real</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Formatos Soportados</h4>
                <ul className="space-y-1 text-gray-600">
                  <li>• XML F2X</li>
                  <li>• CSV estructurado</li>
                  <li>• JSON normalizado</li>
                  <li>• Excel (.xlsx)</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Validaciones</h4>
                <ul className="space-y-1 text-gray-600">
                  <li>• Formato de NIT</li>
                  <li>• Rangos de fechas</li>
                  <li>• Integridad de datos</li>
                  <li>• Duplicados</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Salidas</h4>
                <ul className="space-y-1 text-gray-600">
                  <li>• Reportes PDF</li>
                  <li>• Archivos procesados</li>
                  <li>• Logs detallados</li>
                  <li>• Estadísticas</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}
