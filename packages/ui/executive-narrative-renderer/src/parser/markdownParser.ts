import { NarrativeToken } from './tokenTypes';
import { sanitizeNarrative } from './sanitize';

export function parseNarrative(input: string): NarrativeToken[] {
  const sanitized = sanitizeNarrative(input);
  const lines = sanitized.split('\n');
  const tokens: NarrativeToken[] = [];

  for (const line of lines) {
    if (line.trim() === '') {
      tokens.push({ type: 'newline', content: '' });
      continue;
    }

    // Headers: ## Título
    const headerMatch = line.match(/^(#{1,6})\s+(.*)/);
    if (headerMatch) {
      tokens.push({
        type: 'heading',
        level: headerMatch[1].length,
        content: headerMatch[2]
      });
      continue;
    }

    // Lists: - Item ou * Item
    const listMatch = line.match(/^[-*]\s+(.*)/);
    if (listMatch) {
      tokens.push({
        type: 'list_item',
        content: listMatch[1]
      });
      continue;
    }

    // Bold/Emphasis: **Texto:** blabla -> Tratado de forma híbrida
    // Por simplicidade na v1 (limitada), vamos quebrar a linha se começar com **Bold**
    const boldMatch = line.match(/^\*\*(.*?)\*\*(.*)/);
    if (boldMatch) {
      tokens.push({
        type: 'emphasis',
        content: boldMatch[1]
      });
      if (boldMatch[2].trim() !== '') {
        tokens.push({
          type: 'text',
          content: boldMatch[2].trim()
        });
      }
      continue;
    }

    // Texto Puro
    tokens.push({ type: 'text', content: line });
  }

  return tokens;
}
