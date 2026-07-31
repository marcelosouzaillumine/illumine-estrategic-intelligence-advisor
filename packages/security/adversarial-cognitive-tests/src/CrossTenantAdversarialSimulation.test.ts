import { TenantIsolationContext, TenantBoundaryViolationError, RetrievalIsolationGuard } from '../../../tenant-isolation-kernel/src';
import { TenantScopedMemoryRepository, EmbeddingIsolationGuard, CognitiveEmbeddingMetadata } from '../../../intelligence/executive-memory/src';
import { CognitiveTrustGate, RecommendationReleasePolicy } from '../../../cognitive-trust-gate/src';

describe('Adversarial Validation & Cognitive Security Certification™', () => {

  const contextA: TenantIsolationContext = {
    tenantId: 'TENANT-A',
    organizationId: 'ORG-A',
    userId: 'USER-1',
    authorizationScope: 'GLOBAL',
    isolationBoundaryId: 'BND-1',
    traceId: 'TRACE-A',
    createdAt: new Date()
  };

  const contextB: TenantIsolationContext = {
    tenantId: 'TENANT-B',
    organizationId: 'ORG-B',
    userId: 'USER-2',
    authorizationScope: 'GLOBAL',
    isolationBoundaryId: 'BND-2',
    traceId: 'TRACE-B',
    createdAt: new Date()
  };

  describe('Test 1 — Cross Tenant Memory Attack™', () => {
    it('should block Tenant B from accessing Tenant A memory', () => {
      const memoryRepo = new TenantScopedMemoryRepository();
      
      const memoryA = {
        id: 'MEM-1',
        tenantId: 'TENANT-A',
        organizationId: 'ORG-A',
        content: 'Strategic Decision',
        sourceType: 'DOCUMENT'
      };

      // Tenant B Copilot Query tenta acessar memoria do Tenant A
      const isAllowed = memoryRepo.validateOwnership(memoryA, contextB);
      
      expect(isAllowed).toBe(false);
    });
  });

  describe('Test 2 — Embedding Contamination Attack™', () => {
    it('should reject mixed payload and create security event', () => {
      const mixedResults = [
        {
          tenantId: 'TENANT-B', // Valido para a query do Tenant B
          metadata: { tenantId: 'TENANT-B' } as CognitiveEmbeddingMetadata
        },
        {
          tenantId: 'TENANT-A', // Contaminacao
          metadata: { tenantId: 'TENANT-A' } as CognitiveEmbeddingMetadata
        }
      ];

      // EmbeddingIsolationGuard filter
      const filter = EmbeddingIsolationGuard.injectMetadataFilter(contextB, { query: 'test' });
      expect(filter.tenantId).toBe('TENANT-B');

      // RetrievalIsolationGuard block
      expect(() => {
        RetrievalIsolationGuard.validateRetrievalResults(contextB, mixedResults);
      }).toThrow(TenantBoundaryViolationError);
    });
  });

  describe('Test 3 — Missing Tenant Context Attack™', () => {
    it('should block execution when context is missing', async () => {
      const memoryRepo = new TenantScopedMemoryRepository();
      
      await expect(memoryRepo.search(null as any, { queryText: 'Analise minha situacao' }))
        .rejects
        .toThrow(TenantBoundaryViolationError);
    });
  });

  describe('Test 4 — Trust Gate Bypass Attempt™', () => {
    it('should deny release when traceId is missing', () => {
      const payload = {
        content: 'Recommendation without trace',
        evidenceUsed: [],
        generationTraceId: '' // null or empty
      };

      const violations = RecommendationReleasePolicy.evaluate(contextA, payload);
      expect(violations.length).toBeGreaterThan(0);
      expect(violations[0]).toContain('POLICY_VIOLATION: Recommendation lacks generation trace ID');
      
      const result = CognitiveTrustGate.verifyRelease(contextA, payload);
      expect(result.isAllowed).toBe(false);
      expect(result.status).toBe('BLOCKED_NO_TRACE');
    });
  });
});
