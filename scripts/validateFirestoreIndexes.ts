import * as fs from 'fs';
import * as path from 'path';

interface IndexField {
  fieldPath: string;
  order: 'ASCENDING' | 'DESCENDING';
}

interface FirestoreIndex {
  collectionGroup: string;
  queryScope: 'COLLECTION' | 'COLLECTION_GROUP';
  fields: IndexField[];
}

const REQUIRED_INDEXES: Omit<FirestoreIndex, 'queryScope'>[] = [
  {
    collectionGroup: 'financial_entries',
    fields: [
      { fieldPath: 'clientId', order: 'ASCENDING' },
      { fieldPath: 'createdAt', order: 'DESCENDING' }
    ]
  },
  {
    collectionGroup: 'account_plans',
    fields: [
      { fieldPath: 'clientId', order: 'ASCENDING' },
      { fieldPath: 'planType', order: 'ASCENDING' },
      { fieldPath: 'code', order: 'ASCENDING' }
    ]
  },
  {
    collectionGroup: 'payables',
    fields: [
      { fieldPath: 'clientId', order: 'ASCENDING' },
      { fieldPath: 'vencimento', order: 'ASCENDING' }
    ]
  },
  {
    collectionGroup: 'receivables',
    fields: [
      { fieldPath: 'clientId', order: 'ASCENDING' },
      { fieldPath: 'vencimento', order: 'ASCENDING' }
    ]
  },
  {
    collectionGroup: 'audit_events',
    fields: [
      { fieldPath: 'tenantId', order: 'ASCENDING' },
      { fieldPath: 'timestamp', order: 'DESCENDING' }
    ]
  },
  {
    collectionGroup: 'anomalies',
    fields: [
      { fieldPath: 'tenantId', order: 'ASCENDING' },
      { fieldPath: 'detectedAt', order: 'DESCENDING' }
    ]
  },
  {
    collectionGroup: 'institutional_jobs',
    fields: [
      { fieldPath: 'tenantId', order: 'ASCENDING' },
      { fieldPath: 'createdAt', order: 'DESCENDING' }
    ]
  },
  {
    collectionGroup: 'institutional_jobs',
    fields: [
      { fieldPath: 'tenantId', order: 'ASCENDING' },
      { fieldPath: 'jobType', order: 'ASCENDING' },
      { fieldPath: 'createdAt', order: 'DESCENDING' }
    ]
  },
  {
    collectionGroup: 'runtime_pressure',
    fields: [
      { fieldPath: 'tenantId', order: 'ASCENDING' },
      { fieldPath: 'detectedAt', order: 'DESCENDING' }
    ]
  }
];

function validateIndexes() {
  console.log('Starting Real Index & Query Validation...\n');

  const indexPath = path.resolve(process.cwd(), 'firestore.indexes.json');
  if (!fs.existsSync(indexPath)) {
    console.error(`❌ Error: Indexes file not found at ${indexPath}`);
    process.exit(1);
  }

  const indexData = JSON.parse(fs.readFileSync(indexPath, 'utf8'));
  const declaredIndexes: FirestoreIndex[] = indexData.indexes || [];

  let missingCount = 0;

  for (const req of REQUIRED_INDEXES) {
    const isDeclared = declaredIndexes.some(dec => {
      if (dec.collectionGroup !== req.collectionGroup) return false;
      if (dec.fields.length !== req.fields.length) return false;
      return dec.fields.every((f, idx) => {
        const reqF = req.fields[idx];
        return f.fieldPath === reqF.fieldPath && f.order === reqF.order;
      });
    });

    if (!isDeclared) {
      console.error(`❌ Missing Index: Collection Group "${req.collectionGroup}" needs composite index:`);
      console.error(`   Fields: ${JSON.stringify(req.fields)}`);
      missingCount++;
    } else {
      console.log(`✅ Valid Index: Collection Group "${req.collectionGroup}" fields ${JSON.stringify(req.fields.map(f => f.fieldPath))} is configured.`);
    }
  }

  console.log('\n--- Index Validation Summary ---');
  if (missingCount > 0) {
    console.error(`❌ Validation Failed: ${missingCount} composite indexes are missing from firestore.indexes.json.`);
    process.exit(1);
  } else {
    console.log('✅ Validation Success: All required composite indexes are declared correctly!');
  }
}

try {
  validateIndexes();
} catch (e: any) {
  console.error('❌ Index validation crashed:', e.message);
  process.exit(1);
}
