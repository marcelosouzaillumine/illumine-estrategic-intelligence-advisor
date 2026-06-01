import { CalibrationParameters, CalibrationProfileVersion, CalibrationParameterDiff, NON_SUPPRESSIBLE_WARNINGS } from './CalibrationTypes';
import { CALIBRATION_PROFILES, BALANCED_PROFILE } from './CalibrationProfiles';

export class CalibrationEngine {
  private static currentParameters: CalibrationParameters = { ...BALANCED_PROFILE };
  private static activeProfileId: string = 'balanced';
  private static versionCounter: number = 0;
  private static currentVersion: string = 'v1.0.0';
  private static auditTrail: CalibrationProfileVersion[] = [];

  /**
   * Retrieves the currently active calibration parameters.
   */
  static getCalibration(): CalibrationParameters {
    return this.currentParameters;
  }

  /**
   * Retrieves the currently active profile identifier.
   */
  static getActiveProfileId(): string {
    return this.activeProfileId;
  }

  /**
   * Retrieves the active version string.
   */
  static getVersion(): string {
    return this.currentVersion;
  }

  /**
   * Applies a pre-defined calibration profile.
   * Generates a versioned audit trail log.
   */
  static applyProfile(profileId: string, actorId: string, rationale: string): CalibrationProfileVersion {
    const targetProfile = CALIBRATION_PROFILES[profileId];
    if (!targetProfile) {
      throw new Error(`[Calibration Engine] Perfil "${profileId}" desconhecido.`);
    }

    if (!actorId || actorId.trim() === '') {
      throw new Error('[Calibration Engine] Operação rejeitada: actorId é obrigatório para calibração.');
    }
    if (!rationale || rationale.trim().length < 10) {
      throw new Error('[Calibration Engine] Operação rejeitada: justificativa fiduciária detalhada (mínimo 10 caracteres) é obrigatória.');
    }

    const diffs: CalibrationParameterDiff[] = [];
    const keys = Object.keys(targetProfile) as (keyof CalibrationParameters)[];

    for (const key of keys) {
      const beforeVal = this.currentParameters[key];
      const afterVal = targetProfile[key];

      if (JSON.stringify(beforeVal) !== JSON.stringify(afterVal)) {
        diffs.push({
          parameter: key,
          before: beforeVal,
          after: afterVal
        });
      }
    }

    const previousVersion = this.currentVersion;
    this.versionCounter++;
    this.currentVersion = `v1.0.${this.versionCounter}`;
    this.activeProfileId = profileId;
    this.currentParameters = { ...targetProfile };

    const auditEntry: CalibrationProfileVersion = {
      profileId,
      version: this.currentVersion,
      createdAt: new Date().toISOString(),
      actorId,
      rationale,
      diff: diffs,
      previousVersion
    };

    this.auditTrail.push(auditEntry);
    console.log(`[Calibration Engine] Perfil ${profileId} aplicado fiduciariamente por ${actorId}. Versão: ${this.currentVersion}`);
    
    return auditEntry;
  }

  /**
   * Dynamically adjusts a single calibration parameter.
   * Enforces that suppressed warnings cannot contain NON_SUPPRESSIBLE_WARNINGS.
   */
  static updateParameter<K extends keyof CalibrationParameters>(
    parameter: K,
    value: CalibrationParameters[K],
    actorId: string,
    rationale: string
  ): CalibrationProfileVersion {
    if (!actorId || actorId.trim() === '') {
      throw new Error('[Calibration Engine] Operação rejeitada: actorId é obrigatório para calibração.');
    }
    if (!rationale || rationale.trim().length < 10) {
      throw new Error('[Calibration Engine] Operação rejeitada: justificativa fiduciária detalhada (mínimo 10 caracteres) é obrigatória.');
    }

    // Safety checks for suppressed warnings: cannot contain non-suppressible
    if (parameter === 'suppressedWarnings' && Array.isArray(value)) {
      const forbidden = value.filter(w => NON_SUPPRESSIBLE_WARNINGS.includes(w));
      if (forbidden.length > 0) {
        throw new Error(`[Calibration Engine] Tentativa ilegal de suprimir alertas críticos: ${forbidden.join(', ')}.`);
      }
    }

    const beforeVal = this.currentParameters[parameter];
    const diffs: CalibrationParameterDiff[] = [{
      parameter,
      before: beforeVal,
      after: value
    }];

    const previousVersion = this.currentVersion;
    this.versionCounter++;
    this.currentVersion = `v1.0.${this.versionCounter}`;
    this.activeProfileId = 'custom';
    
    // Mutate parameter fiduciarily
    this.currentParameters[parameter] = value;

    const auditEntry: CalibrationProfileVersion = {
      profileId: 'custom',
      version: this.currentVersion,
      createdAt: new Date().toISOString(),
      actorId,
      rationale,
      diff: diffs,
      previousVersion
    };

    this.auditTrail.push(auditEntry);
    console.log(`[Calibration Engine] Parâmetro ${parameter} atualizado fiduciariamente. Versão: ${this.currentVersion}`);

    return auditEntry;
  }

  /**
   * Returns all audit trails.
   */
  static getAuditTrail(): CalibrationProfileVersion[] {
    return this.auditTrail;
  }

  /**
   * Resets active parameters to balanced defaults.
   */
  static resetToDefault(): void {
    this.currentParameters = { ...BALANCED_PROFILE };
    this.activeProfileId = 'balanced';
    this.currentVersion = 'v1.0.0';
    this.versionCounter = 0;
    this.auditTrail = [];
  }
}
