import { useState, useEffect, useCallback, useRef } from 'react'
import { toast } from 'sonner'

import { secureStorage } from '@/lib/encryption'

export const useSecureLocalStorage = <T,>(key: string, initialValue: T) => {
  const [value, setValue] = useState<T>(initialValue)
  const [isLoaded, setIsLoaded] = useState(false)
  const isInitialized = useRef(false)

  useEffect(() => {
    if (isInitialized.current) return
    isInitialized.current = true

    const loadData = async () => {
      try {
        const storedValue = await secureStorage.getItem(key, initialValue)
        setValue(storedValue)
        setIsLoaded(true)
      } catch (error) {
        console.error(`Failed to load encrypted ${key} from localStorage:`, error)

        try {
          const oldData = localStorage.getItem(key)
          if (oldData) {
            const parsedOldData = JSON.parse(oldData) as T
            await secureStorage.setItem(key, parsedOldData)
            setValue(parsedOldData)
            toast.success('Data migrated to secure storage')
          }
        } catch (migrationError) {
          console.error('Migration from old storage failed:', migrationError)
          toast.error('Failed to load data from storage')
        }

        setIsLoaded(true)
      }
    }

    loadData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const setStoredValue = useCallback(
    (newValue: T | ((prev: T) => T)) => {
      const resolvedValue =
        typeof newValue === 'function'
          ? (newValue as (prev: T) => T)(value)
          : newValue

      setValue(resolvedValue)

      secureStorage.setItem(key, resolvedValue).catch((error) => {
        console.error(`Failed to save encrypted ${key} to localStorage:`, error)
        toast.error('Failed to save data to storage')
      })
    },
    [key, value],
  )

  const removeStoredValue = useCallback(() => {
    setValue(initialValue)
    secureStorage.removeItem(key)
  }, [key, initialValue])

  return [value, setStoredValue, removeStoredValue, isLoaded] as const
}
