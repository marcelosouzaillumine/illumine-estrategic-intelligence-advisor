import { LifecycleFallbackReason } from './LifecycleFallbackReasons';

export interface LifecyclePropagationAudit {
  clientFound: boolean;
  foundationYearFound: boolean;
  lifecycleContextBuilt: boolean;
  lifecycleProfileBuilt: boolean;
  runtimeContextContainsLifecycle: boolean;
  adapterReceivedLifecycle: boolean;
  dlpaEngineReceivedLifecycle: boolean;
  uiReceivedLifecycle: boolean;
  semanticSource: string;
  fallbackActivated: boolean;
  fallbackReason?: LifecycleFallbackReason;
}

export class LifecyclePropagationTracker {
  static validate(audit: LifecyclePropagationAudit): void {
    const isFailed = 
      !audit.clientFound || 
      !audit.foundationYearFound || 
      !audit.lifecycleContextBuilt || 
      !audit.lifecycleProfileBuilt || 
      !audit.runtimeContextContainsLifecycle || 
      !audit.adapterReceivedLifecycle || 
      !audit.dlpaEngineReceivedLifecycle || 
      !audit.uiReceivedLifecycle;

    if (isFailed && audit.fallbackActivated) {
      console.warn(`[LIFECYCLE_PROPAGATION_BREAK] CRITICAL: Lifecycle propagation broken. Reason: ${audit.fallbackReason}`);
    }
  }
}
