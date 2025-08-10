# Frontend - React Application

## 🎯 Visão Geral

O frontend do Abrev.io é uma Single Page Application (SPA) construída com React 18 + TypeScript, focada em performance, responsividade e experiência do usuário.

## Roteamento

### Estrutura de Rotas
```typescript
/ - Homepage (landing page)
/dashboard - Dashboard principal
/dashboard/editor - Editor de biolink
/dashboard/analytics - Página de analytics
/dashboard/settings - Configurações do usuário
/pricing - Planos e preços
/bio/:username - Página pública do biolink
/joaosilva - Demo da página biolink
```

### Proteção de Rotas
- **Rotas públicas**: /, /pricing, /bio/:username
- **Rotas protegidas**: /dashboard/* (requer autenticação)
- **Redirects**: Usuários não autenticados → homepage

## Gestão de Estado

### Context Providers
```typescript
// contexts/index.tsx
<AppProviders>
  <AuthProvider>      // Autenticação e sessão
    <UserProvider>     // Dados do usuário
      <NotificationProvider> // Toasts e notificações
        {children}
      </NotificationProvider>
    </UserProvider>
  </AuthProvider>
</AppProviders>
```

### Estado Global
- **AuthContext** - Login, logout, estado de autenticação
- **UserContext** - Perfil, preferências, dados do usuário
- **NotificationContext** - Toasts, alerts, mensagens

### Estado Local
- **React Query** - Cache de dados do servidor
- **useState** - Estado de componentes individuais
- **useReducer** - Estado complexo (formulários, modais)

## Componentes Principais

### Layout Components
```typescript
// Dashboard Layout
<AppSidebar />          // Navegação lateral
<DashboardHeader />     // Cabeçalho com ações
<main>                  // Conteúdo principal
  {children}
</main>
```

### Feature Components
- **BioLinkEditor** - Editor drag-and-drop completo
- **BioLinkPreview** - Preview em tempo real
- **StatsCards** - Cards de estatísticas
- **UrlShortenerCard** - Encurtador de URLs

### UI Components (shadcn/ui)
- **Button, Card, Dialog** - Componentes base
- **Form, Input, Select** - Formulários
- **Toast, Alert** - Feedback do usuário

## Hooks Customizados

### Data Fetching
```typescript
// hooks/useBioLink.tsx
const { bioLink, updateProfile, addLink, removeLink } = useBioLink()

// hooks/useUrlShortener.tsx
const { shortenUrl, urls, deleteUrl } = useUrlShortener()

// hooks/useAnalytics.tsx
const { stats, chartData, exportData } = useAnalytics()
```

### Utilities
```typescript
// hooks/useTheme.tsx
const { theme, setTheme } = useTheme() // 'light' | 'dark' | 'neon'

// hooks/useFileUpload.tsx
const { uploadFile, uploading, error } = useFileUpload()

// hooks/useLocalStorage.tsx
const [value, setValue] = useLocalStorage('key', defaultValue)
```

## Formulários e Validação

### React Hook Form + Zod
```typescript
// Exemplo de formulário típico
const form = useForm<FormData>({
  resolver: zodResolver(schema),
  defaultValues: {...}
})

const onSubmit = (data: FormData) => {
  // Envio para Supabase
}
```

### Schemas de Validação
- **Perfil**: Nome, bio, links sociais
- **Links**: URL, título, ícone
- **URLs**: URL original, código personalizado

## Responsividade

### Breakpoints (Tailwind)
```css
sm: 640px   // Mobile landscape
md: 768px   // Tablet
lg: 1024px  // Desktop
xl: 1280px  // Large desktop
```

### Abordagem Mobile-First
- Layout base otimizado para mobile
- Progressive enhancement para desktop
- Touch-friendly interfaces

## Performance

### Code Splitting
```typescript
// Lazy loading de páginas
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Analytics = lazy(() => import('./pages/Analytics'))
```

### Otimizações
- **React.memo** em componentes pesados
- **useMemo/useCallback** para computações caras
- **Image lazy loading** para avatars e assets
- **Bundle splitting** por rotas

## Tratamento de Erros

### Error Boundaries
```typescript
// Captura erros em runtime
<ErrorBoundary fallback={<ErrorFallback />}>
  <App />
</ErrorBoundary>
```

### Toast Notifications
```typescript
// Feedback para o usuário
const { toast } = useToast()

toast({
  title: "Sucesso!",
  description: "Link adicionado com sucesso",
  variant: "default" // "default" | "destructive"
})
```

## Acessibilidade

### Implementações
- **ARIA labels** em todos os interativos
- **Keyboard navigation** completa
- **Focus management** em modais
- **Screen reader support** 

### Testing
- **axe-core** para auditoria automática
- **Testes manuais** com leitores de tela
- **Contrast ratio** verificado no design system

## Integração com Supabase

### Client Setup
```typescript
// integrations/supabase/client.ts
export const supabase = createClient<Database>(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY
)
```

### React Query Integration
```typescript
// Exemplo de hook integrado
const { data: bioLinks } = useQuery({
  queryKey: ['bioLinks', userId],
  queryFn: () => supabase
    .from('bio_links')
    .select('*')
    .eq('user_id', userId)
})
```

## Debugging

### Development Tools
- **React DevTools** - Component tree e props
- **React Query DevTools** - Cache e network
- **Browser DevTools** - Performance e network

### Logging
```typescript
// Environment-based logging
if (import.meta.env.DEV) {
  console.log('Debug info:', data)
}
```

## Implementação Mobile-First

### Arquitetura Mobile
O frontend implementa uma arquitetura mobile-first completa com:

#### Sistema de Detecção
```typescript
// Hook principal para otimizações mobile
const useMobileOptimized = () => {
  return {
    isMobile: boolean,              // Detecção de dispositivo móvel
    orientation: 'portrait' | 'landscape', // Orientação atual
    viewportHeight: number,         // Altura real do viewport
    getTouchTargetSize: (size) => string, // Touch targets otimizados
    supportsHover: () => boolean    // Suporte a hover
  }
}
```

#### Componentes de Layout Mobile
```typescript
// Layout containers responsivos
<MobileLayout hasTopNav hasBottomNav>
  <ResponsiveContainer size="lg" padding="md">
    <ResponsiveGrid cols={{ mobile: 1, tablet: 2, desktop: 3 }}>
      {content}
    </ResponsiveGrid>
  </ResponsiveContainer>
</MobileLayout>
```

#### Componentes Mobile Especializados
- **MobileHeader**: Headers contextuais com navegação
- **MobileCard**: Cards otimizados para touch
- **MobileActionSheet**: Action sheets nativos
- **MobileTabs**: Sistema de abas mobile-friendly  
- **MobileOptimizedButton**: Botões com touch targets adequados

### Touch Optimization
```typescript
// Touch targets adaptativos
const TouchButton = () => {
  const { getTouchTargetSize } = useMobileOptimized()
  
  return (
    <Button className={getTouchTargetSize('md')}>
      {/* Garante 48px de altura no mobile */}
    </Button>
  )
}
```

### Conditional Rendering
```typescript
// Renderização condicional por dispositivo
const AdaptiveComponent = () => {
  const { isMobile, supportsHover } = useMobileOptimized()
  
  return (
    <div className={cn(
      'component-base',
      isMobile && 'mobile-specific',
      supportsHover() && 'hover:scale-105'
    )}>
      {isMobile ? <MobileInterface /> : <DesktopInterface />}
    </div>
  )
}
```

### Página de Demonstração
```typescript
// /demo - Showcase completo dos componentes mobile
- Demonstração de todos os componentes mobile
- Testes de touch targets e interações
- Exemplos de layouts responsivos
- Action sheets e navegação mobile
```

### Performance Mobile
- **Lazy Loading**: Componentes mobile carregados condicionalmente
- **Touch Events**: Otimização de event listeners para touch
- **Viewport Handling**: Cálculo preciso de dimensões mobile
- **Memory Management**: Cleanup adequado de listeners

## Build e Deploy

### Vite Configuration
- **Fast HMR** durante desenvolvimento
- **Optimized builds** para produção
- **Asset optimization** automática
- **Mobile-first bundling** com code splitting

### Environment Variables
```bash
# .env.local
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

### Deploy Process
1. `npm run build` - Build otimizado
2. Deploy para Vercel/Netlify/similar
3. Configure custom domain se necessário
4. Test mobile performance e responsividade