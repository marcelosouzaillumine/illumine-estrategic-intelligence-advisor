import { initializeApp } from 'firebase/app';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import * as fs from 'fs';
import * as path from 'path';

const configPath = path.resolve(process.cwd(), 'firebase-applet-config.json');
const firebaseConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));
const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

async function run() {
  console.log("Querying ACTIVE documents for client gcd1P7yKlPT10PLRs7WJ and year 2022...");
  const q = query(
    collection(db, 'financial_entries'),
    where('clientId', '==', 'gcd1P7yKlPT10PLRs7WJ'),
    where('year', '==', 2022)
  );
  
  const snap = await getDocs(q);
  console.log(`Found ${snap.size} documents total.`);
  
  snap.forEach(doc => {
    const d = doc.data();
    if (d.status === 'archived') return;
    console.log(`\nDoc ID: ${doc.id}`);
    console.log(`  Type: ${d.type}`);
    console.log(`  Status: ${d.status}`);
    console.log(`  Created At: ${d.createdAt?.toDate?.() || d.createdAt}`);
    if (Array.isArray(d.data)) {
       console.log(`  Data: array of ${d.data.length} entries`);
    } else {
       console.log(`  Data: category=${d.category}, value=${d.value}`);
    }
  });
  
  process.exit(0);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
