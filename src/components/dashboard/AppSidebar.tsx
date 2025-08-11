import { useState } from "react"
import { Home, Plus, BarChart3, Settings, LogOut } from "lucide-react"
import { NavLink, useNavigate } from "react-router-dom"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ConfirmLogoutModal } from "@/components/modals/ConfirmLogoutModal"
import { useAuth } from "@/store/contexts/AuthContext"
import { Skeleton } from "@/components/ui/skeleton"

const sidebarItems = [
  { title: "Meus Links", url: "/dashboard", icon: Home },
  { title: "Editor Bio Link", url: "/dashboard/editor", icon: Plus },
  { title: "Analytics", url: "/dashboard/analytics", icon: BarChart3 },
  { title: "Configurações", url: "/dashboard/settings", icon: Settings },
]

export function AppSidebar() {
  const { open } = useSidebar()
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const { user, logout, loading } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    setShowLogoutModal(false)
    navigate('/')
  }

  if (loading) {
    return (
      <Sidebar className={!open ? "w-14" : "w-64"} collapsible="icon">
        <SidebarContent className="glass-card border-r border-white/10">
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              {open && (
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
              )}
            </div>
          </div>
        </SidebarContent>
      </Sidebar>
    )
  }

  if (!user) return null

  const userInitials = user.name.split(' ').map(n => n[0]).join('').toUpperCase()

  return (
    <>
      <Sidebar className={!open ? "w-14" : "w-64"} collapsible="icon">
        <SidebarContent className="glass-card border-r border-white/10">
          {/* User Profile Section */}
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center gap-3">
              <Avatar className="glass border border-white/20">
                <AvatarFallback className="bg-gradient-neon text-black font-semibold">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
              {open && (
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-white truncate">{user.name}</p>
                  <p className="text-sm text-muted-foreground truncate">@{user.username}</p>
                </div>
              )}
            </div>
          </div>

          <SidebarGroup>
            <SidebarGroupLabel className="text-white/80 font-medium">
              {open && "Navegação"}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {sidebarItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink 
                        to={item.url} 
                        className={({ isActive }) => 
                          `flex items-center gap-3 px-3 py-2 rounded-lg transition-all hover:bg-white/10 ${
                            isActive ? "bg-white/10 text-neon-blue" : "text-white/80"
                          }`
                        }
                      >
                        <item.icon className="h-5 w-5" />
                        {open && <span className="font-medium">{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          {/* Logout */}
          <div className="mt-auto p-4 border-t border-white/10">
            <SidebarMenuButton asChild>
              <button 
                onClick={() => setShowLogoutModal(true)}
                className="flex items-center gap-3 px-3 py-2 rounded-lg transition-all hover:bg-red-500/20 text-red-400 w-full"
              >
                <LogOut className="h-5 w-5" />
                {open && <span className="font-medium">Sair</span>}
              </button>
            </SidebarMenuButton>
          </div>
        </SidebarContent>
      </Sidebar>

      <ConfirmLogoutModal
        open={showLogoutModal}
        onOpenChange={setShowLogoutModal}
        onConfirm={handleLogout}
      />
    </>
  )
}