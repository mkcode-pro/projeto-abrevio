import { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useIsMobile } from '@/hooks/use-mobile'

interface MobileCardProps {
  children: ReactNode
  title?: string
  subtitle?: string
  icon?: ReactNode
  className?: string
  variant?: 'default' | 'compact' | 'action'
  onClick?: () => void
}

export function MobileCard({ 
  children, 
  title, 
  subtitle, 
  icon, 
  className,
  variant = 'default',
  onClick
}: MobileCardProps) {
  const isMobile = useIsMobile()

  const variantClasses = {
    default: 'glass-card border-white/20',
    compact: 'glass-card border-white/20 p-3',
    action: 'glass-card border-white/20 hover:bg-white/10 transition-colors cursor-pointer'
  }

  if (variant === 'compact') {
    return (
      <div 
        className={cn(
          variantClasses[variant],
          onClick && 'cursor-pointer hover:bg-white/10 transition-colors',
          className
        )}
        onClick={onClick}
      >
        <div className="flex items-center gap-3">
          {icon && <div className="text-neon-blue">{icon}</div>}
          <div className="flex-1">
            {title && (
              <h3 className={cn(
                "font-medium text-white",
                isMobile ? "text-sm" : "text-base"
              )}>
                {title}
              </h3>
            )}
            {subtitle && (
              <p className={cn(
                "text-white/60",
                isMobile ? "text-xs" : "text-sm"
              )}>
                {subtitle}
              </p>
            )}
          </div>
        </div>
        {children}
      </div>
    )
  }

  return (
    <Card 
      className={cn(variantClasses[variant], className)}
      onClick={onClick}
    >
      {(title || subtitle || icon) && (
        <CardHeader className={cn(isMobile ? 'p-4 pb-2' : 'p-6 pb-4')}>
          <div className="flex items-center gap-3">
            {icon && <div className="text-neon-blue">{icon}</div>}
            <div>
              {title && (
                <CardTitle className={cn(
                  "text-white",
                  isMobile ? "text-lg" : "text-xl"
                )}>
                  {title}
                </CardTitle>
              )}
              {subtitle && (
                <p className={cn(
                  "text-white/60 mt-1",
                  isMobile ? "text-sm" : "text-base"
                )}>
                  {subtitle}
                </p>
              )}
            </div>
          </div>
        </CardHeader>
      )}
      
      <CardContent className={cn(isMobile ? 'p-4 pt-2' : 'p-6 pt-4')}>
        {children}
      </CardContent>
    </Card>
  )
}