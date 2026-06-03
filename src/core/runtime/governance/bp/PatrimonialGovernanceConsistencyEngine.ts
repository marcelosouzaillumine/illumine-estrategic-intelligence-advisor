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
  interpretations: { narratives: { family: string; narrative: string }[] };
  patrimonialTrend: any;
  ceilingApplied: boolean;
  efosContext: {
    compositeScore: number;
    institutionalHealth?: string;
  };
  finalClassification?: string;
}

export class PatrimonialGovernanceConsistencyEngine {
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
    const getNarrative = (family: string) => interpretations.narratives.find(n => n.family === family)?.narrative || '';
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
      issues.push(`[Domain 1] CONSISTENCY_FAILURE: Score ${score} should be mapped to ${expectedLabel}, but got ${normalizedClass}.`);
      isFailClosed = true;
    }
    
    if (ceilingApplied) {
      warnings.push(`[Domain 1] CLASSIFICATION_OVERRIDE_APPLIED: Fiduciary classification ceiling overrides the mathematical score.`);
      
      if (finalClassification && normalizedClass !== finalClassification.replace(' STRUCTURE', '')) {
        issues.push(`[Domain 1] FINAL_CLASSIFICATION_ALIGNMENT: Override active but UI classification (${normalizedClass}) does not match final fiduciary classification (${finalClassification}).`);
        isFailClosed = true;
      }
    }

    // ── Domain 2: Classification vs Narratives ─────────────────────────────
    const hasPositiveTone = interpretations.narratives.some(n => 
      n.narrative.includes('sólid') || n.narrative.includes('confort') || 
      n.narrative.includes('resilien') || n.narrative.includes('excelent')
    );
    if ((normalizedClass === 'CRITICAL' || normalizedClass === 'FRAGILE') && hasPositiveTone) {
      issues.push(`[Domain 2] NARRATIVE_CONTRADICTION: Positive narratives found despite ${normalizedClass} classification.`);
      isFailClosed = true;
    }

    // ── Domain 3: Indicators vs Narratives ─────────────────────────────────
    const lc = getIndicatorValue('Liquidez Corrente');
    const liqNarrative = getNarrative('Liquidez');
    if (lc !== null && lc < 1 && (liqNarrative.includes('confort') || liqNarrative.includes('sólid') || liqNarrative.includes('elevad'))) {
      issues.push(`[Domain 3] LIQUIDITY_CONTRADICTION: Liquidez Corrente is ${lc.toFixed(2)}, but narrative expresses comfort.`);
      isFailClosed = true;
    }

    const af = getIndicatorValue('Autonomia Financeira');
    const capNarrative = getNarrative('Estrutura de Capital');
    if (af !== null && af < 0.20 && (capNarrative.includes('independência') || capNarrative.includes('confort') || capNarrative.includes('sólid'))) {
      issues.push(`[Domain 3] CAPITAL_STRUCTURE_CONTRADICTION: Autonomia Financeira is low, but narrative implies structural independence.`);
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
          issues.push(`[Domain 4] TREND_CONTRADICTION: Majority of ${family} indicators are DETERIORATING, but narrative uses positive language without caveats.`);
          isFailClosed = true;
        }
      }
    });

    // ── Domain 5: Trend vs Classification ──────────────────────────────────
    const allDeteriorating = patrimonialTrend?.trends?.filter((t: any) => t.trend === 'DETERIORATING').length || 0;
    const totalTrends = patrimonialTrend?.trends?.length || 0;
    
    if (normalizedClass === 'RESILIENT' && totalTrends > 0 && (allDeteriorating / totalTrends) > 0.5) {
      warnings.push(`[Domain 5] TREND_RISK_WARNING: Classification is RESILIENT but majority of trends are DETERIORATING.`);
    }

    // ── Domain 6: Patrimonial Score vs EFOS ────────────────────────────────
    const efosDiff = score - efosContext.compositeScore;
    if (Math.abs(efosDiff) > 40) {
      warnings.push(`[Domain 6] EFOS_ALIGNMENT_WARNING: High discrepancy between Patrimonial Score (${score}) and EFOS Composite Score (${efosContext.compositeScore}).`);
    }
    
    // ── Domain 7: Critical Indicator Override ──────────────────────────────
    const ls = getIndicatorValue('Liquidez Seca');
    const st = getIndicatorValue('Saldo de Tesouraria');
    const ce = getIndicatorValue('Composição do Endividamento');

    if (lc !== null && lc < 1.00) {
      forcedDisclosures.push('FORCED_CAUTION_DISCLOSURE: Liquidez Corrente is below 1.00 indicating structural short-term pressure.');
      criticalOverrides++;
    }
    if (ls !== null && ls < 0.70) {
      forcedDisclosures.push('FORCED_CAUTION_DISCLOSURE: Liquidez Seca is critically low.');
      criticalOverrides++;
    }
    if (st !== null && st < 0) {
      forcedDisclosures.push('TREASURY_PRESSURE_DISCLOSURE: Negative Treasury Balance implies dependence on external funding for operations.');
      criticalOverrides++;
    }
    if (af !== null && af < 0.20) {
      forcedDisclosures.push('CAPITAL_DEPENDENCY_DISCLOSURE: High dependence on third-party capital (Autonomia Financeira < 20%).');
      criticalOverrides++;
    }
    if (ce !== null && ce > 0.70) {
      forcedDisclosures.push('SHORT_TERM_LIABILITY_PRESSURE: Debt profile is highly concentrated in the short term.');
      criticalOverrides++;
    }

    if (forcedDisclosures.length > 0 && !forcedDisclosures.some(d => d.includes('Apesar dos avanços'))) {
      forcedDisclosures.push('DISCLOSURE OBRIGATÓRIO: Apesar de potenciais avanços observados em determinadas dimensões, a estrutura patrimonial apresenta riscos relevantes que exigem monitoramento contínuo.');
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
