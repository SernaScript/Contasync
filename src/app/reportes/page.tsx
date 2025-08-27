"use client"

import { MainLayout } from "@/components/MainLayout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3 } from "lucide-react"

export default function Reportes() {
  return (
    <MainLayout>
      <div className="space-y-8">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-8 w-8 text-green-500" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Reportes
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Generación y análisis de reportes empresariales
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Módulo en Desarrollo</CardTitle>
            <CardDescription>
              Esta funcionalidad estará disponible próximamente
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              El módulo de reportes incluirá análisis avanzados, gráficos interactivos y exportación de datos.
            </p>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}
