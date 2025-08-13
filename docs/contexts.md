# Contexts Documentation

## Visão Geral

O projeto utiliza Context API do React para gerenciar estado global e prover funcionalidades compartilhadas entre componentes.

## Estrutura de Contexts

### AppProviders (`src/contexts/index.tsx`)

Provider principal que combina todos os contexts em uma única árvore de providers.

```tsx
export const AppProviders = ({ children }: { children: React.ReactNode }) => (
  <AuthProvider>
    <UserProvider>
      <NotificationProvider>
        {children}
      </NotificationProvider>
    </UserProvider>
  </AuthProvider>
);
```

## Contexts Implementados

### 1. AuthContext (`src/contexts/AuthContext.tsx`)

**Status**: ✅ Implementado (com mock data)

Gerencia autenticação de usuários, incluindo login, registro, logout e perfil.

**Estado:**
```tsx
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  isFirstLogin: boolean;
}
```

**Métodos:**
- `login(email, password)` - Login do usuário
- `loginWithGoogle()` - Login com Google
- `register(userData)` - Registro de novo usuário
- `logout()` - Logout do usuário
- `updateProfile(data)` - Atualizar perfil
- `deleteAccount()` - Deletar conta
- `changePassword(currentPassword, newPassword)` - Alterar senha
- `refreshUser()` - Atualizar dados do usuário

**Uso:**
```tsx
const { user, isAuthenticated, login, logout } = useAuth();
```

### 2. UserContext (`src/contexts/UserContext.tsx`)

**Status**: ✅ Implementado (com mock data)

Gerencia dados específicos do usuário, estatísticas, preferências e atividades.

**Estado:**
```tsx
interface UserStats {
  totalViews: number;
  totalClicks: number;
  totalLinks: number;
  // ...
}

interface UserPreferences {
  theme: 'light' | 'dark' | 'neon';
  notifications: boolean;
  // ...
}
```

**Métodos:**
- `updatePreferences(prefs)` - Atualizar preferências
- `addActivity(activity)` - Adicionar atividade
- `exportUserData()` - Exportar dados do usuário
- `refreshStats()` - Atualizar estatísticas

**Uso:**
```tsx
const { stats, preferences, updatePreferences } = useUser();
```

### 3. NotificationContext (`src/contexts/NotificationContext.tsx`)

**Status**: ✅ Implementado

Gerencia notificações toast e alertas da aplicação.

**Métodos:**
- `showSuccess(message)` - Mostrar notificação de sucesso
- `showError(message)` - Mostrar notificação de erro
- `showInfo(message)` - Mostrar notificação informativa
- `showWarning(message)` - Mostrar notificação de aviso

**Uso:**
```tsx
const { showSuccess, showError } = useNotification();
```

## Status da Integração Supabase

### AuthContext
- **Mock**: ✅ Completo com dados simulados
- **Supabase**: 🔄 Pendente integração com auth.js
- **Próximos passos**: 
  - Implementar `supabase.auth.signUp()`
  - Implementar `supabase.auth.signInWithPassword()`
  - Configurar RLS policies

### UserContext
- **Mock**: ✅ Completo com localStorage
- **Supabase**: 🔄 Pendente integração com tabelas
- **Próximos passos**:
  - Conectar com tabela `profiles`
  - Implementar real-time subscriptions
  - Migrar preferências para banco

## Padrões e Convenções

### Estrutura de Context
```tsx
// 1. Definir tipos
interface ContextState {}
interface ContextType extends ContextState {
  // métodos
}

// 2. Criar context
const Context = createContext<ContextType | undefined>(undefined);

// 3. Provider component
export const Provider = ({ children }) => {
  // estado e lógica
  return (
    <Context.Provider value={value}>
      {children}
    </Context.Provider>
  );
};

// 4. Hook personalizado
export const useContext = () => {
  const context = useContext(Context);
  if (!context) {
    throw new Error('useContext must be used within Provider');
  }
  return context;
};
```

### Persistência de Dados
- **Local**: `useLocalStorage` para dados temporários
- **Supabase**: Para dados persistentes e sincronizados
- **Estado**: Combinação de estado local e remote

### Error Handling
- Todos os contexts implementam tratamento de erro
- Notificações automáticas via `NotificationContext`
- Fallbacks para estados de loading/error

## Próximas Implementações

### 1. BioLinkContext (Pendente)
Gerenciar biolinks específicos, links e configurações.

### 2. AnalyticsContext (Pendente)
Coletar e processar dados de analytics em tempo real.

### 3. ThemeContext (Já existe como hook)
Migrar `useTheme` para context para melhor controle global.

## Ferramentas de Desenvolvimento

### DevTools
- React DevTools para inspeção de context
- Supabase DevTools para queries
- Custom logs em desenvolvimento

### Testing
- Testes unitários para cada context
- Mocks para integração Supabase
- Testes E2E para fluxos completos