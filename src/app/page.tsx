"use client"

import { MainLayout } from "@/components/MainLayout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { 
  FileText, 
  BarChart3, 
  Users, 
  Database, 
  Settings,
  Zap,
  Shield,
  Clock
} from "lucide-react"

export default function Home() {
  return (
    <MainLayout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            Bienvenido al Sistema TYVG
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Plataforma integral para la automatización de procesos, gestión de datos y reportes empresariales
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Procesos Automatizados
              </CardTitle>
              <Zap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24</div>
              <p className="text-xs text-muted-foreground">
                +15% desde el mes pasado
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Tiempo Ahorrado
              </CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">156h</div>
              <p className="text-xs text-muted-foreground">
                Este mes
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Nivel de Seguridad
              </CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">99.9%</div>
              <p className="text-xs text-muted-foreground">
                Disponibilidad del sistema
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-500" />
                Automatización F2X
              </CardTitle>
              <CardDescription>
                Procesamiento automático de documentos F2X con validación de datos y generación de reportes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/automatizacion-f2x">
                <Button className="w-full">
                  Acceder al Módulo
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-green-500" />
                Reportes Avanzados
              </CardTitle>
              <CardDescription>
                Generación de reportes personalizados con análisis de datos en tiempo real
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/reportes">
                <Button variant="outline" className="w-full">
                  Ver Reportes
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-purple-500" />
                Gestión de Usuarios
              </CardTitle>
              <CardDescription>
                Administración completa de usuarios, permisos y roles del sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/usuarios">
                <Button variant="outline" className="w-full">
                  Gestionar Usuarios
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5 text-orange-500" />
                Base de Datos
              </CardTitle>
              <CardDescription>
                Consultas avanzadas y administración de la base de datos empresarial
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/base-datos">
                <Button variant="outline" className="w-full">
                  Acceder a BD
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-gray-500" />
                Configuración
              </CardTitle>
              <CardDescription>
                Configuración del sistema, parámetros y preferencias personalizadas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/configuracion">
                <Button variant="outline" className="w-full">
                  Configurar
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow border-dashed">
            <CardHeader>
              <CardTitle className="text-gray-500">
                Próximamente
              </CardTitle>
              <CardDescription>
                Nuevas funcionalidades en desarrollo para mejorar tu experiencia
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="ghost" className="w-full" disabled>
                En Desarrollo
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Acciones Rápidas</CardTitle>
            <CardDescription>
              Accede directamente a las funciones más utilizadas
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-4">
            <Link href="/automatizacion-f2x">
              <Button size="lg">
                <FileText className="mr-2 h-4 w-4" />
                Nueva Automatización F2X
              </Button>
            </Link>
            <Link href="/reportes">
              <Button variant="outline" size="lg">
                <BarChart3 className="mr-2 h-4 w-4" />
                Generar Reporte
              </Button>
            </Link>
            <Link href="/usuarios">
              <Button variant="outline" size="lg">
                <Users className="mr-2 h-4 w-4" />
                Agregar Usuario
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}
