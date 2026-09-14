/// <reference types="vitest" />
import { describe, it, expect } from 'vitest';
import { SubscriptionLifecycleEngine } from '../saas-foundation/src';

describe('@illumine/governance (Wave 19.1 SaaS Subscription Lifecycle Engine)', () => {
  it('should manage subscription lifecycle and status transitions', () => {
    const sub = SubscriptionLifecycleEngine.createSubscription('org-alpha', 'ENTERPRISE_PARTNER');
    expect(sub.status).toBe('ACTIVE');

    const suspended = SubscriptionLifecycleEngine.transitionStatus(sub, 'SUSPENDED');
    expect(suspended.status).toBe('SUSPENDED');
  });
});
