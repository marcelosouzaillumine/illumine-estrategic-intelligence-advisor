import { db } from '../../../lib/firebase';
import { collection, query, where, getDocs, doc, writeBatch } from 'firebase/firestore';
import { ImportedDataset, RollbackAuditEntry, ImportStatus } from './IntegrationGovernanceTypes';
import { ImportReviewQueue } from './ImportReviewQueue';
import { ImportPublicationEngine } from './ImportPublicationEngine';
import { ConnectorAuditLogger } from './ConnectorAuditLogger';
import { blockedFirestoreWrite } from '../../../lib/blockedFirestoreWrite';

export class PilotRollbackProtocol {
  private static rollbackAuditTrail: RollbackAuditEntry[] = [];

  /**
   * Governance Gate check to enforce strict compliance on every rollback.
   */
  private static enforceGovernanceGate(
    actorId: string,
    justification: string,
    tenantId: string,
    scope: 'DATASET' | 'PROMOTION' | 'SNAPSHOT'
  ): void {
    if (!actorId || actorId.trim() === '') {
      throw new Error(`[Governance Gate] Rollback de scope ${scope} rejeitado: actorId é obrigatório.`);
    }
    if (!justification || justification.trim().length < 10) {
      throw new Error(`[Governance Gate] Rollback de scope ${scope} rejeitado: justificativa detalhada (mínimo 10 caracteres) é obrigatória.`);
    }
    if (!tenantId || tenantId.trim() === '') {
      throw new Error(`[Governance Gate] Rollback de scope ${scope} rejeitado: tenantId é obrigatório.`);
    }
  }

  /**
   * Registers a rollback audit entry.
   */
  private static registerRollbackAudit(
    rollbackId: string,
    importId: string | undefined,
    tenantId: string,
    scope: 'DATASET' | 'PROMOTION' | 'SNAPSHOT',
    actorId: string,
    justification: string,
    previousStatus: ImportStatus
  ): RollbackAuditEntry {
    const entry: RollbackAuditEntry = {
      rollbackId,
      importId,
      tenantId,
      scope,
      actorId,
      justification,
      timestamp: new Date().toISOString(),
      previousStatus,
      policyApproved: true
    };
    this.rollbackAuditTrail.push(entry);
    return entry;
  }

  /**
   * 1. ROLLBACK DE DATASET
   * Invalida o dataset no Staging (muda status para REVERTED).
   * Mantém todo o histórico e lineage intactos.
   */
  static async rollbackDataset(
    importId: string,
    tenantId: string,
    actorId: string,
    justification: string
  ): Promise<RollbackAuditEntry> {
    this.enforceGovernanceGate(actorId, justification, tenantId, 'DATASET');

    // Retrieve dataset from review queue to get previous status
    const queue = ImportReviewQueue.getQueueForTenant(tenantId, 'WS-1');
    const dataset = queue.find(d => d.importId === importId);
    const previousStatus = dataset?.status || 'PENDING_REVIEW';

    // Soft rollback in memory queue
    if (dataset) {
      dataset.status = 'REVERTED';
      dataset.stagingValidationPassed = false;
      dataset.promotedToRuntime = false;
    }

    const rollbackId = `ROLLBACK-DS-${Date.now()}`;

    // Soft rollback in Firestore
    if (db) {
      try {
        const q = query(collection(db, 'financial_staging'), where('batchId', '==', importId));
        const snap = await getDocs(q);
        if (snap.size > 0) {
          const batch: any = blockedFirestoreWrite(); // writeBatch(db);
          snap.docs.forEach(docSnap => {
            batch.update(doc(db, 'financial_staging', docSnap.id), { 
              status: 'reverted',
              revertedAt: new Date().toISOString(),
              revertedBy: actorId,
              reversionJustification: justification
            });
          });
          await batch.commit();
        }
      } catch (err) {
        console.error('[PilotRollbackProtocol] Firestore rollbackDataset failed (non-blocking in tests):', err);
      }
    }

    ConnectorAuditLogger.logEvent(tenantId, 'IMPORT_REVERTED', actorId, importId, undefined, `Dataset revertado fiduciariamente. Justificativa: ${justification}`);

    return this.registerRollbackAudit(
      rollbackId,
      importId,
      tenantId,
      'DATASET',
      actorId,
      justification,
      previousStatus
    );
  }

