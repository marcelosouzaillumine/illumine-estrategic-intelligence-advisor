import { ExecutiveNarrativeSanitizer } from './ExecutiveNarrativeSanitizer';

export class EFOSPresentationLeakGuard {
  /**
   * Proteção final (UI/Render level) para garantir que nenhum vazamento escape.
   * Retorna versão sanitizada.
   */
  public static guard(text: string | null | undefined): string {
    if (!text) return '';
    
    // Testa vazamentos via regex
    const leakPattern = /(\[\[.*?\]\]|\[GROWTH\]|\[OPTIMIZATION\]|Parâmetros de divulgação omitidos|runtime\.|^\s*\.:)/i;
    
    if (leakPattern.test(text)) {
      const isProduction = (typeof process !== 'undefined' && process.env.NODE_ENV === 'production') || 
                           (typeof import.meta !== 'undefined' && (import.meta as unknown as { env?: { PROD?: boolean } }).env && (import.meta as unknown as { env?: { PROD?: boolean } }).env?.PROD);
      if (!isProduction) {
        console.warn('[LEAK GUARD] Vazamento técnico interceptado antes da renderização:', text);
      }
      return ExecutiveNarrativeSanitizer.sanitize(text);
    }
    
    return text;
  }
}
