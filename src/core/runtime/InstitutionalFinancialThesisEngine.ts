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
    if (dlpaDiagnostics.preservation.preservationStatus === 'FRAGILIDADE_PATRIMONIAL' || dlpaDiagnostics.preservation.preservationStatus === 'EROSÃO_RELEVANTE') {
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
    const hasDRE = ebitda !== 0 || lucroLiquido !== 0 || (metrics && metrics.hasData);
    const hasBP = bpSummary && Object.keys(bpSummary).length > 0;

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
    if (profile.consolidatedSeverity === 'INDISPONÍVEL') {
      thesis = 'Tese financeira indisponível devido à insuficiência de dados no período selecionado.';
    } else {
      // Build a highly dynamic thesis based on actual metrics
      const formatCurrency = (val: number) => `R$ ${val.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
      
      const ebitdaStr = (ebitda !== null && ebitda !== undefined && ebitda !== 0) ? formatCurrency(ebitda) : null;
      const lucroStr = (lucroLiquido !== null && lucroLiquido !== undefined && lucroLiquido !== 0) ? formatCurrency(lucroLiquido) : null;
      const liqStatus = metrics?.liqCorrente !== undefined && metrics?.liqCorrente !== null ? metrics.liqCorrente.toFixed(2) + 'x' : 'N/A';

      // Build thesis - handle BP-only scenario (no DRE data)
      if (!hasDRE && hasBP) {
        const liquidityClause = metrics?.liqCorrente !== null && metrics?.liqCorrente !== undefined
          ? (metrics.liqCorrente >= 1
              ? `A liquidez corrente de ${liqStatus} indica capacidade adequada de cobertura das obrigações de curto prazo`
              : `A liquidez corrente de ${liqStatus} indica restrição no ciclo de curto prazo`)
          : 'A liquidez operacional requer avaliação detalhada';

        // Already covered by outer 'if (profile.consolidatedSeverity === INDISPONÍVEL)' — this branch is BP-only without INDISPONÍVEL
        thesis = `Análise baseada exclusivamente no Balanço Patrimonial. ${liquidityClause}. Para geração de tese completa com EBITDA, Lucro Líquido e análise de rentabilidade, insira os lançamentos de DRE do mesmo exercício.`;
      } else {
        const profitabilityClause = ebitdaStr
          ? (ebitda > 0
              ? `viabilidade operacional com EBITDA positivo de ${ebitdaStr}`
              : `pressão na geração de caixa operacional (EBITDA de ${ebitdaStr})`)
          : 'análise de EBITDA pendente';

        const bottomLineClause = lucroStr
          ? (lucroLiquido > 0
              ? `sustentada por um lucro líquido de ${lucroStr}`
              : `impactada por um prejuízo líquido de ${lucroStr}`)
          : 'resultado líquido pendente de dados de DRE';

        const liquidityClause = (metrics?.liqCorrente !== null && metrics?.liqCorrente !== undefined)
          ? (metrics.liqCorrente >= 1
            ? `A liquidez corrente de ${liqStatus} sugere conforto no curto prazo`
            : `A liquidez corrente de ${liqStatus} indica aperto no ciclo de curto prazo`)
          : (hasBP ? 'A liquidez corrente não pôde ser calculada pois as contas de Ativo e Passivo Circulante não foram identificadas no Balanço' : 'A liquidez corrente não pôde ser avaliada por falta de dados do Balanço Patrimonial');

      if (profile.consolidatedSeverity === 'CRÍTICA') {
        thesis = `A operação enfrenta severas pressões estruturais que ameaçam sua continuidade. Há ${profitabilityClause}, ${bottomLineClause}. ${liquidityClause}, exigindo intervenção imediata.`;
      } else if (profile.consolidatedSeverity === 'ALTA') {
        thesis = `O modelo de capital apresenta gargalos estruturais relevantes. A empresa mostra ${profitabilityClause}, ${bottomLineClause}. ${liquidityClause}, limitando a sustentabilidade de longo prazo.`;
      } else if (profile.consolidatedSeverity === 'MODERADA') {
        thesis = `A estrutura financeira é funcional, porém existem ineficiências em pontos críticos. Notou-se ${profitabilityClause}, ${bottomLineClause}. ${liquidityClause}.`;
      } else {
        thesis = `A operação demonstra sólido alinhamento, com ${profitabilityClause}, ${bottomLineClause}. ${liquidityClause}, reforçando a capacidade de geração orgânica de valor.`;
      }
      }
    }

    return {
      profile,
      thesis,
      tensions: profile.pressures.map(p => p.id),
      pressures: profile.pressures.map(p => p.id),
      structuralRisks: profile.structuralRisks.map(r => r.id)
    };
  }
}
