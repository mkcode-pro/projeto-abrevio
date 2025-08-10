# Hooks Customizados

## 🎣 Visão Geral

Os hooks customizados do Abrev.io encapsulam lógica complexa de estado, data fetching e interações com APIs, proporcionando uma interface limpa e reutilizável para os componentes.

## Data Management Hooks

### useBioLink.tsx

**Localização**: `hooks/useBioLink.tsx`

```typescript
interface BioLinkData {
  profile: Profile
  links: LinkItem[]
  socialLinks: SocialLink[]
  theme: ThemeConfig
}

interface UseBioLinkReturn {
  bioLink: BioLinkData | null
  loading: boolean
  error: string | null
  
  // Profile actions
  updateProfile: (data: Partial<Profile>) => Promise<void>
  uploadAvatar: (file: File) => Promise<string>
  
  // Links actions
  addLink: (link: Omit<LinkItem, 'id'>) => Promise<void>
  updateLink: (id: string, data: Partial<LinkItem>) => Promise<void>
  removeLink: (id: string) => Promise<void>
  reorderLinks: (activeId: string, overId: string) => Promise<void>
  
  // Social links actions
  addSocialLink: (link: Omit<SocialLink, 'id'>) => Promise<void>
  removeSocialLink: (id: string) => Promise<void>
  
  // Theme actions
  updateTheme: (theme: Partial<ThemeConfig>) => Promise<void>
}
```

**Implementação Atual (Mock)**:
```typescript
export function useBioLink(): UseBioLinkReturn {
  const [bioLink, setBioLink] = useLocalStorage<BioLinkData>('biolink', DEFAULT_DATA)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const updateProfile = useCallback(async (data: Partial<Profile>) => {
    setLoading(true)
    try {
      setBioLink(prev => ({
        ...prev,
        profile: { ...prev.profile, ...data }
      }))
    } catch (err) {
      setError('Erro ao atualizar perfil')
    } finally {
      setLoading(false)
    }
  }, [setBioLink])

  // ... outras implementações
}
```

**Futuras Integrações Supabase**:
```typescript
// Versão com Supabase
const updateProfile = useCallback(async (data: Partial<Profile>) => {
  setLoading(true)
  try {
    const { error } = await supabase
      .from('bio_links')
      .update(data)
      .eq('user_id', user.id)
    
    if (error) throw error
    
    // Invalidate query cache
    queryClient.invalidateQueries(['bioLink', user.id])
  } catch (err) {
    setError('Erro ao atualizar perfil')
  } finally {
    setLoading(false)
  }
}, [user.id])
```

### useUrlShortener.tsx

**Localização**: `hooks/useUrlShortener.tsx`

```typescript
interface ShortenedUrl {
  id: string
  originalUrl: string
  shortCode: string
  title?: string
  clickCount: number
  createdAt: string
  isActive: boolean
}

interface UseUrlShortenerReturn {
  urls: ShortenedUrl[]
  loading: boolean
  error: string | null
  
  shortenUrl: (url: string, customCode?: string, title?: string) => Promise<ShortenedUrl>
  deleteUrl: (id: string) => Promise<void>
  getUrlStats: (id: string) => Promise<UrlStats>
  exportUrls: () => Promise<void>
}
```

**Implementação**:
```typescript
export function useUrlShortener(): UseUrlShortenerReturn {
  const [urls, setUrls] = useLocalStorage<ShortenedUrl[]>('shortened_urls', [])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const shortenUrl = useCallback(async (
    originalUrl: string, 
    customCode?: string, 
    title?: string
  ): Promise<ShortenedUrl> => {
    setLoading(true)
    setError(null)
    
    try {
      // Validar URL
      new URL(originalUrl)
      
      // Gerar código se não fornecido
      const shortCode = customCode || generateShortCode()
      
      // Verificar se código já existe
      const exists = urls.some(url => url.shortCode === shortCode)
      if (exists) {
        throw new Error('Código já está em uso')
      }
      
      const newUrl: ShortenedUrl = {
        id: crypto.randomUUID(),
        originalUrl,
        shortCode,
        title,
        clickCount: 0,
        createdAt: new Date().toISOString(),
        isActive: true
      }
      
      setUrls(prev => [newUrl, ...prev])
      return newUrl
      
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao encurtar URL'
      setError(message)
      throw new Error(message)
    } finally {
      setLoading(false)
    }
  }, [urls, setUrls])

  // ... outras implementações
}
```

### useAnalytics.tsx

**Localização**: `hooks/useAnalytics.tsx`

```typescript
interface AnalyticsData {
  totalViews: number
  totalClicks: number
  topLinks: LinkStats[]
  chartData: ChartDataPoint[]
  conversionRate: number
}

interface UseAnalyticsReturn {
  analytics: AnalyticsData | null
  loading: boolean
  error: string | null
  
  getAnalytics: (period?: 'week' | 'month' | 'year') => Promise<void>
  exportAnalytics: (format: 'csv' | 'json') => Promise<void>
  trackClick: (linkId: string, metadata?: ClickMetadata) => Promise<void>
}
```

