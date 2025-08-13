import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export type ContainerSize = 'sm' | 'md' | 'lg' | 'xl' | 'full'

interface PageContainerProps {
  children: ReactNode
  size?: ContainerSize
  className?: string
}

export function PageContainer({ 
  children, 
  size = 'lg',
  className,
}: PageContainerProps) {
  const sizeClasses = {
    sm: 'max-w-2xl',
    md: 'max-w-4xl', 
    lg: 'max-w-6xl',
    xl: 'max-w-7xl',
    full: 'max-w-full'
  }

  return (
    <div className={cn(
      'mx-auto w-full px-4 sm:px-6 lg:px-8',
      sizeClasses[size],
      className
    )}>
      {children}
    </div>
  )
}