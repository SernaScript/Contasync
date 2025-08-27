"use client"

import { MainLayout } from "@/components/MainLayout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Settings } from "lucide-react"

export default function Configuracion() {
  return (
    <MainLayout>
      <div className="space-y-8">
        <div className="flex items-center gap-2">
          <Settings className="h-8 w-8 text-gray-500" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Configuración
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Configuración del sistema y preferencias
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
              El módulo de configuración incluirá ajustes del sistema, parámetros de la aplicación y preferencias de usuario.
            </p>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}
