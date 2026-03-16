import { useTranslation } from 'react-i18next'
import { Label, RadioGroup, RadioGroupItem } from '@/components/ui'

const LANGUAGES = [
  { value: 'en', labelKey: 'english' },
  { value: 'zh', labelKey: 'chinese' },
] as const

export function LanguageSelector() {
  const { i18n, t } = useTranslation()

  const handleChange = (value: string) => {
    i18n.changeLanguage(value)
    localStorage.setItem('lang', value)
  }

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-4 py-3 sm:py-4 gap-2 sm:gap-0">
      <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
        {t('settings.general.language')}
      </h3>
      <RadioGroup
        value={i18n.language}
        onValueChange={handleChange}
        className="flex flex-col sm:flex-row gap-3 sm:gap-4"
      >
        {LANGUAGES.map((lang) => (
          <div key={lang.value} className="flex items-center space-x-2">
            <RadioGroupItem
              value={lang.value}
              id={`lang-${lang.value}`}
              className="border-gray-300 dark:border-gray-600 h-4 w-4 sm:h-5 sm:w-5"
            />
            <Label
              htmlFor={`lang-${lang.value}`}
              className="text-xs sm:text-sm"
            >
              {t(`settings.general.${lang.labelKey}`)}
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  )
}
