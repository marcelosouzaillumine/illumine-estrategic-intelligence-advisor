// src/core/runtime/capital-governance/EquityPreservationEngine.ts
//
// Eixo 3 — Preservação Patrimonial
// Ref: DLPA_GOVERNANCE_CURATION_PROTOCOL.md
//
// REGRA FIDUCIÁRIA:
// A deterioração patrimonial isolada NÃO implica governança destrutiva.
// Classificações granulares obrigatórias — não colapsar "DRENADO" sem análise.
//
// Escala de erosão:
//   > 100%: PRESERVAÇÃO_SAUDÁVEL
//   85–100%: EROSÃO_MODERADA      (queda até 15%)
//   50–85%:  EROSÃO_RELEVANTE     (queda 15–50%) ← Granatum 2022: 46,5%
//   < 50%:   FRAGILIDADE_PATRIMONIAL

import { EquityPreservationMetrics } from './capital-governance-types';

export function calculateEquityPreservation(
  startingEquity: number,
  endingEquity: number
): EquityPreservationMetrics {

  let equityPreservationRatio = 1;

  if (startingEquity > 0) {
    equityPreservationRatio = endingEquity / startingEquity;
  } else if (startingEquity === 0 && endingEquity > 0) {
    equityPreservationRatio = 2; // crescimento desde zero
  } else if (startingEquity === 0 && endingEquity <= 0) {
    equityPreservationRatio = 0;
  } else if (startingEquity < 0) {
    // PL negativo inicial — qualquer melhora é positiva
    equityPreservationRatio = endingEquity > startingEquity ? 1.1 : 0.9;
  }

  let preservationStatus: EquityPreservationMetrics['preservationStatus'];

  if (endingEquity === startingEquity) {
    preservationStatus = 'NEUTRO';
  } else if (equityPreservationRatio > 1.0) {
    preservationStatus = 'PRESERVAÇÃO_SAUDÁVEL';
  } else if (equityPreservationRatio >= 0.85) {
    preservationStatus = 'EROSÃO_MODERADA';
  } else if (equityPreservationRatio >= 0.50) {
    preservationStatus = 'EROSÃO_RELEVANTE';
  } else {
    preservationStatus = 'FRAGILIDADE_PATRIMONIAL';
  }

  return {
    startingEquity,
    endingEquity,
    equityPreservationRatio,
    preservationStatus
  };
}
