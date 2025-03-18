import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 shadow-[3px_3px_#141414]",
  {
    variants: {
      variant: {
        default:
          "bg-accent-purple text-primary hover:bg-border/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 border border-border",
        outline:
          "border border-border bg-background hover:bg-muted-green hover:text-accent-foreground",
        outlineNumber: "border border-border bg-background hover:bg-muted-green hover:text-accent-foreground shadow-none",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground shadow-none",
        link: "text-primary underline-offset-4 hover:underline shadow-none",
        accentPurple: "bg-accent-purple text-primary-foreground hover:bg-accent-purple/90 border border-border",
        accentGreen: "bg-accent-green text-primary hover:bg-accent-green/90 border border-border",
        accentPeach: "bg-accent-peach text-primary hover:bg-accent-peach/90 border border-border"
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        xsm: "h-5 rounded-md px-2 text-xs shadow-none",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9 shadow-none",
        iconShadow: "h-9 w-9",
        smallIcon: 'h-5 w-5 shadow-none',
        full: 'h-9 w-full',
        text: 'h-[max-content]'
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
