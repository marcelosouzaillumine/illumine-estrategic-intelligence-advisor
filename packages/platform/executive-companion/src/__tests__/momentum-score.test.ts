/// <reference types="vitest" />
import { describe, it, expect } from 'vitest';
import { OrganizationalMomentumEngine } from '../index';

describe('Quality Gate 3 — Momentum Score Test', () => {
  it('should calculate organizational momentum score and velocity', () => {
    const momentum = OrganizationalMomentumEngine.calculateMomentum('empresa-demo');

    expect(momentum.momentumScore).toBe(92.5);
    expect(momentum.executionVelocityScore).toBe(95.0);
    expect(momentum.momentumCategory).toBe('EXCEPTIONAL');
  });
});
