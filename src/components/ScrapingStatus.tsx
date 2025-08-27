"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { RefreshCw, Download, FileText, Clock, CheckCircle, AlertTriangle } from "lucide-react"

interface ScrapingStatusProps {
  isActive?: boolean
  lastRun?: string
  totalProcessed?: number
  successRate?: number
  onRefresh?: () => void
}

export function ScrapingStatus({ 
  isActive = false, 
  lastRun = "Nunca", 
  totalProcessed = 0, 
  successRate = 0,
  onRefresh 
}: ScrapingStatusProps) {
  
  const getStatusColor = () => {
    if (isActive) return "bg-green-100 text-green-800 border-green-200"
    return "bg-gray-100 text-gray-800 border-gray-200"
  }

  const getSuccessRateColor = () => {
    if (successRate >= 95) return "text-green-600"
    if (successRate >= 80) return "text-yellow-600"
    return "text-red-600"
  }

  return (
    <div className="space-y-4">
      {/* Estado del Sistema */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Estado del Scraper</CardTitle>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onRefresh}
              className="h-8 w-8 p-0"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Estado:</span>
            <div className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor()}`}>
              {isActive ? "Ejecutándose" : "Inactivo"}
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Última ejecución:</span>
            <span className="text-sm text-gray-600">{lastRun}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Procesados hoy:</span>
            <span className="text-sm font-semibold">{totalProcessed}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Tasa de éxito:</span>
            <span className={`text-sm font-semibold ${getSuccessRateColor()}`}>
              {successRate}%
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Indicadores de Servicio */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Servicios</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span className="text-sm">Playwright: Operativo</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span className="text-sm">Chromium: Instalado</span>
          </div>
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
            <span className="text-sm">Flypass: Conectado</span>
          </div>
        </CardContent>
      </Card>

      {/* Actividad Reciente */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Actividad Reciente</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center space-x-2 text-sm">
            <Clock className="h-3 w-3 text-gray-400" />
            <span>Sistema iniciado correctamente</span>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <FileText className="h-3 w-3 text-blue-400" />
            <span>Componentes cargados</span>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <CheckCircle className="h-3 w-3 text-green-400" />
            <span>Listo para procesar</span>
          </div>
        </CardContent>
      </Card>

      {/* Acciones Rápidas */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Acciones</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button variant="outline" className="w-full justify-start" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Ver Descargas
          </Button>
          <Button variant="outline" className="w-full justify-start" size="sm">
            <FileText className="mr-2 h-4 w-4" />
            Ver Logs
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
