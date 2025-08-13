# Componentes UI

## 🧩 Visão Geral

O sistema de componentes do Abrev.io é baseado em shadcn/ui com customizações para o design system do projeto, focando em glassmorphism, gradientes neon e experiência mobile-first.

## Estrutura de Componentes

### UI Base (shadcn/ui)
```
components/ui/
├── button.tsx          # Botões com variantes customizadas
├── card.tsx            # Cards com efeito glass
├── dialog.tsx          # Modais e dialogs
├── form.tsx            # Formulários com validação
├── input.tsx           # Inputs com styling custom
├── toast.tsx           # Notificações toast
└── ...                 # Outros componentes base
```

### Componentes de Dashboard
```
components/dashboard/
├── AppSidebar.tsx      # Navegação lateral
├── DashboardHeader.tsx # Cabeçalho do dashboard
├── QuickActions.tsx    # Ações rápidas
├── StatsCards.tsx      # Cards de estatísticas
├── BiolinksGrid.tsx    # Grid de biolinks
└── UrlShortenerCard.tsx # Encurtador de URLs
```

### Editor de Biolink
```
components/biolink-editor/
├── BioLinkPreview.tsx  # Preview em tempo real
├── ProfileEditor.tsx   # Editor de perfil
├── LinksManager.tsx    # Gerenciador de links
├── AddLinkDialog.tsx   # Modal para adicionar links
├── SortableLinkItem.tsx # Item drag-and-drop
└── IconLibrary.ts      # Biblioteca de ícones
```

### Modais
```
components/modals/
├── ConfirmDeleteModal.tsx    # Confirmação de exclusão
├── ConfirmLogoutModal.tsx    # Confirmação de logout
├── UnsavedChangesModal.tsx   # Aviso de alterações não salvas
├── PasswordChangeModal.tsx   # Alteração de senha
└── CheckoutModal.tsx         # Modal de checkout (futuro)
```

## Componentes Principais

### Button Component

**Localização**: `components/ui/button.tsx`

```typescript
// Variantes disponíveis
variant: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
size: "default" | "sm" | "lg" | "icon"

// Uso
<Button variant="default" size="lg">
  Salvar Alterações
</Button>

<Button variant="outline" size="sm">
  <Plus className="w-4 h-4 mr-2" />
  Adicionar Link
</Button>
```

**Customizações**:
- Gradientes neon para variante default
- Efeitos glassmorphism para outline
- Hover e focus states animados
- Suporte completo a ícones

### Card Component

**Localização**: `components/ui/card.tsx`

```typescript
// Estrutura base
<Card className="glass-card border-white/10">
  <CardHeader>
    <CardTitle>Título</CardTitle>
    <CardDescription>Descrição</CardDescription>
  </CardHeader>
  <CardContent>
    {/* Conteúdo */}
  </CardContent>
  <CardFooter>
    {/* Ações */}
  </CardFooter>
</Card>
```

**Classes CSS Especiais**:
- `.glass-card` - Efeito glassmorphism
- `.hover-scale` - Animação de hover
- `.gradient-border` - Bordas com gradiente

### AppSidebar Component

**Localização**: `components/dashboard/AppSidebar.tsx`

```typescript
// Funcionalidades
- Navegação colapsível
- Theme switching (Light/Dark/Neon)
- Logout modal
- Responsive (mobile: overlay, desktop: sidebar)

// Estado
const [collapsed, setCollapsed] = useState(false)
const [showLogoutModal, setShowLogoutModal] = useState(false)
```

**Navegação**:
- Dashboard (overview)
- Editor de Biolink
- Analytics
- Configurações

### BioLinkPreview Component

**Localização**: `components/biolink-editor/BioLinkPreview.tsx`

```typescript
// Props interface
interface BioLinkPreviewProps {
  profile: Profile
  links: LinkItem[]
  socialLinks: SocialLink[]
  theme: ThemeConfig
}

// Features
- Preview em tempo real
- Responsive (mobile viewport simulation)
- Theme switching
- Click tracking simulation
```

**Responsividade**:
- Container com max-width de dispositivo móvel
- Scroll interno para visualização completa
- Proporções mantidas em todas as telas

### LinksManager Component

**Localização**: `components/biolink-editor/LinksManager.tsx`

```typescript
// Funcionalidades principais
- Drag and drop reordering (@dnd-kit)
- Adicionar/remover links
- Toggle ativo/inativo
- Edit inline de títulos

// Hooks integrados
const { links, addLink, updateLink, removeLink, reorderLinks } = useBioLink()
```

**DnD Implementation**:
```typescript
// Setup do drag and drop
const sensors = useSensors(
  useSensor(PointerSensor),
  useSensor(KeyboardSensor)
)

function handleDragEnd(event: DragEndEvent) {
  const { active, over } = event
  if (active.id !== over?.id) {
    reorderLinks(active.id, over.id)
  }
}
```

