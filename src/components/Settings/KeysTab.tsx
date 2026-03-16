import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { CreateKeyPairForm } from '@/components/Settings/CreateKeyPairForm'
import { EmptyState } from '@/components/Settings/EmptyState'
import { KeyPairTable } from '@/components/Settings/KeyPairTable'
import { Button } from '@/components/ui'
import { useKeyPairManagement } from '@/hooks/useKeyPairManagement'
import { deriveKeyPair } from '@/lib/help'
import { useKeyStore } from '@/stores/useKeyStore'

import type { KeyPair } from '@/types'

type View = 'list' | 'create' | 'import'

export const KeysTab = () => {
  const { t } = useTranslation()
  const keyPairs = useKeyStore((s) => s.keyPairs)

  const [view, setView] = useState<View>('list')
  const [editKeyPair, setEditKeyPair] = useState<KeyPair | null>(null)

  const {
    handleCreateKeyPair,
    handleSaveKeyPair,
    handleDeleteKeyPair,
    handleCopyKey,
    handleSaveNoteInTable,
  } = useKeyPairManagement({
    setEditKeyPair,
    setShowCreateKeyPair: (show: boolean) => {
      if (show) setView('create')
      else setView('list')
    },
  })

  const handleNoteChange = useCallback((value: string) => {
    setEditKeyPair((prev: KeyPair | null) =>
      prev
        ? { ...prev, note: value }
        : { publicKey: '', mnemonic: '', note: value },
    )
  }, [])

  const handleMnemonicChange = useCallback((value: string) => {
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
  }, [])

  const handleSave = useCallback(() => {
    if (editKeyPair) {
      handleSaveKeyPair(editKeyPair)
    }
  }, [editKeyPair, handleSaveKeyPair])

  const handleStartImport = useCallback(() => {
    setEditKeyPair({ publicKey: '', mnemonic: '', note: '' })
    setView('import')
  }, [])

  // Create key view
  if (view === 'create') {
    return (
      <div className="p-4 sm:p-6">
        <CreateKeyPairForm
          keyPair={editKeyPair}
          onNoteChange={handleNoteChange}
          onMnemonicChange={handleMnemonicChange}
          onSave={handleSave}
          onCancel={() => setView('list')}
        />
      </div>
    )
  }

  // Import key view
  if (view === 'import') {
    return (
      <div className="p-4 sm:p-6">
        <CreateKeyPairForm
          mode="import"
          keyPair={editKeyPair}
          onNoteChange={handleNoteChange}
          onMnemonicChange={handleMnemonicChange}
          onSave={handleSave}
          onCancel={() => setView('list')}
        />
      </div>
    )
  }

  // List view
  return (
    <div className="flex flex-col p-4 sm:p-6">
      {keyPairs.length === 0 ? (
        <EmptyState
          icon="/PublicKeys.svg"
          title={t('settings.keys.noKeys')}
          description={t('settings.keys.noKeysDesc')}
          buttonText={t('settings.keys.createKey')}
          onButtonClick={handleCreateKeyPair}
        />
      ) : (
        <>
          <div className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            <KeyPairTable
              keyPairs={keyPairs}
              onCopyPublic={(key) => handleCopyKey(key, 'public')}
              onCopyMnemonic={(key) => handleCopyKey(key, 'mnemonic')}
              onDelete={handleDeleteKeyPair}
              onSaveNote={handleSaveNoteInTable}
            />
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <Button variant="outline" onClick={handleStartImport}>
              {t('settings.keys.importKey')}
            </Button>
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={handleCreateKeyPair}
            >
              {t('settings.keys.createKey')}
            </Button>
          </div>
        </>
      )}
    </div>
  )
}
