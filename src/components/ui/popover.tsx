import * as React from "react"
import { Popover as BasePopover } from "@base-ui/react/popover"

import { cn } from "../../lib"

function Popover({
  open,
  onOpenChange,
  children,
}: {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  children: React.ReactNode
}) {
  return (
    <BasePopover.Root
      open={open}
      onOpenChange={(open) => onOpenChange?.(open)}
    >
      {children}
    </BasePopover.Root>
  )
}

function PopoverTrigger({
  asChild,
  children,
  ...props
}: React.ComponentProps<"button"> & { asChild?: boolean }) {
  if (asChild && React.isValidElement(children)) {
    return (
      <BasePopover.Trigger render={children} {...props} />
    )
  }

  return (
    <BasePopover.Trigger {...props}>
      {children}
    </BasePopover.Trigger>
  )
}

function PopoverContent({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <BasePopover.Portal>
      <BasePopover.Positioner sideOffset={4}>
        <BasePopover.Popup
          data-slot="popover-content"
          className={cn(
            "bg-popover text-popover-foreground z-50 w-72 rounded-md border p-4 shadow-md outline-hidden",
            className
          )}
          {...props}
        />
      </BasePopover.Positioner>
    </BasePopover.Portal>
  )
}

export { Popover, PopoverTrigger, PopoverContent }
