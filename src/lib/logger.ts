/**
 * Logger centralisé pour le système GTBP
 * Centralized logger for GTBP system
 */

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

export interface LogEntry {
  timestamp: string
  level: LogLevel
  message: string
  context?: string | undefined
  data?: any
}

class Logger {
  private static instance: Logger
  private logs: LogEntry[] = []
  private maxLogs = 1000
  private isProduction = process.env.NODE_ENV === 'production'

  private constructor() {}

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger()
    }
    return Logger.instance
  }

  private log(level: LogLevel, message: string, context?: string, data?: any): void {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      context,
      data,
    }

    // Ajouter au buffer
    this.logs.push(entry)
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs)
    }

    // Output console selon environnement
    if (!this.isProduction || level >= LogLevel.ERROR) {
      const prefix = context ? `[${context}]` : ''
      const timestamp = entry.timestamp.split('T')[1]?.split('.')[0] || ''
      
      switch (level) {
        case LogLevel.DEBUG:
          console.debug(`\x1b[36m${timestamp} DEBUG ${prefix} ${message}\x1b[0m`, data)
          break
        case LogLevel.INFO:
          console.info(`\x1b[32m${timestamp} INFO  ${prefix} ${message}\x1b[0m`, data)
          break
        case LogLevel.WARN:
          console.warn(`\x1b[33m${timestamp} WARN  ${prefix} ${message}\x1b[0m`, data)
          break
        case LogLevel.ERROR:
          console.error(`\x1b[31m${timestamp} ERROR ${prefix} ${message}\x1b[0m`, data)
          break
      }
    }
  }

  debug(message: string, context?: string, data?: any): void {
    this.log(LogLevel.DEBUG, message, context, data)
  }

  info(message: string, context?: string, data?: any): void {
    this.log(LogLevel.INFO, message, context, data)
  }

  warn(message: string, context?: string, data?: any): void {
    this.log(LogLevel.WARN, message, context, data)
  }

  error(message: string, context?: string, data?: any): void {
    this.log(LogLevel.ERROR, message, context, data)
  }

  // Méthodes spécifiques pour les services
  service(message: string, serviceName: string, data?: any): void {
    this.info(message, `Service:${serviceName}`, data)
  }

  serviceError(message: string, serviceName: string, error?: any): void {
    this.error(message, `Service:${serviceName}`, error)
  }

  database(message: string, operation: string, data?: any): void {
    this.debug(message, `DB:${operation}`, data)
  }

  databaseError(message: string, operation: string, error?: any): void {
    this.error(message, `DB:${operation}`, error)
  }

  // Méthodes pour les hooks React
  hook(message: string, hookName: string, data?: any): void {
    this.debug(message, `Hook:${hookName}`, data)
  }

  hookError(message: string, hookName: string, error?: any): void {
    this.error(message, `Hook:${hookName}`, error)
  }

  // Méthodes pour les composants
  component(message: string, componentName: string, data?: any): void {
    this.debug(message, `Component:${componentName}`, data)
  }

  componentError(message: string, componentName: string, error?: any): void {
    this.error(message, `Component:${componentName}`, error)
  }

  // Accès aux logs pour debugging
  getLogs(): LogEntry[] {
    return [...this.logs]
  }

  getLogsByLevel(level: LogLevel): LogEntry[] {
    return this.logs.filter(log => log.level === level)
  }

  getLogsByContext(context: string): LogEntry[] {
    return this.logs.filter(log => log.context?.includes(context))
  }

  clearLogs(): void {
    this.logs = []
  }

  // Export pour monitoring
  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2)
  }
}

// Export singleton
export const logger = Logger.getInstance()

// Export par défaut pour compatibilité
export default logger
