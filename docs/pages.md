# Páginas - Documentação

## Visão Geral

O Abrev.io é estruturado como uma SPA (Single Page Application) com roteamento client-side usando React Router. Cada página tem responsabilidades específicas e segue padrões consistentes de UX.

## Estrutura de Roteamento

### Rotas Principais

```tsx
// src/App.tsx
<Routes>
  <Route path="/" element={<Index />} />
  <Route path="/dashboard" element={<Dashboard />} />
  <Route path="/dashboard/editor" element={<BioLinkEditor />} />
  <Route path="/dashboard/analytics" element={<Analytics />} />
  <Route path="/dashboard/settings" element={<Settings />} />
  <Route path="/pricing" element={<Pricing />} />
  <Route path="/bio/:username" element={<BioLink />} />
  <Route path="/joaosilva" element={<BioLink />} /> {/* Demo route */}
  <Route path="*" element={<NotFound />} />
</Routes>
```

## Páginas Detalhadas

### 1. Homepage (`/` - Index.tsx)

**Propósito**: Landing page para apresentar a plataforma e converter visitantes

**Componentes Principais**:
- `Header` - Navegação principal e CTA
- `HeroSection` - Seção principal com proposta de valor
- `BenefitsSection` - Benefícios e funcionalidades
- `TestimonialsSection` - Depoimentos sociais
- `Footer` - Links institucionais e contato

**Funcionalidades**:
- ✅ Hero section responsivo com CTA
- ✅ Seção de benefícios com ícones
- ✅ Testimonials compactos
- ✅ Design mobile-first
- ✅ Animações de entrada suaves

**Estado**: ✅ **Completo**

### 2. Dashboard (`/dashboard` - Dashboard.tsx)

**Propósito**: Painel principal do usuário com visão geral e ações rápidas

**Layout**:
- **Desktop**: Sidebar + conteúdo principal
- **Mobile**: Bottom navigation + modal menu

**Componentes**:
- `AppSidebar` - Navegação lateral (desktop)
- `DashboardHeader` - Cabeçalho com perfil e notificações
- `StatsCards` - Cards de estatísticas principais
- `QuickActions` - Ações rápidas (criar link, editar bio)
- `BiolinksGrid` - Grade com biolinks do usuário
- `UrlShortenerCard` - Card para encurtar URLs
- `MobileBottomNav` - Navegação inferior (mobile)

**Funcionalidades**:
- ✅ Estatísticas em tempo real (mock)
- ✅ Ações rápidas contextuais
- ✅ Lista de biolinks personalizados
- ✅ Encurtador de URL integrado
- ✅ Design responsivo completo

**Estado**: ✅ **Completo** (com dados mock)

### 3. Editor de Biolink (`/dashboard/editor` - BioLinkEditor.tsx)

**Propósito**: Editor visual para criação e edição de páginas biolink

**Layout**: Split-screen com editor (esquerda) e preview (direita)

**Componentes**:
- `ProfileEditor` - Edição de perfil (avatar, nome, bio)
- `LinksManager` - Gerenciador de links drag-and-drop
- `BioLinkPreview` - Preview em tempo real
- `AddLinkDialog` - Modal para adicionar novos links
- `EditLinkDialog` - Modal para editar links existentes
- `SortableLinkItem` - Item individual arrastrável

**Funcionalidades**:
- ✅ Drag & drop para reordenar links
- ✅ Preview em tempo real
- ✅ Upload de avatar
- ✅ Biblioteca de ícones extensa
- ✅ Validação de URLs
- ✅ Estados de loading e erro

**Estado**: ✅ **Completo** (com localStorage)

### 4. Analytics (`/dashboard/analytics` - Analytics.tsx)

**Propósito**: Relatórios detalhados e insights sobre performance

**Seções**:
- **Overview**: Métricas principais
- **Gráficos**: Visualizações temporais
- **Top Links**: Links mais acessados
- **Dispositivos**: Breakdown por dispositivo
- **Localização**: Dados geográficos
- **Exportação**: Download de relatórios

**Componentes**:
- `MetricsGrid` - Grid de métricas principais
- `AnalyticsCharts` - Gráficos com Recharts
- `TopLinksTable` - Tabela de top performers
- `DeviceBreakdown` - Gráfico de dispositivos
- `ExportTools` - Ferramentas de exportação

**Funcionalidades**:
- ✅ Métricas em tempo real
- ✅ Gráficos interativos
- ✅ Filtros de período
- ✅ Dados de geolocalização
- ✅ Exportação CSV/JSON

**Estado**: ✅ **Completo** (com dados mock)

### 5. Configurações (`/dashboard/settings` - Settings.tsx)

**Propósito**: Gerenciamento de conta, preferências e configurações

