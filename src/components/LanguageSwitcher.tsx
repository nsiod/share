import { useTranslation } from 'react-i18next'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui'

const LANGUAGES = [
  { value: 'en', label: 'English' },
  { value: 'zh', label: '中文' },
] as const

export function LanguageSwitcher() {
  const { i18n } = useTranslation()

  const handleChange = (value: string | null) => {
    if (!value) return
    i18n.changeLanguage(value)
    localStorage.setItem('lang', value)
  }

  return (
    <Select value={i18n.language} onValueChange={handleChange}>
      <SelectTrigger
        size="sm"
        className="w-auto gap-1 border-none shadow-none cursor-pointer"
        aria-label="Switch language"
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {LANGUAGES.map((lang) => (
          <SelectItem key={lang.value} value={lang.value}>
            {lang.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
