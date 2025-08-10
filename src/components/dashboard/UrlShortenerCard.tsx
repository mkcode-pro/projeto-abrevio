import { useState } from "react"
import { Copy, Link, Trash2, ExternalLink } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useUrlShortener } from "@/hooks/useUrlShortener"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"

export function UrlShortenerCard() {
  const [originalUrl, setOriginalUrl] = useState("")
  const [customCode, setCustomCode] = useState("")
  const [title, setTitle] = useState("")
  const { urls, shortenUrl, isCreating, deleteUrl, isLoadingUrls } = useUrlShortener()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!originalUrl) {
      toast.error("URL obrigatória", { description: "Digite uma URL para encurtar" })
      return
    }

    try {
      new URL(originalUrl)
    } catch {
      toast.error("URL inválida", { description: "Digite uma URL válida (ex: https://exemplo.com)" })
      return
    }

    shortenUrl({
      original_url: originalUrl,
      short_code: customCode || undefined,
      title: title || undefined,
    })
    
    setOriginalUrl("")
    setCustomCode("")
    setTitle("")
  }

  const copyToClipboard = (shortCode: string) => {
    const url = `${window.location.origin}/r/${shortCode}`
    navigator.clipboard.writeText(url)
    toast.success("Link copiado!", { 
      description: "O link encurtado foi copiado para a área de transferência." 
    })
  }

  const openOriginalUrl = (url: string) => {
    window.open(url, '_blank')
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
              <span className="text-white/60 text-sm">abrev.io/r/</span>
              <Input
                id="custom"
                value={customCode}
                onChange={(e) => setCustomCode(e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, ''))}
                placeholder="meu-link"
                className="bg-white/5 border-white/20 text-white placeholder:text-white/40"
                maxLength={20}
              />
            </div>
            <p className="text-xs text-white/50">Apenas letras, números, hífen e underscore</p>
          </div>

          <Button 
            type="submit" 
            disabled={isCreating}
            className="w-full bg-gradient-neon hover:opacity-90 text-black font-semibold"
          >
            {isCreating ? "Encurtando..." : "Encurtar URL"}
          </Button>
        </form>

        <div className="space-y-3">
          <h4 className="text-white font-semibold text-sm">Links Recentes</h4>
          {isLoadingUrls ? (
            <div className="space-y-2">
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>
          ) : urls.length > 0 ? (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {urls.slice(0, 5).map((url) => (
                <div key={url.id} className="glass border border-white/10 rounded-lg p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      {url.title && (
                        <p className="text-white text-sm font-medium truncate">{url.title}</p>
                      )}
                      <p className="text-neon-blue text-sm font-mono">abrev.io/r/{url.short_code}</p>
                      <p className="text-white/60 text-xs truncate">{url.original_url}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className="text-xs">
                          {url.click_count || 0} cliques
                        </Badge>
                        <Badge 
                          variant={url.is_active ? "default" : "destructive"} 
                          className="text-xs"
                        >
                          {url.is_active ? "Ativo" : "Inativo"}
                        </Badge>
                        <span className="text-xs text-white/50">
                          {new Date(url.created_at).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-white/60 hover:text-white"
                        onClick={() => copyToClipboard(url.short_code)}
                        title="Copiar link"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-white/60 hover:text-white"
                        onClick={() => openOriginalUrl(url.original_url)}
                        title="Abrir URL original"
                      >
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-400 hover:text-red-300"
                        onClick={() => deleteUrl(url.id)}
                        title="Excluir"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-white/60 text-center py-4">Nenhum link encurtado ainda.</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}