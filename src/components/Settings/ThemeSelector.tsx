import { useTranslation } from 'react-i18next'
import { Label, RadioGroup, RadioGroupItem } from '@/components/ui'

export function ThemeSelector() {
  const { t } = useTranslation()

  const getTheme = () => {
    if (typeof window === 'undefined') return 'system'
    return localStorage.getItem('theme') || 'system'
  }

  const setTheme = (theme: string) => {
    localStorage.setItem('theme', theme)
    if (theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between py-3 sm:py-4 border-b border-gray-200 dark:border-gray-700 gap-2 sm:gap-0">
      <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
        {t('settings.general.theme')}
      </h3>
      <RadioGroup
        defaultValue={getTheme()}
        onValueChange={setTheme}
        className="flex flex-col sm:flex-row gap-3 sm:gap-4"
      >
        {['system', 'light', 'dark'].map((themeOption) => (
          <div key={themeOption} className="flex items-center space-x-2">
            <RadioGroupItem
              value={themeOption}
              id={`theme-${themeOption}`}
              className="border-gray-300 dark:border-gray-600 h-4 w-4 sm:h-5 sm:w-5"
            />
            <Label
              htmlFor={`theme-${themeOption}`}
              className="text-xs sm:text-sm capitalize"
            >
              {t(`settings.general.${themeOption}`)}
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  )
}
