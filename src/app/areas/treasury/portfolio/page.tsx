"use client"

import { AreaLayout } from "@/components/layout/AreaLayout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MetricsGrid } from "@/components/shared/MetricsCard"
import { ActivityFeed } from "@/components/shared/ActivityFeed"
import { Users, DollarSign, AlertTriangle, TrendingUp, Calendar, Filter } from "lucide-react"

export default function PortfolioPage() {
  const metrics = [
    {
      title: "Cartera Total",
      value: "$2,180,000",
      description: "Saldo pendiente total",
      icon: DollarSign,
      trend: { value: "+3.2%", type: "increase" as const }
    },
    {
      title: "Clientes Activos",
      value: "142",
      description: "Con saldo pendiente",
      icon: Users,
      trend: { value: "+5 este mes", type: "increase" as const }
    },
    {
      title: "Cartera Vencida",
      value: "$180,000",
      description: "Más de 30 días",
      icon: AlertTriangle,
      trend: { value: "-12%", type: "decrease" as const }
    },
    {
      title: "Recaudo Promedio",
      value: "85%",
      description: "Tasa de cobro mensual",
      icon: TrendingUp,
      trend: { value: "+2%", type: "increase" as const }
    }
  ]

  const activities = [
    {
      id: "1",
      title: "Pago recibido",
      description: "Cliente ABC Corp - $45,000 - Factura FE-2024-001230",
      timestamp: "Hace 1 hora",
      type: "success" as const
    },
    {
      id: "2",
      title: "Cliente vencido",
      description: "XYZ Ltda - $25,000 - Vencimiento hace 15 días",
      timestamp: "Hace 3 horas",
      type: "warning" as const
    },
    {
      id: "3",
      title: "Recordatorio enviado",
      description: "Servicios DEF - Email de cobro automático",
      timestamp: "Hace 5 horas",
      type: "info" as const
    }
  ]

  return (
    <AreaLayout 
      areaId="treasury" 
      moduleId="portfolio"
      actions={
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filtros
          </Button>
          <Button size="sm">
            <Calendar className="mr-2 h-4 w-4" />
            Generar Reporte
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Development Notice */}
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-800">
              <AlertTriangle className="h-5 w-5" />
              Módulo en Desarrollo
            </CardTitle>
            <CardDescription className="text-yellow-700">
              Este módulo está en fase de desarrollo. Se están implementando las funcionalidades de gestión integral de cartera.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">
                En Desarrollo
              </Badge>
              <span className="text-sm text-yellow-700">
                Progreso: 60% completado
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Metrics */}
        <MetricsGrid metrics={metrics} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-green-500" />
                  Gestión Integral de Cartera
                </CardTitle>
                <CardDescription>
                  Sistema completo para el seguimiento y gestión de cartera de clientes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Funcionalidades en Desarrollo:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>Seguimiento de vencimientos</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>Alertas automáticas</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                        <span>Gestión de cobranza</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                        <span>Reportes de antigüedad</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span>Análisis de riesgo</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span>Integración con facturación</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Cartera Analysis */}
            <Card>
              <CardHeader>
                <CardTitle>Análisis de Cartera por Antigüedad</CardTitle>
                <CardDescription>
                  Distribución de la cartera según días de vencimiento
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <div>
                      <p className="font-medium text-green-800">Al día (0 días)</p>
                      <p className="text-sm text-green-600">85 clientes</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-800">$1,650,000</p>
                      <p className="text-sm text-green-600">75.7%</p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                    <div>
                      <p className="font-medium text-yellow-800">1-30 días</p>
                      <p className="text-sm text-yellow-600">32 clientes</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-yellow-800">$350,000</p>
                      <p className="text-sm text-yellow-600">16.1%</p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                    <div>
                      <p className="font-medium text-orange-800">31-60 días</p>
                      <p className="text-sm text-orange-600">18 clientes</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-orange-800">$120,000</p>
                      <p className="text-sm text-orange-600">5.5%</p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                    <div>
                      <p className="font-medium text-red-800">+60 días</p>
                      <p className="text-sm text-red-600">7 clientes</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-red-800">$60,000</p>
                      <p className="text-sm text-red-600">2.7%</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Activity Feed */}
            <ActivityFeed 
              title="Movimientos de Cartera"
              description="Últimos pagos y cambios"
              activities={activities}
              maxItems={5}
            />

            {/* Top Clients */}
            <Card>
              <CardHeader>
                <CardTitle>Principales Deudores</CardTitle>
                <CardDescription>
                  Clientes con mayor saldo pendiente
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium">Corporación ABC</p>
                      <p className="text-xs text-muted-foreground">15 días vencido</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold">$85,000</p>
                      <Badge variant="outline" className="text-xs bg-orange-50 text-orange-700 border-orange-200">
                        Vencido
                      </Badge>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium">Servicios XYZ</p>
                      <p className="text-xs text-muted-foreground">Al día</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold">$65,000</p>
                      <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                        Al día
                      </Badge>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium">Comercial DEF</p>
                      <p className="text-xs text-muted-foreground">5 días vencido</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold">$45,000</p>
                      <Badge variant="outline" className="text-xs bg-yellow-50 text-yellow-700 border-yellow-200">
                        Próximo
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AreaLayout>
  )
}
