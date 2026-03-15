import { ChevronLeft } from 'lucide-react'
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui'
import { CreateKeyPairForm } from '@/components/Settings/CreateKeyPairForm'
import { EmptyState } from '@/components/Settings/EmptyState'
import { KeyPairTable } from '@/components/Settings/KeyPairTable'
import { useKeyPairManagement } from '@/hooks/useKeyPairManagement'
import { deriveKeyPair } from '@/lib/help'

import type { KeyPair } from '@/types'

interface KeysTabProps {
  keyPairs: KeyPair[]
  setKeyPairs: (keys: KeyPair[]) => void
  showCreateKeyPair: boolean
  setShowCreateKeyPair: (show: boolean) => void
  editKeyPair: KeyPair | null
  setEditKeyPair: (
    keyPair: KeyPair | null | ((prev: KeyPair | null) => KeyPair | null),
  ) => void
}

export const KeysTab = ({
  keyPairs,
  setKeyPairs,
  showCreateKeyPair,
  setShowCreateKeyPair,
  editKeyPair,
  setEditKeyPair,
}: KeysTabProps) => {
  const { t } = useTranslation()
  const {
    handleCreateKeyPair,
    handleSaveKeyPair,
    handleDeleteKeyPair,
    handleCopyKey,
    handleSaveNoteInTable,
  } = useKeyPairManagement({
    keyPairs,
    setKeyPairs,
    setEditKeyPair,
    setShowCreateKeyPair,
  })

  const handleNoteChange = useCallback(
    (value: string) => {
      setEditKeyPair((prev: KeyPair | null) =>
        prev
          ? { ...prev, note: value }
          : { publicKey: '', mnemonic: '', note: value },
      )
    },
    [setEditKeyPair],
  )

  const handleMnemonicChange = useCallback(
    (value: string) => {
      setEditKeyPair((prev: KeyPair | null) => {
        let publicKey = prev?.publicKey || ''
        try {
          const kp = deriveKeyPair(value)
          publicKey = kp.publicKey
        } catch {
          publicKey = ''
        }
        return prev
          ? { ...prev, mnemonic: value, publicKey }
          : { publicKey, mnemonic: value, note: '' }
      })
    },
    [setEditKeyPair],
  )

  const handleSave = useCallback(() => {
    if (editKeyPair) {
      handleSaveKeyPair(editKeyPair)
    }
  }, [editKeyPair, handleSaveKeyPair])

  if (showCreateKeyPair) {
    return (
      <div className="space-y-4 sm:space-y-6 p-4 sm:p-6">
        <div className="flex items-center gap-2 mb-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowCreateKeyPair(false)}
          >
            <ChevronLeft className="size-4" />
          </Button>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {t('settings.tabs.keys')}
          </h2>
        </div>
        <div className="flex justify-center text-center pt-2 pb-6">
          <CreateKeyPairForm
            keyPair={editKeyPair}
            onNoteChange={handleNoteChange}
            onMnemonicChange={handleMnemonicChange}
            onSave={handleSave}
            onCancel={() => setShowCreateKeyPair(false)}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          {t('settings.tabs.keys')}
        </h2>
        {keyPairs.length > 0 && (
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white"
            onClick={handleCreateKeyPair}
          >
            {t('settings.keys.createKey')}
          </Button>
        )}
      </div>

      {keyPairs.length === 0 ? (
        <EmptyState
          icon="/PublicKeys.svg"
          title={t('settings.keys.noKeys')}
          description={t('settings.keys.noKeysDesc')}
          buttonText={t('settings.keys.createKey')}
          onButtonClick={handleCreateKeyPair}
        />
      ) : (
        <KeyPairTable
          keyPairs={keyPairs}
          onCopyPublic={(key) => handleCopyKey(key, 'public')}
          onCopyMnemonic={(key) => handleCopyKey(key, 'mnemonic')}
          onEditNote={(keyPair, index) =>
            setEditKeyPair({ ...keyPair, index })
          }
          onDelete={handleDeleteKeyPair}
          onSaveNote={handleSaveNoteInTable}
        />
      )}
    </div>
  )
}
