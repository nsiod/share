import { useState, useRef, useCallback, useEffect } from 'react'
import CryptoWorker from '@/workers/cryptoWorker.ts?worker&inline'

import type { CryptoState } from '@/types'

export const useCryptoState = () => {
  const [state, setState] = useState<CryptoState>({
    inputType: 'file',
    keyInput: '',
    selectedFile: null,
    textInput: '',
    encryptedData: null,
    textResult: null,
    fileInfo: null,
    isProcessing: false,
    progress: 0,
    processMode: 'encrypt',
    isDragOver: false
  })

  const workerRef = useRef<Worker | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const detectTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const updateState = (updates: Partial<CryptoState>) => {
    setState(prev => ({ ...prev, ...updates }))
  }

  const clearState = useCallback(() => {
    setState({
      inputType: state.inputType,
      keyInput: '',
      selectedFile: null,
      textInput: '',
      encryptedData: null,
      textResult: null,
      fileInfo: null,
      isProcessing: false,
      progress: 0,
      processMode: 'encrypt',
      isDragOver: false
    })

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    if (detectTimeoutRef.current) {
      clearTimeout(detectTimeoutRef.current)
    }
  }, [state.inputType])

  useEffect(() => {
    workerRef.current = new CryptoWorker()
    return () => workerRef.current?.terminate()
  }, [])

  return {
    state,
    updateState,
    clearState,
    workerRef,
    fileInputRef,
    detectTimeoutRef
  }
}

