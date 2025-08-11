import { ReactNode } from 'react';
import { AuthProvider } from './AuthContext';
import { UserProvider } from './UserContext';  
import { NotificationProvider } from './NotificationContext';
import { ThemeProvider } from '../hooks/useTheme';

// Re-export individual contexts
export { useAuth } from './AuthContext';
export { useUser } from './UserContext';  
export { useNotifications } from './NotificationContext';
export { useTheme } from '../hooks/useTheme';

// Provider combinado para facilitar setup da aplicação
export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <UserProvider>
          <NotificationProvider>
            {children}
          </NotificationProvider>
        </UserProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}