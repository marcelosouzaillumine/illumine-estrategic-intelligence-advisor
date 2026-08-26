import { collection, doc, setDoc, getDocs, query, where, serverTimestamp, updateDoc, getDoc, addDoc, runTransaction, Timestamp } from 'firebase/firestore';
import { db, auth } from './firebase';

export type ScenarioStatus = 'Draft' | 'Pending Approval' | 'Approved' | 'Archived';

export interface AuditTrailEntry {
  action: string;
  userId: string;
  timestamp: string;
  previousStatus?: string;
  newStatus?: string;
  metadata?: Record<string, any>;
}

export interface InstitutionalScenario {
  id?: string;
  clientId: string;
  ownerId: string;
  name: string;
  description: string;
  status: ScenarioStatus;
  version: number;
  createdBy: string;
  approvedBy?: string;
  createdAt: any;
  approvedAt?: any;
  auditTrail: AuditTrailEntry[];
}

export interface ScenarioImpact {
  id?: string;
  scenarioId: string;
  clientId: string;
  ownerId: string;
  sourceType: 'viability_project' | 'manual';
  sourceId: string;
  sourceName: string;
  revenueImpact: number; // Annualized average
  ebitdaImpact: number; // Approximation based on margins
  capexImpact: number; // Initial Investment
  workingCapitalImpact: number; // NCG
  valuationImpact: number; // VPL
  createdAt: any;
  updatedAt: any;
}

export async function createNewDraftScenario(clientId: string, name: string = 'Cenário de Integração (Draft)'): Promise<string> {
  const currentUser = auth.currentUser;
  if (!currentUser) throw new Error("ISE Error: Unauthenticated");

  const newScenarioRef = doc(collection(db, 'institutional_scenarios'));
  const scenarioData: InstitutionalScenario = {
    clientId,
    ownerId: currentUser.uid,
    name,
    description: 'Cenário gerado para receber impactos.',
    status: 'Draft',
    version: 1,
    createdBy: currentUser.uid,
    createdAt: serverTimestamp(),
    auditTrail: [{ 
      action: 'Created', 
      userId: currentUser.uid, 
      timestamp: new Date().toISOString(),
      newStatus: 'Draft'
    }]
  };

  (()=>{throw new Error("Phase 7.2 Architecture Violation: Firestore Writes are BLOCKED. Migrated to PostgreSQL.");})(); // setDoc(newScenarioRef, scenarioData);

  // Busca as premissas globais do cliente
  const globalAssumptionsQ = query(collection(db, 'client_assumptions'), where('clientId', '==', clientId));
  const globalAssumptionsSnap = await getDocs(globalAssumptionsQ);
  
  let baseAssumptions: any = {
    margemBruta: 40.0,
    margemEbitda: 20.0,
    margemLiquida: 10.0,
    taxRate: 34.0,
    discountRate: 14.0,
    terminalGrowthRate: 3.0,
    inflation: 3.85,
    selic: 14.65,
    growthRate: 10.0,
    inadimplencia: 2.0,
    capexAdjustment: 100,
    workingCapitalAdjustment: 100,
  };

  if (!globalAssumptionsSnap.empty) {
    const data = globalAssumptionsSnap.docs[0].data();
    baseAssumptions = {
      ...baseAssumptions,
      ...data
    };
  }

  const assumptionsRef = doc(collection(db, 'scenario_assumptions'));
  (()=>{throw new Error("Phase 7.2 Architecture Violation: Firestore Writes are BLOCKED. Migrated to PostgreSQL.");})(); // setDoc(assumptionsRef, {
    ...baseAssumptions,
    scenarioId: newScenarioRef.id,
    clientId,
    ownerId: currentUser.uid,
    updatedAt: serverTimestamp()
  });

  return newScenarioRef.id;
}

/**
 * Ensures there is an open Draft scenario to receive automated impacts.
 */
