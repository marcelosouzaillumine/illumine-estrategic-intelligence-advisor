import { ExecutiveAdvisoryReport } from '../../../../lib/executive-advisory-engine';
import { ExecutiveIntelligenceReport } from '../../../../services/FiduciaryRuntimeAdapter';
import { InstitutionalLocaleGuard } from '../../../../services/FiduciaryRuntimeAdapter';
import { ExecutiveLabelResolver } from '../../../../services/FiduciaryRuntimeAdapter';
import { ExecutiveDisclosureResolver } from '../../../../services/FiduciaryRuntimeAdapter';
import { ExecutiveNarrativeDeduplicationEngine } from '../../../../services/FiduciaryRuntimeAdapter';
import { ExecutivePerspectiveViewData, ExecutiveTone, ExecutiveIconKey } from '../view-models/ExecutivePerspectiveViewData';

export interface ExecutivePerspectivePresenterSource {
  advisoryReport?: ExecutiveAdvisoryReport | null;
  intelligenceReport?: ExecutiveIntelligenceReport | null;
  translate: (key: string) => string;
}

export class ExecutivePerspectivePresenter {
  private static ENUM_PT: Record<string, string> = {
    FIRST_OPERATIONAL_YEAR:          'Primeiro ciclo financeiro disponível',
    EARLY_STAGE_CONSOLIDATION:       'Consolidação Inicial',
    GROWTH_STAGE:                    'Estágio de Crescimento',
    SCALE_STAGE:                     'Estágio de Escala',
    MATURE_OPERATION:                'Operação Madura',
    TURNAROUND_DISTRESS:             'Turnaround / Recuperação',
    DECLINE_STAGE:                   'Estágio de Declínio',
    TRANSITION_STAGE:                'Estágio de Transição',
    ASSET_HEAVY:                     'Intensivo em Ativos',
    ASSET_LIGHT:                     'Leve em Ativos',
    CAPITAL_INTENSIVE:               'Intensivo em Capital',
    INVENTORY_DEPENDENT:             'Operação Intensiva em Estoques',
    INVENTORY_INTENSIVE:             'Operação Intensiva em Estoques',
    LABOR_INTENSIVE:                 'Intensivo em Mão de Obra',
    RECURRING_REVENUE:               'Receita Recorrente',
    SEASONAL_REVENUE:                'Receita Sazonal',
    SERVICE_BASED:                   'Baseado em Serviços',
    INDUSTRIAL:                      'Industrial',
    DISTRIBUTION:                    'Distribuição',
    SAAS:                            'SaaS',
    HEALTHCARE:                      'Saúde',
    HOLDING_STRUCTURE:               'Holding',
    FINANCIAL_OPERATION:             'Operação Financeira',
    SINGLE_YEAR_ONLY:                'Apenas um Exercício Disponível',
    LOW_HISTORICAL_DENSITY:          'Histórico Inicial (< 2 anos)',
    MODERATE_HISTORY:                'Histórico Moderado (2–3 anos)',
    STRONG_HISTORICAL_BASE:          'Base Histórica Sólida (4+ anos)',
    HIGH:                            'Alta',
    MODERATE:                        'Moderada',
    LOW:                             'Baixa',
    LIMITED_CONTEXT:                 'Contexto Parcial',
    UNVERIFIABLE:                    'Base Contextual Insuficiente',
    HEALTHY_GROWTH:                  'Crescimento Saudável',
    ARTIFICIAL_GROWTH:               'Crescimento Artificial',
    CASHLESS_GROWTH:                 'Crescimento sem Geração de Caixa',
    DEBT_FINANCED_GROWTH:            'Crescimento Financiado por Dívida',
    SHAREHOLDER_FINANCED_GROWTH:     'Crescimento Financiado por Sócios',
    SUSTAINABLE_OPERATIONAL_EXPANSION: 'Expansão Operacional Sustentável',
    PREMATURE_EXPANSION:             'Expansão Prematura',
    STAGNATION:                      'Estagnação',
    CONTRACTION:                     'Contração',
    HIGH_CONFIDENCE:                 'Alta Confiabilidade',
    MEDIUM_CONFIDENCE:               'Confiabilidade Moderada',
    LOW_CONFIDENCE:                  'Confiabilidade Reduzida',
    FULL_FINANCIAL_VIEW:             'Visão Financeira Completa',
    PARTIAL_FINANCIAL_VIEW:          'Visão Financeira Parcial',
    BALANCE_SHEET_ONLY:              'Apenas Balanço Patrimonial',
    DRE_ONLY:                        'Apenas DRE',
    CASHFLOW_ONLY:                   'Apenas Fluxo de Caixa',
    LONG:                            'Longo',
    MODERATE_CYCLE:                  'Moderado',
    SHORT:                           'Curto',
    NEGATIVE:                        'Negativo',
  };

