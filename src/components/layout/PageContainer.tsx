import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export type ContainerSize = 'sm' | 'md' | 'lg' | 'xl' | 'full'

interface PageContainerProps {
  children: ReactNode
  size?: ContainerSize
  className?: string
  centered?: boolean
}

export function PageContainer({ 
  children, 
  size = 'lg',
  className,
  centered = false
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
      'mx-auto w-full',
      sizeClasses[size],
      centered && 'flex flex-col items-center justify-center min-h-[calc(100vh-4rem)]',
      className
    )}>
      {children}
    </div>
  )
}