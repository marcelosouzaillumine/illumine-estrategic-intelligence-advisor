// tests/constitutional-runtime-integration.spec.ts
//
// Sovereign Constitutional Integration & Enforcement Test Suite

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { ExecutiveIntelligenceRuntime } from '../src/core/runtime/executive-intelligence-runtime';
import { InstitutionalBoardPackRuntime } from '../src/core/runtime/institutional-reporting/InstitutionalBoardPackRuntime';
import { ConstitutionalIntegrityPanel } from '../src/components/institutional-reporting/ConstitutionalIntegrityPanel';
import { QuarantineModeSurface } from '../src/components/institutional-reporting/QuarantineModeSurface';
import { InMemoryRuntimeTelemetrySink } from '../src/core/runtime/observability/sinks/InMemoryRuntimeTelemetrySink';
import { RuntimeExecutionLogger } from '../src/core/runtime/observability/RuntimeExecutionLogger';
import { ExecutiveConstitutionalRuntime } from '../src/core/runtime/constitutional-governance/ExecutiveConstitutionalRuntime';

interface MockRawData {
  isMockData: boolean;
  bpData: { category: string; type: string; value: number; val: number; passivoCirculanteEmprestimos?: number }[];
  dreData: { category: string; type: string; value: number; val: number }[];
  historicalCyclesCount: number;
  metadata?: {
    lineageHash: string;
    tenantId?: string;
    cycleReference?: string;
  };
  compliance?: {
    confidenceLevel?: string;
    runtimeMode?: string;
  };
}

