import * as React from "react"
import { cn } from "@/lib/utils"
import { LoadingSpinner } from "./loading-spinner"

export interface LoadingOverlayProps {
  isLoading: boolean
  children: React.ReactNode
  text?: string
  spinnerSize?: "sm" | "default" | "lg" | "xl" | "2xl"
  backdrop?: boolean
  className?: string
  overlayClassName?: string
}

const LoadingOverlay = React.forwardRef<HTMLDivElement, LoadingOverlayProps>(
  ({ 
    isLoading, 
    children, 
    text = "Cargando...", 
    spinnerSize = "xl",
    backdrop = true,
    className,
    overlayClassName 
  }, ref) => {
    if (!isLoading) {
      return <div className={className}>{children}</div>
    }

    return (
      <div ref={ref} className={cn("relative", className)}>
        {children}
        <div
          className={cn(
            "absolute inset-0 z-50 flex items-center justify-center",
            backdrop && "bg-background/80 backdrop-blur-sm",
            overlayClassName
          )}
        >
          <div className="flex flex-col items-center gap-4 p-6 rounded-lg bg-card/90 border shadow-lg">
            <LoadingSpinner 
              size={spinnerSize} 
              variant="default"
              text={text}
              textPosition="bottom"
            />
          </div>
        </div>
      </div>
    )
  }
)

LoadingOverlay.displayName = "LoadingOverlay"

export { LoadingOverlay }
