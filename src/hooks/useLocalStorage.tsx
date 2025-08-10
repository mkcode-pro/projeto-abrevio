import { useState, useCallback, useEffect } from "react";

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void, () => void] {
  // Função para ler do localStorage
  const readValue = useCallback((): T => {
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Erro ao ler localStorage key "${key}":`, error);
      return initialValue;
    }
  }, [initialValue, key]);

  // Estado com valor inicial do localStorage
  const [storedValue, setStoredValue] = useState<T>(readValue);

  // Função para escrever no localStorage
  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        // Permite que value seja uma função como setState
        const valueToStore = value instanceof Function ? value(storedValue) : value;
        
        // Salva no state
        setStoredValue(valueToStore);
        
        // Salva no localStorage
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        }
      } catch (error) {
        console.warn(`Erro ao salvar no localStorage key "${key}":`, error);
      }
    },
    [key, storedValue]
  );

  // Função para remover do localStorage
  const removeValue = useCallback(() => {
    try {
      setStoredValue(initialValue);
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key);
      }
    } catch (error) {
      console.warn(`Erro ao remover localStorage key "${key}":`, error);
    }
  }, [initialValue, key]);

  // Atualiza o estado se o localStorage mudar externamente
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        try {
          setStoredValue(JSON.parse(e.newValue));
        } catch (error) {
          console.warn(`Erro ao sincronizar localStorage key "${key}":`, error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key]);

  return [storedValue, setValue, removeValue];
}

// Hook especializado para configurações do usuário
export function useUserPreferences() {
  const [preferences, setPreferences, clearPreferences] = useLocalStorage('abrev-user-preferences', {
    theme: 'dark' as 'light' | 'dark' | 'neon',
    language: 'pt-BR',
    analyticsFrequency: 'daily' as 'daily' | 'weekly' | 'monthly',
    notifications: {
      email: true,
      browser: true,
      marketing: false
    },
    dashboard: {
      compactMode: false,
      showAnalytics: true,
      defaultView: 'biolink' as 'biolink' | 'urls' | 'analytics'
    }
  });

  const updatePreference = useCallback((
    key: string, 
    value: any
  ) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }));
  }, [setPreferences]);

  const updateNestedPreference = useCallback((
    category: string,
    key: string, 
    value: any
  ) => {
    setPreferences(prev => ({
      ...prev,
      [category]: {
        ...(prev[category as keyof typeof prev] as object),
        [key]: value
      }
    }));
  }, [setPreferences]);

  return {
    preferences,
    updatePreference,
    updateNestedPreference,
    clearPreferences
  };
}

// Hook para cache de dados temporários
export function useSessionCache<T>(key: string, initialValue: T) {
  const sessionKey = `abrev-session-${key}`;
  
  const [cachedData, setCachedData, clearCache] = useLocalStorage(sessionKey, {
    data: initialValue,
    timestamp: Date.now(),
    expiresIn: 1000 * 60 * 30 // 30 minutos
  });

  const isExpired = useCallback(() => {
    return Date.now() > (cachedData.timestamp + cachedData.expiresIn);
  }, [cachedData]);

  const setCache = useCallback((
    data: T, 
    expiresIn: number = 1000 * 60 * 30
  ) => {
    setCachedData({
      data,
      timestamp: Date.now(),
      expiresIn
    });
  }, [setCachedData]);

  const getCache = useCallback((): T | null => {
    if (isExpired()) {
      clearCache();
      return null;
    }
    return cachedData.data;
  }, [cachedData.data, isExpired, clearCache]);

  return {
    setCache,
    getCache,
    clearCache,
    isExpired: isExpired()
  };
}