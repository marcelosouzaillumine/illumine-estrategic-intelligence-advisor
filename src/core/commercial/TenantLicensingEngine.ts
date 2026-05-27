import { CommercialPlanEngine, CommercialPlanId, PlanQuotas } from './CommercialPlanEngine';
import { AuditEventBus } from '../security/audit/AuditEventBus';

export class LicensingViolationError extends Error {
  constructor(public readonly decisionCode: string, message: string) {
    super(message);
    this.name = 'LicensingViolationError';
  }
}

export class TenantLicensingEngine {
  private static localConsumptions: Record<string, Record<string, number>> = {};

  public static clearConsumptions() {
    this.localConsumptions = {};
  }

  /**
   * Validates if the tenant's billing status allows access.
   */
  public static validateLicense(tenantId: string, billingStatus: 'ACTIVE' | 'SUSPENDED' | 'CANCELLED'): void {
    if (billingStatus === 'SUSPENDED') {
      AuditEventBus.emit({
        tenantId,
        actorId: 'SYSTEM',
        role: 'SYSTEM',
        sessionId: 'SYSTEM_LICENSING',
        eventType: 'DENY_TENANT_SUSPENDED',
        resourceType: 'License',
        auditSeverity: 'CRITICAL',
        requestSource: 'TenantLicensingEngine',
        metadata: { billingStatus }
      });
      throw new LicensingViolationError('DENY_TENANT_SUSPENDED', `Tenant ${tenantId} is suspended due to billing issues.`);
    }

    if (billingStatus === 'CANCELLED') {
      AuditEventBus.emit({
        tenantId,
        actorId: 'SYSTEM',
        role: 'SYSTEM',
        sessionId: 'SYSTEM_LICENSING',
        eventType: 'DENY_TENANT_CANCELLED',
        resourceType: 'License',
        auditSeverity: 'CRITICAL',
        requestSource: 'TenantLicensingEngine',
        metadata: { billingStatus }
      });
      throw new LicensingViolationError('DENY_TENANT_CANCELLED', `Tenant ${tenantId} license has been cancelled.`);
    }
  }

  /**
   * Verifies if a plan feature is allowed.
   */
  public static isFeatureAllowed(planId: CommercialPlanId, feature: keyof PlanQuotas, tenantId: string = 'GLOBAL'): boolean {
    const allowed = CommercialPlanEngine.isFeatureAllowed(planId, feature);
    if (!allowed) {
      AuditEventBus.emit({
        tenantId,
        actorId: 'SYSTEM',
        role: 'SYSTEM',
        sessionId: 'SYSTEM_LICENSING',
        eventType: 'DENY_FEATURE_UNAVAILABLE',
        resourceType: 'FeatureFlag',
        auditSeverity: 'WARNING',
        requestSource: 'TenantLicensingEngine',
        metadata: { planId, feature }
      });
    }
    return allowed;
  }

  /**
   * Checks if a tenant usage quota has been exceeded.
   */
  public static checkQuota(
    tenantId: string,
    planId: CommercialPlanId,
    quotaType: keyof PlanQuotas,
    currentUsage: number
  ): void {
    const resolvedPlan = CommercialPlanEngine.resolvePlanId(planId);
    const quotas = CommercialPlanEngine.getQuotas(resolvedPlan);
    const maxVal = quotas[quotaType];

    if (typeof maxVal === 'number' && currentUsage >= maxVal) {
      AuditEventBus.emit({
        tenantId,
        actorId: 'SYSTEM',
        role: 'SYSTEM',
        sessionId: 'SYSTEM_LICENSING',
        eventType: 'DENY_QUOTA_EXCEEDED',
        resourceType: 'Quota',
        auditSeverity: 'CRITICAL',
        requestSource: 'TenantLicensingEngine',
        metadata: { quotaType, currentUsage, maxAllowed: maxVal }
      });
      throw new LicensingViolationError('DENY_QUOTA_EXCEEDED', `Quota limit exceeded for ${quotaType} (${currentUsage}/${maxVal}) on plan ${planId}.`);
    }
  }

  /**
   * Consumes a specific quota for a tenant in memory/local database context.
   */
  public static consumeQuota(tenantId: string, planId: CommercialPlanId, quotaType: keyof PlanQuotas, amount: number = 1): void {
    if (!this.localConsumptions[tenantId]) {
      this.localConsumptions[tenantId] = {};
    }
    const current = this.localConsumptions[tenantId][quotaType as string] || 0;
    this.checkQuota(tenantId, planId, quotaType, current + amount - 1);
    this.localConsumptions[tenantId][quotaType as string] = current + amount;
  }

  /**
   * Restores a specific quota (e.g. on cancellation/rollback).
   */
  public static restoreQuota(tenantId: string, quotaType: keyof PlanQuotas, amount: number = 1): void {
    if (this.localConsumptions[tenantId] && this.localConsumptions[tenantId][quotaType as string]) {
      const current = this.localConsumptions[tenantId][quotaType as string];
      this.localConsumptions[tenantId][quotaType as string] = Math.max(0, current - amount);
    }
  }

  /**
   * Validates plan compatibility wrapping.
   */
  public static validatePlanCompatibility(legacyPlanId: string): CommercialPlanId {
    return CommercialPlanEngine.resolvePlanId(legacyPlanId);
  }
}
