export interface LifecycleRenderAuditProps {
  governanceStatus?: string;
  resolvedGovernanceStatus?: string;
  capitalStatus?: string;
  resolvedCapitalStatus?: string;
  semanticSource?: string;
  resolvedSemanticSource?: string;
}

export class LifecycleRenderAudit {
  static validate(rendered: LifecycleRenderAuditProps): void {
    if (rendered.resolvedGovernanceStatus && rendered.governanceStatus && rendered.resolvedGovernanceStatus !== rendered.governanceStatus) {
      console.error(`[UI_RENDERING_LEGACY_FIELD] CRITICAL: UI is rendering legacy governance status: ${rendered.governanceStatus} instead of ELSA resolved: ${rendered.resolvedGovernanceStatus}`);
    }
    
    if (rendered.resolvedCapitalStatus && rendered.capitalStatus && rendered.resolvedCapitalStatus !== rendered.capitalStatus) {
      console.error(`[UI_RENDERING_LEGACY_FIELD] CRITICAL: UI is rendering legacy capital status: ${rendered.capitalStatus} instead of ELSA resolved: ${rendered.resolvedCapitalStatus}`);
    }

    if (rendered.resolvedSemanticSource && rendered.semanticSource && rendered.resolvedSemanticSource !== rendered.semanticSource) {
      console.error(`[UI_RENDERING_LEGACY_FIELD] CRITICAL: UI is rendering legacy semantic source: ${rendered.semanticSource} instead of ELSA resolved: ${rendered.resolvedSemanticSource}`);
    }
  }
}
