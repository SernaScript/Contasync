"use client"

import { MainLayout } from "@/components/MainLayout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { 
  Download,
  FileText,
  ArrowRight,
  Bot,
  Database
} from "lucide-react"

// Services configuration for automation and downloads
const AUTOMATION_SERVICES = [
  {
    id: 'dian-downloads',
    title: 'Descargas DIAN',
    description: 'Descarga automática de documentos de la DIAN',
    icon: Download,
    href: '/services/dian-downloads',
    color: 'text-green-600',
    bgColor: 'bg-green-50'
  },
  {
    id: 'f2x-automation',
    title: 'Automatización F2X',
    description: 'Descarga automática de facturas desde Flypass',
    icon: Bot,
    href: '/services/f2x-automation',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50'
  },
  {
    id: 'accounting-agent',
    title: 'Agente IA',
    description: 'Contabilización automática',
    icon: Bot,
    href: '/services/accounting-agent',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50'
  }
] as const


// Service card component for automation services
const ServiceCard = ({ service }: { service: typeof AUTOMATION_SERVICES[number] }) => {
  const IconComponent = service.icon
  
  return (
    <Card className="group hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className={`p-3 rounded-lg ${service.bgColor}`}>
            <IconComponent className={`h-6 w-6 ${service.color}`} />
          </div>
          <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
        </div>
        <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
          {service.title}
        </CardTitle>
        <CardDescription className="text-sm text-gray-600 dark:text-gray-300">
          {service.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <Link href={service.href} className="block mt-4">
          <Button className="w-full" variant="outline">
            Acceder
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}

// System overview component
const SystemOverview = () => (
  <Card className="border-l-4 border-l-blue-500">
    <CardHeader className="pb-3">
      <CardTitle className="text-lg flex items-center gap-2">
        <Database className="h-5 w-5 text-blue-500" />
        Contasync
      </CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-sm text-gray-600">
        Plataforma de automatización contable y fiscal. Descarga documentos de la DIAN, 
        procesa facturas con IA y contabiliza automáticamente.
      </p>
    </CardContent>
  </Card>
)

export default function Dashboard() {
  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header Section */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Panel de Control
          </h1>
        </div>

        {/* System Overview */}
        <SystemOverview />

        {/* Services Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white text-center">
            Servicios
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {AUTOMATION_SERVICES.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
