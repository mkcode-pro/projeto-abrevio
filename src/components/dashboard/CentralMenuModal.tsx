import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Link2, FileText, BarChart3 } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { cn } from "@/lib/utils"

interface CentralMenuModalProps {
  children: React.ReactNode
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CentralMenuModal({ children, open, onOpenChange }: CentralMenuModalProps) {
  const navigate = useNavigate()

  const menuItems = [
    {
      icon: FileText,
      title: "Criar Bio Link",
      description: "Crie uma nova página de biolink",
      path: "/dashboard/editor",
      gradient: "from-blue-500 to-purple-600"
    },
    {
      icon: Link2,
      title: "Encurtar URL",
      description: "Encurte e gerencie seus links",
      path: "/dashboard/links",
      gradient: "from-green-500 to-teal-600"
    },
    {
      icon: BarChart3,
      title: "Ver Analytics",
      description: "Acompanhe suas estatísticas",
      path: "/analytics",
      gradient: "from-orange-500 to-red-600"
    }
  ]

  const handleItemClick = (path: string) => {
    navigate(path)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className={cn(
        "sm:max-w-md w-[90vw] max-h-[80vh] overflow-hidden",
        "glass border-white/20 bg-background/95 backdrop-blur-xl",
        "rounded-3xl p-0"
      )}>
        <div className="relative">
          {/* Header */}
          <div className="flex items-center justify-between p-6 pb-4">
            <div>
              <h2 className="text-xl font-bold text-foreground">Menu Rápido</h2>
              <p className="text-sm text-foreground/60">Escolha uma ação</p>
            </div>
          </div>

          {/* Menu Items */}
          <div className="px-6 pb-6 space-y-3">
            {menuItems.map((item) => {
              const Icon = item.icon
              return (
                <Button
                  key={item.path}
                  variant="ghost"
                  onClick={() => handleItemClick(item.path)}
                  className={cn(
                    "w-full h-auto p-4 justify-start",
                    "glass hover:bg-white/10 border border-white/10",
                    "rounded-2xl group transition-all duration-300",
                    "hover:scale-[1.02] hover:shadow-lg"
                  )}
                >
                  <div className="flex items-center gap-4 w-full">
                    <div className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center",
                      "bg-gradient-to-r", item.gradient,
                      "group-hover:scale-110 transition-transform duration-300"
                    )}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1 text-left">
                      <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-sm text-foreground/60">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </Button>
              )
            })}
          </div>

          {/* Background Decoration */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary/20 to-transparent rounded-full blur-3xl -z-10" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-secondary/20 to-transparent rounded-full blur-2xl -z-10" />
        </div>
      </DialogContent>
    </Dialog>
  )
}