"use client"

import { MainLayout } from "@/components/MainLayout"
import { LoginForm } from "@/components/LoginForm"
import { ScrapingStatus } from "@/components/ScrapingStatus"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Clock, CheckCircle, AlertCircle, Zap, Shield, Database } from "lucide-react"

export default function AutomatizacionF2X() {
  const handleFormSubmit = (data: any) => {
    console.log('Datos del formulario F2X:', data)
  }

  const handleRefreshStatus = () => {
    console.log('Refrescando estado del sistema...')
    // Aquí podrías agregar lógica para actualizar el estado en tiempo real
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
              <CardHeader>              <CardTitle>Configuración de Proceso F2X</CardTitle>
              <CardDescription>
                Complete el NIT, contraseña y seleccione el rango de fechas para iniciar el procesamiento automático
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
            <ScrapingStatus 
              isActive={false}
              lastRun="Nunca"
              totalProcessed={0}
              successRate={0}
              onRefresh={handleRefreshStatus}
            />
          </div>
        </div>

        {/* Información adicional */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-blue-500" />
                Proceso de Scraping F2X
              </CardTitle>
              <CardDescription>
                Automatización completa del proceso de descarga de facturas desde Flypass
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-sm">
                <div>
                  <h4 className="font-semibold mb-2">¿Qué hace este proceso?</h4>
                  <ul className="space-y-1 text-gray-600 ml-4">
                    <li>• Se conecta automáticamente a Flypass</li>
                    <li>• Autentica con NIT y contraseña</li>
                    <li>• Navega a la sección de facturas</li>
                    <li>• Aplica el rango de fechas seleccionado</li>
                    <li>• Descarga el archivo con las facturas del período</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Tiempo estimado:</h4>
                  <p className="text-gray-600">2-3 minutos por ejecución</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-green-500" />
                Seguridad y Validaciones
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-sm">
                <div>
                  <h4 className="font-semibold mb-2">Medidas de Seguridad</h4>
                  <ul className="space-y-1 text-gray-600 ml-4">
                    <li>• Las credenciales no se almacenan</li>
                    <li>• Conexión HTTPS segura</li>
                    <li>• Validación de formato de datos</li>
                    <li>• Manejo de errores robusto</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Validaciones</h4>
                  <ul className="space-y-1 text-gray-600 ml-4">
                    <li>• Formato válido de NIT</li>
                    <li>• Rango de fechas coherente</li>
                    <li>• Disponibilidad del servicio</li>
                    <li>• Integridad de descarga</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Información técnica */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5 text-purple-500" />
              Información Técnica del Módulo F2X
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
              <div>
                <h4 className="font-semibold mb-2">Tecnologías</h4>
                <ul className="space-y-1 text-gray-600">
                  <li>• Playwright WebDriver</li>
                  <li>• TypeScript/Node.js</li>
                  <li>• Next.js API Routes</li>
                  <li>• Chromium Browser</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Formatos Soportados</h4>
                <ul className="space-y-1 text-gray-600">
                  <li>• Archivos Excel (.xlsx)</li>
                  <li>• Datos CSV</li>
                  <li>• Reportes PDF</li>
                  <li>• Logs JSON</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Capacidades</h4>
                <ul className="space-y-1 text-gray-600">
                  <li>• Procesamiento automático</li>
                  <li>• Selector de rango de fechas</li>
                  <li>• Manejo de errores</li>
                  <li>• Reintentos inteligentes</li>
                  <li>• Capturas de pantalla</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Salidas</h4>
                <ul className="space-y-1 text-gray-600">
                  <li>• Archivo descargado</li>
                  <li>• Log de actividades</li>
                  <li>• Reporte de estado</li>
                  <li>• Métricas de tiempo</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}
