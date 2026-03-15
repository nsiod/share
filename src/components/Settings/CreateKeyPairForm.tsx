import { Copy, Download, RefreshCw } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { Button, Input, Label } from '@/components/ui'

import {
  generateMnemonic,
  validateMnemonic,
  deriveKeyPair,
} from '@/lib/help'
import type { KeyPair } from '@/types'

interface CreateKeyPairFormProps {
  keyPair: KeyPair | null
  onNoteChange: (value: string) => void
  onMnemonicChange: (value: string) => void
  onSave: () => void
  onCancel: () => void
}

export const CreateKeyPairForm = ({
  keyPair,
  onNoteChange,
  onMnemonicChange,
  onSave,
  onCancel,
}: CreateKeyPairFormProps) => {
  const { t } = useTranslation()
  const [mnemonic, setMnemonic] = useState(keyPair?.mnemonic || '')
  const [derivedPublicKey, setDerivedPublicKey] = useState(
    keyPair?.publicKey || '',
  )
  const [mnemonicError, setMnemonicError] = useState('')

  useEffect(() => {
    if (!mnemonic) {
      setDerivedPublicKey('')
      setMnemonicError('')
      return
    }
    const validation = validateMnemonic(mnemonic)
    if (validation.isValid) {
      try {
        const kp = deriveKeyPair(mnemonic)
        setDerivedPublicKey(kp.publicKey)
        setMnemonicError('')
      } catch {
        setDerivedPublicKey('')
        setMnemonicError(t('settings.keys.deriveFailed'))
      }
    } else {
      setDerivedPublicKey('')
      setMnemonicError(validation.error || t('settings.keys.invalidMnemonic'))
    }
  }, [mnemonic, t])

  const handleGenerateMnemonic = useCallback(() => {
    const newMnemonic = generateMnemonic(128)
    setMnemonic(newMnemonic)
    onMnemonicChange(newMnemonic)
  }, [onMnemonicChange])

  const handleMnemonicInput = useCallback(
    (value: string) => {
      setMnemonic(value)
      onMnemonicChange(value)
    },
    [onMnemonicChange],
  )

  const handleSaveWithValidation = useCallback(() => {
    if (!mnemonic) {
      toast.error(t('settings.keys.enterMnemonic'))
      return
    }
    const validation = validateMnemonic(mnemonic)
    if (!validation.isValid) {
      setMnemonicError(validation.error || t('settings.keys.invalidMnemonic'))
      toast.error(validation.error || t('settings.keys.invalidMnemonic'))
      return
    }
    if (!derivedPublicKey) {
      toast.error(t('settings.keys.deriveFailed'))
      return
    }
    onMnemonicChange(mnemonic)
    onNoteChange(keyPair?.note || '')
    onSave()
  }, [mnemonic, derivedPublicKey, keyPair, onMnemonicChange, onNoteChange, onSave, t])

  const handleDownloadMnemonic = useCallback(() => {
    if (mnemonic) {
      const blob = new Blob([mnemonic], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'mnemonic.txt'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }
  }, [mnemonic])

  return (
    <div className="w-full pb-4 sm:pb-6">
      <div className="w-full space-y-4">
        {/* Mnemonic */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label
              htmlFor="mnemonic"
              className="text-sm font-medium text-gray-900 dark:text-gray-100"
            >
              {t('settings.keys.mnemonic')}
            </Label>
            <Button
              variant="outline"
              size="sm"
              onClick={handleGenerateMnemonic}
              className="gap-1"
            >
              <RefreshCw className="size-3.5" />
              {t('settings.keys.generateNew')}
            </Button>
          </div>
          <div className="relative">
            <Input
              id="mnemonic"
              type="text"
              value={mnemonic}
              onChange={(e) => handleMnemonicInput(e.target.value)}
              className={`w-full font-mono text-xs sm:text-sm break-all resize-none rounded-md border ${
                mnemonic
                  ? mnemonicError
                    ? 'border-red-500 dark:border-red-400'
                    : 'border-green-500 dark:border-green-400'
                  : 'border-gray-300 dark:border-gray-600'
              } bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-200 pr-20`}
              placeholder={t('settings.keys.mnemonicPlaceholder')}
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  if (mnemonic) {
                    navigator.clipboard.writeText(mnemonic)
                    toast.success(t('settings.keys.mnemonicCopied'))
                  }
                }}
                disabled={!mnemonic}
              >
                <Copy className="size-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleDownloadMnemonic}
                disabled={!mnemonic}
              >
                <Download className="size-4" />
              </Button>
            </div>
          </div>
          {mnemonicError && (
            <p className="text-left text-xs sm:text-sm text-red-600 dark:text-red-400">
              {mnemonicError}
            </p>
          )}
        </div>

        {/* Derived Public Key (read-only) */}
        <div className="space-y-2">
          <Label
            htmlFor="generatedPublicKey"
            className="text-sm font-medium text-gray-900 dark:text-gray-100"
          >
            {t('settings.keys.publicKey')}
          </Label>
          <div className="relative">
            <Input
              id="generatedPublicKey"
              type="text"
              value={derivedPublicKey}
              readOnly
              className="w-full font-mono text-xs sm:text-sm break-all resize-none rounded-md border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-200 pr-10"
              placeholder={t('settings.keys.publicKeyAutoGenerated')}
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2"
              onClick={() => {
                if (derivedPublicKey) {
                  navigator.clipboard.writeText(derivedPublicKey)
                  toast.success(t('settings.keys.publicKeyCopied'))
                }
              }}
              disabled={!derivedPublicKey}
            >
              <Copy className="size-4" />
            </Button>
          </div>
        </div>

        {/* Note */}
        <div className="space-y-2">
          <Label
            htmlFor="keyPairNote"
            className="text-sm font-medium text-gray-900 dark:text-gray-100"
          >
            {t('settings.note')}
          </Label>
          <Input
            id="keyPairNote"
            type="text"
            value={keyPair?.note || ''}
            onChange={(e) => onNoteChange(e.target.value)}
            className="w-full font-mono text-xs sm:text-sm break-all resize-none rounded-md border border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500 focus:border-blue-500 dark:focus:border-blue-400 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-200"
            placeholder={t('settings.keys.notePlaceholder')}
          />
        </div>

        <div className="flex gap-3">
          <Button variant="outline" onClick={onCancel}>
            {t('settings.cancel')}
          </Button>
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white"
            onClick={handleSaveWithValidation}
            disabled={!!mnemonicError || !mnemonic || !derivedPublicKey}
          >
            {t('settings.keys.createKey')}
          </Button>
        </div>
      </div>
    </div>
  )
}
