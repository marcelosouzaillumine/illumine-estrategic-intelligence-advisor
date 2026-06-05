export interface PresentationDriver {
  label: string;
  amount: number;
  contributionPercent: number;
  category: string;
  severity: string;
  type: 'GENERATOR' | 'DESTROYER';
}

export interface AuditResult {
  status: 'VALID' | 'PARTIAL_DRIVER_DATA';
  validDrivers: PresentationDriver[];
  invalidCount: number;
}

const isValidNumber = (value: unknown): value is number =>
  typeof value === 'number' && Number.isFinite(value);

const isStrValid = (val: unknown): val is string => 
  typeof val === 'string' && val.trim().length > 0;

export class DFCCausalDriverPresentationAudit {
  public static audit(rawDrivers: any[]): AuditResult {
    const validDrivers: PresentationDriver[] = [];
    let invalidCount = 0;

    if (!Array.isArray(rawDrivers)) {
      return { status: 'PARTIAL_DRIVER_DATA', validDrivers: [], invalidCount: 0 };
    }

    for (const d of rawDrivers) {
      // Handle both engine fields (name, value, impactPercent) and user custom/props fields
      const label = d.label ?? d.name;
      const amount = d.amount !== undefined ? d.amount : d.value;
      const contributionPercent = d.contributionPercent !== undefined ? d.contributionPercent : d.impactPercent;
      const category = d.category;
      const severity = d.severity;
      const type = d.type;

      if (
        isValidNumber(amount) &&
        isValidNumber(contributionPercent) &&
        isStrValid(label) &&
        isStrValid(severity) &&
        isStrValid(category)
      ) {
        validDrivers.push({
          label,
          amount,
          contributionPercent,
          category,
          severity,
          type
        });
      } else {
        invalidCount++;
      }
    }

    const status = invalidCount > 0 || rawDrivers.length === 0 ? 'PARTIAL_DRIVER_DATA' : 'VALID';

    return {
      status,
      validDrivers,
      invalidCount
    };
  }
}
