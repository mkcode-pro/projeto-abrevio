// Regras de validação e utilitários para usernames

export const USERNAME_RULES = {
  minLength: 3,
  maxLength: 30,
  pattern: /^[a-z0-9_.]+$/,
  patternDescription: "Use apenas letras minúsculas, números, '.' ou '_'",
  reservedWords: [
    'admin', 'root', 'api', 'app', 'www', 'mail', 'ftp',
    'blog', 'shop', 'help', 'support', 'info', 'news',
    'about', 'contact', 'privacy', 'terms', 'login', 'signup',
    'dashboard', 'settings', 'profile', 'account', 'user',
    'abrev', 'abrevio', 'system', 'public', 'private'
  ]
};

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  score: number; // 0-100, qualidade do username
}

/**
 * Valida um username com regras completas
 */
export function validateUsername(username: string): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  let score = 100;

  // Verificar se está vazio
  if (!username || username.trim().length === 0) {
    return {
      isValid: false,
      errors: ['Username é obrigatório'],
      warnings: [],
      score: 0
    };
  }

  // Converter para lowercase para validação
  const normalizedUsername = username.toLowerCase().trim();

  // Verificar comprimento
  if (normalizedUsername.length < USERNAME_RULES.minLength) {
    errors.push(`Username deve ter pelo menos ${USERNAME_RULES.minLength} caracteres`);
    score = 0;
  } else if (normalizedUsername.length > USERNAME_RULES.maxLength) {
    errors.push(`Username não pode ter mais de ${USERNAME_RULES.maxLength} caracteres`);
    score = 0;
  }

  // Verificar padrão de caracteres
  if (!USERNAME_RULES.pattern.test(normalizedUsername)) {
    errors.push(USERNAME_RULES.patternDescription);
    score = 0;
  }

  // Verificar início e fim
  if (normalizedUsername.startsWith('.') || normalizedUsername.startsWith('_')) {
    errors.push('Username não pode começar com . ou _');
    score -= 20;
  }
  if (normalizedUsername.endsWith('.') || normalizedUsername.endsWith('_')) {
    errors.push('Username não pode terminar com . ou _');
    score -= 20;
  }

  // Verificar caracteres consecutivos
  if (/[._]{2,}/.test(normalizedUsername)) {
    errors.push('Username não pode ter . ou _ consecutivos');
    score -= 30;
  }

  // Verificar palavras reservadas
  if (USERNAME_RULES.reservedWords.includes(normalizedUsername)) {
    errors.push('Este username é reservado pelo sistema');
    score = 0;
  }

  // Avisos de qualidade
  if (normalizedUsername.length < 5 && errors.length === 0) {
    warnings.push('Usernames mais longos são mais memoráveis');
    score -= 10;
  }

  if (/^\d/.test(normalizedUsername)) {
    warnings.push('Usernames que começam com números são menos profissionais');
    score -= 15;
  }

  if (!/[a-z]/.test(normalizedUsername)) {
    warnings.push('Considere adicionar letras ao seu username');
    score -= 10;
  }

  // Username muito genérico
  if (/^(user|test|temp|tmp)\d*$/.test(normalizedUsername)) {
    warnings.push('Este username é muito genérico');
    score -= 25;
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    score: Math.max(0, score)
  };
}

/**
 * Normaliza um username para o formato correto
 */
export function normalizeUsername(username: string): string {
  return username
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9_.]/g, '') // Remove caracteres inválidos
    .replace(/[._]{2,}/g, '_')   // Substitui múltiplos . ou _ por um único _
    .replace(/^[._]+/, '')       // Remove . ou _ do início
    .replace(/[._]+$/, '');      // Remove . ou _ do fim
}

/**
 * Gera sugestões de username baseadas em um nome
 */
export function generateUsernameSuggestions(
  baseName: string,
  existingUsernames: string[] = []
): string[] {
  const suggestions: string[] = [];
  const normalized = normalizeUsername(baseName);
  
  if (!normalized) return [];

  // Estratégias de geração
  const strategies = [
    // Adicionar ano
    () => `${normalized}${new Date().getFullYear()}`,
    () => `${normalized}_${new Date().getFullYear()}`,
    
    // Adicionar números aleatórios
    () => `${normalized}${Math.floor(Math.random() * 999) + 1}`,
    () => `${normalized}_${Math.floor(Math.random() * 99) + 1}`,
    
    // Prefixos e sufixos
    () => `the_${normalized}`,
    () => `${normalized}_oficial`,
    () => `${normalized}.br`,
    () => `${normalized}_real`,
    
    // Variações criativas
    () => `${normalized}${normalized.length}`,
    () => `x${normalized}`,
    () => `${normalized}x`,
    
    // Usar iniciais se o nome for composto
    () => {
      const parts = baseName.split(/\s+/);
      if (parts.length > 1) {
        return parts.map(p => p[0]).join('').toLowerCase() + '_' + normalized;
      }
      return null;
    }
  ];

  // Gerar sugestões
  for (const strategy of strategies) {
    const suggestion = strategy();
    if (suggestion) {
      const validation = validateUsername(suggestion);
      if (validation.isValid && !existingUsernames.includes(suggestion)) {
        suggestions.push(suggestion);
      }
    }
    
    // Limitar a 5 sugestões
    if (suggestions.length >= 5) break;
  }

  // Remover duplicatas
  return [...new Set(suggestions)];
}

/**
 * Verifica se um username é considerado premium/especial
 */
export function isUsernnamePremium(username: string): boolean {
  const normalized = username.toLowerCase();
  
  // Usernames muito curtos são premium
  if (normalized.length <= 4) return true;
  
  // Usernames com apenas letras e curtos
  if (/^[a-z]{3,6}$/.test(normalized)) return true;
  
  // Palavras comuns em inglês/português
  const premiumWords = [
    'love', 'life', 'cool', 'best', 'gold', 'star',
    'amor', 'vida', 'legal', 'top', 'ouro', 'estrela'
  ];
  
  return premiumWords.includes(normalized);
}

/**
 * Calcula um score de qualidade para o username
 */
export function getUsernameQualityScore(username: string): {
  score: number;
  badge: 'premium' | 'good' | 'average' | 'poor';
  color: string;
} {
  const validation = validateUsername(username);
  
  if (!validation.isValid) {
    return { score: 0, badge: 'poor', color: 'red' };
  }
  
  let score = validation.score;
  
  // Bonus por ser premium
  if (isUsernnamePremium(username)) {
    score = Math.min(100, score + 20);
  }
  
  // Determinar badge e cor
  if (score >= 90) {
    return { score, badge: 'premium', color: '#FFD700' }; // Dourado
  } else if (score >= 70) {
    return { score, badge: 'good', color: '#10B981' }; // Verde
  } else if (score >= 50) {
    return { score, badge: 'average', color: '#F59E0B' }; // Amarelo
  } else {
    return { score, badge: 'poor', color: '#EF4444' }; // Vermelho
  }
}