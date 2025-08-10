import { useState, useEffect } from "react"
import { Save, Eye, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ProfileEditor } from "@/components/biolink-editor/ProfileEditor"
import { LinksManager } from "@/components/biolink-editor/LinksManager"
import { BioLinkPreview, UserData } from "@/components/biolink-editor/BioLinkPreview"
import { LinkData } from "@/components/biolink-editor/SortableLinkItem"
import { ResponsiveContainer } from "@/components/layout/ResponsiveContainer"
import { useIsMobile } from "@/hooks/use-mobile"
import { useBioLink } from "@/hooks/useBioLink"
import { Skeleton } from "@/components/ui/skeleton"

export default function BioLinkEditor() {
  const { bioLinkData, isLoading, isError, updateProfile, updateLinks, isSaving } = useBioLink()
  
  const [editedUserData, setEditedUserData] = useState<UserData | null>(null)
  const [editedLinks, setEditedLinks] = useState<LinkData[]>([])
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  
  const isMobile = useIsMobile()

  useEffect(() => {
    if (bioLinkData) {
      setEditedUserData(bioLinkData.userData)
      setEditedLinks(bioLinkData.links)
      setHasUnsavedChanges(false)
    }
  }, [bioLinkData])

  const handleUserDataUpdate = (updates: Partial<UserData>) => {
    if (!editedUserData) return;
    setEditedUserData(prev => ({ ...prev!, ...updates }))
    setHasUnsavedChanges(true)
  }

  const handleLinksChange = (newLinks: LinkData[]) => {
    setEditedLinks(newLinks)
    setHasUnsavedChanges(true)
  }

  const handleSave = () => {
    if (editedUserData) {
      updateProfile(editedUserData)
    }
    updateLinks(editedLinks)
    setHasUnsavedChanges(false)
  }

  const handlePreview = () => {
    if (editedUserData?.username) {
      window.open(`/bio/${editedUserData.username}`, '_blank')
    }
  }

  // Show loading while data is being fetched or bio_link is being created
  if (isLoading) {
    return <EditorSkeleton isMobile={isMobile} />
  }

  // Show error only if there's a real error (not just missing bio_link)
  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">Ocorreu um erro ao carregar os dados.</p>
          <Button onClick={() => window.location.reload()}>
            Recarregar Página
          </Button>
        </div>
      </div>
    )
  }

  // Show loading if we don't have bioLinkData yet
  if (!bioLinkData) {
    return <EditorSkeleton isMobile={isMobile} />
  }

  const userDataToDisplay = editedUserData || bioLinkData.userData;
  const linksToDisplay = editedLinks;

  return (
    <div className="min-h-screen bg-gradient-hero">
      <ResponsiveContainer size="xl" padding="lg" className="py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Editor de Bio Link</h1>
            <p className="text-white/60">Personalize sua página de links e acompanhe o desempenho</p>
          </div>
          
          <div className="flex gap-3">
            <Button 
              onClick={handlePreview}
              variant="outline" 
              size="lg"
              className="border-white/20 text-white hover:bg-white/10"
            >
              <Eye className="w-5 h-5 mr-2" />
              Visualizar Página
            </Button>
            <Button 
              onClick={handleSave}
              variant="gradient" 
              size="lg"
              disabled={isSaving || !hasUnsavedChanges}
              className="btn-futuristic shadow-lg shadow-neon-blue/25"
            >
              {isSaving ? (
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              ) : (
                <Save className="w-5 h-5 mr-2" />
              )}
              {isSaving ? 'Salvando...' : 'Salvar Alterações'}
            </Button>
          </div>
        </div>

        {/* Layout Principal */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Painel de Edição */}
          <div className="lg:col-span-8 space-y-8">
            <ProfileEditor
              userData={userDataToDisplay}
              onUpdate={handleUserDataUpdate}
            />
            
            <LinksManager
              links={linksToDisplay}
              onLinksChange={handleLinksChange}
            />
          </div>

          {/* Painel de Preview */}
          <div className="lg:col-span-4">
            <div className="sticky top-24">
              <BioLinkPreview userData={userDataToDisplay} links={linksToDisplay} />
            </div>
          </div>
        </div>
      </ResponsiveContainer>
    </div>
  )
}

const EditorSkeleton = ({ isMobile }: { isMobile: boolean }) => (
  <div className="min-h-screen bg-gradient-hero">
    <ResponsiveContainer size="xl" padding="lg" className="py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <Skeleton className="h-9 w-72 mb-2" />
          <Skeleton className="h-5 w-96" />
        </div>
        <div className="flex gap-3">
          <Skeleton className="h-12 w-40" />
          <Skeleton className="h-12 w-40" />
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-96 w-full" />
        </div>
        <div className="lg:col-span-4">
          <Skeleton className="h-[80vh] w-full" />
        </div>
      </div>
    </ResponsiveContainer>
  </div>
)