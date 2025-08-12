export interface FileInfo {
  name: string
  size: number
  type: string
  encryptionMode?: 'public-key' | 'password' | 'unknown'
  originalExtension?: string
}

export interface CryptoState {
  inputType: 'file' | 'message'
  keyInput: string
  selectedFile: File | null
  textInput: string
  encryptedData: Blob | null
  textResult: string | null
  fileInfo: FileInfo | null
  isProcessing: boolean
  progress: number
  processMode: 'encrypt' | 'decrypt'
  isDragOver: boolean
  showKeyDropdown?: boolean
  matchedKeys?: any[]
  isKeyInputFocused?: boolean
}
