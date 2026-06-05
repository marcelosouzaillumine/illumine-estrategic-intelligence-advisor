import { ExecutiveNarrativeSanitizer } from './ExecutiveNarrativeSanitizer';

export interface ExecutiveRecommendation {
  text: string;
  type: 'BOARD' | 'EXECUTIVE';
  impact: 'Muito Alto' | 'Alto' | 'Moderado' | 'Baixo';
  domain?: string;
}

export class ExecutiveRecommendationDeduplicationEngine {
  /**
   * Elimina duplicidades e conflitos nas recomendações.
   * Mantém o limite de Top 3 (Board) e Top 5 (Executiva).
   */
  public static deduplicate(recommendations: ExecutiveRecommendation[]): {
    boardTop3: ExecutiveRecommendation[];
    executiveTop5: ExecutiveRecommendation[];
  } {
    const boardItems: ExecutiveRecommendation[] = [];
    let executiveItems: ExecutiveRecommendation[] = [];
    
    // Conjunto para evitar itens semanticamente próximos ou idênticos (simple deduplication by exact text lowercase)
    const seenText = new Set<string>();

    let hasCaixa = false;
    let hasLiquidez = false;
    let hasTesouraria = false;

    // Allowed domains for executive
    const allowedDomains = ['Caixa', 'Receita', 'Custos', 'Operação', 'Processos', 'Governança Operacional'];

    // First pass: detect concepts
    for (const rec of recommendations) {
      const cleanText = ExecutiveNarrativeSanitizer.sanitize(rec.text).trim().toLowerCase();
      if (cleanText.includes('caixa')) hasCaixa = true;
      if (cleanText.includes('liquidez')) hasLiquidez = true;
      if (cleanText.includes('tesouraria')) hasTesouraria = true;
    }

    let mergedLiquidityAdded = false;

    for (const rec of recommendations) {
      const sanitizedText = ExecutiveNarrativeSanitizer.sanitize(rec.text).trim();
      const cleanText = sanitizedText.toLowerCase();
      
      // Remove empty, action-less, or non-verb starting items after sanitization
      if (!cleanText || cleanText.length < 5 || (rec.type === 'EXECUTIVE' && !ExecutiveNarrativeSanitizer.hasValidExecutiveVerb(sanitizedText))) {
        continue;
      }

      // Filter by domain for executive if defined
      let itemDomain = rec.domain || 'Operação';
      if (rec.type === 'EXECUTIVE' && !allowedDomains.includes(itemDomain)) {
        itemDomain = 'Operação'; // Fallback to safe domain
      }
      
      // Se for redundante do conceito de liquidez/caixa e já temos os 3, consolidamos
      if ((hasCaixa && hasLiquidez) || (hasCaixa && hasTesouraria)) {
        if (cleanText.includes('caixa') || cleanText.includes('liquidez') || cleanText.includes('tesouraria')) {
          if (!mergedLiquidityAdded) {
            executiveItems.push({
              text: 'Implementar plano emergencial de preservação de caixa e estabilização de tesouraria.',
              type: 'EXECUTIVE',
              impact: 'Muito Alto',
              domain: 'Caixa'
            });
            mergedLiquidityAdded = true;
          }
          continue; // Pula os redundantes
        }
      }

      if (seenText.has(cleanText)) {
        continue;
      }

      seenText.add(cleanText);

      const sanitizedRec: ExecutiveRecommendation = {
        ...rec,
        text: sanitizedText,
        domain: itemDomain
      };

      if (sanitizedRec.type === 'BOARD') {
        if (boardItems.length < 3) {
          boardItems.push(sanitizedRec);
        }
      } else {
        if (executiveItems.length < 5) {
          executiveItems.push(sanitizedRec);
        }
      }
    }

    // Force exact 5 for executive items by slicing or padding
    executiveItems = executiveItems.slice(0, 5);

    return {
      boardTop3: boardItems,
      executiveTop5: executiveItems
    };
  }
}
