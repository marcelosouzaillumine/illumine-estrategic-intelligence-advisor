// src/core/runtime/decision-intelligence/InstitutionalDecisionLedger.ts
//
// Institutional Decision Ledger Memory Layer
// Ref: docs/implementation_plan.md

import { db } from '../../../lib/firebase';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import { ExecutiveDecision } from './decision-types';
import { AuditEventBus } from '../../security/audit/AuditEventBus';

export class InstitutionalDecisionLedger {
  private static inMemoryDecisions: ExecutiveDecision[] = [];

  /**
   * Persists a decision to the ledger and emits a corresponding audit event.
   */
  public static async recordDecision(decision: ExecutiveDecision): Promise<void> {
    const isTestEnv = typeof process !== 'undefined' && 
      (process.env.NODE_ENV === 'test' || 
       process.env.NODE_TEST_CONTEXT !== undefined || 
       process.argv.some(arg => arg.includes('test')));

    // 1. Store in memory
    InstitutionalDecisionLedger.inMemoryDecisions.push(decision);

    // 2. Emit audit event to the standard audit bus
    try {
      await AuditEventBus.emit({
        tenantId: decision.tenantId,
        actorId: decision.approverId,
        role: decision.approverRole as unknown as "SYSTEM" | "UNAUTHENTICATED",
        sessionId: 'sess-decision',
        eventType: 'DECISION_RECORDED',
        resourceType: 'ExecutiveDecision',
        resourceId: decision.decisionId,
        requestSource: 'DECISION_INTELLIGENCE',
        auditSeverity: 'INFO',
        lineageReference: decision.lineageHash,
        metadata: {
          domains: decision.domains,
          approverRole: decision.approverRole
        }
      });
    } catch (e) {
      console.warn('[DecisionLedger] Failed to emit audit event:', e);
    }

    // 3. Persist to Firestore if not in test env
    if (!isTestEnv) {
      try {
        const cleanDecision = JSON.parse(JSON.stringify(decision));
        await addDoc(collection(db, 'decision_ledger'), {
          ...cleanDecision,
          serverTimestamp: new Date()
        });
      } catch (e) {
        console.error('[DecisionLedger] Failed to save decision in ledger:', e);
      }
    }
  }

  /**
   * Retrieves all decisions from the ledger for a given client.
   */
  public static async getDecisions(tenantId: string, clientId: string): Promise<ExecutiveDecision[]> {
    const isTestEnv = typeof process !== 'undefined' && 
      (process.env.NODE_ENV === 'test' || 
       process.env.NODE_TEST_CONTEXT !== undefined || 
       process.argv.some(arg => arg.includes('test')));

    if (isTestEnv) {
      return InstitutionalDecisionLedger.inMemoryDecisions.filter(
        d => d.tenantId === tenantId && d.clientId === clientId
      );
    }

    try {
      const q = query(
        collection(db, 'decision_ledger'),
        where('tenantId', '==', tenantId),
        where('clientId', '==', clientId)
      );
      const snap = await getDocs(q);
      const results: ExecutiveDecision[] = [];
      snap.docs.forEach(doc => {
        results.push(doc.data() as ExecutiveDecision);
      });
      return results;
    } catch (e) {
      console.error('[DecisionLedger] Failed to query decisions:', e);
      // Fallback to in-memory cache if Firestore fails
      return InstitutionalDecisionLedger.inMemoryDecisions.filter(
        d => d.tenantId === tenantId && d.clientId === clientId
      );
    }
  }

  /**
   * Helper to clear memory in tests.
   */
  public static clearMemory(): void {
    InstitutionalDecisionLedger.inMemoryDecisions = [];
  }
}
