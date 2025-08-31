"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { areasConfig, type Area, type Module } from "@/lib/areas-config"
import { cn } from "@/lib/utils"

interface AreasNavigationProps {
  className?: string
  showDescription?: boolean
  compactMode?: boolean
}

export function AreasNavigation({ 
  className, 
  showDescription = true, 
  compactMode = false 
}: AreasNavigationProps) {
  const pathname = usePathname()
  
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

  const getAreaColorClass = (color: string) => {
    const colorMap = {
      blue: 'border-blue-200 hover:border-blue-300 hover:shadow-blue-100',
      green: 'border-green-200 hover:border-green-300 hover:shadow-green-100',
      orange: 'border-orange-200 hover:border-orange-300 hover:shadow-orange-100',
      purple: 'border-purple-200 hover:border-purple-300 hover:shadow-purple-100'
    }
    return colorMap[color as keyof typeof colorMap] || colorMap.blue
  }

  const getIconColorClass = (color: string) => {
    const colorMap = {
      blue: 'text-blue-600',
      green: 'text-green-600',
      orange: 'text-orange-600',
      purple: 'text-purple-600'
    }
    return colorMap[color as keyof typeof colorMap] || colorMap.blue
  }

  if (compactMode) {
    return (
      <div className={cn("grid grid-cols-2 md:grid-cols-4 gap-4", className)}>
        {areasConfig.map((area) => {
          const Icon = area.icon
          return (
            <Link key={area.id} href={`/areas/${area.id}`}>
              <Card className={cn(
                "hover:shadow-md transition-all cursor-pointer h-full",
                getAreaColorClass(area.color)
              )}>
                <CardContent className="p-4 text-center">
                  <Icon className={cn("h-8 w-8 mx-auto mb-2", getIconColorClass(area.color))} />
                  <h3 className="font-semibold text-sm">{area.name}</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    {area.modules.length} módulos
                  </p>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>
    )
  }

  return (
    <div className={cn("space-y-8", className)}>
      {areasConfig.map((area) => {
        const Icon = area.icon
        return (
          <div key={area.id} className="space-y-4">
            {/* Area Header */}
            <div className="flex items-center gap-3">
              <div className={cn(
                "p-2 rounded-lg border",
                getAreaColorClass(area.color)
              )}>
                <Icon className={cn("h-6 w-6", getIconColorClass(area.color))} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {area.name}
                </h2>
                {showDescription && (
                  <p className="text-muted-foreground">{area.description}</p>
                )}
              </div>
            </div>

            {/* Modules Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {area.modules.map((module) => {
                const ModuleIcon = module.icon
                const isActive = pathname === module.href
                
                return (
                  <Link key={module.id} href={module.href}>
                    <Card className={cn(
                      "hover:shadow-lg transition-all cursor-pointer h-full",
                      isActive && "ring-2 ring-blue-500 ring-offset-2",
                      getAreaColorClass(area.color)
                    )}>
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2">
                            <ModuleIcon className="h-5 w-5 text-muted-foreground" />
                            <CardTitle className="text-base">{module.name}</CardTitle>
                          </div>
                          <Badge 
                            variant="outline" 
                            className={cn("text-xs", getStatusColor(module.status))}
                          >
                            {getStatusText(module.status)}
                          </Badge>
                        </div>
                        <CardDescription className="text-sm">
                          {module.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <Button 
                          variant={isActive ? "default" : "outline"} 
                          size="sm" 
                          className="w-full"
                          disabled={module.status === 'planned'}
                        >
                          {module.status === 'planned' ? 'Próximamente' : 'Acceder'}
                        </Button>
                      </CardContent>
                    </Card>
                  </Link>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}

// Componente para mostrar solo los módulos de un área específica
interface AreaModulesProps {
  areaId: string
  className?: string
}

export function AreaModules({ areaId, className }: AreaModulesProps) {
  const area = areasConfig.find(a => a.id === areaId)
  const pathname = usePathname()
  
  if (!area) return null

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
    <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", className)}>
      {area.modules.map((module) => {
        const ModuleIcon = module.icon
        const isActive = pathname === module.href
        
        return (
          <Link key={module.id} href={module.href}>
            <Card className={cn(
              "hover:shadow-lg transition-all cursor-pointer h-full",
              isActive && "ring-2 ring-blue-500 ring-offset-2"
            )}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <ModuleIcon className="h-5 w-5 text-muted-foreground" />
                    <CardTitle className="text-base">{module.name}</CardTitle>
                  </div>
                  <Badge 
                    variant="outline" 
                    className={cn("text-xs", getStatusColor(module.status))}
                  >
                    {getStatusText(module.status)}
                  </Badge>
                </div>
                <CardDescription className="text-sm">
                  {module.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <Button 
                  variant={isActive ? "default" : "outline"} 
                  size="sm" 
                  className="w-full"
                  disabled={module.status === 'planned'}
                >
                  {module.status === 'planned' ? 'Próximamente' : 'Acceder'}
                </Button>
              </CardContent>
            </Card>
          </Link>
        )
      })}
    </div>
  )
}
