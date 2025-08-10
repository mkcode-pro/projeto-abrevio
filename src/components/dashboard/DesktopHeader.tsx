import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { ThemeSelector } from '@/components/ui/theme-selector'
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu'
import { 
  User, 
  Settings, 
  LogOut, 
  BarChart3,
  LinkIcon,
  PlusCircle,
  Home
} from 'lucide-react'
import { ConfirmLogoutModal } from '@/components/modals/ConfirmLogoutModal'
import { useAuth } from '@/contexts/AuthContext'
import { Skeleton } from '@/components/ui/skeleton'

const navigationItems = [
  { label: 'Dashboard', href: '/dashboard', icon: Home },
  { label: 'Editor', href: '/dashboard/editor', icon: LinkIcon },
  { label: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
  { label: 'Configurações', href: '/dashboard/settings', icon: Settings }
]

export function DesktopHeader() {
  const navigate = useNavigate()
  const location = useLocation()
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const { user, logout, loading } = useAuth()

  const handleLogout = async () => {
    await logout()
    setShowLogoutModal(false)
    navigate('/')
  }

  const isActive = (path: string) => location.pathname === path

  if (loading) {
    return (
      <header className="fixed top-0 left-0 right-0 z-50 bg-glass backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Skeleton className="h-8 w-32" />
          <div className="flex items-center gap-4">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-8 w-24" />
          </div>
          <div className="flex items-center gap-3">
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
        </div>
      </header>
    )
  }

  if (!user) return null

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-glass backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-neon rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <span className="text-xl font-bold text-white">Abrev.io</span>
          </Link>

          {/* Navegação Principal */}
          <nav className="hidden md:flex items-center gap-1">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive(item.href)
                    ? 'bg-neon-blue/20 text-neon-blue'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Ações do usuário */}
          <div className="flex items-center gap-3">
            {/* Botão de criar novo */}
            <Button 
              variant="outline" 
              size="sm"
              className="border-white/20 text-white hover:bg-white/10"
              onClick={() => navigate('/dashboard/editor')}
            >
              <PlusCircle className="w-4 h-4 mr-2" />
              Criar
            </Button>

            {/* Seletor de tema */}
            <ThemeSelector />

            {/* Menu do usuário */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="w-8 h-8 rounded-full bg-gradient-neon text-white hover:bg-gradient-neon/80"
                >
                  <User className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-glass border-white/10">
                <div className="px-3 py-2">
                  <p className="text-sm font-medium text-white">{user.name}</p>
                  <p className="text-xs text-white/60">@{user.username}</p>
                </div>
                <DropdownMenuSeparator className="bg-white/10" />
                <DropdownMenuItem 
                  onClick={() => navigate('/dashboard/settings')}
                  className="text-white hover:bg-white/10"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Configurações
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => navigate('/dashboard/analytics')}
                  className="text-white hover:bg-white/10"
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Analytics
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-white/10" />
                <DropdownMenuItem 
                  onClick={() => setShowLogoutModal(true)}
                  className="text-red-400 hover:!bg-red-500/10 hover:!text-red-400"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <ConfirmLogoutModal
        open={showLogoutModal}
        onOpenChange={setShowLogoutModal}
        onConfirm={handleLogout}
      />
    </>
  )
}