**Mock Implementation**:
```typescript
export function useAnalytics(): UseAnalyticsReturn {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const getAnalytics = useCallback(async (period = 'month') => {
    setLoading(true)
    try {
      // Simular carregamento
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock data baseado no período
      const mockData = generateMockAnalytics(period)
      setAnalytics(mockData)
    } catch (err) {
      setError('Erro ao carregar analytics')
    } finally {
      setLoading(false)
    }
  }, [])

  // Futuro: Integração com Supabase
  const trackClick = useCallback(async (linkId: string, metadata?: ClickMetadata) => {
    try {
      // await supabase
      //   .from('url_clicks')
      //   .insert({
      //     bio_link_item_id: linkId,
      //     ip_address: metadata?.ip,
      //     user_agent: metadata?.userAgent,
      //     referrer: metadata?.referrer
      //   })
      
      console.log('Click tracked:', linkId, metadata)
    } catch (err) {
      console.error('Error tracking click:', err)
    }
  }, [])
}
```

## Utility Hooks

### useTheme.tsx

**Localização**: `hooks/useTheme.tsx`

```typescript
type Theme = 'light' | 'dark' | 'neon'

interface UseThemeReturn {
  theme: Theme
  setTheme: (theme: Theme) => void
  themes: Theme[]
}

export function useTheme(): UseThemeReturn {
  const [theme, setThemeState] = useLocalStorage<Theme>('theme', 'dark')

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme)
    
    // Aplicar tema no documento
    document.documentElement.className = newTheme
    document.documentElement.setAttribute('data-theme', newTheme)
  }, [setThemeState])

  // Aplicar tema inicial
  useEffect(() => {
    document.documentElement.className = theme
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  return {
    theme,
    setTheme,
    themes: ['light', 'dark', 'neon']
  }
}
```

### useLocalStorage.tsx

**Localização**: `hooks/useLocalStorage.tsx`

```typescript
type SetValue<T> = T | ((val: T) => T)

function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: SetValue<T>) => void] {
  
  // State para armazenar o valor
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error)
      return initialValue
    }
  })

  // Função para setar valor
  const setValue = useCallback((value: SetValue<T>) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      window.localStorage.setItem(key, JSON.stringify(valueToStore))
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error)
    }
  }, [key, storedValue])

  return [storedValue, setValue]
}

### useMobileOptimized.tsx

**Localização**: `hooks/useMobileOptimized.tsx`

```typescript
interface UseMobileOptimizedReturn {
  isMobile: boolean
  orientation: 'portrait' | 'landscape'
  viewportHeight: number
  isLandscape: boolean
  isPortrait: boolean
  getOptimizedHeight: (percentage?: number) => string
  supportsHover: () => boolean
  getTouchTargetSize: (size?: 'sm' | 'md' | 'lg') => string
}

export function useMobileOptimized(): UseMobileOptimizedReturn {
  const [isMobile, setIsMobile] = useState(false)
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait')
  const [viewportHeight, setViewportHeight] = useState(window.innerHeight)

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
    }

    const checkOrientation = () => {
      const isLandscape = window.innerWidth > window.innerHeight
      setOrientation(isLandscape ? 'landscape' : 'portrait')
      setViewportHeight(window.innerHeight)
    }

    checkMobile()
    checkOrientation()

    window.addEventListener('resize', checkMobile)
    window.addEventListener('resize', checkOrientation)
    window.addEventListener('orientationchange', checkOrientation)

    return () => {
      window.removeEventListener('resize', checkMobile)
      window.removeEventListener('resize', checkOrientation)
      window.removeEventListener('orientationchange', checkOrientation)
    }
  }, [])

  const getOptimizedHeight = useCallback((percentage: number = 100): string => {
    // Considera teclado virtual no mobile
    const baseHeight = isMobile ? viewportHeight * 0.85 : viewportHeight
    return `${(baseHeight * percentage) / 100}px`
  }, [isMobile, viewportHeight])

  const supportsHover = useCallback((): boolean => {
    return window.matchMedia('(hover: hover)').matches
  }, [])

  const getTouchTargetSize = useCallback((size: 'sm' | 'md' | 'lg' = 'md'): string => {
    if (!isMobile) {
      // Desktop sizes
      const sizes = {
        sm: 'h-8 min-h-8 px-3',
        md: 'h-10 min-h-10 px-4', 
        lg: 'h-12 min-h-12 px-6'
      }
      return sizes[size]
    }

    // Mobile touch targets (minimum 44px)
    const mobileSizes = {
      sm: 'h-10 min-h-10 px-4',  // 40px
      md: 'h-12 min-h-12 px-6',  // 48px
      lg: 'h-14 min-h-14 px-8'   // 56px
    }
    return mobileSizes[size]
  }, [isMobile])

  return {
    isMobile,
    orientation,
    viewportHeight,
    isLandscape: orientation === 'landscape',
    isPortrait: orientation === 'portrait',
    getOptimizedHeight,
    supportsHover,
    getTouchTargetSize
  }
}
```

**Casos de Uso**:
```typescript
// Em componentes
const { isMobile, getTouchTargetSize, supportsHover } = useMobileOptimized()