  private static pt(key: string): string {
    return this.ENUM_PT[key] || key.replace(/_/g, ' ').replace(/^./, c => c.toUpperCase());
  }

  private static getConfidenceTone(confidenceLevel: string): ExecutiveTone {
    if (confidenceLevel === 'HIGH_CONFIDENCE') return 'success';
    if (confidenceLevel === 'MEDIUM_CONFIDENCE') return 'info';
    return 'warning';
  }

  private static getStrategicConfidenceTone(confidence: string): ExecutiveTone {
    if (confidence === 'HIGH') return 'success';
    if (confidence === 'MODERATE') return 'info';
    return 'warning';
  }

  private static getSegmentConfidenceTone(confidenceValue: number): ExecutiveTone {
    if (confidenceValue >= 0.8) return 'success';
    if (confidenceValue >= 0.5) return 'warning';
    return 'critical';
  }

  private static inferManagementArea(actionTitle: string): { label: string; icon: ExecutiveIconKey; tone: ExecutiveTone } {
    const lower = actionTitle.toLowerCase();
    if (lower.includes('receita') || lower.includes('comercial') || lower.includes('venda') || lower.includes('market') || lower.includes('faturamento') || lower.includes('cliente'))
      return { label: 'Gestão Comercial', icon: 'trending-up', tone: 'success' };
    if (lower.includes('pessoa') || lower.includes('equipe') || lower.includes('liderança') || lower.includes('talent') || lower.includes('rh') || lower.includes('humano'))
      return { label: 'Gestão de Pessoas', icon: 'users', tone: 'info' };
    if (lower.includes('caixa') || lower.includes('liquid') || lower.includes('financ') || lower.includes('dívida') || lower.includes('cr') || lower.includes('capital') || lower.includes('investimento'))
      return { label: 'Gestão Financeira', icon: 'dollar-sign', tone: 'attention' };
    if (lower.includes('operac') || lower.includes('processo') || lower.includes('eficiên') || lower.includes('produt') || lower.includes('estrutura') || lower.includes('escala'))
      return { label: 'Gestão Operacional', icon: 'layers', tone: 'warning' };
    if (lower.includes('estratég') || lower.includes('posicion') || lower.includes('mercado') || lower.includes('competi') || lower.includes('inovaç'))
      return { label: 'Gestão Estratégica', icon: 'target', tone: 'attention' };
    return { label: 'Governança Corporativa', icon: 'bar-chart', tone: 'neutral' };
  }

  private static inferPriority(idx: number, actionTitle: string, priorityValue?: string): { label: string; tone: ExecutiveTone } {
    if (priorityValue) {
      if (priorityValue === 'Alta') return { label: 'Alta', tone: 'critical' };
      if (priorityValue === 'Média') return { label: 'Média', tone: 'warning' };
      return { label: 'Normal', tone: 'success' };
    }
    
    const lower = actionTitle.toLowerCase();
    if (lower.includes('imediato') || lower.includes('urgente') || lower.includes('crítico') || lower.includes('risco') || idx === 0)
      return { label: 'Alta', tone: 'critical' };
    if (idx === 1)
      return { label: 'Média', tone: 'warning' };
    return { label: 'Normal', tone: 'success' };
  }

  private static inferTimeline(actionTitle: string, timelineValue?: string): string {
    if (timelineValue) return timelineValue;

    const lower = actionTitle.toLowerCase();
    if (lower.includes('imediato') || lower.includes('curto') || lower.includes('30 dias') || lower.includes('60 dias'))
      return 'Curto Prazo';
    if (lower.includes('médio') || lower.includes('6 meses') || lower.includes('90 dias'))
      return 'Médio Prazo';
    if (lower.includes('longo') || lower.includes('anual') || lower.includes('estratég'))
      return 'Longo Prazo';
    return 'Contínuo';
  }

