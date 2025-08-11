import { useState, useMemo } from "react"
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
  const [selectedIcon, setSelectedIcon] = useState<IconData>(iconLibrary.find(i => i.type === 'link')!)
  
  // Estado para formulário de link padrão
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')

  // Estado para formulário PIX
  const [pixTitle, setPixTitle] = useState('')
  const [pixKey, setPixKey] = useState('')
  const [pixName, setPixName] = useState('')
  const [pixAmount, setPixAmount] = useState('')
  const [pixCity, setPixCity] = useState('')

  const selectedType = useMemo(() => selectedIcon.type, [selectedIcon])

  const resetForms = () => {
    setTitle('')
    setUrl('')
    setPixTitle('')
    setPixKey('')
    setPixName('')
    setPixAmount('')
    setPixCity('')
    setSelectedIcon(iconLibrary.find(i => i.type === 'link')!)
  }

  const handleAdd = () => {
    let newLink: Omit<LinkData, 'id'>;

    if (selectedType === 'pix') {
      if (!pixKey) {
        toast.error("Chave PIX é obrigatória")
        return
      }
      newLink = {
        title: pixTitle || 'PIX', // Usa o título do usuário ou um padrão simples
        url: JSON.stringify({
          key: pixKey,
          name: pixName,
          amount: parseFloat(pixAmount) || undefined,
          city: pixCity
        }),
        iconId: selectedIcon.id
      }
    } else {
      if (!title || !url) {
        toast.error("Título e URL são obrigatórios")
        return
      }
      newLink = {
        title,
        url,
        iconId: selectedIcon.id
      }
    }

    onAdd(newLink)
    resetForms()
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
            <Label className="text-white text-sm mb-2 block">Tipo de Link</Label>
            <div className="grid grid-cols-4 gap-2 max-h-32 overflow-y-auto">
              {iconLibrary.map((icon) => {
                const IconComponent = icon.icon
                return (
                  <button
                    key={icon.id}
                    onClick={() => setSelectedIcon(icon)}
                    className={`p-3 rounded-lg transition-all ${selectedIcon.id === icon.id ? 'bg-neon-blue/20 border-2 border-neon-blue' : 'bg-white/5 border border-white/20 hover:bg-white/10'}`}
                  >
                    <IconComponent className="w-5 h-5 text-white mx-auto" />
                    <span className="text-xs text-white/80 mt-1 block">{icon.name}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Formulário Dinâmico */}
          {selectedType === 'link' && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <Label htmlFor="title" className="text-white text-sm">Título *</Label>
                <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ex: Instagram" className="bg-white/5 border-white/20 text-white placeholder:text-white/40" />
              </div>
              <div>
                <Label htmlFor="url" className="text-white text-sm">URL *</Label>
                <Input id="url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://..." className="bg-white/5 border-white/20 text-white placeholder:text-white/40" />
              </div>
            </div>
          )}

          {selectedType === 'pix' && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <Label htmlFor="pixTitle" className="text-white text-sm">Título do Botão</Label>
                <Input id="pixTitle" value={pixTitle} onChange={(e) => setPixTitle(e.target.value)} placeholder="Ex: Me pague um café" className="bg-white/5 border-white/20 text-white placeholder:text-white/40" />
              </div>
              <div>
                <Label htmlFor="pixKey" className="text-white text-sm">Chave PIX *</Label>
                <Input id="pixKey" value={pixKey} onChange={(e) => setPixKey(e.target.value)} placeholder="Email, CPF/CNPJ, Telefone ou Aleatória" className="bg-white/5 border-white/20 text-white placeholder:text-white/40" />
              </div>
              <div>
                <Label htmlFor="pixName" className="text-white text-sm">Nome do Favorecido</Label>
                <Input id="pixName" value={pixName} onChange={(e) => setPixName(e.target.value)} placeholder="Seu nome ou da sua empresa" className="bg-white/5 border-white/20 text-white placeholder:text-white/40" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="pixAmount" className="text-white text-sm">Valor (opcional)</Label>
                  <Input id="pixAmount" type="number" value={pixAmount} onChange={(e) => setPixAmount(e.target.value)} placeholder="0.00" className="bg-white/5 border-white/20 text-white placeholder:text-white/40" />
                </div>
                <div>
                  <Label htmlFor="pixCity" className="text-white text-sm">Cidade</Label>
                  <Input id="pixCity" value={pixCity} onChange={(e) => setPixCity(e.target.value)} placeholder="SAO PAULO" className="bg-white/5 border-white/20 text-white placeholder:text-white/40" />
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-2 pt-4">
            <Button onClick={() => setOpen(false)} variant="ghost" className="flex-1 text-white hover:bg-white/10">Cancelar</Button>
            <Button onClick={handleAdd} variant="gradient" className="flex-1 btn-futuristic">Adicionar</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}