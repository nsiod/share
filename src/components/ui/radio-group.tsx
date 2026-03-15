import * as React from "react"
import { RadioGroup as BaseRadioGroup } from "@base-ui/react/radio-group"
import { Radio } from "@base-ui/react/radio"

import { cn } from "../../lib"

function RadioGroup({
  className,
  value,
  onValueChange,
  defaultValue,
  ...props
}: Omit<React.ComponentProps<"div">, "value" | "defaultValue"> & {
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
}) {
  return (
    <BaseRadioGroup
      data-slot="radio-group"
      className={cn("grid gap-3", className)}
      value={value}
      defaultValue={defaultValue}
      onValueChange={(val) => onValueChange?.(val as string)}
      {...props}
    />
  )
}

function RadioGroupItem({
  className,
  value,
  ...props
}: Omit<React.ComponentProps<"span">, "value"> & { value: string }) {
  return (
    <Radio.Root
      data-slot="radio-group-item"
      value={value}
      className={cn(
        "border-gray-300 dark:border-gray-600 aspect-square size-4 shrink-0 rounded-full border-2 transition-all outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer flex items-center justify-center data-[checked]:border-blue-600 data-[checked]:bg-blue-600",
        className
      )}
      {...props}
    >
      <Radio.Indicator className="flex items-center justify-center">
        <span className="block size-1.5 rounded-full bg-white" />
      </Radio.Indicator>
    </Radio.Root>
  )
}

export { RadioGroup, RadioGroupItem }
