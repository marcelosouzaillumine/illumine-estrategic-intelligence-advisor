import { PresentationLayer } from './ExecutiveAudienceProfile';
import { ExecutiveLanguageLeakAudit } from './ExecutiveLanguageLeakAudit';

export interface AuditEngineResult {
  status: 'PASS' | 'DFC_EXECUTIVE_PRESENTATION_VIOLATION' | 'EXECUTIVE_LANGUAGE_LEAK';
  violations: string[];
}

export class ExecutivePresentationAuditEngine {
  private static readonly FORBIDDEN_WORDS = [
    'DFC', 'DRE', 'BP', 'DLPA', 'ESGIM', 'CDIL', 'EQE', 'EFSI',
    'CRITICAL', 'WARNING', 'NORMAL',
    'TECHNICAL', 'Seção ', 'Página Zero',
    'MODERADA', 'Earnings Integrity Level', 'Sensibilidade Contábil', 'Aviso Técnico'
  ];

  /**
   * Sweeps the given target (string, array, or object) for forbidden technical terms.
   * If any forbidden term is found under BOARD or EXECUTIVE layers, reports a violation.
   */
  public static audit(target: any, layer: PresentationLayer): AuditEngineResult {
    if (layer === 'TECHNICAL') {
      return { status: 'PASS', violations: [] };
    }

    const violations: string[] = [];
    
    const checkString = (str: string, key?: string) => {
      const isAllowedKeyForDFC = key && [
        'sourceModule', 'engineId', 'debug', 'source', 'severity', 
        'rationale', 'id', 'key', 'status', 'rawRiskLevel', 'semanticLabel', 'level'
      ].includes(key);

      for (const word of this.FORBIDDEN_WORDS) {
        if (word === 'DFC' && isAllowedKeyForDFC) {
          continue;
        }
        if (word === 'Seção ') {
          if (/se\u00e7\u00e3o\s+\d+/i.test(str) || /se\u00e7\u00e3o\s+x/i.test(str)) {
            violations.push(`Visual numbering leak: "${str}" contains a section prefix.`);
          }
        } else {
          // Exact word match to prevent accidental partial matches
          const regex = new RegExp(`\\b${word}\\b`, 'i');
          if (regex.test(str)) {
            violations.push(`Technical leak: "${str}" contains forbidden word "${word}".`);
          }
        }
      }
    };

    const traverse = (obj: any, key?: string) => {
      if (obj === null || obj === undefined) return;
      if (typeof obj === 'string') {
        checkString(obj, key);
      } else if (Array.isArray(obj)) {
        for (const item of obj) {
          traverse(item, key);
        }
      } else if (typeof obj === 'object') {
        for (const k of Object.keys(obj)) {
          traverse(obj[k], k);
        }
      }
    };

    traverse(target);

    if (violations.length > 0) {
      return {
        status: 'DFC_EXECUTIVE_PRESENTATION_VIOLATION',
        violations
      };
    }

    // Run Language Leak Audit
    const langAudit = ExecutiveLanguageLeakAudit.audit(target, layer);
    if (langAudit.status === 'EXECUTIVE_LANGUAGE_LEAK') {
      return {
        status: 'EXECUTIVE_LANGUAGE_LEAK',
        violations: langAudit.violations
      };
    }

    return { status: 'PASS', violations: [] };
  }
}
