import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';
import * as fs from 'fs';

const firebaseConfig = JSON.parse(fs.readFileSync('./firebase-applet-config.json', 'utf8'));
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function run() {
  const clientId = 'gcd1P7yKlPT10PLRs7WJ';
  const filterYear = 2022;

  
  const snap = await getDocs(query(
    collection(db, 'financial_entries'),
    where('clientId', '==', clientId),
    where('year', '==', filterYear),
    where('type', '==', 'DRE'),
    where('status', '==', 'approved')
  ));
  
  
  snap.docs.forEach(doc => {
    const data = doc.data();
    
    
  });
}

run().catch(console.error);
