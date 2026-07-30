/// <reference types="vitest" />
import { describe, it, expect } from 'vitest';
import { ExecutiveGreetingEngine } from '../index';

describe('Quality Gate 9 — Quick Actions & Greeting Regression Test', () => {
  it('should guarantee consistent greeting text formatting', () => {
    const greeting = ExecutiveGreetingEngine.generateGreeting('CFO');

    expect(greeting).toContain('Illumine OS™ apresenta seu Executive Morning Briefing');
  });
});
