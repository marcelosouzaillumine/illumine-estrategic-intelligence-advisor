const admin = require('firebase-admin');

admin.initializeApp({
  credential: admin.credential.applicationDefault()
});

const db = admin.firestore();

async function run() {
  try {
    console.log("Searching for client 'empório' or 'emporio'...");
    
    const clientsSnap = await db.collection('clients').get();
    let clientId = '';
    clientsSnap.forEach(d => {
      const data = d.data();
      const fantasia = (data.fantasia || '').toLowerCase();
      const razao = (data.razaoSocial || data.razao || '').toLowerCase();
      if (fantasia.includes('emporio') || fantasia.includes('empório') || razao.includes('emporio') || razao.includes('empório')) {
        clientId = d.id;
        console.log(`Found client: ID: ${d.id}, fantasia: ${data.fantasia}`);
      }
    });

    if (!clientId) {
      console.log("Could not find client containing 'emporio'");
      return;
    }

    console.log(`\nDeleting 2023 DRE data for client ID: ${clientId}`);

    const types = ['DRE', 'DRE Gerencial'];
    let deletedCount = 0;

    for (const t of types) {
      const q = db.collection('financial_entries')
        .where('clientId', '==', clientId)
        .where('type', '==', t)
        .where('year', '==', 2023);
      
      const snap = await q.get();
      for (const d of snap.docs) {
        const data = d.data();
        if (data.fileName) { // Ensure it's imported data, as the user said "arquivos importados"
            console.log(`Deleting doc ID: ${d.id} (type: ${t}, year: 2023, fileName: ${data.fileName})`);
            await db.collection('financial_entries').doc(d.id).delete();
            deletedCount++;
        } else {
            console.log(`Skipping doc ID: ${d.id} (type: ${t}, year: 2023) because it lacks a fileName (might be manual)`);
        }
      }
    }

    console.log(`\nDeleted ${deletedCount} documents.`);
  } catch(e) {
    console.error("Error:", e);
  }
}

run();
