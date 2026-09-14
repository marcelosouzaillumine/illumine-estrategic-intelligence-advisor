// src/core/runtime/pilot-operations/PilotFeedbackGovernanceEngine.ts

import { PilotFeedbackEntry, PilotValidationCategory, PilotFeedbackSeverity } from './types';

export class PilotFeedbackGovernanceEngine {
  /**
   * Registers a feedback entry fiduciarily, checking isolation parameters and generating an audit trail hash.
   */
  public static registerFeedback(
    tenantId: string,
    category: PilotValidationCategory,
    severity: PilotFeedbackSeverity,
    comment: string,
    submittedBy: string
  ): PilotFeedbackEntry {
    // 1. Enforce strict context rules
    if (!tenantId || !submittedBy || !comment || comment.trim().length < 5) {
      throw new Error('VIOLAÇÃO DE DADOS: Registro de feedback exige comentário válido (mín. 5 chars), tenantId e identificação do autor.');
    }

    // 2. Generate deterministic lineage audit reference
    // Since we are not allowed to use random hashes for audit trails, we generate a hash from fields
    const payloadStr = `${tenantId}:${category}:${severity}:${comment.trim()}:${submittedBy}`;
    let hash = 0;
    for (let i = 0; i < payloadStr.length; i++) {
      const char = payloadStr.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= 0; // Convert to 32bit integer
    }
    const lineageHash = `0xPF-LINEAGE-${Math.abs(hash).toString(16).toUpperCase()}`;

    return {
      feedbackId: `FB-${Date.now()}-${Math.abs(hash % 10000)}`,
      tenantId,
      category,
      severity,
      comment: comment.trim(),
      submittedBy,
      submittedAt: new Date().toISOString(),
      lineageHash
    };
  }

  /**
   * Filter feedback entries to preserve strict tenant isolation.
   */
  public static filterByTenant(
    feedbacks: PilotFeedbackEntry[],
    activeTenantId: string
  ): PilotFeedbackEntry[] {
    return feedbacks.filter(f => f.tenantId === activeTenantId);
  }
}
