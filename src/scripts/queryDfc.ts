import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';
import * as fs from 'fs';

const firebaseConfig = JSON.parse(fs.readFileSync('./firebase-applet-config.json', 'utf8'));
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function run() {
  const clientId = 'gcd1P7yKlPT10PLRs7WJ';
  const filterYear = 2022;

  console.log(`\nQuerying DRE entries for client ${clientId}...`);
  const snap = await getDocs(query(
    collection(db, 'financial_entries'),
    where('clientId', '==', clientId),
    where('year', '==', filterYear),
    where('type', '==', 'DRE'),
    where('status', '==', 'approved')
  ));
  console.log(`Found ${snap.size} approved DRE documents.`);
  
  snap.docs.forEach(doc => {
    const data = doc.data();
    console.log(`\nDRE ID: ${doc.id}`);
    console.log('DRE data rows:', JSON.stringify(data.data, null, 2));
  });
}

run().catch(console.error);
