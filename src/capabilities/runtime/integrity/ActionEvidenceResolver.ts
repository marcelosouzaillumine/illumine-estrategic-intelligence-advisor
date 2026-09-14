export type STRATEGIC_ACTION_DOMAIN = 
  | 'UNIT_ECONOMICS'
  | 'OPERATIONAL_EFFICIENCY'
  | 'LIQUIDITY_PRESERVATION'
  | 'CORPORATE_GOVERNANCE'
  | 'CAPITAL_STRUCTURE'
  | 'UNDEFINED';

import { ExecutiveCausalityResolver } from '../../../core/runtime/coherence/ExecutiveCausalityResolver';

export class ActionEvidenceResolver {
  public static resolveDomain(actionText: string): STRATEGIC_ACTION_DOMAIN {
    const lower = actionText.toLowerCase();
    
    if (lower.includes('economia unitária') || lower.includes('unit economics') || lower.includes('margem') || lower.includes('comercial')) {
      return 'UNIT_ECONOMICS';
    }
    if (lower.includes('ponto de equilíbrio') || lower.includes('break-even') || lower.includes('despesas') || lower.includes('admin') || lower.includes('operac')) {
      return 'OPERATIONAL_EFFICIENCY';
    }
    if (lower.includes('caixa') || lower.includes('liquid') || lower.includes('capital de giro') || lower.includes('tesouraria')) {
      return 'LIQUIDITY_PRESERVATION';
    }
    if (lower.includes('sócios') || lower.includes('partes relacionadas') || lower.includes('mútuo') || lower.includes('dividendos') || lower.includes('governança')) {
      return 'CORPORATE_GOVERNANCE';
    }
    if (lower.includes('dívida') || lower.includes('investimento') || lower.includes('estrutura') || lower.includes('passivo')) {
      return 'CAPITAL_STRUCTURE';
    }

    return 'UNDEFINED';
  }

  /**
   * Resolve a evidência fiduciária e o KPI corretos com base na ação proposta.
   */
  public static resolve(actionText: string, metrics: any): { domain: STRATEGIC_ACTION_DOMAIN, evidence: string; kpi: string; expectedImpact: string; executionRisk: string } | null {
    const domain = this.resolveDomain(actionText);
    const causality = ExecutiveCausalityResolver.resolve(domain);

    switch (domain) {
      case 'UNIT_ECONOMICS': {
        const grossMargin = metrics?.margemBruta;
        if (grossMargin !== undefined && grossMargin !== null) {
          return {
            ...causality,
            evidence: `Margem Bruta (Unit Economics primário) encontra-se em ${grossMargin.toFixed(2)}% da Receita Líquida.`
          };
        }
        return {
          ...causality,
          evidence: `Avaliação do DRE Operacional indica a necessidade de calibração de precificação ou mix de vendas.`
        };
      }

      case 'OPERATIONAL_EFFICIENCY': {
        const idxAdmin = metrics?.indiceDespesasAdministrativas;
        if (idxAdmin !== undefined && idxAdmin !== null) {
          return {
            ...causality,
            evidence: `Despesas Administrativas representam ${idxAdmin.toFixed(2)}% da Receita Líquida.`
          };
        }
        return {
          ...causality,
          evidence: `Estrutura de despesas fixas atual impacta o ponto de equilíbrio operacional.`
        };
      }

      case 'LIQUIDITY_PRESERVATION': {
        const currentLiquidity = metrics?.liquidezCorrente;
        if (currentLiquidity !== undefined && currentLiquidity !== null) {
          return {
            ...causality,
            evidence: `Índice de Liquidez Corrente atual é de ${currentLiquidity.toFixed(2)}x as obrigações de ciclo imediato.`
          };
        }
        return {
          ...causality,
          evidence: `Exposição do Passivo Circulante requer reforço do Caixa e Equivalentes.`
        };
      }

      case 'CORPORATE_GOVERNANCE': {
        return {
          ...causality,
          evidence: `Riscos estruturais ou operações com partes relacionadas identificadas no perfil do passivo ou movimentações financeiras.`
        };
      }
      
      case 'CAPITAL_STRUCTURE': {
        const debtCP = metrics?.passivoCirculante;
        const totalLiab = metrics?.passivoTotal;
        if (debtCP !== undefined && totalLiab !== undefined && totalLiab > 0) {
          const ratio = (debtCP / totalLiab) * 100;
          return {
            ...causality,
            evidence: `Concentração de ${ratio.toFixed(2)}% do passivo total com vencimento no ciclo imediato.`
          };
        }
        return {
          ...causality,
          evidence: `Perfil de dívida requer alongamento estrutural para redução da pressão sobre o caixa de ciclo imediato.`
        };
      }

      default:
        return null;
    }
  }
}