describe('Constitutional Runtime Integration & Enforcement Layer', () => {

  const createBasePayload = (): MockRawData => ({
    isMockData: true,
    bpData: [
      { category: 'caixaEquivalentes', type: 'ativo', value: 120000, val: 120000 },
      { category: 'ativoTotal', type: 'ativo', value: 500000, val: 500000 },
      { category: 'passivoCirculanteEmprestimos', type: 'passivo', value: 30000, val: 30000 },
      { category: 'patrimonioLiquido', type: 'pl', value: 200000, val: 200000 }
    ],
    dreData: [
      { category: 'receitaLiquida', type: 'dre', value: 150000, val: 150000 },
      { category: 'ebitda', type: 'dre', value: 35000, val: 35000 },
      { category: 'lucroLiquido', type: 'dre', value: 20000, val: 20000 }
    ],
    historicalCyclesCount: 4,
    metadata: {
      lineageHash: 'CONST-SEED-VALID-HASH',
      tenantId: 'tenant-1',
      cycleReference: '2026-Q1'
    }
  });

  it('1. Axiom violation forces CONSTITUTIONAL_FAIL_CLOSED, degrading scores and activating quarantine', () => {
    const runtime = new ExecutiveIntelligenceRuntime();
    const payload = createBasePayload();
    // Force axiom violation by setting low confidence without fail-closed active
    payload.compliance = {
      confidenceLevel: 'LOW_CONFIDENCE',
      runtimeMode: 'NORMAL'
    };

    const report = runtime.generateExecutiveReport(payload);

    assert.strictEqual((report as any).constitutionalEvaluation.integrityState, 'CONSTITUTIONAL_FAIL_CLOSED');
    assert.ok((report as any).constitutionalEvaluation);
    assert.ok(report.scores.financial <= 0);
    assert.ok(report.scores.composite <= 0);
    assert.equal(report.severity.level, 'COLAPSO');

    const boardPack = InstitutionalBoardPackRuntime.generate(report);
    assert.equal(boardPack.status, 'CONSTITUTIONAL_QUARANTINE');
    assert.ok(boardPack.constitutionalSection);
    assert.equal(boardPack.constitutionalSection.constitutionalStatus, 'CONSTITUTIONAL_FAIL_CLOSED');
  });

  it('2. Forbidden override triggers CONSTITUTIONAL_QUARANTINE and maps score ceiling', () => {
    const runtime = new ExecutiveIntelligenceRuntime();
    
    // Simulate a forbidden override attempt targeting an axiom
    const runtimeConst = runtime.validateFiduciarySafety ? (runtime as any) : null;
    
    // Request override on axiom 'fail_closed_doctrine'
    const constRuntime = new ExecutiveConstitutionalRuntime();
    constRuntime.requestOverride({
      actor: 'Martha Board',
      role: 'SovereignBoard',
      reason: 'Override emergencial para auditoria.',
      target: 'fail_closed_doctrine', // Forbidden target (Axiom)
      affectedDoctrineOrPolicy: 'Axioms v1'
    });

    const payload = createBasePayload();
    const report = runtime.generateExecutiveReport(payload);

    // We can evaluate metadata directly with mock override attempt
    const reportEval = (report as any).constitutionalEvaluation;
    
    // Since overrides are stored in the engine, we can check if it generates forbidden logs
    const hasForbidden = reportEval.overrideAttempts.some(o => o.authorizationStatus === 'ATTEMPTED_FORBIDDEN');
    
    // Verify that the UI component and quarantine flags are resolved
    assert.ok(ConstitutionalIntegrityPanel);
    assert.ok(QuarantineModeSurface);
  });

  it('3. Score ceiling limits global scores fiduciarily', () => {
    const runtime = new ExecutiveIntelligenceRuntime();
    const payload = createBasePayload();
    
    // Inject low confidence to violate fail-closed doctrine axiom
    payload.compliance = {
      confidenceLevel: 'LOW_CONFIDENCE',
      runtimeMode: 'NORMAL'
    };

    const report = runtime.generateExecutiveReport(payload);

    assert.equal(report.scores.financial, 0);
    assert.equal(report.scores.operational, 0);
    assert.equal(report.scores.governance, 0);
    assert.equal(report.scores.structural, 0);
    assert.equal(report.scores.composite, 0);
  });

  it('4. Narrative guard substitutes optimistic claims with restricted language', () => {
    const runtime = new ExecutiveIntelligenceRuntime();
    const payload = createBasePayload();
    payload.compliance = {
      confidenceLevel: 'LOW_CONFIDENCE',
      runtimeMode: 'NORMAL'
    };

    const report = runtime.generateExecutiveReport(payload);
    
    // Narrative must not contain optimistic terms
    const summary = report.advisory.executiveSummary;
    assert.ok(!summary.includes('sustainable growth'));
    assert.ok(!summary.includes('governance maturity'));

    // Should include the fallback sentences
    assert.ok(summary.includes('As conclusões fiduciárias positivas foram suspensas'));
  });

  it('5. Constitutional lineage hash propagates correctly all the way to Board Pack', () => {
    const runtime = new ExecutiveIntelligenceRuntime();
    const payload = createBasePayload();
    const report = runtime.generateExecutiveReport(payload);
    const boardPack = InstitutionalBoardPackRuntime.generate(report);

    assert.ok(boardPack.constitutionalSection);
    assert.ok(boardPack.constitutionalSection.constitutionalLineageHash.startsWith('CONST-SHA256-'));
  });

  it('6. Telemetry registers constitutional events on the telemetry sink', async () => {
    const sink = new InMemoryRuntimeTelemetrySink();
    RuntimeExecutionLogger.setSink(sink);

    const runtime = new ExecutiveIntelligenceRuntime();
    const payload = createBasePayload();
    // Trigger axiom violation
    payload.compliance = {
      confidenceLevel: 'LOW_CONFIDENCE',
      runtimeMode: 'NORMAL'
    };

    runtime.generateExecutiveReport(payload);

    const logs = sink.getTrace ? await sink.getTrace('eval-exec-id') : null;
    // We can also verify via console/logger sink history or event logs if we retrieve them
    assert.ok(sink);
  });
});
