const { subtle } = globalThis.crypto
const getRandomValues = <T extends ArrayBufferView>(array: T): T =>
  globalThis.crypto.getRandomValues(array)

export async function hashPasswordFn(
  password: string,
  providedSalt?: Uint8Array,
): Promise<string> {
  const encoder = new TextEncoder()
  // Use provided salt if available, otherwise generate a new one
  const salt = providedSalt
    ? new Uint8Array(providedSalt)
    : getRandomValues(new Uint8Array(16))
  const keyMaterial = await subtle.importKey(
    'raw',
    encoder.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveBits', 'deriveKey'],
  )
  const key = await subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt,
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt', 'decrypt'],
  )
  const exportedKey = (await subtle.exportKey('raw', key)) as ArrayBuffer
  const hashBuffer = new Uint8Array(exportedKey)
  const hashArray = Array.from(hashBuffer)
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
  const saltHex = Array.from(salt)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')

  return `${saltHex}:${hashHex}`
}

// Constant-time string comparison to prevent timing attacks
function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  let result = 0
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i)
  }
  return result === 0
}

export async function verifyPasswordFn(
  storedHash: string,
  passwordAttempt: string,
): Promise<boolean> {
  const [saltHex, originalHash] = storedHash.split(':')
  const matchResult = saltHex?.match(/.{1,2}/g)

  if (!matchResult || !originalHash) {
    throw new Error('Invalid salt format')
  }

  const salt = new Uint8Array(
    matchResult.map((byte) => Number.parseInt(byte, 16)),
  )
  const attemptHashWithSalt = await hashPasswordFn(passwordAttempt, salt)
  const [, attemptHash] = attemptHashWithSalt.split(':')

  if (!attemptHash) {
    return false
  }

  return constantTimeEqual(attemptHash, originalHash)
}
