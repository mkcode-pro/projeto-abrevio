# Setup e Configuração

## 🚀 Instalação

### Pré-requisitos

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **npm** ou **yarn** (incluído com Node.js)
- **Git** ([Download](https://git-scm.com/))

### Clone e Instalação

1. **Clone o repositório**
```bash
git clone <YOUR_GIT_URL>
cd abrev-io
```

2. **Instale as dependências**
```bash
npm install
# ou
yarn install
```

3. **Configure as variáveis de ambiente**
```bash
cp .env.example .env.local
```

4. **Execute o projeto**
```bash
npm run dev
# ou
yarn dev
```

5. **Acesse no navegador**
```
http://localhost:5173
```

## 📁 Estrutura do Projeto

```
abrev-io/
├── docs/                   # Documentação (esta pasta)
├── public/                 # Assets estáticos
├── src/
│   ├── components/         # Componentes React
│   │   ├── ui/            # Componentes base (shadcn/ui)
│   │   ├── dashboard/     # Componentes do dashboard
│   │   ├── biolink-editor/ # Editor de biolink
│   │   └── modals/        # Modais e dialogs
│   ├── pages/             # Páginas da aplicação
│   ├── hooks/             # Hooks customizados
│   ├── contexts/          # Context providers
│   ├── lib/               # Utilitários
│   ├── integrations/      # Integrações externas
│   └── assets/           # Assets (imagens, etc)
├── supabase/              # Configuração Supabase
│   ├── migrations/        # Database migrations
│   └── config.toml       # Configuração do projeto
├── tailwind.config.ts     # Configuração do Tailwind
├── vite.config.ts         # Configuração do Vite
└── package.json           # Dependências e scripts
```

## ⚙️ Configuração de Desenvolvimento

### Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev              # Inicia servidor de desenvolvimento
npm run build           # Build para produção
npm run preview         # Preview do build de produção
npm run lint            # Executar linting
npm run type-check      # Verificar tipos TypeScript

# Supabase (quando configurado)
npx supabase start      # Iniciar Supabase local
npx supabase db reset   # Reset database local
npx supabase gen types  # Gerar tipos TypeScript
```

### Configuração do Editor

#### VS Code
Instale as extensões recomendadas:

```json
// .vscode/extensions.json
{
  "recommendations": [
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-typescript-next",
    "ms-vscode.vscode-eslint"
  ]
}
```

#### Configurações recomendadas:
```json
// .vscode/settings.json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "tailwindCSS.experimental.classRegex": [
    ["cva\\(([^)]*)\\)", "[\"'`]([^\"'`]*).*?[\"'`]"]
  ]
}
```

### Git Hooks

Configure hooks para manter qualidade do código:

```bash
# Instalar husky (se não estiver instalado)
npm install --save-dev husky lint-staged

# Configurar pre-commit hook
npx husky add .husky/pre-commit "npx lint-staged"
```

```json
// package.json
{
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ],
    "*.{json,css,md}": [
      "prettier --write"
    ]
  }
}
```

## 🗄️ Configuração do Supabase

### Supabase Local (Desenvolvimento)

1. **Instalar Supabase CLI**
```bash
npm install -g @supabase/cli
```

2. **Fazer login no Supabase**
```bash
npx supabase login
```

3. **Inicializar projeto local**
```bash
npx supabase init
```

4. **Iniciar serviços locais**
```bash
npx supabase start
```

5. **Aplicar migrations**
```bash
npx supabase db reset
```

### Configuração de Produção

1. **Criar projeto no Supabase**
   - Acesse [supabase.com](https://supabase.com)
   - Crie um novo projeto
   - Anote a URL e anon key

2. **Configurar variáveis de ambiente**
```bash
# .env.local
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

3. **Linkar projeto local com produção**
```bash
npx supabase link --project-ref your-project-ref
```

4. **Deploy das migrations**
```bash
npx supabase db push
```

## 🎨 Configuração do Design System

### Tailwind CSS

O projeto usa um design system customizado baseado em Tailwind CSS:

```typescript
// tailwind.config.ts
export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        'neon-blue': '#00B8FF',
        // ... outras cores customizadas
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        // ... outras animações
      }
    }
  },
  plugins: [require("tailwindcss-animate")]
}
```

### CSS Variables

O sistema de cores é baseado em CSS variables para suporte a temas:

```css
/* src/index.css */
:root {
  --primary: 210 100% 56%;
  --primary-foreground: 0 0% 98%;
  --neon-blue: 195 100% 50%;
  /* ... outras variáveis */
}

.dark {
  --primary: 210 100% 56%;
  --primary-foreground: 0 0% 98%;
  /* ... sobrescritas para tema escuro */
}
```

## 🔧 Ferramentas de Desenvolvimento

### TypeScript

Configuração TypeScript para máxima type safety:

```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "exactOptionalPropertyTypes": true
  }
}
```

### ESLint + Prettier

Configuração para manter consistência de código:

```json
// .eslintrc.json
{
  "extends": [
    "@typescript-eslint/recommended",
    "plugin:react-hooks/recommended"
  ],
  "rules": {
    "@typescript-eslint/no-unused-vars": "error",
    "react-hooks/exhaustive-deps": "warn"
  }
}
```

## 🧪 Configuração de Testes

### Vitest + Testing Library

```bash
# Instalar dependências de teste
npm install --save-dev vitest @testing-library/react @testing-library/jest-dom
```

```typescript
// vite.config.ts
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts'
  }
})
```

```typescript
// src/test/setup.ts
import '@testing-library/jest-dom'
```

### Scripts de Teste

```json
// package.json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage"
  }
}
```

## 🚀 Deploy

### Vercel (Recomendado)

1. **Conectar repositório**
   - Acesse [vercel.com](https://vercel.com)
   - Importe seu repositório GitHub

2. **Configurar variáveis de ambiente**
   - Adicione as variáveis do Supabase no dashboard

3. **Deploy automático**
   - Cada push para `main` fará deploy automático

### Netlify

1. **Build settings**
```bash
# Build command
npm run build

# Publish directory
dist
```

2. **Redirects**
```bash
# public/_redirects
/*    /index.html   200
```

### Docker (Opcional)

```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000
CMD ["npm", "run", "preview"]
```

## 🔍 Troubleshooting

### Problemas Comuns

#### 1. Erro de módulos não encontrados
```bash
# Limpar cache e reinstalar
rm -rf node_modules package-lock.json
npm install
```

#### 2. Problemas com Tailwind CSS
```bash
# Verificar se o Tailwind está carregando as classes
npx tailwindcss -i ./src/index.css -o ./dist/output.css --watch
```

#### 3. Erro de tipos TypeScript
```bash
# Gerar tipos do Supabase
npx supabase gen types typescript --local > src/integrations/supabase/types.ts
```

#### 4. Problemas de hot reload
```bash
# Verificar configuração do Vite
# Às vezes precisa reiniciar o servidor
npm run dev
```

### Logs e Debug

#### Desenvolvimento
```typescript
// Usar console.log apenas em desenvolvimento
if (import.meta.env.DEV) {
  console.log('Debug info:', data)
}
```

#### Produção
```typescript
// Usar error tracking service
try {
  // código que pode falhar
} catch (error) {
  console.error('Production error:', error)
  // Enviar para Sentry ou similar
}
```

## 📚 Próximos Passos

Após a configuração inicial:

1. **Leia a documentação** em `docs/`
2. **Configure o Supabase** seguindo `docs/integration.md`
3. **Entenda a arquitetura** em `docs/architecture.md`
4. **Explore os componentes** em `docs/components.md`
5. **Consulte o roadmap** em `docs/roadmap.md`