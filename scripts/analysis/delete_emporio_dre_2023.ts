import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query, where, deleteDoc, doc } from 'firebase/firestore';
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

  console.log(`\nQuerying client document for ID: ${clientId}`);

  const q = collection(db, 'clients');
  const snap = await getDocs(q);
  for (const d of snap.docs) {
    if (d.id === clientId) {
      const data = d.data();
      delete data.logo; // Remove base64 image
      console.log(`Found client doc: ID: ${d.id}, data: ${JSON.stringify(data, null, 2)}`);
    }
  }
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