  private static resolveDominantRisks(report: ExecutiveAdvisoryReport | null, intelligenceReport: ExecutiveIntelligenceReport | null): Array<{ id: string; label: string; severity: ExecutiveTone }> {
    let dominantRisks: string[] = [];
    
    if (intelligenceReport) {
      if (intelligenceReport.institutionalView?.disclosures?.primaryDisclosure) {
        dominantRisks.push(ExecutiveDisclosureResolver.resolve(intelligenceReport.institutionalView.disclosures.primaryDisclosure));
      }
      intelligenceReport.institutionalView?.disclosures?.secondaryDisclosures?.forEach(d => dominantRisks.push(ExecutiveDisclosureResolver.resolve(d)));

      const insights = intelligenceReport.causality?.insights || [];
      const riskInsights = insights.filter((i: any) =>
        (i.bgClass || '').includes('rose') ||
        (i.bgClass || '').includes('red') ||
        (i.colorClass || '').includes('rose') ||
        (i.colorClass || '').includes('red') ||
        (i.category || '').toLowerCase().includes('risco') ||
        (i.category || '').toLowerCase().includes('problem')
      );
      
      let newRisks = riskInsights.map((i: any) => i.text).filter(Boolean);
      dominantRisks.push(...newRisks);

      if (dominantRisks.length === 0 && insights.length > 0) {
        newRisks = insights.slice(0, 2).map((i: any) => i.text).filter(Boolean);
        dominantRisks.push(...newRisks);
      }

      if (dominantRisks.length === 0 && intelligenceReport.causality?.event) {
        const ev = intelligenceReport.causality.event;
        const rc = intelligenceReport.causality.rootCause;
        if (ev && !ev.includes('INSUFFICIENT') && !ev.includes('N/A')) dominantRisks.push(ev);
        if (rc && !rc.includes('INSUFFICIENT') && !rc.includes('N/A')) dominantRisks.push(rc);
      }

      if (dominantRisks.length === 0) {
        const mode = intelligenceReport.compliance?.runtimeMode;
        if (mode === 'BALANCE_SHEET_ONLY') {
          dominantRisks.push('Dados de resultado operacional (DRE) ainda não foram lançados — análise de risco limitada ao Balanço Patrimonial.');
        } else if (mode === 'DRE_ONLY') {
          dominantRisks.push('Dados do Balanço Patrimonial não disponíveis — risco de liquidez e estrutura de capital não podem ser avaliados.');
        } else if (mode === 'PARTIAL_FINANCIAL_VIEW') {
          dominantRisks.push('Visão financeira parcial: complete o lançamento de todos os demonstrativos para identificar riscos dominantes com precisão.');
        } else {
          dominantRisks.push('Nenhum risco estrutural crítico identificado com os dados disponíveis.');
        }
      }
    } else {
      dominantRisks = report?.dominantRisks || [];
    }
    
    const uniqueRisks = ExecutiveNarrativeDeduplicationEngine.deduplicate(dominantRisks).slice(0, 3);
    
    return uniqueRisks.map((risk, index) => ({
      id: `risk-${index}`,
      label: risk,
      severity: 'critical' as ExecutiveTone // Default to critical for dominant risks, can be enhanced later if needed
    }));
  }

