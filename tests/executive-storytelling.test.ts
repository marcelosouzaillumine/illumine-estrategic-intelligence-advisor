import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { ExecutiveStorytellingEngine } from '../src/core/executive-experience/ExecutiveStorytellingEngine';
import { ExecutiveIntelligenceReport } from '../src/core/runtime/executive-intelligence-runtime';

describe('Phase 10: Executive Storytelling Engine Tests', () => {
  const mockReport: any = {
    context: {
      segment: 'Tecnologia',
      businessModel: 'ASSET_LIGHT',
      capitalIntensity: 'Asset Light',
      stage: 'EXPANSION',
      operationalProfile: 'Ciclo curto'
    },
    scores: {
      financial: 85,
      operational: 90,
      governance: 80,
      structural: 75,
      composite: 82.5,
      financialStress: {
        isStressed: false,
        stressFactors: [],
        runwayImpact: 0,
        recommendedActions: []
      }
    },
    capitalStructure: {
      qualityRating: 'PRIME',
      elasticity: 'HIGH',
      rolloverRisk: 'LOW',
      operationalDependency: 'NONE'
    },
    causality: {
      event: 'Geração robusta de EBITDA',
      rootCause: 'Crescimento de receita recorrente anualizada (ARR)',
      financialPropagation: 'Aumento de caixa circulante livre de amarras',
      absorptionCapacity: 'Excelente capacidade de absorção contra choques',
      strategicImpact: 'Possibilita aceleração prudente de Capex operacional',
      insights: []
    },
    severity: {
      level: 'SAUDÁVEL',
      justification: 'Todos os índices operam em zona verde de estabilidade.'
    },
    advisory: {
      executiveSummary: 'Sumário estratégico: A operação segue estável e saudável.',
      actionMatrix: ['Alocar excesso de caixa em ativos líquidos', 'Otimizar ciclo tributário'],
      priorityFocus: 'Alocação de excesso de liquidez'
    },
    decomposition: [],
    compliance: {
      runtimeMode: 'FULL_FINANCIAL_VIEW',
      confidenceLevel: 'HIGH_CONFIDENCE',
      dataCompleteness: 1.0,
      causalDepth: 'DEEP',
      narrativeRestrictions: [],
      auditFlags: []
    }
  } as any;

  it('1. Deve gerar narrativas estruturadas passivamente sem alterar dados do report', () => {
    const reportCopy = JSON.parse(JSON.stringify(mockReport));
    const story = ExecutiveStorytellingEngine.composeStoryline(reportCopy, 'CEO');

    assert.ok(story.headline.includes('Estabilidade Operacional'));
    assert.strictEqual(story.relevanceRating, 'LOW');
    assert.ok(story.priorityBlocks.length > 0);
    
    // Check that source report was not altered
    assert.deepEqual(reportCopy, mockReport);
  });

  it('2. Deve filtrar e ordenar blocos com base no perfil de stakeholder (CEO vs BOARD)', () => {
    const storyCeo = ExecutiveStorytellingEngine.composeStoryline(mockReport, 'CEO');
    const storyBoard = ExecutiveStorytellingEngine.composeStoryline(mockReport, 'BOARD');

    // CEO does not get technical telemetry details
    assert.ok(!storyCeo.priorityBlocks.some(b => b.title === 'Integridade & Observabilidade'));
    // BOARD does not get basic health overview but gets fiduciary compliance focus
    assert.ok(!storyBoard.priorityBlocks.some(b => b.title === 'Saúde Contábil & Performance'));
    assert.ok(storyBoard.contextMessage.includes('DOCUMENTO CONFIDENCIAL DO CONSELHO'));
  });

  it('3. Deve elevar o nível de relevância se houver estresse preditivo ou severidade alta', () => {
    const stressedReport = {
      ...mockReport,
      scores: {
        ...mockReport.scores,
        financialStress: {
          isStressed: true,
          stressFactors: ['Inadimplência'],
          runwayImpact: 30,
          recommendedActions: []
        }
      },
      severity: {
        level: 'ESTRESSADO' as const,
        justification: 'Colapso iminente do caixa operacional.'
      }
    };

    const story = ExecutiveStorytellingEngine.composeStoryline(stressedReport, 'CEO');
    assert.strictEqual(story.relevanceRating, 'HIGH');
    assert.ok(story.headline.includes('Atenção Executiva Requerida'));
  });
});
