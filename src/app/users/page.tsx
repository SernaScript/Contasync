"use client"

import { MainLayout } from "@/components/MainLayout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users } from "lucide-react"

export default function Usuarios() {
  return (
    <MainLayout>
      <div className="space-y-8">
        <div className="flex items-center gap-2">
          <Users className="h-8 w-8 text-purple-500" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Gestión de Usuarios
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Administración de usuarios y permisos del sistema
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
              El módulo de usuarios incluirá gestión de roles, permisos y autenticación avanzada.
            </p>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}
