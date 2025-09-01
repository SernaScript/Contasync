import * as React from "react"
import { cn } from "@/lib/utils"

const Skeleton = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "animate-pulse rounded-md bg-muted",
      className
    )}
    {...props}
  />
))
Skeleton.displayName = "Skeleton"

// Variantes predefinidas de skeleton
export const SkeletonVariants = {
  // Texto
  text: "h-4 w-full",
  textSm: "h-3 w-3/4",
  textLg: "h-6 w-full",
  textXl: "h-8 w-full",
  
  // Títulos
  title: "h-6 w-3/4",
  titleLg: "h-8 w-2/3",
  
  // Avatar
  avatar: "h-10 w-10 rounded-full",
  avatarLg: "h-16 w-16 rounded-full",
  avatarSm: "h-8 w-8 rounded-full",
  
  // Botones
  button: "h-9 w-20",
  buttonLg: "h-10 w-24",
  buttonSm: "h-8 w-16",
  
  // Cards
  card: "h-32 w-full",
  cardSm: "h-24 w-full",
  cardLg: "h-48 w-full",
  
  // Inputs
  input: "h-9 w-full",
  inputSm: "h-8 w-full",
  inputLg: "h-10 w-full",
  
  // Tablas
  tableRow: "h-12 w-full",
  tableCell: "h-4 w-20",
  
  // Listas
  listItem: "h-16 w-full",
  listItemSm: "h-12 w-full",
  
  // Imágenes
  image: "h-48 w-full",
  imageSm: "h-24 w-full",
  imageLg: "h-64 w-full",
  
  // Badges
  badge: "h-5 w-16",
  badgeSm: "h-4 w-12",
}

// Componente para crear múltiples skeletons
export const SkeletonGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    count?: number
    className?: string
    skeletonClassName?: string
  }
>(({ count = 3, className, skeletonClassName, ...props }, ref) => (
  <div ref={ref} className={cn("space-y-3", className)} {...props}>
    {Array.from({ length: count }).map((_, index) => (
      <Skeleton
        key={index}
        className={cn("h-4 w-full", skeletonClassName)}
      />
    ))}
  </div>
))

SkeletonGroup.displayName = "SkeletonGroup"

// Componente para skeleton de tabla
export const TableSkeleton = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    rows?: number
    columns?: number
  }
>(({ rows = 5, columns = 4, className, ...props }, ref) => (
  <div ref={ref} className={cn("space-y-2", className)} {...props}>
    {/* Header */}
    <div className="flex gap-4">
      {Array.from({ length: columns }).map((_, index) => (
        <Skeleton
          key={`header-${index}`}
          className="h-6 w-24"
        />
      ))}
    </div>
    
    {/* Rows */}
    {Array.from({ length: rows }).map((_, rowIndex) => (
      <div key={`row-${rowIndex}`} className="flex gap-4">
        {Array.from({ length: columns }).map((_, colIndex) => (
          <Skeleton
            key={`cell-${rowIndex}-${colIndex}`}
            className="h-4 w-20"
          />
        ))}
      </div>
    ))}
  </div>
))

TableSkeleton.displayName = "TableSkeleton"

// Componente para skeleton de card
export const CardSkeleton = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    showImage?: boolean
    showActions?: boolean
  }
>(({ showImage = true, showActions = true, className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-lg border bg-card p-6 space-y-4",
      className
    )}
    {...props}
  >
    {showImage && (
      <Skeleton className="h-32 w-full" />
    )}
    
    <div className="space-y-2">
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
    </div>
    
    {showActions && (
      <div className="flex gap-2">
        <Skeleton className="h-9 w-20" />
        <Skeleton className="h-9 w-16" />
      </div>
    )}
  </div>
))

CardSkeleton.displayName = "CardSkeleton"

export { Skeleton }
