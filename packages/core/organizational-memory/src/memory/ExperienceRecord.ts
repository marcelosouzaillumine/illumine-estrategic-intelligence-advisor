import { Identifier } from '@illumine/core-primitives';
import { ReasoningTrace, LearningSignal } from '@illumine/intelligence-kernel';
import { OrganizationalContext } from './OrganizationalContext';
import { OutcomeRecord } from '../learning/OutcomeRecord';

export interface ExperienceRecord {
  readonly id: Identifier;
  readonly decisionId: Identifier;
  readonly context: OrganizationalContext;
  readonly reasoningTrace: ReasoningTrace;
  readonly outcome: OutcomeRecord;
  readonly learningSignal?: LearningSignal;
}
