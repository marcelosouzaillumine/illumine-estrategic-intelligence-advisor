import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';
import * as fs from 'fs';

const firebaseConfig = JSON.parse(fs.readFileSync('./firebase-applet-config.json', 'utf8'));

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function run() {
  console.log("Searching for client 'empório' or 'emporio'...");
  
  const clientsSnap = await getDocs(collection(db, 'clients'));
  let clientId = '';
  clientsSnap.forEach(d => {
    const data = d.data();
    if (data.fantasia?.toLowerCase().includes('emporio') || data.fantasia?.toLowerCase().includes('empório') || data.razaoSocial?.toLowerCase().includes('emporio') || data.razaoSocial?.toLowerCase().includes('empório')) {
      clientId = d.id;
      console.log(`Found client: ID: ${d.id}, fantasia: ${data.fantasia}, razaoSocial: ${data.razaoSocial}`);
    }
  });

  if (!clientId) {
    console.log("Could not find client containing 'emporio'");
    return;
  }

  console.log(`\nQuerying 2023 DRE data for client ID: ${clientId}`);

  const types = ['DRE', 'DRE Gerencial'];

  for (const t of types) {
    const q = query(
      collection(db, 'financial_entries'),
      where('clientId', '==', clientId),
      where('type', '==', t),
      where('year', '==', 2023)
    );
    const snap = await getDocs(q);
    console.log(`Found ${snap.size} documents for type ${t}`);
    for (const d of snap.docs) {
      const data = d.data();
      console.log(`ID: ${d.id}, type: ${t}, year: ${data.year}, month: ${data.month}, fileName: ${data.fileName}`);
    }
  }
}

run().catch(console.error);
