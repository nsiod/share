import type { ClassValue } from 'clsx'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { FileInfo } from '@/types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const generateTimestamp = () => Date.now()

export function getFilenameWithoutExtension(filename: string) {
  const parts = filename.split('.')
  return parts.length > 1 ? parts.slice(0, -1).join('.') : filename
}

export const generateDownloadFilename = (
  inputType: 'file' | 'message',
  fileInfo: FileInfo | null,
  processMode: 'encrypt' | 'decrypt' | null,
) => {
  const timestamp = generateTimestamp()

  if (inputType === 'file' && fileInfo) {
    const nameWithoutExt = getFilenameWithoutExtension(fileInfo.name)
    const extension = fileInfo.originalExtension || 'bin'
    return processMode === 'encrypt'
      ? `${nameWithoutExt}_${timestamp}.enc`
      : `${timestamp}.${extension}`
  } else if (inputType === 'message') {
    return processMode === 'encrypt'
      ? `encrypted_text_${timestamp}.enc`
      : `text_${timestamp}.txt`
  }

  return `text_${timestamp}`
}
