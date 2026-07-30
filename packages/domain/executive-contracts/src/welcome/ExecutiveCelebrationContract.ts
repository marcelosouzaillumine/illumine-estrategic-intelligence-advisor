export type ExecutiveCelebrationType =
  | 'FIRST_ACCESS'
  | 'DAYS_30'
  | 'DAYS_90'
  | 'YEAR_1'
  | 'DECISIONS_100'
  | 'FIRST_CLIENT'
  | 'FIRST_ROI_REGISTERED'
  | 'FIRST_EXPANSION'
  | 'FIRST_CASE'
  | 'GOALS_ACHIEVED';

export interface ExecutiveCelebrationContract {
  readonly celebrationId: string;
  readonly celebrationType: ExecutiveCelebrationType;
  readonly titleText: string;
  readonly messageText: string;
  readonly isCelebrated: boolean;
}
