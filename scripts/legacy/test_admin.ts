import * as admin from 'firebase-admin';

process.env.FIREBASE_CONFIG = JSON.stringify({ projectId: 'gen-lang-client-0196971385' });

admin.initializeApp({
  credential: admin.credential.applicationDefault()
});

const db = admin.firestore();

async function run() {
  const snap = await db.collection('clients').limit(1).get();
  console.log(`Found ${snap.size} clients using application default credentials.`);
}

run().catch(console.error);
