import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

import type { CryptoState } from '@/types'

interface UseDragAndDropProps {
  updateState: (updates: Partial<CryptoState>) => void
  clearState: () => void
  handleFileSelect: (file: File) => Promise<void>
}

export const useDragAndDrop = ({
  updateState,
  clearState,
  handleFileSelect,
}: UseDragAndDropProps) => {
  const { t } = useTranslation()

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  const handleDragEnter = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      updateState({ isDragOver: true })
    },
    [updateState],
  )

  const handleDragLeave = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      // Only update isDragOver to false if we're actually leaving the drop zone
      // This prevents flickering when dragging over child elements
      if (!e.currentTarget.contains(e.relatedTarget as Node)) {
        updateState({ isDragOver: false })
      }
    },
    [updateState],
  )

  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      updateState({ isDragOver: false })

      const files = e.dataTransfer.files
      if (files && files.length > 0) {
        if (files.length > 1) {
          toast.error(t('toast.oneFileOnly'))
          return
        }

        const file = files[0]
        if (file) {
          try {
            await handleFileSelect(file)
          } catch (error) {
            console.error('Failed to handle dropped file:', error)
            toast.error(t('toast.dropFailed'))
            clearState()
          }
        }
      }
    },
    [updateState, handleFileSelect, clearState, t],
  )

  return {
    handleDragOver,
    handleDragEnter,
    handleDragLeave,
    handleDrop,
  }
}
