import { getFirestore, collection, getDocs, doc, setDoc } from 'firebase/firestore';
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

const tenantMap = new Map<string, string>(); // legacy_id -> uuid

async function migrateTenants() {
  console.log('Migrating tenants to tenant.tenants...');
  // Since we don't have a tenants collection in Firestore mapped in this script context, 
  // we will discover tenants from financial_entries, account_plans, and cash_flows.
  const tenantIds = new Set<string>();

  const [snapEntries, snapAccounts, snapCashFlows] = await Promise.all([
    getDocs(collection(db, 'financial_entries')),
    getDocs(collection(db, 'account_plans')),
    getDocs(collection(db, 'cash_flows'))
  ]);

  const addTenantId = (doc: any) => {
    const data = doc.data();
    const tId = data.clientId || data.tenantId;
    if (tId) tenantIds.add(tId);
  };

  snapEntries.docs.forEach(addTenantId);
  snapAccounts.docs.forEach(addTenantId);
  snapCashFlows.docs.forEach(addTenantId);

  for (const legacyId of tenantIds) {
    let tenantId;
    const { data: existing } = await supabase.schema('tenant').from('tenants').select('id').eq('legacy_id', legacyId).single();
    
    if (existing) {
      tenantId = existing.id;
    } else {
      const canonicalId = crypto.randomUUID();
      const payload = {
        id: canonicalId,
        name: `Migrated Tenant (${legacyId})`,
        legacy_source: 'FIRESTORE',
        legacy_id: legacyId
      };
      
      const { data, error } = await supabase.schema('tenant').from('tenants').insert(payload).select('id').single();
      if (error) {
        console.error(`Error migrating tenant ${legacyId}:`, error.message);
        continue;
      }
      tenantId = data.id;
    }
    
    tenantMap.set(legacyId, tenantId);
    console.log(`Tenant ${legacyId} -> ${tenantId}`);
  }
}

function resolveTenantId(docData: any): string {
  const tId = docData.clientId || docData.tenantId;
  if (!tId) {
    return '00000000-0000-0000-0000-000000000000'; // System Tenant ID from seed
  }
  return tenantMap.get(tId) || tId; // Fallback to raw string, though it will fail if not a UUID
}

async function migrateAccountPlans() {
  console.log('Migrating account_plans to finance.legacy_account_plans...');
  const snap = await getDocs(collection(db, 'account_plans'));
  
  for (const doc of snap.docs) {
    const data = doc.data();
    
    const payload = {
      id: crypto.randomUUID(),
      company_id: resolveTenantId(data),
      legacy_source: 'FIRESTORE',
      legacy_id: doc.id,
      payload: data
    };

    const { error } = await supabase.schema('finance').from('legacy_account_plans').upsert(payload, { onConflict: 'legacy_id' });
    if (error) {
      console.error(`Error migrating account ${doc.id}:`, error.message);
    } else {
      console.log(`Successfully migrated account: ${doc.id}`);
    }
  }
}

async function migrateFinancialEntries() {
  console.log('Migrating financial_entries to finance.legacy_financial_entries...');
  const snap = await getDocs(collection(db, 'financial_entries'));
  
  for (const doc of snap.docs) {
    const data = doc.data();
    
    const payload = {
      id: crypto.randomUUID(),
      company_id: resolveTenantId(data),
      legacy_source: 'FIRESTORE',
      legacy_id: doc.id,
      payload: data
    };

    const { error: entryError } = await supabase.schema('finance').from('legacy_financial_entries').upsert(payload, { onConflict: 'legacy_id' });
    if (entryError) {
       console.error(`Error migrating entry ${doc.id}:`, entryError.message);
    } else {
       console.log(`Successfully migrated entry: ${doc.id}`);
    }
  }
}

async function migrateCashFlows() {
  console.log('Migrating cash_flows to finance.legacy_cash_flows...');
  const snap = await getDocs(collection(db, 'cash_flows'));
  
  for (const doc of snap.docs) {
    const data = doc.data();
    
    const payload = {
      id: crypto.randomUUID(),
      company_id: resolveTenantId(data),
      owner_id: data.ownerId || null, // Might need mapping if ownerId is not UUID
      legacy_source: 'FIRESTORE',
      legacy_id: doc.id,
      payload: data
    };
    
    // ownerId might not be a UUID in Firestore either! We will just set it to null for now if it's not a UUID.
    if (payload.owner_id && !payload.owner_id.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
      payload.owner_id = null;
    }

    const { error } = await supabase.schema('finance').from('legacy_cash_flows').upsert(payload, { onConflict: 'legacy_id' });
    if (error) {
      console.error(`Error migrating cash_flow ${doc.id}:`, error.message);
    } else {
      console.log(`Successfully migrated cash_flow: ${doc.id}`);
    }
  }
}

async function run() {
  console.log('--- STARTING PHASE 6I ETL ---');
  await migrateTenants();
  await migrateAccountPlans();
  await migrateFinancialEntries();
  await migrateCashFlows();
  console.log('--- ETL COMPLETE ---');
}

run().catch(console.error);