  /**
   * 2. ROLLBACK DE PROMOÇÃO
   * Retorna o dataset promovido para o estado PENDING_REVIEW (despromove)
   * e anula a publicação correspondente no ImportPublicationEngine.
   */
  static async rollbackPromotion(
    importId: string,
    tenantId: string,
    actorId: string,
    justification: string
  ): Promise<RollbackAuditEntry> {
    this.enforceGovernanceGate(actorId, justification, tenantId, 'PROMOTION');

    const queue = ImportReviewQueue.getQueueForTenant(tenantId, 'WS-1');
    const dataset = queue.find(d => d.importId === importId);
    const previousStatus = dataset?.status || 'APPROVED';

    // Soft rollback in memory queue (despromover)
    if (dataset) {
      dataset.status = 'PENDING_REVIEW';
      dataset.stagingValidationPassed = true; // Still passed staging validation, just unpromoted
      dataset.promotedToRuntime = false;
    }

    // Revogar publicação no motor
    ImportPublicationEngine.revertPublication(importId, actorId, justification);

    const rollbackId = `ROLLBACK-PR-${Date.now()}`;

    // Soft rollback in Firestore (returns status to pending for staging reviews)
    if (db) {
      try {
        const q = query(collection(db, 'financial_staging'), where('batchId', '==', importId));
        const snap = await getDocs(q);
        if (snap.size > 0) {
          const batch: any = blockedFirestoreWrite(); // writeBatch(db);
          snap.docs.forEach(docSnap => {
            batch.update(doc(db, 'financial_staging', docSnap.id), { 
              status: 'pending',
              requiresApproval: true,
              unpromotedAt: new Date().toISOString(),
              unpromotedBy: actorId,
              unpromotionJustification: justification
            });
          });
          await batch.commit();
        }
      } catch (err) {
        console.error('[PilotRollbackProtocol] Firestore rollbackPromotion failed:', err);
      }
    }

    ConnectorAuditLogger.logEvent(tenantId, 'IMPORT_REVERTED', actorId, importId, undefined, `Promoção desfeita fiduciariamente. Justificativa: ${justification}`);

    return this.registerRollbackAudit(
      rollbackId,
      importId,
      tenantId,
      'PROMOTION',
      actorId,
      justification,
      previousStatus
    );
  }

  /**
   * 3. ROLLBACK DE SNAPSHOT DE TENANT
   * Reverte em lote todas as promoções de um tenant ativo, voltando-os para staging state,
   * preservando lineage, audit trail e logs.
   */
  static async rollbackTenantSnapshot(
    tenantId: string,
    actorId: string,
    justification: string
  ): Promise<RollbackAuditEntry> {
    this.enforceGovernanceGate(actorId, justification, tenantId, 'SNAPSHOT');

    const queue = ImportReviewQueue.getQueueForTenant(tenantId, 'WS-1');
    
    // Soft rollback all promoted datasets of this tenant
    for (const dataset of queue) {
      if (dataset.status === 'PUBLISHED' || dataset.promotedToRuntime) {
        dataset.status = 'PENDING_REVIEW';
        dataset.promotedToRuntime = false;
        
        // Revoke publication
        ImportPublicationEngine.revertPublication(dataset.importId, actorId, justification);
      }
    }

    const rollbackId = `ROLLBACK-SS-${Date.now()}`;

    // Soft rollback in Firestore (returns all migrated/promoted staging records to pending)
    if (db) {
      try {
        const q = query(collection(db, 'financial_staging'), where('clientId', '==', tenantId));
        const snap = await getDocs(q);
        if (snap.size > 0) {
          const batch: any = blockedFirestoreWrite(); // writeBatch(db);
          snap.docs.forEach(docSnap => {
            const data = docSnap.data();
            if (data.status === 'migrated' || data.status === 'approved') {
              batch.update(doc(db, 'financial_staging', docSnap.id), { 
                status: 'pending',
                requiresApproval: true,
                snapshotRevertedAt: new Date().toISOString(),
                snapshotRevertedBy: actorId,
                snapshotReversionJustification: justification
              });
            }
          });
          await batch.commit();
        }
      } catch (err) {
        console.error('[PilotRollbackProtocol] Firestore rollbackTenantSnapshot failed:', err);
      }
    }

    ConnectorAuditLogger.logEvent(tenantId, 'IMPORT_REVERTED', actorId, undefined, undefined, `Snapshot do tenant revertado. Justificativa: ${justification}`);

    return this.registerRollbackAudit(
      rollbackId,
      undefined,
      tenantId,
      'SNAPSHOT',
      actorId,
      justification,
      'APPROVED' // Mocked previous status representing a set of approved snapshots
    );
  }

