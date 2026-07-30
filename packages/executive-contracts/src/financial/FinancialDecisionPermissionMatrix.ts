/**
 * Illumine OS™ Executive Contracts
 * Financial Decision Permission Matrix (CFDI v2.1)
 */

export type AllowedDecisionLevel =
  | 'EXECUTIVE_DECISION'
  | 'EXECUTIVE_ANALYSIS'
  | 'DIAGNOSTIC_ONLY'
  | 'BLOCKED';

export interface FinancialDecisionPermissionMatrix {
  readonly certificationStatus: 'CERTIFIED' | 'WARNING' | 'FAILED';
  readonly healthIndexValue: number;
  readonly allowedDecisionLevel: AllowedDecisionLevel;
  readonly runtimePermission: 'ALLOW' | 'RESTRICT' | 'BLOCK';
}

export class FinancialDecisionPermissionMatrixResolver {
  public static resolve(
    certificationStatus: 'CERTIFIED' | 'WARNING' | 'FAILED',
    healthIndexValue: number
  ): FinancialDecisionPermissionMatrix {
    if (certificationStatus === 'FAILED' || healthIndexValue < 50) {
      return {
        certificationStatus,
        healthIndexValue,
        allowedDecisionLevel: 'BLOCKED',
        runtimePermission: 'BLOCK'
      };
    }

    if (certificationStatus === 'WARNING' || healthIndexValue < 70) {
      return {
        certificationStatus,
        healthIndexValue,
        allowedDecisionLevel: 'DIAGNOSTIC_ONLY',
        runtimePermission: 'RESTRICT'
      };
    }

    if (healthIndexValue >= 85) {
      return {
        certificationStatus,
        healthIndexValue,
        allowedDecisionLevel: 'EXECUTIVE_DECISION',
        runtimePermission: 'ALLOW'
      };
    }

    return {
      certificationStatus,
      healthIndexValue,
      allowedDecisionLevel: 'EXECUTIVE_ANALYSIS',
      runtimePermission: 'ALLOW'
    };
  }
}
