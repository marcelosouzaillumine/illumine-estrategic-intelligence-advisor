/// <reference types="vitest" />
import { describe, it, expect } from 'vitest';
import { ExecutiveMeetingCenterEngine } from '../partner-ecosystem/src';

describe('@illumine/governance (Wave 18.11 Executive Meeting Center Engine)', () => {
  it('should schedule executive meetings and register minutes connected to knowledge graph', () => {
    const meeting = ExecutiveMeetingCenterEngine.scheduleMeeting('company-granatum', 'Reunião Mensal de Conselho', ['adv-01', 'adv-02']);
    expect(meeting.title).toBe('Reunião Mensal de Conselho');
    expect(meeting.decisionsMade).toHaveLength(2);
  });
});
