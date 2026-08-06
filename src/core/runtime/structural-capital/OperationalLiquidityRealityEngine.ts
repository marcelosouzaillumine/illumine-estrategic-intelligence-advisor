import { BPSummary } from '../../../lib/bpEngine';
import { SegmentCode } from '../segment-intelligence/types';
import { SegmentThresholdEngine } from '../segment-intelligence/SegmentThresholdEngine';
import { OperationalLiquidityProfile, StructuralCapitalSignal } from './types';

export class OperationalLiquidityRealityEngine {
  /**
   * Mensura a liquidez econômica real (vs contábil).
   * Desconta o peso de estoques que funcionam como aprisionadores estruturais
   * de capital de giro para aferir a verdadeira capacidade de cobertura.
   */
  static evaluate(bpSummary: BPSummary, segmentCode: SegmentCode = 'GENERIC_OPERATION', inventoryPenaltyFactor: number = 0.5): OperationalLiquidityProfile {
    if (!bpSummary) {
      return {
        realLiquidityStrength: 0,
        operationalCashPressure: 0,
        workingCapitalRealityIndex: 0,
        immediateCoverageCapacityMonths: 0,
        activeSignals: [],
        explanation: 'Dados insuficientes para aferição de liquidez real.'
      };
    }

    const {
      caixaEquivalentes,
      clientes,
      estoques,
      ativoCirculante,
      passivoCirculante
    } = bpSummary;

    // Fail-closed
    if (passivoCirculante <= 0) {
      return {
        realLiquidityStrength: 99,
        operationalCashPressure: 99,
        workingCapitalRealityIndex: 100,
        immediateCoverageCapacityMonths: 99,
        activeSignals: [],
        explanation: 'Ausência de passivo circulante reportado elimina pressão imediata.'
      };
    }

    // Cálculos estruturais reais
    // Assume-se que clientes tem perda esperada/delay de 30%, logo 0.7
    const realLiquidityStrength = (caixaEquivalentes + (clientes * 0.7)) / passivoCirculante;
    const operationalCashPressure = caixaEquivalentes / passivoCirculante;
    
    // NCG descontando o peso estrutural do inventário que não converte rápido
    const discountedCurrentAssets = ativoCirculante - (estoques * inventoryPenaltyFactor);
    let workingCapitalRealityIndex = (discountedCurrentAssets / passivoCirculante) * 100;
    // Cap em 100%
    workingCapitalRealityIndex = Math.min(Math.max(workingCapitalRealityIndex, 0), 100);

    const immediateCoverageCapacityMonths = (caixaEquivalentes / passivoCirculante) * 12;

    const activeSignals: StructuralCapitalSignal[] = [];
    const explanations: string[] = [];

    // Avaliação de Thresholds Contextuais
    const thresholds = SegmentThresholdEngine.getThresholdsForSegment(segmentCode);
    const minCurrentLiquidity = thresholds.minCurrentLiquidity;
    
    // Convert current liquidity (which is traditionally current assets / current liabilities) to real liquidity tolerance
    const minRealLiquidity = minCurrentLiquidity * 0.4; // rough heuristic to convert standard LC to severe real LC
    
    if (realLiquidityStrength < minRealLiquidity) {
      activeSignals.push('LOW_REAL_LIQUIDITY');
      explanations.push(`A liquidez econômica real (descontando ciclos e estoques) cobre apenas ${(realLiquidityStrength * 100).toFixed(1)}% das obrigações de ciclo imediato.`);
    }

    if (operationalCashPressure < 0.15) {
      activeSignals.push('CASH_COVERAGE_DEFICIT');
      explanations.push(`Pressão primária de caixa: os fundos disponíveis imediatamente cobrem menos de 15% do passivo circulante (${(operationalCashPressure * 100).toFixed(1)}%).`);
    }

    if (immediateCoverageCapacityMonths < 1.0) {
      explanations.push(`Capacidade de cobertura imediata crítica: caixa dimensionado para suprir menos de 1 mês de exigibilidades.`);
    }

    let explanation = '';
    if (activeSignals.length === 0 && explanations.length === 0) {
      explanation = 'A liquidez econômica atual não demonstra tensão imediata ou déficit grave de cobertura no ciclo imediato.';
    } else {
      explanation = explanations.join(' ');
    }

    return {
      realLiquidityStrength,
      operationalCashPressure,
      workingCapitalRealityIndex,
      immediateCoverageCapacityMonths,
      activeSignals,
      explanation
    };
  }
}
