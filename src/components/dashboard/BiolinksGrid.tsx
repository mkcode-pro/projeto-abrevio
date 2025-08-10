import { Link, ExternalLink, MousePointer, Instagram, MessageCircle, Youtube, Globe, Edit } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"

const biolinks = [
  { 
    id: 1,
    name: "Instagram",
    url: "instagram.com/joaosilva",
    clicks: 587,
    icon: Instagram,
    color: "bg-gradient-to-r from-purple-500 to-pink-500"
  },
  { 
    id: 2,
    name: "WhatsApp",
    url: "(11) 99999-9999",
    clicks: 1234,
    icon: MessageCircle,
    color: "bg-gradient-to-r from-green-500 to-emerald-500"
  },
  { 
    id: 3,
    name: "YouTube",
    url: "youtube.com/joaosilva",
    clicks: 298,
    icon: Youtube,
    color: "bg-gradient-to-r from-red-500 to-red-600"
  },
  { 
    id: 4,
    name: "Site Pessoal",
    url: "joaosilva.com",
    clicks: 156,
    icon: Globe,
    color: "bg-gradient-to-r from-blue-500 to-indigo-500"
  },
]

export function BiolinksGrid() {
  const navigate = useNavigate()

  const handleOpenLink = (url: string) => {
    window.open(`https://${url}`, '_blank')
  }

  return (
    <Card className="glass-card border-white/10">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-white flex items-center gap-2">
              <Link className="h-5 w-5 text-neon-blue" />
              Meus Links
            </CardTitle>
            <CardDescription>
              Gerencie todos os seus links em um só lugar
            </CardDescription>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate('/joaosilva')}
            className="border-white/20 text-white hover:bg-white/10"
          >
            Ver Página Bio
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {biolinks.map((link) => (
            <div 
              key={link.id} 
              className="glass border border-white/10 rounded-xl p-4 hover:border-neon-blue/50 transition-all hover-scale cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${link.color}`}>
                  <link.icon className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-white">{link.name}</h4>
                  <p className="text-sm text-muted-foreground truncate">{link.url}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <MousePointer className="h-3 w-3 text-neon-blue" />
                    <span className="text-xs text-neon-blue">{link.clicks.toLocaleString()} cliques</span>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-white/60 hover:text-white"
                    onClick={() => navigate('/dashboard/editor')}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-white/60 hover:text-white"
                    onClick={() => handleOpenLink(link.url)}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}