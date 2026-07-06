import { PatrimonialIndicator } from './BalanceSheetFinancialMetricsEngine';
import { PatrimonialScoreBreakdown } from './PatrimonialScoreExplainabilityEngine';

export interface PatrimonialGovernanceConsistencyOutput {
  consistencyStatus: 'CONSISTENT' | 'MINOR_WARNINGS' | 'MATERIAL_WARNINGS' | 'FAIL_CLOSED';
  confidenceScore: number;
  detectedIssues: string[];
  warnings: string[];
  forcedDisclosures: string[];
  severity: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  rationale: string;
  lineageHash: string;
}

export interface ConsistencyEngineInputs {
  bpIndicators: PatrimonialIndicator[];
  scoreBreakdown: PatrimonialScoreBreakdown;
  classification: { label: string; rationale: string };
  interpretations: { patrimonialThesis: string; dominantRiskFamily: string; };
  patrimonialTrend: any;
  ceilingApplied: boolean;
  efosContext: {
    compositeScore: number;
    institutionalHealth?: string;
  };
  finalClassification?: string;
}

export class PatrimonialGovernanceConsistencyEngine {
  constructor(...args: any[]) {}
  [key: string]: any;
  static [key: string]: any;
  public static evaluate(inputs: ConsistencyEngineInputs): PatrimonialGovernanceConsistencyOutput {
    const issues: string[] = [];
    const warnings: string[] = [];
    const forcedDisclosures: string[] = [];
    let isFailClosed = false;
    let criticalOverrides = 0;

    const {
      bpIndicators,
      scoreBreakdown,
      classification,
      interpretations,
      patrimonialTrend,
      ceilingApplied,
      efosContext,
      finalClassification
    } = inputs;

    // Helper
    const getNarrative = (family: string) => interpretations.patrimonialThesis || '';
    const getIndicatorValue = (metric: string) => {
      const ind = bpIndicators.find(i => i.metricName === metric);
      return ind && typeof ind.value === 'number' ? ind.value : null;
    };

    // ── Domain 1: Score vs Classification ──────────────────────────────────
    const score = scoreBreakdown.globalScore;
    let expectedLabel = 'CRITICAL';
    if (score >= 80) expectedLabel = 'RESILIENT';
    else if (score >= 65) expectedLabel = 'STABLE';
    else if (score >= 50) expectedLabel = 'VULNERABLE';
    else if (score >= 35) expectedLabel = 'FRAGILE';

    // The InstitutionalPatrimonialClassificationEngine maps:
    // RESILIENT STRUCTURE, STABLE STRUCTURE, VULNERABLE STRUCTURE, FRAGILE STRUCTURE, CRITICAL STRUCTURE
    const normalizedClass = classification.label.replace(' STRUCTURE', '');
    if (!ceilingApplied && normalizedClass !== expectedLabel) {
      issues.push(`Falha de Consistência: O score matemático (${score}) deveria corresponder a classificação ${expectedLabel}, mas a interface reporta ${normalizedClass}.`);
      isFailClosed = true;
    }
    
    if (ceilingApplied) {      
      if (finalClassification && normalizedClass !== finalClassification.replace(' STRUCTURE', '')) {
        issues.push(`Alinhamento Fiduciário: A classificação de exibição (${normalizedClass}) difere do veredito fiduciário final (${finalClassification}).`);
        isFailClosed = true;
      }
    }

    // ── Domain 2: Lexical Leakage Validation (Fiduciary Guard) ─────────────────────────────
    const combinedText = (interpretations.patrimonialThesis).toLowerCase();
    const hasPositiveTone = combinedText.includes('sólid') || combinedText.includes('confort') || 
                            combinedText.includes('resilien') || combinedText.includes('excelent');
    if ((normalizedClass === 'CRITICAL' || normalizedClass === 'FRAGILE') && hasPositiveTone) {
      issues.push(`Contradição Narrativa: Termos otimistas encontrados na tese executiva apesar da classificação de risco ${normalizedClass}.`);
      isFailClosed = true;
    }

    // ── Domain 3: Indicators vs Narratives ─────────────────────────────────
    const lc = getIndicatorValue('Liquidez Corrente');
    const liqNarrative = getNarrative('Liquidez');
    if (lc !== null && lc < 1 && (liqNarrative.includes('confort') || liqNarrative.includes('sólid') || liqNarrative.includes('elevad'))) {
      issues.push(`Contradição de Liquidez: Liquidez Corrente estruturalmente baixa (${lc.toFixed(2)}), porém o parecer do conselho ignora a fragilidade.`);
      isFailClosed = true;
    }

    const af = getIndicatorValue('Autonomia Financeira');
    const capNarrative = getNarrative('Estrutura de Capital');
    if (af !== null && af < 0.20 && (capNarrative.includes('independência') || capNarrative.includes('confort') || capNarrative.includes('sólid'))) {
      issues.push(`Contradição de Capital: Elevada dependência de capital de terceiros, divergindo de uma narrativa de independência estrutural.`);
      isFailClosed = true;
    }

    // ── Domain 4: Trend vs Narrative ───────────────────────────────────────
    const trendNarrativeFamilyMap: Record<string, string[]> = {
      'Liquidez': [
        'Liquidez Corrente', 'Liquidez Seca', 'Liquidez Geral', 'Liquidez Imediata'
      ],
      'Capital de Giro': [
        'Necessidade de Capital de Giro (NCG)', 'Capital de Giro Líquido (CGL)', 'Saldo de Tesouraria'
      ],
      'Estrutura de Capital': [
        'Endividamento Geral', 'Participação de Capital de Terceiros', 'Autonomia Financeira', 'Composição do Endividamento'
      ],
      'Imobilização': [
        'Imobilização do Patrimônio Líquido', 'Dependência de Capital de Terceiros'
      ]
    };

    Object.keys(trendNarrativeFamilyMap).forEach(family => {
      const familyMetrics = trendNarrativeFamilyMap[family];
      const familyTrends = patrimonialTrend?.trends?.filter((t: any) => familyMetrics.includes(t.metricName)) || [];
      const deterioratingCount = familyTrends.filter((t: any) => t.trend === 'DETERIORATING').length;
      
      if (familyTrends.length > 0 && deterioratingCount > familyTrends.length / 2) {
        const narrative = getNarrative(family);
        if (narrative.includes('fortalec') || narrative.includes('resiliên') || narrative.includes('confort') || narrative.includes('avanço')) {
          issues.push(`Contradição de Tendência Histórica: A família ${family} apresenta deterioração progressiva, mas a narrativa ignora os riscos.`);
          isFailClosed = true;
        }
      }
    });

    // ── Domain 5: Trend vs Classification ──────────────────────────────────
    const allDeteriorating = patrimonialTrend?.trends?.filter((t: any) => t.trend === 'DETERIORATING').length || 0;
    const totalTrends = patrimonialTrend?.trends?.length || 0;
    
    if (normalizedClass === 'RESILIENT' && totalTrends > 0 && (allDeteriorating / totalTrends) > 0.5) {
      warnings.push(`Risco de Tendência: A estrutura é considerada Resiliente, porém a maioria dos indicadores históricos aponta deterioração estrutural.`);
    }

    // ── Domain 6: Patrimonial Score vs EFOS ────────────────────────────────
    const efosDiff = score - efosContext.compositeScore;
    if (Math.abs(efosDiff) > 40) {
      warnings.push(`Alerta de Alinhamento Multidimensional: Forte discrepância entre a vitalidade patrimonial (${score}) e a performance global do EFOS (${efosContext.compositeScore}).`);
    }
    
    // ── Domain 7: Critical Indicator Override ──────────────────────────────
    const ls = getIndicatorValue('Liquidez Seca');
    const st = getIndicatorValue('Saldo de Tesouraria');
    const ce = getIndicatorValue('Composição do Endividamento');

    if (lc !== null && lc < 1.00) {
      forcedDisclosures.push('Divulgação Prudencial Obrigatória: Liquidez Corrente inferior a 1.00, indicando pressão estrutural de curto prazo.');
      criticalOverrides++;
    }
    if (ls !== null && ls < 0.70) {
      forcedDisclosures.push('Divulgação Prudencial Obrigatória: Liquidez Seca em patamar crítico.');
      criticalOverrides++;
    }
    if (st !== null && st < 0) {
      forcedDisclosures.push('Pressão de Tesouraria: Saldo Negativo de Tesouraria implica dependência de recursos externos para giro operacional.');
      criticalOverrides++;
    }
    if (af !== null && af < 0.20) {
      forcedDisclosures.push('Dependência Estrutural de Capital: Elevada dependência de capital de terceiros (Autonomia Financeira < 20%).');
      criticalOverrides++;
    }
    if (ce !== null && ce > 0.70) {
      forcedDisclosures.push('Concentração de Obrigações no Curto Prazo: Perfil de endividamento fortemente concentrado no curto prazo.');
      criticalOverrides++;
    }

    if (forcedDisclosures.length > 0 && !forcedDisclosures.some(d => d.includes('Apesar dos avanços'))) {
      forcedDisclosures.push('Apesar de potenciais avanços observados em determinadas dimensões, a estrutura patrimonial apresenta riscos relevantes que exigem monitoramento contínuo.');
    }

    if (criticalOverrides >= 3) {
      isFailClosed = true;
    }

    // ── Resolve Status & Confidence ────────────────────────────────────────
    let status: PatrimonialGovernanceConsistencyOutput['consistencyStatus'] = 'CONSISTENT';
    let severity: PatrimonialGovernanceConsistencyOutput['severity'] = 'LOW';
    let confidenceScore = 100;

    if (isFailClosed) {
      status = 'FAIL_CLOSED';
      severity = 'CRITICAL';
      confidenceScore = Math.min(confidenceScore, 60); // As instructed, block at 60
    } else if (criticalOverrides >= 2 || issues.length > 0) {
      status = 'MATERIAL_WARNINGS';
      severity = 'HIGH';
      confidenceScore = 75;
    } else if (warnings.length > 0 || criticalOverrides > 0) {
      status = 'MINOR_WARNINGS';
      severity = 'MODERATE';
      confidenceScore = 90;
    }

    return {
      consistencyStatus: status,
      confidenceScore,
      detectedIssues: issues,
      warnings,
      forcedDisclosures,
      severity,
      rationale: isFailClosed ? 'Inconsistências críticas bloqueiam a validação fiduciária do módulo patrimonial.' :
                 status === 'CONSISTENT' ? 'Governança fiduciária validada. Nenhuma contradição material encontrada.' :
                 'Avisos materiais encontrados na estruturação patrimonial. Recomenda-se cautela interpretativa.',
      lineageHash: `PGC-${Date.now().toString(36)}-${Math.random().toString(36).substr(2, 5)}`.toUpperCase()
    };
  }
}
