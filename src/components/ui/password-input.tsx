"use client"

import { forwardRef, useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from './input-group'

interface PasswordInputProps extends React.ComponentProps<"input"> {
  defaultShowPassword?: boolean
}

const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ defaultShowPassword = false, className, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(defaultShowPassword)

    return (
      <InputGroup className={className}>
        <InputGroupInput
          {...props}
          type={showPassword ? 'text' : 'password'}
          ref={ref}
        />
        <InputGroupAddon align="inline-end">
          <InputGroupButton
            size="icon-xs"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? (
              <EyeOff className="size-4" />
            ) : (
              <Eye className="size-4" />
            )}
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    )
  },
)

PasswordInput.displayName = 'PasswordInput'

export { PasswordInput }
