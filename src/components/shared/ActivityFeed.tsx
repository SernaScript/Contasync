"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface ActivityItem {
  id: string
  title: string
  description: string
  timestamp: string
  type: 'success' | 'info' | 'warning' | 'error'
  badge?: string
}

interface ActivityFeedProps {
  title?: string
  description?: string
  activities: ActivityItem[]
  className?: string
  maxItems?: number
}

export function ActivityFeed({
  title = "Actividad Reciente",
  description = "Últimas acciones realizadas en el sistema",
  activities,
  className,
  maxItems = 10
}: ActivityFeedProps) {
  const getActivityColor = (type: ActivityItem['type']) => {
    switch (type) {
      case 'success':
        return 'bg-green-500'
      case 'info':
        return 'bg-blue-500'
      case 'warning':
        return 'bg-orange-500'
      case 'error':
        return 'bg-red-500'
      default:
        return 'bg-gray-500'
    }
  }

  const displayedActivities = activities.slice(0, maxItems)

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {displayedActivities.map((activity) => (
            <div key={activity.id} className="flex items-center justify-between py-2">
              <div className="flex items-center gap-3">
                <div className={cn("w-2 h-2 rounded-full", getActivityColor(activity.type))}></div>
                <div>
                  <p className="text-sm font-medium">{activity.title}</p>
                  <p className="text-xs text-muted-foreground">{activity.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {activity.badge && (
                  <Badge variant="outline" className="text-xs">
                    {activity.badge}
                  </Badge>
                )}
                <Badge variant="secondary" className="text-xs">
                  {activity.timestamp}
                </Badge>
              </div>
            </div>
          ))}
          {activities.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground text-sm">
                No hay actividad reciente para mostrar
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// Componente simplificado para mostrar solo la lista de actividades
interface SimpleActivityListProps {
  activities: ActivityItem[]
  className?: string
  maxItems?: number
}

export function SimpleActivityList({
  activities,
  className,
  maxItems = 5
}: SimpleActivityListProps) {
  const getActivityColor = (type: ActivityItem['type']) => {
    switch (type) {
      case 'success':
        return 'bg-green-500'
      case 'info':
        return 'bg-blue-500'
      case 'warning':
        return 'bg-orange-500'
      case 'error':
        return 'bg-red-500'
      default:
        return 'bg-gray-500'
    }
  }

  const displayedActivities = activities.slice(0, maxItems)

  return (
    <div className={cn("space-y-3", className)}>
      {displayedActivities.map((activity) => (
        <div key={activity.id} className="flex items-center justify-between py-2">
          <div className="flex items-center gap-3">
            <div className={cn("w-2 h-2 rounded-full", getActivityColor(activity.type))}></div>
            <div>
              <p className="text-sm font-medium">{activity.title}</p>
              <p className="text-xs text-muted-foreground">{activity.description}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {activity.badge && (
              <Badge variant="outline" className="text-xs">
                {activity.badge}
              </Badge>
            )}
            <Badge variant="secondary" className="text-xs">
              {activity.timestamp}
            </Badge>
          </div>
        </div>
      ))}
      {activities.length === 0 && (
        <div className="text-center py-4">
          <p className="text-muted-foreground text-sm">
            No hay actividad para mostrar
          </p>
        </div>
      )}
    </div>
  )
}
