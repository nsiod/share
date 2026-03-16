import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Label, RadioGroup, RadioGroupItem } from '@/components/ui'

const getTheme = () => {
  if (typeof window === 'undefined') return 'system'
  return localStorage.getItem('theme') || 'system'
}

const applyTheme = (theme: string) => {
  localStorage.setItem('theme', theme)
  if (
    theme === 'dark' ||
    (theme === 'system' &&
      window.matchMedia('(prefers-color-scheme: dark)').matches)
  ) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}

export function ThemeSelector() {
  const { t } = useTranslation()
  const [theme, setTheme] = useState(getTheme)

  const handleThemeChange = useCallback((value: string) => {
    setTheme(value)
    applyTheme(value)
  }, [])

  return (
    <div className="flex flex-row items-center justify-between px-4 py-3 sm:py-4">
      <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
        {t('settings.general.theme')}
      </h3>
      <RadioGroup
        value={theme}
        onValueChange={handleThemeChange}
        className="flex flex-row gap-4 w-auto"
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
