import { ExecutiveMemoryArtifact } from './contracts/ExecutiveMemoryArtifact';

export interface MemoryTriggerEvent {
  eventType: 'FINANCIAL_UPDATE' | 'TEMPORAL_REVIEW' | 'STRATEGIC_SHIFT';
  topic: string;
  payload: any;
}

export class ExecutiveMemoryTriggerEngine {
  public evaluateTriggers(memories: ExecutiveMemoryArtifact[], event: MemoryTriggerEvent): ExecutiveMemoryArtifact[] {
    const triggeredMemories: ExecutiveMemoryArtifact[] = [];

    for (const memory of memories) {
      if (memory.lifecycle.status !== 'ACTIVE') continue;

      if (event.eventType === 'FINANCIAL_UPDATE' && memory.content.toLowerCase().includes(event.topic.toLowerCase())) {
        triggeredMemories.push(memory);
      }

      if (event.eventType === 'TEMPORAL_REVIEW' && memory.lifecycle.reviewDate) {
        const reviewDate = new Date(memory.lifecycle.reviewDate).getTime();
        const now = Date.now();
        if (now >= reviewDate) {
          triggeredMemories.push(memory);
        }
      }
    }

    return triggeredMemories;
  }
}