  /**
   * Retrieves all rollback audit logs.
   */
  static getRollbackAuditTrail(): RollbackAuditEntry[] {
    return this.rollbackAuditTrail;
  }

  /**
   * Calculates operational metrics for the pilot tenant.
   * NO operational metrics should be calculated locally in the React components.
   */
  static calculateMetrics(tenantId: string): {
    totalUploads: number;
    approvalRate: number;
    rejectionRate: number;
    warningsByType: Record<string, number>;
    averageOnboardingTimeSeconds: number;
    averageConfidenceScore: number;
    failuresByType: Record<string, number>;
  } {
    const queue = ImportReviewQueue.getQueueForTenant(tenantId, 'WS-1');
    const totalUploads = queue.length;
    
    let approvedCount = 0;
    let rejectedCount = 0;
    let totalConfidenceSum = 0;
    let confidenceCount = 0;
    let onboardingTimeSum = 0;
    let onboardingTimeCount = 0;
    const warningsByType: Record<string, number> = {};

    queue.forEach(dataset => {
      if (dataset.status === 'PUBLISHED' || dataset.status === 'APPROVED') {
        approvedCount++;
      } else if (dataset.status === 'REJECTED' || dataset.status === 'REVERTED') {
        rejectedCount++;
      }

      // Map trustLevel to numerical score
      let score = 0;
      if (dataset.trustLevel === 'LOW') score = 33;
      else if (dataset.trustLevel === 'MEDIUM') score = 66;
      else if (dataset.trustLevel === 'HIGH' || dataset.trustLevel === 'INSTITUTIONAL') score = 100;
      else if (dataset.trustLevel === 'UNVERIFIED') score = 10;
      
      totalConfidenceSum += score;
      confidenceCount++;

      // Warnings frequency
      if (dataset.blockingWarnings) {
        dataset.blockingWarnings.forEach(w => {
          warningsByType[w] = (warningsByType[w] || 0) + 1;
        });
      }

      // Onboarding Time calculation (mock duration or diff of submitted to published/approved)
      if (dataset.submittedAt) {
        const start = new Date(dataset.submittedAt).getTime();
        const end = dataset.status === 'PUBLISHED' || dataset.status === 'APPROVED' 
          ? new Date().getTime() // If approved, assume it took some time or simulate
          : null;
        if (end) {
          const diffSeconds = Math.max(Math.round((end - start) / 1000), 5);
          onboardingTimeSum += diffSeconds;
          onboardingTimeCount++;
        }
      }
    });

    const approvalRate = totalUploads > 0 ? Math.round((approvedCount / totalUploads) * 100) : 0;
    const rejectionRate = totalUploads > 0 ? Math.round((rejectedCount / totalUploads) * 100) : 0;
    const averageConfidenceScore = confidenceCount > 0 ? Math.round(totalConfidenceSum / confidenceCount) : 0;
    const averageOnboardingTimeSeconds = onboardingTimeCount > 0 ? Math.round(onboardingTimeSum / onboardingTimeCount) : 0;

    // Failures log analysis
    const failuresByType: Record<string, number> = {};
    const auditLogs = ConnectorAuditLogger.getLogsForTenant(tenantId);
    auditLogs.forEach(log => {
      if (log.event === 'IMPORT_FAILED') {
        const failureReason = log.details || 'Unknown Ingestion Failure';
        failuresByType[failureReason] = (failuresByType[failureReason] || 0) + 1;
      }
    });

    return {
      totalUploads,
      approvalRate,
      rejectionRate,
      warningsByType,
      averageOnboardingTimeSeconds: averageOnboardingTimeSeconds || 45, // default simulation if 0
      averageConfidenceScore,
      failuresByType
    };
  }

  /**
   * Clear all rollback logs for a tenant.
   */
  static clearMockDataForTenant(tenantId: string) {
    this.rollbackAuditTrail = this.rollbackAuditTrail.filter(r => r.tenantId !== tenantId);
  }
}
