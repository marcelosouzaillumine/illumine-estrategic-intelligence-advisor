import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import fs from 'fs';

initializeApp();
const db = getFirestore();

async function run() {
  const snapshot = await db.collection('financial_entries')
    .orderBy('createdAt', 'desc')
    .limit(10)
    .get();
  
  snapshot.forEach(doc => {
    const data = doc.data();
    console.log(`Doc ID: ${doc.id}`);
    console.log(`Type: ${data.type}`);
    console.log(`Year: ${data.year}`);
    console.log(`Status: ${data.status}`);
    const rows = data.data || [];
    console.log(`Rows: ${rows.length}`);
    if (rows.length > 0) {
      console.log(`First row:`, rows[0]);
    }
    console.log('---');
  });
}

run().catch(console.error);
