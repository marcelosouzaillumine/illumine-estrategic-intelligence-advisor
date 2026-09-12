import { PlanTierName } from './CommercialReadinessTypes';
import { InstitutionalOfferingRegistry } from './InstitutionalOfferingRegistry';
import { RuntimeQuotaAuditTrail } from './RuntimeQuotaAuditTrail';

export interface TenantUsageMetrics {
  currentBudgetMs: number;
  currentTopologyDepth: number;
  currentAdvisoryCount: number;
}

export class RuntimeUsageGovernance {
  private static tenantUsage: Record<string, TenantUsageMetrics> = {};

  public static initializeTenant(tenantId: string): void {
    if (!this.tenantUsage[tenantId]) {
      this.tenantUsage[tenantId] = {
        currentBudgetMs: 0,
        currentTopologyDepth: 0,
        currentAdvisoryCount: 0
      };
    }
  }

  public static getUsage(tenantId: string): TenantUsageMetrics {
    this.initializeTenant(tenantId);
    return this.tenantUsage[tenantId];
  }

  public static resetUsage(tenantId: string): void {
    this.tenantUsage[tenantId] = {
      currentBudgetMs: 0,
      currentTopologyDepth: 0,
      currentAdvisoryCount: 0
    };
  }

  /**
   * Asserts if execution can proceed under commercial quotas.
   * Throws Error on saturation or quota overflow.
   */
  public static assertExecutionBudget(
    tenantId: string,
    plan: PlanTierName,
    requestedDurationMs: number,
    requestedTopologyDepth: number
  ): void {
    this.initializeTenant(tenantId);
    const tier = InstitutionalOfferingRegistry.getTier(plan);
    if (!tier) {
      throw new Error(`[QUOTA-GOV-001]: Plan ${plan} not found in Commercial Tier Registry.`);
    }

    const usage = this.tenantUsage[tenantId];
    const targetBudget = usage.currentBudgetMs + requestedDurationMs;

    // Check Topology Depth
    if (requestedTopologyDepth > tier.topologyExecutionLimitDepth) {
      RuntimeQuotaAuditTrail.logEvent(
        tenantId,
        'EXECUTION_DENIAL',
        `Topology depth ${requestedTopologyDepth} exceeds plan limit of ${tier.topologyExecutionLimitDepth}`,
        usage.currentBudgetMs,
        tier.executionBudgetLimitMs,
        requestedTopologyDepth,
        tier.topologyExecutionLimitDepth,
        usage.currentAdvisoryCount,
        tier.advisoryGenerationQuotaLimit
      );
      throw new Error(
        `[QUOTA-GOV-002]: Execution denied. Requested topology depth ${requestedTopologyDepth} exceeds plan limit ${tier.topologyExecutionLimitDepth}.`
      );
    }

    // Check Budget Limit
    if (targetBudget > tier.executionBudgetLimitMs) {
      RuntimeQuotaAuditTrail.logEvent(
        tenantId,
        'EXECUTION_DENIAL',
        `Budget overflow. Requested ${requestedDurationMs}ms, resulting in ${targetBudget}ms of budget (Limit: ${tier.executionBudgetLimitMs}ms)`,
        usage.currentBudgetMs,
        tier.executionBudgetLimitMs,
        requestedTopologyDepth,
        tier.topologyExecutionLimitDepth,
        usage.currentAdvisoryCount,
        tier.advisoryGenerationQuotaLimit
      );
      throw new Error(
        `[QUOTA-GOV-003]: Execution denied. Budget limit exceeded. Used/Pending: ${targetBudget}ms, Limit: ${tier.executionBudgetLimitMs}ms.`
      );
    }

    // Increment Usage
    usage.currentBudgetMs = targetBudget;
    usage.currentTopologyDepth = Math.max(usage.currentTopologyDepth, requestedTopologyDepth);

    // Saturation and Throttling Logging
    if (usage.currentBudgetMs > tier.executionBudgetLimitMs * 0.8) {
      RuntimeQuotaAuditTrail.logEvent(
        tenantId,
        'SATURATION',
        `Tenant resources saturated at ${((usage.currentBudgetMs / tier.executionBudgetLimitMs) * 100).toFixed(1)}%`,
        usage.currentBudgetMs,
        tier.executionBudgetLimitMs,
        usage.currentTopologyDepth,
        tier.topologyExecutionLimitDepth,
        usage.currentAdvisoryCount,
        tier.advisoryGenerationQuotaLimit
      );
    } else {
      RuntimeQuotaAuditTrail.logEvent(
        tenantId,
        'CONSUMPTION',
        `Consumed ${requestedDurationMs}ms of budget`,
        usage.currentBudgetMs,
        tier.executionBudgetLimitMs,
        usage.currentTopologyDepth,
        tier.topologyExecutionLimitDepth,
        usage.currentAdvisoryCount,
        tier.advisoryGenerationQuotaLimit
      );
    }
  }

  /**
   * Asserts if advisory count is under tier limits
   */
  public static assertAdvisoryQuota(tenantId: string, plan: PlanTierName): void {
    this.initializeTenant(tenantId);
    const tier = InstitutionalOfferingRegistry.getTier(plan);
    if (!tier) {
      throw new Error(`[QUOTA-GOV-001]: Plan ${plan} not found in Commercial Tier Registry.`);
    }

    const usage = this.tenantUsage[tenantId];
    if (usage.currentAdvisoryCount >= tier.advisoryGenerationQuotaLimit) {
      RuntimeQuotaAuditTrail.logEvent(
        tenantId,
        'QUOTA_VIOLATION',
        `Advisory quota of ${tier.advisoryGenerationQuotaLimit} exceeded`,
        usage.currentBudgetMs,
        tier.executionBudgetLimitMs,
        usage.currentTopologyDepth,
        tier.topologyExecutionLimitDepth,
        usage.currentAdvisoryCount + 1,
        tier.advisoryGenerationQuotaLimit
      );
      throw new Error(
        `[QUOTA-GOV-004]: Advisory quota of ${tier.advisoryGenerationQuotaLimit} exceeded for plan ${plan}.`
      );
    }

    usage.currentAdvisoryCount++;
  }
}
