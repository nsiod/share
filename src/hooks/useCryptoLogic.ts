import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import {
  deriveKeyPair,
  detect,
  downloadFile,
  isBase58String,
  isHexString,
  isMnemonicPhrase,
  validateBase58PublicKey,
} from '@/lib'

import { generateDownloadFilename } from '@/lib/utils'
import type { CryptoState } from '@/types'

interface UseCryptoLogicProps {
  state: CryptoState
  updateState: (updates: Partial<CryptoState>) => void
  clearState: () => void
  workerRef: React.RefObject<Worker | null>
  detectTimeoutRef: React.RefObject<NodeJS.Timeout | null>
}

export const useCryptoLogic = ({
  state,
  updateState,
  clearState,
  workerRef,
  detectTimeoutRef,
}: UseCryptoLogicProps) => {
  const { t } = useTranslation()

  const handleTextInputChange = useCallback(
    async (value: string) => {
      updateState({ textInput: value })

      if (detectTimeoutRef.current) {
        clearTimeout(detectTimeoutRef.current)
      }

      detectTimeoutRef.current = setTimeout(async () => {
        if (value.trim()) {
          try {
            const metadata = await detect(value)

            if (metadata.encryptionType === 'pubk') {
              if (state.processMode !== 'decrypt') {
                updateState({ processMode: 'decrypt' })
                toast.info(t('toast.detectedPubkeyText'))
              }
            } else if (metadata.encryptionType === 'signed') {
              toast.error(t('toast.signedNotSupported'))
              updateState({ textInput: '' })
              return
            } else if (metadata.encryptionType === 'pwd') {
              toast.error(t('toast.pwdNotSupported'))
              updateState({ textInput: '' })
              return
            } else {
              if (state.processMode !== 'encrypt') {
                updateState({ processMode: 'encrypt' })
                toast.info(t('toast.detectedPlaintext'))
              }
            }
          } catch (error) {
            console.error('Text detection failed:', error)
          }
        }
      }, 300)
    },
    [state.processMode, updateState, detectTimeoutRef, t],
  )

  const handleFileSelect = useCallback(
    async (file: File) => {
      try {
        updateState({
          selectedFile: file,
          fileInfo: {
            name: file.name,
            size: file.size,
            type: file.type || 'Unknown',
            encryptionMode: 'public-key',
          },
          textInput: '',
          inputType: 'file',
        })

        const metadata = await detect(file)

        if (metadata.encryptionType === 'pubk') {
          if (state.inputType !== 'file') {
            toast.info(t('toast.detectedPubkeyFile'))
          }
          updateState({
            processMode: file.name.endsWith('.enc') ? 'decrypt' : 'encrypt',
          })
        } else if (metadata.encryptionType === 'signed') {
          toast.error(t('toast.signedFileNotSupported'))
          clearState()
          return
        } else {
          updateState({ processMode: 'encrypt' })
        }
      } catch (error) {
        console.error('File detection failed:', error)
        toast.error(t('toast.dropFailed'))
        clearState()
      }
    },
    [state.inputType, updateState, clearState, t],
  )

  const handleCopy = useCallback(() => {
    if (state.textResult) {
      navigator.clipboard
        .writeText(state.textResult)
        .then(() => {
          toast.success(t('toast.copied'))
        })
        .catch(() => {
          toast.error(t('toast.copyFailed'))
        })
    }
  }, [state.textResult, t])

  const handleDownload = useCallback(() => {
    if (state.encryptedData) {
      const filename = generateDownloadFilename(
        state.inputType,
        state.fileInfo,
        state.processMode,
      )
      downloadFile(state.encryptedData, filename)

      const typeKey =
        state.processMode === 'encrypt'
          ? state.inputType === 'file'
            ? 'toast.encryptedFile'
            : 'toast.encryptedText'
          : state.inputType === 'file'
            ? 'toast.decryptedFile'
            : 'toast.decryptedText'
      toast.success(t('toast.downloadSuccess', { type: t(typeKey) }))
    }
  }, [
    state.encryptedData,
    state.inputType,
    state.fileInfo,
    state.processMode,
    t,
  ])

  const processInput = useCallback(async () => {
    if (state.inputType === 'file' && !state.selectedFile) {
      toast.error(t('toast.selectFile'))
      return
    }
    if (state.inputType === 'message' && !state.textInput) {
      toast.error(t('toast.enterText'))
      return
    }
    if (!state.keyInput) {
      toast.error(
        state.processMode === 'encrypt'
          ? t('toast.enterPublicKey')
          : t('toast.enterPrivateKey'),
      )
      return
    }

    updateState({ isProcessing: true, progress: 0 })

    try {
      let publicKey: string | undefined
      let privateKey: string | undefined
      const mode = state.processMode || 'encrypt'
      const _keyInput = state.keyInput.trim()

      if (mode === 'encrypt') {
        if (isBase58String(_keyInput)) {
          const validation = validateBase58PublicKey(_keyInput)
          if (!validation.isValid) {
            throw new Error(validation.error || t('error.invalidPublicKey'))
          }
          publicKey = _keyInput
        } else {
          throw new Error(t('error.invalidBase58'))
        }
      } else {
        if (isHexString(_keyInput)) {
          if (_keyInput.length !== 64) {
            throw new Error(t('error.invalidPrivateKeyLength'))
          }
          privateKey = _keyInput
        } else if (isMnemonicPhrase(state.keyInput)) {
          privateKey = deriveKeyPair(state.keyInput).privateKey
        } else {
          throw new Error(t('error.invalidPrivateKey'))
        }
      }

      const worker = workerRef.current
      if (!worker) throw new Error(t('error.workerNotInit'))

      const result = await new Promise<{
        data: Blob
        base64?: string
        filename: string
        originalExtension?: string
        signatureValid?: boolean
      }>((resolve, reject) => {
        const handleMessage = (e: MessageEvent) => {
          const { data, error, progress } = e.data
          if (error) {
            worker.removeEventListener('message', handleMessage)
            reject(new Error(error))
          } else if (progress !== undefined) {
            updateState({ progress: Math.round(progress) })
          } else if (data) {
            worker.removeEventListener('message', handleMessage)
            resolve(data)
          }
        }

        worker.addEventListener('message', handleMessage)

        worker.postMessage({
          mode,
          encryptionMode: 'pubk',
          file: state.inputType === 'file' ? state.selectedFile : undefined,
          filename:
            state.inputType === 'file' ? state.fileInfo?.name : undefined,
          text: state.inputType === 'message' ? state.textInput : undefined,
          publicKey,
          privateKey,
          isTextMode: state.inputType === 'message',
        })
      })

      if (state.inputType === 'file') {
        updateState({ encryptedData: result.data })
        if (mode === 'decrypt' && result.originalExtension) {
          updateState({
            fileInfo: state.fileInfo
              ? {
                  ...state.fileInfo,
                  originalExtension: result.originalExtension,
                }
              : null,
          })
        }
        if (result.base64) {
          updateState({
            textResult: result.base64,
            textInput: result.base64,
          })
        }
        if (result.signatureValid !== undefined) {
          toast.info(
            result.signatureValid
              ? t('toast.signatureValid')
              : t('toast.signatureInvalid'),
          )
        }
        toast.success(
          mode === 'encrypt'
            ? t('toast.fileEncrypted')
            : t('toast.fileDecrypted'),
        )
      } else {
        updateState({
          textResult: result.base64 || '',
          textInput: result.base64 || '',
          encryptedData: result.data,
        })
        if (mode === 'decrypt' && result.signatureValid !== undefined) {
          toast.info(
            result.signatureValid
              ? t('toast.signatureValid')
              : t('toast.signatureInvalid'),
          )
        }
        toast.success(
          mode === 'encrypt'
            ? t('toast.textEncrypted')
            : t('toast.textDecrypted'),
        )
      }

      setTimeout(() => {
        updateState({ progress: 0 })
      }, 1000)
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : t('toast.processingError'),
      )
    } finally {
      updateState({ isProcessing: false, progress: 0 })
    }
  }, [state, updateState, workerRef, t])

  return {
    handleTextInputChange,
    handleFileSelect,
    handleCopy,
    handleDownload,
    processInput,
  }
}
