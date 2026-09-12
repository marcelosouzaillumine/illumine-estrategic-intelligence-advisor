export type ProductPlanId = 'STARTER' | 'PROFESSIONAL' | 'ENTERPRISE' | 'ADVISOR_NETWORK' | 'FAMILY_OFFICE' | 'WHITE_LABEL';

export type FeatureId = 
  | 'INSTITUTIONAL_BENCHMARKING' 
  | 'AI_COPILOT_BASIC' 
  | 'AI_COPILOT_ENTERPRISE' 
  | 'SCENARIO_RUNTIME' 
  | 'BOARD_PACK_EXPORT' 
  | 'CONTINUOUS_MONITORING'
  | 'MULTI_TENANT_DASHBOARD';

export type QuotaId = 
  | 'MAX_SCENARIOS' 
  | 'MAX_UPLOADS' 
  | 'MAX_BOARD_PACKS' 
  | 'MAX_MONITORING_CYCLES' 
  | 'MAX_WORKSPACES';

export interface FeatureEntitlement {
  featureId: FeatureId;
  isEnabled: boolean;
  blockedReason?: string;
}

export interface UsageQuota {
  quotaId: QuotaId;
  limit: number;
  consumed: number;
  resetInterval: 'MONTHLY' | 'YEARLY' | 'NEVER';
}

export interface ProductPlan {
  planId: ProductPlanId;
  name: string;
  description: string;
  entitlements: Record<FeatureId, boolean>;
  quotas: Record<QuotaId, number>; // Limit numbers
}

export interface TenantSubscription {
  tenantId: string;
  planId: ProductPlanId;
  status: 'ACTIVE' | 'TRIAL' | 'PAST_DUE' | 'CANCELED';
  startDate: string;
  endDate?: string;
  quotasState: Record<QuotaId, number>; // Current consumed
  isDemo: boolean;
}

export interface ProductAccessEvent {
  eventId: string;
  tenantId: string;
  eventType: 'FEATURE_GRANTED' | 'FEATURE_BLOCKED' | 'QUOTA_CONSUMED' | 'QUOTA_EXCEEDED' | 'PLAN_CHANGED' | 'TRIAL_STARTED' | 'TRIAL_EXPIRED' | 'DEMO_RESET';
  resourceId: string; // FeatureId or QuotaId
  timestamp: string;
  details: string;
}

export interface FeatureFlag {
  flagId: string;
  isEnabled: boolean;
  audience: 'ALL' | 'BETA_ONLY' | 'INTERNAL_ONLY' | 'ENTERPRISE_ONLY';
}
