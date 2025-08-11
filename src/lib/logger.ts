import { env } from '@/config/environment';

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

class Logger {
  private shouldLog(level: LogLevel): boolean {
    if (env.isProd) return level === 'error';
    if (!env.debug.enabled) return level === 'error' || level === 'warn';
    
    const levels: Record<LogLevel, number> = {
      debug: 0,
      info: 1,
      warn: 2,
      error: 3,
    };
    
    const currentLevel = levels[env.debug.logLevel as LogLevel] || 3;
    return levels[level] >= currentLevel;
  }

  debug(message: string, data?: any): void {
    if (this.shouldLog('debug')) {
      console.log(`🔍 [DEBUG] ${message}`, data || '');
    }
  }

  info(message: string, data?: any): void {
    if (this.shouldLog('info')) {
      console.info(`ℹ️ [INFO] ${message}`, data || '');
    }
  }

  warn(message: string, data?: any): void {
    if (this.shouldLog('warn')) {
      console.warn(`⚠️ [WARN] ${message}`, data || '');
    }
  }

  error(message: string, error?: any): void {
    if (this.shouldLog('error')) {
      console.error(`❌ [ERROR] ${message}`, error || '');
    }
  }

  // Para desenvolvimento - sempre loga se não for produção
  dev(message: string, data?: any): void {
    if (env.isDev) {
      console.log(`🛠️ [DEV] ${message}`, data || '');
    }
  }
}

export const logger = new Logger();