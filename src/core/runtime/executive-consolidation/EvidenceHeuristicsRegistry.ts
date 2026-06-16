export interface EvidenceHeuristic {
  healthyRange: string;
  interpretation: string;
  trend: 'stable' | 'improving' | 'worsening' | 'neutral';
  confidence: string;
}

export class EvidenceHeuristicsRegistry {
  public static getHeuristics(indicatorName: string, value: number, format: 'percentage' | 'multiplier' | 'currency' | 'absolute'): EvidenceHeuristic {
    const defaultHeuristic: EvidenceHeuristic = {
      healthyRange: 'N/A',
      interpretation: 'Monitoramento contínuo',
      trend: 'stable',
      confidence: 'Média'
    };

    if (!indicatorName) return defaultHeuristic;

    const nameLower = indicatorName.toLowerCase();

    // Liquidez Corrente
    if (nameLower.includes('corrente') || nameLower.includes('current ratio')) {
      return {
        healthyRange: '> 1.5x',
        interpretation: value >= 1.5 ? 'Liquidez confortável' : (value >= 1.0 ? 'Liquidez restrita' : 'Risco de insolvência curto prazo'),
        trend: 'stable',
        confidence: 'Alta'
      };
    }

    // Liquidez Seca
    if (nameLower.includes('seca') || nameLower.includes('quick ratio')) {
      return {
        healthyRange: '> 1.0x',
        interpretation: value >= 1.0 ? 'Forte capacidade de pagamento sem estoques' : 'Dependência de giro de estoques',
        trend: 'stable',
        confidence: 'Alta'
      };
    }

    // Liquidez Imediata
    if (nameLower.includes('imediata') || nameLower.includes('cash ratio')) {
      return {
        healthyRange: '0.2x - 0.5x',
        interpretation: value > 0.5 ? 'Excesso de caixa' : (value >= 0.2 ? 'Caixa transacional adequado' : 'Caixa sob pressão'),
        trend: 'stable',
        confidence: 'Alta'
      };
    }

    // Endividamento Geral / Debt-to-Equity
    if (nameLower.includes('endividamento') || nameLower.includes('dívida / patrimônio líquido') || nameLower.includes('debt-to-equity')) {
      return {
        healthyRange: '< 100%',
        interpretation: value > 1.0 ? 'Alta alavancagem estrutural' : 'Baixa alavancagem estrutural',
        trend: 'stable',
        confidence: 'Média'
      };
    }

    // Autonomia Financeira
    if (nameLower.includes('autonomia') || nameLower.includes('independência')) {
      return {
        healthyRange: '> 40%',
        interpretation: value > 0.4 ? 'Capital próprio robusto' : 'Dependência de capital de terceiros',
        trend: 'stable',
        confidence: 'Média'
      };
    }

    // Capital de Giro
    if (nameLower.includes('giro') || nameLower.includes('working capital')) {
      return {
        healthyRange: '> 0',
        interpretation: value > 0 ? 'Folga financeira' : 'Necessidade estrutural de caixa',
        trend: 'stable',
        confidence: 'Alta'
      };
    }

    // Retorno sobre Patrimônio Líquido (ROE)
    if (nameLower.includes('roe') || nameLower.includes('retorno')) {
      return {
        healthyRange: '> 15%',
        interpretation: value > 0.15 ? 'Alta geração de valor ao acionista' : 'Geração de valor abaixo do custo de oportunidade',
        trend: 'stable',
        confidence: 'Média'
      };
    }

    return defaultHeuristic;
  }
}
