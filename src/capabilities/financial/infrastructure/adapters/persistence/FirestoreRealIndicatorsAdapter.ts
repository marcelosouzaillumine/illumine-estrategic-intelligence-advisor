import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../../../../../lib/firebase';

export class FirestoreRealIndicatorsAdapter {
  static listenToIndicatorCollections(
    clientId: string,
    year: number,
    month: number,
    onAcc: (docs: any[]) => void,
    onEntries: (docs: any[]) => void,
    onAssets: (docs: any[]) => void,
    onCashFlows: (docs: any[]) => void,
    onPositions: (docs: any[]) => void,
    onPayables: (docs: any[]) => void,
    onReceivables: (docs: any[]) => void
  ): () => void {
    const qAcc = query(collection(db, 'account_plans'), where('clientId', '==', clientId));
    const entriesConstraints = [
      where('clientId', '==', clientId),
      where('year', '==', year)
    ];
    const qEntries = query(collection(db, 'financial_entries'), ...entriesConstraints);
    const qAssets = query(collection(db, 'assets'), where('clientId', '==', clientId));
    const qCashFlows = query(collection(db, 'cash_flows'), where('clientId', '==', clientId));
    const qPositions = query(collection(db, 'financial_positions'), where('clientId', '==', clientId));
    const qPayables = query(collection(db, 'payables'), where('clientId', '==', clientId));
    const qReceivables = query(collection(db, 'receivables'), where('clientId', '==', clientId));

    const unsubs = [
      onSnapshot(qAcc, snap => onAcc(snap.docs.map(d => d.data()))),
      onSnapshot(qEntries, snap => onEntries(snap.docs.map(d => d.data()))),
      onSnapshot(qAssets, snap => onAssets(snap.docs.map(d => d.data()))),
      onSnapshot(qCashFlows, snap => onCashFlows(snap.docs.map(d => d.data()))),
      onSnapshot(qPositions, snap => onPositions(snap.docs.map(d => d.data()))),
      onSnapshot(qPayables, snap => onPayables(snap.docs.map(d => d.data()))),
      onSnapshot(qReceivables, snap => onReceivables(snap.docs.map(d => d.data())))
    ];

    return () => unsubs.forEach(unsub => unsub());
  }
}
