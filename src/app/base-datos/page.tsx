"use client"

import { MainLayout } from "@/components/MainLayout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Database } from "lucide-react"

export default function BaseDatos() {
  return (
    <MainLayout>
      <div className="space-y-8">
        <div className="flex items-center gap-2">
          <Database className="h-8 w-8 text-orange-500" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Base de Datos
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Consultas y administración de la base de datos
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
              El módulo de base de datos incluirá consultas avanzadas, optimización y monitoreo de rendimiento.
            </p>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}
