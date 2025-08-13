# Abrev.io 🚀

**A plataforma brasileira definitiva para centralizar todos os seus links.** Crie páginas de biolink com design futurista, encurte URLs com analytics detalhados e receba pagamentos com PIX nativo.

![Abrev.io Hero Section](https://lovable.dev/opengraph-image-p98pqg.png)

---

## ✨ Principais Funcionalidades

-   **📱 Páginas Biolink**: Editor visual *drag-and-drop*, temas modernos e links ilimitados.
-   **🔗 Encurtador de URLs**: Links curtos e personalizados com QR Code integrado.
-   **📊 Analytics Profissional**: Acompanhe cliques, visualizações e performance em tempo real.
-   **💸 PIX Nativo**: Receba doações e pagamentos diretamente no seu biolink.
-   **🤖 IA Integrada**: Sugestões automáticas para otimizar sua bio e links.
-   **🎨 Design Futurista**: Interface com *Glassmorphism*, gradientes neon e animações suaves.
-   **📱 Mobile-First**: Experiência 100% otimizada para dispositivos móveis.

## 🛠️ Tecnologias

-   **Frontend**: React 18 + TypeScript + Vite
-   **Styling**: Tailwind CSS + shadcn/ui
-   **Backend**: Supabase (Autenticação, Banco de Dados PostgreSQL, Storage)
-   **Data Fetching**: TanStack Query (React Query)
-   **Formulários**: React Hook Form + Zod
-   **Ícones**: Lucide React

## 🚀 Início Rápido

1.  **Clone o repositório:**
    ```bash
    git clone https://github.com/seu-usuario/abrev-io.git
    cd abrev-io
    ```

2.  **Instale as dependências (Bun é recomendado):**
    ```bash
    bun install
    ```

3.  **Configure as variáveis de ambiente:**
    -   Copie `.env.example` para `.env` e preencha com suas chaves do Supabase.

4.  **Inicie o servidor de desenvolvimento:**
    ```bash
    bun run dev
    ```

5.  **Acesse a aplicação:**
    -   Abra [http://localhost:8080](http://localhost:8080) no seu navegador.

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   ├── ui/              # Componentes base (shadcn)
│   ├── dashboard/       # Componentes do painel
│   ├── biolink-editor/  # Componentes do editor de biolink
│   └── modals/          # Modais e dialogs
├── pages/               # Páginas da aplicação (rotas)
├── store/               # Estado global e hooks
│   ├── contexts/        # React Context providers
│   └── hooks/           # Hooks customizados
├── integrations/        # Configurações de serviços externos (Supabase)
└── lib/                 # Funções utilitárias e helpers
```

## 📈 Status do Projeto

**Em Desenvolvimento Ativo.** O frontend está completo e funcional com dados simulados. A integração com o backend Supabase está em andamento.

## 📄 Documentação

Para uma visão detalhada da arquitetura, componentes e guias de desenvolvimento, consulte a [documentação completa](./docs/README.md).

## 📝 Licença

Este projeto está sob a licença MIT.

---

**Abrev.io** - Conecte. Personalize. Monetize.