  public static transform({
    advisoryReport,
    intelligenceReport,
    translate
  }: ExecutivePerspectivePresenterSource): ExecutivePerspectiveViewData {
    const rawConfidenceLevel = intelligenceReport ? intelligenceReport.compliance?.confidenceLevel || 'HIGH_CONFIDENCE' : advisoryReport?.confidenceLevel || '';
    const confidenceLevel = this.pt(rawConfidenceLevel);
    const confidenceTone = this.getConfidenceTone(rawConfidenceLevel);

    const executivePosture = intelligenceReport ? intelligenceReport.advisory?.priorityFocus || 'Em análise' : advisoryReport?.executivePosture || '';
    const executiveSummary = intelligenceReport ? (intelligenceReport.institutionalView?.narrative.executiveSummary || intelligenceReport.advisory?.executiveSummary || '') : advisoryReport?.executiveSummary || '';
    const institutionalDiagnosis = intelligenceReport ? (intelligenceReport.institutionalView?.causality.executiveInsight || intelligenceReport.causality?.financialPropagation || '') : advisoryReport?.institutionalDiagnosis || '';

    const dominantRisks = this.resolveDominantRisks(advisoryReport || null, intelligenceReport || null);

    const rawPriorities = (intelligenceReport
      ? intelligenceReport.advisory?.actionMatrix || []
      : advisoryReport?.strategicPriorities || []).slice(0, 3);
      
    const strategicPriorities = rawPriorities.map((p: any, idx: number) => {
      const rawText = typeof p === 'string' ? p : (p?.title || p?.acao || '');
      const priorityText = ExecutiveLabelResolver.resolve(rawText, translate);
      return {
        id: `priority-${idx}`,
        label: priorityText,
        priority: 'success' as ExecutiveTone
      };
    });

    const rawActions = intelligenceReport
      ? intelligenceReport.advisory?.actionMatrix || []
      : advisoryReport?.actionMatrix || [];

    const actionMatrix = rawActions.map((action: any, idx: number) => {
      if (action && typeof action === 'object') {
        const originalTitle = action.title || action.acao || '';
        const title = ExecutiveLabelResolver.resolve(originalTitle, translate);
        const mgmt = this.inferManagementArea(title);
        if (action.category) mgmt.label = action.category;
        
        const prio = this.inferPriority(idx, title, action.priority);
        const timeline = this.inferTimeline(title, action.timeline);
        
        return {
          id: `action-${idx}`,
          action: title,
          managementArea: mgmt,
          priority: prio,
          timeline: timeline,
          expectedImpact: action.expectedImpact,
          executionRisk: action.executionRisk,
          monitoringKpi: action.monitoringKPI,
          fiduciaryEvidence: action.fiduciaryEvidence
        };
      } else {
        const originalTitle = typeof action === 'string' ? action : (action?.acao || '');
        const title = ExecutiveLabelResolver.resolve(originalTitle, translate);
        const mgmt = this.inferManagementArea(title);
        const prio = this.inferPriority(idx, title);
        const timeline = this.inferTimeline(title);
        
        return {
          id: `action-${idx}`,
          action: title,
          managementArea: mgmt,
          priority: prio,
          timeline: timeline
        };
      }
    });

    const blockedFalsePositives = intelligenceReport ? [] : advisoryReport?.blockedFalsePositives || [];
    const causalConflicts = intelligenceReport ? [] : advisoryReport?.causalConflicts || [];

    let institutionalContext;
    if (intelligenceReport?.institutionalContext) {
      const segmentConfValue = intelligenceReport.institutionalContext.segmentConfidence?.confidence || 0;
      let segmentInferenceMode = '';
      if (intelligenceReport.institutionalContext.segmentConfidence) {
        const mode = intelligenceReport.institutionalContext.segmentConfidence.inferenceMode;
        segmentInferenceMode = mode === 'direct' ? 'Exato' : (mode === 'heuristic' ? 'Inferido' : 'Genérico');
      }

      let prudencyApplied;
      if (intelligenceReport.prudency?.prudencyApplied && intelligenceReport.prudency.prudencyReasons) {
        prudencyApplied = {
          reasons: intelligenceReport.prudency.prudencyReasons.map((r: any) => ({
            title: r.title,
            description: r.description,
            severity: r.severity === 'high' ? 'critical' as ExecutiveTone : 'warning' as ExecutiveTone
          }))
        };
      }

      const limitations = intelligenceReport.compliance.narrativeRestrictions
        .filter((r: string) => r.includes('NÃO') || r.includes('Diretriz') || r.includes('limitadas'))
        .slice(0, 3)
        .map((r: string) => r.replace('Diretriz:', '').replace('NÃO reivindicar:', 'Não alegar:').trim());

      institutionalContext = {
        operationalSegment: {
          label: this.pt(intelligenceReport.institutionalContext.operationalSegment.label),
          confidenceTone: intelligenceReport.institutionalContext.segmentConfidence ? this.getSegmentConfidenceTone(segmentConfValue) : undefined,
          inferenceModeLabel: segmentInferenceMode || undefined
        },
        operationalModel: { label: this.pt(intelligenceReport.institutionalContext.operationalModel.label) },
        financialProfile: { label: InstitutionalLocaleGuard.translateFinancialProfile(intelligenceReport.institutionalContext.financialProfile.code) },
        institutionalMaturity: { label: InstitutionalLocaleGuard.translateBusinessStage(intelligenceReport.institutionalContext.institutionalMaturity.code) },
        strategicConfidence: {
          label: this.pt(intelligenceReport.institutionalContext.confidence.strategicConfidence),
          tone: this.getStrategicConfidenceTone(intelligenceReport.institutionalContext.confidence.strategicConfidence)
        },
        interpretativeLimitations: limitations,
        prudencyApplied
      };
    }

    return {
      header: {
        confidenceLevel,
        confidenceTone,
        executivePosture,
        segmentLabel: intelligenceReport?.context?.segment || 'Geral',
        modelLabel: InstitutionalLocaleGuard.translateOperationalModel(intelligenceReport?.context?.businessModel) || InstitutionalLocaleGuard.translateBusinessStage(intelligenceReport?.context?.stage)
      },
      institutionalContext,
      diagnosis: {
        executiveSummary,
        institutionalDiagnosis,
        dominantRisks,
        strategicPriorities
      },
      actionMatrix,
      causalModeration: (blockedFalsePositives.length > 0 || causalConflicts.length > 0) ? {
        blockedFalsePositives,
        causalConflicts
      } : undefined
    };
  }
}
