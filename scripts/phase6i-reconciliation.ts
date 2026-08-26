import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';
import { getSupabaseClient } from '../src/infrastructure/supabase/SupabaseClient';
import { initializeApp } from 'firebase/app';
import * as fs from 'fs';
import * as path from 'path';

// Load real Firebase configuration
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
const supabase = getSupabaseClient();

const RESULTS = {
  MATCH: 0,
  MISMATCH: 0,
  MISSING_SOURCE: 0,
  MISSING_TARGET: 0,
  NOT_MAPPABLE: 0
};

async function reconcileCollection(fsCollection: string, pgTable: string) {
  console.log(`--- RECONCILIATION: ${fsCollection} -> ${pgTable} ---`);
  const snap = await getDocs(collection(db, fsCollection));
  const fsCount = snap.docs.length;
  
  const { count: pgCount, error: pgError } = await supabase.schema('finance')
    .from(pgTable)
    .select('*', { count: 'exact', head: true })
    .eq('legacy_source', 'FIRESTORE');

  console.log(`Firestore ${fsCollection} count: ${fsCount}`);
  console.log(`PostgreSQL ${pgTable} count:  ${pgCount}`);

  if (fsCount === pgCount) {
    console.log('✅ CARDINALITY MATCH');
    RESULTS.MATCH++;
  } else {
    console.error('❌ CARDINALITY MISMATCH');
    RESULTS.MISMATCH++;
  }
}

async function run() {
  console.log('--- STARTING PHASE 6I RECONCILIATION ---');
  await reconcileCollection('financial_entries', 'legacy_financial_entries');
  await reconcileCollection('account_plans', 'legacy_account_plans');
  await reconcileCollection('cash_flows', 'legacy_cash_flows');
  
  console.log('--- RECONCILIATION SUMMARY ---');
  console.log(RESULTS);
  
  if (RESULTS.MISMATCH > 0 || RESULTS.MISSING_TARGET > 0) {
    console.error('⚠️ STOP CONDITION MET: Mismatches found. Do not cutover.');
    process.exit(1);
  } else {
    console.log('✅ ALL TESTS PASSED: Ready for Cutover.');
    process.exit(0);
  }
}

run().catch(console.error);
