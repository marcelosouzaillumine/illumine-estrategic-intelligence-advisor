import { LogLevel } from './LogLevel';
import { LogSanitizer } from './LogSanitizer';

class InstitutionalLoggerService {
  private currentLevel: LogLevel;

  constructor() {
    // In production, log level defaults to WARN. In development, DEBUG.
    const mode = typeof process !== 'undefined' ? process.env.NODE_ENV : (import.meta as any).env?.MODE;
    this.currentLevel = mode === 'production' ? LogLevel.WARN : LogLevel.DEBUG;
  }

  private shouldLog(level: LogLevel): boolean {
    return level >= this.currentLevel;
  }

  private formatMessage(levelStr: string, message: string): string {
    const timestamp = new Date().toISOString();
    return `[${timestamp}] [${levelStr}] ${message}`;
  }

  debug(message: string, payload?: unknown) {
    if (!this.shouldLog(LogLevel.DEBUG)) return;
    const safePayload = payload !== undefined ? LogSanitizer.sanitizeForLog(payload) : undefined;
    if (safePayload !== undefined) {
      console.debug(this.formatMessage('DEBUG', message), safePayload);
    } else {
      console.debug(this.formatMessage('DEBUG', message));
    }
  }

  info(message: string, payload?: unknown) {
    if (!this.shouldLog(LogLevel.INFO)) return;
    const safePayload = payload !== undefined ? LogSanitizer.sanitizeForLog(payload) : undefined;
    if (safePayload !== undefined) {
      console.info(this.formatMessage('INFO', message), safePayload);
    } else {
      console.info(this.formatMessage('INFO', message));
    }
  }

  warn(message: string, payload?: unknown) {
    if (!this.shouldLog(LogLevel.WARN)) return;
    const safePayload = payload !== undefined ? LogSanitizer.sanitizeForLog(payload) : undefined;
    if (safePayload !== undefined) {
      console.warn(this.formatMessage('WARN', message), safePayload);
    } else {
      console.warn(this.formatMessage('WARN', message));
    }
  }

  error(message: string, error?: unknown, context?: unknown) {
    if (!this.shouldLog(LogLevel.ERROR)) return;
    
    // We sanitize both the error object and context, but preserve message/stack
    const safeContext = context !== undefined ? LogSanitizer.sanitizeForLog(context) : undefined;
    let safeError = error;
    
    if (error instanceof Error) {
      safeError = { message: error.message, stack: error.stack, ...(LogSanitizer.sanitizeForLog(error) as Record<string, unknown>) };
    } else if (error) {
      safeError = LogSanitizer.sanitizeForLog(error);
    }

    if (safeError || safeContext) {
      console.error(this.formatMessage('ERROR', message), safeError || '', safeContext || '');
    } else {
      console.error(this.formatMessage('ERROR', message));
    }
  }

  audit(event: string, payload: unknown) {
    // AUDIT logs always fire locally for tracing, but they don't block.
    const safePayload = payload !== undefined ? LogSanitizer.sanitizeForLog(payload) : undefined;
    
    // Color coded console output for distinct visibility in Dev/Staging
    console.log(`%c[AUDIT] ${new Date().toISOString()} - ${event}`, "color: #ff8552; font-weight: bold; font-size: 1.1em;", safePayload);
    
    // FUTURE: Send to security_audit_logs collection when integrated
  }
}

export const logger = new InstitutionalLoggerService();
