export interface ExecutivePresenceContract {
  readonly presenceId: string;
  readonly daysSinceLastAccess: number;
  readonly isMonthEnd: boolean;
  readonly isFiscalPeriodClose: boolean;
  readonly isFirstMondayOfMonth: boolean;
  readonly accumulatedEventsCountCount: number;
  readonly adaptiveContextGreeting: string;
}
