import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const glassButtonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-white/90 hover:bg-white text-secondary border border-secondary/20 hover:shadow-float",
        primary: "bg-gradient-primary text-white hover:shadow-glow font-medium",
        secondary: "bg-gradient-secondary text-white hover:shadow-float", 
        ghost: "bg-white/60 hover:bg-white/80 text-secondary/80 hover:text-secondary border-transparent",
        outline: "border border-secondary/30 bg-white/70 hover:bg-white/90 text-secondary",
        scan: "bg-gradient-primary text-white hover:shadow-glow font-semibold hover:scale-105",
        toggle: "bg-white/80 border border-secondary/30 hover:shadow-float text-secondary hover:bg-secondary hover:text-white transition-all duration-300"
      },
      size: {
        default: "h-9 px-4 py-2 text-sm rounded-lg",
        xs: "h-6 px-2 text-xs rounded-md",
        sm: "h-7 px-3 text-xs rounded-md",
        lg: "h-10 px-6 text-sm rounded-lg",
        xl: "h-11 px-8 text-sm rounded-lg font-medium",
        icon: "h-9 w-9 rounded-lg"
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface GlassButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof glassButtonVariants> {
  asChild?: boolean
}

const GlassButton = React.forwardRef<HTMLButtonElement, GlassButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(glassButtonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
GlassButton.displayName = "GlassButton"

export { GlassButton, glassButtonVariants }