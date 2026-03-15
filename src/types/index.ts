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
  matchedKeys?: unknown[]
  isKeyInputFocused?: boolean
}

export interface PublicKey {
  publicKey: string
  note: string
  index?: number
}

export interface KeyPair {
  publicKey: string
  privateKey?: string
  mnemonic?: string
  note: string
  index?: number
}

export type TabType =
  | 'General'
  | 'Keys'
  | 'External Public Keys'
  | 'Security Password'

export interface ValidationResult {
  isValid: boolean
  error?: string
}
