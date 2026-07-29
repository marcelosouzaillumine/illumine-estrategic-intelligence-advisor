import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { ExecutivePerspectivePresenter } from '../src/capabilities/executive/presentation/presenters/ExecutivePerspectivePresenter';
import { ExecutiveIntelligenceReport } from '../src/services/FiduciaryRuntimeAdapter';
import { ExecutiveAdvisoryReport } from '../src/lib/executive-advisory-engine';

describe('ExecutivePerspectivePresenter Characterization Tests', () => {
  const mockTranslate = (key: string) => key;

  it('enum conhecido: should translate known enums', () => {
    const report = {
      confidenceLevel: 'HIGH_CONFIDENCE',
      executivePosture: 'Growth Strategy',
      executiveSummary: 'Summary',
      institutionalDiagnosis: 'Diagnosis',
      dominantRisks: ['Risk 1'],
      strategicPriorities: ['Priority 1'],
      actionMatrix: []
    } as unknown as ExecutiveAdvisoryReport;
    
    const result = ExecutivePerspectivePresenter.transform({
      advisoryReport: report,
      intelligenceReport: undefined,
      translate: mockTranslate
    });
    assert.equal(result.header.confidenceLevel, 'Alta Confiabilidade');
    assert.equal(result.header.confidenceTone, 'success');
  });

  it('enum desconhecido: should fallback gracefully for unknown enums', () => {
    const report = {
      confidenceLevel: 'UNKNOWN_LEVEL',
      executivePosture: 'Growth Strategy',
      executiveSummary: 'Summary',
      institutionalDiagnosis: 'Diagnosis',
      dominantRisks: ['Risk 1'],
      strategicPriorities: ['Priority 1'],
      actionMatrix: []
    } as unknown as ExecutiveAdvisoryReport;
    
    const result = ExecutivePerspectivePresenter.transform({
      advisoryReport: report,
      intelligenceReport: undefined,
      translate: mockTranslate
    });
    assert.equal(result.header.confidenceLevel, 'UNKNOWN LEVEL');
    assert.equal(result.header.confidenceTone, 'warning');
  });

  it('ausência de dominantRisks: should apply proper fallback', () => {
    const intReport = {
      compliance: { confidenceLevel: 'HIGH_CONFIDENCE', runtimeMode: 'BALANCE_SHEET_ONLY', narrativeRestrictions: [] },
      advisory: { priorityFocus: 'Focus', executiveSummary: 'Sum' },
      institutionalView: { 
        narrative: { executiveSummary: 'Sum' },
        causality: { executiveInsight: 'Insight' },
        disclosures: {}
      }
    } as unknown as ExecutiveIntelligenceReport;
    
    const result = ExecutivePerspectivePresenter.transform({
      advisoryReport: undefined,
      intelligenceReport: intReport,
      translate: mockTranslate
    });
    assert.equal(result.diagnosis.dominantRisks.length, 1);
    assert.ok(result.diagnosis.dominantRisks[0].label.includes('limitada ao Balanço Patrimonial'));
  });

  it('múltiplas fontes de risco: should prioritize intelligently', () => {
    const intReport = {
      compliance: { confidenceLevel: 'HIGH_CONFIDENCE', runtimeMode: 'FULL_FINANCIAL_VIEW', narrativeRestrictions: [] },
      advisory: { priorityFocus: 'Focus', executiveSummary: 'Sum' },
      institutionalView: { 
        narrative: { executiveSummary: 'Sum' },
        causality: { executiveInsight: 'Insight' },
        disclosures: { primaryDisclosure: 'Primary Risk', secondaryDisclosures: ['Secondary Risk'] }
      },
      causality: {
        insights: [{ text: 'Color Risk', bgClass: 'bg-rose-100', category: 'risco' }]
      }
    } as unknown as ExecutiveIntelligenceReport;
    
    const result = ExecutivePerspectivePresenter.transform({
      advisoryReport: undefined,
      intelligenceReport: intReport,
      translate: mockTranslate
    });
    assert.equal(result.diagnosis.dominantRisks.length, 3);
    assert.equal(result.diagnosis.dominantRisks[0].label, 'Primary Risk');
    assert.equal(result.diagnosis.dominantRisks[1].label, 'Secondary Risk');
    assert.equal(result.diagnosis.dominantRisks[2].label, 'Color Risk');
  });

  it('ausência de contexto institucional: should return undefined for institutionalContext', () => {
    const report = {
      confidenceLevel: 'HIGH_CONFIDENCE',
      executivePosture: 'Growth Strategy',
      executiveSummary: 'Summary',
      institutionalDiagnosis: 'Diagnosis',
      dominantRisks: ['Risk 1'],
      strategicPriorities: ['Priority 1'],
      actionMatrix: []
    } as unknown as ExecutiveAdvisoryReport;
    
    const result = ExecutivePerspectivePresenter.transform({
      advisoryReport: report,
      intelligenceReport: undefined,
      translate: mockTranslate
    });
    assert.equal(result.institutionalContext, undefined);
  });

  it('prudência aplicada: should map prudency correctly', () => {
    const intReport = {
      compliance: { confidenceLevel: 'HIGH_CONFIDENCE', runtimeMode: 'FULL_FINANCIAL_VIEW', narrativeRestrictions: [] },
      institutionalContext: {
        operationalSegment: { label: 'SAAS' },
        operationalModel: { label: 'RECURRING_REVENUE' },
        financialProfile: { code: 'HEALTHY_GROWTH' },
        institutionalMaturity: { code: 'SCALE_STAGE' },
        confidence: { strategicConfidence: 'HIGH' }
      },
      prudency: {
        prudencyApplied: true,
        prudencyReasons: [{ title: 'Prudency 1', description: 'Desc 1', severity: 'high' }]
      }
    } as unknown as ExecutiveIntelligenceReport;
    
    const result = ExecutivePerspectivePresenter.transform({
      advisoryReport: undefined,
      intelligenceReport: intReport,
      translate: mockTranslate
    });
    assert.ok(result.institutionalContext?.prudencyApplied);
    assert.equal(result.institutionalContext?.prudencyApplied?.reasons[0].severity, 'critical');
  });

  it('lista de ações vazia: should return empty actionMatrix', () => {
    const report = {
      confidenceLevel: 'HIGH_CONFIDENCE',
      executivePosture: '',
      executiveSummary: '',
      institutionalDiagnosis: '',
      dominantRisks: [],
      strategicPriorities: [],
      actionMatrix: []
    } as unknown as ExecutiveAdvisoryReport;
    
    const result = ExecutivePerspectivePresenter.transform({
      advisoryReport: report,
      intelligenceReport: undefined,
      translate: mockTranslate
    });
    assert.deepEqual(result.actionMatrix, []);
  });

  it('prioridade sem valor explícito: should infer priority from title or index', () => {
    const report = {
      confidenceLevel: 'HIGH_CONFIDENCE',
      executivePosture: '',
      executiveSummary: '',
      institutionalDiagnosis: '',
      dominantRisks: [],
      strategicPriorities: [],
      actionMatrix: ['Risco Imediato para Caixa', 'Ação Secundária', 'Ação Normal']
    } as unknown as ExecutiveAdvisoryReport;
    
    const result = ExecutivePerspectivePresenter.transform({
      advisoryReport: report,
      intelligenceReport: undefined,
      translate: mockTranslate
    });
    assert.equal(result.actionMatrix[0].priority.label, 'Alta');
    assert.equal(result.actionMatrix[1].priority.label, 'Média');
    assert.equal(result.actionMatrix[2].priority.label, 'Normal');
  });

  it('fallback de timeline: should infer timeline from text', () => {
    const report = {
      confidenceLevel: 'HIGH_CONFIDENCE',
      executivePosture: '',
      executiveSummary: '',
      institutionalDiagnosis: '',
      dominantRisks: [],
      strategicPriorities: [],
      actionMatrix: ['Ação em 30 dias', 'Ação para 6 meses', 'Ação de longo prazo', 'Ação contínua']
    } as unknown as ExecutiveAdvisoryReport;
    
    const result = ExecutivePerspectivePresenter.transform({
      advisoryReport: report,
      intelligenceReport: undefined,
      translate: mockTranslate
    });
    assert.equal(result.actionMatrix[0].timeline, 'Curto Prazo');
    assert.equal(result.actionMatrix[1].timeline, 'Médio Prazo');
    assert.equal(result.actionMatrix[2].timeline, 'Longo Prazo');
    assert.equal(result.actionMatrix[3].timeline, 'Contínuo');
  });

  it('causal moderation presente e ausente: should map correctly', () => {
    const reportWithModeration = {
      confidenceLevel: 'HIGH_CONFIDENCE',
      executivePosture: '',
      executiveSummary: '',
      institutionalDiagnosis: '',
      dominantRisks: [],
      strategicPriorities: [],
      actionMatrix: [],
      blockedFalsePositives: ['False Positive 1'],
      causalConflicts: ['Conflict 1']
    } as unknown as ExecutiveAdvisoryReport;
    
    const resultWith = ExecutivePerspectivePresenter.transform({
      advisoryReport: reportWithModeration,
      intelligenceReport: undefined,
      translate: mockTranslate
    });
    assert.ok(resultWith.causalModeration);
    assert.deepEqual(resultWith.causalModeration?.blockedFalsePositives, ['False Positive 1']);
    assert.deepEqual(resultWith.causalModeration?.causalConflicts, ['Conflict 1']);

    const reportWithout = { ...reportWithModeration, blockedFalsePositives: [], causalConflicts: [] } as unknown as ExecutiveAdvisoryReport;
    const resultWithout = ExecutivePerspectivePresenter.transform({
      advisoryReport: reportWithout,
      intelligenceReport: undefined,
      translate: mockTranslate
    });
    assert.equal(resultWithout.causalModeration, undefined);
  });
});
