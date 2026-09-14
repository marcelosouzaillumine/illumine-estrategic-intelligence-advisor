export interface OperationalPlaybook {
  playbookId: string;
  name: string;
  category: 'ONBOARDING' | 'IMPORT' | 'GOVERNANCE' | 'BOARD_PACK' | 'TRAINING';
  steps: string[];
  estimatedTimeHours: number;
}
