/// <reference types="vitest" />
import { describe, it, expect } from 'vitest';
import { AdvisorRegistryEngine } from '../partner-ecosystem/src';

describe('@illumine/governance (Wave 18.11 Advisor Registry Engine)', () => {
  it('should register canonical advisor profiles with fiduciary score and success metrics', () => {
    const advisor = AdvisorRegistryEngine.registerAdvisor('Carlos Mendes', 'FINANCIAL');
    expect(advisor.fullName).toBe('Carlos Mendes');
    expect(advisor.primarySpecialty).toBe('FINANCIAL');
    expect(advisor.fiduciaryScore).toBe(98.5);
  });
});
