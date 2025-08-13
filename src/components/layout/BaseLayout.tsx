import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export type LayoutVariant = 'public' | 'dashboard' | 'fullwidth' | 'auth'

interface BaseLayoutProps {
  children: ReactNode
  variant?: LayoutVariant
  className?: string
  noPadding?: boolean
}

export function BaseLayout({ 
  children, 
  variant = 'public',
  className,
  noPadding = false
}: BaseLayoutProps) {
  const baseClasses = 'min-h-screen w-full'
  
  const variantClasses = {
    public: 'bg-gradient-hero',
    dashboard: 'bg-background',
    fullwidth: 'bg-background',
    auth: 'bg-gradient-hero'
  }

  const paddingClasses = {
    public: !noPadding ? 'px-4 py-6 sm:px-6 sm:py-8 lg:px-8' : '',
    dashboard: !noPadding ? 'p-4 sm:p-6 lg:p-8' : '',
    fullwidth: '',
    auth: !noPadding ? 'p-4' : ''
  }

  return (
    <div className={cn(
      baseClasses,
      variantClasses[variant],
      paddingClasses[variant],
      className
    )}>
      {children}
    </div>
  )
}