### StatsCards Component

**Localização**: `components/dashboard/StatsCards.tsx`

```typescript
// Dados mockados (será integrado com Supabase)
const stats = [
  { 
    title: "Visualizações Totais", 
    value: "2.540", 
    icon: Eye, 
    change: "+12% vs mês anterior",
    color: "text-neon-blue"
  },
  // ... outros stats
]
```

**Visual Features**:
- Ícones coloridos com background glassmorphism
- Animações de hover
- Cores temáticas para cada métrica
- Responsive grid layout

### AddLinkDialog Component

**Localização**: `components/biolink-editor/AddLinkDialog.tsx`

```typescript
// Form schema com Zod
const linkSchema = z.object({
  title: z.string().min(1, "Título é obrigatório"),
  url: z.string().url("URL inválida"),
  icon: z.string().default('link')
})

// Features
- Seleção de ícones visual
- Validação em tempo real
- Preview do link
- Categorias de ícones (social, geral, etc)
```

## Padrões de Design

### Glassmorphism
```css
/* Classe base para cards glass */
.glass-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

/* Variações para temas */
.dark .glass-card {
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
}
```

### Gradientes Neon
```css
/* Gradiente principal */
.bg-gradient-neon {
  background: linear-gradient(135deg, #00B8FF, #0080FF);
}

/* Gradientes de texto */
.text-gradient {
  background: linear-gradient(135deg, #00B8FF, #8B5CF6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
```

### Animações
```css
/* Hover scale suave */
.hover-scale {
  transition: transform 0.2s ease-in-out;
}

.hover-scale:hover {
  transform: scale(1.02);
}

/* Fade in animation */
.fade-in {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
```

## Responsividade

### Breakpoints Strategy
- **Mobile First**: Design base para mobile
- **Progressive Enhancement**: Funcionalidades adicionais em desktop
- **Touch Friendly**: Botões e áreas de toque adequadas

### Grid Systems
```typescript
// Dashboard responsive grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* Cards */}
</div>

// Biolink editor layout
<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
  <div>{/* Editor */}</div>
  <div>{/* Preview */}</div>
</div>
```

## Biblioteca de Ícones

### IconLibrary.ts
```typescript
export interface IconData {
  id: string
  name: string
  icon: React.ComponentType<any>
  color: string  // Gradiente CSS
}

// Ícones disponíveis
export const iconLibrary: IconData[] = [
  { id: 'instagram', name: 'Instagram', icon: Instagram, color: 'from-purple-500 to-pink-500' },
  { id: 'whatsapp', name: 'WhatsApp', icon: MessageCircle, color: 'from-green-400 to-green-600' },
  // ... outros ícones
]
```

**Categorias**:
- **Social**: Instagram, WhatsApp, YouTube, TikTok, LinkedIn
- **Comunicação**: Email, Telefone, Telegram
- **Negócios**: Website, PIX, Portfolio
- **Geral**: Link, Arquivo, Música

## Acessibilidade

### ARIA Implementation
```typescript
// Exemplo em botões
<Button
  aria-label="Adicionar novo link"
  aria-describedby="add-link-hint"
>
  <Plus className="w-4 h-4" />
</Button>

// Focus management em modais
<Dialog onOpenChange={setOpen}>
  <DialogContent aria-labelledby="modal-title">
    <DialogTitle id="modal-title">Título do Modal</DialogTitle>
    {/* Conteúdo */}
  </DialogContent>
</Dialog>
```

### Keyboard Navigation
- **Tab order** lógico em todos os componentes
- **Enter/Space** para ativação de botões
- **Escape** para fechar modais
- **Arrow keys** para navegação em listas

## Testes

### Testing Strategy
```typescript
// Testes unitários com React Testing Library
import { render, screen, fireEvent } from '@testing-library/react'

test('should add new link when form is submitted', () => {
  render(<AddLinkDialog open={true} onOpenChange={() => {}} />)
  
  fireEvent.change(screen.getByLabelText('Título'), {
    target: { value: 'Meu Instagram' }
  })
  
  fireEvent.change(screen.getByLabelText('URL'), {
    target: { value: 'https://instagram.com/user' }
  })
  
  fireEvent.click(screen.getByText('Adicionar Link'))
  
  // Assertions...
})
```

## Performance

### Otimizações Implementadas
- **React.memo** em componentes pesados
- **useMemo** para computações de listas
- **useCallback** para event handlers
- **Lazy loading** de modais e dialogs

### Bundle Size
- **Tree shaking** de ícones não utilizados
- **Code splitting** por funcionalidade
- **Dynamic imports** para componentes grandes

