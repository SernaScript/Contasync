"use client"

import { MainLayout } from "@/components/MainLayout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { 
  Download,
  FileText,
  Settings,
  Users,
  ArrowRight,
  CheckCircle,
  Clock,
  AlertCircle
} from "lucide-react"

// Module configuration for better maintainability
const MODULES = [
  {
    id: 'invoice-downloads',
    title: 'Descarga de Facturas',
    description: 'Descarga automática de facturas desde proveedores y sistemas externos',
    icon: Download,
    href: '/services/dian-downloads',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    status: 'active',
    lastUpdate: 'Hace 2 horas'
  },
  {
    id: 'invoice-management',
    title: 'Gestión de Facturas',
    description: 'Visualiza, procesa y envía facturas al sistema ERP',
    icon: FileText,
    href: '/services/invoice-automation',
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    status: 'active',
    lastUpdate: 'Hace 1 hora'
  },
  {
    id: 'configuration',
    title: 'Configuración',
    description: 'Administra la configuración del sistema y parámetros generales',
    icon: Settings,
    href: '/settings/configuracion',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    status: 'active',
    lastUpdate: 'Hace 3 días'
  },
  {
    id: 'user-management',
    title: 'Gestión de Usuarios',
    description: 'Administra usuarios, roles y permisos del sistema',
    icon: Users,
    href: '/users',
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    status: 'active',
    lastUpdate: 'Hace 1 día'
  }
] as const

// Status indicator component
const StatusIndicator = ({ status, lastUpdate }: { status: string; lastUpdate: string }) => (
  <div className="flex items-center gap-2 text-sm">
    <div className="flex items-center gap-1">
      <CheckCircle className="h-4 w-4 text-green-500" />
      <span className="text-green-700">{status}</span>
    </div>
    <span className="text-gray-500">•</span>
    <div className="flex items-center gap-1 text-gray-500">
      <Clock className="h-3 w-3" />
      <span>{lastUpdate}</span>
    </div>
  </div>
)

// Module card component
const ModuleCard = ({ module }: { module: typeof MODULES[number] }) => {
  const IconComponent = module.icon
  
  return (
    <Card className="group hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className={`p-2 rounded-lg ${module.bgColor}`}>
            <IconComponent className={`h-6 w-6 ${module.color}`} />
          </div>
          <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
        </div>
        <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
          {module.title}
        </CardTitle>
        <CardDescription className="text-sm text-gray-600 dark:text-gray-300">
          {module.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <StatusIndicator status={module.status} lastUpdate={module.lastUpdate} />
        <Link href={module.href} className="block mt-4">
          <Button className="w-full" variant="outline">
            Acceder al módulo
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}

// System status component
const SystemStatus = () => (
  <Card className="border-l-4 border-l-green-500">
    <CardHeader className="pb-3">
      <CardTitle className="text-lg flex items-center gap-2">
        <CheckCircle className="h-5 w-5 text-green-500" />
        Estado del Sistema
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">100%</div>
          <div className="text-gray-500">Disponibilidad</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">4/4</div>
          <div className="text-gray-500">Módulos Activos</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600">24/7</div>
          <div className="text-gray-500">Monitoreo</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">OK</div>
          <div className="text-gray-500">Conexiones</div>
        </div>
      </div>
    </CardContent>
  </Card>
)

export default function Dashboard() {
  return (
    <MainLayout>
      <div className="space-y-8">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            Panel de Control
          </h1>
          
        </div>

        {/* System Status */}
        <SystemStatus />

        {/* Main Modules Grid */}
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Módulos Principales
            </h2>
            <p className="text-muted-foreground">
              Accede a las funcionalidades principales del sistema
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {MODULES.map((module) => (
              <ModuleCard key={module.id} module={module} />
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Acciones Rápidas</CardTitle>
            <CardDescription>
              Funciones de uso frecuente para mayor productividad
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-4">
            <Link href="/services/dian-downloads">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                <Download className="mr-2 h-4 w-4" />
                Descargar Facturas
              </Button>
            </Link>
            <Link href="/services/invoice-automation">
              <Button size="lg" className="bg-green-600 hover:bg-green-700">
                <FileText className="mr-2 h-4 w-4" />
                Procesar Facturas
              </Button>
            </Link>
            <Link href="/settings/configuracion">
              <Button variant="outline" size="lg">
                <Settings className="mr-2 h-4 w-4" />
                Configuración
              </Button>
            </Link>
            <Link href="/users">
              <Button variant="outline" size="lg">
                <Users className="mr-2 h-4 w-4" />
                Usuarios
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}
