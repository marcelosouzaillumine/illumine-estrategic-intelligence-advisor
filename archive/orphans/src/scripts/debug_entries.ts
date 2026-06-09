import { initializeApp } from 'firebase/app';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import * as fs from 'fs';
import * as path from 'path';
import { buildBPHierarchy, BPSummary } from '../lib/bpEngine';
import { calculateDreCascade } from '../lib/dreCascade';
import { calculateFinancialMetrics } from '../lib/financial-engine';
import { DRE_OFFICIAL_STRUCTURE } from '../constants/dreStructure';

const configPath = path.resolve(process.cwd(), 'firebase-applet-config.json');
const firebaseConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));
const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

const parseNumeric = (val: any): number => {
  if (typeof val === 'number') return val;
  if (!val) return 0;
  const cleaned = String(val).replace(/[R$\s]/g, '').replace(/\./g, '').replace(',', '.');
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
};

function calculateDreCascadeFixed(rows: any[]) {
  const result = [...rows].map(r => ({ 
    ...r, 
    computedValue: parseNumeric(r.value) || parseNumeric(r.val) || parseNumeric(r.valor) || 0 
  }));
  
  const getChildrenSum = (parentId: string) => {
    return result
      .filter(r => r.parentId === parentId)
      .reduce((sum, r) => sum + (parseNumeric(r.value) || parseNumeric(r.val) || parseNumeric(r.valor) || 0), 0);
  };

  const getVal = (id: string) => {
    const row = result.find(r => r.id === id || r.originalId === id);
    return row ? (row.computedValue !== undefined ? row.computedValue : row.value) : 0;
  };
  
  const getAbsVal = (id: string) => {
    return Math.abs(getVal(id) || 0);
  };

  const setVal = (id: string, val: number) => {
    const idx = result.findIndex(r => r.id === id || r.originalId === id);
    if (idx !== -1) {
      result[idx].computedValue = val;
    }
  };

  DRE_OFFICIAL_STRUCTURE.filter(a => a.tipo === 'SINTETICA').forEach(account => {
    setVal(account.id, getChildrenSum(account.id));
  });

  setVal('ROL', getVal('ROB') - getAbsVal('DED'));
  setVal('LUCRO_BRUTO', getVal('ROL') - getAbsVal('CUSTOS'));
  setVal('EBITDA', getVal('LUCRO_BRUTO') - getAbsVal('DESP_OPER'));
  setVal('EBIT', getVal('EBITDA') - getAbsVal('DEP_AMORT'));
  setVal('RAIR_CSLL', getVal('EBIT') + getVal('RESULT_FIN') + getVal('OUTRAS_REC_DESP'));
  setVal('LUCRO_LIQ', getVal('RAIR_CSLL') - getAbsVal('PROV_IR_CSLL'));

  return result;
}

function buildHistoricalSeriesFixed(clientId: string, allEntries: any[]) {
  const yearGroups: Record<number, any[]> = {};
  allEntries.forEach(entry => {
    if (entry.year && typeof entry.year === 'number') {
      if (!yearGroups[entry.year]) {
        yearGroups[entry.year] = [];
      }
      yearGroups[entry.year].push(entry);
    }
  });

  const years = Object.keys(yearGroups).map(Number).sort((a, b) => a - b);
  const series: any[] = [];

  years.forEach(year => {
    const yearEntries = yearGroups[year];
    
    // BP Data
    const bpEntries = yearEntries.filter(e => 
      e.type === 'Balanço Patrimonial' || e.type === 'BP' || e.tipo === 'Balanço Patrimonial' || e.tipo === 'BP' ||
      e.docType === 'Balanço Patrimonial' || e.docType === 'BP'
    ).map(e => ({
      ...e,
      type: e.entryType || e.type || e.tipo
    }));
    
    // DRE Data
    const dreEntries = yearEntries.filter(e => 
      e.type === 'DRE' || e.tipo === 'DRE' || e.docType === 'DRE'
    ).map(e => ({
      ...e,
      type: e.entryType || e.type || e.tipo
    }));

    let bpSummary: BPSummary = {} as BPSummary;
    if (bpEntries.length > 0) {
      const { summary } = buildBPHierarchy(bpEntries);
      bpSummary = summary;
    } else {
      bpSummary = {
        ativoCirculante: 0,
        passivoCirculante: 0,
        patrimonioLiquido: 0,
        estoques: 0,
        passivosFinanceiros: 0,
        ativoTotal: 0,
        ativoNaoCirculante: 0,
        caixaEquivalentes: 0,
        clientes: 0,
        passivoTotal: 0,
        passivoNaoCirculante: 0,
        fornecedores: 0,
        capitalSocial: 0,
        lucrosPrejuizos: 0,
        altaConversibilidade: 0,
        mediaConversibilidade: 0,
        baixaConversibilidade: 0,
        restritaConversibilidade: 0,
        creditosSocios: 0,
        salariosEncargos: 0
      } as any as BPSummary;
    }

    let ebitda = 0;
    let lucroLiquido = 0;
    
    if (dreEntries.length > 0) {
      const cascade = calculateDreCascadeFixed(dreEntries);
      ebitda = cascade.find(r => r.id === 'EBITDA' || r.originalId === 'EBITDA')?.computedValue || 0;
      lucroLiquido = cascade.find(r => r.id === 'LUCRO_LIQ' || r.originalId === 'LUCRO_LIQ')?.computedValue || 0;
    }

    if (bpEntries.length > 0 || dreEntries.length > 0) {
      const metrics = calculateFinancialMetrics(bpSummary, ebitda, lucroLiquido, 'Geral');
      series.push({
        year,
        bp: bpSummary,
        metrics
      });
    }
  });

  return {
    companyId: clientId,
    periods: series.map(s => s.year),
    series
  };
}

async function run() {
  const clientId = 'gcd1P7yKlPT10PLRs7WJ';
  const q = query(
    collection(db, 'financial_entries'),
    where('clientId', '==', clientId)
  );
  
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
          originalId: entry.id, // PRESERVE ORIGINAL ID!
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
        originalId: docData.id, // PRESERVE ORIGINAL ID!
        ...docData,
        conta: docData.category,
        valor: docData.value,
        val: docData.value
      });
    }
  });

  console.log(`Parsed ${allEntries.length} entries.`);

  try {
    console.log("Calling buildHistoricalSeriesFixed...");
    const series = buildHistoricalSeriesFixed(clientId, allEntries);
    console.log(`Historical series built with ${series.series.length} periods.`);
    series.series.forEach(p => {
      
    });
  } catch (err: any) {
    console.error("Error in buildHistoricalSeriesFixed:", err);
  }

  process.exit(0);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