## Componentes Mobile-First

### Componentes de Layout Mobile

#### MobileLayout
**Localização**: `components/layout/MobileLayout.tsx`

```typescript
interface MobileLayoutProps {
  children: ReactNode
  className?: string
  hasBottomNav?: boolean  // Para navegação inferior
  hasTopNav?: boolean     // Para header fixo
}

// Uso
<MobileLayout hasTopNav hasBottomNav>
  {children}
</MobileLayout>
```

**Funcionalidades**:
- Container principal para layouts mobile
- Padding automático para navigation areas
- Background gradient otimizado
- Safe area handling

#### ResponsiveContainer
**Localização**: `components/layout/ResponsiveContainer.tsx`

```typescript
interface ResponsiveContainerProps {
  children: ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

// Tamanhos adaptativos
const sizeClasses = {
  sm: 'max-w-sm',    // 384px
  md: 'max-w-md',    // 448px  
  lg: 'max-w-4xl',   // 896px
  xl: 'max-w-6xl',   // 1152px
  full: 'max-w-full' // 100%
}
```

**Features**:
- Containers responsivos inteligentes
- Padding contextual mobile/desktop
- Centralização automática
- Breakpoint-aware sizing

#### ResponsiveGrid
**Localização**: `components/layout/ResponsiveGrid.tsx`

```typescript
interface ResponsiveGridProps {
  cols?: {
    mobile?: number    // Colunas no mobile
    tablet?: number    // Colunas no tablet  
    desktop?: number   // Colunas no desktop
  }
  gap?: 'sm' | 'md' | 'lg'
}

// Uso típico
<ResponsiveGrid 
  cols={{ mobile: 1, tablet: 2, desktop: 3 }}
  gap="md"
>
  {items}
</ResponsiveGrid>
```

### Componentes de Interface Mobile

#### MobileHeader
**Localização**: `components/mobile/MobileHeader.tsx`

```typescript
interface MobileHeaderProps {
  title: string
  subtitle?: string
  showBack?: boolean      // Botão voltar
  showSettings?: boolean  // Ícone configurações
  actions?: ReactNode     // Ações customizadas
}

// Exemplo no Editor
<MobileHeader 
  title="Editor de Bio"
  subtitle="Personalize seu perfil"
  showBack
  actions={<SaveButton />}
/>
```

**Características**:
- Header fixo com backdrop blur
- Navegação contextual
- Integração com theme selector
- Safe area support

#### MobileCard
**Localização**: `components/mobile/MobileCard.tsx`

```typescript
interface MobileCardProps {
  title: string
  subtitle?: string
  icon?: ReactNode
  variant?: 'default' | 'action' | 'stat'
  onClick?: () => void
}

// Card interativo
<MobileCard
  title="Bio Links"
  subtitle="3 links ativos"
  icon={<Link className="w-5 h-5" />}
  variant="action"
  onClick={() => navigate('/editor')}
/>
```

**Otimizações Mobile**:
- Touch targets de 44px mínimo
- Feedback visual otimizado
- Glassmorphism responsivo
- Hover states condicionais

#### MobileActionSheet
**Localização**: `components/mobile/MobileActionSheet.tsx`

```typescript
interface MobileActionSheetProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: ReactNode
}

// Action sheet nativo
<MobileActionSheet 
  isOpen={showActions}
  onClose={() => setShowActions(false)}
  title="Criar Novo"
>
  <Button>Criar Bio Link</Button>
  <Button>Encurtar URL</Button>
</MobileActionSheet>
```

**UX Nativa**:
- Slide up animation
- Backdrop blur overlay
- Safe area bottom padding
- Swipe-to-dismiss (futuro)

#### MobileTabs
**Localização**: `components/mobile/MobileTabs.tsx`

```typescript
interface MobileTabsProps {
  tabs: {
    id: string
    label: string
    content: ReactNode
    icon?: ReactNode
  }[]
  activeTab: string
  onTabChange: (tabId: string) => void
}

// Tabs otimizadas
<MobileTabs
  tabs={[
    { id: 'editor', label: 'Editor', icon: <Edit />, content: <EditorPanel /> },
    { id: 'preview', label: 'Preview', icon: <Eye />, content: <PreviewPanel /> }
  ]}
  activeTab={currentTab}
  onTabChange={setCurrentTab}
/>
```

**Mobile Features**:
- Sticky tab headers
- Smooth content transitions
- Touch-friendly tap targets
- Visual active indicators

#### MobileOptimizedButton
**Localização**: `components/ui/mobile-optimized-button.tsx`

