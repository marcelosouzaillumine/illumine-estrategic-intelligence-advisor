export type CoreEventType = 
  | 'MetadataUpdated'
  | 'RuntimeCompiled'
  | 'CertificationGenerated'
  | 'ArchitectureViolationDetected'
  | 'WorkflowExecuted';

export interface CoreEvent<T = any> {
  type: CoreEventType;
  payload: T;
  timestamp: string;
  source: string;
}

export type EventHandler<T = any> = (event: CoreEvent<T>) => void | Promise<void>;

export class EventBus {
  private handlers = new Map<CoreEventType, Set<EventHandler>>();

  public subscribe<T = any>(type: CoreEventType, handler: EventHandler<T>): () => void {
    if (!this.handlers.has(type)) {
      this.handlers.set(type, new Set());
    }
    const handlerSet = this.handlers.get(type)!;
    handlerSet.add(handler);

    return () => {
      handlerSet.delete(handler);
    };
  }

  public async publish<T = any>(event: CoreEvent<T>): Promise<void> {
    const handlerSet = this.handlers.get(event.type);
    if (handlerSet) {
      for (const handler of Array.from(handlerSet)) {
        await handler(event);
      }
    }
  }
}

export const eventBus = new EventBus();
