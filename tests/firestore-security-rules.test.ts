import { describe, it } from 'node:test';
import assert from 'node:assert';
import { readFileSync } from 'node:fs';
import { initializeTestEnvironment, assertFails, assertSucceeds } from '@firebase/rules-unit-testing';
import { doc, getDoc, setDoc, deleteDoc, updateDoc } from 'firebase/firestore';

const hasEmulator = !!process.env.FIRESTORE_EMULATOR_HOST;

describe('Firestore Security Rules Hardening Tests', () => {
  if (!hasEmulator) {
    it('SKIPPED_EMULATOR_NOT_RUNNING - Firestore emulator is not running, skipping rule assertions', () => {
      console.warn('⚠️  SKIPPED_EMULATOR_NOT_RUNNING: process.env.FIRESTORE_EMULATOR_HOST is not set.');
      assert.ok(true);
    });
    return;
  }

  const projectId = 'demo-illumine-rules-hardening';
  const rules = readFileSync('firestore.rules', 'utf8');

  it('Verify rules under emulator environment', async () => {
    const testEnv = await initializeTestEnvironment({
      projectId,
      firestore: { rules },
    });

    try {
      const cfoAUid = 'cfo-a';
      const cfoBUid = 'cfo-b';
      const adminUid = 'admin-user';

      // 1. Setup mock clients under disabled security rules
      await testEnv.withSecurityRulesDisabled(async (context) => {
        const db = context.firestore();
        
        // Seed Client A
        await setDoc(doc(db, 'clients', 'tenant-a'), {
          fantasia: 'Client A',
          regime: 'Lucro Real',
          ownerId: cfoAUid,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });

        // Seed Client B
        await setDoc(doc(db, 'clients', 'tenant-b'), {
          fantasia: 'Client B',
          regime: 'Lucro Real',
          ownerId: cfoBUid,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      });

      const cfoADb = testEnv.authenticatedContext(cfoAUid).firestore();
      const cfoBDb = testEnv.authenticatedContext(cfoBUid).firestore();
      const adminDb = testEnv.authenticatedContext(adminUid, {
        email: 'marcelosouza.illumine@gmail.com'
      }).firestore();

      // CFO A gets Client A, fails to get Client B (No cross-tenant)
      await assertSucceeds(getDoc(doc(cfoADb, 'clients', 'tenant-a')));
      await assertFails(getDoc(doc(cfoADb, 'clients', 'tenant-b')));

      // CFO B gets Client B, fails to get Client A
      await assertSucceeds(getDoc(doc(cfoBDb, 'clients', 'tenant-b')));
      await assertFails(getDoc(doc(cfoBDb, 'clients', 'tenant-a')));

      // Master Admin can access both due to Admin Bypass
      await assertSucceeds(getDoc(doc(adminDb, 'clients', 'tenant-a')));
      await assertSucceeds(getDoc(doc(adminDb, 'clients', 'tenant-b')));

      // 2. Validate append-only ledger properties (audit_events, anomalies, governance_ledger)
      const auditDocRef = doc(cfoADb, 'audit_events', 'evt-1');
      await assertSucceeds(setDoc(auditDocRef, {
        tenantId: 'tenant-a',
        actorId: cfoAUid,
        role: 'CFO',
        sessionId: 'sess-1',
        eventType: 'VIEW_DASHBOARD',
        resourceType: 'Dashboard',
        timestamp: new Date().toISOString()
      }));

      // No updates or deletions on audit_events
      await assertFails(updateDoc(auditDocRef, { eventType: 'COMPROMISED' }));
      await assertFails(deleteDoc(auditDocRef));

      // 3. Validate anomalies append-only
      const anomalyRef = doc(cfoADb, 'anomalies', 'anom-1');
      await assertSucceeds(setDoc(anomalyRef, {
        tenantId: 'tenant-a',
        anomalyType: 'CROSS_TENANT_ATTEMPT',
        severity: 'CRITICAL',
        actorId: cfoAUid,
        sessionId: 'sess-1',
        detectedAt: new Date().toISOString()
      }));
      await assertFails(updateDoc(anomalyRef, { severity: 'MEDIUM' }));
      await assertFails(deleteDoc(anomalyRef));

      // 4. Validate governance_ledger append-only
      const ledgerRef = doc(cfoADb, 'governance_ledger', 'led-1');
      await assertSucceeds(setDoc(ledgerRef, {
        tenantId: 'tenant-a',
        actorId: cfoAUid,
        role: 'CFO',
        sessionId: 'sess-1',
        eventType: 'EXPORT_SNAPSHOT',
        timestamp: new Date().toISOString(),
        ledgerHash: 'hash-1'
      }));
      await assertFails(updateDoc(ledgerRef, { ledgerHash: 'modified-hash' }));
      await assertFails(deleteDoc(ledgerRef));

      // 5. Validate institutional_jobs isolation
      const jobRefA = doc(cfoADb, 'institutional_jobs', 'job-a');
      await assertSucceeds(setDoc(jobRefA, {
        tenantId: 'tenant-a',
        jobType: 'Simulation',
        jobState: 'QUEUED',
        priority: 'MEDIUM',
        createdAt: new Date().toISOString()
      }));

      // CFO B cannot access CFO A's jobs
      await assertFails(getDoc(doc(cfoBDb, 'institutional_jobs', 'job-a')));
      await assertFails(setDoc(doc(cfoBDb, 'institutional_jobs', 'job-a'), {
        tenantId: 'tenant-a',
        jobType: 'Simulation'
      }));

    } finally {
      await testEnv.cleanup();
    }
  });
});
