// src/core/runtime/lifecycle/LifecycleSemanticAuthority.ts

import { LifecycleStage } from './LifecycleClassificationEngine';
import { LifecycleContext } from './LifecycleContextBuilder';

export interface SemanticLabelMapping {
  rawRiskLevel: string;
  semanticLabel: string; // Translation key or pt-BR default
}

export interface SemanticLifecycleProfile {
  lifecycleStage: LifecycleStage;
  lifecycleConfidence: 'HIGH' | 'MEDIUM' | 'LOW';
  governanceStatus: SemanticLabelMapping;
  capitalStatus: SemanticLabelMapping;
  earningsStatus: SemanticLabelMapping;
  cashStatus: SemanticLabelMapping;
  narrativeProfile: 'EARLY_STAGE' | 'GROWTH_STAGE' | 'MATURE_STAGE' | 'RESTRUCTURING_STAGE' | 'UNKNOWN';
  allowedLabels: string[];
  forbiddenLabels: string[];
}

export class LifecycleSemanticAuthority {
  public static getSemanticProfile(context: LifecycleContext): SemanticLifecycleProfile {
    const stage = context.classification.stage;
    const confidence = context.classification.confidence;

    // Default designations based on stage
    const isEarly = stage === 'INITIAL_CAPITALIZATION' || stage === 'EARLY_GROWTH';
    const isRestructuring = stage === 'RESTRUCTURING';
    const isDeclining = stage === 'DECLINING';

    let narrativeProfile: 'EARLY_STAGE' | 'GROWTH_STAGE' | 'MATURE_STAGE' | 'RESTRUCTURING_STAGE' | 'UNKNOWN' = 'UNKNOWN';
    if (isEarly) narrativeProfile = 'EARLY_STAGE';
    else if (stage === 'EXPANSION' || stage === 'SCALING') narrativeProfile = 'GROWTH_STAGE';
    else if (stage === 'MATURE') narrativeProfile = 'MATURE_STAGE';
    else if (isRestructuring || isDeclining) narrativeProfile = 'RESTRUCTURING_STAGE';

    // Allowed / Forbidden Labels definitions for early stage to satisfy EARLY_STAGE_SEMANTIC_CONTRADICTION
    let allowedLabels: string[] = [];
    let forbiddenLabels: string[] = [];

    if (isEarly) {
      allowedLabels = [
        'Governança em Estruturação',
        'Governança em Consolidação',
        'Estrutura de Capital em Formação',
        'Estrutura de Caixa Dependente de Capitalização Inicial',
        'Fase de Custeio Operacional Inicial',
        'Governança Estruturada',
        'Base de Capital em Expansão',
        'Fluxo de Caixa em Consolidação',
        'Rentabilidade Operacional em Evolução'
      ];
      forbiddenLabels = [
        'Colapso de Capital',
        'Colapso Patrimonial',
        'Deterioração Fiduciária',
        'Deterioração Histórica',
        'Ruptura de Caixa',
        'Capital Under Collapse',
        'High Capital Erosion',
        'WEAK CAPITAL PROTECTION',
        'Governança Fragilizada',
        'Governança Crítica',
        'Erosão Severa',
        'Erosão Crítica',
        'Ruptura Crítica'
      ];
    }

    // Resolve Governance, Capital, Earnings, Cash mappings
    // 1. Governance
    const rawGov = context.netIncome < 0 ? 'CRITICAL' : 'STABLE';
    const govLabel = isEarly 
      ? 'Governança em Estruturação' 
      : (stage === 'UNKNOWN_LIFECYCLE' ? 'Governança em Consolidação' : 'Governança Estruturada');

    // 2. Capital
    const rawCapital = context.capitalSocial > 0 && context.netIncome < 0 ? 'HIGH_RISK' : 'LOW_RISK';
    const capLabel = isEarly
      ? 'Estrutura de Capital em Formação'
      : (stage === 'UNKNOWN_LIFECYCLE' ? 'Base de Capital em Expansão' : 'Base de Capital Consolidada');

    // 3. Cash
    const rawCash = context.revenue === 0 ? 'CRITICAL' : 'STABLE';
    const cashLabel = isEarly
      ? 'Estrutura de Caixa Dependente de Capitalização Inicial'
      : (stage === 'UNKNOWN_LIFECYCLE' ? 'Fluxo de Caixa em Consolidação' : 'Fluxo de Caixa Estável');

    // 4. Earnings
    const rawEarnings = context.netIncome < 0 ? 'CRITICAL' : 'STABLE';
    const earningsLabel = isEarly
      ? 'Fase de Custeio Operacional Inicial'
      : (stage === 'UNKNOWN_LIFECYCLE' ? 'Rentabilidade Operacional em Evolução' : 'Rentabilidade Operacional Consolidada');

    return {
      lifecycleStage: stage,
      lifecycleConfidence: confidence,
      governanceStatus: { rawRiskLevel: rawGov, semanticLabel: govLabel },
      capitalStatus: { rawRiskLevel: rawCapital, semanticLabel: capLabel },
      cashStatus: { rawRiskLevel: rawCash, semanticLabel: cashLabel },
      earningsStatus: { rawRiskLevel: rawEarnings, semanticLabel: earningsLabel },
      narrativeProfile,
      allowedLabels,
      forbiddenLabels
    };
  }

  /**
   * Translates or overrides a given status label/level based on corporate lifecycle.
   */
  public static resolveSemanticLabel(
    category: 'governance' | 'capital' | 'earnings' | 'cash',
    rawRiskLevel: string,
    stage: LifecycleStage
  ): string {
    const isEarly = stage === 'INITIAL_CAPITALIZATION' || stage === 'EARLY_GROWTH';
    if (!isEarly) {
      // Pass-through or direct map for mature/other cycles
      return rawRiskLevel;
    }

    // Contextualized override labels for early stage
    switch (category) {
      case 'governance':
        return 'Governança em Estruturação';
      case 'capital':
        return 'Estrutura de Capital em Formação';
      case 'cash':
        return 'Estrutura de Caixa Dependente de Capitalização Inicial';
      case 'earnings':
        return 'Fase de Custeio Operacional Inicial';
      default:
        return rawRiskLevel;
    }
  }
}
