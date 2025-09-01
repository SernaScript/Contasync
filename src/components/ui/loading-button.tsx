import * as React from "react"
import { Button, type ButtonProps } from "./button"
import { LoadingSpinner } from "./loading-spinner"
import { cn } from "@/lib/utils"

export interface LoadingButtonProps extends ButtonProps {
  isLoading?: boolean
  loadingText?: string
  loadingSpinnerSize?: "sm" | "default" | "lg" | "xl" | "2xl"
  children: React.ReactNode
}

const LoadingButton = React.forwardRef<HTMLButtonElement, LoadingButtonProps>(
  ({ 
    isLoading = false, 
    loadingText, 
    loadingSpinnerSize = "sm",
    children, 
    disabled, 
    className,
    ...props 
  }, ref) => {
    const isDisabled = disabled || isLoading

    return (
      <Button
        ref={ref}
        disabled={isDisabled}
        className={cn(
          "relative",
          isLoading && "cursor-not-allowed",
          className
        )}
        {...props}
      >
        {isLoading && (
          <LoadingSpinner
            size={loadingSpinnerSize}
            variant="white"
            className="absolute inset-0 flex items-center justify-center"
          />
        )}
        <span className={cn(isLoading && "invisible")}>
          {loadingText || children}
        </span>
      </Button>
    )
  }
)

LoadingButton.displayName = "LoadingButton"

export { LoadingButton }
