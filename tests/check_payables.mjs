import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { readFileSync } from 'fs';

const config = JSON.parse(readFileSync('./firebase-applet-config.json', 'utf8'));
const app = initializeApp(config);
const db = getFirestore(app, config.firestoreDatabaseId);

async function run() {
  const q = collection(db, 'payables');
  const snap = await getDocs(q);
  console.log(`Found ${snap.docs.length} payables total.`);
  if (snap.docs.length > 0) {
    const d = snap.docs[snap.docs.length - 1].data();
    console.log("Sample payable:");
    console.log("clientId:", d.clientId);
    console.log("fornecedor:", d.fornecedor);
    console.log("valor:", d.valor);
  }
  process.exit(0);
}
run().catch(console.error);
