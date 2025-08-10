# Arquitetura do Sistema

## 🏗️ Visão Geral

Abrev.io é uma aplicação SaaS brasileira construída com React + TypeScript no frontend e Supabase como backend/BaaS.

## Stack Tecnológica

### Frontend
- **React 18** + TypeScript
- **Vite** - Build tool e dev server
- **Tailwind CSS** - Styling com design system customizado
- **React Router Dom** - Roteamento SPA
- **React Query** - Cache e sincronização de dados
- **React Hook Form** + Zod - Formulários e validação
- **Radix UI** + shadcn/ui - Componentes base
- **Lucide React** - Ícones
- **Recharts** - Gráficos e analytics

### Backend (Supabase)
- **PostgreSQL** - Banco de dados principal
- **Row Level Security (RLS)** - Segurança a nível de linha
- **Edge Functions** - Lógica serverless (quando necessário)
- **Storage** - Upload de arquivos (avatars, etc)
- **Auth** - Sistema de autenticação

## Estrutura de Diretórios

```
src/
├── components/          # Componentes reutilizáveis
│   ├── ui/             # Componentes base (shadcn)
│   ├── layout/         # Componentes de layout responsivo
│   ├── mobile/         # Componentes mobile-first específicos
│   ├── dashboard/      # Componentes específicos do dashboard
│   ├── biolink-editor/ # Editor de biolink
│   └── modals/         # Modais e dialogs
├── pages/              # Páginas da aplicação
├── hooks/              # Hooks customizados
├── contexts/           # Context providers
├── lib/                # Utilitários e configurações
├── integrations/       # Integrações externas (Supabase)
└── assets/            # Assets estáticos
```

## Arquitetura Mobile-First

### Filosofia de Design Responsivo

A arquitetura do Abrev.io segue uma abordagem **mobile-first** verdadeira, onde:

1. **Base Mobile**: Todo componente é projetado primeiro para mobile
2. **Progressive Enhancement**: Funcionalidades desktop são adicionadas incrementalmente
3. **Conditional Rendering**: Componentes específicos por dispositivo quando necessário
4. **Performance-Aware**: Otimizações específicas para dispositivos móveis

### Camadas da Arquitetura Mobile

#### 1. Detection Layer
```typescript
// hooks/useMobileOptimized.tsx
- Device detection (mobile/desktop)
- Orientation tracking (portrait/landscape)  
- Viewport monitoring (real height/width)
- Touch support detection
- Hover capability detection
```

#### 2. Layout Layer
```typescript
// components/layout/
├── MobileLayout.tsx        # Container principal mobile
├── ResponsiveContainer.tsx # Containers adaptativos
└── ResponsiveGrid.tsx      # Sistema de grid inteligente
```

#### 3. Component Layer  
```typescript
// components/mobile/
├── MobileHeader.tsx        # Headers contextuais
├── MobileCard.tsx         # Cards touch-optimized
├── MobileActionSheet.tsx  # Action sheets nativos
├── MobileTabs.tsx         # Tab navigation mobile
└── MobileOptimizedButton.tsx # Botões com touch targets
```

#### 4. Interaction Layer
```typescript
// Otimizações de interação
- Touch targets mínimos de 44px
- Hover states condicionais
- Gesture support (futuro)
- Haptic feedback (futuro)
```

### Padrões de Implementação

#### Conditional Components
```typescript
// Pattern para componentes adaptativos
const { isMobile } = useMobileOptimized()

return isMobile ? (
  <MobileComponent {...props} />
) : (
  <DesktopComponent {...props} />
)
```

#### Responsive Hooks
```typescript
// Hook principal para otimizações mobile
const {
  isMobile,           // Boolean de detecção
  orientation,        // 'portrait' | 'landscape'
  viewportHeight,     // Altura real do viewport
  getTouchTargetSize, // Função para touch targets
  supportsHover       // Detecção de hover
} = useMobileOptimized()
```

