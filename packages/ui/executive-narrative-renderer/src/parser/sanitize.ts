/**
 * Executive Narrative Rendering Principle™
 * Este sanitizador garante que nenhuma tag HTML nociva ou links externos 
 * atravessem a fronteira do renderizador executivo.
 */
export function sanitizeNarrative(input: string): string {
  if (!input) return '';
  
  // Remove script tags and content
  let sanitized = input.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  
  // Remove other HTML tags (basic stripping)
  sanitized = sanitized.replace(/<\/?[^>]+(>|$)/g, '');
  
  // Strip external markdown links [Text](http...) -> Text
  sanitized = sanitized.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');

  return sanitized;
}
