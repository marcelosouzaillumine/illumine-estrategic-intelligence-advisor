export interface ExecutiveRitualContract {
  readonly ritualId: string;
  readonly ritualName: string; // Executive Daily Briefing™ ou Advisor Daily Ritual™
  readonly ritualSequence: readonly string[];
  readonly estimatedStabilizationTimeFormatted: string; // e.g. "2h40"
  readonly revenuePreservedFormatted: string; // e.g. "R$ 12,4 milhões"
}
