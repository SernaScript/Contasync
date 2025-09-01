"use client"

import { useState, useCallback } from 'react'

export interface UseLoadingOptions {
  initialLoading?: boolean
  loadingText?: string
  onLoadingStart?: () => void
  onLoadingComplete?: () => void
}

export interface UseLoadingReturn {
  isLoading: boolean
  loadingText: string
  startLoading: (text?: string) => void
  stopLoading: () => void
  setLoadingText: (text: string) => void
  withLoading: <T>(asyncFn: () => Promise<T>, loadingText?: string) => Promise<T>
}

export function useLoading(options: UseLoadingOptions = {}): UseLoadingReturn {
  const {
    initialLoading = false,
    loadingText: initialLoadingText = 'Cargando...',
    onLoadingStart,
    onLoadingComplete
  } = options

  const [isLoading, setIsLoading] = useState(initialLoading)
  const [loadingText, setLoadingTextState] = useState(initialLoadingText)

  const startLoading = useCallback((text?: string) => {
    if (text) {
      setLoadingTextState(text)
    }
    setIsLoading(true)
    onLoadingStart?.()
  }, [onLoadingStart])

  const stopLoading = useCallback(() => {
    setIsLoading(false)
    onLoadingComplete?.()
  }, [onLoadingComplete])

  const setLoadingText = useCallback((text: string) => {
    setLoadingTextState(text)
  }, [])

  const withLoading = useCallback(async <T>(
    asyncFn: () => Promise<T>,
    loadingText?: string
  ): Promise<T> => {
    try {
      startLoading(loadingText)
      const result = await asyncFn()
      return result
    } finally {
      stopLoading()
    }
  }, [startLoading, stopLoading])

  return {
    isLoading,
    loadingText,
    startLoading,
    stopLoading,
    setLoadingText,
    withLoading
  }
}

// Hook especializado para operaciones de API
export function useApiLoading(options: UseLoadingOptions = {}) {
  const loading = useLoading(options)

  const apiCall = useCallback(async <T>(
    apiFunction: () => Promise<T>,
    loadingText?: string
  ): Promise<T> => {
    try {
      loading.startLoading(loadingText || 'Procesando solicitud...')
      const result = await apiFunction()
      return result
    } catch (error) {
      // Mantener el estado de carga por un momento para mostrar el error
      setTimeout(() => {
        loading.stopLoading()
      }, 1000)
      throw error
    }
  }, [loading])

  return {
    ...loading,
    apiCall
  }
}

// Hook para múltiples operaciones simultáneas
export function useMultipleLoading(operationKeys: string[]) {
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>(
    operationKeys.reduce((acc, key) => ({ ...acc, [key]: false }), {})
  )

  const startOperation = useCallback((key: string) => {
    setLoadingStates(prev => ({ ...prev, [key]: true }))
  }, [])

  const stopOperation = useCallback((key: string) => {
    setLoadingStates(prev => ({ ...prev, [key]: false }))
  }, [])

  const isAnyLoading = Object.values(loadingStates).some(Boolean)
  const isLoading = (key: string) => loadingStates[key] || false

  return {
    loadingStates,
    startOperation,
    stopOperation,
    isAnyLoading,
    isLoading
  }
}
