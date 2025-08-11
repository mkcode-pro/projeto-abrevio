import { forwardRef } from 'react'
import { Button, ButtonProps } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useMobileOptimized } from '@/store/hooks/useMobileOptimized'

export interface MobileOptimizedButtonProps extends ButtonProps {
  touchOptimized?: boolean
}

const MobileOptimizedButton = forwardRef<
  HTMLButtonElement,
  MobileOptimizedButtonProps
>(({ className, touchOptimized = true, size, ...props }, ref) => {
  const { isMobile, getTouchTargetSize } = useMobileOptimized()

  // Auto-ajustar tamanho para mobile se touchOptimized estiver ativo
  const mobileSize = isMobile && touchOptimized ? 'lg' : size

  return (
    <Button
      className={cn(
        // Touch targets maiores em mobile
        isMobile && touchOptimized && "min-h-[44px] min-w-[44px]",
        // Espaçamento otimizado para toque
        isMobile && "active:scale-95 transition-transform",
        className
      )}
      size={mobileSize}
      ref={ref}
      {...props}
    />
  )
})

MobileOptimizedButton.displayName = "MobileOptimizedButton"

export { MobileOptimizedButton }