import { ExecutiveLabelResolver } from './ExecutiveLabelResolver';

export class DisplaySemanticResolver {
  private static readonly FORBIDDEN_KEYS = [
    'value', 'formattedValue', 'amount', 'ratio', 'percentage', 'score', 'currency', 'referenceValue', 'val', 'prevVal', 'reference'
  ];

  public static resolve(keyName: string, text: string): string {
    if (!text) return text;

    if (this.FORBIDDEN_KEYS.includes(keyName)) {
      throw new Error(`[DisplaySemanticResolver] Violation: Attempted to sanitize quantitative field "${keyName}" with value "${text}".`);
    }

    // Double check if text is a formatted number, to catch misnamed variables
    const isNumericOrFormatted = /^R?\$\s*[\d\.,]+$/.test(text.trim()) || /^[\d\.,]+[%x]?$/.test(text.trim()) || /^[\d\.,]+\s*dias$/.test(text.trim());
    
    if (isNumericOrFormatted) {
      throw new Error(`[DisplaySemanticResolver] Violation: Value "${text}" looks like a quantitative field but was passed to semantic resolver.`);
    }

    return ExecutiveLabelResolver.resolve(text);
  }
}
