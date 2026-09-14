import 'dotenv/config';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, limit, query } from 'firebase/firestore';
import * as fs from 'fs';
import * as path from 'path';

// Read firebase-applet-config.json
const configPath = path.resolve(process.cwd(), 'firebase-applet-config.json');
let firebaseConfigFromJson: any = {};
if (fs.existsSync(configPath)) {
  firebaseConfigFromJson = JSON.parse(fs.readFileSync(configPath, 'utf8'));
}

const firebaseConfig = {
  projectId: process.env.VITE_FIREBASE_PROJECT_ID || firebaseConfigFromJson.projectId,
  appId: process.env.VITE_FIREBASE_APP_ID || firebaseConfigFromJson.appId,
  apiKey: process.env.VITE_FIREBASE_API_KEY || firebaseConfigFromJson.apiKey,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN || firebaseConfigFromJson.authDomain,
  firestoreDatabaseId: process.env.VITE_FIREBASE_FIRESTORE_DATABASE_ID || firebaseConfigFromJson.firestoreDatabaseId || "(default)",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

const collectionsToCheck = [
  'modeling_inputs',
  'institutional_scenarios',
  'scenario_impacts',
  'cash_flows',
  'financial_entries',
  'account_plans'
];

async function checkData() {
  console.log('Checking Firestore Collections for Real Financial Data...\n');
  const results: Record<string, number> = {};
  
  for (const coll of collectionsToCheck) {
    try {
      const snapshot = await getDocs(query(collection(db, coll), limit(50)));
      results[coll] = snapshot.size;
      console.log(`Collection '${coll}': ${snapshot.size} documents found (sample limit 50).`);
    } catch (err: any) {
      console.log(`Collection '${coll}': Error reading - ${err.message}`);
    }
  }

  const hasData = Object.values(results).some(v => v > 0);
  console.log('\n--- Conclusion ---');
  if (!hasData) {
    console.log('NO HISTORICAL FINANCIAL DATA REQUIRING MIGRATION.');
  } else {
    console.log('HISTORICAL DATA EXISTS. Migration ETL required.');
  }
}

checkData().then(() => process.exit(0)).catch(err => {
  console.error(err);
  process.exit(1);
});
