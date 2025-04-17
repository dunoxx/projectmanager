/**
 * Módulo de logging para a API
 * Em produção, poderia ser substituído por uma solução mais robusta como Winston ou Pino
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface Logger {
  debug(message: string, ...args: any[]): void;
  info(message: string, ...args: any[]): void;
  warn(message: string, ...args: any[]): void;
  error(message: string, ...args: any[]): void;
}

class ConsoleLogger implements Logger {
  private logLevel: LogLevel;

  constructor() {
    // Definir o nível de log com base nas variáveis de ambiente
    this.logLevel = (process.env.LOG_LEVEL as LogLevel) || 'info';
  }

  /**
   * Verifica se o nível de log deve ser registrado com base no nível atual
   */
  private shouldLog(level: LogLevel): boolean {
    const levels: Record<LogLevel, number> = {
      debug: 0,
      info: 1,
      warn: 2,
      error: 3
    };

    return levels[level] >= levels[this.logLevel];
  }

  /**
   * Formato do timestamp para os logs
   */
  private getTimestamp(): string {
    return new Date().toISOString();
  }

  /**
   * Log de nível debug
   */
  debug(message: string, ...args: any[]): void {
    if (this.shouldLog('debug')) {
      console.debug(`[${this.getTimestamp()}] [DEBUG] ${message}`, ...args);
    }
  }

  /**
   * Log de nível info
   */
  info(message: string, ...args: any[]): void {
    if (this.shouldLog('info')) {
      console.info(`[${this.getTimestamp()}] [INFO] ${message}`, ...args);
    }
  }

  /**
   * Log de nível warn
   */
  warn(message: string, ...args: any[]): void {
    if (this.shouldLog('warn')) {
      console.warn(`[${this.getTimestamp()}] [WARN] ${message}`, ...args);
    }
  }

  /**
   * Log de nível error
   */
  error(message: string, ...args: any[]): void {
    if (this.shouldLog('error')) {
      console.error(`[${this.getTimestamp()}] [ERROR] ${message}`, ...args);
    }
  }
}

// Exportar uma instância única do logger
export const logger: Logger = new ConsoleLogger(); 