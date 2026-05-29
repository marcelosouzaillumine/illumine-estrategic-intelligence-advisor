import { ActionEvidenceResolver } from './ActionEvidenceResolver';
import { InstitutionalNarrativeToneGuard } from '../../enforcement/InstitutionalNarrativeToneGuard';
import { SegmentCode } from '../segment-intelligence/types';
import { SegmentNarrativeAdapter } from '../segment-intelligence/SegmentNarrativeAdapter';
import { GlobalFiduciaryDistributionEnforcementEngine } from '../governance/fiduciary-enforcement/GlobalFiduciaryDistributionEnforcementEngine';

export interface ExecutiveActionItem {
  title: string;
  category: string;
  priority: string;
  timeline: string;
  expectedImpact: string;
  executionRisk: string;
  monitoringKPI: string;
  fiduciaryEvidence: string;
  severity: string;
}

export class ExecutiveActionMatrixEngine {
  public static buildMatrix(
    actions: string[],
    metrics: any,
    bpSummary: any,
    causality: any,
    severityLevel: string,
    segmentCode: SegmentCode = 'GENERIC_OPERATION',
    fiduciaryOutput?: any,
    survivalReport?: any
  ): ExecutiveActionItem[] {
    if (!metrics || metrics.hasData === false) {
      return [];
    }

    if (!actions || actions.length === 0) {
      return [];
    }

    const enforcement = GlobalFiduciaryDistributionEnforcementEngine.evaluate(fiduciaryOutput);
    const isSurvivalMode = survivalReport && survivalReport.activeSurvivalMode === 'SURVIVAL_MODE';

    const bp = bpSummary || {};
    const items: ExecutiveActionItem[] = [];
    const processedActions: string[] = [];

    let blockedDistributionFound = false;
    let blockedCapexFound = false;

    // Under survival mode, we prioritize these actions at the top of the matrix
    if (isSurvivalMode) {
      processedActions.push(
        '[ ] CASH_PRESERVATION: Preservação de caixa e foco absoluto em liquidez imediata.',
        '[ ] COST_CONTAINMENT: Contenção de despesas operacionais discricionárias.',
        '[ ] TREASURY_STABILIZATION: Medidas emergenciais para estabilização de tesouraria.',
        '[ ] OPERATIONAL_RECOVERY: Foco em recuperação operacional e saneamento de margens.',
        '[ ] LIABILITY_PROTECTION: Proteção e renegociação fiduciária de passivos críticos.'
      );
    }

    for (const action of actions) {
      const lower = action.toLowerCase();

      // Check survival mode blocks (Constraint 4 and rules)
      if (isSurvivalMode) {
        const isBlockedSurvivalAction =
          lower.includes('expans') ||
          lower.includes('crescimento') ||
          lower.includes('hiring') ||
          lower.includes('contrat') ||
          lower.includes('divid') ||
          lower.includes('distrib') ||
          lower.includes('payout') ||
          lower.includes('retirada') ||
          lower.includes('extração') ||
          lower.includes('socio') ||
          lower.includes('capex') ||
          lower.includes('alavancagem') ||
          lower.includes('investimento');

        if (isBlockedSurvivalAction) {
          continue; // Expunge under survival mode
        }
      }

      // Check standard distribution block
      if (enforcement.enforcementTriggered) {
        const isDistributionAction =
          lower.includes('distrib') ||
          lower.includes('dividendo') ||
          lower.includes('payout') ||
          lower.includes('retirada') ||
          lower.includes('extração') ||
          lower.includes('pró-labore') ||
          lower.includes('socio');
        
        if (isDistributionAction) {
          blockedDistributionFound = true;
          continue; // Expunge
        }
      }

      // Check standard Capex block under stress
      if (enforcement.capexEnforcementTriggered) {
        const isCapexAction =
          lower.includes('capex') ||
          lower.includes('expansão') ||
          lower.includes('alavancagem') ||
          lower.includes('investimento em expansão');

        if (isCapexAction) {
          blockedCapexFound = true;
          continue; // Expunge
        }
      }

      processedActions.push(action);
    }

    // Append replacements if blocked (only if not in survival mode to avoid duplicate recovery actions)
    if (!isSurvivalMode) {
      if (blockedDistributionFound) {
        processedActions.push(
          '[ ] Preservação de caixa: suspensão de dividendos e retiradas extraordinárias.',
          '[ ] Reforço de capital: retenção integral dos lucros para recomposição do PL.',
          '[ ] Estabilização da tesouraria e blindagem do capital de giro.',
          '[ ] Foco em recuperação operacional para atingimento do break-even.',
          '[ ] Reestruturação patrimonial e recomposição das reservas exauridas.'
        );
      }

      if (blockedCapexFound) {
        processedActions.push(
          '[ ] Capex Freeze: suspensão preventiva de novos investimentos não fundados.',
          '[ ] Capex Rephasing: reprogramação do cronograma de desembolso de investimentos.',
          '[ ] Captação de funding externo dedicado antes de qualquer expansão.',
          '[ ] Proteção de tesouraria: preservação de caixa livre mínimo.',
          '[ ] Prioridade absoluta para recuperação da rentabilidade operacional antes de capex.'
        );
      }
    }

    for (let i = 0; i < processedActions.length; i++) {
      const action = processedActions[i];
      const item = this.mapAction(action, i, metrics, bp, causality, severityLevel, segmentCode);
      
      // Mandatory Adjustment 3: Omit action if it has no valid fiduciaryEvidence
      if (item && item.fiduciaryEvidence && item.fiduciaryEvidence.trim().length > 0) {
        items.push(item);
      }
    }

    return items;
  }

