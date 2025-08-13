# Abrev.io

## 🚀 SaaS brasileiro para biolinks e URLs encurtadas

Plataforma completa para centralizar todos os seus links em uma página visual moderna, com encurtador de URLs integrado e analytics detalhado.

### ✨ Principais Funcionalidades

- **📱 Páginas Biolink**: Editor visual drag-and-drop, temas modernos, links ilimitados
- **🔗 Encurtador de URLs**: Links personalizados, dashboard de gerenciamento, estatísticas detalhadas  
- **📊 Analytics**: Acompanhe cliques, visualizações e performance dos links
- **🎨 Design Futurista**: Glassmorphism, gradientes neon, animações suaves
- **📱 Mobile-First**: Interface otimizada para dispositivos móveis

### 🛠 Tecnologias

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + shadcn/ui + Glassmorphism
- **Backend**: Supabase (autenticação, banco de dados, storage)
- **Ícones**: Lucide React
- **Formulários**: React Hook Form + Zod

### 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes UI e de funcionalidades
├── pages/              # Páginas da aplicação
├── hooks/              # Hooks customizados
├── contexts/           # Context providers
├── integrations/       # Configurações externas (Supabase)
└── lib/               # Utilitários e helpers
```

### 🎯 Páginas Principais

- `/` - Homepage com apresentação da plataforma
- `/dashboard` - Painel principal do usuário
- `/dashboard/editor` - Editor de biolink
- `/dashboard/analytics` - Estatísticas e relatórios
- `/dashboard/settings` - Configurações da conta
- `/bio/:username` - Página pública do biolink

### 📝 Licença

MIT License

---

**Abrev.io** - Conecte. Personalize. Monetize.