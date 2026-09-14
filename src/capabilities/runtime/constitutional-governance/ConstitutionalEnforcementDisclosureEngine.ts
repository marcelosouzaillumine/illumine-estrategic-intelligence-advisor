import { ConstitutionalEnforcementAction } from './constitutional-dashboard-types';

export class ConstitutionalEnforcementDisclosureEngine {
  public static extractEnforcementActions(runtimeOutput: any): ConstitutionalEnforcementAction[] {
    const actions: ConstitutionalEnforcementAction[] = [];

    if (runtimeOutput?.canonicalState?.isLineageIncomplete) {
      actions.push({
        actionId: 'ENF-LINEAGE-01',
        trigger: 'Lineage Broken',
        description: 'Inconsistência na cadeia de evidências fiduciárias. Fail-closed ativado localmente.',
        timestamp: new Date().toISOString(),
        severity: 'INTERVENTION'
      });
    }

    if (runtimeOutput?.status === 'CONSTITUTIONAL_QUARANTINE') {
      actions.push({
        actionId: 'ENF-QUARANTINE-01',
        trigger: 'Constitutional Violation',
        description: 'Quarentena constitucional ativada pelo Guard. Acesso suspenso.',
        timestamp: new Date().toISOString(),
        severity: 'QUARANTINE'
      });
    }

    if (runtimeOutput?.canonicalState?.warnings?.length > 0) {
      runtimeOutput.canonicalState.warnings.forEach((w: string, i: number) => {
        actions.push({
          actionId: `ENF-WARN-${i}`,
          trigger: 'Fiduciary Warning',
          description: w,
          timestamp: new Date().toISOString(),
          severity: 'WARNING'
        });
      });
    }

    return actions;
  }
}
