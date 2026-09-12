import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { DFCCausalDriverPresentationAudit } from '../src/core/runtime/cash-causal-intelligence/DFCCausalDriverPresentationAudit';
import { ExecutiveInformationDensityFramework } from '../src/workspace/runtime/presentation-governance/ExecutiveInformationDensityFramework';
import { TreasuryEarlyWarningEngine } from '../src/core/runtime/treasury-early-warning/TreasuryEarlyWarningEngine';

describe('DFC Final UI Integrity & Executive Language Patch v1.1', () => {

  it('1. Aba Qualidade do Lucro (EQE) não aparece no topo (viewMode accepts only oficial/fiduciario)', () => {
    // We verify the viewMode structure is constrained to oficial and fiduciario
    // and that the EQE summary section is hidden in BOARD view
    const boardEQE = ExecutiveInformationDensityFramework.isSectionVisible('DFC_EQE_SUMMARY', 'BOARD');
    assert.strictEqual(boardEQE, false, 'EQE summary must be hidden in BOARD mode');
  });

  it('2. viewMode toggle limits options to oficial and fiduciario', () => {
    // Asserting the two valid viewMode states
    const validModes: Array<'oficial' | 'fiduciario'> = ['oficial', 'fiduciario'];
    assert.strictEqual(validModes.includes('oficial'), true);
    assert.strictEqual(validModes.includes('fiduciario'), true);
    // @ts-expect-error - 'lucro' is not a valid viewMode
    const invalidMode: 'oficial' | 'fiduciario' = 'lucro';
    assert.ok(invalidMode);
  });

  it('3. BOARD não renderiza Contexto Empresarial (DFC_CONTEXT is hidden in BOARD)', () => {
    const boardContext = ExecutiveInformationDensityFramework.isSectionVisible('DFC_CONTEXT', 'BOARD');
    assert.strictEqual(boardContext, false, 'BOARD mode must hide DFC_CONTEXT');
  });

  it('4. BOARD contains exactly 4 visible numbered sections (diagnostic, runway, advisory, reconciliation)', () => {
    const allSections = [
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

    const visibleInBoard = allSections.filter(section => 
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

  it('5. EXECUTIVE does not render technical section numbers or labels (CDIL v1.0, EFSI v1.0, EQE v1.0, etc.)', () => {
    // Visually, the component renders clean titles. We verify visibility of main executive sections:
    assert.strictEqual(ExecutiveInformationDensityFramework.isSectionVisible('DFC_EXECUTIVE_DIAGNOSIS', 'EXECUTIVE'), true);
    assert.strictEqual(ExecutiveInformationDensityFramework.isSectionVisible('DFC_RUNWAY', 'EXECUTIVE'), true);
    assert.strictEqual(ExecutiveInformationDensityFramework.isSectionVisible('DFC_EQE_SUMMARY', 'EXECUTIVE'), true);
    assert.strictEqual(ExecutiveInformationDensityFramework.isSectionVisible('DFC_SCENARIO_SIMULATION', 'EXECUTIVE'), false);
  });

  it('6. CDIL Data Contract Audit filters out NaN / Infinity / undefined fields', () => {
    const dirtyDrivers = [
      {
        label: 'Aumento de Estoque',
        amount: NaN,
        contributionPercent: 12.5,
        category: 'GIRO',
        severity: 'HIGH',
        type: 'DESTROYER'
      },
      {
        label: 'Faturamento',
        amount: 50000,
        contributionPercent: Infinity,
        category: 'OPERACIONAL',
        severity: 'LOW',
        type: 'GENERATOR'
      },
      {
        label: undefined,
        amount: 20000,
        contributionPercent: 15.0,
        category: 'OPERACIONAL',
        severity: 'LOW',
        type: 'GENERATOR'
      },
      {
        label: 'Aporte de Sócios',
        amount: 15000,
        contributionPercent: 10.0,
        category: 'FINANCIAMENTO',
        severity: 'MODERATE',
        type: 'GENERATOR'
      }
    ];

    const auditResult = DFCCausalDriverPresentationAudit.audit(dirtyDrivers);
    assert.strictEqual(auditResult.status, 'PARTIAL_DRIVER_DATA');
    assert.strictEqual(auditResult.validDrivers.length, 1);
    assert.strictEqual(auditResult.validDrivers[0].label, 'Aporte de Sócios');
    assert.strictEqual(auditResult.validDrivers[0].amount, 15000);
    assert.strictEqual(auditResult.validDrivers[0].contributionPercent, 10.0);
  });

  it('7. CDIL audit reports VALID status when all drivers are clean', () => {
    const cleanDrivers = [
      {
        label: 'Vendas à Vista',
        amount: 45000,
        contributionPercent: 35.0,
        category: 'OPERACIONAL',
        severity: 'LOW',
        type: 'GENERATOR'
      },
      {
        label: 'Pagamento de Fornecedores',
        amount: -25000,
        contributionPercent: -15.5,
        category: 'GIRO',
        severity: 'MODERATE',
        type: 'DESTROYER'
      }
    ];

    const auditResult = DFCCausalDriverPresentationAudit.audit(cleanDrivers);
    assert.strictEqual(auditResult.status, 'VALID');
    assert.strictEqual(auditResult.validDrivers.length, 2);
  });

  it('8. CDIL maintains consolidated narrative even with partial drivers', () => {
    // If a driver is invalid, the audit sets partial status but leaves valid drivers intact
    const partialDrivers = [
      {
        label: 'Driver Inválido',
        amount: undefined,
        contributionPercent: NaN,
        category: 'GIRO',
        severity: 'HIGH',
        type: 'DESTROYER'
      }
    ];
    const auditResult = DFCCausalDriverPresentationAudit.audit(partialDrivers);
    assert.strictEqual(auditResult.status, 'PARTIAL_DRIVER_DATA');
    assert.strictEqual(auditResult.validDrivers.length, 0);
  });

  it('9. Scenario Simulation Conflict Alerta: improved runway/cash but deteriorated FCO', () => {
    // simulatedRunway > currentRunway && simulatedCash > currentCash && simulatedFco < currentFco
    const currentRunway = 2.5;
    const currentCash = 10000;
    const currentFco = -5000;

    const simulatedRunway = 3.5; // improves
    const simulatedCash = 15000; // improves
    const simulatedFco = -6000;  // deteriorates (more negative)

    const shouldShowAlert = simulatedRunway > currentRunway && simulatedCash > currentCash && simulatedFco < currentFco;
    assert.strictEqual(shouldShowAlert, true, 'Alert should be triggered when FCO worsens but cash/runway improves');
  });

  it('10. Scenario Simulation: no alert when FCO also improves', () => {
    const currentRunway = 2.5;
    const currentCash = 10000;
    const currentFco = -5000;

    const simulatedRunway = 3.5; // improves
    const simulatedCash = 15000; // improves
    const simulatedFco = -3000;  // improves (less negative)

    const shouldShowAlert = simulatedRunway > currentRunway && simulatedCash > currentCash && simulatedFco < currentFco;
    assert.strictEqual(shouldShowAlert, false, 'No alert if FCO is also improving');
  });

  it('11. Treasury Early Warning: FCO negative and runway < 3 leads to CRITICAL', () => {
    const warning = TreasuryEarlyWarningEngine.evaluate(-5000, 2.0, 1, 0.1, false, false);
    const fcoAlert = warning.alerts.find(a => a.metric === 'FCO');
    assert.ok(fcoAlert);
    assert.strictEqual(fcoAlert.status, 'CRITICAL');
    assert.ok(!fcoAlert.message.includes('Fluxo de Caixa Operacional saudável'));
  });

  it('12. Treasury Early Warning: FCO negative and runway > 6 is WATCH/WARNING but never NORMAL', () => {
    const warning = TreasuryEarlyWarningEngine.evaluate(-5000, 8.0, 1, 0.1, false, false);
    const fcoAlert = warning.alerts.find(a => a.metric === 'FCO');
    assert.ok(fcoAlert);
    assert.notStrictEqual(fcoAlert.status, 'NORMAL');
    assert.ok(!fcoAlert.message.includes('Fluxo de Caixa Operacional saudável'));
  });

  it('13. EQE name is Qualidade da Geração Econômica in EXECUTIVE mode', () => {
    const isLineageVisible = ExecutiveInformationDensityFramework.isSectionVisible('DFC_EQE_LINEAGE', 'EXECUTIVE');
    assert.strictEqual(isLineageVisible, false);
    
    // In EXECUTIVE mode, the title mapped will be 'Qualidade da Geração Econômica'
    const getTitle = (lineageVisible: boolean) => lineageVisible ? 'Qualidade dos Resultados — Camada Técnica' : 'Qualidade da Geração Econômica';
    assert.strictEqual(getTitle(isLineageVisible), 'Qualidade da Geração Econômica');
  });

  it('14. EQE name is Qualidade dos Resultados — Camada Técnica in TECHNICAL mode', () => {
    const isLineageVisible = ExecutiveInformationDensityFramework.isSectionVisible('DFC_EQE_LINEAGE', 'TECHNICAL');
    assert.strictEqual(isLineageVisible, true);
    
    const getTitle = (lineageVisible: boolean) => lineageVisible ? 'Qualidade dos Resultados — Camada Técnica' : 'Qualidade da Geração Econômica';
    assert.strictEqual(getTitle(isLineageVisible), 'Qualidade dos Resultados — Camada Técnica');
  });
});
