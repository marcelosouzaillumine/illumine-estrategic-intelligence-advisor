export class BalanceSheetOutputAuthorityGuard {
  /**
   * Blocks legacy objects, old advisory outputs, hardcoded texts, or parallel narratives.
   */
  public static verifyAuthority(
    sourceName: string,
    isGovernanceOutput: boolean
  ): { severity: 'OK' | 'BLOCKING'; findings: string[] } {
    if (!isGovernanceOutput) {
      return {
        severity: 'BLOCKING',
        findings: [`[UNAUTHORIZED_BP_OUTPUT_SOURCE] Output source "${sourceName}" is not the official BalanceSheetGovernanceOutput.`]
      };
    }
    return { severity: 'OK', findings: [] };
  }
}
