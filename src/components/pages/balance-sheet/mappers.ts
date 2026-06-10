import { BalanceSheetIndicator, BalanceSheetInstitutionalContextInput, BalanceSheetStructuralRestrictionsInput, BalanceSheetGovernanceConsistencyInput } from './types';
import { BalanceSheetIndicatorViewModel, BalanceSheetRiskDivergenceViewModel, BalanceSheetRiskDivergenceTone, BalanceSheetInstitutionalContextViewModel } from './view-models';

export function mapIndicatorsToViewModels(params: {
  indicators?: BalanceSheetIndicator[];
  metricNames: string[];
  resolveLabel: (metricName: string) => string;
}): BalanceSheetIndicatorViewModel[] {
  if (!params.indicators) return [];

  return params.metricNames
    .map((metricName): BalanceSheetIndicatorViewModel | null => {
      const ind = params.indicators?.find((i) => i.metricName === metricName);
      if (!ind) return null;

      return {
        key: metricName,
        label: params.resolveLabel(metricName),
        value: ind.value,
        format: ind.format,
        rationale: ind.rationale,
      };
    })
    .filter((v): v is BalanceSheetIndicatorViewModel => v !== null);
}

export function mapRiskDivergenceToViewModel(params: {
  globalScore?: number;
  patrimonialClassification?: string;
  indicators?: BalanceSheetIndicator[];
  resolveLabel: (key: string) => string;
  resolveImpact: (metric: string) => string;
}): BalanceSheetRiskDivergenceViewModel {
  const score = params.globalScore || 0;
  let mathLabel = 'Crítico';
  if (score >= 80) mathLabel = 'Resiliente';
  else if (score >= 65) mathLabel = 'Estável';
  else if (score >= 50) mathLabel = 'Vulnerável';

  const classStr = params.patrimonialClassification || '';
  let tone: BalanceSheetRiskDivergenceTone = 'critical';
  if (classStr.includes('RESILIENT')) tone = 'primary';
  else if (classStr.includes('STABLE')) tone = 'success';
  else if (classStr.includes('VULNERABLE')) tone = 'warning';

  const criticalOffenders = (params.indicators || [])
    .filter(i => i.classification === 'CRITICAL' || i.classification === 'Crítica' || i.classification === 'Crítico')
    .map(i => ({
      metricName: params.resolveLabel(i.metricName),
      classification: params.resolveLabel(i.classification || ''),
      impact: params.resolveImpact(i.metricName)
    }));

  return {
    mathClassificationLabel: mathLabel,
    fiduciaryClassificationLabel: params.resolveLabel(classStr),
    fiduciaryClassificationTone: tone,
    globalScore: score,
    criticalOffenders
  };
}



export function mapInstitutionalContextToViewModel(
  context?: BalanceSheetInstitutionalContextInput,
  maturidadeOverride?: string
): BalanceSheetInstitutionalContextViewModel {
  if (!context) {
    return {
      segment: 'Geral',
      businessModel: 'Não Identificado',
      capitalIntensity: 'Não Identificada',
      stage: maturidadeOverride || 'Pendente'
    };
  }
  return {
    segment: context.segment || 'Geral',
    businessModel: context.businessModel || 'Não Identificado',
    capitalIntensity: context.capitalIntensity || 'Não Identificada',
    stage: maturidadeOverride || context.stage || 'Pendente'
  };
}

import { BalanceSheetTechnicalLayerViewModel, BalanceSheetTechnicalFamilyViewModel, BalanceSheetTechnicalIndicatorViewModel, BalanceSheetTechnicalIndicatorTone } from './view-models';

