"use client"

import { AreaLayout } from "@/components/layout/AreaLayout"
import { AreaModules } from "@/components/navigation/AreasNavigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Package, Truck, Building2, TrendingDown, AlertTriangle } from "lucide-react"

export default function LogisticsPage() {
  return (
    <AreaLayout areaId="logistics">
      <div className="space-y-6">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Productos en Stock
              </CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3,247</div>
              <p className="text-xs text-muted-foreground">
                +2.1% desde el mes pasado
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Órdenes Pendientes
              </CardTitle>
              <Truck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">18</div>
              <p className="text-xs text-muted-foreground">
                Para procesar hoy
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Almacenes Activos
              </CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5</div>
              <p className="text-xs text-muted-foreground">
                Ubicaciones operativas
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Stock Bajo
              </CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">
                Productos requieren reposición
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Modules Section */}
        <Card>
          <CardHeader>
            <CardTitle>Módulos de Logística</CardTitle>
            <CardDescription>
              Herramientas para la gestión de inventarios, almacenes y cadena de suministro
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AreaModules areaId="logistics" />
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Actividad Reciente</CardTitle>
            <CardDescription>
              Últimos movimientos de inventario y logística
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium">Orden de compra aprobada</p>
                    <p className="text-xs text-muted-foreground">OC-2024-001 - Proveedor Materiales XYZ</p>
                  </div>
                </div>
                <Badge variant="secondary">Hace 30 min</Badge>
              </div>
              
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium">Entrada de inventario registrada</p>
                    <p className="text-xs text-muted-foreground">Almacén Central - 150 unidades recibidas</p>
                  </div>
                </div>
                <Badge variant="secondary">Hace 2 horas</Badge>
              </div>
              
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium">Alerta de stock bajo</p>
                    <p className="text-xs text-muted-foreground">Producto ABC123 - Solo 5 unidades disponibles</p>
                  </div>
                </div>
                <Badge variant="secondary">Hace 4 horas</Badge>
              </div>

              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium">Traslado entre almacenes</p>
                    <p className="text-xs text-muted-foreground">De Almacén Central a Sucursal Norte</p>
                  </div>
                </div>
                <Badge variant="secondary">Ayer</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Inventory Insights */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Top Productos por Rotación</CardTitle>
              <CardDescription>Productos con mayor movimiento</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium">Producto A</p>
                    <p className="text-xs text-muted-foreground">SKU: PRD-001</p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-medium">450 und</span>
                    <p className="text-xs text-green-600">+15%</p>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium">Producto B</p>
                    <p className="text-xs text-muted-foreground">SKU: PRD-002</p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-medium">320 und</span>
                    <p className="text-xs text-green-600">+8%</p>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium">Producto C</p>
                    <p className="text-xs text-muted-foreground">SKU: PRD-003</p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-medium">280 und</span>
                    <p className="text-xs text-red-600">-5%</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Estado de Almacenes</CardTitle>
              <CardDescription>Capacidad y ocupación por almacén</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Almacén Central</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{width: '85%'}}></div>
                    </div>
                    <span className="text-xs text-muted-foreground">85%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Almacén Norte</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{width: '65%'}}></div>
                    </div>
                    <span className="text-xs text-muted-foreground">65%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Almacén Sur</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div className="bg-yellow-600 h-2 rounded-full" style={{width: '92%'}}></div>
                    </div>
                    <span className="text-xs text-muted-foreground">92%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AreaLayout>
  )
}
