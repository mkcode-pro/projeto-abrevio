import { useState } from "react"
import { Copy, Link, Trash2, BarChart3, ExternalLink } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useUrlShortener } from "@/hooks/useUrlShortener"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"

export function UrlShortenerCard() {
  const [originalUrl, setOriginalUrl] = useState("")
  const [customCode, setCustomCode] = useState("")
  const [title, setTitle] = useState("")
  const { urls, shortenUrl, deleteUrl, loading } = useUrlShortener()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!originalUrl) {
      toast({
        title: "URL obrigatória",
        description: "Digite uma URL para encurtar",
        variant: "destructive"
      })
      return
    }

    const result = await shortenUrl(originalUrl, customCode, title)
    
    if (result) {
      setOriginalUrl("")
      setCustomCode("")
      setTitle("")
    }
  }

  const copyToClipboard = (shortUrl: string) => {
    navigator.clipboard.writeText(`https://${shortUrl}`)
    toast({
      title: "Link copiado!",
      description: "O link encurtado foi copiado para a área de transferência",
    })
  }

  return (
    <Card className="glass-card border-white/10">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Link className="h-5 w-5 text-neon-blue" />
          Encurtador de URLs
        </CardTitle>
        <CardDescription>
          Crie links curtos e acompanhe o desempenho
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-white text-sm">Título (opcional)</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Título para identificar o link"
              className="bg-white/5 border-white/20 text-white placeholder:text-white/40"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="url" className="text-white text-sm">URL *</Label>
            <Input
              id="url"
              type="url"
              value={originalUrl}
              onChange={(e) => setOriginalUrl(e.target.value)}
              placeholder="https://exemplo.com/meu-link-muito-longo"
              className="bg-white/5 border-white/20 text-white placeholder:text-white/40"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="custom" className="text-white text-sm">Código personalizado (opcional)</Label>
            <div className="flex items-center gap-2">
              <span className="text-white/60 text-sm">abrev.io/</span>
              <Input
                id="custom"
                value={customCode}
                onChange={(e) => setCustomCode(e.target.value)}
                placeholder="meu-link"
                className="bg-white/5 border-white/20 text-white placeholder:text-white/40"
              />
            </div>
          </div>

          <Button 
            type="submit" 
            disabled={loading}
            className="w-full bg-gradient-neon hover:opacity-90 text-black font-semibold"
          >
            {loading ? "Encurtando..." : "Encurtar URL"}
          </Button>
        </form>

        {/* URLs List */}
        {urls.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-white font-semibold text-sm">Links Recentes</h4>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {urls.slice(0, 5).map((url) => (
                <div key={url.id} className="glass border border-white/10 rounded-lg p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      {url.title && (
                        <p className="text-white text-sm font-medium truncate">{url.title}</p>
                      )}
                      <p className="text-neon-blue text-sm font-mono">{url.shortUrl}</p>
                      <p className="text-white/60 text-xs truncate">{url.originalUrl}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className="text-xs">
                          {url.clicks} cliques
                        </Badge>
                        <Badge 
                          variant={url.isActive ? "default" : "destructive"} 
                          className="text-xs"
                        >
                          {url.isActive ? "Ativo" : "Inativo"}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-white/60 hover:text-white"
                        onClick={() => copyToClipboard(url.shortUrl)}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-white/60 hover:text-white"
                        onClick={() => window.open(`https://${url.originalUrl}`, '_blank')}
                      >
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-400 hover:text-red-300"
                        onClick={() => deleteUrl(url.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}