import { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { useIsMobile } from '@/store/hooks/use-mobile'

interface MobileOptimizedProps {
  children: ReactNode
  className?: string
  mobileClassName?: string
  desktopClassName?: string
}

export function MobileOptimized({ 
  children, 
  className,
  mobileClassName,
  desktopClassName
}: MobileOptimizedProps) {
  const isMobile = useIsMobile()
  
  return (
    <div className={cn(
      className,
      isMobile ? mobileClassName : desktopClassName
    )}>
      {children}
    </div>
  )
}