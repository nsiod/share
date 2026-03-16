import { Settings } from 'lucide-react'
import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ExternalPublicKeysTab } from '@/components/Settings/ExternalPublicKeysTab'
import { GeneralTab } from '@/components/Settings/GeneralTab'
import { KeysTab } from '@/components/Settings/KeysTab'
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
import { cn } from '@/lib/utils'

import type { TabType } from '@/types'

const TABS: TabType[] = ['General', 'Keys', 'External Public Keys']

export function SettingsDialog() {
  const { t } = useTranslation()

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<TabType>('General')

  const handleTabClick = useCallback((tab: TabType) => {
    setActiveTab(tab)
  }, [])

  const handleOpenChange = useCallback((open: boolean) => {
    setIsDialogOpen(open)
    if (!open) {
      setActiveTab('General')
    }
  }, [])

  const tabLabelMap: Partial<Record<TabType, string>> = {
    General: t('settings.tabs.general'),
    Keys: t('settings.tabs.keys'),
    'External Public Keys': t('settings.tabs.externalKeys'),
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'General':
        return <GeneralTab />
      case 'Keys':
        return <KeysTab />
      case 'External Public Keys':
        return <ExternalPublicKeysTab />
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

      <Dialog open={isDialogOpen} onOpenChange={handleOpenChange}>
        <DialogContent
          className={cn(
            'gap-0 p-0 overflow-hidden flex flex-col',
            // Mobile: full-screen drawer
            'fixed inset-0 max-w-none w-full h-full rounded-none translate-x-0 translate-y-0 top-0 left-0',
            // Desktop: centered modal
            'sm:inset-auto sm:top-[50%] sm:left-[50%] sm:translate-x-[-50%] sm:translate-y-[-50%] sm:max-w-[600px] sm:w-[90vw] sm:h-auto sm:max-h-[85vh] sm:rounded-lg',
          )}
        >
          {/* Header */}
          <DialogHeader className="border-b p-3 sm:p-4 flex-shrink-0">
            <DialogTitle>{t('settings.title')}</DialogTitle>
          </DialogHeader>

          {/* Top tab bar */}
          <div className="flex-shrink-0 px-4 sm:px-6 pt-4 pb-4">
            <Tabs
              value={activeTab}
              onValueChange={(val) => handleTabClick(val as TabType)}
              className="w-full"
            >
              <TabsList className="w-full">
                {TABS.map((tab) => (
                  <TabsTrigger key={tab} value={tab}>
                    {tabLabelMap[tab]}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>

          {/* Content area */}
          <div className="flex-1 overflow-y-auto min-h-0">
            {renderTabContent()}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
