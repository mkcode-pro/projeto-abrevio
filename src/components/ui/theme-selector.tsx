import { Monitor, Moon, Sun, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useTheme } from '@/store/hooks/useTheme'

export function ThemeSelector() {
  const { theme, setTheme } = useTheme()

  const themes = [
    { name: 'light', label: 'Claro', icon: Sun },
    { name: 'dark', label: 'Escuro', icon: Moon },
    { name: 'neon', label: 'Neon', icon: Zap },
  ] as const

  const currentTheme = themes.find(t => t.name === theme)
  const CurrentIcon = currentTheme?.icon || Monitor

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10">
          <CurrentIcon className="h-4 w-4 mr-2" />
          {currentTheme?.label || 'Tema'}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="glass-card border-white/20 bg-black/50 backdrop-blur-xl"
      >
        {themes.map((themeOption) => {
          const Icon = themeOption.icon
          return (
            <DropdownMenuItem
              key={themeOption.name}
              onClick={() => setTheme(themeOption.name)}
              className={`text-white hover:bg-white/10 cursor-pointer ${
                theme === themeOption.name ? 'bg-white/20' : ''
              }`}
            >
              <Icon className="h-4 w-4 mr-2" />
              {themeOption.label}
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}