"use client"

import { MainLayout } from "@/components/MainLayout"
import { AreasNavigation } from "@/components/navigation/AreasNavigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function AreasPage() {
  return (
    <MainLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            Áreas del Sistema
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Selecciona el área que deseas acceder para ver todos los módulos disponibles
          </p>
        </div>

        {/* Areas Navigation */}
        <AreasNavigation />

        {/* Info Card */}
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle>Organización por Áreas</CardTitle>
            <CardDescription>
              El sistema está organizado en cuatro áreas principales para facilitar la navegación y el acceso a las funcionalidades específicas de cada departamento.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-semibold mb-2">🧮 Contabilidad</h4>
                <p className="text-muted-foreground">
                  Módulos relacionados con la gestión contable, automatización F2X, conciliación bancaria y reportes financieros.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">🏦 Tesorería</h4>
                <p className="text-muted-foreground">
                  Gestión de flujo de efectivo, cartera de clientes, programación de pagos y conciliación bancaria.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">🚛 Logística</h4>
                <p className="text-muted-foreground">
                  Control de inventarios, gestión de almacenes, órdenes de compra y reportes de movimientos.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">📄 Facturación</h4>
                <p className="text-muted-foreground">
                  Emisión de facturas electrónicas, gestión de clientes, notas de crédito y análisis de ventas.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}
