import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';
import * as fs from 'fs';
import { CapitalGovernanceAdapter } from '../capabilities/financial/runtime/capital-governance/capital-governance-adapter';

const firebaseConfig = JSON.parse(fs.readFileSync('./firebase-applet-config.json', 'utf8'));
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function run() {
  const clientId = 'gcd1P7yKlPT10PLRs7WJ';
  const filterYear = 2022;

  // 1. Fetch DRE entries
  const qAll = query(collection(db, 'financial_entries'), where('clientId', '==', clientId));
  const snapAll = await getDocs(qAll);
  
  const allHistoryData: any[] = [];
  snapAll.docs.forEach(doc => {
    const docData = doc.data() as any;
    if (docData.status === 'rejected' || docData.status === 'archived') return;

    if (Array.isArray(docData.data)) {
      let lastType = 'ativo';
      docData.data.forEach((entry: any) => {
        const innerType = entry.type || entry.tipo || lastType;
        lastType = innerType;
        allHistoryData.push({
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
      allHistoryData.push({
        id: doc.id,
        ...docData,
        conta: docData.category,
        valor: docData.value,
        val: docData.value
      });
    }
  });

  const q2022 = query(
    collection(db, 'financial_entries'),
    where('clientId', '==', clientId),
    where('year', '==', filterYear),
    where('type', '==', 'DLPA')
  );
  
  const snap2022 = await getDocs(q2022);
  const dbDataDLPA: any[] = [];
  snap2022.docs.forEach(doc => {
    const docData = doc.data() as any;
    if (docData.status === 'rejected' || docData.status === 'archived') return;
    if (Array.isArray(docData.data)) {
      docData.data.forEach((entry: any) => {
        dbDataDLPA.push({
          ...entry,
          id: `${doc.id}_${entry.category}`,
          conta: entry.category,
          valor: entry.value,
          val: entry.value
        });
      });
    }
  });

  console.log(`Loaded ${dbDataDLPA.length} DLPA entries for 2022`);
  console.log(`Loaded ${allHistoryData.length} entries for all history`);

  // Compute DLPA metrics manually to match DLPAPage
  const normalize = (s: string) =>
    (s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  const bpEntries = allHistoryData.filter((d: any) =>
    Number(d.year) === filterYear &&
    ['bp', 'balanço patrimonial', 'balanco patrimonial', 'balanco'].includes(normalize(d.docType || d.type || ''))
  );

  let bpPlFim = 0;
  if (bpEntries.length > 0) {
    const plEntry = bpEntries.find((e: any) => {
      const n = normalize(e.conta || e.category || '');
      return (n === 'patrimonio liquido' || n === 'pl' || n === 'total do patrimonio liquido') && e.type === 'pl';
    });
    if (plEntry) {
      bpPlFim = Number(plEntry.val || plEntry.valor || plEntry.value || 0);
    }
  }

  const bpEntriesPrev = allHistoryData.filter((d: any) =>
    Number(d.year) === (filterYear - 1) &&
    ['bp', 'balanço patrimonial', 'balanco patrimonial', 'balanco'].includes(normalize(d.docType || d.type || ''))
  );

  let bpPlInicio = 0;
  if (bpEntriesPrev.length > 0) {
    const plEntry = bpEntriesPrev.find((e: any) => {
      const n = normalize(e.conta || e.category || '');
      return (n === 'patrimonio liquido' || n === 'pl' || n === 'total do patrimonio liquido') && e.type === 'pl';
    });
    if (plEntry) {
      bpPlInicio = Number(plEntry.val || plEntry.valor || plEntry.value || 0);
    }
  }

  const findVal = (...terms: string[]) => {
    const entry = dbDataDLPA.find((e: any) => {
      const n = normalize(e.conta || e.category || '');
      return terms.some(t => n.includes(normalize(t)));
    });
    return Number(entry?.val || entry?.valor || entry?.value || 0);
  };

  const getNetIncomeValue = () => {
    const entry = dbDataDLPA.find((e: any) => {
      const n = normalize(e.conta || e.category || '');
      if (n.includes('acumulado') || n.includes('saldo inicial') || n.includes('saldo final') || n.includes('saldo anterior') || n.includes('periodo anterior') || n.includes('inicio') || n.includes('fim')) {
        return false;
      }
      return [
        'lucro liquido', 'lucro do exercicio', 'resultado liquido',
        'prejuizo liquido', 'prejuizo do exercicio', 'prejuizo liquido do exercicio',
        'resultado do exercicio', 'resultado liquido do exercicio', 'prejuizo do periodo', 'lucro do periodo',
        'lucro/prejuizo do exercicio', 'lucro ou prejuizo do exercicio'
      ].some(term => n.includes(normalize(term))) || (n.includes('lucro') || n.includes('prejuizo') || n.includes('resultado do exercicio'));
    });
    if (!entry) return 0;
    let val = Number(entry.val ?? entry.valor ?? entry.value ?? 0);
    const n = normalize(entry.conta || entry.category || '');
    if ((n.includes('prejuizo') || n.includes('(-)')) && val > 0) {
      val = -val;
    }
    return val;
  };

  const getPlInicioValue = () => {
    if (bpPlInicio > 0) return bpPlInicio;
    
    const entry = dbDataDLPA.find((e: any) => {
      const n = normalize(e.conta || e.category || '');
      const isSubAccount = n.includes('lucro') || n.includes('prejuizo') || n.includes('reserva');
      if (isSubAccount) return false;
      
      return [
        'pl inicio', 'saldo inicial', 'patrimonio inicio',
        'saldo no inicio', 'saldo anterior', 'saldo no inicio do periodo',
        'saldo de abertura'
      ].some(term => n.includes(normalize(term))) || (n.includes('saldo') && n.includes('inicio'));
    });
    return Number(entry?.val || entry?.valor || entry?.value || 0);
  };

  const getPlFimValue = () => {
    if (bpPlFim > 0) return bpPlFim;

    const entry = dbDataDLPA.find((e: any) => {
      const n = normalize(e.conta || e.category || '');
      const isSubAccount = n.includes('lucro') || n.includes('prejuizo') || n.includes('reserva');
      if (isSubAccount) return false;

      return [
        'pl fim', 'saldo final', 'patrimonio fim', 'patrimonio liquido',
        'saldo no fim', 'saldo atual', 'saldo no fim do periodo',
        'saldo de encerramento'
      ].some(term => n.includes(normalize(term))) || (n.includes('saldo') && n.includes('fim'));
    });

    return Number(entry?.val || entry?.valor || entry?.value || 0);
  };

  const lucroLiquido = getNetIncomeValue();
  const dividendos = Math.abs(findVal('dividendo', 'distribuicao', 'jcp', 'juros sobre capital'));
  const plInicio = getPlInicioValue();
  const plFim = getPlFimValue();
  const aumentoCapital = findVal('aumento de capital', 'integralizacao');

  const retainedEarnings = plFim > 0 ? plFim - (plInicio || plFim) : lucroLiquido - dividendos;

  const financialRuntimeContext = {
    lifecycle: {
      analysisYear: 2022,
      foundationYear: 2020
    },
    lifecycleProfile: {
      lifecycleStage: 'INITIAL_CAPITALIZATION',
      governanceStatus: { semanticLabel: 'Governança em Estruturação' },
      capitalStatus: { semanticLabel: 'Capitalização em Consolidação' },
      allowedLabels: ['Governança em Estruturação', 'Capitalização em Consolidação'],
      forbiddenLabels: []
    },
    contextualConfidence: 'HIGH' as const,
    interpretationWarnings: [] as string[],
    requiredDisclosures: [] as string[],
    auditTrail: [] as string[]
  };

  const result = CapitalGovernanceAdapter.process(
    dbDataDLPA,
    lucroLiquido,
    retainedEarnings,
    dividendos,
    plInicio || plFim,
    plFim,
    aumentoCapital,
    financialRuntimeContext,
    allHistoryData
  );

  console.log('\n======================================');
  console.log('ADAPTER RESULT FOR GRANATUM 2022:');
  console.log('======================================');
  console.log('lucroLiquido:', lucroLiquido);
  console.log('retainedEarnings:', retainedEarnings);
  console.log('plInicio:', plInicio);
  console.log('plFim:', plFim);
  console.log('Horizon:', JSON.stringify(result.executiveLayer?.patrimonialRecoveryHorizon, null, 2));
  console.log('Recoverability:', JSON.stringify(result.executiveLayer?.capitalRecoverability, null, 2));
  console.log('CPS:', JSON.stringify(result.executiveLayer?.capitalPreservationScore, null, 2));
  console.log('Radar Status:', result.resolvedCapitalStatus);
}

run().catch(console.error);
