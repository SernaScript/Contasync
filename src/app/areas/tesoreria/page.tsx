"use client"

import { AreaLayout } from "@/components/areas/AreaLayout"
import { AreaModules } from "@/components/areas/AreasNavigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PiggyBank, TrendingUp, Users, Calendar } from "lucide-react"

export default function TesoreriaPage() {
  return (
    <AreaLayout areaId="tesoreria">
      <div className="space-y-6">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Saldo Total
              </CardTitle>
              <PiggyBank className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$2,450,000</div>
              <p className="text-xs text-muted-foreground">
                +5.2% desde el mes pasado
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Cartera Vencida
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$180,000</div>
              <p className="text-xs text-muted-foreground">
                -12% desde el mes pasado
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Pagos Programados
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24</div>
              <p className="text-xs text-muted-foreground">
                Esta semana
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Flujo de Caja
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+$320,000</div>
              <p className="text-xs text-muted-foreground">
                Proyección mensual
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Modules Section */}
        <Card>
          <CardHeader>
            <CardTitle>Módulos de Tesorería</CardTitle>
            <CardDescription>
              Herramientas para la gestión de flujo de efectivo y administración financiera
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AreaModules areaId="tesoreria" />
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Actividad Reciente</CardTitle>
            <CardDescription>
              Últimas transacciones y movimientos en tesorería
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium">Pago procesado exitosamente</p>
                    <p className="text-xs text-muted-foreground">Proveedor ABC S.A.S - $45,000</p>
                  </div>
                </div>
                <Badge variant="secondary">Hace 1 hora</Badge>
              </div>
              
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium">Conciliación bancaria completada</p>
                    <p className="text-xs text-muted-foreground">Banco Davivienda - Cuenta ahorros</p>
                  </div>
                </div>
                <Badge variant="secondary">Hace 3 horas</Badge>
              </div>
              
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium">Actualización de cartera</p>
                    <p className="text-xs text-muted-foreground">Cliente XYZ Ltda - Pago parcial recibido</p>
                  </div>
                </div>
                <Badge variant="secondary">Hace 5 horas</Badge>
              </div>

              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium">Programación de pagos actualizada</p>
                    <p className="text-xs text-muted-foreground">15 pagos programados para mañana</p>
                  </div>
                </div>
                <Badge variant="secondary">Ayer</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Insights */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Resumen de Cartera</CardTitle>
              <CardDescription>Estado actual de la cartera de clientes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Cartera al día</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">$1,850,000</span>
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">85%</Badge>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Vencida 1-30 días</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">$120,000</span>
                    <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">10%</Badge>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Vencida +30 días</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">$60,000</span>
                    <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">5%</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Próximos Pagos</CardTitle>
              <CardDescription>Pagos programados para esta semana</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium">Proveedores</p>
                    <p className="text-xs text-muted-foreground">Hoy</p>
                  </div>
                  <span className="text-sm font-medium">$85,000</span>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium">Servicios Públicos</p>
                    <p className="text-xs text-muted-foreground">Mañana</p>
                  </div>
                  <span className="text-sm font-medium">$25,000</span>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium">Nómina</p>
                    <p className="text-xs text-muted-foreground">Viernes</p>
                  </div>
                  <span className="text-sm font-medium">$450,000</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AreaLayout>
  )
}
