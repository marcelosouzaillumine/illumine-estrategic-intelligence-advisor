/// <reference types="vitest" />
import { describe, it, expect } from 'vitest';
import { ExecutivePresenceEngine } from '../index';

describe('Quality Gate 6 — Presence Detection Test', () => {
  it('should detect returning status without punitive language', () => {
    const presence = ExecutivePresenceEngine.detectPresencePattern(12);

    expect(presence.status).toBe('RETURNING');
    expect(presence.message).toContain('Bem-vindo de volta');
  });
});
