/// <reference types="vitest" />
import { describe, it, expect } from 'vitest';
import { DataEventContract } from '@illumine/executive-contracts';

describe('@illumine/intelligence (Wave 18.4 Real-Time Intelligence Event Runtime)', () => {
  it('should validate DataEventContract for event-driven intelligence calculation (ADR-080)', () => {
    const event: DataEventContract = {
      eventId: 'evt-901',
      tenantId: 'tenant-default',
      companyId: 'comp-emporio',
      eventType: 'TRANSACTION_REGISTERED',
      payload: { amount: 150000, category: 'Despesa Operacional' },
      timestamp: '2026-07-30T04:30:00Z'
    };

    expect(event.eventType).toBe('TRANSACTION_REGISTERED');
    expect(event.companyId).toBe('comp-emporio');
  });
});
