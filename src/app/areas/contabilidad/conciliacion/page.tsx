"use client"

import { AreaLayout } from "@/components/areas/AreaLayout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MetricsGrid } from "@/components/shared/MetricsCard"
import { ActivityFeed } from "@/components/shared/ActivityFeed"
import { Building2, TrendingUp, AlertCircle, CheckCircle, Clock, Settings } from "lucide-react"

export default function ConciliacionPage() {
  const metrics = [
    {
      title: "Cuentas Conciliadas",
      value: "12",
      description: "De 15 cuentas totales",
      icon: CheckCircle,
      trend: { value: "+2 este mes", type: "increase" as const }
    },
    {
      title: "Diferencias Detectadas",
      value: "3",
      description: "Requieren revisión",
      icon: AlertCircle,
      trend: { value: "-1 desde ayer", type: "decrease" as const }
    },
    {
      title: "Tiempo Promedio",
      value: "1.5h",
      description: "Por conciliación",
      icon: Clock,
      trend: { value: "-30min", type: "decrease" as const }
    },
    {
      title: "Precisión",
      value: "98.5%",
      description: "Tasa de aciertos",
      icon: TrendingUp,
      trend: { value: "+0.5%", type: "increase" as const }
    }
  ]

  const activities = [
    {
      id: "1",
      title: "Conciliación completada",
      description: "Banco Santander - Cuenta corriente 123456789",
      timestamp: "Hace 2 horas",
      type: "success" as const
    },
    {
      id: "2",
      title: "Diferencia detectada",
      description: "Banco Davivienda - Diferencia de $15,000",
      timestamp: "Hace 4 horas",
      type: "warning" as const
    },
    {
      id: "3",
      title: "Proceso iniciado",
      description: "Banco Bogotá - Cuenta ahorros 987654321",
      timestamp: "Hace 6 horas",
      type: "info" as const
    }
  ]

  return (
    <AreaLayout 
      areaId="contabilidad" 
      moduleId="conciliacion"
      actions={
        <Button variant="outline" size="sm">
          <Settings className="mr-2 h-4 w-4" />
          Configurar
        </Button>
      }
    >
      <div className="space-y-6">
        {/* Development Notice */}
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-800">
              <AlertCircle className="h-5 w-5" />
              Módulo en Desarrollo
            </CardTitle>
            <CardDescription className="text-orange-700">
              Este módulo está actualmente en desarrollo. Las funcionalidades mostradas son ejemplos de lo que estará disponible próximamente.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-orange-100 text-orange-800 border-orange-300">
                En Desarrollo
              </Badge>
              <span className="text-sm text-orange-700">
                Fecha estimada de lanzamiento: Febrero 2024
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Metrics */}
        <MetricsGrid metrics={metrics} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Main Content */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-blue-500" />
                Conciliación Bancaria Automática
              </CardTitle>
              <CardDescription>
                Automatización del proceso de conciliación entre registros contables y extractos bancarios
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Funcionalidades Planeadas:</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Importación automática de extractos bancarios
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Coincidencia automática de transacciones
                    </li>
                    <li className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-yellow-500" />
                      Detección de diferencias y excepciones
                    </li>
                    <li className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-yellow-500" />
                      Generación de reportes de conciliación
                    </li>
                    <li className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-yellow-500" />
                      Integración con múltiples bancos
                    </li>
                  </ul>
                </div>
                
                <div className="pt-4 border-t">
                  <h4 className="font-semibold mb-2">Beneficios Esperados:</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="font-medium text-green-600">Reducción de Tiempo</p>
                      <p className="text-gray-600">80% menos tiempo manual</p>
                    </div>
                    <div>
                      <p className="font-medium text-blue-600">Mayor Precisión</p>
                      <p className="text-gray-600">99%+ de precisión</p>
                    </div>
                    <div>
                      <p className="font-medium text-purple-600">Automatización</p>
                      <p className="text-gray-600">Proceso 24/7</p>
                    </div>
                    <div>
                      <p className="font-medium text-orange-600">Trazabilidad</p>
                      <p className="text-gray-600">Auditoría completa</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Activity Feed */}
          <ActivityFeed 
            title="Actividad de Conciliación"
            description="Historial de procesos de conciliación"
            activities={activities}
          />
        </div>

        {/* Technical Specifications */}
        <Card>
          <CardHeader>
            <CardTitle>Especificaciones Técnicas</CardTitle>
            <CardDescription>
              Detalles técnicos del módulo de conciliación bancaria
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-semibold mb-3">Formatos Soportados</h4>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• Archivos Excel (.xlsx, .xls)</li>
                  <li>• CSV delimitado</li>
                  <li>• PDF con OCR</li>
                  <li>• Archivos de texto plano</li>
                  <li>• API bancarias directas</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-3">Algoritmos</h4>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• Coincidencia por monto exacto</li>
                  <li>• Coincidencia por fecha</li>
                  <li>• Análisis de texto descriptivo</li>
                  <li>• Machine Learning para patrones</li>
                  <li>• Validación cruzada</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-3">Integraciones</h4>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• Sistema contable principal</li>
                  <li>• APIs bancarias</li>
                  <li>• Módulo de reportes</li>
                  <li>• Sistema de notificaciones</li>
                  <li>• Auditoría y logs</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AreaLayout>
  )
}
