import { useCallback, useEffect, useState } from 'react'
import { useIsMobile } from '@/store/hooks/use-mobile'

export function useMobileOptimized() {
  const isMobile = useIsMobile()
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait')
  const [viewportHeight, setViewportHeight] = useState(0)

  // Detectar orientação
  useEffect(() => {
    const updateOrientation = () => {
      setOrientation(window.innerHeight > window.innerWidth ? 'portrait' : 'landscape')
      setViewportHeight(window.innerHeight)
    }

    updateOrientation()
    window.addEventListener('resize', updateOrientation)
    window.addEventListener('orientationchange', updateOrientation)

    return () => {
      window.removeEventListener('resize', updateOrientation)
      window.removeEventListener('orientationchange', updateOrientation)
    }
  }, [])

  // Função para calcular altura otimizada (considerar teclado virtual)
  const getOptimizedHeight = useCallback((percentage: number = 100) => {
    if (!isMobile) return `${percentage}vh`
    
    // Em mobile, usar viewport height real para evitar problemas com teclado virtual
    const actualHeight = viewportHeight || window.innerHeight
    return `${(actualHeight * percentage) / 100}px`
  }, [isMobile, viewportHeight])

  // Função para detectar se o dispositivo suporta hover
  const supportsHover = useCallback(() => {
    return window.matchMedia('(hover: hover)').matches
  }, [])

  // Função para calcular tamanhos de touch target otimizados
  const getTouchTargetSize = useCallback((size: 'sm' | 'md' | 'lg' = 'md') => {
    if (!isMobile) {
      return {
        sm: 'h-8 w-8',
        md: 'h-10 w-10', 
        lg: 'h-12 w-12'
      }[size]
    }

    // Touch targets maiores para mobile (mínimo 44px recomendado)
    return {
      sm: 'h-10 w-10',
      md: 'h-12 w-12',
      lg: 'h-14 w-14'
    }[size]
  }, [isMobile])

  return {
    isMobile,
    orientation,
    viewportHeight,
    getOptimizedHeight,
    supportsHover,
    getTouchTargetSize,
    isLandscape: orientation === 'landscape',
    isPortrait: orientation === 'portrait'
  }
}