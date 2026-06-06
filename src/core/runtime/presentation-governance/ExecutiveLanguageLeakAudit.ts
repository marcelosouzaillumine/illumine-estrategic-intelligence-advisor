import { PresentationLayer } from './ExecutiveAudienceProfile';

export interface LanguageLeakAuditResult {
  status: 'PASS' | 'EXECUTIVE_LANGUAGE_LEAK';
  violations: string[];
}

export class ExecutiveLanguageLeakAudit {
  // Level 1: Blocked in all modes under BOARD and EXECUTIVE
  private static readonly LEVEL1_TOKENS = ['EQE', 'CDIL', 'EFSI', 'EFOS', 'ENGINE', 'RUNTIME', 'MODULE'];

  // Level 2: Blocked in BOARD and EXECUTIVE, allowed in TECHNICAL
  private static readonly LEVEL2_TOKENS = ['FCO', 'DFC', 'DRE', 'DLPA', 'BP'];

  // Level 3: Needs translation (untranslated raw uppercase forms are blocked in BOARD and EXECUTIVE)
  private static readonly LEVEL3_TOKENS = ['CRITICAL', 'WARNING', 'WATCH', 'ALERT', 'NORMAL'];

  /**
   * Recursively audits rendered structures for technical leaks under BOARD or EXECUTIVE profiles.
   */
  public static audit(target: any, layer: PresentationLayer): LanguageLeakAuditResult {
    if (layer === 'TECHNICAL') {
      return { status: 'PASS', violations: [] };
    }

    const violations: string[] = [];

    const checkString = (str: string, key?: string) => {
      // DFC is allowed under technical keys
      const isAllowedKeyForDFC = key && [
        'sourceModule', 'engineId', 'debug', 'source', 'severity', 
        'rationale', 'id', 'key', 'status', 'rawRiskLevel', 'semanticLabel', 'level'
      ].includes(key);

      // Check Level 1
      for (const token of this.LEVEL1_TOKENS) {
        const regex = new RegExp(`\\b${token}\\b`, 'i');
        if (regex.test(str)) {
          violations.push(`Visual leak: "${str}" contains Level 1 forbidden term "${token}".`);
        }
      }

      // Check Level 2
      for (const token of this.LEVEL2_TOKENS) {
        if (token === 'DFC' && isAllowedKeyForDFC) {
          continue;
        }
        const regex = new RegExp(`\\b${token}\\b`, 'i');
        if (regex.test(str)) {
          violations.push(`Visual leak: "${str}" contains Level 2 forbidden term "${token}".`);
        }
      }

      // Check Level 3 (raw untranslated uppercase forms)
      for (const token of this.LEVEL3_TOKENS) {
        const regex = new RegExp(`\\b${token}\\b`, 'g'); // case-sensitive check for raw uppercase token
        if (regex.test(str)) {
          violations.push(`Visual leak: "${str}" contains raw untranslated Level 3 term "${token}".`);
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
        status: 'EXECUTIVE_LANGUAGE_LEAK',
        violations
      };
    }

    return { status: 'PASS', violations: [] };
  }
}
