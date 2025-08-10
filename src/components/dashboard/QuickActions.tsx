import { Link, User, Scissors } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { useNavigate } from "react-router-dom"

export function QuickActions() {
  const navigate = useNavigate()

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card 
        className="glass-card border-white/10 hover:border-neon-blue/50 transition-all hover-scale cursor-pointer"
        onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}
      >
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gradient-neon">
              <Scissors className="h-6 w-6 text-black" />
            </div>
            <div>
              <h3 className="font-semibold text-white">Encurtar URL</h3>
              <p className="text-sm text-muted-foreground">Crie um link curto personalizado</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card 
        className="glass-card border-white/10 hover:border-neon-blue/50 transition-all hover-scale cursor-pointer"
        onClick={() => navigate('/dashboard/editor')}
      >
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-r from-violet-500 to-purple-500">
              <User className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-white">Editar Bio Link</h3>
              <p className="text-sm text-muted-foreground">Personalize sua página</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}