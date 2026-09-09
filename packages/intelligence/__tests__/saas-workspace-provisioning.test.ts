/// <reference types="vitest" />
import { describe, it, expect } from 'vitest';
import { WorkspaceProvisioningService } from '../saas-foundation/src';

describe('@illumine/governance (Wave 19.1 SaaS Workspace Provisioning)', () => {
  it('should provision default executive and partner advisory workspaces', () => {
    const workspaces = WorkspaceProvisioningService.provisionDefaultWorkspaces('tenant-alpha');
    expect(workspaces).toHaveLength(2);
    expect(workspaces.some(w => w.workspaceType === 'EXECUTIVE_DECISION')).toBe(true);
  });
});
