import { useState } from "react"
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core'
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { SortableLinkItem, LinkData } from './SortableLinkItem'
import { AddLinkDialog } from './AddLinkDialog'
import { EditLinkDialog } from './EditLinkDialog'

interface LinksManagerProps {
  links: LinkData[]
  onLinksChange: (links: LinkData[]) => void
}

export function LinksManager({ links, onLinksChange }: LinksManagerProps) {
  const [editingLink, setEditingLink] = useState<LinkData | null>(null)
  
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (active.id !== over.id) {
      const oldIndex = links.findIndex(item => item.id === active.id)
      const newIndex = links.findIndex(item => item.id === over.id)
      onLinksChange(arrayMove(links, oldIndex, newIndex))
    }
  }

  const handleAddLink = (newLinkData: Omit<LinkData, 'id'>) => {
    const newLink: LinkData = {
      id: Date.now().toString(),
      ...newLinkData
    }
    onLinksChange([...links, newLink])
  }

  const handleEditLink = (link: LinkData) => {
    setEditingLink(link)
  }

  const handleSaveLink = (linkId: string, updates: Omit<LinkData, 'id'>) => {
    onLinksChange(links.map(link => 
      link.id === linkId ? { ...link, ...updates } : link
    ))
  }

  const handleDeleteLink = (linkId: string) => {
    onLinksChange(links.filter(link => link.id !== linkId))
    toast.success("Link removido com sucesso!")
  }

  return (
    <>
    <Card className="glass-card border-white/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white">Links ({links.length})</CardTitle>
          <AddLinkDialog onAdd={handleAddLink} />
        </div>
      </CardHeader>
      <CardContent>
        <DndContext 
          sensors={sensors} 
          collisionDetection={closestCenter} 
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={links.map(l => l.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-3">
              {links.map((link) => (
                <SortableLinkItem
                  key={link.id}
                  link={link}
                  onEdit={handleEditLink}
                  onDelete={handleDeleteLink}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>

        {links.length === 0 && (
          <div className="text-center py-8">
            <p className="text-white/60">Nenhum link adicionado ainda</p>
            <p className="text-white/40 text-sm mt-1">Clique em "Adicionar Link" para começar</p>
          </div>
        )}
      </CardContent>
    </Card>

    <EditLinkDialog
      open={!!editingLink}
      onOpenChange={(open) => !open && setEditingLink(null)}
      link={editingLink}
      onSave={handleSaveLink}
    />
    </>
  )
}