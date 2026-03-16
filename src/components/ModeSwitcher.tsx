import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui'

interface ModeSwitcherProps {
  value: string
  onValueChange?: (value: string) => void
}

export default function ModeSwitcher({
  value,
  onValueChange,
}: ModeSwitcherProps) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const handleModeChange = (value: string | null) => {
    if (!value) return
    if (value === 'puk' && pathname !== '/') {
      void navigate('/')
    } else if (value === 'pwd' && pathname !== '/password') {
      void navigate('/password')
    }
    onValueChange?.(value)
  }

  return (
    <div className="space-y-2">
      <Label className="text-sm sm:text-base font-semibold text-gray-700 dark:text-gray-300">
        {t('modeSwitcher.label')}
      </Label>
      <Select value={value} onValueChange={handleModeChange}>
        <SelectTrigger className="w-full h-[40px] text-sm font-medium text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 rounded-md p-2 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none">
          <SelectValue placeholder={t('modeSwitcher.selectMode')} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="puk">{t('modeSwitcher.publicKeyMode')}</SelectItem>
          <SelectItem value="pwd">{t('modeSwitcher.passwordMode')}</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
