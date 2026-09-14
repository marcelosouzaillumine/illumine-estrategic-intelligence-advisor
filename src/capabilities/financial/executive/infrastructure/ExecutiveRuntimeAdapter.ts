import { evaluateExecutiveDecision, ExecutiveDecisionOutput } from '../../../../workspace/runtime/executive/ExecutiveDecisionEngine';
import { ExecutiveSessionContext } from '../../../../workspace/runtime/executive/board/ExecutiveSessionContext';

export const ExecutiveRuntimeAdapter = {
  evaluateExecutiveDecision,
  ExecutiveSessionContext
};

export { ExecutiveSessionContext };
export type { ExecutiveDecisionOutput };
