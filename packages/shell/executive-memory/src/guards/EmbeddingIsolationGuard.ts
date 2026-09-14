import { TenantIsolationContext, TenantIsolationKernel, TenantBoundaryViolationError } from '../../../../packages/security/tenant-isolation-kernel/src';
import { CognitiveEmbeddingMetadata } from '../contracts/MemoryContracts';

export class EmbeddingIsolationGuard {
  static validateRetrieval(context: TenantIsolationContext, results: { metadata: CognitiveEmbeddingMetadata }[]): void {
    TenantIsolationKernel.validateContext(context);
    
    // Verifica se algum resultado pertence a outro tenant
    const crossTenantViolations = results.filter(r => r.metadata.tenantId !== context.tenantId);
    
    if (crossTenantViolations.length > 0) {
      throw new TenantBoundaryViolationError(
        `CROSS-TENANT RETRIEVAL BLOCKED. Encontrados embeddings de tenants distintos. Identidade permitida: ${context.tenantId}`,
        context.traceId
      );
    }
  }

  static injectMetadataFilter(context: TenantIsolationContext, queryParams: any): any {
    TenantIsolationKernel.validateContext(context);
    return {
      ...queryParams,
      tenantId: context.tenantId
    };
  }
}
