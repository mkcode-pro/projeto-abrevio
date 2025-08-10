import { Home, BarChart3, Link, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useNavigate, useLocation } from "react-router-dom"
import { cn } from "@/lib/utils"
import { CentralMenuModal } from "./CentralMenuModal"
import { useState } from "react"

interface MobileBottomNavProps {
  className?: string
}

export function MobileBottomNav({ className }: MobileBottomNavProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  
  const leftNavItems = [
    { 
      icon: Home, 
      label: "Dashboard", 
      path: "/dashboard",
      isActive: location.pathname === "/dashboard"
    },
    { 
      icon: BarChart3,
      label: "Analytics",
      path: "/dashboard/analytics",
      isActive: location.pathname === "/dashboard/analytics"
    }
  ]

  const rightNavItems = [
    { 
      icon: Link, 
      label: "Links", 
      path: "/dashboard/editor",
      isActive: location.pathname.includes("/dashboard/editor")
    },
    { 
      icon: Settings, 
      label: "Config", 
      path: "/dashboard/settings",
      isActive: location.pathname === "/dashboard/settings"
    }
  ]

  return (
    <nav
      role="navigation"
      aria-label="Navegação inferior"
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50 md:hidden",
        "glass backdrop-blur-xl border-t border-white/10 bg-background/90",
        "px-4 py-2 pb-safe-bottom",
        className
      )}>
      <div className="grid grid-cols-5 items-end max-w-md mx-auto relative gap-1">
        {/* Left Navigation Items */}
        <div className="col-span-2 flex items-center justify-start gap-1">
          {leftNavItems.map((item) => {
            const Icon = item.icon
            return (
              <Button
                key={item.path}
                variant="ghost"
                size="sm"
                onClick={() => navigate(item.path)}
                aria-current={item.isActive ? "page" : undefined}
                className={cn(
                  "flex flex-col items-center gap-1 px-2 py-2 h-auto flex-1 min-w-0",
                  "text-foreground/60 hover:text-primary transition-all duration-200",
                  "hover:bg-white/5 rounded-xl",
                  item.isActive && "text-primary bg-white/10"
                )}
              >
                <Icon className={cn(
                  "h-5 w-5 transition-all duration-200",
                  item.isActive && "scale-110"
                )} />
                <span className="text-xs font-medium leading-none truncate">
                  {item.label}
                </span>
                {item.isActive && (
                  <div className="w-1 h-1 rounded-full bg-primary mt-0.5 animate-pulse" />
                )}
              </Button>
            )
          })}
        </div>

        {/* Center spacer to reserve space for the floating action button */}
        <div className="col-span-1" aria-hidden />

        {/* Central Action Button */}
        <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-4">
          <CentralMenuModal open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <Button
              className={cn(
                "w-14 h-14 rounded-2xl shadow-2xl",
                "bg-gradient-primary hover:shadow-elegant",
                "btn-futuristic border-2 border-white/20",
                "transform hover:scale-105 active:scale-95 transition-all duration-200"
              )}
            >
              <div className="w-7 h-7 rounded-lg bg-white/90 flex items-center justify-center">
                <div className="w-4 h-4 rounded-sm bg-gradient-primary" />
              </div>
            </Button>
          </CentralMenuModal>
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-neon-blue rounded-full animate-pulse" />
        </div>

        {/* Right Navigation Items */}
        <div className="col-span-2 flex items-center justify-end gap-1">
          {rightNavItems.map((item) => {
            const Icon = item.icon
            return (
              <Button
                key={item.path}
                variant="ghost"
                size="sm"
                onClick={() => navigate(item.path)}
                aria-current={item.isActive ? "page" : undefined}
                className={cn(
                  "flex flex-col items-center gap-1 px-2 py-2 h-auto flex-1 min-w-0",
                  "text-foreground/60 hover:text-primary transition-all duration-200",
                  "hover:bg-white/5 rounded-xl",
                  item.isActive && "text-primary bg-white/10"
                )}
              >
                <Icon className={cn(
                  "h-5 w-5 transition-all duration-200",
                  item.isActive && "scale-110"
                )} />
                <span className="text-xs font-medium leading-none truncate">
                  {item.label}
                </span>
                {item.isActive && (
                  <div className="w-1 h-1 rounded-full bg-primary mt-0.5 animate-pulse" />
                )}
              </Button>
            )
          })}
        </div>
      </div>
    </nav>
  )
}