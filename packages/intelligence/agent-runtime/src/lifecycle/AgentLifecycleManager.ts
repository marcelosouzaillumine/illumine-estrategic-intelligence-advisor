export type AgentLifecycleState =
  | 'IDLE'
  | 'OBSERVE'
  | 'ANALYZE'
  | 'REASON'
  | 'RECOMMEND'
  | 'WAIT_HUMAN_APPROVAL'
  | 'LEARN';

export class AgentLifecycleManager {
  private currentState: AgentLifecycleState = 'IDLE';

  public getState(): AgentLifecycleState {
    return this.currentState;
  }

  public transitionTo(newState: AgentLifecycleState): void {
    const validTransitions: Record<AgentLifecycleState, AgentLifecycleState[]> = {
      IDLE: ['OBSERVE'],
      OBSERVE: ['ANALYZE'],
      ANALYZE: ['REASON'],
      REASON: ['RECOMMEND'],
      RECOMMEND: ['WAIT_HUMAN_APPROVAL', 'LEARN'],
      WAIT_HUMAN_APPROVAL: ['LEARN'],
      LEARN: ['IDLE']
    };

    const allowed = validTransitions[this.currentState];
    if (!allowed.includes(newState)) {
      throw new Error(`Transição de estado inválida no AgentLifecycleManager: de ${this.currentState} para ${newState}`);
    }

    this.currentState = newState;
  }
}
