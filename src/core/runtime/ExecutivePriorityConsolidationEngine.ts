import { ConsolidatedCashFlowReport } from './cashflow/cashflow-types';
import { ConsolidatedCapitalGovernanceReport } from './capital-governance/capital-governance-types';

export class ExecutivePriorityConsolidationEngine {
  public static consolidate(
    bpActions: string[],
    dreActions: string[],
    cashFlowReport: ConsolidatedCashFlowReport,
    capitalGovernanceReport: ConsolidatedCapitalGovernanceReport,
    metrics: any
  ): string[] {
    const rawList: string[] = [];

    // 1. Add BP and DRE actions if they exist
    if (bpActions && bpActions.length > 0) {
      rawList.push(...bpActions);
    }
    if (dreActions && dreActions.length > 0) {
      rawList.push(...dreActions);
    }

    // 2. Derive actions based on DFC Runtime (Trilha 1)
    if (cashFlowReport.isAvailable) {
      const fco = cashFlowReport.operational.operatingCashFlow;
      const runway = cashFlowReport.treasury.runwayMonths;
      const pressure = cashFlowReport.treasury.pressureClassification;
      const dependency = cashFlowReport.funding.dependencyClassification;

      if (fco < 0) {
        rawList.push('Ajustar ciclo operacional para conter o consumo imediato de caixa.');
      }
      if (runway !== null && runway < 3) {
        rawList.push('Urgente: Preservar saldo de tesouraria imediato e estabelecer plano emergencial de contingência financeira.');
      } else if (runway !== null && runway < 6) {
        rawList.push('Monitorar runway de caixa e captar preventivamente recursos para evitar estrangulamento.');
      }
      if (pressure === 'SEVERA' || pressure === 'ELEVADA') {
        rawList.push('Negociar obrigações de curto prazo com fornecedores e acelerar recebimento de inadimplentes.');
      }
      if (dependency === 'CRÍTICA') {
        rawList.push('Reduzir dependência de fomento externo e buscar o autofinanciamento operacional.');
      }
    }

    // 3. Derive actions based on DLPA/DMPL Runtime (Trilha 2)
    if (capitalGovernanceReport.isAvailable) {
      const retention = capitalGovernanceReport.retention.retentionEfficiency;
      const distribution = capitalGovernanceReport.distribution.distributionDiscipline;
      const preservation = capitalGovernanceReport.preservation.preservationStatus;
      const behavior = capitalGovernanceReport.behavior.capitalDisciplineRating;

      if (preservation === 'EROSÃO_SEVERA' || preservation === 'EROSÃO_PARCIAL' || distribution === 'DRENAGEM') {
        rawList.push('Suspender ou reduzir retiradas societárias e dividendos para estancar a descapitalização patrimonial.');
      }
      if (retention === 'INSUFICIENTE' || retention === 'CRÍTICA') {
        rawList.push('Adotar política formal de retenção de lucros para fortalecimento das reservas estatutárias.');
      }
      if (behavior === 'CRÍTICA' || behavior === 'DISPLICENTE') {
        rawList.push('Regularizar contratos de mútuo ativos com partes relacionadas para evitar contingências fiscais e societárias.');
      }
    }

    // 4. Derive actions based on Capital Intelligence (EVA/ROIC)
    const roic = metrics?.roic ?? 0;
    const eva = metrics?.eva ?? 0;
    if (roic < 0.05 || eva < 0) {
      rawList.push('Reavaliar eficiência de alocação de CAPEX e focar em projetos de retorno real superior ao custo de capital.');
    }

    // 5. De-duplicate and apply Fiduciary Coherence rules (Contradiction resolution)
    const consolidatedList: string[] = [];
    const lowerActionsSeen = new Set<string>();

    // Determine conflict blocks:
    // If DLPA is in erosion/drain, block any action suggesting distribution or shareholder expansion.
    const blockDistribution = capitalGovernanceReport.isAvailable && 
      (capitalGovernanceReport.preservation.preservationStatus === 'EROSÃO_SEVERA' || 
       capitalGovernanceReport.distribution.distributionDiscipline === 'DRENAGEM');

    // If runway is critical, block any action suggesting heavy CAPEX expansion.
    const blockHeavyCapex = cashFlowReport.isAvailable && 
      cashFlowReport.treasury.runwayClassification === 'RUNWAY_CRITICO';

    for (const action of rawList) {
      if (!action || action.trim().length === 0) continue;

      const lower = action.toLowerCase();

      // Check conflicts
      if (blockDistribution && (lower.includes('distrib') || lower.includes('remuner') || lower.includes('dividendos') || lower.includes('pro-labore') || lower.includes('retirar'))) {
        // Skip/block conflict
        continue;
      }
      if (blockHeavyCapex && (lower.includes('capex') || lower.includes('investimento pesado') || lower.includes('expansão de ativos') || lower.includes('adquirir'))) {
        // Skip/block conflict
        continue;
      }

      // Check soft duplicate / semantic overlap
      let isDuplicate = false;
      for (const seen of lowerActionsSeen) {
        if (seen.includes(lower) || lower.includes(seen)) {
          isDuplicate = true;
          break;
        }
      }

      if (!isDuplicate) {
        consolidatedList.push(action);
        lowerActionsSeen.add(lower);
      }
    }

    // Return maximum of 6 highly aligned executive priorities
    return consolidatedList.slice(0, 6);
  }
}
