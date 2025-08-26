import {
  deriveKeyPair,
  detect,
  isBase58String,
  isHexString,
  isMnemonicPhrase,
  validateBase58PublicKey,
  downloadFile
} from '@nsiod/share-utils'
import { useCallback } from 'react'
import { toast } from 'sonner'

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
  detectTimeoutRef
}: UseCryptoLogicProps) => {
  // Handle text input change with detection
  const handleTextInputChange = useCallback(async (value: string) => {
    updateState({ textInput: value })

    // Clear previous timeout
    if (detectTimeoutRef.current) {
      clearTimeout(detectTimeoutRef.current)
    }

    // Add debounce to avoid frequent detection calls
    detectTimeoutRef.current = setTimeout(async () => {
      if (value.trim()) {
        try {
          const metadata = await detect(value)

          if (metadata.encryptionType === 'pubk') {
            if (state.processMode !== 'decrypt') {
              updateState({ processMode: 'decrypt' })
              toast.info('Detected public key encrypted text, switching to decrypt mode')
            }
          } else if (metadata.encryptionType === 'signed') {
            toast.error('Signed content is not supported yet')
            updateState({ textInput: '' })
            return
          } else if (metadata.encryptionType === 'pwd') {
            toast.error('Password encrypted content is not supported in this mode')
            updateState({ textInput: '' })
            return
          } else {
            if (state.processMode !== 'encrypt') {
              updateState({ processMode: 'encrypt' })
              toast.info('Detected unencrypted text, switching to encrypt mode')
            }
          }
        } catch (error) {
          console.error('Text detection failed:', error)
        }
      }
    }, 300)
  }, [state.processMode, updateState, detectTimeoutRef])

  // Handle file selection
  const handleFileSelect = useCallback(async (file: File) => {
    try {
      updateState({
        selectedFile: file,
        fileInfo: {
          name: file.name,
          size: file.size,
          type: file.type || 'Unknown',
          encryptionMode: 'public-key'
        },
        textInput: '',
        inputType: 'file'
      })

      const metadata = await detect(file)

      if (metadata.encryptionType === 'pubk') {
        if (state.inputType !== 'file') {
          toast.info('Detected public key encrypted file, switching to Key Encryption mode')
        }
        updateState({
          processMode: file.name.endsWith('.enc') ? 'decrypt' : 'encrypt'
        })
      } else if (metadata.encryptionType === 'signed') {
        toast.error('Signed files are not supported yet')
        clearState()
        return
      } else {
        updateState({ processMode: 'encrypt' })
      }
    } catch (error) {
      console.error('File detection failed:', error)
      toast.error('Failed to process file')
      clearState()
    }
  }, [state.inputType, updateState, clearState])

  // Handle copy
  const handleCopy = useCallback(() => {
    if (state.textResult) {
      navigator.clipboard.writeText(state.textResult).then(() => {
        toast.success('Text copied to clipboard!')
      }).catch(() => {
        toast.error('Failed to copy text')
      })
    }
  }, [state.textResult])

  // Handle download
  const handleDownload = useCallback(() => {
    if (state.encryptedData) {
      const filename = generateDownloadFilename(state.inputType, state.fileInfo, state.processMode)
      downloadFile(state.encryptedData, filename)
      toast.success(`${state.processMode === 'encrypt' ? 'Encrypted' : 'Decrypted'} ${state.inputType === 'file' ? 'file' : 'text'} downloaded successfully`)
    }
  }, [state.encryptedData, state.inputType, state.fileInfo, state.processMode])

  // Process input (encrypt/decrypt)
  const processInput = useCallback(async () => {
    if (state.inputType === 'file' && !state.selectedFile) {
      toast.error('Please select a file')
      return
    }
    if (state.inputType === 'message' && !state.textInput) {
      toast.error('Please enter text to process')
      return
    }
    if (!state.keyInput) {
      toast.error(`Please enter a ${state.processMode === 'encrypt' ? 'public key' : 'private key or mnemonic'}`)
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
            throw new Error(validation.error || 'Invalid public key')
          }
          publicKey = _keyInput
        } else {
          throw new Error('Invalid input. Please enter a valid Base58 public key')
        }
      } else {
        if (isHexString(_keyInput)) {
          if (_keyInput.length !== 64) {
            throw new Error('Invalid private key length. Must be 32 bytes (64 hex characters)')
          }
          privateKey = _keyInput
        } else if (isMnemonicPhrase(state.keyInput)) {
          privateKey = deriveKeyPair(state.keyInput).privateKey
        } else {
          throw new Error('Invalid input. Please enter a valid private key (64 hex characters) or mnemonic phrase')
        }
      }

      const worker = workerRef.current
      if (!worker) throw new Error('Web Worker not initialized')

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
          filename: state.inputType === 'file' ? state.fileInfo?.name : undefined,
          text: state.inputType === 'message' ? state.textInput : undefined,
          publicKey,
          privateKey,
          isTextMode: state.inputType === 'message'
        })
      })

      if (state.inputType === 'file') {
        updateState({ encryptedData: result.data })
        if (mode === 'decrypt' && result.originalExtension) {
          updateState({
            fileInfo: state.fileInfo ? {
              ...state.fileInfo,
              originalExtension: result.originalExtension
            } : null
          })
        }
        if (result.base64) {
          updateState({
            textResult: result.base64,
            textInput: result.base64
          })
        }
        if (result.signatureValid !== undefined) {
          toast.info(`Signature verification: ${result.signatureValid ? 'Valid' : 'Invalid'}`)
        }
        toast.success(`File ${mode === 'encrypt' ? 'encrypted' : 'decrypted'} successfully! Please click the download button to save.`)
      } else {
        updateState({
          textResult: result.base64 || '',
          textInput: result.base64 || '',
          encryptedData: result.data
        })
        if (mode === 'decrypt' && result.signatureValid !== undefined) {
          toast.info(`Signature verification: ${result.signatureValid ? 'Valid' : 'Invalid'}`)
        }
        toast.success(`Text ${mode === 'encrypt' ? 'encrypted' : 'decrypted'} successfully!`)
      }

      setTimeout(() => {
        updateState({ progress: 0 })
      }, 1000)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'An error occurred during processing')
    } finally {
      updateState({ isProcessing: false })
    }
  }, [state, updateState, workerRef])

  return {
    handleTextInputChange,
    handleFileSelect,
    handleCopy,
    handleDownload,
    processInput
  }
}
