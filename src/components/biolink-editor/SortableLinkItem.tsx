import { memo, useMemo } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, Eye, Trash2, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getIconById } from './IconLibrary'
import { cn } from '@/lib/utils'

export interface LinkData {
  id: string
  title: string
  url: string // Para links normais, é a URL. Para PIX, é um JSON com os dados.
  iconId: string
}

interface SortableLinkItemProps {
  link: LinkData
  onEdit: (link: LinkData) => void
  onDelete: (id: string) => void
}

const SortableLinkItem = memo(function SortableLinkItem({ link, onEdit, onDelete }: SortableLinkItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: link.id })
  const iconData = getIconById(link.iconId)
  const IconComponent = iconData?.icon || Globe

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const displayInfo = useMemo(() => {
    if (iconData?.type === 'pix') {
      try {
        const pixData = JSON.parse(link.url)
        return `Chave: ${pixData.key}`
      } catch (e) {
        return "PIX Inválido"
      }
    }
    return link.url
  }, [link, iconData])

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "glass-card border border-white/20 rounded-xl p-4 group hover:border-neon-blue/50 transition-all",
        isDragging && "shadow-lg shadow-neon-blue/20 ring-2 ring-neon-blue"
      )}
    >
      <div className="flex items-center gap-3">
        <button {...attributes} {...listeners} className="text-white/40 hover:text-white/80 cursor-grab active:cursor-grabbing p-1">
          <GripVertical className="w-4 h-4" />
        </button>
        <div className={`p-2 rounded-lg bg-gradient-to-r ${iconData?.color || 'from-gray-500 to-gray-700'}`}>
          <IconComponent className="w-4 h-4 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-white font-medium text-sm truncate">{link.title}</h4>
          <p className="text-white/40 text-xs truncate">{displayInfo}</p>
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button onClick={() => onEdit(link)} variant="ghost" size="icon" className="h-8 w-8 text-white/60 hover:text-white hover:bg-white/10">
            <Eye className="w-4 h-4" />
          </Button>
          <Button onClick={() => onDelete(link.id)} variant="ghost" size="icon" className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-500/10">
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
})

export { SortableLinkItem }