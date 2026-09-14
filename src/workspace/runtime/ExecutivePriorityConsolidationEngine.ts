// src/core/runtime/ExecutivePriorityConsolidationEngine.ts
import { InstitutionalFinancialThesisProfile } from './InstitutionalFinancialThesisEngine';
import { CausalityPropagationLink } from './CrossStatementCausalityEngine';
import { GlobalFiduciaryDistributionEnforcementEngine } from '../../capabilities/runtime/governance/fiduciary-enforcement/GlobalFiduciaryDistributionEnforcementEngine';

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
  tensions: CausalityPropagationLink[],
  enforcementTriggered?: boolean
): ExecutiveAction[] {
  
  const priorities: ExecutiveAction[] = [];

  if (!thesisProfile.isAvailable) {
    return priorities; // Empty action matrix in fail-closed
  }

  // Deduplicate and rank by structural severity (not alert count)
  
  // 1. Process Structural Risks from Thesis Engine
  thesisProfile.structuralRisks.forEach((risk, index) => {
    if (risk.severity === 'ALTA' && !priorities.some(p => p.id === risk.id)) {
      let priority: 'Crítica' | 'Alta' | 'Moderada' = 'Crítica';
      if (enforcementTriggered) {
        // Escalate treasury/resilience priorities under enforcement
        priority = 'Crítica';
      }
      priorities.push({
        id: risk.id,
        category: `Risco Estrutural: ${risk.component}`,
        title: `Mitigação Imediata: ${risk.id.replace(/_/g, ' ')}`,
        expectedImpact: 'Prevenção de colapso de liquidez ou drenagem de capital estrutural.',
        fiduciaryEvidence: `Identificado pelo motor institucional na camada ${risk.component}.`,
        priority
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

  // Block shareholder return optimization narratives under enforcement
  const filtered = enforcementTriggered
    ? priorities.filter(p => !p.title.toLowerCase().includes('shareholder return') && !p.title.toLowerCase().includes('retorno aos acionistas'))
    : priorities;

  // Sort logically: Critical -> Alta -> Moderada
  const sortMap = { 'Crítica': 0, 'Alta': 1, 'Moderada': 2 };
  return filtered.sort((a, b) => sortMap[a.priority] - sortMap[b.priority]);
}

export class ExecutivePriorityConsolidationEngine {
  public static optimismWeight = 1.0;
  public static treasuryPreservationPriority = 'Alta';
  public static institutionalResiliencePriority = 'Alta';

  public static consolidate(
    actions: string[],
    tensionsInput: any[],
    cashFlowReport: any,
    capitalGovernanceReport: any,
    metrics: any
  ): string[] {
    const fiduciaryOutput = capitalGovernanceReport?.fiduciaryOutput;
    const enforcement = GlobalFiduciaryDistributionEnforcementEngine.evaluate(fiduciaryOutput);

    if (enforcement.enforcementTriggered) {
      this.optimismWeight = 0.2;
      this.treasuryPreservationPriority = 'Crítica';
      this.institutionalResiliencePriority = 'Crítica';
    } else {
      this.optimismWeight = 1.0;
      this.treasuryPreservationPriority = 'Alta';
      this.institutionalResiliencePriority = 'Alta';
    }

    const isEroded = enforcement.enforcementTriggered;

    return actions.filter(action => {
      const lower = action.toLowerCase();
      if (isEroded) {
        if (
          lower.includes('distrib') ||
          lower.includes('dividendo') ||
          lower.includes('payout') ||
          lower.includes('shareholder return') ||
          lower.includes('retorno ao acionista') ||
          lower.includes('retirada') ||
          lower.includes('extração')
        ) {
          return false; // Block it!
        }
      }
      return true;
    });
  }
}
