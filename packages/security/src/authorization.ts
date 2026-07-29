import { policyEngine } from './policy-engine';
import { SemanticExecutionEngine } from '../../see/src/engine/semantic-execution-engine';

export class AuthorizationService {
  public static authorizeUserAction(
    userId: string,
    roles: string[],
    resource: string,
    action: string
  ): boolean {
    // 1. Avalia política estática de segurança
    const policyAllowed = policyEngine.evaluate(roles, resource, action);
    if (!policyAllowed) return false;

    // 2. Transmite compulsoriamente ao Barramento SEE Engine
    const seeResult = SemanticExecutionEngine.execute({
      intent: `${resource}.${action}`,
      actor: { userId, roles },
      context: { resource, action }
    });

    return seeResult.decision === 'ALLOW';
  }
}
