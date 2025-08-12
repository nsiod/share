
import { Label, PasswordInput } from '@nsiod/share-ui'
import React from 'react'

interface KeyInputSectionProps {
  processMode: 'encrypt' | 'decrypt'
  keyInput: string
  onKeyInputChange: (value: string) => void
}

export const KeyInputSection: React.FC<KeyInputSectionProps> = ({
  processMode,
  keyInput,
  onKeyInputChange
}) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-200">
          {processMode === 'encrypt' ? 'Public Key' : 'Private Key or Mnemonic'}
        </Label>
        <PasswordInput
          value={keyInput}
          onChange={(e) => onKeyInputChange(e.target.value)}
          placeholder={
            processMode === 'encrypt'
              ? 'Enter Base58 public key (approx. 44-45 characters)'
              : 'Enter private key or mnemonic phrase'
          }
          className="font-mono text-xs sm:text-sm h-10 flex-1 rounded-lg border-1 bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 text-gray-900 dark:text-gray-200"
        />
      </div>
    </div>
  )
}
