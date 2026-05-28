// src/core/runtime/ExecutivePriorityConsolidationEngine.ts
import { InstitutionalFinancialThesisProfile } from './InstitutionalFinancialThesisEngine';
import { CausalityPropagationLink } from './CrossStatementCausalityEngine';

export interface ExecutiveAction {
  id: string;
  category: string;
  title: string;
  expectedImpact: string;
  fiduciaryEvidence: string;
  priority: 'Crítica' | 'Alta' | 'Moderada';
}

export function consolidateExecutivePriorities(
  thesisProfile: InstitutionalFinancialThesisProfile,
  tensions: CausalityPropagationLink[]
): ExecutiveAction[] {
  
  const priorities: ExecutiveAction[] = [];

  if (!thesisProfile.isAvailable) {
    return priorities; // Empty action matrix in fail-closed
  }

  // Deduplicate and rank by structural severity (not alert count)
  
  // 1. Process Structural Risks from Thesis Engine
  thesisProfile.structuralRisks.forEach((risk, index) => {
    if (risk.severity === 'ALTA' && !priorities.some(p => p.id === risk.id)) {
      priorities.push({
        id: risk.id,
        category: `Risco Estrutural: ${risk.component}`,
        title: `Mitigação Imediata: ${risk.id.replace(/_/g, ' ')}`,
        expectedImpact: 'Prevenção de colapso de liquidez ou drenagem de capital estrutural.',
        fiduciaryEvidence: `Identificado pelo motor institucional na camada ${risk.component}.`,
        priority: 'Crítica'
      });
    }
  });

  // 2. Process Tensions from Causality Engine
  tensions.forEach((tension, index) => {
    if ((tension.severity === 'CRÍTICA' || tension.severity === 'ALTA') && !priorities.some(p => p.id === `TENSION_${index}`)) {
      priorities.push({
        id: `TENSION_${index}`,
        category: `Tensão Causal: ${tension.source} → ${tension.target}`,
        title: `Desbloqueio de Propagação: ${tension.mechanism}`,
        expectedImpact: 'Restauração da integridade causal e alinhamento do ciclo.',
        fiduciaryEvidence: tension.evidence,
        priority: tension.severity === 'CRÍTICA' ? 'Crítica' : 'Alta'
      });
    }
  });

  // 3. Process Pressures from Thesis Engine
  thesisProfile.pressures.forEach((pressure, index) => {
    if (pressure.severity === 'ALTA' && !priorities.some(p => p.id === pressure.id)) {
      priorities.push({
        id: pressure.id,
        category: `Pressão Institucional: ${pressure.component}`,
        title: `Alívio Estrutural: ${pressure.id.replace(/_/g, ' ')}`,
        expectedImpact: 'Recuperação da eficiência e redução de atrito financeiro.',
        fiduciaryEvidence: `Vulnerabilidade detectada pelo motor institucional na camada ${pressure.component}.`,
        priority: 'Moderada'
      });
    }
  });

  // Sort logically: Critical -> Alta -> Moderada
  const sortMap = { 'Crítica': 0, 'Alta': 1, 'Moderada': 2 };
  return priorities.sort((a, b) => sortMap[a.priority] - sortMap[b.priority]);
}

export class ExecutivePriorityConsolidationEngine {
  public static consolidate(
    actions: string[],
    tensionsInput: any[],
    cashFlowReport: any,
    capitalGovernanceReport: any,
    metrics: any
  ): string[] {
    const isEroded = capitalGovernanceReport?.isAvailable && 
                     (capitalGovernanceReport.preservation?.preservationStatus === 'DRENADO' ||
                      capitalGovernanceReport.behavior?.governanceMaturity === 'DESTRUTIVA');

    return actions.filter(action => {
      const lower = action.toLowerCase();
      if (isEroded) {
        if (lower.includes('distrib') || lower.includes('dividendo') || lower.includes('payout')) {
          return false; // Block it!
        }
      }
      return true;
    });
  }
}
