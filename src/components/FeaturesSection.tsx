import { ChevronDown, Info } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'

export default function FeaturesSection() {
  const [showFeatures, setShowFeatures] = useState(false)
  const { t } = useTranslation()

  const items = [
    { key: 'fileAndText', gradient: 'from-blue-500 to-purple-500' },
    { key: 'ecies', gradient: 'from-purple-500 to-pink-500' },
    { key: 'chunks', gradient: 'from-pink-500 to-red-500' },
    { key: 'autoDownload', gradient: 'from-blue-400 to-emerald-400' },
  ] as const

  return (
    <div className="rounded-xl p-4 border border-gray-100 dark:border-zinc-800 shadow-lg">
      <div
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setShowFeatures(!showFeatures)}
      >
        <div className="flex items-center gap-3">
          <Info className="w-5 h-5 text-blue-500 dark:text-blue-400" />
          <span className="text-base sm:text-lg font-semibold">
            {t('features.title')}
          </span>
        </div>
        <ChevronDown
          className={cn(
            'w-5 h-5 text-gray-600 dark:text-gray-400 transform transition-transform duration-300',
            showFeatures ? 'rotate-180' : '',
          )}
        />
      </div>
      <ul
        className={cn(
          'space-y-4 text-sm sm:text-base transition-all duration-500 ease-in-out overflow-hidden',
          showFeatures ? 'max-h-96 opacity-100 pt-4' : 'max-h-0 opacity-0',
        )}
      >
        {items.map((item) => (
          <li key={item.key} className="flex items-start gap-3">
            <span
              className={cn(
                'w-2.5 h-2.5 mt-1.5 rounded-full bg-gradient-to-br flex-shrink-0 animate-pulse-light',
                item.gradient,
              )}
            />
            <span className="text-gray-700 dark:text-gray-300">
              {t(`features.${item.key}`)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
