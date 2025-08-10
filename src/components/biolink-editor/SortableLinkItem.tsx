import { memo } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, Eye, Trash2 } from "lucide-react"
import { Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getIconById } from './IconLibrary'

export interface LinkData {
  id: string
  title: string
  subtitle?: string
  url: string
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

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="glass-card border border-white/20 rounded-xl p-4 group hover:border-neon-blue/50 transition-all"
    >
      <div className="flex items-center gap-3">
        {/* Drag Handle */}
        <button
          {...attributes}
          {...listeners}
          className="text-white/40 hover:text-white/80 cursor-grab active:cursor-grabbing p-1"
        >
          <GripVertical className="w-4 h-4" />
        </button>

        {/* Icon */}
        <div className={`p-2 rounded-lg bg-gradient-to-r ${iconData?.color || 'from-gray-500 to-gray-700'}`}>
          <IconComponent className="w-4 h-4 text-white" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h4 className="text-white font-medium text-sm truncate">{link.title}</h4>
          <p className="text-white/60 text-xs truncate">{link.subtitle}</p>
          <p className="text-white/40 text-xs truncate">{link.url}</p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            onClick={() => onEdit(link)}
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-white/60 hover:text-white hover:bg-white/10"
          >
            <Eye className="w-4 h-4" />
          </Button>
          <Button
            onClick={() => onDelete(link.id)}
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-500/10"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
})

export { SortableLinkItem }