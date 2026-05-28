// src/core/runtime/InstitutionalFinancialThesisEngine.ts
import { CashFlowDiagnostics } from './cashflow/cashflow-types';
import { CapitalGovernanceDiagnostics } from './capital-governance/capital-governance-types';

export interface InstitutionalFinancialThesisProfile {
  thesisId: string;
  isAvailable: boolean;
  components: {
    hasDRE: boolean;
    hasBP: boolean;
    hasDFC: boolean;
    hasDLPA: boolean;
  };
  structuralRisks: { id: string; severity: 'ALTA' | 'MODERADA' | 'BAIXA'; component: string }[];
  pressures: { id: string; severity: 'ALTA' | 'MODERADA' | 'BAIXA'; component: string }[];
  consolidatedSeverity: 'CRÍTICA' | 'ALTA' | 'MODERADA' | 'SAUDÁVEL' | 'INDISPONÍVEL';
  sustainabilityStatus: 'SUSTENTÁVEL' | 'VULNERÁVEL' | 'INSUSTENTÁVEL';
}

export function generateInstitutionalFinancialThesisProfile(
  hasDRE: boolean,
  hasBP: boolean,
  dfcDiagnostics: CashFlowDiagnostics,
  dlpaDiagnostics: CapitalGovernanceDiagnostics,
  ebitda: number,
  lucroLiquido: number
): InstitutionalFinancialThesisProfile {
  
  const profile: InstitutionalFinancialThesisProfile = {
    thesisId: `THESIS-${Date.now()}`,
    isAvailable: true,
    components: {
      hasDRE,
      hasBP,
      hasDFC: dfcDiagnostics.isAvailable,
      hasDLPA: dlpaDiagnostics.isAvailable
    },
    structuralRisks: [],
    pressures: [],
    consolidatedSeverity: 'INDISPONÍVEL',
    sustainabilityStatus: 'SUSTENTÁVEL'
  };

  if (!hasDRE && !hasBP && !dfcDiagnostics.isAvailable && !dlpaDiagnostics.isAvailable) {
    profile.isAvailable = false;
    return profile;
  }

  // Evaluate DRE basic risks
  if (hasDRE && ebitda <= 0) {
    profile.structuralRisks.push({ id: 'EBITDA_NEGATIVO', severity: 'ALTA', component: 'DRE' });
  }

  // Evaluate DFC risks
  if (dfcDiagnostics.isAvailable && dfcDiagnostics.operational) {
    if (dfcDiagnostics.operational.pattern === 'OPERACIONAL_DEFICITARIO') {
      profile.structuralRisks.push({ id: 'QUEIMA_DE_CAIXA_OPERACIONAL', severity: 'ALTA', component: 'DFC' });
      profile.sustainabilityStatus = 'INSUSTENTÁVEL';
    } else if (dfcDiagnostics.operational.pattern === 'DEPENDENTE_TERCEIROS') {
      profile.pressures.push({ id: 'DEPENDÊNCIA_DE_TERCEIROS', severity: 'MODERADA', component: 'DFC' });
      if (profile.sustainabilityStatus !== 'INSUSTENTÁVEL') profile.sustainabilityStatus = 'VULNERÁVEL';
    }
  }

  // Evaluate DLPA risks
  if (dlpaDiagnostics.isAvailable && dlpaDiagnostics.preservation) {
    if (dlpaDiagnostics.preservation.preservationStatus === 'DRENADO') {
      profile.structuralRisks.push({ id: 'DRENAGEM_DE_CAPITAL', severity: 'ALTA', component: 'DLPA' });
      profile.sustainabilityStatus = 'INSUSTENTÁVEL';
    }
    if (dlpaDiagnostics.distribution && dlpaDiagnostics.distribution.distributionPressure === 'CRÍTICA') {
      profile.pressures.push({ id: 'PRESSÃO_DE_DISTRIBUIÇÃO', severity: 'ALTA', component: 'DLPA' });
    }
  }

  // Consolidate Severity
  const hasHighRisk = profile.structuralRisks.some(r => r.severity === 'ALTA');
  const hasModerateRisk = profile.structuralRisks.some(r => r.severity === 'MODERADA') || profile.pressures.some(p => p.severity === 'ALTA');

  if (hasHighRisk) {
    profile.consolidatedSeverity = 'CRÍTICA';
  } else if (hasModerateRisk) {
    profile.consolidatedSeverity = 'ALTA';
  } else if (profile.pressures.length > 0) {
    profile.consolidatedSeverity = 'MODERADA';
  } else {
    profile.consolidatedSeverity = 'SAUDÁVEL';
  }

  return profile;
}
