import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { CustomOtpInput } from '@/components/OtpInput'
import {
  Button,
  Input,
  Label,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui'
import { validatePasswords } from '@/lib/key'
import { hashPasswordFn, verifyPasswordFn } from '@/lib/password'

import type { TabType } from '@/types'

interface SecurityPasswordTabProps {
  storedPasswordHash: string | null
  setStoredPasswordHash: (hash: string | null) => void
  showChangePassword: boolean
  setShowChangePassword: (value: boolean) => void
  setActiveTab: (tab: TabType) => void
}

export const SecurityPasswordTab = ({
  storedPasswordHash,
  setStoredPasswordHash,
  showChangePassword,
  setShowChangePassword,
  setActiveTab,
}: SecurityPasswordTabProps) => {
  const { t } = useTranslation()
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [currentPasswordError, setCurrentPasswordError] = useState('')
  const [validationError, setValidationError] = useState('')

  const isPasswordSet = Boolean(storedPasswordHash)

  useEffect(() => {
    if (!storedPasswordHash || currentPassword.length !== 6) {
      setCurrentPasswordError('')
      return
    }

    const validatePassword = async () => {
      try {
        const isValid = await verifyPasswordFn(
          storedPasswordHash,
          currentPassword,
        )
        setCurrentPasswordError(
          isValid ? '' : t('settings.password.incorrectPassword'),
        )
        if (!isValid) toast.error(t('settings.password.incorrectPassword'))
      } catch (error) {
        console.error('Password verification failed:', error)
        setCurrentPasswordError(t('settings.password.verifyFailed'))
        toast.error(t('settings.password.verifyFailed'))
      }
    }

    validatePassword()
  }, [currentPassword, storedPasswordHash, t])

  const handleSetOrChangePassword = useCallback(async () => {
    const passwordValidation = validatePasswords(newPassword, confirmPassword)
    if (!passwordValidation.isValid) {
      setValidationError(passwordValidation.error!)
      toast.error(passwordValidation.error!)
      return
    }

    if (isPasswordSet && (!currentPassword || currentPasswordError)) {
      toast.error(t('settings.password.enterValidCurrent'))
      return
    }

    try {
      const hashedPassword = await hashPasswordFn(newPassword)
      setStoredPasswordHash(hashedPassword)
      setShowChangePassword(false)
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setValidationError('')
      setCurrentPasswordError('')
      toast.success(
        isPasswordSet
          ? t('settings.password.updated')
          : t('settings.password.setSuccess'),
      )
    } catch (error) {
      console.error('Failed to save password:', error)
      setValidationError(t('settings.password.saveFailed'))
      toast.error(t('settings.password.saveFailed'))
    }
  }, [
    newPassword,
    confirmPassword,
    isPasswordSet,
    currentPasswordError,
    setStoredPasswordHash,
    setShowChangePassword,
    t,
  ])

  return (
    <div className="p-4 sm:p-6">
      {showChangePassword || !isPasswordSet ? (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {t('settings.tabs.password')}
            </h2>
            {isPasswordSet && (
              <Popover>
                <PopoverTrigger
                  render={
                    <Button
                      variant="ghost"
                      className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-500 cursor-pointer"
                    />
                  }
                >
                  {t('settings.password.forgot')}
                </PopoverTrigger>
                <PopoverContent className="w-[90vw] sm:w-80">
                  <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                    {t('settings.password.forgotDesc')}
                    <span
                      className="px-1 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-500 cursor-pointer"
                      onClick={() => setActiveTab('General')}
                    >
                      {t('settings.password.resetAccount')}
                    </span>
                    {t('settings.password.forgotDescEnd')}
                  </div>
                </PopoverContent>
              </Popover>
            )}
          </div>

          <div className="flex justify-center text-center pt-2 pb-6">
            <div className="w-full pb-4 sm:pb-6 space-y-4">
              {!isPasswordSet && (
                <div className="flex bg-[#E6F0FF] dark:bg-blue-900/20 p-3 rounded-md">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {t('settings.password.notSetAlert')}
                  </p>
                </div>
              )}

              <div className="w-full space-y-4">
                {isPasswordSet && (
                  <div className="space-y-2">
                    <Label
                      htmlFor="current-password-otp-input-0"
                      className="text-sm font-medium text-gray-900 dark:text-gray-100"
                    >
                      {t('settings.password.currentPassword')}
                    </Label>
                    <CustomOtpInput
                      length={6}
                      value={currentPassword}
                      onChange={setCurrentPassword}
                      id="current-password-otp-input"
                      disabled={!isPasswordSet}
                      error={!!currentPasswordError}
                    />
                    {currentPasswordError && (
                      <p className="text-left text-xs sm:text-sm text-red-600 dark:text-red-400">
                        {currentPasswordError}
                      </p>
                    )}
                  </div>
                )}

                <div className="space-y-2">
                  <Label
                    htmlFor="new-password-otp-input-0"
                    className="text-sm font-medium text-gray-900 dark:text-gray-100"
                  >
                    {isPasswordSet
                      ? t('settings.password.newPassword')
                      : t('settings.password.setPassword')}
                  </Label>
                  <CustomOtpInput
                    length={6}
                    value={newPassword}
                    onChange={setNewPassword}
                    id="new-password-otp-input"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="confirm-password-otp-input-0"
                    className="text-sm font-medium text-gray-900 dark:text-gray-100"
                  >
                    {isPasswordSet
                      ? t('settings.password.confirmNew')
                      : t('settings.password.confirmPassword')}
                  </Label>
                  <CustomOtpInput
                    length={6}
                    value={confirmPassword}
                    onChange={setConfirmPassword}
                    id="confirm-password-otp-input"
                    error={
                      !!(
                        newPassword &&
                        confirmPassword &&
                        newPassword !== confirmPassword
                      )
                    }
                  />
                </div>

                {(validationError ||
                  (newPassword &&
                    confirmPassword &&
                    newPassword !== confirmPassword)) && (
                  <p className="text-left text-xs sm:text-sm text-red-600 dark:text-red-400">
                    {validationError || t('settings.password.mismatch')}
                  </p>
                )}

                <div className="flex">
                  <Button
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={handleSetOrChangePassword}
                    disabled={
                      !newPassword ||
                      !confirmPassword ||
                      (isPasswordSet && !currentPassword) ||
                      (isPasswordSet && !!currentPasswordError) ||
                      newPassword !== confirmPassword
                    }
                  >
                    {t('settings.save')}{' '}
                    {!isPasswordSet && t('settings.password.password')}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4 sm:space-y-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            {t('settings.tabs.password')}
          </h2>
          <div className="flex flex-col items-start space-y-4 sm:space-y-6 pb-4 sm:pb-6">
            <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {t('settings.password.yourPassword')}
            </h3>
            <Input type="password" readOnly value="******" />
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => setShowChangePassword(true)}
            >
              {t('settings.password.change')}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
