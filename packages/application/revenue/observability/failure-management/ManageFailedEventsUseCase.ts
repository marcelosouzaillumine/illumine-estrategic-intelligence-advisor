import { RevenueFailedEvent } from './RevenueFailedEvent';
import { RetryPolicies } from './RetryPolicy';

export interface FailedEventRepository {
  save(event: RevenueFailedEvent): Promise<void>;
  getPendingEvents(): Promise<RevenueFailedEvent[]>;
}

export interface EventReplayerPort {
  replay(event: RevenueFailedEvent): Promise<boolean>; // true se sucesso
}

export class ManageFailedEventsUseCase {
  constructor(
    private readonly repository: FailedEventRepository,
    private readonly replayer: EventReplayerPort
  ) {}

  /**
   * Processes the DLQ (Dead Letter Queue)
   */
  public async execute(): Promise<void> {
    const pending = await this.repository.getPendingEvents();

    for (const failedEvent of pending) {
      const policy = RetryPolicies[failedEvent.category];

      if (!policy.isRetriable || failedEvent.retryCount >= policy.maxRetries) {
        failedEvent.resolutionStatus = 'MANUAL_INTERVENTION_REQUIRED';
        await this.repository.save(failedEvent);
        continue;
      }

      // Replay attempt
      failedEvent.retryCount += 1;
      failedEvent.lastAttemptAt = new Date().toISOString();
      
      const success = await this.replayer.replay(failedEvent);
      
      if (success) {
        failedEvent.resolutionStatus = 'RETRIED_SUCCESSFULLY';
      }
      
      await this.repository.save(failedEvent);
    }
  }
}
