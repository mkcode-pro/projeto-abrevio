import { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { useIsMobile } from '@/hooks/use-mobile'

interface MobileLayoutProps {
  children: ReactNode
  className?: string
  hasBottomNav?: boolean
  hasTopNav?: boolean
}

export function MobileLayout({ 
  children, 
  className, 
  hasBottomNav = false,
  hasTopNav = false 
}: MobileLayoutProps) {
  const isMobile = useIsMobile()

  return (
    <div className={cn(
      "min-h-screen bg-gradient-hero",
      isMobile && hasTopNav && "pt-16",
      isMobile && hasBottomNav && "pb-20",
      className
    )}>
      {children}
    </div>
  )
}