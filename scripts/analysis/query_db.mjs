import { initializeApp } from 'firebase/app';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import fs from 'fs';

const firebaseConfig = JSON.parse(fs.readFileSync('./firebase-applet-config.json', 'utf8'));
const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

async function run() {
  console.log("Querying clients to find Granatum...");
  const clientsSnap = await getDocs(collection(db, 'clients'));
  let clientId = null;
  clientsSnap.forEach(doc => {
    const d = doc.data();
    if (d.fantasia && d.fantasia.toLowerCase().includes('granatum')) {
      clientId = doc.id;
    }
  });
  
  if (!clientId) {
    console.log("Granatum client not found.");
    process.exit(1);
  }
  
  console.log("Found Granatum ID:", clientId);
  
  const q = query(
    collection(db, 'financial_entries'),
    where('clientId', '==', clientId),
    where('year', '==', 2022),
    where('type', '==', 'DRE')
  );
  
  const snap = await getDocs(q);
  console.log("Found", snap.size, "documents for DRE 2022.");
  
  snap.forEach(doc => {
    const d = doc.data();
    console.log("--- DOC ID:", doc.id);
    if (d.data) {
       console.log("Has data array with", d.data.length, "items");
       d.data.forEach(item => console.log(`  ${item.category}: ${item.value}`));
    } else {
       console.log("Single entry:", d.category, "=", d.value);
    }
  });
  process.exit(0);
}
run();
