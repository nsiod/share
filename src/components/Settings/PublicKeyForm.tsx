import { useTranslation } from 'react-i18next'
import { Button, Input, Label } from '@/components/ui'
import { cn } from '@/lib/utils'

import type { PublicKey } from '@/types'

interface PublicKeyFormProps {
  editKey: PublicKey | null
  validationError: string
  onPublicKeyChange: (value: string) => void
  onNoteChange: (value: string) => void
  onSave: () => void
  onCancel: () => void
}

export const PublicKeyForm = ({
  editKey,
  validationError,
  onPublicKeyChange,
  onNoteChange,
  onSave,
  onCancel,
}: PublicKeyFormProps) => {
  const { t } = useTranslation()

  return (
    <div className="w-full rounded-lg border border-gray-200 dark:border-gray-700 p-4">
      <div className="w-full space-y-4">
        <div className="space-y-2">
          <Label htmlFor="publicKey">
            {t('settings.externalKeys.publicKey')}
          </Label>
          <Input
            id="publicKey"
            type="text"
            value={editKey?.publicKey || ''}
            onChange={(e) => onPublicKeyChange(e.target.value)}
            className={cn(
              'w-full break-all resize-none border',
              validationError
                ? 'border-red-500 dark:border-red-400'
                : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500 focus:border-blue-500 dark:focus:border-blue-400',
            )}
            placeholder={t('keyInput.publicKeyPlaceholder')}
          />
          {validationError && (
            <p className="text-xs sm:text-sm text-red-600 dark:text-red-400">
              {validationError}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="note">{t('settings.note')}</Label>
          <Input
            id="note"
            type="text"
            value={editKey?.note || ''}
            onChange={(e) => onNoteChange(e.target.value)}
            placeholder={t('settings.externalKeys.notePlaceholder')}
          />
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onCancel}>
            {t('settings.cancel')}
          </Button>
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white"
            onClick={onSave}
            disabled={!editKey?.publicKey}
          >
            {editKey?.index !== undefined
              ? t('settings.externalKeys.update')
              : t('settings.externalKeys.add')}
          </Button>
        </div>
      </div>
    </div>
  )
}
