# AI Development Rules for Abrev.io

This document provides essential rules and guidelines for AI-powered development on the Abrev.io project. Adhering to these rules ensures consistency, maintainability, and quality.

## 🚀 Core Tech Stack

This project is built on a modern, performant, and type-safe stack. Key technologies include:

-   **Framework**: React 18 with TypeScript, powered by Vite for a fast development experience.
-   **Backend as a Service (BaaS)**: Supabase for the PostgreSQL database, authentication, and storage.
-   **Styling**: Tailwind CSS for utility-first styling, combined with `shadcn/ui` for the component library.
-   **Routing**: React Router DOM for all client-side navigation.
-   **Data Fetching & Caching**: TanStack Query (React Query) for managing server state.
-   **Global UI State**: React Context API for shared state like theme and user session.
-   **Forms**: React Hook Form for form logic and Zod for schema validation.
-   **Icons**: Lucide React for a consistent and clean icon set.
-   **Drag and Drop**: Dnd Kit for all drag-and-drop interfaces.

## 🛠️ Library Usage Rules

To maintain consistency, specific libraries MUST be used for designated tasks. Do not introduce new libraries for these purposes without explicit instruction.

### UI & Styling

-   **Component Library**: **ALWAYS** use components from `shadcn/ui` (`@/components/ui`). Do not create custom components if a `shadcn/ui` equivalent exists.
-   **Styling**: **ONLY** use Tailwind CSS utility classes. Adhere to the design tokens (colors, fonts, spacing) defined in `tailwind.config.ts` and `src/index.css`. Avoid writing custom CSS files.
-   **Icons**: **EXCLUSIVELY** use icons from the `lucide-react` package.

### State Management

-   **Server State**: For any data fetching, caching, or mutation related to the Supabase backend, you **MUST** use TanStack Query (`@tanstack/react-query`).
-   **Global UI State**: For application-wide state that is not server data (e.g., authentication status, theme), use the React Context providers located in `src/contexts/`.
-   **Local Component State**: Use React's built-in `useState` and `useReducer` hooks for state that is confined to a single component.

### Forms

-   **All forms MUST** be built using `react-hook-form` for handling state and submissions.
-   **All form validation MUST** be implemented using `zod` schemas.

### Functionality

-   **Routing**: Use `react-router-dom` for all page navigation. Define routes in `src/App.tsx`.
-   **Notifications**: Use `sonner` for all toast notifications. It is already configured in `App.tsx`.
-   **Charts**: For any data visualization or charts, **MUST** use the `recharts` library.
-   **Drag and Drop**: For reordering lists or other drag-and-drop features, **MUST** use `@dnd-kit`.
-   **Backend Interaction**: All communication with the database or authentication **MUST** use the pre-configured Supabase client instance from `src/integrations/supabase/client.ts`.