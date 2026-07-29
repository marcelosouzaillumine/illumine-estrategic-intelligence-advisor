import { describe, it, expect } from 'vitest';
import { ImpactChainAnalyzer } from '../index';

describe('@illumine/cross-domain-intelligence (Wave 14 Phase 3)', () => {
  it('should build cross domain impact chain from Turnover -> Produtividade -> OPEX -> EBITDA', () => {
    const chain = ImpactChainAnalyzer.buildCrossDomainChain('TURNOVER');
    expect(chain.rootDomain).toBe('PEOPLE');
    expect(chain.steps.length).toBe(4);
    expect(chain.steps[0].domain).toBe('PEOPLE');
    expect(chain.steps[3].domain).toBe('FINANCE');
    expect(chain.steps[3].metricCode).toBe('EBITDA');
  });
});
