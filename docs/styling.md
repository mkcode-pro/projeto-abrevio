# Design System & Styling Guide

## Visão Geral

O Abrev.io utiliza um design system moderno baseado em Tailwind CSS com elementos futuristas, glassmorphism e gradientes neon para criar uma experiência visual única e profissional.

## Filosofia de Design

### Identidade Visual
- **Estilo**: Futurista, tecnológico, clean, moderno
- **Elementos**: Glassmorphism, sombras suaves, bordas arredondadas
- **Animações**: Microinterações suaves, hover effects, transições fluidas
- **Tipografia**: Sans-serif premium (Inter, Poppins, Montserrat)

### Princípios
1. **Mobile-First**: Todas as interfaces priorizam a experiência móvel
2. **Acessibilidade**: Contraste adequado e navegação por teclado
3. **Consistência**: Reutilização de tokens e componentes
4. **Performance**: CSS otimizado e carregamento eficiente

## Sistema de Cores

### Paleta Principal (HSL)
```css
:root {
  /* Core Colors */
  --background: 216 24% 12%;        /* Cinza escuro principal */
  --foreground: 210 40% 98%;        /* Texto claro */
  
  /* Brand Colors */
  --primary: 199 100% 50%;          /* Neon Blue #00B8FF */
  --neon-blue: 199 100% 50%;        /* Azul neon principal */
  --neon-purple: 270 100% 70%;      /* Violeta neon */
  
  /* Neutral Colors */
  --card: 216 24% 15%;              /* Fundo de cards */
  --border: 216 24% 20%;            /* Bordas */
  --muted: 216 24% 16%;             /* Elementos secundários */
}
```

### Uso das Cores
```tsx
// ✅ CORRETO - Usar tokens semânticos
<div className="bg-card text-foreground border-border">

// ❌ EVITAR - Cores hardcoded
<div className="bg-gray-900 text-white border-gray-700">
```

## Gradientes

### Gradientes Definidos
```css
/* Gradiente principal da marca */
--gradient-neon: linear-gradient(135deg, hsl(199 100% 50%), hsl(270 100% 70%));

/* Gradiente do hero */
--gradient-hero: linear-gradient(135deg, hsl(216 24% 12%) 0%, hsl(199 100% 50% / 0.1) 50%, hsl(270 100% 70% / 0.1) 100%);

/* Gradiente sutil para cards */
--gradient-card: linear-gradient(145deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02));
```

### Classes Utilitárias
```css
.bg-gradient-neon { background: var(--gradient-neon); }
.bg-gradient-hero { background: var(--gradient-hero); }
.text-gradient-neon { 
  background: var(--gradient-neon);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
```

## Glassmorphism

### Classes Base
```css
.glass {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px rgba(0, 184, 255, 0.1);
}

.glass-card {
  @apply glass rounded-2xl;
}
```

### Variações
- `.glass-strong` - Mais opaco (background: rgba(255, 255, 255, 0.1))
- `.glass-subtle` - Mais transparente (background: rgba(255, 255, 255, 0.02))
- `.glass-neon` - Com borda neon

## Efeitos Visuais

### Neon Glow
```css
.neon-glow {
  box-shadow: 0 0 20px hsl(var(--neon-blue) / 0.5),
              0 0 40px hsl(var(--neon-blue) / 0.3),
              0 0 60px hsl(var(--neon-blue) / 0.1);
}

.neon-text {
  text-shadow: 0 0 10px hsl(var(--neon-blue) / 0.8),
               0 0 20px hsl(var(--neon-blue) / 0.6),
               0 0 30px hsl(var(--neon-blue) / 0.4);
}
```

### Sombras
```css
/* Sombras elegantes */
--shadow-elegant: 0 20px 60px -10px hsl(199 100% 50% / 0.2);
--shadow-glass: 0 8px 32px rgba(31, 38, 135, 0.37);
--shadow-neon: 0 0 50px hsl(199 100% 50% / 0.3);
```

## Animações

### Transições
```css
--transition-smooth: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
--transition-fast: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
```

### Animações Definidas
```css
/* Flutuação sutil */
.float {
  animation: float 6s ease-in-out infinite;
}

/* Pulse neon */
.pulse-neon {
  animation: pulse-neon 2s ease-in-out infinite;
}

/* Slide up para biolinks */
.animate-slide-up {
  animation: slideUp 0.6s ease-out forwards;
}

/* Grid animado */
.grid-pattern {
  animation: grid-move 20s ease-in-out infinite;
}
```

