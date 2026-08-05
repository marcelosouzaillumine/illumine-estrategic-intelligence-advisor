import { DiagnosticQuestion } from '../core/diagnostic-contracts';

export const SAMPLE_QUESTIONS: DiagnosticQuestion[] = [
  {
    id: 'q_sample_1',
    dimensionId: 'dim_sample_test',
    type: 'single_choice',
    text: 'Is this sample domain working?',
    options: [
      { id: 'opt_1', text: 'Yes', weight: 100 },
      { id: 'opt_2', text: 'No', weight: 0 }
    ]
  }
];
