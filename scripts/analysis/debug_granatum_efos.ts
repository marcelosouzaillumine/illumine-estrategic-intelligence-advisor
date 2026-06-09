import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';
import * as fs from 'fs';
import { getComputedDreMetrics } from './src/core/orchestration/financial-math-adapter';

const firebaseConfig = JSON.parse(fs.readFileSync('./firebase-applet-config.json', 'utf8'));
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function run() {
  const clientsSnap = await getDocs(collection(db, 'clients'));
  let clientId = '';
  clientsSnap.forEach(d => {
    const data = d.data();
    if (data.fantasia?.toLowerCase().includes('granatum') || data.razaoSocial?.toLowerCase().includes('granatum')) {
      clientId = d.id;
    }
  });

  if (!clientId) {
    console.log("Could not find client");
    return;
  }

  const qDRE = query(collection(db, 'financial_entries'), where('clientId', '==', clientId), where('year', '==', 2022), where('type', '==', 'DRE'));
  const snapDRE = await getDocs(qDRE);
  let dreEntries: any[] = [];
  snapDRE.docs.forEach(doc => {
    const data = doc.data();
    if (data.entries) dreEntries.push(...data.entries);
  });

  const metrics = getComputedDreMetrics(dreEntries);
  console.log("DRE Metrics:", metrics);

  const qDLPA = query(collection(db, 'financial_entries'), where('clientId', '==', clientId), where('year', '==', 2022), where('type', '==', 'DLPA'));
  const snapDLPA = await getDocs(qDLPA);
  let dlpaEntries: any[] = [];
  snapDLPA.docs.forEach(doc => {
    const data = doc.data();
    if (data.entries) dlpaEntries.push(...data.entries);
  });

  const dlpaRetained = dlpaEntries.find((r: any) => 
    r.category === 'LUCROS_RETIDOS' || 
    r.category === 'PREJUIZOS_ACUMULADOS' || 
    r.category === 'PREJUÍZOS_ACUMULADOS' || 
    r.category === 'PREJUIZO_DO_EXERCICIO'
  )?.value || 0;
  console.log("DLPA Retained:", dlpaRetained);

  const qDFC = query(collection(db, 'financial_entries'), where('clientId', '==', clientId), where('year', '==', 2022), where('type', '==', 'CASH_FLOW'));
  const snapDFC = await getDocs(qDFC);
  let cashFlowData: any[] = [];
  snapDFC.docs.forEach(doc => {
    const data = doc.data();
    if (data.entries) cashFlowData.push(...data.entries);
  });

  const dfcOCF = cashFlowData.reduce((acc, curr) => acc + (curr.operatingCashFlow || curr.fco || curr.value || 0), 0);
  console.log("DFC OCF:", dfcOCF);
}

run().catch(console.error);
