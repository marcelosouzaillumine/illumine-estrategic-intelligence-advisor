import { BPSummary } from '../../../lib/bpEngine';
import { SegmentCode } from '../segment-intelligence/types';
import { SegmentThresholdEngine } from '../segment-intelligence/SegmentThresholdEngine';
import { InventoryLiquidityProfile, StructuralCapitalSignal } from './types';

export class InventoryQualityEngine {
  /**
   * Avalia a qualidade estrutural e liquidez do estoque.
   * Não emite juízo de valor sobre o estoque (ex: "estratégico" vs "obsoleto"),
   * apenas analisa a pressão estrutural imposta pelo capital imobilizado.
   */
  static evaluate(bpSummary: BPSummary, segmentCode: SegmentCode = 'GENERIC_OPERATION'): InventoryLiquidityProfile {
    // Fail-closed: se não há dados de BP, retorna perfil sem pressão (para não penalizar injustamente)
    if (!bpSummary) {
      return {
        inventoryToCurrentAssetsRatio: 0,
        inventoryOperationalDependency: 0,
        inventoryCashConversionStress: 0,
        inventoryCapitalImmobilization: 0,
        activeSignals: [],
        explanation: 'Dados insuficientes para avaliação estrutural de estoques.'
      };
    }

    const {
      estoques,
      ativoCirculante,
      passivoCirculante,
      caixaEquivalentes,
      clientes,
      ativoTotal
    } = bpSummary;

    // Fail-closed: se não há estoque declarado, perfil sem impacto
    if (!estoques || estoques <= 0) {
      return {
        inventoryToCurrentAssetsRatio: 0,
        inventoryOperationalDependency: 0,
        inventoryCashConversionStress: 0,
        inventoryCapitalImmobilization: 0,
        activeSignals: [],
        explanation: 'Operação sem retenção material de capital em estoques.'
      };
    }

    // Cálculos
    const inventoryToCurrentAssetsRatio = ativoCirculante > 0 ? estoques / ativoCirculante : 0;
    const inventoryOperationalDependency = passivoCirculante > 0 ? estoques / passivoCirculante : 0;
    
    const liquidAssets = caixaEquivalentes + clientes;
    const inventoryCashConversionStress = liquidAssets > 0 ? estoques / liquidAssets : estoques > 0 ? 999 : 0; // 999 indica stress infinito
    
    const inventoryCapitalImmobilization = ativoTotal > 0 ? estoques / ativoTotal : 0;

    const activeSignals: StructuralCapitalSignal[] = [];
    const explanations: string[] = [];

    // Avaliação de Thresholds Contextuais
    const thresholds = SegmentThresholdEngine.getThresholdsForSegment(segmentCode);
    const maxInventoryAssets = thresholds.maxInventoryToAssets; // we map maxInventoryToAssets to total assets usually, but let's use it or derive a current assets threshold.
    // A better approach is to use the engine directly, but let's map it: maxInventoryToAssets represents inventory / total assets. Let's also use it to scale Current Assets tolerance.
    const inventoryCurrentAssetsThreshold = maxInventoryAssets * 1.5; // Roughly scale it, or just use evaluateInventoryDependency
    
    if (inventoryToCurrentAssetsRatio > inventoryCurrentAssetsThreshold) {
      activeSignals.push('HIGH_INVENTORY_LIQUIDITY_PRESSURE');
      explanations.push(`Indícios de concentração de capital: estoques representam ${(inventoryToCurrentAssetsRatio * 100).toFixed(1)}% do Ativo Circulante.`);
    }

    if (inventoryOperationalDependency > 1.20) {
      activeSignals.push('INVENTORY_CAPITAL_IMMOBILIZATION');
      explanations.push(`Pressão estrutural de capital: o estoque imobiliza valor equivalente a ${(inventoryOperationalDependency * 100).toFixed(1)}% das obrigações de curto prazo.`);
    }

    if (inventoryCapitalImmobilization > 0.35) {
      explanations.push(`Aprisionamento implícito de capital: ${(inventoryCapitalImmobilization * 100).toFixed(1)}% do patrimônio total alocado em inventário.`);
    }

    let explanation = '';
    if (activeSignals.length === 0 && explanations.length === 0) {
      explanation = 'Nível de inventário sem indícios de retenção crítica ou aprisionamento de capital.';
    } else {
      explanation = explanations.join(' ');
    }

    return {
      inventoryToCurrentAssetsRatio,
      inventoryOperationalDependency,
      inventoryCashConversionStress,
      inventoryCapitalImmobilization,
      activeSignals,
      explanation
    };
  }
}
