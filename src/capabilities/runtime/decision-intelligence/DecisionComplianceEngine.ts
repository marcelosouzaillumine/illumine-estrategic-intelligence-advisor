// src/core/runtime/decision-intelligence/DecisionComplianceEngine.ts
//
// Institutional Decision Compliance Engine
// Ref: docs/implementation_plan.md

import { ExecutiveDecision, DecisionSeverity, SurvivabilityScores } from './decision-types';
import { PolicyContext } from '../../core/runtime/decision-policy/policy-types';
import { ContextualSeverityEngine } from '../../core/runtime/decision-policy/ContextualSeverityEngine';

export class DecisionComplianceEngine {
  /**
   * Validates an executive decision against the current financial and operational report context.
   */
  public static validate(
    decision: ExecutiveDecision,
    report: any,
    survivabilityScores: SurvivabilityScores,
    policyContext?: PolicyContext
  ): { isValid: boolean; severity: DecisionSeverity; violations: string[]; warnings: string[] } {
    const violations: string[] = [];
    const warnings: string[] = [];
    let severity: DecisionSeverity = 'SAFE';

    if (!decision) {
      throw new Error('VIOLAÇÃO DE GOVERNANÇA: Impossível validar decisão nula.');
    }

    const { domains } = decision;

    // Report context variables
    const netIncome = report.metrics?.netIncome ?? report.netIncome ?? 0;
    const isErosionActive = report.capitalGovernanceReport?.preservation?.preservationStatus === 'EROSÃO_RELEVANTE' ||
      report.capitalGovernanceReport?.preservation?.preservationStatus === 'FRAGILIDADE_PATRIMONIAL';
    
    const ocf = report.cashFlowReport?.operational?.fco ?? report.ocf ?? 0;

    // Resolve profile-specific score limits
    const minLiq = policyContext?.survivabilityTolerance.minLiquidityScore ?? 30;
    const minDebt = policyContext?.survivabilityTolerance.minDebtScore ?? 30;
    const minCap = policyContext?.survivabilityTolerance.minCapitalPreservationScore ?? 30;
    const minComposite = policyContext?.survivabilityTolerance.minCompositeScore ?? 50;

    // 1. Mandatory survivability score checks (blocks key domains)
    const blocksExpansions =
      survivabilityScores.liquidity < minLiq ||
      survivabilityScores.debt < minDebt ||
      survivabilityScores.capitalPreservation < minCap;

    if (blocksExpansions) {
      const blockedDomains = [
        'Dividend Distribution',
        'CAPEX',
        'Debt Expansion',
        'Workforce Expansion',
        'Operational Expansion',
        'Financing Strategy'
      ];
      const hasBlockedDomain = domains.some(d => blockedDomains.includes(d));
      if (hasBlockedDomain) {
        violations.push(
          `BLOQUEIO DE SOBREVIVÊNCIA: Risco crítico detectado em Liquidez (${survivabilityScores.liquidity}), Dívida (${survivabilityScores.debt}) ou Capital (${survivabilityScores.capitalPreservation}) abaixo do limite de ${minLiq}/${minDebt}/${minCap}. Decisões de expansão, dividendos e CAPEX estão terminantemente bloqueadas.`
        );
        severity = 'UNSUSTAINABLE';
      }
    }

    // 2. Composite survivability score below target triggers fail-closed
    if (survivabilityScores.composite < minComposite) {
      violations.push(
        `BLOQUEIO DE SOBREVIVÊNCIA: Índice de sobrevivência composto (${survivabilityScores.composite}) abaixo de ${minComposite}/100. Estado de fail-closed ativado.`
      );
      severity = 'UNSUSTAINABLE';
    }

    // 3. Any survivability dimension below 40/100 must trigger confidence degradation & elevated severity
    const hasAnyDimensionBelow40 =
      survivabilityScores.liquidity < 40 ||
      survivabilityScores.operational < 40 ||
      survivabilityScores.governance < 40 ||
      survivabilityScores.debt < 40 ||
      survivabilityScores.capitalPreservation < 40 ||
      survivabilityScores.strategic < 40;

    if (hasAnyDimensionBelow40) {
      if ((severity as string) !== 'UNSUSTAINABLE' && (severity as string) !== 'CONSTITUTIONAL_VIOLATION') {
        severity = 'CRITICAL';
      }
      warnings.push(
        'Alerta de Sobrevivência: Confiança fiduciária degradada devido a dimensão de sobrevivência abaixo de 40/100. Recomendações restritas.'
      );
    }

    // 4. Forbidden Decision Rules

    // A. Dividend Distribution under Patrimonial Erosion
    if (domains.includes('Dividend Distribution')) {
      if (isErosionActive || netIncome <= 0) {
        violations.push(
          `VIOLAÇÃO CONSTITUCIONAL: Distribuição de Dividendos rejeitada devido a erosão patrimonial ativa ou ausência de lucro líquido positivo (${netIncome}).`
        );
        severity = 'CONSTITUTIONAL_VIOLATION';
      }
    }

    // B. Sector-Specific Block for distributions (e.g. Nonprofits cannot distribute dividends)
    if (policyContext?.sectorGovernance.allowDistribution === false && domains.includes('Dividend Distribution')) {
      violations.push(
        'VIOLAÇÃO CONSTITUCIONAL: Distribuição de Dividendos rejeitada. Organizações do setor sem fins lucrativos (Nonprofit) possuem proibição estatutária de distribuição de capital.'
      );
      severity = 'CONSTITUTIONAL_VIOLATION';
    }

    // C. Operational / Workforce Expansion under Critical Liquidity Stress
    if (domains.includes('Operational Expansion') || domains.includes('Workforce Expansion')) {
      const isLiquidityCritical = report.scores?.financial < 40 || report.severity?.level === 'CRÍTICA' || ocf < 0;
      if (isLiquidityCritical && survivabilityScores.liquidity < 40) {
        violations.push(
          'VIOLAÇÃO FIDUCIÁRIA: Expansão operacional ou de pessoal rejeitada. A empresa encontra-se sob estresse crítico de liquidez ou fluxo de caixa operacional negativo.'
        );
        severity = 'UNSUSTAINABLE';
      }
    }

    // D. Debt Expansion without structural repayment capacity
    if (domains.includes('Debt Expansion')) {
      const ebitda = report.metrics?.ebitda ?? report.ebitda ?? 0;
      const isHighlyLeveraged = report.capitalGovernanceReport?.behavior?.governanceMaturity === 'FRÁGIL' || ebitda <= 0;
      if (isHighlyLeveraged) {
        violations.push(
          'VIOLAÇÃO FIDUCIÁRIA: Expansão de dívida rejeitada. Capacidade estrutural de pagamento insuficiente (EBITDA negativo ou fragilidade de governança).'
        );
        severity = 'UNSUSTAINABLE';
      }
    }

    // E. CAPEX incompatible with cash sustainability
    if (domains.includes('CAPEX')) {
      const cashSustainability = report.cashSustainabilityReport?.score ?? 100;
      if (ocf < 0 || cashSustainability < 40) {
        violations.push(
          'VIOLAÇÃO FIDUCIÁRIA: CAPEX rejeitado. Investimento de capital incompatível com a sustentabilidade de caixa e geração de caixa operacional negativa.'
        );
        severity = 'UNSUSTAINABLE';
      }
    }

    // F. Shareholder withdrawals under institutional deterioration
    if (domains.includes('Dividend Distribution') || domains.includes('Financing Strategy')) {
      if (report.severity?.level === 'CRÍTICA' && report.scores?.composite < 40) {
        violations.push(
          'VIOLAÇÃO CONSTITUCIONAL: Retiradas de acionistas bloqueadas sob contexto de grave deterioração institucional e fragilidade fiduciária.'
        );
        severity = 'CONSTITUTIONAL_VIOLATION';
      }
    }

    // 5. Warning flags and generic severity modulation based on scores
    if (violations.length === 0) {
      if (
        survivabilityScores.composite < 60 ||
        survivabilityScores.liquidity < 40 ||
        survivabilityScores.debt < 40 ||
        survivabilityScores.capitalPreservation < 40
      ) {
        if ((severity as string) !== 'CRITICAL') {
          severity = 'CRITICAL';
        }
        if (!warnings.includes('Alerta de Sobrevivência: Indicadores próximos a limites críticos.')) {
          warnings.push('Alerta de Sobrevivência: Indicadores próximos a limites críticos.');
        }
      } else if (
        survivabilityScores.composite < 80 ||
        survivabilityScores.liquidity < 60 ||
        survivabilityScores.debt < 60
      ) {
        if ((severity as string) === 'SAFE' || (severity as string) === 'ATTENTION') {
          severity = 'HIGH_RISK';
        }
        if (!warnings.includes('Aviso de Sobrevivência: Monitoramento recomendado para o domínio da decisão.')) {
          warnings.push('Aviso de Sobrevivência: Monitoramento recomendado para o domínio da decisão.');
        }
      } else if (survivabilityScores.composite < 90) {
        if ((severity as string) === 'SAFE') {
          severity = 'ATTENTION';
        }
      }
    }

    // 6. Contextual Severity Modulation & Violation Bypassing
    if (policyContext) {
      const nonBypassableTriggers = [
        'lucro líquido', 'prejuízo', 'erosão patrimonial', 'lineage hash',
        'rastreabilidade', 'matemática', 'safeguard', 'bypass',
        'sem contexto', 'contexto institucional', 'constitucional'
      ];

      const activeViolations = [...violations];
      const activeWarnings = [...warnings];
      const filteredViolations: string[] = [];

      for (const violation of activeViolations) {
        const lower = violation.toLowerCase();
        const isNonBypassable = nonBypassableTriggers.some(t => lower.includes(t));

        if (!isNonBypassable && (!policyContext.materiality.isMaterial || policyContext.flexibilityModifiers.bypassMinorBlocks)) {
          // Bypassed: move to warnings
          activeWarnings.push(`Aviso de Sobrevivência (Bloqueio Mitigado): ${violation}`);
        } else if (!isNonBypassable && policyContext.activeProfile === 'TURNAROUND' && (lower.includes('dívida') || lower.includes('debt') || lower.includes('leverage'))) {
          // Allowed under turnaround restructuring: move to warnings
          activeWarnings.push(`Aviso de Sobrevivência (Restruturação Turnaround): ${violation}`);
        } else if (!isNonBypassable && policyContext.activeProfile === 'HYPER_GROWTH' && (lower.includes('capex') || lower.includes('expansão') || lower.includes('expansion'))) {
          // Allowed under hyper growth expansion: move to warnings
          activeWarnings.push(`Aviso de Sobrevivência (Expansão Controlada): ${violation}`);
        } else {
          filteredViolations.push(violation);
        }
      }

      violations.length = 0;
      violations.push(...filteredViolations);

      warnings.length = 0;
      warnings.push(...activeWarnings);

      // Recalculate severity dynamically
      const adjustedSeverity = ContextualSeverityEngine.adjustSeverity(severity, violations, policyContext);
      severity = adjustedSeverity;
    }

    const isValid = violations.length === 0 && severity !== 'UNSUSTAINABLE' && severity !== 'CONSTITUTIONAL_VIOLATION';

    return {
      isValid,
      severity,
      violations,
      warnings
    };
  }
}
