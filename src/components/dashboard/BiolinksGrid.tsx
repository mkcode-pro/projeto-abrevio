import { Link, ExternalLink, Edit, Plus } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"
import { useUserBioLinks } from "@/hooks/useUserBioLinks"
import { Skeleton } from "@/components/ui/skeleton"

export function BiolinksGrid() {
  const navigate = useNavigate()
  const { data: biolinks, isLoading } = useUserBioLinks()

  const handleOpenLink = (username: string) => {
    window.open(`/bio/${username}`, '_blank')
  }

  return (
    <Card className="glass-card border-white/10">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-white flex items-center gap-2">
              <Link className="h-5 w-5 text-neon-blue" />
              Minhas Páginas Bio
            </CardTitle>
            <CardDescription>
              Gerencie suas páginas de biolink
            </CardDescription>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate('/dashboard/editor')}
            className="border-white/20 text-white hover:bg-white/10"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nova Página
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        ) : biolinks && biolinks.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {biolinks.map((link) => (
              <div 
                key={link.id} 
                className="glass border border-white/10 rounded-xl p-4 hover:border-neon-blue/50 transition-all hover-scale"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500">
                    <Link className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-white truncate">{link.display_name || link.username}</h4>
                    <p className="text-sm text-muted-foreground truncate">/bio/{link.username}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <span className="text-xs text-neon-blue">{link.link_count} links</span>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-white/60 hover:text-white"
                      onClick={() => navigate('/dashboard/editor')} // TODO: Pass link ID
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-white/60 hover:text-white"
                      onClick={() => handleOpenLink(link.username)}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-white/60">Nenhuma página de biolink criada ainda.</p>
            <p className="text-white/40 text-sm mt-1">Clique em "Nova Página" para começar.</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}