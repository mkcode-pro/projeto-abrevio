import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { cn } from "@/lib/utils"

interface MobileHeaderProps {
  title: string
  showBackButton?: boolean
  className?: string
  actions?: React.ReactNode
}

export function MobileHeader({ 
  title, 
  showBackButton = false, 
  className,
  actions 
}: MobileHeaderProps) {
  const navigate = useNavigate()

  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 z-50 md:hidden",
      "glass backdrop-blur-xl border-b border-white/10 bg-background/90",
      "h-14 flex items-center px-4",
      "pt-safe-top", // Adiciona padding para safe area (notches)
      className
    )}>
      <div className="flex items-center justify-between w-full">
        {/* Left side */}
        <div className="flex items-center gap-2">
          {showBackButton && (
            <Button
              variant="ghost"
              size="icon"
              className="w-8 h-8 -ml-2"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          )}
          <h1 className="text-lg font-bold text-foreground truncate">{title}</h1>
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-2">
          {actions}
        </div>
      </div>
    </header>
  )
}