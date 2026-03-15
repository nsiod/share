# SecureVault

A client-side file and text encryption/decryption tool built with Vite + React 19. It uses ECIES (Elliptic Curve Integrated Encryption Scheme) based on the secp256k1 curve, supports chunked processing for large files, and runs all cryptographic operations in Web Workers to keep the UI responsive.

## Features

- **Any File Type** - Encrypt and decrypt files of any format
- **Text Encryption** - Encrypt and decrypt plain text messages directly
- **Asymmetric Encryption** - ECIES with Base58-encoded public keys and hex/mnemonic private keys
- **Large File Chunking** - Splits files into chunks (default 5MB) to optimize memory usage
- **Web Worker Processing** - Crypto operations run off the main thread
- **Key Management** - Generate, store, and manage key pairs with BIP39 mnemonic support
- **External Public Keys** - Save and manage external public keys for quick access
- **Secure Local Storage** - Key material encrypted with AES-GCM via Web Crypto API
- **i18n** - English and Chinese language support
- **Dark Mode** - System-aware theme with manual toggle

## Tech Stack

- **Runtime**: Vite 7 + React 19 + TypeScript
- **UI**: [@base-ui/react](https://base-ui.com/) + Tailwind CSS 4
- **Crypto**: [eciesjs](https://github.com/nicktomlin/eciesjs), [@noble/ciphers](https://github.com/paulmillr/noble-ciphers), [@scure/bip39](https://github.com/nicktomlin/scure-bip39)
- **Storage**: AES-256-GCM encrypted localStorage with per-installation PBKDF2 salt
- **i18n**: react-i18next
- **Routing**: react-router-dom

## Getting Started

```bash
# Install dependencies
pnpm install

# Start dev server (port 3001)
pnpm dev

# Production build
pnpm build

# Preview production build
pnpm preview
```

## Usage

### Encrypt

1. Select a file or paste text
2. Enter or select the recipient's Base58-encoded public key
3. Click **Encrypt** - the encrypted output downloads automatically (`.enc` suffix for files)

### Decrypt

1. Select an encrypted file (`.enc`) or paste encrypted text
2. Enter the mnemonic phrase (12+ words) or private key (64 hex characters)
3. Click **Decrypt** - the original file or text is restored

### Key Management

Open **Settings** to:

- Generate new key pairs (BIP39 mnemonic-based)
- Import existing key pairs or external public keys
- Add notes to keys for identification
- Set a 6-digit security password to protect stored keys

## Security

- All encryption/decryption runs client-side in Web Workers; keys never leave the device
- Local storage is encrypted with AES-256-GCM using a PBKDF2-derived key with per-installation random salt
- Public keys are validated (Base58 decode, 33/65 byte length, correct prefix)
- Mnemonic phrases are validated against the BIP39 English wordlist
- Use HTTPS in production to protect data in transit
- Users are responsible for backing up their mnemonic phrases securely

## License

[MIT](./LICENSE) License
