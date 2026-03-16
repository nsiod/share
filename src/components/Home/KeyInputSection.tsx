import { KeyRound } from 'lucide-react'
import type React from 'react'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Label, PasswordInput } from '@/components/ui'
import { sliceAddress } from '@/lib/help'
import { useKeyStore } from '@/stores/useKeyStore'

interface KeyOption {
  value: string
  label: string
}

interface KeyInputSectionProps {
  processMode: 'encrypt' | 'decrypt'
  keyInput: string
  onKeyInputChange: (value: string) => void
}

export const KeyInputSection: React.FC<KeyInputSectionProps> = ({
  processMode,
  keyInput,
  onKeyInputChange,
}) => {
  const { t } = useTranslation()
  const [showDropdown, setShowDropdown] = useState(false)
  const [options, setOptions] = useState<KeyOption[]>([])
  const containerRef = useRef<HTMLDivElement>(null)

  const { keyPairs, publicKeys, init } = useKeyStore()

  useEffect(() => {
    init()
  }, [init])

  useEffect(() => {
    const items: KeyOption[] = []

    if (processMode === 'encrypt') {
      for (const pk of publicKeys) {
        if (pk.publicKey) {
          items.push({
            value: pk.publicKey,
            label: pk.note
              ? `${pk.note} (${sliceAddress(pk.publicKey, 6, 4)})`
              : sliceAddress(pk.publicKey, 10, 8),
          })
        }
      }
    } else {
      for (const kp of keyPairs) {
        const secretValue = kp.mnemonic || kp.privateKey
        if (secretValue) {
          items.push({
            value: secretValue,
            label: kp.note
              ? `${kp.note} (${sliceAddress(secretValue, 10, 8)})`
              : sliceAddress(secretValue, 14, 10),
          })
        }
      }
    }

    setOptions(items)
  }, [processMode, keyPairs, publicKeys])

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelect = (value: string) => {
    onKeyInputChange(value)
    setShowDropdown(false)
  }

  const labelText =
    processMode === 'encrypt'
      ? t('keyInput.publicKey')
      : t('keyInput.privateKeyOrMnemonic')

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-200">
          {labelText}
        </Label>
        <div ref={containerRef} className="relative">
          <PasswordInput
            value={keyInput}
            onChange={(e) => onKeyInputChange(e.target.value)}
            onFocus={() => options.length > 0 && setShowDropdown(true)}
            placeholder={
              processMode === 'encrypt'
                ? t('keyInput.publicKeyPlaceholder')
                : t('keyInput.privateKeyPlaceholder')
            }
            className="font-mono text-xs sm:text-sm h-10 flex-1 rounded-lg border-1 bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 text-gray-900 dark:text-gray-200"
          />

          {showDropdown && options.length > 0 && (
            <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg overflow-hidden">
              <div className="flex items-center gap-1.5 px-3 py-2 border-b border-gray-100 dark:border-gray-700">
                <KeyRound className="size-3.5 text-gray-400" />
                <span className="text-xs text-gray-400 dark:text-gray-500">
                  {labelText}
                </span>
              </div>
              <div className="max-h-48 overflow-y-auto">
                {options.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    className="w-full text-left px-3 py-2.5 text-xs sm:text-sm font-mono text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors cursor-pointer"
                    onMouseDown={(e) => {
                      e.preventDefault()
                      handleSelect(option.value)
                    }}
                  >
                    <span className="text-gray-400 mr-1">-</span>
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
