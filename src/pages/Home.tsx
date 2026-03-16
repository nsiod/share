import { useCallback, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import {
  ActionButtons,
  CryptoTabs,
  KeyInputSection,
  ProcessButton,
} from '@/components/Home'
import { HeroBackground } from '@/components/Home/HeroBackground'
import HowItWorksSection from '@/components/HowItWorksSection'
import { useCryptoLogic, useCryptoState, useDragAndDrop } from '@/hooks'
import { isBase58String, validateBase58PublicKey } from '@/lib'

export default function HomePage() {
  const { publicKey } = useParams<{ publicKey: string }>()
  const {
    state,
    updateState,
    clearState,
    workerRef,
    fileInputRef,
    detectTimeoutRef,
  } = useCryptoState()

  const {
    handleTextInputChange,
    handleFileSelect,
    handleCopy,
    handleDownload,
    processInput,
  } = useCryptoLogic({
    state,
    updateState,
    clearState,
    workerRef,
    detectTimeoutRef,
  })

  const { handleDragOver, handleDragEnter, handleDragLeave, handleDrop } =
    useDragAndDrop({
      updateState,
      clearState,
      handleFileSelect,
    })

  const handleFileInputChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) {
        await handleFileSelect(file)
      }
    },
    [handleFileSelect],
  )

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  useEffect(() => {
    if (publicKey && isBase58String(publicKey)) {
      const validation = validateBase58PublicKey(publicKey)
      if (validation.isValid) {
        updateState({ keyInput: publicKey, processMode: 'encrypt' })
      }
    }
  }, [publicKey, updateState])

  const isProcessButtonDisabled =
    (state.inputType === 'file' && !state.selectedFile) ||
    (state.inputType === 'message' && !state.textInput) ||
    !state.keyInput ||
    state.isProcessing

  return (
    <>
      <div className="relative py-8 sm:py-12 md:py-16 z-[1] bg-[var(--hero-bg)]">
        <HeroBackground />

        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileInputChange}
          accept="*/*"
          multiple={false}
        />

        <div className="flex justify-center items-center relative z-10 w-full max-w-[100vw] sm:max-w-3xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col items-center w-full">
            <CryptoTabs
              inputType={state.inputType}
              fileInfo={state.fileInfo}
              textInput={state.textInput}
              textResult={state.textResult}
              isDragOver={state.isDragOver}
              onInputTypeChange={(value) => {
                clearState()
                updateState({ inputType: value as 'file' | 'message' })
              }}
              onTextInputChange={handleTextInputChange}
              onFileSelect={triggerFileInput}
              onDragOver={handleDragOver}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClearFile={clearState}
            />

            {(state.selectedFile || state.textInput) && (
              <div className="flex flex-col items-center w-full max-w-[90vw] sm:max-w-2xl">
                <div className="w-full sm:w-3/4 space-y-6 sm:space-y-8">
                  {!state.encryptedData && (
                    <KeyInputSection
                      processMode={state.processMode}
                      keyInput={state.keyInput}
                      onKeyInputChange={(value) =>
                        updateState({ keyInput: value })
                      }
                    />
                  )}

                  {!state.encryptedData && (
                    <ProcessButton
                      processMode={state.processMode}
                      isDisabled={isProcessButtonDisabled}
                      isProcessing={state.isProcessing}
                      progress={state.progress}
                      onClick={processInput}
                    />
                  )}

                  {state.encryptedData && (
                    <ActionButtons
                      inputType={state.inputType}
                      isProcessing={state.isProcessing}
                      onReset={clearState}
                      onCopy={
                        state.inputType === 'message' ? handleCopy : undefined
                      }
                      onDownload={handleDownload}
                    />
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <HowItWorksSection />
    </>
  )
}