export async function getOrCreateDraftScenario(clientId: string): Promise<string> {
  const currentUser = auth.currentUser;
  if (!currentUser) throw new Error("ISE Error: Unauthenticated");

  const q = query(
    collection(db, 'institutional_scenarios'),
    where('clientId', '==', clientId)
  );
  const snap = await getDocs(q);

  const draftDoc = snap.docs.find(d => {
    const status = d.data().status;
    return status === 'Draft' || status === 'Pending Approval';
  });

  if (draftDoc) {
    return draftDoc.id;
  }

  return await createNewDraftScenario(clientId);
}

/**
 * Deterministic Engine: Processes a Viability Project into an Impact.
 * Receives the project data and saves it to the Draft scenario.
 */
export async function processViabilityImpact(project: any) {
  const currentUser = auth.currentUser;
  if (!currentUser) throw new Error("ISE Error: Unauthenticated");
  
  if (project.conclusao !== 'Aprovado' && project.conclusao !== 'Implementado') {
    // If it's not approved, we shouldn't emit impacts. 
    // Or we could remove existing impacts, but to keep it simple, we only process approvals.
    return;
  }

  const clientId = project.cl || project.clientId;
  if (!clientId) throw new Error("ISE Error: Project missing clientId");

  // Calculate generic deterministic impacts based on project data
  const capex = Number(project.capex) || 0;
  const ncg = Number(project.ncg) || 0;
  const receitaMensal = Number(project.receitaMensal) || 0;
  
  const revenueAnnual = receitaMensal * 12;
  const capexTotal = capex;
  const workingCapitalTotal = ncg;
  
  // Extract VPL if computed, or estimate 0
  let vplStr = project.vpl || 'R$ 0,00';
  let vplNum = parseFloat(vplStr.replace(/[^\d,-]/g, '').replace(',', '.')) || 0;

  const scenarioId = await getOrCreateDraftScenario(clientId);

  // Check if impact already exists for this project in this scenario
  const qImpact = query(
    collection(db, 'scenario_impacts'),
    where('scenarioId', '==', scenarioId),
    where('sourceId', '==', project.id)
  );
  const snapImpact = await getDocs(qImpact);

  const impactData: Omit<ScenarioImpact, 'id'> = {
    scenarioId,
    clientId,
    ownerId: currentUser.uid,
    sourceType: 'viability_project',
    sourceId: project.id,
    sourceName: project.nome,
    revenueImpact: revenueAnnual,
    ebitdaImpact: revenueAnnual * 0.2, // Rough deterministic assumption, can be adjusted in ISE UI
    capexImpact: capexTotal,
    workingCapitalImpact: workingCapitalTotal,
    valuationImpact: vplNum,
    createdAt: snapImpact.empty ? serverTimestamp() : snapImpact.docs[0].data().createdAt,
    updatedAt: serverTimestamp()
  };

  if (!snapImpact.empty) {
    const docId = snapImpact.docs[0].id;
    (()=>{throw new Error("Phase 7.2 Architecture Violation: Firestore Writes are BLOCKED. Migrated to PostgreSQL.");})(); // updateDoc(doc(db, 'scenario_impacts', docId), { ...impactData, updatedAt: serverTimestamp() });
  } else {
    (()=>{throw new Error("Phase 7.2 Architecture Violation: Firestore Writes are BLOCKED. Migrated to PostgreSQL.");})(); // addDoc(collection(db, 'scenario_impacts'), { ...impactData, createdAt: serverTimestamp() });
  }
}

