import * as React from "react"
import { Progress as BaseProgress } from "@base-ui/react/progress"

import { cn } from "../../lib"

function Progress({
  className,
  value,
  ...props
}: React.ComponentProps<"div"> & { value?: number }) {
  return (
    <BaseProgress.Root
      data-slot="progress"
      value={value ?? 0}
      className={cn(
        "bg-primary/20 relative h-2 w-full overflow-hidden rounded-full",
        className
      )}
      {...props}
    >
      <BaseProgress.Track>
        <BaseProgress.Indicator
          data-slot="progress-indicator"
          className="bg-primary h-full w-full flex-1 transition-all"
          style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
        />
      </BaseProgress.Track>
    </BaseProgress.Root>
  )
}

export { Progress }
