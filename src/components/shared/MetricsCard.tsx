"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { LucideIcon } from "lucide-react"

interface MetricsCardProps {
  title: string
  value: string | number
  description?: string
  icon?: LucideIcon
  trend?: {
    value: string
    type: 'increase' | 'decrease' | 'neutral'
  }
  className?: string
  variant?: 'default' | 'compact'
}

export function MetricsCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  className,
  variant = 'default'
}: MetricsCardProps) {
  const getTrendColor = (type: 'increase' | 'decrease' | 'neutral') => {
    switch (type) {
      case 'increase':
        return 'text-green-600'
      case 'decrease':
        return 'text-red-600'
      case 'neutral':
        return 'text-muted-foreground'
      default:
        return 'text-muted-foreground'
    }
  }

  const getTrendBadgeColor = (type: 'increase' | 'decrease' | 'neutral') => {
    switch (type) {
      case 'increase':
        return 'bg-green-100 text-green-800 border-green-300'
      case 'decrease':
        return 'bg-red-100 text-red-800 border-red-300'
      case 'neutral':
        return 'bg-gray-100 text-gray-800 border-gray-300'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  if (variant === 'compact') {
    return (
      <Card className={cn("", className)}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {Icon && <Icon className="h-5 w-5 text-muted-foreground" />}
              <div>
                <p className="text-sm font-medium">{title}</p>
                <p className="text-xs text-muted-foreground">{description}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold">{value}</p>
              {trend && (
                <Badge 
                  variant="outline" 
                  className={cn("text-xs", getTrendBadgeColor(trend.type))}
                >
                  {trend.value}
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={cn("", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          {title}
        </CardTitle>
        {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {(description || trend) && (
          <div className="flex items-center justify-between mt-1">
            {description && (
              <p className="text-xs text-muted-foreground">
                {description}
              </p>
            )}
            {trend && (
              <p className={cn("text-xs", getTrendColor(trend.type))}>
                {trend.value}
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Componente para mostrar múltiples métricas en una grilla
interface MetricsGridProps {
  metrics: Omit<MetricsCardProps, 'className'>[]
  columns?: 2 | 3 | 4
  className?: string
}

export function MetricsGrid({ 
  metrics, 
  columns = 4, 
  className 
}: MetricsGridProps) {
  const gridCols = {
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-3", 
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
  }

  return (
    <div className={cn("grid gap-4", gridCols[columns], className)}>
      {metrics.map((metric, index) => (
        <MetricsCard key={index} {...metric} />
      ))}
    </div>
  )
}
