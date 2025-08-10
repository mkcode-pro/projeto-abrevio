import { ArrowLeft, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ThemeSelector } from '@/components/ui/theme-selector'
import { useNavigate } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { useIsMobile } from '@/hooks/use-mobile'

interface MobileHeaderProps {
  title: string
  subtitle?: string
  showBack?: boolean
  showSettings?: boolean
  className?: string
  actions?: React.ReactNode
}

export function MobileHeader({ 
  title, 
  subtitle, 
  showBack = true, 
  showSettings = false,
  className,
  actions
}: MobileHeaderProps) {
  const navigate = useNavigate()
  const isMobile = useIsMobile()

  if (!isMobile) return null

  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 z-50 bg-glass backdrop-blur-xl border-b border-white/10 px-4 py-3",
      className
    )}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {showBack && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
              className="text-white hover:bg-white/10 p-2"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
          )}
          
          <div>
            <h1 className="text-lg font-semibold text-white">{title}</h1>
            {subtitle && (
              <p className="text-sm text-white/60">{subtitle}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {actions}
          {showSettings && <ThemeSelector />}
        </div>
      </div>
    </header>
  )
}