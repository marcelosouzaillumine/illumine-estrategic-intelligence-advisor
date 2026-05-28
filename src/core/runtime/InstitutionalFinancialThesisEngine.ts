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

export class InstitutionalFinancialThesisEngine {
  public static generate(
    bpSummary: any,
    ebitda: number,
    lucroLiquido: number,
    cashFlowReport: any,
    capitalGovernanceReport: any,
    metrics: any
  ) {
    const hasDRE = !!metrics;
    const hasBP = !!bpSummary;

    const dfcDiagnostics = cashFlowReport ? {
      isAvailable: cashFlowReport.isAvailable,
      operational: cashFlowReport.operational,
      conversion: cashFlowReport.conversion,
      treasury: cashFlowReport.treasury,
      sustainability: cashFlowReport.sustainability,
      funding: cashFlowReport.funding
    } : { isAvailable: false, operational: null, conversion: null, treasury: null, sustainability: null, funding: null };

    const dlpaDiagnostics = capitalGovernanceReport ? {
      isAvailable: capitalGovernanceReport.isAvailable,
      retention: capitalGovernanceReport.retention,
      distribution: capitalGovernanceReport.distribution,
      preservation: capitalGovernanceReport.preservation,
      capitalization: capitalGovernanceReport.capitalization,
      behavior: capitalGovernanceReport.behavior
    } : { isAvailable: false, retention: null, distribution: null, preservation: null, capitalization: null, behavior: null };

    const profile = generateInstitutionalFinancialThesisProfile(
      hasDRE,
      hasBP,
      dfcDiagnostics,
      dlpaDiagnostics,
      ebitda,
      lucroLiquido
    );

    let thesis = 'A operação demonstra sólido alinhamento entre rentabilidade, liquidez e preservação patrimonial.';
    if (profile.consolidatedSeverity === 'CRÍTICA') {
      thesis = 'A operação enfrenta severas pressões estruturais que ameaçam sua continuidade ou capacidade de geração orgânica de valor.';
    } else if (profile.consolidatedSeverity === 'ALTA') {
      thesis = 'O modelo de capital apresenta gargalos estruturais relevantes que limitam a sustentabilidade de longo prazo.';
    } else if (profile.consolidatedSeverity === 'MODERADA') {
      thesis = 'A estrutura financeira é funcional, porém existem ineficiências em pontos críticos do ciclo institucional.';
    }

    if (ebitda >= 0 && profile.consolidatedSeverity !== 'CRÍTICA') {
      thesis = 'A operação demonstra viabilidade comercial e capacidade de geração de caixa operacional.';
    }

    return {
      thesis,
      tensions: profile.pressures.map(p => p.id),
      pressures: profile.pressures.map(p => p.id),
      structuralRisks: profile.structuralRisks.map(r => r.id)
    };
  }
}
