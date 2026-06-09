import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';
import * as fs from 'fs';

const firebaseConfig = JSON.parse(fs.readFileSync('./firebase-applet-config.json', 'utf8'));

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function run() {
  console.log("Checking Firestore collections...");
  
  // 1. Get all clients to find the client ID
  const clientsSnap = await getDocs(collection(db, 'clients'));
  console.log(`\nFound ${clientsSnap.size} clients:`);
  let clientId = '';
  clientsSnap.forEach(d => {
    const data = d.data();
    console.log(`- ID: ${d.id}, fantasia: ${data.fantasia}, razaoSocial: ${data.razaoSocial}`);
    if (data.fantasia?.toLowerCase().includes('consultoria') || d.id === '02.758.586/0001-83') {
      clientId = d.id;
    }
  });

  if (!clientId) {
    console.log("Could not find client 'Illumine Consultoria'");
    return;
  }

  console.log(`\nInspecting data for active client ID: ${clientId}`);

  // 2. check cash_flows
  const qCash = query(collection(db, 'cash_flows'), where('clientId', '==', clientId));
  const cashSnap = await getDocs(qCash);
  console.log(`cash_flows: ${cashSnap.size} entries`);
  cashSnap.forEach(d => {
    const data = d.data();
    console.log(`- Cash Flow doc ID: ${d.id}, projections length: ${data.Fluxo_Diario?.length || 0}`);
  });

  // 3. check payables
  const qPayables = query(collection(db, 'payables'), where('clientId', '==', clientId));
  const payablesSnap = await getDocs(qPayables);
  console.log(`payables: ${payablesSnap.size} entries`);

  // 4. check receivables
  const qReceivables = query(collection(db, 'receivables'), where('clientId', '==', clientId));
  const receivablesSnap = await getDocs(qReceivables);
  console.log(`receivables: ${receivablesSnap.size} entries`);

  // 5. check financial_positions
  const qPositions = query(collection(db, 'financial_positions'), where('clientId', '==', clientId));
  const positionsSnap = await getDocs(qPositions);
  console.log(`financial_positions: ${positionsSnap.size} entries`);
}

run().catch(console.error);
