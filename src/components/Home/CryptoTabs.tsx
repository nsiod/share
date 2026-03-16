import type React from 'react'
import { useTranslation } from 'react-i18next'
import TextInputArea from '@/components/TextInputArea'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Textarea,
} from '@/components/ui'
import type { FileInfo } from '@/types'

import { FileUploadArea } from './FileUploadArea'

interface CryptoTabsProps {
  inputType: 'file' | 'message'
  fileInfo: FileInfo | null
  textInput: string
  textResult: string | null
  isDragOver: boolean
  onInputTypeChange: (value: 'file' | 'message') => void
  onTextInputChange: (value: string) => void
  onFileSelect: () => void
  onDragOver: (e: React.DragEvent) => void
  onDragEnter: (e: React.DragEvent) => void
  onDragLeave: (e: React.DragEvent) => void
  onDrop: (e: React.DragEvent) => void
  onClearFile: () => void
}

export const CryptoTabs: React.FC<CryptoTabsProps> = ({
  inputType,
  fileInfo,
  textInput,
  textResult,
  isDragOver,
  onInputTypeChange,
  onTextInputChange,
  onFileSelect,
  onDragOver,
  onDragEnter,
  onDragLeave,
  onDrop,
  onClearFile,
}) => {
  const { t } = useTranslation()

  return (
    <Tabs
      value={inputType}
      className="flex flex-col items-center w-full"
      onValueChange={(value) => onInputTypeChange(value as 'file' | 'message')}
    >
      <TabsList className="h-10!">
        <TabsTrigger value="file" className="sm:px-8">
          {t('tabs.upload')}
        </TabsTrigger>
        <TabsTrigger value="message" className="sm:px-8">
          {t('tabs.pasteText')}
        </TabsTrigger>
      </TabsList>

      <TabsContent value="file" className="w-full max-w-[90vw] mt-0">
        <div className="py-4 sm:py-6 space-y-6">
          <div className="bg-white dark:bg-[#282B30] rounded-xl backdrop-blur-sm border border-gray-200/50 dark:border-gray-700 p-6">
            <FileUploadArea
              fileInfo={fileInfo}
              isDragOver={isDragOver}
              onFileSelect={onFileSelect}
              onDragOver={onDragOver}
              onDragEnter={onDragEnter}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
              onClear={onClearFile}
            />
            {textResult && (
              <div className="mt-4">
                <Textarea
                  value={textResult}
                  readOnly
                  placeholder={t('textInput.placeholder')}
                  className="h-[186px] sm:min-h-[238px] max-h-[238px] sm:max-h-[300px] font-mono text-xs sm:text-sm break-all resize-none rounded-md border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-200 pr-3 sm:pr-4 pb-10 sm:pb-14"
                />
              </div>
            )}
          </div>
        </div>
      </TabsContent>

      <TabsContent value="message" className="w-full max-w-[90vw] mt-0">
        <div className="py-4 sm:py-6 space-y-6">
          <TextInputArea
            textInput={textInput}
            textResult={textResult}
            onTextChange={onTextInputChange}
          />
        </div>
      </TabsContent>
    </Tabs>
  )
}
