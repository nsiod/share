import { Info } from 'lucide-react'
import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { LanguageSelector } from '@/components/Settings/LanguageSelector'
import { ThemeSelector } from '@/components/Settings/ThemeSelector'
import {
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui'

interface GeneralTabProps {
  removePublicKeys: () => void
  removeKeyPairs: () => void
  removePasswordHash: () => void
  setShowImportDialog: (value: boolean) => void
}

export const GeneralTab = ({
  removePublicKeys,
  removeKeyPairs,
  removePasswordHash,
  setShowImportDialog,
}: GeneralTabProps) => {
  const { t } = useTranslation()
  const [isResetPopoverOpen, setIsResetPopoverOpen] = useState(false)

  const handleReset = useCallback(() => {
    removePublicKeys()
    removeKeyPairs()
    removePasswordHash()
    setIsResetPopoverOpen(false)
    toast.success(t('settings.general.resetSuccess'))
  }, [removePublicKeys, removeKeyPairs, removePasswordHash, t])

  const handleBackup = useCallback(() => {
    toast.info(
      t('settings.general.comingSoon', { defaultValue: 'Coming soon' }),
    )
  }, [t])

  return (
    <div className="p-4 sm:p-6">
      <div className="space-y-4 sm:space-y-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          {t('settings.tabs.general')}
        </h2>

        <ThemeSelector />

        <LanguageSelector />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between py-3 sm:py-4 border-b border-gray-200 dark:border-gray-700 gap-2 sm:gap-0">
          <div>
            <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {t('settings.general.backupData')}
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
              {t('settings.general.backupDesc')}
            </p>
          </div>
          <Button
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white"
            onClick={handleBackup}
          >
            {t('settings.general.export')}
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between py-3 sm:py-4 border-b border-gray-200 dark:border-gray-700 gap-2 sm:gap-0">
          <div>
            <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {t('settings.general.importData')}
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
              {t('settings.general.importDesc')}
            </p>
          </div>
          <Button
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white"
            onClick={() =>
              toast.info(
                t('settings.general.comingSoon', {
                  defaultValue: 'Coming soon',
                }),
              )
            }
          >
            {t('settings.general.import')}
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between py-3 sm:py-4 gap-2 sm:gap-0">
          <div>
            <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {t('settings.general.resetAccount')}
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
              {t('settings.general.resetDesc')}
            </p>
          </div>
          <Popover
            open={isResetPopoverOpen}
            onOpenChange={setIsResetPopoverOpen}
          >
            <PopoverTrigger asChild>
              <Button variant="destructive" className="w-full sm:w-auto">
                {t('settings.general.reset')}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[90vw] sm:w-80">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                    <Info className="size-3 sm:size-4 text-red-600 dark:text-red-400" />
                  </div>
                  <h4 className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-gray-100">
                    {t('settings.general.resetAccount')}
                  </h4>
                </div>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  {t('settings.general.resetWarning')}
                </p>
                <div className="flex justify-end gap-2 sm:gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setIsResetPopoverOpen(false)}
                  >
                    {t('settings.cancel')}
                  </Button>
                  <Button variant="destructive" onClick={handleReset}>
                    {t('settings.general.reset')}
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  )
}
