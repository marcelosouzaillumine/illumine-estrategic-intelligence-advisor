import { describe, it, expect, beforeEach } from 'vitest';
import { ExecutiveKnowledgeRegistry } from '../knowledge/registry/ExecutiveKnowledgeRegistry';
import { KnowledgeLoader } from '../knowledge/registry/KnowledgeLoader';
import { KnowledgeVersionManager } from '../knowledge/registry/KnowledgeVersionManager';
import { KnowledgeGovernance } from '../knowledge/governance/KnowledgeGovernance';
import { ExecutiveKnowledge } from '../knowledge/contracts/ExecutiveKnowledge';

describe('FinancialKnowledgePack Flow', () => {
  let registry: ExecutiveKnowledgeRegistry;
  let loader: KnowledgeLoader;

  beforeEach(() => {
    registry = new ExecutiveKnowledgeRegistry();
    const versionManager = new KnowledgeVersionManager();
    const governance = new KnowledgeGovernance();
    loader = new KnowledgeLoader(registry, versionManager, governance, '1.0.0');
  });

  it('should validate the mapping from Metric -> Ontology -> Knowledge -> Pattern -> Finding', async () => {
    // 1. Metric
    const currentRatio = 6.0;

    // 2. Ontology
    const ontologyRef = 'financial.liquidity.current_ratio';

    // 3. Knowledge
    const pattern: ExecutiveKnowledge = {
      id: 'pattern.excessive_liquidity',
      type: 'PATTERN',
      domain: 'FINANCIAL',
      ontologyReferences: [ontologyRef],
      title: 'Excessive Liquidity',
      description: 'Test pattern',
      content: {
        conditions: [{ metric: 'current_ratio', operator: '>', value: 5 }],
        interpretation: 'Excessive liquidity detected'
      },
      confidence: 0.90,
      maturity: 'VALIDATED' as any,
      metadata: { version: '1.0', author: 'test', source: 'test', createdAt: '2026-08-05' }
    };
    const manifest = {
      id: 'test-pack',
      version: '1.0.0',
      domain: 'FINANCIAL',
      requiredOntology: { id: 'executive-core-ontology', minimumVersion: '1.0.0' },
      supportedCapabilities: [],
      coverage: { concepts: 0, patterns: 1, benchmarks: 0, rules: 0 },
      maturity: 'VALIDATED' as const,
      status: 'ACTIVE' as const
    };

    loader.loadPackage(manifest, [pattern]);

    // 4. Pattern resolution
    const retrieved = registry.findByConcept(ontologyRef);
    expect(retrieved.length).toBe(1);
    expect(retrieved[0].id).toBe('pattern.excessive_liquidity');

    // 5. Finding 
    const conditions = retrieved[0].content.conditions as Array<any>;
    const condition = conditions[0];
    const isTriggered = condition.operator === '>' && currentRatio > condition.value;

    expect(isTriggered).toBe(true);
    expect(retrieved[0].content.interpretation).toBe('Excessive liquidity detected');
  });
});
