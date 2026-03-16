import { create } from 'zustand'
import { toast } from 'sonner'
import { secureStorage } from '@/lib/encryption'
import { STORAGE_KEYS } from '@/constants'
import type { KeyPair, PublicKey } from '@/types'

interface KeyStoreState {
  keyPairs: KeyPair[]
  publicKeys: PublicKey[]
  passwordHash: string | null
  isLoaded: boolean

  // Actions
  init: () => Promise<void>
  setKeyPairs: (keyPairs: KeyPair[] | ((prev: KeyPair[]) => KeyPair[])) => void
  setPublicKeys: (publicKeys: PublicKey[] | ((prev: PublicKey[]) => PublicKey[])) => void
  setPasswordHash: (hash: string | null) => void
  removeKeyPairs: () => void
  removePublicKeys: () => void
  removePasswordHash: () => void
  resetAll: () => void
}

export const useKeyStore = create<KeyStoreState>((set, get) => ({
  keyPairs: [],
  publicKeys: [],
  passwordHash: null,
  isLoaded: false,

  init: async () => {
    if (get().isLoaded) return
    try {
      const [keyPairs, publicKeys, passwordHash] = await Promise.all([
        secureStorage.getItem<KeyPair[]>(STORAGE_KEYS.KEY_PAIRS, []),
        secureStorage.getItem<PublicKey[]>(STORAGE_KEYS.PUBLIC_KEYS, []),
        secureStorage.getItem<string | null>(STORAGE_KEYS.PASSWORD_HASH, null),
      ])
      set({ keyPairs, publicKeys, passwordHash, isLoaded: true })
    } catch (error) {
      console.error('Failed to load encrypted data from localStorage:', error)
      toast.error('Failed to load data from storage')
      set({ isLoaded: true })
    }
  },

  setKeyPairs: (keyPairs) => {
    const resolved = typeof keyPairs === 'function' ? keyPairs(get().keyPairs) : keyPairs
    set({ keyPairs: resolved })
    secureStorage.setItem(STORAGE_KEYS.KEY_PAIRS, resolved).catch((error) => {
      console.error('Failed to save keyPairs:', error)
      toast.error('Failed to save data to storage')
    })
  },

  setPublicKeys: (publicKeys) => {
    const resolved = typeof publicKeys === 'function' ? publicKeys(get().publicKeys) : publicKeys
    set({ publicKeys: resolved })
    secureStorage.setItem(STORAGE_KEYS.PUBLIC_KEYS, resolved).catch((error) => {
      console.error('Failed to save publicKeys:', error)
      toast.error('Failed to save data to storage')
    })
  },

  setPasswordHash: (hash) => {
    set({ passwordHash: hash })
    secureStorage.setItem(STORAGE_KEYS.PASSWORD_HASH, hash).catch((error) => {
      console.error('Failed to save passwordHash:', error)
      toast.error('Failed to save data to storage')
    })
  },

  removeKeyPairs: () => {
    set({ keyPairs: [] })
    secureStorage.removeItem(STORAGE_KEYS.KEY_PAIRS)
  },

  removePublicKeys: () => {
    set({ publicKeys: [] })
    secureStorage.removeItem(STORAGE_KEYS.PUBLIC_KEYS)
  },

  removePasswordHash: () => {
    set({ passwordHash: null })
    secureStorage.removeItem(STORAGE_KEYS.PASSWORD_HASH)
  },

  resetAll: () => {
    set({ keyPairs: [], publicKeys: [], passwordHash: null })
    secureStorage.removeItem(STORAGE_KEYS.KEY_PAIRS)
    secureStorage.removeItem(STORAGE_KEYS.PUBLIC_KEYS)
    secureStorage.removeItem(STORAGE_KEYS.PASSWORD_HASH)
  },
}))
