import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { FiduciaryCashIntelligenceRuntime } from '../src/core/runtime/cash-intelligence/FiduciaryCashIntelligenceRuntime';
import { InstitutionalCausalIntelligenceRuntime } from '../src/core/runtime/causal-intelligence/InstitutionalCausalIntelligenceRuntime';
import { CausalFactor } from '../src/core/runtime/causal-intelligence/types';

describe('Institutional Causal Intelligence - Fiduciary Logic', () => {

  const createMockCashReport = (isAvailable: boolean, confidence: 'HIGH' | 'MODERATE' | 'LOW' | 'BLOCKED') => {
    return {
      isAvailable,
      confidenceLevel: confidence,
      liquidityClassification: {
        classification: 'OPERATIONAL_SUSTAINABLE',
        label: 'Sustentável',
        confidence: confidence,
        severity: 'SAUDÁVEL',
        rationale: 'Mock'
      },
      artificialLiquidityDetected: {
        isArtificial: false,
        diagnoses: [],
        liquidityDistortionFactors: [],
        rationale: 'Mock',
        blockedConclusions: []
      },
      reconciliationAlerts: {
        isReconcilable: isAvailable,
        reconciliationStatus: confidence === 'BLOCKED' ? 'BLOCKED' : 'RECONCILED',
        temporalSeverity: 'STABLE',
        variancePercentage: 0,
        disclosures: []
      },
      operationalSustainability: {
        isSustained: true,
        selfFinancingCapacity: 'HIGH',
        operationalCashConsistency: 'HIGH_CONSISTENCY',
        operationalFragilityIndex: 0,
        dependencyTrend: 'STABLE',
        resilienceScore: 90,
        longitudinalConsistency: 'Mock'
      },
      continuityRisk: {
        continuityRisk: 'STABLE',
        hasRuptureRisk: false,
        projectedRunwayMonths: 24,
        runwayConfidence: 'HIGH',
        runwayDistortionFactors: [],
        runwayStability: 'STABLE',
        liquidityDependency: false,
        continuityRiskDrivers: [],
        recommendedActions: []
      },
      fiduciaryNarrative: {
        executiveNarrative: 'Mock',
        fiduciaryOpinion: 'Mock',
        fiduciaryWarnings: [],
        blockedInterpretations: [],
        causalFindings: [],
        institutionalImplications: []
      },
      blockedConclusions: [],
      allowedConclusions: [],
      auditTrail: [],
      lineageHash: 'MOCK-HASH',
      cashIntelligenceLineageHash: 'MOCK-HASH',
      causalReferences: [],
      score: 90
    } as any;
  };

  it('1. Should block causal analysis with 1 cycle (BLOCKED)', () => {
    const cashReport = createMockCashReport(true, 'HIGH');
    const report = InstitutionalCausalIntelligenceRuntime.evaluate(
      cashReport,
      100000, 120000, 50000, 10000, 20000, 15000, 50000, 0,
      [{ year: 2022, val: 100, type: 'DRE' }], // Only 1 cycle available in history
      [{ year: 2022 }],
      2022
    );

    assert.strictEqual(report.isAvailable, false);
    assert.strictEqual(report.confidenceLevel, 'BLOCKED');
    assert.ok(report.causalOpinion.includes('impedição') || report.causalOpinion.includes('impede') || report.causalOpinion.includes('ausência de série histórica'));
  });

  it('2. Should restrict causal analysis with 2 cycles (LOW confidence)', () => {
    const cashReport = createMockCashReport(true, 'HIGH');
    const report = InstitutionalCausalIntelligenceRuntime.evaluate(
      cashReport,
      100000, 120000, 50000, 10000, 20000, 15000, 50000, 0,
      [
        { year: 2021, val: 100, type: 'DRE' },
        { year: 2022, val: 150, type: 'DRE' }
      ], // 2 cycles
      [{ year: 2021 }, { year: 2022 }],
      2022
    );

    assert.strictEqual(report.isAvailable, true);
    assert.strictEqual(report.confidenceLevel, 'LOW');
    assert.ok(report.causalOpinion.includes('Restricted causal inference') || report.causalOpinion.includes('restrita'));
  });

  it('3. Should block causal intelligence if cash sustainability is BLOCKED', () => {
    const cashReport = createMockCashReport(false, 'BLOCKED'); // cash engine blocked
    const report = InstitutionalCausalIntelligenceRuntime.evaluate(
      cashReport,
      100000, 120000, 50000, 10000, 20000, 15000, 50000, 0,
      [
        { year: 2020, val: 100, type: 'DRE' },
        { year: 2021, val: 120, type: 'DRE' },
        { year: 2022, val: 150, type: 'DRE' }
      ],
      [{ year: 2020 }, { year: 2021 }, { year: 2022 }],
      2022
    );

    assert.strictEqual(report.isAvailable, false);
    assert.strictEqual(report.confidenceLevel, 'BLOCKED');
  });

  it('4. Should degrade definitiveness and use possible areas when DFC is missing', () => {
    const cashReport = createMockCashReport(true, 'HIGH');
    
    // History contains only DRE/BP, no DFC document
    const historyData = [
      { year: 2020, type: 'DRE', val: 100, category: 'Lucro Líquido' },
      { year: 2021, type: 'DRE', val: 120, category: 'Lucro Líquido' },
      { year: 2022, type: 'DRE', val: -50000, category: 'Lucro Líquido' }, // Net loss
      { year: 2022, type: 'BP', val: 100000, category: 'Clientes' } // Receivables rising
    ];

    const report = InstitutionalCausalIntelligenceRuntime.evaluate(
      cashReport,
      -50000, 0, -100000, 120000, 100000, 50000, 10000, 200000,
      historyData,
      [{ year: 2020 }, { year: 2021 }, { year: 2022 }],
      2022
    );

    assert.strictEqual(report.isAvailable, true);
    // As there is no DFC, no root cause should be definitive
    report.rootCauses.forEach((factor: CausalFactor) => {
      assert.strictEqual(factor.isDefinitive, false);
      assert.ok(factor.label.startsWith('Possível Área de Pressão'));
    });
  });

  it('5. Should strictly obey vocabulary constraints (no definitive blame language)', () => {
    const cashReport = createMockCashReport(true, 'HIGH');
    const report = InstitutionalCausalIntelligenceRuntime.evaluate(
      cashReport,
      100000, 120000, -50000, 10000, 20000, 15000, 50000, 150000,
      [
        { year: 2020, val: 100, type: 'DRE' },
        { year: 2021, val: 120, type: 'DRE' },
        { year: 2022, val: 150, type: 'DRE' }
      ],
      [{ year: 2020 }, { year: 2021 }, { year: 2022 }],
      2022
    );

    // Verify language rules are strictly honored in opinion
    const forbidden = ['a causa é', 'isso prova', 'a empresa faliu porque', 'a empresa falhou porque'];
    forbidden.forEach(word => {
      assert.ok(!report.causalOpinion.toLowerCase().includes(word), `Causal opinion contains forbidden phrase: ${word}`);
    });
  });

  it('6. Should ensure SVG panel renders from runtime graph only (no external lib and no graph topology computation in UI)', () => {
    const filePath = path.join(process.cwd(), 'src/components/panels/causal-intelligence/SurvivabilityDependencyGraphPanel.tsx');
    const content = fs.readFileSync(filePath, 'utf-8');
    
    // Assert no external graph libraries are imported
    const forbiddenImports = ['d3', 'cytoscape', 'gojs', 'mxgraph', 'vis-network', 'mermaid', 'echarts', 'reactflow'];
    forbiddenImports.forEach(lib => {
      assert.ok(!content.includes(`from '${lib}'`) && !content.includes(`require('${lib}')`), `SVG panel should not import ${lib}`);
    });
    
    // Assert it consumes graph structure from props only
    assert.ok(content.includes('nodes = []') && content.includes('edges = []'), 'SVG panel should destruct nodes and edges from props');
  });

  it('7. Should ensure UI contains no local causal severity logic', () => {
    const rootCausesPath = path.join(process.cwd(), 'src/components/panels/causal-intelligence/InstitutionalCausalRootCausesPanel.tsx');
    const rootCausesContent = fs.readFileSync(rootCausesPath, 'utf-8');
    
    // Assert UI does not calculate severity based on financial metrics locally
    assert.ok(!rootCausesContent.includes('fco < 0') && !rootCausesContent.includes('receivables >') && !rootCausesContent.includes('inventory >'), 'UI should not compute severity based on financial metrics');
    
    // Assert it relies on severity coming from the engine data structure
    assert.ok(rootCausesContent.includes('factor.severity'), 'UI should read severity from factor object');
  });

});