  private static mapAction(
    action: string,
    index: number,
    metrics: any,
    bp: any,
    causality: any,
    severityLevel: string,
    segmentCode: SegmentCode
  ): ExecutiveActionItem | null {
    const harmonizedAction = SegmentNarrativeAdapter.harmonizeText(action, segmentCode);
    const lower = harmonizedAction.toLowerCase();
    
    // Default metadata inference (matching ExecutivePerspectiveSection logic)
    let category = 'Governança Corporativa';
    let priority = 'Normal';
    let timeline = 'Longo Prazo';
    let expectedImpact = 'Ajuste de estrutura operacional';
    let executionRisk = 'Instabilidade tática';
    let monitoringKPI = 'EBITDA / ROL';
    let fiduciaryEvidence = '';

    // Category
    if (lower.includes('receita') || lower.includes('comercial') || lower.includes('venda') || lower.includes('market') || lower.includes('faturamento') || lower.includes('cliente')) {
      category = 'Gestão Comercial';
    } else if (lower.includes('pessoa') || lower.includes('equipe') || lower.includes('liderança') || lower.includes('talent') || lower.includes('rh') || lower.includes('humano')) {
      category = 'Gestão de Pessoas';
    } else if (lower.includes('caixa') || lower.includes('liquid') || lower.includes('financ') || lower.includes('dívida') || lower.includes('cr') || lower.includes('capital') || lower.includes('investimento') || lower.includes('fornecedores') || lower.includes('sócios') || lower.includes('tesouraria')) {
      category = 'Gestão Financeira';
    } else if (lower.includes('operac') || lower.includes('processo') || lower.includes('eficiên') || lower.includes('produt') || lower.includes('estrutura') || lower.includes('escala') || lower.includes('estoque') || lower.includes('ciclo')) {
      category = 'Gestão Operacional';
    } else if (lower.includes('estratég') || lower.includes('posicion') || lower.includes('mercado') || lower.includes('competi') || lower.includes('inovaç')) {
      category = 'Gestão Estratégica';
    }

    // Priority
    if (lower.includes('imediato') || lower.includes('urgente') || lower.includes('crítico') || lower.includes('risco') || index === 0) {
      priority = 'Alta';
    } else if (index === 1) {
      priority = 'Média';
    }

    // Timeline
    if (lower.includes('imediato') || lower.includes('curto') || lower.includes('30 dias') || lower.includes('60 dias')) {
      timeline = 'Curto Prazo';
    } else if (lower.includes('médio') || lower.includes('90 dias') || lower.includes('180 dias')) {
      timeline = 'Médio Prazo';
    }

    // Fiduciary Evidence Mapping based on ActionEvidenceResolver
    const resolvedEvidence = ActionEvidenceResolver.resolve(action, metrics);
    if (resolvedEvidence) {
      fiduciaryEvidence = resolvedEvidence.evidence;
      monitoringKPI = resolvedEvidence.kpi;
      expectedImpact = resolvedEvidence.expectedImpact;
      executionRisk = resolvedEvidence.executionRisk;
    } else {
      // General fallbacks se o resolver não capturar (mas evitar PL e Ativos Totais na Economia Unitária)
      if (lower.includes('economia unitária') || lower.includes('unit economics')) {
         fiduciaryEvidence = `A estrutura operacional corrente não disponibiliza evidências maduras de tração unitária.`;
         monitoringKPI = 'Ticket Médio e DRE Operacional';
      } else {
         fiduciaryEvidence = `O diagnóstico estrutural requer alinhamento das práticas de gestão nesta frente.`;
      }
    }

    return {
      title: InstitutionalNarrativeToneGuard.enforce(harmonizedAction),
      category: InstitutionalNarrativeToneGuard.enforce(category),
      priority,
      timeline,
      expectedImpact: InstitutionalNarrativeToneGuard.enforce(expectedImpact),
      executionRisk: InstitutionalNarrativeToneGuard.enforce(executionRisk),
      monitoringKPI: InstitutionalNarrativeToneGuard.enforce(monitoringKPI),
      fiduciaryEvidence: InstitutionalNarrativeToneGuard.enforce(fiduciaryEvidence),
      severity: severityLevel
    };
  }
}
