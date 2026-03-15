import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui'
import { EmptyState } from '@/components/Settings/EmptyState'
import { PublicKeyTable } from '@/components/Settings/PublicKeyTable'
import { usePublicKeyManagement } from '@/hooks/usePublicKeyManagement'

import type { PublicKey } from '@/types'

interface ExternalPublicKeysTabProps {
  publicKeys: PublicKey[]
  setPublicKeys: (keys: PublicKey[]) => void
  setShowAddKey: (show: boolean) => void
  setEditKey: (key: PublicKey | null) => void
}

export const ExternalPublicKeysTab = ({
  publicKeys,
  setPublicKeys,
  setShowAddKey,
  setEditKey,
}: ExternalPublicKeysTabProps) => {
  const { t } = useTranslation()
  const { handleDeleteKey, handleCopy, handleSaveNoteInTable } =
    usePublicKeyManagement({ publicKeys, setPublicKeys })

  const handleAddPublicKey = useCallback(() => {
    setEditKey({ publicKey: '', note: '' })
    setShowAddKey(true)
  }, [setEditKey, setShowAddKey])

  const handleEditNote = useCallback(
    (key: PublicKey, index: number) => {
      setEditKey({ ...key, index })
      setShowAddKey(true)
    },
    [setEditKey, setShowAddKey],
  )

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
