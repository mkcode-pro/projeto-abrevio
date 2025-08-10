import { useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { toast } from "sonner"
import { iconLibrary, IconData } from './IconLibrary'
import { LinkData } from './SortableLinkItem'

interface AddLinkDialogProps {
  onAdd: (link: Omit<LinkData, 'id'>) => void
}

export function AddLinkDialog({ onAdd }: AddLinkDialogProps) {
  const [open, setOpen] = useState(false)
  const [selectedIcon, setSelectedIcon] = useState<IconData>(iconLibrary[0])
  const [title, setTitle] = useState('')
  const [subtitle, setSubtitle] = useState('')
  const [url, setUrl] = useState('')

  const handleAdd = () => {
    if (!title || !url) {
      toast.error("Título e URL são obrigatórios")
      return
    }

    const newLink = {
      title,
      subtitle: subtitle || '',
      url,
      iconId: selectedIcon.id
    }

    onAdd(newLink)
    
    // Reset form
    setTitle('')
    setSubtitle('')
    setUrl('')
    setSelectedIcon(iconLibrary[0])
    setOpen(false)
    
    toast.success("Link adicionado com sucesso!")
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="gradient" className="w-full btn-futuristic">
          <Plus className="w-4 h-4 mr-2" />
          Adicionar Link
        </Button>
      </DialogTrigger>
      <DialogContent className="glass-card border-white/20 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-white">Adicionar Novo Link</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Icon Selection */}
          <div>
            <Label className="text-white text-sm mb-2 block">Ícone</Label>
            <div className="grid grid-cols-4 gap-2 max-h-32 overflow-y-auto">
              {iconLibrary.map((icon) => {
                const IconComponent = icon.icon
                return (
                  <button
                    key={icon.id}
                    onClick={() => setSelectedIcon(icon)}
                    className={`
                      p-3 rounded-lg transition-all
                      ${selectedIcon.id === icon.id 
                        ? 'bg-neon-blue/20 border-2 border-neon-blue' 
                        : 'bg-white/5 border border-white/20 hover:bg-white/10'
                      }
                    `}
                  >
                    <IconComponent className="w-5 h-5 text-white mx-auto" />
                    <span className="text-xs text-white/80 mt-1 block">{icon.name}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Form Fields */}
          <div>
            <Label htmlFor="title" className="text-white text-sm">Título *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Instagram"
              className="bg-white/5 border-white/20 text-white placeholder:text-white/40"
            />
          </div>

          <div>
            <Label htmlFor="subtitle" className="text-white text-sm">Subtítulo</Label>
            <Input
              id="subtitle"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="Ex: Conteúdo diário e stories"
              className="bg-white/5 border-white/20 text-white placeholder:text-white/40"
            />
          </div>

          <div>
            <Label htmlFor="url" className="text-white text-sm">URL *</Label>
            <Input
              id="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://..."
              className="bg-white/5 border-white/20 text-white placeholder:text-white/40"
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button 
              onClick={() => setOpen(false)}
              variant="ghost" 
              className="flex-1 text-white hover:bg-white/10"
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleAdd}
              variant="gradient" 
              className="flex-1 btn-futuristic"
            >
              Adicionar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}