import { useState } from 'react'
import { Plus, Settings, Eye, Edit } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { MobileLayout } from '@/components/layout/MobileLayout'
import { ResponsiveContainer } from '@/components/layout/ResponsiveContainer'
import { ResponsiveGrid } from '@/components/layout/ResponsiveGrid'
import { MobileHeader } from '@/components/mobile/MobileHeader'
import { MobileCard } from '@/components/mobile/MobileCard'
import { MobileActionSheet } from '@/components/mobile/MobileActionSheet'
import { MobileTabs } from '@/components/mobile/MobileTabs'
import { MobileOptimizedButton } from '@/components/ui/mobile-optimized-button'
import { useMobileOptimized } from '@/hooks/useMobileOptimized'
import { useToast } from '@/hooks/use-toast'

export default function MobileDemo() {
  const [showActionSheet, setShowActionSheet] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')
  const { isMobile } = useMobileOptimized()
  const navigate = useNavigate()
  const { toast } = useToast()

  const tabs = [
    {
      id: 'overview',
      label: 'Visão Geral',
      icon: <Eye className="w-4 h-4" />,
      content: (
        <ResponsiveContainer padding="md">
          <div className="space-y-4">
            <ResponsiveGrid 
              cols={{ mobile: 1, tablet: 2, desktop: 3 }}
              gap="md"
            >
              <MobileCard
                title="Bio Links"
                subtitle="3 páginas ativas"
                variant="compact"
                icon={<Plus className="w-5 h-5" />}
                onClick={() => setShowActionSheet(true)}
              >
                <div className="mt-2">
                  <MobileOptimizedButton 
                    size="sm" 
                    variant="outline"
                    onClick={() => {
                      setActiveTab('links')
                      toast({ title: "Navegando para Bio Links" })
                    }}
                  >
                    Ver Todos
                  </MobileOptimizedButton>
                </div>
              </MobileCard>

              <MobileCard
                title="URLs Encurtadas"
                subtitle="12 links criados"
                variant="compact"
                icon={<Settings className="w-5 h-5" />}
              >
                <div className="mt-2">
                  <MobileOptimizedButton 
                    size="sm" 
                    variant="gradient"
                    onClick={() => {
                      setShowActionSheet(true)
                      toast({ title: "Abrindo criador de URL" })
                    }}
                  >
                    Criar Nova
                  </MobileOptimizedButton>
                </div>
              </MobileCard>

              <MobileCard
                title="Analytics"
                subtitle="2.5k visualizações"
                variant="compact"
                icon={<Eye className="w-5 h-5" />}
              >
                <div className="mt-2">
                  <MobileOptimizedButton 
                    size="sm"
                    onClick={() => navigate('/analytics')}
                  >
                    Ver Relatório
                  </MobileOptimizedButton>
                </div>
              </MobileCard>
            </ResponsiveGrid>
          </div>
        </ResponsiveContainer>
      )
    },
    {
      id: 'links',
      label: 'Links',
      icon: <Edit className="w-4 h-4" />,
      content: (
        <ResponsiveContainer padding="md">
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <MobileCard
                key={i}
                title={`Bio Link ${i}`}
                subtitle={`@usuario${i}`}
                variant="action"
                onClick={() => {
                  toast({ title: `Bio Link ${i} selecionado` })
                }}
              >
                <div className="flex gap-2 mt-3">
                  <MobileOptimizedButton 
                    size="sm" 
                    variant="outline"
                    onClick={() => navigate('/editor')}
                  >
                    Editar
                  </MobileOptimizedButton>
                  <MobileOptimizedButton 
                    size="sm" 
                    variant="ghost"
                    onClick={() => {
                      window.open(`/@usuario${i}`, '_blank')
                      toast({ title: `Abrindo página do usuário ${i}` })
                    }}
                  >
                    Ver Página
                  </MobileOptimizedButton>
                </div>
              </MobileCard>
            ))}
          </div>
        </ResponsiveContainer>
      )
    }
  ]

  return (
    <MobileLayout hasTopNav={isMobile} className="min-h-screen">
      <MobileHeader 
        title="Demo Mobile"
        subtitle="Componentes otimizados"
        showSettings
        actions={
          <MobileOptimizedButton
            size="sm"
            variant="gradient"
            onClick={() => setShowActionSheet(true)}
          >
            <Plus className="w-4 h-4" />
          </MobileOptimizedButton>
        }
      />

      <div className={isMobile ? 'pt-16' : ''}>
        <MobileTabs 
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </div>

      <MobileActionSheet
        isOpen={showActionSheet}
        onClose={() => setShowActionSheet(false)}
        title="Ações Rápidas"
      >
        <div className="space-y-3">
          <MobileOptimizedButton 
            variant="gradient" 
            className="w-full"
            onClick={() => {
              navigate('/editor')
              setShowActionSheet(false)
              toast({ title: "Navegando para o editor" })
            }}
          >
            <Plus className="w-4 h-4 mr-2" />
            Criar Bio Link
          </MobileOptimizedButton>
          
          <MobileOptimizedButton 
            variant="outline" 
            className="w-full border-white/20 text-white hover:bg-white/10"
            onClick={() => {
              navigate('/dashboard')
              setShowActionSheet(false)
              toast({ title: "Navegando para encurtador" })
            }}
          >
            Encurtar URL
          </MobileOptimizedButton>
          
          <MobileOptimizedButton 
            variant="ghost" 
            className="w-full text-white hover:bg-white/10"
            onClick={() => setShowActionSheet(false)}
          >
            Cancelar
          </MobileOptimizedButton>
        </div>
      </MobileActionSheet>
    </MobileLayout>
  )
}