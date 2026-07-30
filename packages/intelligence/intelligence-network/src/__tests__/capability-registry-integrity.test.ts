/// <reference types="vitest" />
import { describe, it, expect } from 'vitest';
import { IntelligenceCapabilityRegistry } from '../index';

describe('Quality Gate 1 — Capability Registry Integrity Test', () => {
  it('should enforce that all registered capabilities contain version, owner, confidence, and health metrics', () => {
    const capabilities = IntelligenceCapabilityRegistry.getRegisteredCapabilities();
    expect(capabilities.length).toBeGreaterThan(0);

    for (const cap of capabilities) {
      expect(cap.capabilityId).toBeDefined();
      expect(cap.name).toBeDefined();
      expect(cap.version).toBeDefined();
      expect(cap.owner).toBeDefined();
      expect(cap.supportedDomains.length).toBeGreaterThan(0);
      expect(cap.isHealthy).toBe(true);
    }
  });
});
