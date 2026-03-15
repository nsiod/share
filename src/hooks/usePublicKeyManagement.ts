import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

import { validatePublicKey } from '@/lib/key'
import type { PublicKey } from '@/types'

interface UsePublicKeyManagementProps {
  publicKeys: PublicKey[]
  setPublicKeys: (keys: PublicKey[]) => void
}

export const usePublicKeyManagement = ({
  publicKeys,
  setPublicKeys,
}: UsePublicKeyManagementProps) => {
  const { t } = useTranslation()

  const handleSavePublicKey = useCallback(
    (editKey: PublicKey) => {
      const validation = validatePublicKey(editKey.publicKey)
      if (!validation.isValid) {
        throw new Error(validation.error || 'Invalid public key')
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
    },
    [publicKeys, setPublicKeys, t],
  )

  const handleDeleteKey = useCallback(
    (index: number) => {
      const newPublicKeys = publicKeys.filter((_, i) => i !== index)
      setPublicKeys(newPublicKeys)
      toast.success(t('settings.externalKeys.deleted'))
    },
    [publicKeys, setPublicKeys, t],
  )

  const handleCopy = useCallback(
    (address: string) => {
      if (address) {
        navigator.clipboard.writeText(address)
        toast.success(t('settings.externalKeys.copied'))
      } else {
        toast.error(t('settings.externalKeys.empty'))
      }
    },
    [t],
  )

  const handleSaveNoteInTable = useCallback(
    (index: number, note: string) => {
      const newPublicKeys = [...publicKeys]
      newPublicKeys[index] = {
        publicKey: newPublicKeys[index]?.publicKey || '',
        note,
      }
      setPublicKeys(newPublicKeys)
      toast.success(t('settings.externalKeys.noteUpdated'))
    },
    [publicKeys, setPublicKeys, t],
  )

  return {
    handleSavePublicKey,
    handleDeleteKey,
    handleCopy,
    handleSaveNoteInTable,
  }
}
