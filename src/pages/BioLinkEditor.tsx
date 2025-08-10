import { useState, useEffect } from "react"
import { Save, Eye, Loader2, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ProfileEditor } from "@/components/biolink-editor/ProfileEditor"
import { LinksManager } from "@/components/biolink-editor/LinksManager"
import { BioLinkPreview, UserData } from "@/components/biolink-editor/BioLinkPreview"
import { LinkData } from "@/components/biolink-editor/SortableLinkItem"
import { ResponsiveContainer } from "@/components/layout/ResponsiveContainer"
import { useIsMobile } from "@/hooks/use-mobile"
import { useBioLink } from "@/hooks/useBioLink"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"

export default function BioLinkEditor() {
  const { 
    bioLinkData, 
    isLoading, 
    isError, 
    error,
    updateProfile, 
    updateLinks, 
    isSaving,
    createBioLink,
    needsCreation
  } = useBioLink()
  
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

  // Mostrar loading enquanto carrega
  if (isLoading) {
    return <EditorSkeleton isMobile={isMobile} />
  }

  // Mostrar erro se houver um erro real
  if (isError && !needsCreation) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-hero">
        <Card className="glass-card border-red-500/20 max-w-md">
          <CardContent className="p-6 text-center">
            <div className="text-red-400 mb-4">
              <h3 className="text-lg font-semibold mb-2">Erro ao carregar dados</h3>
              <p className="text-sm">{error?.message || "Ocorreu um erro inesperado"}</p>
            </div>
            <Button onClick={() => window.location.reload()}>
              Recarregar Página
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Mostrar tela de criação se precisar criar bio link
  if (needsCreation) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-hero">
        <Card className="glass-card border-neon-blue/20 max-w-md">
          <CardContent className="p-6 text-center">
            <div className="mb-6">
              <Plus className="w-16 h-16 text-neon-blue mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Criar seu Bio Link</h3>
              <p className="text-white/70">
                Você ainda não tem um Bio Link. Vamos criar um para você!
              </p>
            </div>
            <Button 
              onClick={createBioLink}
              className="w-full bg-gradient-neon hover:shadow-neon"
            >
              <Plus className="w-4 h-4 mr-2" />
              Criar Bio Link
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Mostrar loading se não tiver dados ainda
  if (!bioLinkData) {
    return <EditorSkeleton isMobile={isMobile} />
  }

  const userDataToDisplay = editedUserData || bioLinkData.userData;
  const linksToDisplay = editedLinks;

  return (
    <div className="min-h-screen bg-gradient-hero">
      <ResponsiveContainer size="xl" padding="lg" className="py-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Editor de Bio Link</h1>
            <p className="text-white/60">Personalize sua página de links e acompanhe o desempenho</p>
            {hasUnsavedChanges && (
              <p className="text-amber-400 text-sm mt-1">
                ⚠️ Você tem alterações não salvas
              </p>
            )}
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              onClick={handlePreview}
              variant="outline" 
              size="lg"
              className="border-white/20 text-white hover:bg-white/10"
              disabled={!userDataToDisplay.username}
            >
              <Eye className="w-5 h-5 mr-2" />
              Visualizar Página
            </Button>
            <Button 
              onClick={handleSave}
              size="lg"
              disabled={isSaving || !hasUnsavedChanges}
              className="bg-gradient-neon hover:shadow-neon btn-futuristic"
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
              <BioLinkPreview 
                userData={userDataToDisplay} 
                links={linksToDisplay} 
              />
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