export function mapTechnicalLayerToViewModel(params: {
  indicators: BalanceSheetIndicator[];
  resolveLabel: (key: string) => string;
}): BalanceSheetTechnicalLayerViewModel {
  const familiesRecord: Record<string, BalanceSheetIndicator[]> = {
    'Liquidez': [],
    'Capital de Giro': [],
    'Estrutura de Capital': [],
    'Imobilização': []
  };

  params.indicators.forEach(ind => {
    if (ind.family && familiesRecord[ind.family]) {
      familiesRecord[ind.family].push(ind);
    }
  });

  const families: BalanceSheetTechnicalFamilyViewModel[] = [];

  Object.entries(familiesRecord).forEach(([family, inds]) => {
    const validIndicators = inds.filter(ind => !['Liquidez Real', 'Liquidez Instantânea Real', 'Liquidez Seca'].includes(ind.metricName));

    const mappedIndicators = validIndicators.map(ind => {
      let tone: BalanceSheetTechnicalIndicatorTone = 'success';
      if (ind.classification === 'INSUFFICIENT_DATA') {
        tone = 'insufficient';
      } else if (ind.severity === 'CRITICAL') {
        tone = 'critical';
      } else if (ind.severity === 'ATTENTION') {
        tone = 'warning';
      } else if (ind.severity === 'CAPITAL_IDLE_WARNING') {
        tone = 'info';
      }

      let formattedValue = String(ind.value);
      if (ind.value === 'INSUFFICIENT_DATA') {
        formattedValue = '—';
      } else if (ind.format === 'percentage') {
        formattedValue = (Number(ind.value) * 100).toFixed(1) + '%';
      } else if (ind.format === 'multiplier') {
        formattedValue = Number(ind.value).toFixed(2) + 'x';
      } else if (ind.format === 'decimal') {
        formattedValue = Number(ind.value).toFixed(2);
      } else if (ind.format === 'currency') {
        formattedValue = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(Number(ind.value));
      }

      return {
        label: params.resolveLabel(ind.metricName),
        classificationLabel: params.resolveLabel(ind.classification || '').replace(/_/g, ' '),
        classificationTone: tone,
        formattedValue,
        confidence: ind.confidence,
        rationale: ind.rationale
      };
    });

    families.push({
      familyName: family,
      indicators: mappedIndicators
    });
  });

  return { families };
}

import { 
  BalanceSheetAuditLayerViewModel, 
  BalanceSheetAuditStructuralRestrictionsViewModel, 
  BalanceSheetAuditOverrideViewModel, 
  BalanceSheetAuditConsistencyViewModel, 
  BalanceSheetAuditConsistencyIssueViewModel 
} from './view-models';

export function mapAuditLayerToViewModel(params: {
  structuralRestrictions?: BalanceSheetStructuralRestrictionsInput;
  governanceConsistency?: BalanceSheetGovernanceConsistencyInput;
  resolveLabel: (key: string) => string;
}): BalanceSheetAuditLayerViewModel {
  let structuralRestrictions: BalanceSheetAuditStructuralRestrictionsViewModel | undefined;
  
  if (params.structuralRestrictions) {
    const hardcodedOverrides = [
      'Liquidity Fragility Override', 
      'Treasury Stress Override', 
      'Short-Term Debt Concentration Override', 
      'Capital Dependency Override', 
      'Earnings Quality Override'
    ];

    const overrides: BalanceSheetAuditOverrideViewModel[] = [];
    
    hardcodedOverrides.forEach(overrideName => {
      const activeOverride = params.structuralRestrictions?.appliedOverrides?.find(o => o.name === overrideName);
      if (activeOverride) {
        overrides.push({
          overrideNameLabel: params.resolveLabel(overrideName),
          severityLabel: params.resolveLabel(activeOverride.severity)
        });
      }
    });

    structuralRestrictions = {
      overrides,
      originalClassificationLabel: params.resolveLabel(params.structuralRestrictions.originalClassification),
      classificationCeilingLabel: params.structuralRestrictions.classificationCeiling 
        ? params.resolveLabel(params.structuralRestrictions.classificationCeiling) 
        : 'NENHUM'
    };
  }

  let governanceConsistency: BalanceSheetAuditConsistencyViewModel | undefined;

  if (params.governanceConsistency) {
    let statusTone: 'success' | 'critical' | 'warning' = 'warning';
    if (params.governanceConsistency.consistencyStatus === 'CONSISTENT') {
      statusTone = 'success';
    } else if (params.governanceConsistency.consistencyStatus === 'FAIL_CLOSED') {
      statusTone = 'critical';
    }

    const issues: BalanceSheetAuditConsistencyIssueViewModel[] = [];

    params.governanceConsistency.detectedIssues?.forEach(issue => {
      issues.push({ type: 'critical', typeLabel: 'Falha Crítica', message: issue });
    });
    
    params.governanceConsistency.warnings?.forEach(warning => {
      issues.push({ type: 'warning', typeLabel: 'Alerta', message: warning });
    });

    params.governanceConsistency.forcedDisclosures?.forEach(disclosure => {
      issues.push({ type: 'disclosure', typeLabel: 'Comunicação Prudencial Obrigatória', message: disclosure });
    });

    governanceConsistency = {
      statusLabel: params.resolveLabel(params.governanceConsistency.consistencyStatus),
      statusTone,
      hasIssues: issues.length > 0,
      issues
    };
  }

  return {
    structuralRestrictions,
    governanceConsistency
  };
}
