# Abrev.io - Biolink & Encurtador de URL

![Abrev.io](https://lovable.dev/opengraph-image-p98pqg.png)

**Abrev.io** é uma plataforma SaaS moderna, construída no Brasil, para criar páginas de biolink personalizadas e encurtar URLs. A ferramenta é focada em design, performance e uma experiência de usuário mobile-first.

> **Status do Projeto:** Em desenvolvimento ativo.

## ✨ Funcionalidades Principais

-   **📱 Editor de Biolink Visual**: Crie e personalize sua página de links com um editor drag-and-drop intuitivo.
-   **🎨 Temas e Customização**: Escolha entre temas pré-definidos ou crie o seu, com total controle sobre cores e aparência.
-   **🔗 Encurtador de URLs Inteligente**: Crie links curtos com códigos personalizados e QR Codes.
-   **📊 Analytics Detalhado**: Monitore visualizações, cliques e a performance de cada link em tempo real.
-   **💸 Integração PIX Nativa**: Adicione um link de PIX para receber doações ou pagamentos diretamente na sua página.
-   **🤖 Assistente com IA**: Receba sugestões para otimizar sua bio, títulos de links e mais.

## 🛠️ Tecnologias Utilizadas

-   **Framework**: React 18 + TypeScript + Vite
-   **Backend & DB**: Supabase (PostgreSQL, Auth, Storage)
-   **Estilização**: Tailwind CSS + shadcn/ui
-   **Estado da UI**: React Context
-   **Estado do Servidor**: TanStack Query (React Query)
-   **Formulários**: React Hook Form + Zod
-   **Roteamento**: React Router DOM
-   **Ícones**: Lucide React

## 🚀 Como Executar o Projeto Localmente

Para rodar o Abrev.io na sua máquina, siga os passos abaixo.

### Pré-requisitos

-   Node.js (versão 18 ou superior)
-   Bun (ou npm/yarn)
-   Uma conta no [Supabase](https://supabase.com/)

### Instalação

1.  **Clone o repositório:**
    ```bash
    git clone https://github.com/seu-usuario/abrev-io.git
    cd abrev-io
    ```

2.  **Instale as dependências:**
    ```bash
    bun install
    ```

3.  **Configure as variáveis de ambiente:**
    -   Renomeie o arquivo `.env.example` para `.env`.
    -   Adicione suas chaves do Supabase (URL e Anon Key) no arquivo `.env`. Você pode encontrá-las no painel do seu projeto Supabase em `Project Settings > API`.
    ```env
    VITE_SUPABASE_URL=SUA_URL_SUPABASE
    VITE_SUPABASE_ANON_KEY=SUA_CHAVE_ANON_SUPABASE
    ```

### Executando a Aplicação

Com tudo configurado, inicie o servidor de desenvolvimento:

```bash
bun run dev
```

A aplicação estará disponível em `http://localhost:8080`.

## 📁 Estrutura do Projeto

A estrutura de pastas foi organizada para ser escalável e de fácil manutenção.

```
src/
├── components/       # Componentes reutilizáveis (UI, layout, etc.)
├── config/           # Configurações de ambiente
├── integrations/     # Clientes de serviços externos (Supabase)
├── lib/              # Funções utilitárias e helpers
├── pages/            # Componentes de página (rotas)
├── store/            # Lógica de estado global (Contexts e Hooks)
│   ├── contexts/
│   └── hooks/
└── types/            # Definições de tipos globais
```

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

---

Feito com ❤️ no Brasil.