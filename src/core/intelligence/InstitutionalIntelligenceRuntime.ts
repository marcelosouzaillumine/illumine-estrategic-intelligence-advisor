import { InstitutionalContextEngine } from './InstitutionalContextEngine';
import { InstitutionalIntelligenceContext } from '../../types/intelligence/InstitutionalIntelligenceContext';
import { InstitutionalIntelligenceSummary } from '../../types/intelligence/InstitutionalIntelligenceSummary';

export class InstitutionalIntelligenceRuntime {
  constructor(private contextEngine: InstitutionalContextEngine) {}

  async getInstitutionalContext(tenantId: string, objectId: string): Promise<InstitutionalIntelligenceContext | null> {
    return this.contextEngine.buildContext(tenantId, objectId);
  }

  async getInstitutionalSummary(tenantId: string, objectId: string): Promise<InstitutionalIntelligenceSummary | null> {
    const ctx = await this.contextEngine.buildContext(tenantId, objectId);
    if (!ctx) return null;

    return {
      reference: {
        objectId: ctx.object.objectId,
        objectType: ctx.object.objectType,
        title: ctx.object.title,
        domain: ctx.object.sourceDomain,
        tenantId
      },
      historicalRecordCount: ctx.history.length,
      evidenceCount: ctx.evidence.length,
      causalRelationshipCount: ctx.causality.length,
      strategicImpactCount: ctx.impacts.length,
      lastUpdated: ctx.object.updatedAt,
      hasStateAvailable: ctx.state !== null,
      hasProvenanceAvailable: ctx.provenance !== null
    };
  }
}