```typescript
// Tamanhos otimizados para mobile
const touchTargetSizes = {
  sm: 'h-10 px-4',      // 40px height (mobile)
  md: 'h-12 px-6',      // 48px height (mobile)  
  lg: 'h-14 px-8'       // 56px height (mobile)
}

// Auto-detecção de hover support
const supportsHover = () => 
  window.matchMedia('(hover: hover)').matches
```

**Otimizações**:
- Touch targets adaptativos
- Hover states condicionais
- Feedback tátil (scale transform)
- Performance otimizada

### Hook Mobile Especializado

#### useMobileOptimized
**Localização**: `hooks/useMobileOptimized.tsx`

```typescript
interface UseMobileOptimizedReturn {
  isMobile: boolean
  orientation: 'portrait' | 'landscape'
  viewportHeight: number
  isLandscape: boolean
  isPortrait: boolean
  getOptimizedHeight: (percentage?: number) => string
  supportsHover: () => boolean
  getTouchTargetSize: (size?: 'sm' | 'md' | 'lg') => string
}

// Uso nos componentes
const { 
  isMobile, 
  orientation,
  viewportHeight,
  getTouchTargetSize 
} = useMobileOptimized()

// Touch target otimizado
<Button className={getTouchTargetSize('md')}>
  Clique aqui
</Button>
```

**Funcionalidades Avançadas**:
- **Detecção de orientação**: Portrait/landscape automático
- **Altura otimizada**: Considerando teclado virtual
- **Touch targets**: Tamanhos adaptativos por contexto
- **Hover detection**: Suporte condicional a hover
- **Viewport real**: Altura real sem interferências

### Padrões de Implementação Mobile

#### Layout Responsivo
```typescript
// Pattern para páginas mobile-first
export default function MobilePage() {
  const { isMobile } = useMobileOptimized()
  
  return (
    <MobileLayout hasTopNav={isMobile} hasBottomNav={isMobile}>
      <ResponsiveContainer size="lg" padding="md">
        <ResponsiveGrid 
          cols={{ mobile: 1, tablet: 2, desktop: 3 }}
          gap="md"
        >
          {/* Conteúdo */}
        </ResponsiveGrid>
      </ResponsiveContainer>
    </MobileLayout>
  )
}
```

#### Navegação Contextual
```typescript
// Headers adaptativos por página
const getPageHeader = (page: string) => {
  switch (page) {
    case 'dashboard':
      return <MobileHeader title="Dashboard" showSettings />
    case 'editor':
      return <MobileHeader title="Editor" showBack actions={<SaveButton />} />
    case 'analytics':
      return <MobileHeader title="Analytics" showBack />
  }
}
```

#### Performance Mobile
```typescript
// Lazy loading condicional
const MobileComponent = lazy(() => 
  isMobile 
    ? import('./MobileComponent')
    : import('./DesktopComponent')
)

// Renders condicionais
{isMobile ? (
  <MobileActionSheet {...props} />
) : (
  <DesktopModal {...props} />
)}
```

### Testes Mobile

#### Responsive Testing
```typescript
// Hook de teste para diferentes viewports
const { setViewport } = useTestViewport()

test('should render mobile layout correctly', () => {
  setViewport('mobile')
  render(<Dashboard />)
  
  expect(screen.getByRole('navigation')).toHaveClass('bottom-nav')
  expect(screen.getByText('Dashboard')).toBeInTheDocument()
})
```

#### Touch Testing
```typescript
// Testes de interação touch
test('should handle touch interactions', () => {
  render(<MobileCard onClick={mockClick} />)
  
  const card = screen.getByRole('button')
  fireEvent.touchStart(card)
  fireEvent.touchEnd(card)
  
  expect(mockClick).toHaveBeenCalled()
})
```

### Acessibilidade Mobile

#### Touch Targets
- **Mínimo 44px**: Para todos os elementos clicáveis
- **Espaçamento adequado**: 8px entre elementos
- **Feedback visual**: Scale transform em touch

#### Navegação por Teclado
- **Focus visible**: Indicadores claros
- **Tab order**: Lógico e linear
- **Skip links**: Para navegação rápida

#### Screen Readers
- **ARIA labels**: Descritivos e contextuais
- **Live regions**: Para feedback dinâmico
- **Semantic markup**: HTML estruturado

### Próximas Implementações Mobile

#### Gestos e Interações
- **Swipe gestures**: Para navegação
- **Pull-to-refresh**: Para listas
- **Long press**: Para ações contextuais
- **Pinch-to-zoom**: Para preview

#### PWA Features
- **Splash screens**: Customizadas por tema
- **App icons**: Múltiplos tamanhos
- **Offline support**: Service worker
- **Push notifications**: Engagement

#### Performance Avançada
- **Virtual scrolling**: Para listas longas
- **Image optimization**: WebP + lazy loading
- **Bundle optimization**: Mobile-specific chunks
- **Prefetching**: Rotas críticas