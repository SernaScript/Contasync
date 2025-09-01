import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const spinnerVariants = cva(
  "animate-spin rounded-full border-2 border-current border-t-transparent",
  {
    variants: {
      size: {
        sm: "h-4 w-4",
        default: "h-6 w-6",
        lg: "h-8 w-8",
        xl: "h-12 w-12",
        "2xl": "h-16 w-16",
      },
      variant: {
        default: "text-primary",
        secondary: "text-secondary-foreground",
        muted: "text-muted-foreground",
        white: "text-white",
      },
    },
    defaultVariants: {
      size: "default",
      variant: "default",
    },
  }
)

export interface LoadingSpinnerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof spinnerVariants> {
  text?: string
  textPosition?: "top" | "bottom" | "left" | "right"
}

const LoadingSpinner = React.forwardRef<HTMLDivElement, LoadingSpinnerProps>(
  ({ className, size, variant, text, textPosition = "bottom", ...props }, ref) => {
    const containerClasses = cn(
      "flex items-center gap-2",
      {
        "flex-col": textPosition === "top" || textPosition === "bottom",
        "flex-row": textPosition === "left" || textPosition === "right",
        "flex-col-reverse": textPosition === "top",
        "flex-row-reverse": textPosition === "left",
      },
      className
    )

    return (
      <div ref={ref} className={containerClasses} {...props}>
        <div className={cn(spinnerVariants({ size, variant }))} />
        {text && (
          <span className="text-sm text-muted-foreground animate-pulse">
            {text}
          </span>
        )}
      </div>
    )
  }
)

LoadingSpinner.displayName = "LoadingSpinner"

export { LoadingSpinner, spinnerVariants }
