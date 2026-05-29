import { SignalSeverity } from './types';

export const SEVERITY_WEIGHTS: Record<SignalSeverity, number> = {
  CRITICAL: 100,
  HIGH: 75,
  MEDIUM: 50,
  LOW: 25
};
