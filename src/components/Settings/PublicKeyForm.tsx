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
    <div className="w-full pb-4 sm:pb-6">
      <div className="w-full space-y-4">
        <div className="space-y-2">
          <Label
            htmlFor="publicKey"
            className="text-sm font-medium text-gray-900 dark:text-gray-100"
          >
            {t('settings.externalKeys.publicKey')}
          </Label>
          <Input
            id="publicKey"
            type="text"
            value={editKey?.publicKey || ''}
            onChange={(e) => onPublicKeyChange(e.target.value)}
            className={cn(
              'w-full font-mono text-xs sm:text-sm break-all resize-none rounded-md border',
              validationError
                ? 'border-red-500 dark:border-red-400'
                : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500 focus:border-blue-500 dark:focus:border-blue-400',
              'bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-200',
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
          <Label
            htmlFor="note"
            className="text-sm font-medium text-gray-900 dark:text-gray-100"
          >
            {t('settings.note')}
          </Label>
          <Input
            id="note"
            type="text"
            value={editKey?.note || ''}
            onChange={(e) => onNoteChange(e.target.value)}
            className="w-full font-mono text-xs sm:text-sm break-all resize-none rounded-md border border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500 focus:border-blue-500 dark:focus:border-blue-400 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-200"
            placeholder={t('settings.externalKeys.notePlaceholder')}
          />
        </div>

        <div className="flex gap-3">
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
