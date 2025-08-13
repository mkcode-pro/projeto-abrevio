import { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { useIsMobile } from '@/store/hooks/use-mobile'

interface ResponsiveContainerProps {
  children: ReactNode
  className?: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

export function ResponsiveContainer({ 
  children, 
  className,
  size = 'lg',
  padding = 'md'
}: ResponsiveContainerProps) {
  const isMobile = useIsMobile()

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md', 
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
    full: 'max-w-full'
  }

  const paddingClasses = {
    none: '',
    sm: isMobile ? 'px-3 py-2' : 'px-4 py-3',
    md: isMobile ? 'px-4 py-4' : 'px-6 py-6',
    lg: isMobile ? 'px-6 py-6' : 'px-8 py-8'
  }

  return (
    <div className={cn(
      'mx-auto w-full',
      sizeClasses[size],
      paddingClasses[padding],
      className
    )}>
      {children}
    </div>
  )
}