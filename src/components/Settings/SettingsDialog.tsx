import { ChevronLeft, Settings, X } from 'lucide-react'
import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { ExternalPublicKeysTab } from '@/components/Settings/ExternalPublicKeysTab'
import { GeneralTab } from '@/components/Settings/GeneralTab'
import { ImportDialog } from '@/components/Settings/ImportDialog'
import { KeysTab } from '@/components/Settings/KeysTab'
import { PublicKeyForm } from '@/components/Settings/PublicKeyForm'
import { SecurityPasswordTab } from '@/components/Settings/SecurityPasswordTab'
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Tabs,
  TabsList,
  TabsTrigger,
} from '@/components/ui'
import { STORAGE_KEYS } from '@/constants'
import { useSecureLocalStorage } from '@/hooks/useSecureLocalStorage'
import { validatePublicKey } from '@/lib/key'
import { cn } from '@/lib/utils'

import type { KeyPair, PublicKey, TabType } from '@/types'

const TABS: TabType[] = [
  'General',
  'Keys',
  'External Public Keys',
  'Security Password',
]

export function SettingsDialog() {
  const { t } = useTranslation()

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<TabType>('General')

  const [showImportDialog, setShowImportDialog] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const [publicKeys, setPublicKeys, removePublicKeys] = useSecureLocalStorage<
    PublicKey[]
  >(STORAGE_KEYS.PUBLIC_KEYS, [])
  const [showAddKey, setShowAddKey] = useState(false)
  const [editKey, setEditKey] = useState<PublicKey | null>(null)
  const [validationError, setValidationError] = useState('')

  const [keyPairs, setKeyPairs, removeKeyPairs] = useSecureLocalStorage<
    KeyPair[]
  >(STORAGE_KEYS.KEY_PAIRS, [])
  const [showCreateKeyPair, setShowCreateKeyPair] = useState(false)
  const [editKeyPair, setEditKeyPair] = useState<KeyPair | null>(null)

  const [storedPasswordHash, setStoredPasswordHash, removePasswordHash] =
    useSecureLocalStorage<string | null>(STORAGE_KEYS.PASSWORD_HASH, null)
  const [showChangePassword, setShowChangePassword] = useState(false)

  const resetAllStates = useCallback(() => {
    setShowImportDialog(false)
    setSelectedFile(null)
    setShowAddKey(false)
    setEditKey(null)
    setShowChangePassword(false)
    setShowCreateKeyPair(false)
    setEditKeyPair(null)
    setValidationError('')
  }, [])

  const handleTabClick = useCallback(
    (tab: TabType) => {
      setActiveTab(tab)
      resetAllStates()
      if (tab === 'Security Password' && !storedPasswordHash) {
        setShowChangePassword(true)
      }
    },
    [storedPasswordHash, resetAllStates],
  )

  const handleCloseDialog = useCallback(() => {
    setIsDialogOpen(false)
    resetAllStates()
  }, [resetAllStates])

  const handleFileSelect = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0]
      setSelectedFile(file || null)
    },
    [],
  )

  const handleImport = useCallback(() => {
    setShowImportDialog(false)
    setSelectedFile(null)
  }, [])

  const handleSavePublicKey = useCallback(() => {
    if (!editKey) {
      setValidationError('No public key data provided')
      toast.error('No public key data provided')
      return
    }

    const validation = validatePublicKey(editKey.publicKey)
    if (!validation.isValid) {
      setValidationError(validation.error || 'Invalid public key')
      toast.error(validation.error || 'Invalid public key')
      return
    }

    const newPublicKeys = [...publicKeys]
    if (editKey.index !== undefined) {
      newPublicKeys[editKey.index] = {
        publicKey: editKey.publicKey,
        note: editKey.note || '',
      }
    } else {
      newPublicKeys.push({
        publicKey: editKey.publicKey,
        note: editKey.note || '',
      })
    }

    setPublicKeys(newPublicKeys)
    toast.success(t('settings.externalKeys.saved'))
    setShowAddKey(false)
    setEditKey(null)
    setValidationError('')
  }, [editKey, publicKeys, setPublicKeys, t])

  const tabLabelMap: Record<TabType, string> = {
    General: t('settings.tabs.general'),
    Keys: t('settings.tabs.keys'),
    'External Public Keys': t('settings.tabs.externalKeys'),
    'Security Password': t('settings.tabs.password'),
  }

  const renderTabContent = () => {
    if (showImportDialog) {
      return (
        <ImportDialog
          selectedFile={selectedFile}
          onFileSelect={handleFileSelect}
          onImport={handleImport}
          onCancel={() => setShowImportDialog(false)}
        />
      )
    }

    if (showAddKey) {
      return (
        <div className="p-3 sm:p-6">
          <div className="flex items-center gap-2 mb-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowAddKey(false)}
            >
              <ChevronLeft className="size-4" />
            </Button>
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100">
              {t('settings.tabs.externalKeys')}
            </h2>
          </div>
          <div className="flex justify-center text-center pt-2 pb-6">
            <PublicKeyForm
              editKey={editKey}
              validationError={validationError}
              onPublicKeyChange={(value) =>
                setEditKey((prev) => ({
                  ...(prev || { publicKey: '', note: '' }),
                  publicKey: value,
                }))
              }
              onNoteChange={(value) =>
                setEditKey((prev) => ({
                  ...(prev || { publicKey: '', note: '' }),
                  note: value,
                }))
              }
              onSave={handleSavePublicKey}
              onCancel={() => {
                setShowAddKey(false)
                setEditKey(null)
                setValidationError('')
              }}
            />
          </div>
        </div>
      )
    }

    switch (activeTab) {
      case 'General':
        return (
          <GeneralTab
            removePublicKeys={removePublicKeys}
            removeKeyPairs={removeKeyPairs}
            removePasswordHash={removePasswordHash}
            setShowImportDialog={setShowImportDialog}
          />
        )
      case 'Keys':
        return (
          <KeysTab
            keyPairs={keyPairs}
            setKeyPairs={setKeyPairs}
            showCreateKeyPair={showCreateKeyPair}
            setShowCreateKeyPair={setShowCreateKeyPair}
            editKeyPair={editKeyPair}
            setEditKeyPair={setEditKeyPair}
          />
        )
      case 'External Public Keys':
        return (
          <ExternalPublicKeysTab
            publicKeys={publicKeys}
            setPublicKeys={setPublicKeys}
            setShowAddKey={setShowAddKey}
            setEditKey={setEditKey}
          />
        )
      case 'Security Password':
        return (
          <SecurityPasswordTab
            storedPasswordHash={storedPasswordHash}
            setStoredPasswordHash={setStoredPasswordHash}
            showChangePassword={showChangePassword}
            setShowChangePassword={setShowChangePassword}
            setActiveTab={setActiveTab}
          />
        )
      default:
        return null
    }
  }

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="cursor-pointer"
        onClick={() => setIsDialogOpen(true)}
      >
        <Settings className="size-5" />
      </Button>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent
          className={cn(
            'gap-0 p-0 overflow-hidden flex flex-col',
            // Mobile: full-screen drawer
            'fixed inset-0 max-w-none w-full h-full rounded-none translate-x-0 translate-y-0 top-0 left-0',
            // Desktop: centered modal
            'sm:inset-auto sm:top-[50%] sm:left-[50%] sm:translate-x-[-50%] sm:translate-y-[-50%] sm:max-w-[900px] sm:w-[90vw] sm:h-auto sm:max-h-[85vh] sm:rounded-lg',
          )}
          showClose={false}
        >
          {/* Header */}
          <DialogHeader className="border-b p-3 sm:p-4 bg-white dark:bg-gray-900 flex-shrink-0">
            <div className="flex justify-between items-center">
              <DialogTitle className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100">
                {t('settings.title')}
              </DialogTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleCloseDialog}
                className="size-8 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X className="size-5" />
              </Button>
            </div>
          </DialogHeader>

          {/* Top tab bar */}
          <div className="flex-shrink-0 bg-white dark:bg-gray-900 px-4 sm:px-6 pt-4 pb-4">
            <Tabs
              value={activeTab}
              onValueChange={(val) => handleTabClick(val as TabType)}
              className="flex flex-col items-center w-full"
            >
              <TabsList>
                {TABS.map((tab) => (
                  <TabsTrigger key={tab} value={tab}>
                    {tabLabelMap[tab]}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>

          {/* Content area */}
          <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-800 min-h-0">
            {renderTabContent()}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
