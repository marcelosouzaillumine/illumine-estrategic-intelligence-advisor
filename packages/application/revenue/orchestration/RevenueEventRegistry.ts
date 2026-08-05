export interface ProcessedEventRecord {
  eventId: string;
  eventType: string;
  processedAt: string;
  result: 'SUCCESS' | 'FAILED';
}

export class RevenueEventRegistry {
  private processedEvents: Map<string, ProcessedEventRecord> = new Map();

  /**
   * Verifica a idempotência: se o evento já foi processado com sucesso, não repete.
   */
  public isProcessed(eventId: string): boolean {
    const record = this.processedEvents.get(eventId);
    return record?.result === 'SUCCESS';
  }

  public markAsProcessed(eventId: string, eventType: string, result: 'SUCCESS' | 'FAILED'): void {
    this.processedEvents.set(eventId, {
      eventId,
      eventType,
      processedAt: new Date().toISOString(),
      result
    });
  }
}
