import { ConsolidationAdjustment, EliminatedValueRecord, UnreconciledIntercompany, EliminationWarning } from './consolidated-types';

export class ConsolidatedAdjustmentRegistry {
  private adjustments: ConsolidationAdjustment[] = [];
  private eliminatedEntries: EliminatedValueRecord[] = [];
  private unreconciled: UnreconciledIntercompany[] = [];
  private warnings: EliminationWarning[] = [];

  public recordElimination(entry: EliminatedValueRecord): void {
    this.eliminatedEntries.push(entry);
  }

  public recordAdjustment(adjustment: ConsolidationAdjustment): void {
    this.adjustments.push(adjustment);
  }

  public recordUnreconciled(unreconciled: UnreconciledIntercompany): void {
    this.unreconciled.push(unreconciled);
  }

  public recordWarning(warning: EliminationWarning): void {
    this.warnings.push(warning);
  }

  public getEliminatedEntries(): EliminatedValueRecord[] {
    return [...this.eliminatedEntries];
  }

  public getAdjustments(): ConsolidationAdjustment[] {
    return [...this.adjustments];
  }

  public getUnreconciled(): UnreconciledIntercompany[] {
    return [...this.unreconciled];
  }

  public getWarnings(): EliminationWarning[] {
    return [...this.warnings];
  }

  public clear(): void {
    this.adjustments = [];
    this.eliminatedEntries = [];
    this.unreconciled = [];
    this.warnings = [];
  }
}
