import { ExecutionCommitment } from './ExecutionGovernanceTypes';

export interface ImpactValidationResult {
  commitmentId: string;
  expectedRevenueImpact: number;
  actualRevenueImpact: number;
  expectedCapex: number;
  actualCapex: number;
  isValidated: boolean;
  impactScore: number; // 0 to 100
  validationNarrative: string;
}

export function validateExecutionImpact(commitment: ExecutionCommitment): ImpactValidationResult {
  const actualRev = commitment.actualRevenueImpact ?? 0;
  const expectedRev = commitment.expectedRevenueImpact;
  
  const actualCap = commitment.actualCapex ?? 0;
  const expectedCap = commitment.expectedCapex;

  let isValidated = true;
  let impactScore = 100;
  let narrative = "Impacto validado com sucesso e dentro das margens fiduciárias esperadas.";

  // Revenue validation
  if (expectedRev > 0) {
    if (actualRev < expectedRev * 0.8) {
      isValidated = false;
      impactScore -= 40;
      narrative = "Desvio crítico no impacto de receita. O resultado realizado está significativamente abaixo do projetado na aprovação pelo conselho.";
    } else if (actualRev < expectedRev) {
      impactScore -= 15;
      narrative = "O impacto de receita ficou levemente abaixo do teto projetado, mas dentro de uma margem aceitável.";
    } else if (actualRev > expectedRev * 1.2) {
      narrative = "Superação excepcional de expectativas no impacto de receita.";
    }
  }

  // Capex/Cost validation
  if (expectedCap > 0) {
    if (actualCap > expectedCap * 1.2) {
      isValidated = false;
      impactScore -= 40;
      narrative += " Alerta: Estouro significativo de orçamento (Capex) em relação à provisão autorizada.";
    } else if (actualCap > expectedCap) {
      impactScore -= 20;
      narrative += " Observação: Pequeno desvio de custo detectado, acima da provisão original.";
    }
  }

  // Cap score between 0 and 100
  impactScore = Math.max(0, Math.min(100, impactScore));

  return {
    commitmentId: commitment.id,
    expectedRevenueImpact: expectedRev,
    actualRevenueImpact: actualRev,
    expectedCapex: expectedCap,
    actualCapex: actualCap,
    isValidated,
    impactScore,
    validationNarrative: narrative.trim()
  };
}
