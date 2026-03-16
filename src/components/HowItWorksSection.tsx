'use client'

import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui'
import { cn } from '@/lib/utils'

type TabKey =
  | 'gettingStarted'
  | 'usageScenarios'
  | 'features'
  | 'faq'
  | 'dataSecurity'
  | 'privacy'

interface ContentDef {
  icon: string
  titleKey?: string
  descKey?: string
  questionKey?: string
  answerKey?: string
  subIcon?: string
}

const TAB_KEYS: TabKey[] = [
  'gettingStarted',
  'usageScenarios',
  'features',
  'faq',
  'dataSecurity',
  'privacy',
]

const GRID_TABS: TabKey[] = [
  'gettingStarted',
  'usageScenarios',
  'dataSecurity',
  'privacy',
]

const CONTENT: Record<TabKey, ContentDef[]> = {
  gettingStarted: [
    { icon: '/KeyCreation.svg', titleKey: 'q1', descKey: 'a1' },
    { icon: '/FileEncryption.svg', titleKey: 'q2', descKey: 'a2' },
    { icon: '/FileDecryption.svg', titleKey: 'q3', descKey: 'a3' },
    { icon: '/TextEncryption.svg', titleKey: 'q4', descKey: 'a4' },
  ],
  usageScenarios: [
    { icon: '/SendFiles.svg', titleKey: 'q1', descKey: 'a1' },
    { icon: '/EncryptFiles.svg', titleKey: 'q2', descKey: 'a2' },
    { icon: '/QuickEncrypt.svg', titleKey: 'q3', descKey: 'a3' },
    { icon: '/ArchiveFiles.svg', titleKey: 'q4', descKey: 'a4' },
  ],
  features: [
    { icon: '/EncryptionMethod.svg', titleKey: 'q1', descKey: 'a1' },
    { icon: '/FileTypeSupport.svg', titleKey: 'q2', descKey: 'a2' },
    { icon: '/PublicKeyLink.svg', titleKey: 'q3', descKey: 'a3' },
  ],
  faq: [
    { icon: '/Question.svg', subIcon: '/Answer.svg', questionKey: 'q1', answerKey: 'a1' },
    { icon: '/Question.svg', subIcon: '/Answer.svg', questionKey: 'q2', answerKey: 'a2' },
    { icon: '/Question.svg', subIcon: '/Answer.svg', questionKey: 'q3', answerKey: 'a3' },
    { icon: '/Question.svg', subIcon: '/Answer.svg', questionKey: 'q4', answerKey: 'a4' },
    { icon: '/Question.svg', subIcon: '/Answer.svg', questionKey: 'q5', answerKey: 'a5' },
    { icon: '/Question.svg', subIcon: '/Answer.svg', questionKey: 'q6', answerKey: 'a6' },
  ],
  dataSecurity: [
    { icon: '/LocalProcessing.svg', titleKey: 'q1', descKey: 'a1' },
    { icon: '/EndToEndEncryption.svg', titleKey: 'q2', descKey: 'a2' },
  ],
  privacy: [
    { icon: '/PrivacyTracking.svg', titleKey: 'q1', descKey: 'a1' },
    { icon: '/KeyDeletion.svg', titleKey: 'q2', descKey: 'a2' },
  ],
}

// Map tab keys to i18n content section keys
const CONTENT_SECTION: Record<TabKey, string> = {
  gettingStarted: 'howItWorks.gettingStarted',
  usageScenarios: 'howItWorks.usageScenarios',
  features: 'howItWorks.featuresContent',
  faq: 'howItWorks.faq',
  dataSecurity: 'howItWorks.dataSecurity',
  privacy: 'howItWorks.privacy',
}