**Seções Tabs**:
- **Perfil**: Dados pessoais e avatar
- **Conta**: Email, senha, plano
- **Preferências**: Tema, notificações, idioma
- **Privacidade**: Configurações de privacidade
- **Integrações**: APIs e webhooks

**Componentes**:
- `ProfileSettings` - Formulário de perfil
- `AccountSettings` - Configurações de conta
- `PreferencesSettings` - Preferências do usuário
- `PrivacySettings` - Configurações de privacidade
- `IntegrationSettings` - Integrações externas

**Funcionalidades**:
- ✅ Edição de perfil completa
- ✅ Mudança de senha
- ✅ Configurações de tema
- ✅ Preferências de notificação
- ✅ Exclusão de conta

**Estado**: ✅ **Completo** (com localStorage)

### 6. Preços (`/pricing` - Pricing.tsx)

**Propósito**: Página de planos e preços para conversão

**Estrutura**:
- **Hero**: Título e toggle mensal/anual
- **Cards de Planos**: Free, Pro, Business
- **Comparação**: Tabela de features
- **FAQ**: Dúvidas frequentes
- **CTA**: Call-to-action final

**Funcionalidades**:
- ✅ Toggle billing mensal/anual
- ✅ Destaque do plano recomendado
- ✅ Calculadora de economia
- ✅ CTAs contextuais
- ✅ Design persuasivo

**Estado**: ✅ **Completo**

### 7. Biolink Público (`/bio/:username` - BioLink.tsx)

**Propósito**: Página pública do biolink acessível por qualquer pessoa

**Layout**: Single-column centrado com foco mobile

**Elementos**:
- **Avatar**: Foto de perfil circular
- **Nome e Bio**: Informações pessoais
- **Links Sociais**: Redes sociais principais
- **Links Customizados**: Links personalizados
- **Footer**: Branding "Powered by Abrev.io"

**Funcionalidades**:
- ✅ Layout mobile-first
- ✅ Animações de entrada
- ✅ Tracking de cliques
- ✅ Compartilhamento social
- ✅ QR Code integrado
- ✅ Temas personalizáveis

**Estado**: ✅ **Completo** (demo em `/joaosilva`)

### 8. Página 404 (`/*` - NotFound.tsx)

**Propósito**: Página de erro 404 amigável

**Elementos**:
- Ilustração ou ícone de erro
- Mensagem explicativa
- Botão para voltar ao início
- Links úteis

**Estado**: ✅ **Completo**

## Padrões das Páginas

### Layout Consistente
- **Header/Navigation**: Sempre visível
- **Main Content**: Área principal responsiva
- **Footer**: Links e informações (quando aplicável)

### Responsividade
- **Mobile-First**: Todas as páginas começam mobile
- **Breakpoints**: sm, md, lg, xl
- **Navigation**: Desktop sidebar, mobile bottom nav

### Estados da UI
- **Loading**: Skeletons e spinners
- **Empty**: Estados vazios com CTAs
- **Error**: Mensagens de erro amigáveis
- **Success**: Feedback positivo

### Performance
- **Lazy Loading**: Páginas carregadas sob demanda
- **Code Splitting**: Bundles otimizados
- **Image Optimization**: Lazy loading de imagens

## Navegação

### Navegação Autenticada
```tsx
// Rotas protegidas (requerem login)
- /dashboard/*
- /settings
- /analytics
```

### Navegação Pública
```tsx
// Rotas públicas (sem login)
- /
- /pricing
- /bio/:username
```

### Guards de Rota
```tsx
// Proteção de rotas (futuro)
<ProtectedRoute>
  <Dashboard />
</ProtectedRoute>
```

## Dados e Estado

### Estado Local
- Formulários com React Hook Form
- UI states (modals, tabs, etc.)
- Filtros e ordenação temporária

### Estado Global
- Dados do usuário (AuthContext)
- Preferências (UserContext)
- Notificações (NotificationContext)

### Persistência
- **localStorage**: Preferências e cache
- **Supabase**: Dados persistentes (futuro)

## SEO e Meta Tags

### Meta Tags Dinâmicas
```tsx
// Implementação futura com react-helmet
<Helmet>
  <title>Dashboard - Abrev.io</title>
  <meta name="description" content="..." />
</Helmet>
```

### Open Graph
- Títulos específicos por página
- Descrições otimizadas
- Imagens de preview

## Próximos Passos

### Funcionalidades Pendentes
1. **Autenticação Real**: Login/logout com Supabase
2. **Proteção de Rotas**: Guards baseados em auth
3. **Meta Tags**: SEO otimizado
4. **Analytics**: Tracking de página
5. **PWA**: Service worker e manifest

