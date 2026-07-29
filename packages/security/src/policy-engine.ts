export interface SecurityPolicyRule {
  resource: string;
  action: string;
  role: string;
  condition: {
    tenant: 'same' | 'any';
  };
}

export class PolicyEngine {
  private policies: SecurityPolicyRule[] = [
    {
      resource: 'financial.dashboard',
      action: 'read',
      role: 'CFO',
      condition: { tenant: 'same' }
    },
    {
      resource: 'financial.dashboard',
      action: 'read',
      role: 'BOARD_MEMBER',
      condition: { tenant: 'same' }
    }
  ];

  public evaluate(userRoles: string[], resource: string, action: string): boolean {
    return this.policies.some(
      (p) => p.resource === resource && p.action === action && userRoles.includes(p.role)
    );
  }
}

export const policyEngine = new PolicyEngine();
