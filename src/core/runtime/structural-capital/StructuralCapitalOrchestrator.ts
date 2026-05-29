import { BPSummary } from '../../../lib/bpEngine';
import { InstitutionalContextProfile } from '../institutional-context/types';
import { SegmentCode } from '../segment-intelligence/types';

import { InventoryQualityEngine } from './InventoryQualityEngine';
import { SupplierDependencyEngine } from './SupplierDependencyEngine';
import { ShareholderExposureEngine } from './ShareholderExposureEngine';
import { OperationalLiquidityRealityEngine } from './OperationalLiquidityRealityEngine';
import { StructuralCapitalScoreAdapter } from './StructuralCapitalScoreAdapter';
import { InstitutionalCapitalStageClassifier } from './InstitutionalCapitalStageClassifier';
import { StructuralAdvisoryPriorityEngine } from './StructuralAdvisoryPriorityEngine';
import { StructuralNarrativeComposer } from './StructuralNarrativeComposer';
import { ExecutiveAttentionPriorityMapper } from './ExecutiveAttentionPriorityMapper';

import {
  StructuralCapitalProfile,
  StructuralCapitalSignal,
  StructuralCapitalSeverity
} from './types';

export class StructuralCapitalOrchestrator {
  /**
   * Consolida a avaliação de todas as trilhas estruturais, determinando
   * severidade, score adjustment, narrativa e advisory reordering.
   */
  static analyze(bpSummary: BPSummary, institutionalContext: InstitutionalContextProfile): StructuralCapitalProfile {
    // 1. Avaliações Individuais (Trilhas)
    const inventoryPenaltyFactor = institutionalContext.scoreCalibrationRules.inventoryPenaltyFactor || 0.5;
    const segmentCode = (institutionalContext.operationalSegment?.code as SegmentCode) || 'GENERIC_OPERATION';

    const inventory = InventoryQualityEngine.evaluate(bpSummary, segmentCode);
    const supplier = SupplierDependencyEngine.evaluate(bpSummary);
    const shareholder = ShareholderExposureEngine.evaluate(bpSummary);
    const liquidity = OperationalLiquidityRealityEngine.evaluate(bpSummary, segmentCode, inventoryPenaltyFactor);

    // 2. Consolidação de Sinais
    const signals: StructuralCapitalSignal[] = [
      ...inventory.activeSignals,
      ...supplier.activeSignals,
      ...shareholder.activeSignals,
      ...liquidity.activeSignals
    ];

    // Detecção de Compressão Múltipla
    const highCriticalSignals = [
      'CASH_COVERAGE_DEFICIT',
      'LOW_REAL_LIQUIDITY',
      'HIGH_SUPPLIER_DEPENDENCY',
      'INVENTORY_CAPITAL_IMMOBILIZATION'
    ];

    const concurrentHighSignals = signals.filter(s => highCriticalSignals.includes(s));
    
    let isCompressionActive = false;
    let compressionDescription = 'Sem indícios de compressão de capital ativo.';

    if (concurrentHighSignals.length >= 2) {
      isCompressionActive = true;
      signals.push('CAPITAL_COMPRESSION_ACTIVE');
      compressionDescription = `Compressão ativa de capital: detecção simultânea de ${concurrentHighSignals.join(', ')}.`;
    }

    const compression = {
      isActive: isCompressionActive,
      concurrentHighSignalCount: concurrentHighSignals.length,
      compressionDescription
    };

    // 3. Estágio e Severidade
    const structuralStage = InstitutionalCapitalStageClassifier.classify(signals);

    let severity: StructuralCapitalSeverity = 'NONE';
    if (structuralStage === 'CAPITAL_IMBALANCED_OPERATION') {
      severity = concurrentHighSignals.length >= 3 ? 'CRITICAL' : 'HIGH';
    } else if (structuralStage === 'LIQUIDITY_TENSIONED_OPERATION' || structuralStage === 'SUPPLIER_DEPENDENT_OPERATION') {
      severity = 'MODERATE'; // Pode ser HIGH a depender das regras, mas adotaremos MODERATE como base. Se tiver >1 vira IMBALANCED e vai p/ HIGH.
      if (signals.includes('CASH_COVERAGE_DEFICIT')) {
        severity = 'HIGH'; // Elevado forçadamente por conta de caixa deficitário real
      }
    } else if (structuralStage === 'OPERATIONAL_STABILITY_WITH_CAPITAL_PRESSURE') {
      severity = 'LOW';
    }

    // 4. Ajuste de Score
    const scoreAdjustment = StructuralCapitalScoreAdapter.calculateDelta(
      signals,
      liquidity.realLiquidityStrength,
      supplier.supplierToInventory,
      liquidity.immediateCoverageCapacityMonths
    );

    // 5. Mapeamento de Atenção Executiva
    const executiveAttentionMap = ExecutiveAttentionPriorityMapper.map(signals);

    // 6. Narrativa Fiduciária
    const fiduciaryNarrative = StructuralNarrativeComposer.compose(
      structuralStage,
      inventory,
      supplier,
      shareholder,
      liquidity
    );

    // 7. Audit Trail (Fail-closed e Auditável)
    const auditTrail: Record<string, string> = {};
    if (severity === 'CRITICAL' || severity === 'HIGH') {
      if (signals.includes('HIGH_INVENTORY_LIQUIDITY_PRESSURE')) auditTrail['inventoryToCurrentAssetsRatio'] = `> 0.55 (${inventory.inventoryToCurrentAssetsRatio.toFixed(2)})`;
      if (signals.includes('HIGH_SUPPLIER_DEPENDENCY')) auditTrail['supplierToTotalLiabilities'] = `> 0.50 (${supplier.supplierToTotalLiabilities.toFixed(2)})`;
      if (signals.includes('CASH_COVERAGE_DEFICIT')) auditTrail['operationalCashPressure'] = `< 0.15 (${liquidity.operationalCashPressure.toFixed(2)})`;
      if (signals.includes('HIGH_SHAREHOLDER_OPERATIONAL_INTERDEPENDENCE')) auditTrail['shareholderCurrentAccountRatio'] = `> 0.20 (${shareholder.shareholderCurrentAccountRatio.toFixed(2)})`;
    }

    return {
      signals,
      severity,
      structuralStage,
      inventory,
      supplier,
      shareholder,
      liquidity,
      compression,
      scoreAdjustment,
      advisoryPriorities: [], // Será preenchido no runtime através de reprioritize
      fiduciaryNarrative,
      executiveAttentionMap,
      auditTrail
    };
  }

  /**
   * Applica a repriorização do advisory de forma externa se necessário.
   * Isolado para facilitar injeção do action matrix original.
   */
  static reprioritizeAdvisory(
    profile: StructuralCapitalProfile,
    originalActionMatrix: string[]
  ): string[] {
    profile.advisoryPriorities = StructuralAdvisoryPriorityEngine.reprioritize(
      profile.severity,
      originalActionMatrix
    );
    return profile.advisoryPriorities;
  }
}
