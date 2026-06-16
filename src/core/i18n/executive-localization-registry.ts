/**
 * ExecutiveLocalizationRegistry
 *
 * Centralizes domain translation and formatting logic for the Executive Governance Framework.
 * Ensures consistent canonical language boundaries across BP, DRE, DFC, DLPA and other modules.
 */

export class ExecutiveLocalizationRegistry {
  /**
   * Formats a confidence score consistently across the platform.
   * Prevents internal hardcoding like "Conf: 95%" inside UI components.
   *
   * @param value - The numeric confidence value (0 to 100).
   * @param lang - The active language context ('pt-BR', 'en-US', 'es-ES').
   * @returns Formatted confidence string.
   */
  static formatConfidence(value: number, lang: string = 'pt-BR'): string {
    const safeValue = Math.max(0, Math.min(100, value));
    
    switch (lang) {
      case 'en-US':
        return `Confidence: ${safeValue}%`;
      case 'es-ES':
        return `Confianza: ${safeValue}%`;
      case 'pt-BR':
      default:
        return `Conf.: ${safeValue}%`;
    }
  }

  /**
   * Formats ratio labels, eradicating hardcoded english terms like "Debt-to-Equity".
   *
   * @param key - The domain metric key (e.g. 'debt_to_equity').
   * @param lang - The active language context.
   * @returns The localized ratio or metric name.
   */
  static formatMetricName(key: string, lang: string = 'pt-BR'): string {
    const dictionary: Record<string, Record<string, string>> = {
      'debt_to_equity': {
        'pt-BR': 'Dívida / Patrimônio',
        'en-US': 'Debt-to-Equity',
        'es-ES': 'Deuda / Patrimonio'
      },
      'working_capital': {
        'pt-BR': 'Capital de Giro',
        'en-US': 'Working Capital',
        'es-ES': 'Capital de Trabajo'
      },
      'current_ratio': {
        'pt-BR': 'Liquidez Corrente',
        'en-US': 'Current Ratio',
        'es-ES': 'Liquidez Corriente'
      },
      'quick_ratio': {
        'pt-BR': 'Liquidez Seca',
        'en-US': 'Quick Ratio',
        'es-ES': 'Liquidez Seca'
      },
      'cash_ratio': {
        'pt-BR': 'Liquidez Imediata',
        'en-US': 'Cash Ratio',
        'es-ES': 'Liquidez Inmediata'
      }
    };

    const normalizedKey = key.toLowerCase().replace(/-/g, '_').trim();
    if (dictionary[normalizedKey] && dictionary[normalizedKey][lang]) {
      return dictionary[normalizedKey][lang];
    }
    
    // Fallback: Return original key if not registered, though we aim to register all formal metrics.
    return key;
  }
}
