import { AuditEventBus } from '../security/audit/AuditEventBus';
import { AnomalyDetector } from '../security/audit/AnomalyDetector';

export class BrandingValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'BrandingValidationError';
  }
}

export interface BrandingConfig {
  logoUrl?: string;
  colors?: {
    primary?: string;
    secondary?: string;
    background?: string;
    criticalAlertColor?: string; // Fiduciary critical alert color
  };
  hideWarnings?: boolean;
  disableLineage?: boolean;
  disableFiduciaryStamps?: boolean;
  overrideConfidenceState?: boolean;
  overrideSeverity?: boolean;
  downgradeVisualCriticality?: boolean;
  hideVisualAuditTrail?: boolean;
}

export class WhiteLabelGovernance {
  private static tenantViolationCounts: Record<string, number> = {};

  public static clearViolations() {
    this.tenantViolationCounts = {};
  }

  /**
   * Validates tenant custom branding config against strict security standards.
   */
  public static validateBranding(tenantId: string, config: BrandingConfig): void {
    const violations: string[] = [];

    if (config.hideWarnings) {
      violations.push('hideWarnings is strictly prohibited');
    }
    if (config.disableLineage) {
      violations.push('disableLineage is strictly prohibited');
    }
    if (config.disableFiduciaryStamps) {
      violations.push('disableFiduciaryStamps is strictly prohibited');
    }
    if (config.overrideConfidenceState) {
      violations.push('overrideConfidenceState is strictly prohibited');
    }
    if (config.overrideSeverity) {
      violations.push('overrideSeverity is strictly prohibited');
    }
    if (config.downgradeVisualCriticality) {
      violations.push('downgradeVisualCriticality is strictly prohibited');
    }
    if (config.hideVisualAuditTrail) {
      violations.push('hideVisualAuditTrail is strictly prohibited');
    }

    // Check if custom primary critical alert color is modified to look like healthy
    if (config.colors?.criticalAlertColor) {
      const lowerColor = config.colors.criticalAlertColor.toLowerCase();
      // If critical alerts are set to green hues, block it
      if (lowerColor.includes('green') || lowerColor === '#00ff00' || lowerColor === '#10b981' || lowerColor === 'rgb(16,185,129)') {
        violations.push('fiduciary critical alert color cannot be mapped to green (active danger mitigation dilution)');
      }
    }

    if (violations.length > 0) {
      const msg = `[White-Label Governance] BRANDING_VIOLATION: ${violations.join(', ')}`;
      
      // Increment violation count
      const count = (this.tenantViolationCounts[tenantId] || 0) + 1;
      this.tenantViolationCounts[tenantId] = count;

      // Emit audit event
      AuditEventBus.emit({
        tenantId,
        actorId: 'SYSTEM',
        role: 'SYSTEM',
        sessionId: 'SYSTEM_BRANDING',
        eventType: 'DENY_BRANDING_VIOLATION',
        resourceType: 'Branding',
        auditSeverity: 'CRITICAL',
        requestSource: 'WhiteLabelGovernance',
        metadata: { violations, violationCount: count }
      });

      // If recurrent (3 or more attempts), register anomaly
      if (count >= 3) {
        AnomalyDetector.saveAnomaly({
          anomalyType: 'BRANDING_EXPLOIT_ATTEMPT',
          severity: 'CRITICAL',
          tenantId,
          actorId: 'SYSTEM',
          sessionId: 'SYSTEM_BRANDING',
          detectedAt: new Date().toISOString(),
          recommendedAction: 'Suspend custom branding privileges and check tenant configuration.',
          details: { violations, totalAttempts: count }
        });
      }

      throw new BrandingValidationError(msg);
    }
  }

  /**
   * Applies validated branding settings, falling back to default themes if needed.
   */
  public static resolveTheme(tenantId: string, config: BrandingConfig): any {
    this.validateBranding(tenantId, config);

    // If branding passes validation, construct CSS style rules or properties object
    return {
      logoUrl: config.logoUrl || '/assets/default-logo.png',
      colors: {
        primary: config.colors?.primary || '#4f46e5',
        secondary: config.colors?.secondary || '#ff8552',
        background: config.colors?.background || '#ffffff',
        criticalAlertColor: config.colors?.criticalAlertColor || '#ef4444'
      },
      warningsVisible: true,
      lineageStampsVisible: true,
      auditTrailVisible: true
    };
  }

  /**
   * Ensures that severity tags and risk scores cannot be visually altered.
   */
  public static validateSeverityIntegrity(originalSeverity: string, displaySeverity: string): boolean {
    if (originalSeverity !== displaySeverity) {
      throw new BrandingValidationError('[White-Label Governance] SEVERITY_TAMPERING: Visual severity cannot be modified.');
    }
    return true;
  }

  /**
   * Ensures visibility of crucial indicators and warnings is fully preserved.
   */
  public static validateGovernanceVisibility(visibilityState: any): void {
    if (visibilityState && (visibilityState.warningsHidden || visibilityState.stampsHidden)) {
      throw new BrandingValidationError('[White-Label Governance] VISIBILITY_TAMPERING: Warnings or stamps cannot be hidden.');
    }
  }
}
