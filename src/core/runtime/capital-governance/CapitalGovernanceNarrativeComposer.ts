// src/core/runtime/capital-governance/CapitalGovernanceNarrativeComposer.ts
import { CapitalGovernanceDiagnostics } from './capital-governance-types';

export function composeCapitalGovernanceNarrative(diagnostics: CapitalGovernanceDiagnostics): string {
  if (!diagnostics.isAvailable || !diagnostics.retention || !diagnostics.distribution || !diagnostics.preservation || !diagnostics.capitalization || !diagnostics.behavior) {
    return 'DLPA/DMPL indisponível para análise institucional.';
  }

  let narrative = '';

  // Preservation
  if (diagnostics.preservation.preservationStatus === 'PRESERVADO') {
    narrative += 'O patrimônio institucional demonstra fortalecimento ao longo do ciclo. ';
  } else if (diagnostics.preservation.preservationStatus === 'DRENADO') {
    narrative += 'Observa-se uma erosão do capital estrutural da companhia. ';
  }

  // Retention vs Distribution
  if (diagnostics.retention.retentionStatus === 'DESCAPITALIZAÇÃO') {
    narrative += 'A operação não apenas deixou de reter valor, como consumiu reservas anteriores para cobrir déficits. ';
  } else if (diagnostics.distribution.distributionPressure === 'CRÍTICA') {
    narrative += 'As políticas de distribuição adotadas são agressivas, descapitalizando a empresa frente aos resultados obtidos. ';
  } else if (diagnostics.retention.retentionStatus === 'ALTA_RETENÇÃO') {
    narrative += 'Há um compromisso fiduciário evidente com a retenção de lucros para financiar o crescimento orgânico ou a proteção da liquidez. ';
  }

  // Behavior & Maturity
  if (diagnostics.behavior.governanceMaturity === 'DESTRUTIVA') {
    narrative += 'A dinâmica entre geração, retenção e distribuição revela um comportamento predatório em relação à saúde financeira do negócio.';
  } else if (diagnostics.behavior.governanceMaturity === 'MATURA') {
    narrative += 'A disciplina de capitalização demonstra maturidade institucional na preservação da empresa.';
  }

  if (narrative.trim() === '') {
    narrative = 'O comportamento do capital no período apresenta estabilidade, sem indicativos de fortalecimento robusto ou drenagem severa.';
  }

  return narrative.trim();
}
