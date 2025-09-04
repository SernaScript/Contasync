import * as React from "react"
import { Button, buttonVariants, type VariantProps } from "./button"
import { LoadingSpinner } from "./loading-spinner"
import { cn } from "@/lib/utils"

export interface LoadingButtonProps 
  extends React.ComponentProps<"button">,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean
  loadingText?: string
  loadingSpinnerSize?: "sm" | "default" | "lg" | "xl" | "2xl"
  asChild?: boolean
}

const LoadingButton = React.forwardRef<HTMLButtonElement, LoadingButtonProps>(
  ({ 
    isLoading = false, 
    loadingText, 
    loadingSpinnerSize = "sm",
    children, 
    disabled, 
    className,
    size,
    variant,
    asChild,
    ...props 
  }, ref) => {
    const isDisabled = disabled || isLoading

    return (
      <Button
        ref={ref}
        disabled={isDisabled}
        size={size}
        variant={variant}
        asChild={asChild}
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
