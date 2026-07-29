export interface ComplianceStatus {
  soc2Readiness: boolean;
  iso27001Readiness: boolean;
  lgpdCompliant: boolean;
}

export class ComplianceRegistry {
  public static getStatus(): ComplianceStatus {
    return {
      soc2Readiness: true,
      iso27001Readiness: true,
      lgpdCompliant: true
    };
  }
}
