import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

import type { KeyPair } from '@/types'

interface UseKeyPairManagementProps {
  keyPairs: KeyPair[]
  setKeyPairs: (keys: KeyPair[]) => void
  setEditKeyPair: (keyPair: KeyPair | null | ((prev: KeyPair | null) => KeyPair | null)) => void
  setShowCreateKeyPair: (show: boolean) => void
}

export const useKeyPairManagement = ({
  keyPairs,
  setKeyPairs,
  setEditKeyPair,
  setShowCreateKeyPair,
}: UseKeyPairManagementProps) => {
  const { t } = useTranslation()

  const handleCreateKeyPair = useCallback(() => {
    setEditKeyPair({ publicKey: '', mnemonic: '', note: '' })
    setShowCreateKeyPair(true)
  }, [setEditKeyPair, setShowCreateKeyPair])

  const handleSaveKeyPair = useCallback(
    (keyPair: KeyPair) => {
      const newKeyPairs = [...keyPairs]
      if (keyPair.index !== undefined) {
        newKeyPairs[keyPair.index] = {
          publicKey: keyPair.publicKey,
          mnemonic: keyPair.mnemonic,
          note: keyPair.note || '',
        }
      } else {
        newKeyPairs.push({
          publicKey: keyPair.publicKey,
          mnemonic: keyPair.mnemonic,
          note: keyPair.note || '',
        })
      }

      setKeyPairs(newKeyPairs)
      toast.success(t('settings.keys.saved'))
      setShowCreateKeyPair(false)
      setEditKeyPair(null)
    },
    [keyPairs, setKeyPairs, setShowCreateKeyPair, setEditKeyPair, t],
  )

  const handleDeleteKeyPair = useCallback(
    (index: number) => {
      const newKeyPairs = keyPairs.filter((_, i) => i !== index)
      setKeyPairs(newKeyPairs)
      toast.success(t('settings.keys.deleted'))
    },
    [keyPairs, setKeyPairs, t],
  )

  const handleCopyKey = useCallback(
    (key: string, type: 'public' | 'mnemonic') => {
      if (key) {
        navigator.clipboard.writeText(key)
        toast.success(
          type === 'public'
            ? t('settings.keys.publicKeyCopied')
            : t('settings.keys.mnemonicCopied'),
        )
      } else {
        toast.error(t('settings.keys.keyEmpty'))
      }
    },
    [t],
  )

  const handleSaveNoteInTable = useCallback(
    (index: number, note: string) => {
      const newKeyPairs = [...keyPairs]
      newKeyPairs[index] = {
        publicKey: newKeyPairs[index]?.publicKey || '',
        mnemonic: newKeyPairs[index]?.mnemonic || '',
        note,
      }
      setKeyPairs(newKeyPairs)
      toast.success(t('settings.keys.noteUpdated'))
    },
    [keyPairs, setKeyPairs, t],
  )

  return {
    handleCreateKeyPair,
    handleSaveKeyPair,
    handleDeleteKeyPair,
    handleCopyKey,
    handleSaveNoteInTable,
  }
}
