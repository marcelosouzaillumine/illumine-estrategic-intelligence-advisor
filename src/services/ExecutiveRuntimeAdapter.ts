import { evaluateExecutiveDecision, ExecutiveDecisionOutput } from '../core/runtime/executive/ExecutiveDecisionEngine';
import { ExecutiveSessionContext } from '../core/runtime/executive/board/ExecutiveSessionContext';

export const ExecutiveRuntimeAdapter = {
  evaluateExecutiveDecision,
  ExecutiveSessionContext
};

export { ExecutiveSessionContext };
export type { ExecutiveDecisionOutput };