// Touch targets otimizados
<Button className={getTouchTargetSize('md')}>
  {isMobile ? 'Toque' : 'Clique'}
</Button>

// Hover condicional
<div className={cn(
  'card',
  supportsHover() && 'hover:scale-105'
)}>

// Layout por orientação
{isLandscape ? <LandscapeView /> : <PortraitView />}
```

**Funcionalidades Avançadas**:
- **Auto-detecção de dispositivo**: Mobile vs desktop
- **Orientação dinâmica**: Portrait/landscape com eventos
- **Altura otimizada**: Considerando teclado virtual
- **Touch targets inteligentes**: Tamanhos adaptativos
- **Hover support**: Detecção de suporte real a hover
- **Performance**: Listeners otimizados com cleanup
```

### useFileUpload.tsx

**Localização**: `hooks/useFileUpload.tsx`

```typescript
interface UseFileUploadReturn {
  uploadFile: (file: File, bucket: string, path?: string) => Promise<string>
  uploading: boolean
  error: string | null
  progress: number
}

export function useFileUpload(): UseFileUploadReturn {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)

  const uploadFile = useCallback(async (
    file: File, 
    bucket: string, 
    path?: string
  ): Promise<string> => {
    setUploading(true)
    setError(null)
    setProgress(0)

    try {
      // Validar arquivo
      if (!file.type.startsWith('image/')) {
        throw new Error('Apenas imagens são permitidas')
      }

      if (file.size > 5 * 1024 * 1024) { // 5MB
        throw new Error('Arquivo muito grande (max 5MB)')
      }

      // Gerar nome único
      const fileExt = file.name.split('.').pop()
      const fileName = `${crypto.randomUUID()}.${fileExt}`
      const filePath = path ? `${path}/${fileName}` : fileName

      // Simular progresso (futuro: usar Supabase com callback)
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90))
      }, 100)

      // Mock upload (futuro: Supabase Storage)
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      clearInterval(progressInterval)
      setProgress(100)

      // Futuro: Supabase upload
      // const { data, error } = await supabase.storage
      //   .from(bucket)
      //   .upload(filePath, file)

      // if (error) throw error

      // const { data: { publicUrl } } = supabase.storage
      //   .from(bucket)
      //   .getPublicUrl(filePath)

      const mockUrl = URL.createObjectURL(file)
      return mockUrl

    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro no upload'
      setError(message)
      throw new Error(message)
    } finally {
      setUploading(false)
      setProgress(0)
    }
  }, [])

  return { uploadFile, uploading, error, progress }
}
```

### use-mobile.tsx

**Localização**: `hooks/use-mobile.tsx`

```typescript
const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState<boolean | undefined>(undefined)

  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    mql.addEventListener("change", onChange)
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isMobile
}
```

## Authentication Hooks (Futuro)

### useAuth.tsx

```typescript
// Futuro hook de autenticação
interface UseAuthReturn {
  user: User | null
  session: Session | null
  loading: boolean
  
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Listen para mudanças de auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session)
        setUser(session?.user ?? null)
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const signIn = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    if (error) throw error
  }, [])

  // ... outras implementações
}
```

## Performance Optimization

### Memoization Patterns
```typescript
// useMemo para computações caras
const sortedLinks = useMemo(() => {
  return links.sort((a, b) => a.position - b.position)
}, [links])

// useCallback para event handlers
const handleLinkClick = useCallback((linkId: string) => {
  trackClick(linkId)
  // ... outras ações
}, [trackClick])
```

### Debouncing
```typescript
// Hook para debounce de inputs
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

// Uso em pesquisa
const debouncedSearch = useDebounce(searchTerm, 300)
```

## Error Handling

### Error Boundaries Integration
```typescript
// Hook para capturar erros
export function useErrorHandler() {
  const { toast } = useToast()

  const handleError = useCallback((error: Error, context?: string) => {
    console.error(`Error ${context ? `in ${context}` : ''}:`, error)
    
    toast({
      title: "Erro",
      description: error.message || "Algo deu errado",
      variant: "destructive"
    })
  }, [toast])

  return { handleError }
}
```

## Testing

### Hook Testing
```typescript
// Exemplo de teste para hooks
import { renderHook, act } from '@testing-library/react'
import { useLocalStorage } from './useLocalStorage'

test('should store and retrieve value from localStorage', () => {
  const { result } = renderHook(() => useLocalStorage('test-key', 'initial'))
  
  expect(result.current[0]).toBe('initial')
  
  act(() => {
    result.current[1]('updated')
  })
  
  expect(result.current[0]).toBe('updated')
  expect(localStorage.getItem('test-key')).toBe('"updated"')
})
```