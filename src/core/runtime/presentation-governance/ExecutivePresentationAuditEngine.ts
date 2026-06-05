import { PresentationLayer } from './ExecutiveAudienceProfile';

export interface AuditEngineResult {
  status: 'PASS' | 'DFC_EXECUTIVE_PRESENTATION_VIOLATION';
  violations: string[];
}

export class ExecutivePresentationAuditEngine {
  private static readonly FORBIDDEN_WORDS = [
    'DFC', 'DRE', 'BP', 'DLPA', 'ESGIM', 'CDIL', 'EQE', 'EFSI',
    'CRITICAL', 'WARNING', 'NORMAL',
    'TECHNICAL', 'Seção ', 'Página Zero'
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
    
    const checkString = (str: string) => {
      for (const word of this.FORBIDDEN_WORDS) {
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

    const traverse = (obj: any) => {
      if (obj === null || obj === undefined) return;
      if (typeof obj === 'string') {
        checkString(obj);
      } else if (Array.isArray(obj)) {
        for (const item of obj) {
          traverse(item);
        }
      } else if (typeof obj === 'object') {
        for (const key of Object.keys(obj)) {
          traverse(obj[key]);
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

    return { status: 'PASS', violations: [] };
  }
}
