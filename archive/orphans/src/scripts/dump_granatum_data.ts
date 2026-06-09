import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';
import * as fs from 'fs';

const firebaseConfig = JSON.parse(fs.readFileSync('./firebase-applet-config.json', 'utf8'));
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function run() {
  const clientId = 'gcd1P7yKlPT10PLRs7WJ';
  const q = query(
    collection(db, 'financial_entries'),
    where('clientId', '==', clientId)
  );
  
  const snap = await getDocs(q);
  snap.docs.forEach((doc) => {
    const item = doc.data();
    if (item.type === 'DRE' || item.docType === 'DRE') {
      const dataArray = item.data || [];
      dataArray.forEach((subItem: any) => {
        const value = Number(subItem.value || subItem.val || 0);
        if (value !== 0) {
          const category = subItem.category || subItem.conta || '—';
          
        }
      });
    }
  });
}

run().catch(console.error);
