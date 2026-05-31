// src/core/runtime/executive-command/InstitutionalDirectiveEngine.ts

import { CommandEvaluationContext } from './command-adapter';
import { ExecutiveDirective } from './executive-command-types';

export class InstitutionalDirectiveEngine {
  static evaluate(context: CommandEvaluationContext): ExecutiveDirective[] {
    const directives: ExecutiveDirective[] = [];
    const timestamp = new Date().toISOString();

    if (context.historicalCyclesCount < 3) {
      return directives; // Fail-closed
    }

    // Rule 1: Survival Mode triggers Expansion Suspension
    if (context.activeSurvivalMode === 'SURVIVAL_MODE') {
      directives.push({
        id: `DIR-EXP-SUSP-${context.lineageHash.substring(0, 8)}`,
        category: 'EXPANSION_SUSPENSION',
        title: 'Suspensão de Expansão Estrutural',
        statement: 'Descontinuar iniciativas de expansão e alocação de risco corporativo devido ao estado de sobrevivência institucional ativo.',
        severity: 'RESTRICTIVE',
        causalDrivers: ['activeSurvivalMode: SURVIVAL_MODE'],
        lineageHash: context.lineageHash,
        createdAt: timestamp,
        status: 'PENDING_REVIEW'
      });
    }

    // Rule 2: Treasury Protection Level triggers Capital Preservation
    if (context.treasuryProtectionLevel.includes('WEAK') || context.treasuryProtectionLevel.includes('CRITICAL')) {
      directives.push({
        id: `DIR-CAP-PRES-${context.lineageHash.substring(0, 8)}`,
        category: 'CAPITAL_PRESERVATION',
        title: 'Preservação Cautelar de Capital',
        statement: 'Deter distribuições de dividendos e priorizar retenção máxima de liquidez até estabilização das proteções de tesouraria.',
        severity: 'CRITICAL',
        causalDrivers: [`treasuryProtectionLevel: ${context.treasuryProtectionLevel}`],
        lineageHash: context.lineageHash,
        createdAt: timestamp,
        status: 'PENDING_REVIEW'
      });
    }

    // Rule 3: Operating Pressure triggers Liquidity Stabilization
    if (context.operatingPressureSeverity === 'HIGH' || context.operatingPressureSeverity === 'CRITICAL') {
      directives.push({
        id: `DIR-LIQ-STAB-${context.lineageHash.substring(0, 8)}`,
        category: 'LIQUIDITY_STABILIZATION',
        title: 'Estabilização Prioritária de Liquidez',
        statement: 'Obrigatoriedade na defesa de margem e otimização do ciclo de conversão de caixa face à pressão operacional.',
        severity: 'ELEVATED',
        causalDrivers: [`operatingPressureSeverity: ${context.operatingPressureSeverity}`],
        lineageHash: context.lineageHash,
        createdAt: timestamp,
        status: 'PENDING_REVIEW'
      });
    }

    // Rule 4: Stable and healthy triggers Structural Growth
    if (context.activeSurvivalMode === 'NORMAL' && 
        context.treasuryProtectionLevel === 'STRONG_CAPITAL_PROTECTION' && 
        context.operatingPressureSeverity === 'LOW') {
      directives.push({
        id: `DIR-STR-GRW-${context.lineageHash.substring(0, 8)}`,
        category: 'STRUCTURAL_GROWTH',
        title: 'Autorização para Expansão Estrutural',
        statement: 'Condições fiduciárias favoráveis para alocação de capital em iniciativas de expansão protegida.',
        severity: 'STANDARD',
        causalDrivers: ['Healthy Institutional Topology'],
        lineageHash: context.lineageHash,
        createdAt: timestamp,
        status: 'PENDING_REVIEW'
      });
    }

    return directives;
  }
}
