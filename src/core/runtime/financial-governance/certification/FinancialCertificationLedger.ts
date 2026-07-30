/**
 * Illumine OS™ Financial Governance Boundary
 * Financial Certification Ledger (CFDI v2.1)
 * 
 * Persists certified audit records to Cloud Firestore collection 'financial_certifications'.
 */

import { db } from '../../../../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { CertifiedFinancialDataset } from '../../../../../packages/executive-contracts/src/financial/index';

export interface FinancialCertificationLedgerEntry {
  certificationId: string;
  clientId: string;
  datasetHash: string;
  pipelineVersion: string;
  status: 'CERTIFIED' | 'WARNING' | 'FAILED';
  healthIndex: number;
  qualityScore: number;
  violationsCount: number;
  violations: any[];
  certifiedAt: string;
  certifiedBy: string;
  decisionContext: {
    runtime: string;
    agentCouncil: 'enabled' | 'limited' | 'disabled';
    decisionLevel: string;
  };
}

export class FinancialCertificationLedger {
  public static async recordCertification(dataset: CertifiedFinancialDataset): Promise<string> {
    const agentCouncilStatus =
      dataset.certification.status === 'CERTIFIED'
        ? 'enabled'
        : dataset.certification.status === 'WARNING'
        ? 'limited'
        : 'disabled';

    const record: FinancialCertificationLedgerEntry = {
      certificationId: dataset.id,
      clientId: dataset.clientId,
      datasetHash: dataset.datasetHash,
      pipelineVersion: dataset.pipelineVersion,
      status: dataset.certification.status,
      healthIndex: dataset.healthIndex.index,
      qualityScore: dataset.certification.qualityScore.score,
      violationsCount: dataset.certification.violations.length,
      violations: dataset.certification.violations as any[],
      certifiedAt: dataset.certification.certifiedAt,
      certifiedBy: dataset.certification.certifiedBy,
      decisionContext: {
        runtime: 'ExecutiveDecisionIntelligenceMount',
        agentCouncil: agentCouncilStatus,
        decisionLevel: dataset.certification.status === 'CERTIFIED' ? 'EXECUTIVE' : dataset.certification.status === 'WARNING' ? 'RESTRICTED' : 'SUSPENDED'
      }
    };

    try {
      if (db) {
        const docRef = await addDoc(collection(db, 'financial_certifications'), {
          ...record,
          recordedAt: serverTimestamp()
        });
        return docRef.id;
      }
    } catch (err) {
      // Non-blocking fallback for offline/test environments
      console.warn('[FinancialCertificationLedger] Firestore audit recording offline or skipped.', err);
    }
    return `ledger-${Date.now()}`;
  }
}