#### Layout Composition
```typescript
// Composição de layouts responsivos
<MobileLayout hasTopNav={isMobile} hasBottomNav={isMobile}>
  <ResponsiveContainer size="lg" padding="md">
    <ResponsiveGrid cols={{ mobile: 1, tablet: 2, desktop: 3 }}>
      {content}
    </ResponsiveGrid>
  </ResponsiveContainer>
</MobileLayout>
```

### Performance Mobile

#### Bundle Optimization
- **Conditional Loading**: Componentes mobile vs desktop
- **Lazy Loading**: Componentes pesados carregados sob demanda  
- **Tree Shaking**: Remoção de código não utilizado
- **Code Splitting**: Separação mobile/desktop quando beneficial

#### Runtime Optimization
- **Debounced Resize**: Listeners otimizados para resize/orientation
- **Memoization**: Cálculos de layout memoizados
- **Touch Optimization**: Event listeners otimizados para touch
- **Viewport Management**: Cálculo eficiente de dimensões

#### Memory Management
- **Component Cleanup**: Remoção adequada de listeners
- **State Optimization**: Estado local vs global otimizado
- **Effect Dependencies**: Dependencies arrays otimizadas

## Fluxo de Dados

### Estado Local
- **React Context** - Estado global (auth, user, notifications)
- **React Query** - Cache de dados do servidor
- **useState/useReducer** - Estado local dos componentes
- **Local Storage** - Persistência de preferências

### Estado Servidor (Supabase)
- **Real-time subscriptions** - Atualizações em tempo real
- **RLS policies** - Controle de acesso automático
- **Triggers** - Lógica de negócio no banco

## Autenticação e Autorização

### Fluxo de Auth
1. Login via Supabase Auth (email/password, OAuth)
2. JWT token armazenado automaticamente
3. RLS policies aplicadas automaticamente
4. Context global atualizado com dados do usuário

### Níveis de Permissão
- **Público** - Visualização de biolinks ativos
- **Usuário** - CRUD dos próprios dados
- **Admin** - Gestão completa (futuro)

## Padrões de Design

### Componentes
- **Atomic Design** - Átomos, moléculas, organismos
- **Composition over inheritance** - Props e children
- **Single Responsibility** - Uma responsabilidade por componente

### Hooks
- **Custom hooks** - Lógica reutilizável
- **React Query** - Data fetching
- **Separation of concerns** - UI vs lógica de negócio

### Styling
- **Design System** - Tokens semânticos em CSS
- **Responsive first** - Mobile-first design
- **Theme support** - Light, Dark, Neon

## Performance

### Otimizações Implementadas
- **Code splitting** - Lazy loading de rotas
- **React.memo** - Prevenção de re-renders
- **useMemo/useCallback** - Memoização de valores/funções
- **Image optimization** - Lazy loading de imagens

### Otimizações Futuras
- **React Suspense** - Loading states
- **Service Worker** - Cache offline
- **Bundle analysis** - Redução do tamanho

## Segurança

### Frontend
- **XSS Protection** - Sanitização de inputs
- **CSRF Protection** - Tokens de autenticação
- **Secure routing** - Guards de autenticação

### Backend (Supabase)
- **RLS Policies** - Acesso baseado em usuário
- **Input validation** - Validação no cliente e servidor
- **HTTPS only** - Comunicação criptografada

## Monitoramento

### Desenvolvimento
- **Console logging** - Debug durante desenvolvimento
- **Error boundaries** - Captura de erros React
- **TypeScript** - Type safety

### Produção (Futuro)
- **Error tracking** - Sentry ou similar
- **Analytics** - Plausible ou Google Analytics
- **Performance monitoring** - Web Vitals

## Escalabilidade

### Horizontal
- **Stateless frontend** - Pode ser replicado facilmente
- **CDN ready** - Assets estáticos servidos via CDN
- **Database scaling** - Supabase handles automaticamente

### Vertical
- **Component lazy loading** - Carregamento sob demanda
- **Data pagination** - Carregamento incremental
- **Image optimization** - Múltiplos formatos e tamanhos