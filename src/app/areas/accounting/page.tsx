"use client"

import { AreaLayout } from "@/components/layout/AreaLayout"
import { AreaModules } from "@/components/navigation/AreasNavigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calculator, TrendingUp, FileBarChart, Users } from "lucide-react"

export default function AccountingPage() {
  return (
    <AreaLayout areaId="accounting">
      <div className="space-y-6">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Procesos F2X
              </CardTitle>
              <Calculator className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">156</div>
              <p className="text-xs text-muted-foreground">
                Documentos procesados este mes
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Conciliaciones
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">
                Cuentas conciliadas
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Reportes Generados
              </CardTitle>
              <FileBarChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">48</div>
              <p className="text-xs text-muted-foreground">
                Este mes
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Modules Section */}
        <Card>
          <CardHeader>
            <CardTitle>Módulos de Contabilidad</CardTitle>
            <CardDescription>
              Accede a todas las herramientas contables y financieras disponibles
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AreaModules areaId="accounting" />
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Actividad Reciente</CardTitle>
            <CardDescription>
              Últimas acciones realizadas en el área de contabilidad
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium">Procesamiento F2X completado</p>
                    <p className="text-xs text-muted-foreground">Archivo: facturas_enero_2024.xlsx</p>
                  </div>
                </div>
                <Badge variant="secondary">Hace 2 horas</Badge>
              </div>
              
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium">Conciliación bancaria iniciada</p>
                    <p className="text-xs text-muted-foreground">Banco Santander - Cuenta 123456789</p>
                  </div>
                </div>
                <Badge variant="secondary">Hace 4 horas</Badge>
              </div>
              
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium">Reporte financiero generado</p>
                    <p className="text-xs text-muted-foreground">Balance General - Enero 2024</p>
                  </div>
                </div>
                <Badge variant="secondary">Ayer</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AreaLayout>
  )
}
