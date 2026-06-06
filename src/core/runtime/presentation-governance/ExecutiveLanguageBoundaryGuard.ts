import { ExecutiveLanguageRegistry } from './ExecutiveLanguageRegistry';

export class ExecutiveLanguageViolationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ExecutiveLanguageViolationError';
  }
}

export class ExecutiveLanguageBoundaryGuard {
  // Level 1: Blocked in all modes under BOARD and EXECUTIVE
  private static readonly LEVEL1_TOKENS = ['EQE', 'CDIL', 'EFSI', 'EFOS', 'ENGINE', 'RUNTIME', 'MODULE'];

  // Level 2: Blocked in BOARD and EXECUTIVE, allowed in TECHNICAL
  private static readonly LEVEL2_TOKENS = ['FCO', 'DFC', 'DRE', 'DLPA', 'BP'];

  // Level 3: Needs translation (blocked if untranslated/raw in BOARD and EXECUTIVE)
  private static readonly LEVEL3_TOKENS = ['CRITICAL', 'WARNING', 'WATCH', 'ALERT', 'NORMAL'];

  /**
   * Translates visual strings and enforces visual language sovereignty boundaries.
   * Under TEST/CI, throws an error if any raw technical token leaks.
   * Under DEV, warns via console and sanitizes.
   * Under PROD, logs and sanitizes.
   */
  public static translate(text: string, currentProfile: string = 'BOARD'): string {
    if (!text) return text;

    const profile = currentProfile.toUpperCase();

    // In TECHNICAL profile, all terms are permitted as-is
    if (profile === 'TECHNICAL') {
      return text;
    }

    const originalText = text;
    let translatedText = ExecutiveLanguageRegistry.translate(text);

    // Identify forbidden tokens present in the translated text
    const leaks: string[] = [];

    // Check Level 1 tokens
    for (const token of this.LEVEL1_TOKENS) {
      const regex = new RegExp(`\\b${token}\\b`, 'i');
      if (regex.test(translatedText)) {
        leaks.push(token);
      }
    }

    // Check Level 2 tokens
    for (const token of this.LEVEL2_TOKENS) {
      const regex = new RegExp(`\\b${token}\\b`, 'i');
      if (regex.test(translatedText)) {
        leaks.push(token);
      }
    }

    // Check Level 3 tokens (must be translated; if the translated text still contains raw uppercase token, it's a leak)
    for (const token of this.LEVEL3_TOKENS) {
      const regex = new RegExp(`\\b${token}\\b`, 'g'); // case-sensitive for raw token
      if (regex.test(translatedText)) {
        leaks.push(token);
      }
    }

    if (leaks.length > 0) {
      const env = typeof process !== 'undefined' ? (process.env.NODE_ENV || 'development') : 'development';
      const isNodeTest = typeof process !== 'undefined' && (process.env.NODE_TEST_CONTEXT !== undefined || process.argv.some(arg => arg.includes('test')));
      const isTestOrCI = env === 'test' || env === 'ci' || env === 'CI' || (typeof process !== 'undefined' && !!process.env.CI) || isNodeTest;
      
      const errorMessage = `[ELSF EXECUTIVE LANGUAGE LEAK] Technical tokens [${leaks.join(', ')}] detected in visual string: "${originalText}" (translated: "${translatedText}") under profile: "${profile}"`;

      if (isTestOrCI) {
        throw new ExecutiveLanguageViolationError(errorMessage);
      } else if (env === 'production') {
        console.error(errorMessage);
      } else {
        console.warn(errorMessage);
      }

      // Auto-sanitize by replacing leaked forbidden tokens
      for (const token of [...this.LEVEL1_TOKENS, ...this.LEVEL2_TOKENS, ...this.LEVEL3_TOKENS]) {
        const regex = new RegExp(`\\b${token}\\b`, 'gi');
        if (regex.test(translatedText)) {
          const replacement = ExecutiveLanguageRegistry.translate(token);
          translatedText = translatedText.replace(regex, replacement !== token ? replacement : '[REDACTED]');
        }
      }
    }

    return translatedText;
  }
}
