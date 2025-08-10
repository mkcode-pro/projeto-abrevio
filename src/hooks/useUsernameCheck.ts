import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useDebounce } from '@/hooks/useDebounce';

type UsernameStatus = 'idle' | 'checking' | 'available' | 'taken' | 'error';

interface UsernameCheckResult {
  status: UsernameStatus;
  error: string | null;
  suggestions: string[];
  isValid: boolean;
}

interface CacheEntry {
  status: UsernameStatus;
  timestamp: number;
  suggestions: string[];
}

// Cache em memória para verificações
const usernameCache = new Map<string, CacheEntry>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

// Palavras reservadas que não podem ser usadas
const RESERVED_USERNAMES = [
  'admin', 'root', 'api', 'app', 'www', 'mail', 'ftp', 
  'blog', 'shop', 'help', 'support', 'info', 'news',
  'about', 'contact', 'privacy', 'terms', 'login', 'signup',
  'dashboard', 'settings', 'profile', 'account', 'user'
];

export function useUsernameCheck(username: string, currentUsername?: string) {
  const [result, setResult] = useState<UsernameCheckResult>({
    status: 'idle',
    error: null,
    suggestions: [],
    isValid: false
  });
  
  const debouncedUsername = useDebounce(username, 300);
  const retryCount = useRef(0);
  const maxRetries = 3;

  // Validação local do username
  const validateUsername = useCallback((name: string): { valid: boolean; error?: string } => {
    if (!name || name.length < 3) {
      return { valid: false, error: 'Username deve ter pelo menos 3 caracteres' };
    }
    
    if (name.length > 30) {
      return { valid: false, error: 'Username não pode ter mais de 30 caracteres' };
    }
    
    if (!/^[a-z0-9_.]+$/.test(name)) {
      return { valid: false, error: "Use apenas letras minúsculas, números, '.' ou '_'" };
    }
    
    if (name.startsWith('.') || name.startsWith('_') || name.endsWith('.') || name.endsWith('_')) {
      return { valid: false, error: 'Username não pode começar ou terminar com . ou _' };
    }
    
    if (/[._]{2,}/.test(name)) {
      return { valid: false, error: 'Username não pode ter . ou _ consecutivos' };
    }
    
    if (RESERVED_USERNAMES.includes(name.toLowerCase())) {
      return { valid: false, error: 'Este username é reservado pelo sistema' };
    }
    
    return { valid: true };
  }, []);

  // Gerar sugestões de username
  const generateSuggestions = useCallback((baseUsername: string): string[] => {
    const suggestions: string[] = [];
    const cleanBase = baseUsername.replace(/[^a-z0-9]/g, '').slice(0, 20);
    
    if (!cleanBase) return [];
    
    // Adicionar números
    suggestions.push(`${cleanBase}${Math.floor(Math.random() * 999) + 1}`);
    suggestions.push(`${cleanBase}_${new Date().getFullYear()}`);
    
    // Adicionar variações
    suggestions.push(`${cleanBase}.oficial`);
    suggestions.push(`the.${cleanBase}`);
    suggestions.push(`${cleanBase}_br`);
    
    // Filtrar sugestões válidas
    return suggestions
      .filter(s => validateUsername(s).valid)
      .slice(0, 3);
  }, [validateUsername]);

  // Verificar no cache primeiro
  const checkCache = useCallback((name: string): CacheEntry | null => {
    const cached = usernameCache.get(name.toLowerCase());
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached;
    }
    if (cached) {
      usernameCache.delete(name.toLowerCase());
    }
    return null;
  }, []);

  // Salvar no cache
  const saveToCache = useCallback((name: string, status: UsernameStatus, suggestions: string[] = []) => {
    usernameCache.set(name.toLowerCase(), {
      status,
      timestamp: Date.now(),
      suggestions
    });
  }, []);

  // Verificar username via RPC com retry
  const checkUsernameRPC = useCallback(async (name: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.rpc('username_exists', { p_username: name });
      
      if (error) {
        throw error;
      }
      
      retryCount.current = 0;
      return data as boolean;
    } catch (error) {
      console.error(`Erro ao verificar username (tentativa ${retryCount.current + 1}):`, error);
      
      if (retryCount.current < maxRetries) {
        retryCount.current++;
        // Espera exponencial: 1s, 2s, 4s
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, retryCount.current - 1) * 1000));
        return checkUsernameRPC(name);
      }
      
      throw error;
    }
  }, []);

  // Fallback: verificar via query direta
  const checkUsernameDirectQuery = useCallback(async (name: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('username')
        .ilike('username', name)
        .maybeSingle();
      
      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        throw error;
      }
      
      return !!data;
    } catch (error) {
      console.error('Erro no fallback de verificação:', error);
      throw error;
    }
  }, []);

  // Função principal de verificação
  const checkUsername = useCallback(async () => {
    if (!debouncedUsername || debouncedUsername.length < 3) {
      setResult({
        status: 'idle',
        error: null,
        suggestions: [],
        isValid: false
      });
      return;
    }

    // Se é o mesmo username atual, está disponível
    if (currentUsername && debouncedUsername.toLowerCase() === currentUsername.toLowerCase()) {
      setResult({
        status: 'available',
        error: null,
        suggestions: [],
        isValid: true
      });
      return;
    }

    // Validação local primeiro
    const validation = validateUsername(debouncedUsername);
    if (!validation.valid) {
      setResult({
        status: 'error',
        error: validation.error || 'Username inválido',
        suggestions: generateSuggestions(debouncedUsername),
        isValid: false
      });
      return;
    }

    // Verificar cache
    const cached = checkCache(debouncedUsername);
    if (cached) {
      setResult({
        status: cached.status,
        error: null,
        suggestions: cached.suggestions,
        isValid: cached.status === 'available'
      });
      return;
    }

    // Iniciar verificação
    setResult(prev => ({
      ...prev,
      status: 'checking',
      error: null
    }));

    try {
      let exists = false;
      
      // Tentar RPC primeiro
      try {
        exists = await checkUsernameRPC(debouncedUsername);
      } catch (rpcError) {
        console.warn('RPC falhou, tentando query direta:', rpcError);
        // Fallback para query direta
        exists = await checkUsernameDirectQuery(debouncedUsername);
      }

      const status: UsernameStatus = exists ? 'taken' : 'available';
      const suggestions = exists ? generateSuggestions(debouncedUsername) : [];
      
      // Salvar no cache
      saveToCache(debouncedUsername, status, suggestions);
      
      setResult({
        status,
        error: exists ? 'Este username já está em uso' : null,
        suggestions,
        isValid: !exists
      });
    } catch (error) {
      console.error('Erro ao verificar username:', error);
      setResult({
        status: 'error',
        error: 'Não foi possível verificar o username. Tente novamente.',
        suggestions: [],
        isValid: false
      });
    }
  }, [debouncedUsername, currentUsername, validateUsername, generateSuggestions, checkCache, checkUsernameRPC, checkUsernameDirectQuery, saveToCache]);

  useEffect(() => {
    checkUsername();
  }, [checkUsername]);

  return result;
}

// Hook para limpar o cache (útil após registro bem-sucedido)
export function useClearUsernameCache() {
  return useCallback((username?: string) => {
    if (username) {
      usernameCache.delete(username.toLowerCase());
    } else {
      usernameCache.clear();
    }
  }, []);
}