import { useState } from "react"
import { Save, Eye, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { toast } from "sonner"
import { ProfileEditor } from "@/components/biolink-editor/ProfileEditor"
import { LinksManager } from "@/components/biolink-editor/LinksManager"
import { BioLinkPreview, UserData } from "@/components/biolink-editor/BioLinkPreview"
import { LinkData } from "@/components/biolink-editor/SortableLinkItem"
import { ResponsiveContainer } from "@/components/layout/ResponsiveContainer"
import { useIsMobile } from "@/hooks/use-mobile"
import { useMobileOptimized } from "@/hooks/useMobileOptimized"

// Mock user data
const initialUserData: UserData = {
  name: "João Silva",
  username: "joaosilva",
  bio: "Transformando ideias em conteúdo que inspira",
  avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
}

// Mock links data
const initialLinks: LinkData[] = [
  { id: '1', title: 'Instagram', subtitle: 'Conteúdo diário e stories', url: 'https://instagram.com/joaosilva', iconId: 'instagram' },
  { id: '2', title: 'WhatsApp Business', subtitle: 'Fale comigo diretamente', url: 'https://wa.me/5511999999999', iconId: 'whatsapp' },
  { id: '3', title: 'YouTube', subtitle: 'Vídeos e tutoriais', url: 'https://youtube.com/joaosilva', iconId: 'youtube' },
  { id: '4', title: 'Site Pessoal', subtitle: 'Portfolio e blog', url: 'https://joaosilva.com', iconId: 'website' }
]


export default function BioLinkEditor() {
  const [userData, setUserData] = useState(initialUserData)
  const [links, setLinks] = useState(initialLinks)
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit')
  const [isSaving, setIsSaving] = useState(false)
  const { isMobile, getTouchTargetSize, getOptimizedHeight } = useMobileOptimized()

  const handleUserDataUpdate = (updates: Partial<UserData>) => {
    setUserData(prev => ({ ...prev, ...updates }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    setIsSaving(false)
    toast.success("Alterações salvas com sucesso!")
  }

  const handlePreview = () => {
    window.open(`/joaosilva`, '_blank')
  }

  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Mobile: Layout em abas otimizado */}
      {isMobile ? (
        <div className="min-h-screen">
          {/* Tab Navigation para Mobile */}
          <div className="fixed top-16 left-0 right-0 z-40 bg-glass backdrop-blur-xl border-b border-white/10">
            <div className="flex">
              <button
                onClick={() => setActiveTab('edit')}
                className={`flex-1 py-4 px-6 text-center font-medium transition-all duration-300 ${
                  activeTab === 'edit' 
                    ? 'text-neon-blue border-b-2 border-neon-blue bg-neon-blue/5' 
                    : 'text-white/60 hover:text-white/80 hover:bg-white/5'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <span>Editar</span>
                  {activeTab !== 'edit' && <ChevronRight className="w-4 h-4" />}
                </div>
              </button>
              <button
                onClick={() => setActiveTab('preview')}
                className={`flex-1 py-4 px-6 text-center font-medium transition-all duration-300 ${
                  activeTab === 'preview' 
                    ? 'text-neon-blue border-b-2 border-neon-blue bg-neon-blue/5' 
                    : 'text-white/60 hover:text-white/80 hover:bg-white/5'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  {activeTab !== 'preview' && <ChevronLeft className="w-4 h-4" />}
                  <span>Preview</span>
                </div>
              </button>
            </div>
          </div>

          {/* Ações Flutuantes para Mobile */}
          <div className="fixed bottom-24 right-4 z-50 flex flex-col gap-3">
            <Button 
              onClick={handlePreview}
              size="lg"
              variant="outline" 
              className={`${getTouchTargetSize('lg')} rounded-full border-white/20 text-white hover:bg-white/10 shadow-lg backdrop-blur-sm`}
            >
              <Eye className="w-6 h-6" />
            </Button>
            <Button 
              onClick={handleSave}
              size="lg"
              variant="gradient" 
              disabled={isSaving}
              className={`${getTouchTargetSize('lg')} rounded-full shadow-lg shadow-neon-blue/25`}
            >
              <Save className="w-6 h-6" />
            </Button>
          </div>

          {/* Conteúdo das Abas */}
          <div className="pt-24 pb-24 min-h-screen">
            {activeTab === 'edit' && (
              <div className="px-4 py-6 space-y-6 animate-fade-in">
                <div className="text-center mb-6">
                  <h1 className="text-xl font-bold text-white mb-2">Editor de Bio Link</h1>
                  <p className="text-white/60 text-sm">Personalize sua página de links</p>
                </div>
                
                <ProfileEditor
                  userData={userData}
                  onUpdate={handleUserDataUpdate}
                />
                
                <LinksManager
                  links={links}
                  onLinksChange={setLinks}
                />
              </div>
            )}

            {activeTab === 'preview' && (
              <div className="px-4 py-6 animate-fade-in">
                <div className="max-w-sm mx-auto">
                  <div className="mb-4 text-center">
                    <h2 className="text-lg font-semibold text-white mb-1">Preview da Página</h2>
                    <p className="text-white/60 text-sm">Como seus visitantes verão</p>
                  </div>
                  
                  <Card className="bg-glass border-white/10 overflow-hidden">
                    <BioLinkPreview userData={userData} links={links} />
                  </Card>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Desktop: Layout lado a lado */
        <div className="min-h-screen">
          <ResponsiveContainer size="xl" padding="lg" className="py-8">
            {/* Header Desktop */}
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
                  disabled={isSaving}
                  className="btn-futuristic shadow-lg shadow-neon-blue/25"
                >
                  <Save className="w-5 h-5 mr-2" />
                  {isSaving ? 'Salvando...' : 'Salvar Alterações'}
                </Button>
              </div>
            </div>

            {/* Layout Principal Desktop */}
            <div className="grid grid-cols-12 gap-8">
              {/* Painel de Edição */}
              <div className="col-span-8 space-y-8">
                <ProfileEditor
                  userData={userData}
                  onUpdate={handleUserDataUpdate}
                />
                
                <LinksManager
                  links={links}
                  onLinksChange={setLinks}
                />
              </div>

              {/* Painel de Preview */}
              <div className="col-span-4">
                <div className="sticky top-24">
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-white mb-1">Preview em Tempo Real</h3>
                    <p className="text-white/60 text-sm">Veja como ficará sua página</p>
                  </div>
                  
                  <Card className="bg-glass border-white/10 overflow-hidden">
                    <BioLinkPreview userData={userData} links={links} />
                  </Card>
                </div>
              </div>
            </div>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}