## Tipografia

### Hierarquia
```tsx
// Títulos principais
<h1 className="text-3xl md:text-5xl lg:text-6xl font-bold font-poppins">

// Subtítulos
<h2 className="text-2xl md:text-3xl font-semibold font-inter">

// Texto corpo
<p className="text-base md:text-lg text-foreground/70">

// Texto pequeno
<span className="text-sm text-muted-foreground">
```

### Fontes
- **Primary**: Inter (texto geral)
- **Headings**: Poppins (títulos importantes)
- **Accent**: Montserrat (elementos especiais)

## Componentes Base

### Buttons
```tsx
// Botão principal
<Button variant="default" className="bg-gradient-neon">

// Botão glassmorphism
<Button variant="outline" className="glass-card border-white/20">

// Botão com efeito futurista
<Button className="btn-futuristic">
```

### Cards
```tsx
// Card padrão com glass
<Card className="glass-card border-white/10">

// Card com glow neon
<Card className="glass-card neon-glow">
```

### Inputs
```tsx
// Input glassmorphism
<Input className="glass bg-transparent border-white/20 text-white placeholder:text-white/50" />
```

## Responsividade

### Breakpoints Tailwind
- `sm`: 640px
- `md`: 768px  
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

### Padrões Mobile-First
```tsx
// ✅ Sempre mobile-first
<div className="text-sm md:text-base lg:text-lg">

// ✅ Layout responsivo
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
```

## Temas

### Suporte a Temas
- **Light**: Cores claras para uso diurno
- **Dark**: Tema escuro padrão (principal)
- **Neon**: Tema futurista com mais brilho

### Implementação
```tsx
const { theme, setTheme } = useTheme();

// Troca de tema
<Button onClick={() => setTheme('neon')}>
  Tema Neon
</Button>
```

## Convenções

### Classes CSS
- Use `@apply` apenas em casos necessários
- Prefira classes utilitárias do Tailwind
- Mantenha CSS customizado em `@layer components`

### Nomenclatura
- Variáveis CSS em kebab-case: `--neon-blue`
- Classes CSS em kebab-case: `.glass-card`
- Componentes em PascalCase: `GlassCard`

### Performance
- Evite uso excessivo de `backdrop-filter`
- Otimize animações com `transform` e `opacity`
- Use `will-change` apenas quando necessário

## Design System Mobile-First

### Touch Target Optimization

#### Sizing Standards
```css
/* Touch target minimums (based on Apple/Google guidelines) */
--touch-target-sm: 40px;  /* Small, usar apenas quando necessário */
--touch-target-md: 48px;  /* Padrão recomendado */
--touch-target-lg: 56px;  /* Ideal para ações importantes */
```

#### Implementation
```typescript
// Hook para touch targets adaptativos
const { getTouchTargetSize } = useMobileOptimized()

// Sizes automáticos por contexto
<Button className={getTouchTargetSize('md')}>
  {/* 48px de altura garantidos no mobile */}
</Button>
```

### Layout Mobile

#### Safe Areas
```css
/* Support para notches e safe areas */
.safe-top {
  padding-top: env(safe-area-inset-top);
}

.safe-bottom {
  padding-bottom: env(safe-area-inset-bottom);
}

/* Mobile layout containers */
.mobile-container {
  min-height: 100dvh; /* Dynamic viewport height */
  padding: env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left);
}
```

#### Viewport Handling
```css
/* Real viewport height (sem teclado virtual) */
.full-height-mobile {
  height: 100vh;
  height: 100dvh; /* Dynamic viewport height */
}

/* Container que adapta ao teclado */
.keyboard-aware {
  height: calc(100vh - env(keyboard-inset-height, 0px));
}
```

### Interaction States Mobile

#### Touch Feedback
```css
/* Active states para touch */
.touch-feedback {
  transition: transform 0.1s ease-out;
}

.touch-feedback:active {
  transform: scale(0.98);
}

/* Ripple effect (futuro) */
.ripple-effect {
  position: relative;
  overflow: hidden;
}
```

