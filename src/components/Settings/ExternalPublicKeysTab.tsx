import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { ChevronLeft } from 'lucide-react'
import { Button } from '@/components/ui'
import { EmptyState } from '@/components/Settings/EmptyState'
import { PublicKeyForm } from '@/components/Settings/PublicKeyForm'
import { PublicKeyTable } from '@/components/Settings/PublicKeyTable'
import { usePublicKeyManagement } from '@/hooks/usePublicKeyManagement'
import { useKeyStore } from '@/stores/useKeyStore'
import { validatePublicKey } from '@/lib/key'

import type { PublicKey } from '@/types'

export const ExternalPublicKeysTab = () => {
  const { t } = useTranslation()
  const publicKeys = useKeyStore((s) => s.publicKeys)
  const setPublicKeys = useKeyStore((s) => s.setPublicKeys)

  const [showAddKey, setShowAddKey] = useState(false)
  const [editKey, setEditKey] = useState<PublicKey | null>(null)
  const [validationError, setValidationError] = useState('')

  const { handleDeleteKey, handleCopy, handleSaveNoteInTable } =
    usePublicKeyManagement()

  const handleAddPublicKey = useCallback(() => {
    setEditKey({ publicKey: '', note: '' })
    setShowAddKey(true)
  }, [])

  const handleEditNote = useCallback(
    (key: PublicKey, index: number) => {
      setEditKey({ ...key, index })
      setShowAddKey(true)
    },
    [],
  )

  const handleSavePublicKey = useCallback(() => {
    if (!editKey) {
      setValidationError('No public key data provided')
      toast.error('No public key data provided')
      return
    }

    const validation = validatePublicKey(editKey.publicKey)
    if (!validation.isValid) {
      setValidationError(validation.error || 'Invalid public key')
      toast.error(validation.error || 'Invalid public key')
      return
    }

    const newPublicKeys = [...publicKeys]
    if (editKey.index !== undefined) {
      newPublicKeys[editKey.index] = {
        publicKey: editKey.publicKey,
        note: editKey.note || '',
      }
    } else {
      newPublicKeys.push({
        publicKey: editKey.publicKey,
        note: editKey.note || '',
      })
    }

    setPublicKeys(newPublicKeys)
    toast.success(t('settings.externalKeys.saved'))
    setShowAddKey(false)
    setEditKey(null)
    setValidationError('')
  }, [editKey, publicKeys, setPublicKeys, t])

  if (showAddKey) {
    return (
      <div className="p-3 sm:p-6">
        <div className="flex items-center gap-2 mb-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowAddKey(false)}
          >
            <ChevronLeft className="size-4" />
          </Button>
          <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100">
            {t('settings.tabs.externalKeys')}
          </h2>
        </div>
        <div className="flex justify-center text-center pt-2 pb-6">
          <PublicKeyForm
            editKey={editKey}
            validationError={validationError}
            onPublicKeyChange={(value) =>
              setEditKey((prev) => ({
                ...(prev || { publicKey: '', note: '' }),
                publicKey: value,
              }))
            }
            onNoteChange={(value) =>
              setEditKey((prev) => ({
                ...(prev || { publicKey: '', note: '' }),
                note: value,
              }))
            }
            onSave={handleSavePublicKey}
            onCancel={() => {
              setShowAddKey(false)
              setEditKey(null)
              setValidationError('')
            }}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          {t('settings.tabs.externalKeys')}
        </h2>
        {publicKeys.length > 0 && (
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white"
            onClick={handleAddPublicKey}
          >
            {t('settings.externalKeys.add')}
          </Button>
        )}
      </div>

      {publicKeys.length === 0 ? (
        <EmptyState
          icon="/PublicKeys.svg"
          title={t('settings.externalKeys.noKeys')}
          description={t('settings.externalKeys.noKeysDesc')}
          buttonText={t('settings.externalKeys.add')}
          onButtonClick={handleAddPublicKey}
        />
      ) : (
        <PublicKeyTable
          publicKeys={publicKeys}
          onCopy={handleCopy}
          onEditNote={handleEditNote}
          onDelete={handleDeleteKey}
          onSaveNote={handleSaveNoteInTable}
        />
      )}
    </div>
  )
}
