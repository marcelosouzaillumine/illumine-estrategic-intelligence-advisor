export class LogSanitizer {
  private static readonly SENSITIVE_KEYS = [
    'email', 'cpf', 'cnpj', 'token', 'uid', 'password',
    'accesstoken', 'refreshtoken', 'clientid', 'tenantid',
    'financial_entries', 'diagnostico', 'dre', 'bp', 'dfc',
    'senha', 'secret', 'authorization'
  ];

  static sanitizeForLog(payload: unknown): unknown {
    if (payload === null || payload === undefined) return payload;
    
    if (typeof payload === 'string') {
      return payload;
    }

    if (Array.isArray(payload)) {
      return payload.map(item => this.sanitizeForLog(item));
    }

    if (typeof payload === 'object') {
      const sanitized: Record<string, unknown> = {};
      for (const [key, value] of Object.entries(payload as Record<string, unknown>)) {
        const lowerKey = key.toLowerCase();
        const isSensitive = this.SENSITIVE_KEYS.some(k => lowerKey.includes(k));
        
        if (isSensitive && typeof value === 'string') {
          if (lowerKey.includes('email')) {
            sanitized[key] = this.maskEmail(value);
          } else {
            sanitized[key] = '***[SANITIZED]***';
          }
        } else if (isSensitive && (Array.isArray(value) || typeof value === 'object')) {
          sanitized[key] = Array.isArray(value) ? `[Array(${value.length}) SANITIZED]` : '[Object SANITIZED]';
        } else {
          sanitized[key] = this.sanitizeForLog(value);
        }
      }
      return sanitized;
    }

    return payload;
  }

  private static maskEmail(email: string): string {
    if (!email || !email.includes('@')) return '***[SANITIZED]***';
    const [name, domain] = email.split('@');
    if (name.length <= 2) return `*@${domain}`;
    return `${name.charAt(0)}***${name.charAt(name.length - 1)}@${domain}`;
  }
}
