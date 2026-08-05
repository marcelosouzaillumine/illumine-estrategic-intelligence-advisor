// @ts-nocheck
import { NormalizedBalanceSheet } from '../models/NormalizedBalanceSheet';
import { ExecutiveIntelligenceOutput, FinancialIndicator } from '../../../../core/intelligence/contracts/ExecutiveIntelligenceOutput';
import { FinancialRiskEngine } from './FinancialRiskEngine';
import { CapitalStructureEngine } from './CapitalStructureEngine';
import { FleurietAnalysisEngine } from './FleurietAnalysisEngine';
import { FinancialDiagnosticEngine } from './FinancialDiagnosticEngine';
import { IndicatorClassificationRules } from '../rules/IndicatorClassificationRules';

export class BalanceSheetIntelligenceEngine {
  static execute(data: NormalizedBalanceSheet): ExecutiveIntelligenceOutput {
    const indicators: FinancialIndicator[] = [];

    // Base Calculations
    const currentLiquidityValue = data.liabilities.currentLiabilities > 0 ? (data.assets.currentAssets / data.liabilities.currentLiabilities) : 0;
    const debtRatioValue = data.assets.total > 0 ? (data.liabilities.total / data.assets.total) : 0;
    const assetLiquidityValue = data.assets.total > 0 ? ((data.assets.cashAndEquivalents + data.assets.accountsReceivable) / data.assets.total) : 0;
    const operationalLiabilityRatio = data.liabilities.total > 0 ? ((data.liabilities.suppliers + data.liabilities.laborObligations + data.liabilities.taxes) / data.liabilities.total) : 0;

    indicators.push({
      id: 'current_liquidity',
      name: 'Liquidez Corrente',
      value: currentLiquidityValue,
      unit: 'x',
      category: 'LIQUIDITY',
      status: IndicatorClassificationRules.getLiquidityStatus(currentLiquidityValue),
      interpretation: IndicatorClassificationRules.getInterpretation(IndicatorClassificationRules.getLiquidityStatus(currentLiquidityValue))
    });

    indicators.push({
      id: 'debt_ratio',
      name: 'Endividamento Geral',
      value: debtRatioValue,
      unit: '%',
      category: 'STRUCTURE',
      status: IndicatorClassificationRules.getDebtStatus(debtRatioValue),
      interpretation: IndicatorClassificationRules.getInterpretation(IndicatorClassificationRules.getDebtStatus(debtRatioValue))
    });

    indicators.push({
      id: 'asset_liquidity',
      name: 'Liquidez do Ativo',
      value: assetLiquidityValue,
      unit: '%',
      category: 'ASSET_QUALITY',
      status: 'NEUTRAL',
      interpretation: 'Porcentagem dos ativos que apresentam elevada liquidez imediata (Caixa + Clientes).'
    });

    indicators.push({
      id: 'operational_liability_ratio',
      name: 'Passivo Operacional',
      value: operationalLiabilityRatio,
      unit: '%',
      category: 'LIABILITY_QUALITY',
      status: 'NEUTRAL',
      interpretation: 'Porcentagem do passivo composta por obrigações operacionais.'
    });

    // Sub-Engines
    const exposures = FinancialRiskEngine.analyze(data);
    const capitalStructure = CapitalStructureEngine.analyze(data);
    
    // NCG, CGL, Treasury
    // Padronizar fórmula: NCG = Ativos Operacionais Circulantes - Passivos Operacionais Circulantes
    // Excluir: caixa; aplicações financeiras (já excluído de currentAssetsWithoutCash)
    const currentAssetsWithoutCash = data.assets.currentAssets - data.assets.cashAndEquivalents;
    const currentLiabilitiesWithoutDebt = data.liabilities.currentLiabilities - data.liabilities.financialDebtsShortTerm;
    const ncg = currentAssetsWithoutCash - currentLiabilitiesWithoutDebt;
    
    const cgl = data.equity.total + data.liabilities.nonCurrentLiabilities - data.assets.nonCurrentAssets;
    
    // ST = CGL - NCG
    const treasury = cgl - ncg;
    
    const fleuriet = FleurietAnalysisEngine.analyze(cgl, ncg, treasury);

    // Diagnostics
    const diagnostic = FinancialDiagnosticEngine.analyze(indicators, exposures);

    return {
      capabilityId: 'financial.balance_sheet_intelligence' as any,
      status: 'SUCCESS',
      confidence: {
        score: 95,
        level: 'HIGH',
        factors: ['Dados completos do Balanço Patrimonial normalizado', 'Motor de classificação rodado sem restrições']
      },
      indicators,
      diagnostics: [diagnostic],
      exposures,
      insights: [
        {
          id: 'fleuriet_insight',
          category: 'Working Capital',
          type: fleuriet.riskLevel === 'CRITICAL' ? 'CRITICAL' : (fleuriet.riskLevel === 'HIGH' ? 'WARNING' : 'POSITIVE'),
          title: `Modelo de Fleuriet: ${fleuriet.classification}`,
          description: fleuriet.description
        } as any
      ],
      evidence: {
        fleuriet,
        capitalStructure
      }
    };
  }
}
