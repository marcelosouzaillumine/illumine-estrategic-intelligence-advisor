import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query, where, deleteDoc, doc } from 'firebase/firestore';
import * as fs from 'fs';

const firebaseConfig = JSON.parse(fs.readFileSync('./firebase-applet-config.json', 'utf8'));

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function run() {
  console.log("Searching for client 'granatum'...");
  
  const clientsSnap = await getDocs(collection(db, 'clients'));
  let clientId = '';
  clientsSnap.forEach(d => {
    const data = d.data();
    if (data.fantasia?.toLowerCase().includes('granatum') || data.razaoSocial?.toLowerCase().includes('granatum')) {
      clientId = d.id;
      console.log(`Found client: ID: ${d.id}, fantasia: ${data.fantasia}, razaoSocial: ${data.razaoSocial}`);
    }
  });

  if (!clientId) {
    console.log("Could not find client containing 'granatum'");
    return;
  }

  console.log(`\nDeleting 2026 balance sheet data for client ID: ${clientId}`);

  const types = ['Balanço Patrimonial', 'BP'];
  let deletedCount = 0;

  for (const t of types) {
    const q = query(
      collection(db, 'financial_entries'),
      where('clientId', '==', clientId),
      where('type', '==', t),
      where('year', '==', 2026)
    );
    const snap = await getDocs(q);
    for (const d of snap.docs) {
      console.log(`Deleting doc ID: ${d.id} (type: ${t}, year: 2026)`);
      await deleteDoc(doc(db, 'financial_entries', d.id));
      deletedCount++;
    }
  }

  console.log(`\nDeleted ${deletedCount} documents.`);
}

run().catch(console.error);
