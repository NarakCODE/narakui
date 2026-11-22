"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Toggle as TogglePrimitive } from "radix-ui"

const toggleVariants = cva(
  "group/toggle inline-flex items-center justify-center gap-1.5 rounded-md text-body-small-medium text-text-secondary whitespace-nowrap select-none outline-none transition-[transform,background-color,color] duration-150 ease-out active:scale-[0.97] motion-reduce:transition-none [@media(hover:hover)_and_(pointer:fine)]:hover:bg-control-hover [@media(hover:hover)_and_(pointer:fine)]:hover:text-text-primary focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:bg-bg-secondary disabled:text-text-tertiary disabled:shadow-none aria-invalid:ring-1 aria-invalid:ring-red-base data-[state=on]:bg-control-selected data-[state=on]:text-text-primary aria-pressed:bg-control-selected aria-pressed:text-text-primary [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        outline:
          "bg-control-bg text-text-primary shadow-low [@media(hover:hover)_and_(pointer:fine)]:hover:bg-control-hover [@media(hover:hover)_and_(pointer:fine)]:hover:shadow-low-hover",
      },
      size: {
        default:
          "h-8 min-w-8 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        sm: "h-7 min-w-7 rounded-sm px-2 text-body-mini-medium has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5",
        lg: "h-9 min-w-9 px-3 text-body-regular-medium has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Toggle({
  className,
  variant = "default",
  size = "default",
  ...props
}: React.ComponentProps<typeof TogglePrimitive.Root> &
  VariantProps<typeof toggleVariants>) {
  return (
    <TogglePrimitive.Root
      data-slot="toggle"
      className={cn(toggleVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Toggle, toggleVariants }
