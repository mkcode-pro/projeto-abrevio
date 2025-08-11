import { ReactNode } from 'react'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useIsMobile } from '@/store/hooks/use-mobile'

interface MobileActionSheetProps {
  children: ReactNode
  title?: string
  isOpen: boolean
  onClose: () => void
  className?: string
}

export function MobileActionSheet({ 
  children, 
  title, 
  isOpen, 
  onClose,
  className 
}: MobileActionSheetProps) {
  const isMobile = useIsMobile()

  if (!isMobile || !isOpen) return null

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/50 z-50 animate-fade-in"
        onClick={onClose}
      />
      
      {/* Action Sheet */}
      <div className={cn(
        "fixed bottom-0 left-0 right-0 z-50 bg-glass backdrop-blur-xl border-t border-white/20 rounded-t-xl animate-slide-up",
        className
      )}>
        {/* Header */}
        {title && (
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <h2 className="text-lg font-semibold text-white">{title}</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-white hover:bg-white/10 p-2"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        )}
        
        {/* Content */}
        <div className="p-4 max-h-96 overflow-y-auto">
          {children}
        </div>
        
        {/* Safe area for devices with notch */}
        <div className="h-4" />
      </div>
    </>
  )
}