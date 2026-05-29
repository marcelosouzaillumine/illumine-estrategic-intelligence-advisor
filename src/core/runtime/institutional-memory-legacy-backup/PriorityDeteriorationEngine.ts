// src/core/runtime/institutional-memory/PriorityDeteriorationEngine.ts
import { CausalityPropagationLink } from '../CrossStatementCausalityEngine';

export interface StructuralRisk {
  id: string;
  severity: 'ALTA' | 'MODERADA' | 'BAIXA';
  component: string;
}

export interface DeteriorationReport {
  deterioratedRisks: string[];
  deterioratedTensions: string[];
  deteriorationFactor: number; // multiplier for severity
}

export function evaluatePriorityDeterioration(
  currentRisks: StructuralRisk[],
  previousRisks: StructuralRisk[],
  currentTensions: CausalityPropagationLink[],
  previousTensions: CausalityPropagationLink[]
): DeteriorationReport {

  const deterioratedRisks: string[] = [];
  const deterioratedTensions: string[] = [];

  if (!previousRisks || !previousTensions) {
    return { deterioratedRisks, deterioratedTensions, deteriorationFactor: 1.0 };
  }

  // Se um risco estrutural está presente no ciclo anterior e no atual, ele deteriora
  for (const risk of currentRisks) {
    const isRecurring = previousRisks.some(prevRisk => prevRisk.id === risk.id);
    if (isRecurring) {
      deterioratedRisks.push(risk.id);
    }
  }

  // Se uma tensão (mesma source e target) continua ocorrendo, ela deteriora (efeito crônico)
  for (const tension of currentTensions) {
    const isRecurring = previousTensions.some(
      prevTension => prevTension.source === tension.source && prevTension.target === tension.target
    );
    if (isRecurring) {
      deterioratedTensions.push(`${tension.source} → ${tension.target}`);
    }
  }

  let deteriorationFactor = 1.0;
  if (deterioratedRisks.length > 0) deteriorationFactor += 0.2;
  if (deterioratedTensions.length > 0) deteriorationFactor += 0.2;

  return {
    deterioratedRisks,
    deterioratedTensions,
    deteriorationFactor
  };
}
