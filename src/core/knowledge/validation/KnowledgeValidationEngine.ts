import { KnowledgeIngestionRequest } from '../ingestion/KnowledgeIngestionRequest';
import { KnowledgeValidationIssue } from '../ingestion/KnowledgeIngestionResult';

export class KnowledgeValidationEngine {
  validate(request: KnowledgeIngestionRequest, normalizedData: any): KnowledgeValidationIssue[] {
    const issues: KnowledgeValidationIssue[] = [];

    if (!request.tenantId) {
      issues.push({ code: "ERR_NO_TENANT", description: "Missing Tenant ID", severity: "critical" });
    }

    if (!request.metadata?.classification) {
      issues.push({ code: "ERR_NO_CLASS", description: "Missing Data Classification", severity: "high" });
    }

    if (!request.source) {
      issues.push({ code: "ERR_NO_SOURCE", description: "Missing Provenance Source", severity: "critical" });
    }

    return issues;
  }
}
