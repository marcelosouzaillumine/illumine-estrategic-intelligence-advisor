import { DataAccessContext } from '../security/data-access-context';
import { OnboardingEngine } from '../onboarding/OnboardingEngine';

export interface ReadinessReport {
  readinessScore: number;
  readinessLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  readinessRisks: string[];
  recommendedActions: string[];
}

export class EnterpriseReadinessDiagnostics {
  /**
   * Generates a readiness scorecard for the tenant based on governance and operational checks.
   */
  public static generateReport(context: DataAccessContext, targetTenantId: string): ReadinessReport {
    if (!context || !context.tenantId) {
      throw new Error('Acesso negado: Contexto incompleto.');
    }

    const isSuperAdmin = context.role === 'SUPER_ADMIN';

    // Verify isolation
    if (!isSuperAdmin && context.tenantId !== targetTenantId) {
      throw new Error('[Readiness Diagnostics] Rejeitado: Acesso cross-tenant negado.');
    }

    const onboarding = OnboardingEngine.getOnboardingState(targetTenantId);

    const risks: string[] = [];
    const actions: string[] = [];
    let score = 0;

    if (onboarding.isolationValidated) {
      score += 15;
    } else {
      risks.push('Isolamento de tenant não foi totalmente auditado/verificado.');
      actions.push('Validar regras de isolamento fiduciário do tenant.');
    }

    if (onboarding.topologyValidated) {
      score += 15;
    } else {
      risks.push('Topologia organizacional incompleta ou inválida.');
      actions.push('Cadastrar entidades e verificar o organograma da holding.');
    }

    if (onboarding.entityScopeConfigured) {
      score += 15;
    } else {
      risks.push('Escopo de entidades e regras de RBAC ausentes.');
      actions.push('Configurar o escopo de entidades permitido aos usuários.');
    }

    if (onboarding.telemetryActive) {
      score += 15;
    } else {
      risks.push('Barramento de telemetria desativado ou sem eventos gravados.');
      actions.push('Ativar o AuditEventBus e registrar eventos fiduciários.');
    }

    if (onboarding.observabilityActive) {
      score += 15;
    } else {
      risks.push('Acesso à Console de Observabilidade não configurado.');
      actions.push('Homologar políticas de acesso à governança e console.');
    }

    if (onboarding.initialBalanceSheetBalanced) {
      score += 15;
    } else {
      risks.push('Balancete contábil inicial desequilibrado ou com erros sintáticos.');
      actions.push('Corrigir inconsistências contábeis no módulo de staging.');
    }

    if (onboarding.advisoryRuntimeOperational) {
      score += 10;
    } else {
      risks.push('Motor de inteligência consultiva (ExecutiveAdvisoryEngine) inoperante.');
      actions.push('Validar cargas financeiras e rodar a síntese de advisory.');
    }

    let level: 'LOW' | 'MEDIUM' | 'HIGH' = 'LOW';
    if (score >= 80) {
      level = 'HIGH';
    } else if (score >= 40) {
      level = 'MEDIUM';
    }

    return {
      readinessScore: score,
      readinessLevel: level,
      readinessRisks: risks,
      recommendedActions: actions
    };
  }
}