export default function HowItWorksSection() {
  const [activeTab, setActiveTab] = useState<TabKey>('gettingStarted')
  const { t } = useTranslation()

  const currentContent = useMemo(() => CONTENT[activeTab], [activeTab])
  const isGridLayout = useMemo(() => GRID_TABS.includes(activeTab), [activeTab])
  const isFAQTab = activeTab === 'faq'
  const section = CONTENT_SECTION[activeTab]

  const renderContent = () => {
    if (isFAQTab) {
      return (
        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 sm:p-6 space-y-4 sm:space-y-6">
          {currentContent.map((item, index) => (
            <div
              key={item.questionKey}
              className="flex flex-col gap-2 bg-gray-100 dark:bg-gray-700 p-3 sm:p-4 rounded-lg transform transition-all duration-500 ease-out hover:scale-105 hover:bg-gray-200 dark:hover:bg-gray-600 animate-in fade-in slide-in-from-bottom-4"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <img src={item.icon} alt="" width={16} height={16} className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-blue-700 dark:text-blue-300">
                  {t(`${section}.${item.questionKey}`)}
                </h3>
              </div>
              <div className="flex items-start space-x-2 sm:space-x-3">
                <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <img src={item.subIcon} alt="" width={16} height={16} className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm leading-relaxed">
                  {t(`${section}.${item.answerKey}`)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )
    }

    const containerClass = isGridLayout
      ? 'grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 bg-[#fff] dark:bg-[#282B30] rounded-xl p-4 sm:p-6'
      : 'bg-gray-50 dark:bg-gray-800 rounded-xl p-4 sm:p-6 space-y-4 sm:space-y-6'

    return (
      <div className={containerClass}>
        {currentContent.map((item, index) => {
          const title = t(`${section}.${item.titleKey}`)
          const desc = t(`${section}.${item.descKey}`)

          if (isGridLayout) {
            return (
              <div
                key={item.titleKey}
                className="flex items-center flex-col bg-[#F6F4F180] dark:bg-[#13141680] rounded-lg p-3 sm:p-4 transform transition-all duration-500 ease-out hover:scale-105 hover:bg-gray-200 dark:hover:bg-gray-600 animate-in slide-in-from-bottom-8 fade-in"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-50 dark:bg-blue-900/50 rounded-lg flex items-center justify-center mb-3 transition-transform duration-300 hover:rotate-12">
                  <img src={item.icon} alt="" width={36} height={36} className="w-9 h-9 sm:w-12 sm:h-12" />
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-blue-700 dark:text-blue-300 mb-2 sm:mb-3 text-center transition-colors duration-300">
                  {title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm leading-relaxed text-center transition-colors duration-300">
                  {desc}
                </p>
              </div>
            )
          }

          return (
            <div
              key={item.titleKey}
              className="flex items-center space-x-3 sm:space-x-4 bg-gray-100 dark:bg-gray-700 p-3 sm:p-4 rounded-lg transform transition-all duration-500 ease-out hover:scale-105 hover:bg-gray-200 dark:hover:bg-gray-600 animate-in slide-in-from-left-8 fade-in"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-50 dark:bg-blue-900/50 rounded-lg flex items-center justify-center transition-transform duration-300 hover:rotate-12">
                <img src={item.icon} alt="" width={36} height={36} className="w-9 h-9 sm:w-12 sm:h-12" />
              </div>
              <div className="flex-1">
                <h3 className="text-base sm:text-lg font-semibold text-blue-700 dark:text-blue-300 mb-1 sm:mb-2 transition-colors duration-300">
                  {title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm leading-relaxed transition-colors duration-300">
                  {desc}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <section className="py-8 sm:py-12 md:py-16 bg-[#f5f3f0] dark:bg-[#0E0F11]">
      <div className="max-w-[100vw] sm:max-w-3xl mx-auto px-4 sm:px-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 dark:text-gray-200 mb-8 sm:mb-12">
          {t('howItWorks.title')}
        </h2>

        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-8 sm:mb-12">
          {TAB_KEYS.map((tab) => (
            <Button
              size="sm"
              key={tab}
              onClick={() => setActiveTab(tab)}
              variant={activeTab === tab ? 'default' : 'outline'}
              className={cn(
                'px-3 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm font-medium transition-colors border-none shadow-none',
                activeTab === tab
                  ? 'bg-blue-700 dark:bg-blue-600 text-white hover:bg-blue-800 dark:hover:bg-blue-700'
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700',
              )}
            >
              {t(`howItWorks.tabs.${tab}`)}
            </Button>
          ))}
        </div>

        {renderContent()}
      </div>
    </section>
  )
}
