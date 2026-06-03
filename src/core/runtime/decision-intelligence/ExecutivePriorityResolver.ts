export interface ExecutivePriority {
  title: string;
  severity: 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW';
  rationale: string;
  sourceModule: 'BP' | 'DRE' | 'DFC' | 'DLPA';
}

export class ExecutivePriorityResolver {
  /**
   * Constrói e prioriza as recomendações com base no estado geral do relatório de inteligência fiduciária.
   */
  public static resolve(report: any): ExecutivePriority[] {
    const priorities: ExecutivePriority[] = [];

    if (!report) return priorities;

    // 1. DFC Priorities
    const fco = report.metrics?.fiduciary?.fcoOperacionalReal ?? report.metrics?.fco ?? 0;
    const runway = report.metrics?.fiduciary?.cashRunwayInstitucional?.months ?? report.metrics?.fiduciary?.projectedRunwayMonths ?? 0;
    
    if (runway > 0 && runway < 3) {
      priorities.push({
        title: 'Preservação Urgente de Runway',
        severity: 'CRITICAL',
        rationale: `Runway de caixa sob forte compressão (${runway.toFixed(1)} meses). Necessidade imediata de suspensão de saídas não essenciais e renegociação de prazos.`,
        sourceModule: 'DFC'
      });
    } else if (fco < 0) {
      priorities.push({
        title: 'Reversão de Consumo Operacional',
        severity: 'HIGH',
        rationale: 'A operação do negócio consome caixa rotineiramente. Reajustar com urgência o ciclo financeiro de estoques e prazos de recebimento.',
        sourceModule: 'DFC'
      });
    }

    // 2. DLPA/Capital Priorities
    const dlpaReport = report.capitalGovernanceReport ?? report.executiveLayer;
    const lucrosPrejuizos = dlpaReport?.retainedEarnings ?? dlpaReport?.lucrosPrejuizos ?? 0;
    const capitalSocial = dlpaReport?.capitalSocial ?? 0;
    
    if (lucrosPrejuizos < 0) {
      const severity = Math.abs(lucrosPrejuizos) > capitalSocial * 0.5 ? 'CRITICAL' : 'HIGH';
      priorities.push({
        title: 'Recuperação do Capital Social Corrompido',
        severity,
        rationale: 'Prejuízos acumulados estão consumindo o patrimônio líquido da companhia. Suspender distribuições de dividendos discricionários.',
        sourceModule: 'DLPA'
      });
    }

    // 3. DRE Priorities (Earnings / Profitability)
    const netIncome = report.metrics?.netIncome ?? report.metrics?.netProfit ?? 0;
    if (netIncome < 0) {
      priorities.push({
        title: 'Reestruturação de Margens Operacionais',
        severity: 'HIGH',
        rationale: 'A geração econômica está negativa. É necessário revisar a estrutura de custos fixos e otimizar margens de contribuição.',
        sourceModule: 'DRE'
      });
    }

    // 4. BP Priorities (Liquidity / Leverage)
    const kpis = report.metrics?.kpis || [];
    const currentLiquidity = kpis.find((k: any) => k.name === 'Liquidez Corrente')?.val ?? 1.0;
    const liquidezNum = typeof currentLiquidity === 'number' ? currentLiquidity : parseFloat(String(currentLiquidity));
    if (liquidezNum < 1.0) {
      priorities.push({
        title: 'Ajuste de Liquidez Corrente',
        severity: 'HIGH',
        rationale: 'O passivo circulante supera o ativo circulante, indicando forte compressão de liquidez patrimonial a curto prazo.',
        sourceModule: 'BP'
      });
    }

    // Fallback default priority if list is empty
    if (priorities.length === 0) {
      priorities.push({
        title: 'Manutenção Preventiva de Liquidez',
        severity: 'LOW',
        rationale: 'Nenhum desvio crítico detectado. Continuar com o monitoramento ordinário dos fluxos de caixa e capital.',
        sourceModule: 'BP'
      });
    }

    // Sort by severity hierarchy
    const severityOrder = { CRITICAL: 4, HIGH: 3, MODERATE: 2, LOW: 1 };
    priorities.sort((a, b) => severityOrder[b.severity] - severityOrder[a.severity]);

    return priorities.slice(0, 3);
  }
}