### Melhorias UX
1. **Transições**: Animações entre páginas
2. **Breadcrumbs**: Navegação contextual
3. **Search**: Busca global
4. **Shortcuts**: Atalhos de teclado

## Página Mobile Demo (`/demo` - MobileDemo.tsx)

**Propósito**: Demonstração completa dos componentes mobile-first implementados

**Layout**: Single page com tabs para diferentes demonstrações

**Componentes Demonstrados**:
- `MobileLayout` - Container mobile principal
- `ResponsiveContainer` - Containers adaptativos
- `ResponsiveGrid` - Sistema de grid responsivo
- `MobileCard` - Cards otimizados para touch
- `MobileActionSheet` - Action sheets nativos
- `MobileTabs` - Sistema de abas mobile
- `MobileOptimizedButton` - Botões com touch targets
- `MobileHeader` - Headers contextuais

**Seções da Demo**:

### Overview Tab
```typescript
// Grid responsivo com cards interativos
<ResponsiveGrid cols={{ mobile: 1, tablet: 2, desktop: 3 }}>
  <MobileCard
    title="Bio Links"
    subtitle="3 links ativos"
    icon={<Link />}
    variant="action"
    onClick={() => navigate('/editor')}
  />
  <MobileCard
    title="URLs Encurtadas"
    subtitle="12 URLs criadas"
    icon={<Settings />}
    variant="stat"
  />
  <MobileCard
    title="Analytics"
    subtitle="2.540 visualizações"
    icon={<Eye />}
    variant="default"
  />
</ResponsiveGrid>
```

### Links Tab
```typescript
// Lista de bio links com ações
{Array.from({ length: 5 }, (_, i) => (
  <MobileCard
    key={i}
    title={`Bio Link ${i}`}
    subtitle={`@usuario${i}`}
    variant="action"
    onClick={() => toast({ title: `Bio Link ${i} selecionado` })}
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
        onClick={() => window.open(`/@usuario${i}`, '_blank')}
      >
        Ver Página
      </MobileOptimizedButton>
    </div>
  </MobileCard>
))}
```

### Components Tab
```typescript
// Demonstração de componentes
<div className="space-y-6">
  <div>
    <h3 className="text-lg font-semibold mb-3">Touch Targets</h3>
    <div className="flex flex-wrap gap-3">
      <MobileOptimizedButton size="sm">Small (40px)</MobileOptimizedButton>
      <MobileOptimizedButton size="md">Medium (48px)</MobileOptimizedButton>
      <MobileOptimizedButton size="lg">Large (56px)</MobileOptimizedButton>
    </div>
  </div>
  
  <div>
    <h3 className="text-lg font-semibold mb-3">Button Variants</h3>
    <div className="flex flex-wrap gap-3">
      <MobileOptimizedButton variant="default">Default</MobileOptimizedButton>
      <MobileOptimizedButton variant="outline">Outline</MobileOptimizedButton>
      <MobileOptimizedButton variant="ghost">Ghost</MobileOptimizedButton>
      <MobileOptimizedButton variant="gradient">Gradient</MobileOptimizedButton>
    </div>
  </div>
</div>
```

**Mobile Action Sheet**:
```typescript
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
  </div>
</MobileActionSheet>
```

**Funcionalidades Implementadas**:
- ✅ Navegação por tabs mobile-friendly
- ✅ Cards interativos com feedback visual
- ✅ Action sheets nativos do iOS/Android
- ✅ Touch targets otimizados (44px+)
- ✅ Feedback via toasts contextuais
- ✅ Navegação programática integrada
- ✅ Layouts responsivos demonstrativos
- ✅ Theme switching em tempo real

**Hook Utilizado**:
```typescript
const { 
  isMobile, 
  orientation, 
  getTouchTargetSize,
  supportsHover 
} = useMobileOptimized()
```

**Estado**: ✅ **Completo e Funcional**

### Mobile-First Patterns Demonstrados

#### 1. Layout Adaptation
- Container responsivo com padding contextual
- Grid que adapta colunas por breakpoint
- Componentes que se ajustam automaticamente

#### 2. Touch Optimization
- Botões com tamanhos mínimos de 44px
- Espaçamento adequado entre elementos
- Feedback visual em interações

#### 3. Navigation Patterns
- Header móvel com navegação contextual
- Action sheets para ações secundárias
- Tab navigation otimizada para touch

#### 4. Performance
- Renders condicionais por dispositivo
- Lazy loading de componentes pesados
- Otimizações de hover para dispositivos touch

#### 5. UX Native-like
- Animações suaves e naturais
- Feedback imediato em interações
- Padrões familiares do mobile

**Acesso**: A demo está disponível em `/demo` e serve como showcase completo das capacidades mobile-first da plataforma.