"use client"

import { ReactNode } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Home } from "lucide-react"
import { getAreaById, getModuleById, areasConfig } from "@/lib/areas-config"
import { cn } from "@/lib/utils"

interface AreaLayoutProps {
  children: ReactNode
  areaId: string
  moduleId?: string
  title?: string
  description?: string
  actions?: ReactNode
  className?: string
}

export function AreaLayout({
  children,
  areaId,
  moduleId,
  title,
  description,
  actions,
  className
}: AreaLayoutProps) {
  const pathname = usePathname()
  const area = getAreaById(areaId)
  const module = moduleId ? getModuleById(areaId, moduleId) : undefined

  if (!area) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Área no encontrada</CardTitle>
            <CardDescription>
              El área solicitada no existe o no está disponible.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/">
              <Button>
                <Home className="mr-2 h-4 w-4" />
                Volver al inicio
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  const AreaIcon = area.icon
  const ModuleIcon = module?.icon

  const getAreaColorClass = (color: string) => {
    const colorMap = {
      blue: 'text-blue-600 bg-blue-50 border-blue-200',
      green: 'text-green-600 bg-green-50 border-green-200',
      orange: 'text-orange-600 bg-orange-50 border-orange-200',
      purple: 'text-purple-600 bg-purple-50 border-purple-200'
    }
    return colorMap[color as keyof typeof colorMap] || colorMap.blue
  }

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-300'
      case 'development':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      case 'planned':
        return 'bg-gray-100 text-gray-800 border-gray-300'
      default:
        return 'bg-blue-100 text-blue-800 border-blue-300'
    }
  }

  const getStatusText = (status?: string) => {
    switch (status) {
      case 'active':
        return 'Activo'
      case 'development':
        return 'En Desarrollo'
      case 'planned':
        return 'Planificado'
      default:
        return 'Disponible'
    }
  }

  return (
    <div className={cn("min-h-screen bg-gray-50/50", className)}>
      {/* Header */}
      <div className="border-b bg-white">
        <div className="container mx-auto px-4 py-4">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <Link href="/" className="hover:text-foreground transition-colors">
              Inicio
            </Link>
            <span>/</span>
            <Link 
              href={`/areas/${area.id}`} 
              className="hover:text-foreground transition-colors"
            >
              {area.name}
            </Link>
            {module && (
              <>
                <span>/</span>
                <span className="text-foreground font-medium">{module.name}</span>
              </>
            )}
          </div>

          {/* Header Content */}
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              {/* Area Icon */}
              <div className={cn(
                "p-3 rounded-xl border-2",
                getAreaColorClass(area.color)
              )}>
                {ModuleIcon ? (
                  <ModuleIcon className="h-8 w-8" />
                ) : (
                  <AreaIcon className="h-8 w-8" />
                )}
              </div>

              {/* Title and Description */}
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl font-bold text-gray-900">
                    {title || module?.name || area.name}
                  </h1>
                  {module?.status && (
                    <Badge 
                      variant="outline" 
                      className={getStatusColor(module.status)}
                    >
                      {getStatusText(module.status)}
                    </Badge>
                  )}
                </div>
                <p className="text-lg text-muted-foreground max-w-2xl">
                  {description || module?.description || area.description}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {actions}
              <Link href={module ? `/areas/${area.id}` : "/"}>
                <Button variant="outline" size="sm">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  {module ? `Volver a ${area.name}` : "Volver al inicio"}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar and Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <AreaIcon className="h-5 w-5" />
                  {area.name}
                </CardTitle>
                <CardDescription className="text-sm">
                  Módulos disponibles
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <nav className="space-y-1">
                  {area.modules.map((mod) => {
                    const ModIcon = mod.icon
                    const isActive = pathname === mod.href
                    
                    return (
                      <Link key={mod.id} href={mod.href}>
                        <div className={cn(
                          "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                          isActive 
                            ? "bg-primary text-primary-foreground" 
                            : "hover:bg-muted text-muted-foreground hover:text-foreground",
                          mod.status === 'planned' && "opacity-50 cursor-not-allowed"
                        )}>
                          <ModIcon className="h-4 w-4 flex-shrink-0" />
                          <span className="truncate">{mod.name}</span>
                          {mod.status && mod.status !== 'active' && (
                            <Badge 
                              variant="secondary" 
                              className="ml-auto text-xs px-1.5 py-0.5"
                            >
                              {mod.status === 'development' ? 'Dev' : 'Plan'}
                            </Badge>
                          )}
                        </div>
                      </Link>
                    )
                  })}
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

// Breadcrumb component reutilizable
interface BreadcrumbProps {
  items: Array<{
    label: string
    href?: string
  }>
  className?: string
}

export function Breadcrumb({ items, className }: BreadcrumbProps) {
  return (
    <nav className={cn("flex items-center space-x-2 text-sm text-muted-foreground", className)}>
      {items.map((item, index) => (
        <div key={index} className="flex items-center">
          {index > 0 && <span className="mx-2">/</span>}
          {item.href ? (
            <Link href={item.href} className="hover:text-foreground transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className="text-foreground font-medium">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  )
}