export async function validateScenarioIntegrity(scenarioId: string) {
  const scenarioRef = doc(db, 'institutional_scenarios', scenarioId);
  const snap = await getDoc(scenarioRef);
  if (!snap.exists()) throw new Error("ScenarioIntegrityError: Scenario does not exist");

  const assumptionsQ = query(collection(db, 'scenario_assumptions'), where('scenarioId', '==', scenarioId));
  const assumptionsSnap = await getDocs(assumptionsQ);
  if (assumptionsSnap.empty) {
    throw new Error("ScenarioIntegrityError: Missing scenario assumptions");
  }

  const impactsQ = query(collection(db, 'scenario_impacts'), where('scenarioId', '==', scenarioId));
  const impactsSnap = await getDocs(impactsQ);
  
  // Minimal integrity check: all impacts must have valid numbers
  for (const imp of impactsSnap.docs) {
    const data = imp.data();
    if (isNaN(data.capexImpact) || isNaN(data.revenueImpact)) {
      throw new Error(`ScenarioIntegrityError: Corrupted impact data in source ${data.sourceId}`);
    }
  }
}

/**
 * Approve a scenario to become Baseline using Firestore Transactions
 * Enforces Single Baseline rule.
 */
export async function approveScenario(scenarioId: string) {
  const currentUser = auth.currentUser;
  if (!currentUser) throw new Error("ISE Error: Unauthenticated");

  await validateScenarioIntegrity(scenarioId);

  const scenarioRef = doc(db, 'institutional_scenarios', scenarioId);
  
  // 1. Find the current baseline outside transaction to get its reference
  let currentBaselineRef: any = null;
  const snapObj = await getDoc(scenarioRef);
  const scenarioClientId = snapObj.data()?.clientId;
  
  if (scenarioClientId) {
    const qOthers = query(
      collection(db, 'institutional_scenarios'),
      where('clientId', '==', scenarioClientId),
      where('status', '==', 'Approved')
    );
    const snapOthers = await getDocs(qOthers);
    // Find the one that is NOT the current scenario being approved
    const activeBaseline = snapOthers.docs.find(d => d.id !== scenarioId);
    if (activeBaseline) {
      currentBaselineRef = doc(db, 'institutional_scenarios', activeBaseline.id);
    }
  }

  // 2. Execute Transaction
  (()=>{throw new Error("Phase 7.2 Architecture Violation: Firestore Writes are BLOCKED. Migrated to PostgreSQL.");})(); // runTransaction(db, async (transaction) => {
    const newBaselineDoc = await transaction.get(scenarioRef);
    if (!newBaselineDoc.exists()) throw new Error("Scenario not found");
    const newData = newBaselineDoc.data() as InstitutionalScenario;

    if (newData.status === 'Approved') throw new Error("Scenario is already approved");

    // Re-verify the current baseline hasn't changed if we found one
    let oldData: InstitutionalScenario | null = null;
    if (currentBaselineRef) {
      const oldBaselineDoc = await transaction.get(currentBaselineRef);
      if (oldBaselineDoc.exists()) {
        oldData = oldBaselineDoc.data() as InstitutionalScenario;
        // Verify it is still Approved (to prevent race conditions)
        if (oldData.status === 'Approved') {
          const oldTrail = oldData.auditTrail || [];
          oldTrail.push({
            action: 'Archived due to new Baseline approval',
            userId: currentUser.uid,
            timestamp: new Date().toISOString(),
            previousStatus: 'Approved',
            newStatus: 'Archived',
            metadata: { replacedBy: scenarioId }
          });
          transaction.update(currentBaselineRef, {
            status: 'Archived',
            auditTrail: oldTrail as any
          });
        }
      }
    }

    const newTrail = newData.auditTrail || [];
    newTrail.push({
      action: 'Approved as Baseline',
      userId: currentUser.uid,
      timestamp: new Date().toISOString(),
      previousStatus: newData.status,
      newStatus: 'Approved',
      metadata: { replacedBaselineId: currentBaselineRef ? currentBaselineRef.id : null }
    });

    transaction.update(scenarioRef, {
      status: 'Approved',
      approvedBy: currentUser.uid,
      approvedAt: serverTimestamp(),
      auditTrail: newTrail as any
    });
  });
}
