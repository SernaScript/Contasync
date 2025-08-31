"use client"

import { AreaLayout } from "@/components/areas/AreaLayout"
import { AreaModules } from "@/components/areas/AreasNavigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText, Users, Receipt, TrendingUp, DollarSign } from "lucide-react"

export default function FacturacionPage() {
  return (
    <AreaLayout areaId="facturacion">
      <div className="space-y-6">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Facturas del Mes
              </CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,247</div>
              <p className="text-xs text-muted-foreground">
                +12% desde el mes pasado
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Clientes Activos
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">342</div>
              <p className="text-xs text-muted-foreground">
                +8 nuevos este mes
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Valor Facturado
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$3.2M</div>
              <p className="text-xs text-muted-foreground">
                +18% desde el mes pasado
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Notas de Crédito
              </CardTitle>
              <Receipt className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">23</div>
              <p className="text-xs text-muted-foreground">
                -15% desde el mes pasado
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Modules Section */}
        <Card>
          <CardHeader>
            <CardTitle>Módulos de Facturación</CardTitle>
            <CardDescription>
              Herramientas para la gestión completa del proceso de facturación electrónica
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AreaModules areaId="facturacion" />
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Actividad Reciente</CardTitle>
            <CardDescription>
              Últimas facturas emitidas y movimientos del área
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium">Factura electrónica enviada</p>
                    <p className="text-xs text-muted-foreground">FE-2024-001247 - Cliente ABC Corp - $125,000</p>
                  </div>
                </div>
                <Badge variant="secondary">Hace 15 min</Badge>
              </div>
              
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium">Cliente nuevo registrado</p>
                    <p className="text-xs text-muted-foreground">XYZ Servicios Ltda - NIT: 900123456-1</p>
                  </div>
                </div>
                <Badge variant="secondary">Hace 1 hora</Badge>
              </div>
              
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium">Nota de crédito procesada</p>
                    <p className="text-xs text-muted-foreground">NC-2024-0045 - Devolución parcial - $15,000</p>
                  </div>
                </div>
                <Badge variant="secondary">Hace 3 horas</Badge>
              </div>

              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium">Reporte de ventas generado</p>
                    <p className="text-xs text-muted-foreground">Análisis mensual - Enero 2024</p>
                  </div>
                </div>
                <Badge variant="secondary">Hace 6 horas</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sales Insights */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Top Clientes por Facturación</CardTitle>
              <CardDescription>Clientes con mayor volumen de compras</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium">Corporación ABC S.A.</p>
                    <p className="text-xs text-muted-foreground">NIT: 800123456-1</p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-medium">$450,000</span>
                    <p className="text-xs text-green-600">+25%</p>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium">Servicios XYZ Ltda.</p>
                    <p className="text-xs text-muted-foreground">NIT: 900234567-2</p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-medium">$320,000</span>
                    <p className="text-xs text-green-600">+18%</p>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium">Comercial DEF S.A.S.</p>
                    <p className="text-xs text-muted-foreground">NIT: 700345678-3</p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-medium">$280,000</span>
                    <p className="text-xs text-red-600">-5%</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Estado de Facturación</CardTitle>
              <CardDescription>Distribución de facturas por estado</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Facturas Pagadas</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">1,089</span>
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">87%</Badge>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Pendientes de Pago</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">134</span>
                    <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">11%</Badge>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Vencidas</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">24</span>
                    <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">2%</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Monthly Trends */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-500" />
              Tendencias de Facturación
            </CardTitle>
            <CardDescription>
              Análisis del comportamiento de ventas en los últimos meses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">Promedio Mensual</h4>
                <p className="text-2xl font-bold text-blue-600">$2.8M</p>
                <p className="text-xs text-blue-600 mt-1">Últimos 6 meses</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-2">Mejor Mes</h4>
                <p className="text-2xl font-bold text-green-600">$3.4M</p>
                <p className="text-xs text-green-600 mt-1">Diciembre 2023</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <h4 className="font-semibold text-purple-800 mb-2">Crecimiento</h4>
                <p className="text-2xl font-bold text-purple-600">+15%</p>
                <p className="text-xs text-purple-600 mt-1">Año sobre año</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AreaLayout>
  )
}
