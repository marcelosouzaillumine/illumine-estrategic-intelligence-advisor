/**
 * InstitutionalNarrativeToneGuard
 * 
 * Responsável por auditar e normalizar a linguagem gerada na plataforma,
 * garantindo que o tom permaneça 100% alinhado com Executive Advisory Intelligence.
 * 
 * Previne:
 * - Linguagem excessivamente otimista (Triunfalismo)
 * - Linguagem excessivamente alarmista
 * - Frases mecanizadas e tom de robô
 * - Jargões de software/engine ("O sistema encontrou", "Array")
 */

export class InstitutionalNarrativeToneGuard {
  
  // Dicionário de conversão (RegEx -> Substituição fiduciária)
  private static rules: Array<{ pattern: RegExp; replacement: string }> = [
    // Triunfalismo / Otimismo excessivo
    { pattern: /robustez garantida/gi, replacement: 'posição de liquidez favorável' },
    { pattern: /estrutura sólida/gi, replacement: 'estrutura em consolidação' },
    { pattern: /excelente liquidez/gi, replacement: 'liquidez favorável' },
    { pattern: /crescimento explosivo/gi, replacement: 'aceleração comercial' },
    { pattern: /sucesso absoluto/gi, replacement: 'tração comprovada' },
    
    // Alarmismo / Excesso de risco
    { pattern: /crise severa inevitável/gi, replacement: 'pressão relevante sobre liquidez' },
    { pattern: /risco de falência/gi, replacement: 'risco de insolvência no curto prazo' },
    { pattern: /queima de caixa descontrolada/gi, replacement: 'consumo acelerado de capital' },
    { pattern: /situação catastrófica/gi, replacement: 'deterioração estrutural crítica' },

    // Linguagem de Engine / Robótica
    { pattern: /o sistema identificou/gi, replacement: 'a análise estrutural aponta' },
    { pattern: /a engine detectou/gi, replacement: 'o diagnóstico indica' },
    { pattern: /o algoritmo encontrou/gi, replacement: 'os dados evidenciam' }
  ];

  /**
   * Varre o texto e substitui jargões indesejados por linguagem advisory.
   */
  public static enforce(text: string): string {
    if (!text) return text;
    let sanitized = text;

    for (const rule of this.rules) {
      sanitized = sanitized.replace(rule.pattern, rule.replacement);
    }

    return sanitized;
  }
}
