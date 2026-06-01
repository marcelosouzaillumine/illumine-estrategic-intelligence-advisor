// @ts-nocheck
import { describe, it } from 'node:test';
import * as assert from 'node:assert/strict';
import { CrossStatementReconciliationEngine, ReconciliationEngineParams } from './CrossStatementReconciliationEngine';

describe('CrossStatementReconciliationEngine', () => {
  const baseIntegrityParams: ReconciliationEngineParams = {
    bpCaixaInicial: 100,
    bpCaixaFinal: 150,
    bpPlFinal: 500,
    bpCapitalSocial: 200,
    bpReservas: 100,
    bpAjustesPatrimoniais: 0,
    dreLucroLiquido: 200,
    dlpaResultadoExercicio: 200,
    dlpaDistribuicaoDividendos: 0,
    dlpaSaldoFinalLucrosPrejuizos: 200,
    dfcVariacaoLiquidaCaixa: 50,
    dfcPagamentoDividendos: 0,
  };

  it('should pass with fully reconciled statements', () => {
    const report = CrossStatementReconciliationEngine.evaluate(baseIntegrityParams);
    assert.equal(report.reconciliationStatus, 'PASSED');
    assert.equal(report.failedAxes.length, 0);
    assert.equal(report.severity, 'NONE');
  });

  it('should pass with immaterial differences (<= 10.0)', () => {
    const params = { ...baseIntegrityParams, dfcVariacaoLiquidaCaixa: 55 }; // Difference of 5
    const report = CrossStatementReconciliationEngine.evaluate(params);
    assert.equal(report.reconciliationStatus, 'PASSED_WITH_IMMATERIAL_DIFFERENCE');
    assert.equal(report.failedAxes.length, 0);
    assert.equal(report.severity, 'IMMATERIAL');
  });

  it('should fail BP_DFC_CAIXA if diff is material', () => {
    const params = { ...baseIntegrityParams, dfcVariacaoLiquidaCaixa: 200 };
    const report = CrossStatementReconciliationEngine.evaluate(params);
    assert.equal(report.reconciliationStatus, 'FAILED');
    assert.ok(report.failedAxes.includes('BP_DFC_CAIXA'));
    assert.ok(report.blockingFlags.includes('INCONSISTÊNCIA_CONTÁBIL_SEVERA'));
  });

  it('should fail DRE_DLPA_RESULTADO if profit diverges', () => {
    const params = { ...baseIntegrityParams, dlpaResultadoExercicio: 50 };
    const report = CrossStatementReconciliationEngine.evaluate(params);
    assert.equal(report.reconciliationStatus, 'FAILED');
    assert.ok(report.failedAxes.includes('DRE_DLPA_RESULTADO'));
  });

  it('should fail DLPA_DFC_DIVIDENDOS if phantom dividends exist', () => {
    const params = { ...baseIntegrityParams, dlpaDistribuicaoDividendos: 100, dfcPagamentoDividendos: 0 };
    const report = CrossStatementReconciliationEngine.evaluate(params);
    assert.equal(report.reconciliationStatus, 'FAILED');
    assert.ok(report.failedAxes.includes('DLPA_DFC_DIVIDENDOS'));
  });

  it('should fail BP_DLPA_PL if PL diverges', () => {
    const params = { ...baseIntegrityParams, bpPlFinal: 1000 };
    const report = CrossStatementReconciliationEngine.evaluate(params);
    assert.equal(report.reconciliationStatus, 'FAILED');
    assert.ok(report.failedAxes.includes('BP_DLPA_PL'));
  });

  it('should apply relative tolerance for very large numbers', () => {
    const params: ReconciliationEngineParams = {
      ...baseIntegrityParams,
      bpCaixaInicial: 0,
      bpCaixaFinal: 2000015,
      dfcVariacaoLiquidaCaixa: 2000000,
    };
    const report = CrossStatementReconciliationEngine.evaluate(params);
    assert.equal(report.reconciliationStatus, 'PASSED_WITH_IMMATERIAL_DIFFERENCE');
    assert.equal(report.failedAxes.includes('BP_DFC_CAIXA'), false);
  });

  it('should fail DLPA_DFC_DIVIDENDOS if DFC has dividend outflow without DLPA record', () => {
    const params = { ...baseIntegrityParams, dlpaDistribuicaoDividendos: 0, dfcPagamentoDividendos: 50 };
    const report = CrossStatementReconciliationEngine.evaluate(params);
    assert.equal(report.reconciliationStatus, 'FAILED');
    assert.ok(report.failedAxes.includes('DLPA_DFC_DIVIDENDOS'));
  });

  it('should pass with additional patrimonial reserves', () => {
    const params = { 
      ...baseIntegrityParams, 
      bpReservas: 150, 
      bpAjustesPatrimoniais: 50, 
      bpPlFinal: 600
    };
    const report = CrossStatementReconciliationEngine.evaluate(params);
    assert.equal(report.reconciliationStatus, 'PASSED');
  });

  it('should pass for company with no dividend distribution', () => {
    const params = { ...baseIntegrityParams, dlpaDistribuicaoDividendos: 0, dfcPagamentoDividendos: 0 };
    const report = CrossStatementReconciliationEngine.evaluate(params);
    assert.equal(report.reconciliationStatus, 'PASSED');
  });

  it('should pass for company with loss and external capitalization', () => {
    const params = { 
      ...baseIntegrityParams, 
      dreLucroLiquido: -50,
      dlpaResultadoExercicio: -50,
      dlpaSaldoFinalLucrosPrejuizos: -50,
      bpPlFinal: 450,
      bpCapitalSocial: 500,
      bpReservas: 0
    };
    const report = CrossStatementReconciliationEngine.evaluate(params);
    assert.equal(report.reconciliationStatus, 'PASSED');
  });
});
