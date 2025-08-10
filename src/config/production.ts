// Configurações para ambiente de produção
export const productionConfig = {
  // URLs base
  APP_URL: 'https://abrev.io',
  API_URL: 'https://api.abrev.io',
  
  // Recursos de performance
  ENABLE_ANALYTICS: true,
  ENABLE_ERROR_TRACKING: true,
  ENABLE_PWA: true,
  
  // Configurações de cache
  CACHE_DURATION: 24 * 60 * 60 * 1000, // 24 horas
  
  // Configurações de SEO
  DEFAULT_META: {
    title: 'Abrev.io - Encurtador de Links Brasileiro',
    description: 'Crie páginas de biolink personalizadas e encurte URLs com o melhor SaaS brasileiro. Visual moderno, recursos inteligentes e foco total na experiência mobile.',
    keywords: 'encurtador de links, biolink, links na bio, instagram, whatsapp, brasileiro',
    ogImage: '/og-image.png'
  },
  
  // Configurações de integração
  SUPABASE_URL: '',  // Será configurado pelo usuário
  SUPABASE_ANON_KEY: '',  // Será configurado pelo usuário
  
  // Configurações de monetização
  STRIPE_PUBLIC_KEY: '',  // Para futuras integrações de pagamento
  PIX_GATEWAY: '',  // Para integração PIX
}

// Validações de ambiente
export const validateProductionConfig = () => {
  const required = ['SUPABASE_URL', 'SUPABASE_ANON_KEY']
  const missing = required.filter(key => !productionConfig[key as keyof typeof productionConfig])
  
  if (missing.length > 0) {
    console.warn(`⚠️ Configurações de produção ausentes: ${missing.join(', ')}`)
  }
  
  return missing.length === 0
}