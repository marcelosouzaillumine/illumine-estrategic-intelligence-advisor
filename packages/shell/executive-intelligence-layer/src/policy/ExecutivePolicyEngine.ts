import { ExecutiveFinancialState } from '../contracts/ExecutiveFinancialState';
import { ExecutivePolicy, ExecutivePolicyRules } from './ExecutivePolicyRules';

export class ExecutivePolicyEngine {
  /**
   * Avalia o estado e aplica as políticas estabelecidas pelas regras fiduciárias institucionais.
   */
  public static evaluate(state: ExecutiveFinancialState): ExecutivePolicy {
    // Pode incluir telemetria, logs de auditoria de política, etc.
    return ExecutivePolicyRules.getPolicyForState(state);
  }
}
