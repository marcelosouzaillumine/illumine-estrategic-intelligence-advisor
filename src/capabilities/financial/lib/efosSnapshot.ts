import { collection, doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { blockedFirestoreWrite } from '../../../lib/blockedFirestoreWrite';

export interface EFOSSnapshot {
  clientId: string;
  score: number;
  maturityLevel: string;
  generatedAt: any;
  version: string;
}

export async function publishEFOSSnapshot(clientId: string, score: number, maturityLevel: string) {
  if (!clientId) return;
  const snapshotRef = doc(collection(db, 'efos_snapshots'), clientId);
  
  const snapshotData: EFOSSnapshot = {
    clientId,
    score,
    maturityLevel,
    generatedAt: serverTimestamp(),
    version: '3.0' // ISE v3.0 EFOS Integration
  };

  blockedFirestoreWrite(); // setDoc(snapshotRef, snapshotData, { merge: true });
}
