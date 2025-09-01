"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import { LoadingSpinner } from "./loading-spinner"

export interface PageLoaderProps {
  children: React.ReactNode
  className?: string
}

const PageLoader = React.forwardRef<HTMLDivElement, PageLoaderProps>(
  ({ children, className }, ref) => {
    const pathname = usePathname()
    const [isLoading, setIsLoading] = React.useState(false)
    const [loadingText, setLoadingText] = React.useState("")

    React.useEffect(() => {
      const handleStart = () => {
        setIsLoading(true)
        setLoadingText("Cargando página...")
      }

      const handleComplete = () => {
        setIsLoading(false)
      }

      // Simular carga inicial
      setIsLoading(true)
      const timer = setTimeout(() => {
        setIsLoading(false)
      }, 800)

      return () => {
        clearTimeout(timer)
      }
    }, [pathname])

    if (isLoading) {
      return (
        <div
          ref={ref}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-background/95 backdrop-blur-sm"
        >
          <div className="flex flex-col items-center gap-6 p-8 rounded-2xl bg-card border shadow-2xl">
            <LoadingSpinner
              size="2xl"
              variant="default"
              text={loadingText}
              textPosition="bottom"
            />
            <div className="text-center">
              <h3 className="text-lg font-semibold text-foreground">
                Cargando...
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                Por favor espera mientras se carga el contenido
              </p>
            </div>
          </div>
        </div>
      )
    }

    return <div className={className}>{children}</div>
  }
)

PageLoader.displayName = "PageLoader"

export { PageLoader }
