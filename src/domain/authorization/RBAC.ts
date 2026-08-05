export type CapabilityCode = string;
export type ActionCode = string;
export type PermissionCode = string;
export type RoleCode = string;
export type PolicyCode = string;

export interface Action {
  code: ActionCode;
  description?: string; // Internal description, not for UI
}

export interface Capability {
  code: CapabilityCode;
  actions: ActionCode[];
}

export interface Permission {
  code: PermissionCode;
  capabilities: CapabilityCode[];
}

export interface AuthorizationContext {
  userId: string;
  tenantId: string;
  roleCode: RoleCode;
  // Extensible for subscription limits, modules, compliance rules, etc.
  subscriptionPlan?: string;
  resourceId?: string;
}

export interface Policy {
  code: PolicyCode;
  evaluate: (context: AuthorizationContext) => boolean;
}

export interface Role {
  code: RoleCode;
  permissions: PermissionCode[];
  policies: PolicyCode[];
}
