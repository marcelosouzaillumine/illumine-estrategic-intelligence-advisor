import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';
import * as fs from 'fs';
import { runInstitutionalAnalysis } from '../runtime';
import { setupRuntimeAdapters } from '../runtime/adapters/setup';

setupRuntimeAdapters();

const firebaseConfig = JSON.parse(fs.readFileSync('./firebase-applet-config.json', 'utf8'));
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function run() {
  const clientId = 'gcd1P7yKlPT10PLRs7WJ'; // Granatum Ingredients
  const filterYear = 2022;

  // Load all history data exactly like useAllFinancialData
  const q = query(collection(db, 'financial_entries'), where('clientId', '==', clientId));
  const snap = await getDocs(q);
  const allEntries: any[] = [];
  snap.docs.forEach(doc => {
    const docData = doc.data() as any;
    if (docData.status === 'rejected' || docData.status === 'archived') return;

    if (Array.isArray(docData.data)) {
      let lastType = 'ativo';
      docData.data.forEach((entry: any) => {
        const innerType = entry.type || entry.tipo || lastType;
        lastType = innerType;
        allEntries.push({
          ...entry,
          id: `${doc.id}_${entry.category}`,
          clientId: docData.clientId,
          type: docData.type,
          docType: docData.type,
          entryType: innerType.toLowerCase(),
          ano: docData.year,
          year: docData.year,
          mes: docData.month,
          month: docData.month,
          conta: entry.category,
          valor: entry.value,
          val: entry.value
        });
      });
    } else {
      allEntries.push({
        id: doc.id,
        ...docData,
        conta: docData.category,
        valor: docData.value,
        val: docData.value
      });
    }
  });

  console.log(`Loaded ${allEntries.length} entries for runtime execution.`);

  const input = {
    clientId,
    dreData: allEntries,
    rawFinancialData: {
      filterYear,
      allHistoryData: allEntries
    }
  };

  const output = await runInstitutionalAnalysis(input as any);
  console.log('\n======================================');
  console.log('RUNNING ANALYSIS COMPLETED');
  console.log('======================================');
  console.log('Status:', output.status);
  console.log('Global Confidence:', output.globalConfidence);
  console.log('Executed Engines:', Object.keys(output.inferences));
  console.log('Violations Count:', output.violations.length);
  output.violations.forEach((v, i) => {
    console.log(`Violation ${i+1}: Engine=${v.sourceEngine}, Rule=${v.rule}, Severity=${v.severity}, Message="${v.message}"`);
  });

  const dfcInf = output.inferences['LegacyDFCAdapter'];
  console.log('\nDFC Inference Found:', !!dfcInf);
  if (dfcInf) {
    console.log('DFC Metrics:', JSON.stringify(dfcInf.metrics, null, 2));
  }
}

run().catch(console.error);
