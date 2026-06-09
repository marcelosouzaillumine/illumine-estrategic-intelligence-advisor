import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';
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
    }
  });

  if (!clientId) {
    console.log("Could not find client containing 'granatum'");
    return;
  }

  console.log(`\nFetching 2022 DRE data for client ID: ${clientId}`);

  const q = query(
    collection(db, 'financial_entries'),
    where('clientId', '==', clientId),
    where('year', '==', 2022),
    where('type', '==', 'DRE')
  );
  
  const snap = await getDocs(q);
  console.log(`Found ${snap.docs.length} docs`);
  
  snap.docs.forEach(doc => {
    console.log(JSON.stringify(doc.data(), null, 2));
  });
}

run().catch(console.error);
