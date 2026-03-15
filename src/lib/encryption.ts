const STORAGE_PASSWORD = 'TTPOS_SECURE_VAULT_2024_STORAGE_KEY'
const SALT_STORAGE_KEY = '__ttpos_storage_salt__'
const PBKDF2_ITERATIONS = 100_000

let cachedCryptoKey: CryptoKey | null = null
let cachedSaltHex: string | null = null

function getOrCreateSalt(): Uint8Array {
  const existing = localStorage.getItem(SALT_STORAGE_KEY)
  if (existing && cachedSaltHex === existing) {
    return new Uint8Array(
      existing.match(/.{1,2}/g)!.map((b) => Number.parseInt(b, 16)),
    )
  }

  if (existing) {
    cachedSaltHex = existing
    return new Uint8Array(
      existing.match(/.{1,2}/g)!.map((b) => Number.parseInt(b, 16)),
    )
  }

  const salt = crypto.getRandomValues(new Uint8Array(16))
  const hex = Array.from(salt)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
  localStorage.setItem(SALT_STORAGE_KEY, hex)
  cachedSaltHex = hex
  cachedCryptoKey = null
  return salt
}

async function getEncryptionKey(): Promise<CryptoKey> {
  if (cachedCryptoKey) return cachedCryptoKey

  const salt = getOrCreateSalt()
  const encoder = new TextEncoder()
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(STORAGE_PASSWORD),
    { name: 'PBKDF2' },
    false,
    ['deriveKey'],
  )

  cachedCryptoKey = await crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt,
      iterations: PBKDF2_ITERATIONS,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt'],
  )

  return cachedCryptoKey
}

export const encryptForStorage = async (data: string): Promise<string> => {
  const key = await getEncryptionKey()
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const encoded = new TextEncoder().encode(data)
  const ciphertext = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    encoded,
  )

  // Prepend IV to ciphertext, encode as base64
  const combined = new Uint8Array(iv.length + ciphertext.byteLength)
  combined.set(iv, 0)
  combined.set(new Uint8Array(ciphertext), iv.length)

  return btoa(String.fromCharCode(...combined))
}

export const decryptFromStorage = async (
  encryptedData: string,
): Promise<string> => {
  const key = await getEncryptionKey()
  const combined = Uint8Array.from(atob(encryptedData), (c) => c.charCodeAt(0))

  const iv = combined.slice(0, 12)
  const ciphertext = combined.slice(12)

  const decrypted = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv },
    key,
    ciphertext,
  )

  return new TextDecoder().decode(decrypted)
}

export const secureStorage = {
  setItem: async (key: string, value: unknown): Promise<void> => {
    const serializedValue = JSON.stringify(value)
    const encryptedValue = await encryptForStorage(serializedValue)
    localStorage.setItem(key, encryptedValue)
  },

  getItem: async <T>(key: string, defaultValue: T): Promise<T> => {
    try {
      const encryptedValue = localStorage.getItem(key)
      if (!encryptedValue) return defaultValue
      const decryptedValue = await decryptFromStorage(encryptedValue)
      return JSON.parse(decryptedValue) as T
    } catch {
      return defaultValue
    }
  },

  removeItem: (key: string): void => {
    localStorage.removeItem(key)
  },

  hasValidItem: async (key: string): Promise<boolean> => {
    try {
      const encryptedValue = localStorage.getItem(key)
      if (!encryptedValue) return false
      await decryptFromStorage(encryptedValue)
      return true
    } catch {
      return false
    }
  },
}
