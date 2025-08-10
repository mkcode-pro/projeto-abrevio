import { Plus, Bell, Search, User, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { useNavigate } from "react-router-dom"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useIsMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"

interface DashboardHeaderProps {
  userName: string
}

export function DashboardHeader({ userName }: DashboardHeaderProps) {
  const navigate = useNavigate()
  const isMobile = useIsMobile()
  const userInitials = userName.split(' ').map(n => n[0]).join('').toUpperCase()

  return (
    <header className="sticky top-0 z-50 glass backdrop-blur-xl border-b border-white/5 bg-background/80">
      <div className={cn(
        "flex items-center justify-between gap-4",
        isMobile ? "px-4 h-14" : "container mx-auto px-4 h-16"
      )}>
        
        {/* Left Section - Navigation & Welcome */}
        <div className="flex items-center gap-4 min-w-0 flex-1">
          {/* Show sidebar trigger only on desktop */}
          {!isMobile && (
            <SidebarTrigger className="text-foreground/70 hover:text-primary transition-colors p-2 rounded-lg hover:bg-white/5" />
          )}
          
          <div className="hidden md:block min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-foreground leading-none">Dashboard</h1>
              <div className="w-1 h-1 rounded-full bg-foreground/30"></div>
              <span className="text-sm text-foreground/60 font-medium truncate">
                Olá, {userName.split(' ')[0]}!
              </span>
            </div>
          </div>

          {/* Mobile Title */}
          <div className="md:hidden">
            <h1 className="text-lg font-bold text-foreground">Dashboard</h1>
          </div>
        </div>

        {/* Center Section - Search (Desktop only) */}
        {!isMobile && (
          <div className="hidden lg:flex items-center flex-1 max-w-md">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-foreground/40" />
              <Input 
                placeholder="Buscar biolinks, analytics..." 
                className="pl-10 h-9 glass border-white/10 focus:border-primary/50 text-sm bg-white/5"
              />
            </div>
          </div>
        )}

        {/* Right Section - Actions & Profile */}
        <div className="flex items-center gap-2 md:gap-3">
          
          {/* Search Button Mobile */}
          <Button 
            variant="ghost" 
            size="icon"
            className="lg:hidden w-9 h-9 text-foreground/70 hover:text-primary hover:bg-white/5 transition-all"
          >
            <Search className="h-4 w-4" />
          </Button>

          {/* Notifications */}
          <Button 
            variant="ghost" 
            size="icon"
            className="relative w-9 h-9 text-foreground/70 hover:text-primary hover:bg-white/5 transition-all"
          >
            <Bell className="h-4 w-4" />
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-neon-blue rounded-full animate-pulse"></div>
          </Button>

          {/* Create Button - Hidden on mobile (replaced by bottom nav) */}
          {!isMobile && (
            <Button 
              className="bg-gradient-primary hover:shadow-elegant btn-futuristic font-medium text-sm h-9 px-4 flex items-center gap-2"
              onClick={() => navigate('/dashboard/editor')}
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Criar</span>
            </Button>
          )}

          {/* Profile */}
          <div className="flex items-center gap-2 ml-2">
            <Avatar className={cn(
              "ring-2 ring-white/10 hover:ring-primary/30 transition-all cursor-pointer",
              isMobile ? "w-7 h-7" : "w-8 h-8"
            )}>
              <AvatarImage src="" />
              <AvatarFallback className="bg-gradient-primary text-primary-foreground text-xs font-semibold">
                {userInitials}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
    </header>
  )
}