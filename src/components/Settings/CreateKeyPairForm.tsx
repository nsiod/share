import { Copy, Download, RefreshCw } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import {
  Button,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  Label,
} from '@/components/ui'

import { deriveKeyPair, generateMnemonic, validateMnemonic } from '@/lib/help'
import { cn } from '@/lib/utils'
import type { KeyPair } from '@/types'

interface CreateKeyPairFormProps {
  mode?: 'create' | 'import'
  keyPair: KeyPair | null
  onNoteChange: (value: string) => void
  onMnemonicChange: (value: string) => void
  onSave: () => void
  onCancel: () => void
}

export const CreateKeyPairForm = ({
  mode = 'create',
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
  }, [
    mnemonic,
    derivedPublicKey,
    keyPair,
    onMnemonicChange,
    onNoteChange,
    onSave,
    t,
  ])

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
    <div className="w-full rounded-lg border border-gray-200 dark:border-gray-700 p-4">
      <div className="w-full space-y-4">
        {/* Mnemonic */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="mnemonic">{t('settings.keys.mnemonic')}</Label>
            {mode === 'create' && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleGenerateMnemonic}
                className="gap-1"
              >
                <RefreshCw className="size-3.5" />
                {t('settings.keys.generateNew')}
              </Button>
            )}
          </div>
          <InputGroup
            className={cn(
              mnemonic
                ? mnemonicError
                  ? 'border-red-500 dark:border-red-400'
                  : 'border-green-500 dark:border-green-400'
                : '',
            )}
          >
            <InputGroupInput
              id="mnemonic"
              type="text"
              value={mnemonic}
              onChange={(e) => handleMnemonicInput(e.target.value)}
              placeholder={t('settings.keys.mnemonicPlaceholder')}
            />
            <InputGroupAddon align="inline-end">
              <InputGroupButton
                size="icon-xs"
                onClick={() => {
                  if (mnemonic) {
                    navigator.clipboard.writeText(mnemonic)
                    toast.success(t('settings.keys.mnemonicCopied'))
                  }
                }}
                disabled={!mnemonic}
              >
                <Copy className="size-4" />
              </InputGroupButton>
              <InputGroupButton
                size="icon-xs"
                onClick={handleDownloadMnemonic}
                disabled={!mnemonic}
              >
                <Download className="size-4" />
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
          {mnemonicError && (
            <p className="text-left text-xs sm:text-sm text-red-600 dark:text-red-400">
              {mnemonicError}
            </p>
          )}
          {!mnemonicError && mnemonic && derivedPublicKey && (
            <p className="text-left text-xs sm:text-sm text-green-600 dark:text-green-400">
              ✓ {t('settings.keys.validMnemonic')}
            </p>
          )}
        </div>

        {/* Derived Public Key (read-only) — in import mode, only show when mnemonic is valid */}
        {(mode === 'create' || derivedPublicKey) && (
          <div className="space-y-2">
            <Label htmlFor="generatedPublicKey">
              {t('settings.keys.publicKey')}
            </Label>
            <InputGroup className="h-10">
              <InputGroupInput
                id="generatedPublicKey"
                type="text"
                value={derivedPublicKey}
                readOnly
                placeholder={t('settings.keys.publicKeyAutoGenerated')}
              />
              <InputGroupAddon align="inline-end">
                <InputGroupButton
                  size="icon-xs"
                  onClick={() => {
                    if (derivedPublicKey) {
                      navigator.clipboard.writeText(derivedPublicKey)
                      toast.success(t('settings.keys.publicKeyCopied'))
                    }
                  }}
                  disabled={!derivedPublicKey}
                >
                  <Copy className="size-4" />
                </InputGroupButton>
              </InputGroupAddon>
            </InputGroup>
            {derivedPublicKey && (
              <p className="text-left text-xs sm:text-sm text-orange-500">
                {t('settings.keys.mnemonicSafetyWarning')}
              </p>
            )}
          </div>
        )}

        {/* Note — in import mode, only show when mnemonic is valid */}
        {(mode === 'create' || derivedPublicKey) && (
          <div className="space-y-2">
            <Label htmlFor="keyPairNote">{t('settings.note')}</Label>
            <Input
              id="keyPairNote"
              type="text"
              value={keyPair?.note || ''}
              onChange={(e) => onNoteChange(e.target.value)}
              placeholder={t('settings.keys.notePlaceholder')}
            />
          </div>
        )}

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onCancel}>
            {t('settings.cancel')}
          </Button>
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white"
            onClick={handleSaveWithValidation}
            disabled={!!mnemonicError || !mnemonic || !derivedPublicKey}
          >
            {mode === 'import'
              ? t('settings.keys.importKey')
              : t('settings.keys.createKey')}
          </Button>
        </div>
      </div>
    </div>
  )
}