#### Hover States Condicionais
```css
/* Hover apenas em dispositivos que suportam */
@media (hover: hover) {
  .conditional-hover:hover {
    background-color: rgba(255, 255, 255, 0.1);
    transform: translateY(-2px);
  }
}

/* Estados alternativos para touch */
@media (hover: none) {
  .conditional-hover:active {
    background-color: rgba(255, 255, 255, 0.05);
  }
}
```

### Mobile Components

#### Action Sheets
```css
/* Native-like action sheets */
.action-sheet {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: var(--glass);
  backdrop-filter: blur(20px);
  border-radius: 1rem 1rem 0 0;
  transform: translateY(100%);
  transition: transform 0.3s cubic-bezier(0.23, 1, 0.32, 1);
}

.action-sheet.open {
  transform: translateY(0);
}
```

#### Mobile Headers
```css
/* Fixed headers com backdrop */
.mobile-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 50;
  background: rgba(33, 41, 54, 0.8);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding: env(safe-area-inset-top) 1rem 1rem 1rem;
}
```

#### Tab Navigation
```css
/* Mobile-optimized tabs */
.mobile-tabs {
  display: flex;
  background: var(--glass);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  position: sticky;
  top: 0;
  z-index: 40;
}

.mobile-tab {
  flex: 1;
  padding: 1rem;
  text-align: center;
  min-height: var(--touch-target-md);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.mobile-tab.active {
  color: var(--neon-blue);
  border-bottom: 2px solid var(--neon-blue);
}
```

### Performance Mobile

#### Optimized Animations
```css
/* Prefer transform/opacity for 60fps */
.smooth-animation {
  transform: translateZ(0); /* Force hardware acceleration */
  will-change: transform;
}

/* Reduce motion support */
@media (prefers-reduced-motion: reduce) {
  .smooth-animation {
    animation: none;
    transition: none;
  }
}
```

#### Loading States
```css
/* Mobile-optimized skeletons */
.skeleton-mobile {
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0.05) 25%,
    rgba(255, 255, 255, 0.1) 50%,
    rgba(255, 255, 255, 0.05) 75%
  );
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s infinite;
}

@keyframes skeleton-loading {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
```

### Accessibility Mobile

#### Touch-Friendly Focus
```css
/* Focus states visíveis para teclado */
.focus-visible:focus-visible {
  outline: 2px solid var(--neon-blue);
  outline-offset: 2px;
}

/* Remover outline no touch */
.focus-visible:focus:not(:focus-visible) {
  outline: none;
}
```

#### Text Sizing
```css
/* Tamanhos de texto legíveis no mobile */
.text-mobile-sm { font-size: 0.875rem; line-height: 1.25rem; }
.text-mobile-base { font-size: 1rem; line-height: 1.5rem; }
.text-mobile-lg { font-size: 1.125rem; line-height: 1.75rem; }

/* Não permitir texto menor que 16px no iOS */
.input-mobile {
  font-size: max(16px, 1rem);
}
```

### Responsive Utilities

#### Breakpoint-Specific Classes
```css
/* Mobile-only utilities */
@media (max-width: 767px) {
  .mobile-only { display: block; }
  .desktop-only { display: none; }
}

/* Desktop-only utilities */
@media (min-width: 768px) {
  .mobile-only { display: none; }
  .desktop-only { display: block; }
}
```

#### Orientation Utilities
```css
/* Landscape mobile utilities */
@media (max-width: 1024px) and (orientation: landscape) {
  .landscape-mobile\:hidden { display: none; }
  .landscape-mobile\:h-screen { height: 100vh; }
}

/* Portrait utilities */
@media (orientation: portrait) {
  .portrait\:flex-col { flex-direction: column; }
}
```

## Ferramentas

### Desenvolvimento
- **Tailwind IntelliSense**: Autocomplete de classes
- **PostCSS**: Processamento de CSS
- **PurgeCSS**: Remoção de CSS não utilizado (via Tailwind)
- **Mobile DevTools**: Chrome DevTools device simulation
- **Real Device Testing**: Testes em dispositivos reais

### Design Tokens
Todos os tokens estão centralizados em `src/index.css` para fácil manutenção e consistência global, com extensões específicas para mobile.

### Performance Monitoring
- **Core Web Vitals**: Métricas de performance mobile
- **Touch Latency**: Medição de responsividade touch
- **Animation FPS**: Monitoramento de fluidez das animações