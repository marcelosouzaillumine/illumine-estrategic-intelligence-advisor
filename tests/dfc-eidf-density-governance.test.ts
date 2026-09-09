import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { ExecutiveInformationDensityFramework } from '../src/core/runtime/presentation-governance/ExecutiveInformationDensityFramework';
import { TreasuryEarlyWarningEngine } from '../src/core/runtime/treasury-early-warning/TreasuryEarlyWarningEngine';

describe('DFC EIDF Density & Section Governance (EIDF v1.0)', () => {
  it('BOARD mode hides CDIL, Early Warning, Simulation, EFSI, EQE', () => {
    // CDIL = DFC_CAUSAL_INTELLIGENCE
    // Early Warning = DFC_EARLY_WARNING
    // Simulation = DFC_SCENARIO_SIMULATION
    // EFSI = DFC_EFSI
    // EQE = DFC_EQE_SUMMARY
    assert.strictEqual(ExecutiveInformationDensityFramework.isSectionVisible('DFC_CAUSAL_GOVERNANCE', 'BOARD'), false);
    assert.strictEqual(ExecutiveInformationDensityFramework.isSectionVisible('DFC_EARLY_WARNING', 'BOARD'), false);
    assert.strictEqual(ExecutiveInformationDensityFramework.isSectionVisible('DFC_SCENARIO_SIMULATION', 'BOARD'), false);
    assert.strictEqual(ExecutiveInformationDensityFramework.isSectionVisible('DFC_EFSI', 'BOARD'), false);
    assert.strictEqual(ExecutiveInformationDensityFramework.isSectionVisible('DFC_EQE_SUMMARY', 'BOARD'), false);
  });

  it('BOARD contains exactly 4 visible numbered sections', () => {
    const numberedSections = [
      'DFC_CONTEXT',
      'DFC_CQS_SUMMARY',
      'DFC_EXECUTIVE_DIAGNOSIS',
      'DFC_CAUSAL_GOVERNANCE',
      'DFC_EARLY_WARNING',
      'DFC_REVENUE_CASH_CONVERSION',
      'DFC_SHAREHOLDER_DEPENDENCY',
      'DFC_RUNWAY',
      'DFC_SCENARIO_SIMULATION',
      'DFC_EFSI',
      'DFC_BOARD_ADVISORY',
      'DFC_RECONCILIATION_SUMMARY',
      'DFC_TECHNICAL_LAYER',
      'DFC_EQE_SUMMARY'
    ];

    const visibleInBoard = numberedSections.filter(section => 
      ExecutiveInformationDensityFramework.isSectionVisible(section, 'BOARD')
    );

    assert.strictEqual(visibleInBoard.length, 4);
    assert.deepEqual(visibleInBoard, [
      'DFC_EXECUTIVE_DIAGNOSIS',
      'DFC_RUNWAY',
      'DFC_BOARD_ADVISORY',
      'DFC_RECONCILIATION_SUMMARY'
    ]);
  });

  it('EXECUTIVE renders EQE summary and hides EQE lineage and scenario simulation', () => {
    assert.strictEqual(ExecutiveInformationDensityFramework.isSectionVisible('DFC_EQE_SUMMARY', 'EXECUTIVE'), true);
    assert.strictEqual(ExecutiveInformationDensityFramework.isSectionVisible('DFC_EQE_LINEAGE', 'EXECUTIVE'), false);
    assert.strictEqual(ExecutiveInformationDensityFramework.isSectionVisible('DFC_SCENARIO_SIMULATION', 'EXECUTIVE'), false);
  });

  it('TECHNICAL renders EQE lineage, scenario simulation, and complete metrics', () => {
    assert.strictEqual(ExecutiveInformationDensityFramework.isSectionVisible('DFC_EQE_SUMMARY', 'TECHNICAL'), true);
    assert.strictEqual(ExecutiveInformationDensityFramework.isSectionVisible('DFC_EQE_LINEAGE', 'TECHNICAL'), true);
    assert.strictEqual(ExecutiveInformationDensityFramework.isSectionVisible('DFC_SCENARIO_SIMULATION', 'TECHNICAL'), true);
    assert.strictEqual(ExecutiveInformationDensityFramework.isSectionVisible('DFC_EARLY_WARNING', 'TECHNICAL'), true);
  });

  it('Early Warning Engine: FCO negative never resolves to NORMAL and has warning message', () => {
    // Case 1: FCO < 0 under runway < 3 months -> CRITICAL
    const criticalOut = TreasuryEarlyWarningEngine.evaluate(-5000, 2.5, 1, 0.1, false, false);
    const fcoAlertCritical = criticalOut.alerts.find(a => a.metric === 'FCO');
    assert.ok(fcoAlertCritical);
    assert.strictEqual(fcoAlertCritical.status, 'CRITICAL');
    assert.ok(!fcoAlertCritical.message.includes('Fluxo de Caixa Operacional saudável'));

    // Case 2: FCO < 0 with normal runway -> ALERT/WARNING/CRITICAL depending on cycles, but never NORMAL
    const normalRunwayOut = TreasuryEarlyWarningEngine.evaluate(-1000, 10, 1, 0.1, false, false);
    const fcoAlertAlert = normalRunwayOut.alerts.find(a => a.metric === 'FCO');
    assert.ok(fcoAlertAlert);
    assert.notStrictEqual(fcoAlertAlert.status, 'NORMAL');
    assert.ok(!fcoAlertAlert.message.includes('Fluxo de Caixa Operacional saudável'));
  });
});
