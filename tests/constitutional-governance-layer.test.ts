import { test, describe, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { ConstitutionalGovernanceRegistry } from '../src/core/runtime/constitutional-governance/ConstitutionalGovernanceRegistry';
import { ConstitutionalGovernanceRuntime } from '../src/core/runtime/constitutional-governance/ConstitutionalGovernanceRuntime';
import { SemanticConstitutionProtocol } from '../src/core/runtime/constitutional-governance/protocols/SemanticConstitutionProtocol';
import { SemanticDeterminismValidator } from '../src/core/runtime/constitutional-governance/SemanticDeterminismValidator';

import { FiduciaryConstitutionProtocol } from '../src/core/runtime/constitutional-governance/protocols/FiduciaryConstitutionProtocol';
import { TreasuryConstitutionProtocol } from '../src/core/runtime/constitutional-governance/protocols/TreasuryConstitutionProtocol';
import { CausalConstitutionProtocol } from '../src/core/runtime/constitutional-governance/protocols/CausalConstitutionProtocol';
import { LineageConstitutionProtocol } from '../src/core/runtime/constitutional-governance/protocols/LineageConstitutionProtocol';
import { AIConstitutionProtocol } from '../src/core/runtime/constitutional-governance/protocols/AIConstitutionProtocol';

describe('Constitutional Governance Layer (CGL v1.0) Tests', () => {
  beforeEach(() => {
    SemanticDeterminismValidator.clearStore();
    // Re-register to ensure clean state
    ConstitutionalGovernanceRegistry.clearRegistry();

    ConstitutionalGovernanceRegistry.registerProtocol(new SemanticConstitutionProtocol());
    ConstitutionalGovernanceRegistry.registerProtocol(new FiduciaryConstitutionProtocol());
    ConstitutionalGovernanceRegistry.registerProtocol(new TreasuryConstitutionProtocol());
    ConstitutionalGovernanceRegistry.registerProtocol(new CausalConstitutionProtocol());
    ConstitutionalGovernanceRegistry.registerProtocol(new LineageConstitutionProtocol());
    ConstitutionalGovernanceRegistry.registerProtocol(new AIConstitutionProtocol());
  });

  const getValidContext = () => ({
    semanticSource: 'ELSA',
    renderedContent: JSON.stringify({}),
    semanticLineagePayload: {
      authority: 'ELSA',
      semanticProtocolVersion: 'ELSA-2.0',
      lifecycleStage: 'EXPANSION',
      resolvedLabels: ['A', 'B'],
      foundationYear: 2020,
      analysisYear: 2024
    },
    semanticScope: 'EXECUTIVE',
    fiduciaryConclusion: 'HEALTHY_LIQUIDITY',
    fiduciaryEvidenceStatus: 'STABLE',
    treasuryConclusion: 'SUSTAINABLE_GROWTH',
    operationalCashFlow: 1000,
    hasExecutiveConclusion: true,
    causalChainPresent: true,
    executiveMetricsPresent: true,
    lineageHash: 'valid-hash',
    isAIGenerated: false
  });

  test('1. Verify protocol registration', () => {
    const protocols = ConstitutionalGovernanceRegistry.getAllProtocols();
    assert.strictEqual(protocols.length, 6);
    assert.ok(ConstitutionalGovernanceRegistry.getProtocol('SCCF'));
    assert.ok(ConstitutionalGovernanceRegistry.getProtocol('FCF'));
    assert.ok(ConstitutionalGovernanceRegistry.getProtocol('TCF'));
    assert.ok(ConstitutionalGovernanceRegistry.getProtocol('CCF'));
    assert.ok(ConstitutionalGovernanceRegistry.getProtocol('LCF'));
    assert.ok(ConstitutionalGovernanceRegistry.getProtocol('ACF'));
  });

  test('2. Verify protocol hierarchy (All PASS)', () => {
    const context = getValidContext();
    const report = ConstitutionalGovernanceRuntime.evaluate(context);
    
    assert.strictEqual(report.constitutionalIntegrity, 'VALID');
    assert.strictEqual(report.protocols.FCF, 'PASS');
    assert.strictEqual(report.protocols.TCF, 'PASS');
    assert.strictEqual(report.protocols.CCF, 'PASS');
    assert.strictEqual(report.protocols.LCF, 'PASS');
    assert.strictEqual(report.protocols.ACF, 'PASS');
    // SCCF returns payload, so check its status inside
    assert.strictEqual((report.protocols.SCCF as any).complianceStatus, 'COMPLIANT');
  });

  test('3. Verify constitutional runtime aggregation (WARNING)', () => {
    const context = getValidContext();
    // Simulate a WARNING in Semantic
    context.semanticSource = 'UNKNOWN_SOURCE';
    
    const report = ConstitutionalGovernanceRuntime.evaluate(context);
    assert.strictEqual(report.constitutionalIntegrity, 'WARNING');
  });

  test('4. Verify fiduciary violations', () => {
    const context = getValidContext();
    context.fiduciaryEvidenceStatus = 'CRITICAL';
    
    const report = ConstitutionalGovernanceRuntime.evaluate(context);
    assert.strictEqual(report.constitutionalIntegrity, 'INVALID');
    assert.strictEqual(report.protocols.FCF, 'FAIL');
    assert.ok(report.protocolViolations['FCF'][0].includes('FIDUCIARY_CONSTITUTION_VIOLATION'));
  });

  test('5. Verify treasury violations', () => {
    const context = getValidContext();
    context.operationalCashFlow = -500;
    
    const report = ConstitutionalGovernanceRuntime.evaluate(context);
    assert.strictEqual(report.constitutionalIntegrity, 'INVALID');
    assert.strictEqual(report.protocols.TCF, 'FAIL');
    assert.ok(report.protocolViolations['TCF'][0].includes('TREASURY_CONSTITUTION_VIOLATION'));
  });

  test('6. Verify causal violations', () => {
    const context = getValidContext();
    context.causalChainPresent = false;
    
    const report = ConstitutionalGovernanceRuntime.evaluate(context);
    assert.strictEqual(report.constitutionalIntegrity, 'INVALID');
    assert.strictEqual(report.protocols.CCF, 'FAIL');
    assert.ok(report.protocolViolations['CCF'][0].includes('CAUSAL_CONSTITUTION_VIOLATION'));
  });

  test('7. Verify lineage violations', () => {
    const context = getValidContext();
    context.lineageHash = '';
    
    const report = ConstitutionalGovernanceRuntime.evaluate(context);
    assert.strictEqual(report.constitutionalIntegrity, 'INVALID');
    assert.strictEqual(report.protocols.LCF, 'FAIL');
    assert.ok(report.protocolViolations['LCF'][0].includes('LINEAGE_CONSTITUTION_VIOLATION'));
  });

  test('8. Verify AI constitutional validation', () => {
    const context = getValidContext();
    context.isAIGenerated = true;
    context.operationalCashFlow = -500; // Force TCF to FAIL
    
    const report = ConstitutionalGovernanceRuntime.evaluate(context);
    assert.strictEqual(report.constitutionalIntegrity, 'INVALID');
    // AI fails because prerequisite (TCF) failed
    assert.strictEqual(report.protocols.ACF, 'FAIL');
    assert.ok(report.protocolViolations['ACF'][0].includes('AI_CONSTITUTION_VIOLATION'));
  });

  test('9. Verify constitutional hash generation (excludes validatedAt)', () => {
    const context = getValidContext();
    const originalDate = Date;
    let callCount = 0;
    
    // Mock Date to return different times on subsequent calls
    global.Date = class extends originalDate {
      constructor(...args: any[]) {
        if (args.length > 0) {
          // @ts-ignore
          super(...args);
          return;
        }
        super();
        callCount++;
        if (callCount === 1) {
          return new originalDate('2026-06-02T23:12:42.131Z');
        } else {
          return new originalDate('2026-06-02T23:12:42.132Z');
        }
      }
    } as any;

    try {
      const report1 = ConstitutionalGovernanceRuntime.evaluate(context);
      const report2 = ConstitutionalGovernanceRuntime.evaluate(context);
      
      assert.strictEqual(report1.constitutionalHash, report2.constitutionalHash);
      assert.notStrictEqual(report1.validatedAt, report2.validatedAt);
    } finally {
      global.Date = originalDate;
    }
  });
});

