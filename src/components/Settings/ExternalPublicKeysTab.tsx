import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { EmptyState } from '@/components/Settings/EmptyState'
import { PublicKeyForm } from '@/components/Settings/PublicKeyForm'
import { PublicKeyTable } from '@/components/Settings/PublicKeyTable'
import { Button } from '@/components/ui'
import { usePublicKeyManagement } from '@/hooks/usePublicKeyManagement'
import { validatePublicKey } from '@/lib/key'
import { useKeyStore } from '@/stores/useKeyStore'

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

  const handleEditNote = useCallback((key: PublicKey, index: number) => {
    setEditKey({ ...key, index })
    setShowAddKey(true)
  }, [])

  const handleSavePublicKey = useCallback(() => {
    if (!editKey) {
      setValidationError(t('error.invalidPublicKey'))
      toast.error(t('error.invalidPublicKey'))
      return
    }

    const validation = validatePublicKey(editKey.publicKey)
    if (!validation.isValid) {
      setValidationError(validation.error || t('error.invalidPublicKey'))
      toast.error(validation.error || t('error.invalidPublicKey'))
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
      <div className="p-4 sm:p-6">
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
    )
  }

  return (
    <div className="flex flex-col p-4 sm:p-6">
      {publicKeys.length === 0 ? (
        <EmptyState
          icon="/PublicKeys.svg"
          title={t('settings.externalKeys.noKeys')}
          description={t('settings.externalKeys.noKeysDesc')}
          buttonText={t('settings.externalKeys.add')}
          onButtonClick={handleAddPublicKey}
        />
      ) : (
        <>
          <div className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            <PublicKeyTable
              publicKeys={publicKeys}
              onCopy={handleCopy}
              onEditNote={handleEditNote}
              onDelete={handleDeleteKey}
              onSaveNote={handleSaveNoteInTable}
            />
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={handleAddPublicKey}
            >
              {t('settings.externalKeys.add')}
            </Button>
          </div>
        </>
      )}
    </div>
  )
}
