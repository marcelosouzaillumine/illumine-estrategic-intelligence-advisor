// src/core/runtime/observability/ThesisStabilityEngine.ts
import { InstitutionalFinancialThesisProfile } from '../InstitutionalFinancialThesisEngine';

export interface StabilityMetrics {
  isStable: boolean;
  sensitivityScore: number; // 0 to 1
  oscillationsPrevented: number;
}

export function applyNarrativeHysteresis(
  currentProfile: InstitutionalFinancialThesisProfile,
  previousProfile: InstitutionalFinancialThesisProfile | null
): { stabilizedProfile: InstitutionalFinancialThesisProfile; stability: StabilityMetrics } {
  
  // Se não há baseline anterior, a tese atual assume estabilidade natural.
  if (!previousProfile || !previousProfile.isAvailable) {
    return {
      stabilizedProfile: currentProfile,
      stability: { isStable: true, sensitivityScore: 0.1, oscillationsPrevented: 0 }
    };
  }

  let oscillationsPrevented = 0;
  const stabilizedProfile = { ...currentProfile, structuralRisks: [...currentProfile.structuralRisks] };

  // Hysteresis Rule 1: Severity Flip Protection
  // Se a severidade atual é MODERADA mas a anterior era CRÍTICA, e o delta de score for baixo,
  // nós seguramos em ALTA para não dar uma sensação de falso alívio repentino.
  const severities = { 'BAIXA': 0, 'MODERADA': 1, 'ALTA': 2, 'CRÍTICA': 3, 'INDISPONÍVEL': -1 };
  const prevSev = severities[previousProfile.consolidatedSeverity];
  const currSev = severities[currentProfile.consolidatedSeverity];

  if (prevSev === 3 && currSev === 1) {
    stabilizedProfile.consolidatedSeverity = 'ALTA';
    oscillationsPrevented++;
  }

  // Hysteresis Rule 2: Risk Persistence (Micro-oscillations)
  // Se um risco existia antes, sumiu agora, mas a margem foi muito apertada (simulado pelo fato de que a severidade geral ainda é ALTA)
  // Manteríamos o risco com flag "Em Observação"
  // (Simplificado para o contexto fiduciário atual)
  
  const sensitivityScore = (Math.abs(currSev - prevSev) / 3) + (oscillationsPrevented * 0.2);

  return {
    stabilizedProfile,
    stability: {
      isStable: oscillationsPrevented === 0 && Math.abs(currSev - prevSev) <= 1,
      sensitivityScore: Math.min(1, sensitivityScore),
      oscillationsPrevented
    }
  };
}
