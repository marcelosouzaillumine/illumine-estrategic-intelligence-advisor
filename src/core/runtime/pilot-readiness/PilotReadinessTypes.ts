export interface PilotEnvironment {
  pilotId: string;
  tenantId: string;
  sandboxName: string;
  status: 'PROVISIONING' | 'READY' | 'ACTIVE' | 'ARCHIVED';
  readinessScore: number;
}

export interface PilotGovernanceCheck {
  checkId: string;
  name: string;
  passed: boolean;
  required: boolean;
}
