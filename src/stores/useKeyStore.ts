import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { encryptForStorage, decryptFromStorage } from '@/lib/encryption'
import type { KeyPair, PublicKey } from '@/types'

const STORAGE_NAME = 'secure-key-store'

interface KeyStoreData {
  keyPairs: KeyPair[]
  publicKeys: PublicKey[]
  passwordHash: string | null
}

interface KeyStoreActions {
  setKeyPairs: (keyPairs: KeyPair[] | ((prev: KeyPair[]) => KeyPair[])) => void
  setPublicKeys: (publicKeys: PublicKey[] | ((prev: PublicKey[]) => PublicKey[])) => void
  setPasswordHash: (hash: string | null) => void
  resetAll: () => void
}

type KeyStoreState = KeyStoreData & KeyStoreActions

const encryptedStorage = createJSONStorage<KeyStoreData>(() => ({
  getItem: async (name: string): Promise<string | null> => {
    const encrypted = localStorage.getItem(name)
    if (!encrypted) return null
    try {
      return await decryptFromStorage(encrypted)
    } catch {
      return null
    }
  },
  setItem: async (name: string, value: string): Promise<void> => {
    const encrypted = await encryptForStorage(value)
    localStorage.setItem(name, encrypted)
  },
  removeItem: (name: string): void => {
    localStorage.removeItem(name)
  },
}))

export const useKeyStore = create<KeyStoreState>()(
  persist(
    (set, get) => ({
      keyPairs: [],
      publicKeys: [],
      passwordHash: null,

      setKeyPairs: (keyPairs) => {
        const resolved = typeof keyPairs === 'function' ? keyPairs(get().keyPairs) : keyPairs
        set({ keyPairs: resolved })
      },

      setPublicKeys: (publicKeys) => {
        const resolved = typeof publicKeys === 'function' ? publicKeys(get().publicKeys) : publicKeys
        set({ publicKeys: resolved })
      },

      setPasswordHash: (hash) => {
        set({ passwordHash: hash })
      },

      resetAll: () => {
        set({ keyPairs: [], publicKeys: [], passwordHash: null })
      },
    }),
    {
      name: STORAGE_NAME,
      storage: encryptedStorage,
      partialize: (state) => ({
        keyPairs: state.keyPairs,
        publicKeys: state.publicKeys,
        passwordHash: state.passwordHash,
      }),
    },
  ),
)
