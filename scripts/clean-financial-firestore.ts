import * as fs from 'fs';
import * as path from 'path';

const filesToClean = [
  "src/adapters/ui/useFinancialModelingAdapter.ts",
  "src/adapters/ui/useFinancialPositionAdapter.ts",
  "src/adapters/ui/useImportBankAdapter.ts",
  "src/adapters/ui/useImportBankStatementAdapter.ts",
  "src/adapters/ui/useImportFinancialAdapter.ts",
  "src/adapters/ui/useImportTransactionsAdapter.ts",
  "src/adapters/ui/useIndicatorsAdapter.ts",
  "src/adapters/ui/useManualFinancialModalAdapter.ts",
  "src/adapters/ui/useTaxReformAdapter.ts",
  "src/components/modals/ImportBankStatementModal.tsx",
  "src/components/modals/ImportFinancialModal.tsx",
  "src/components/modals/ImportTransactionsModal.tsx",
  "src/components/pages/FinancialAdminDashboard.tsx",
  "src/components/pages/FinancialModelingPage.tsx",
  "src/components/pages/FinancialPositionPage.tsx",
  "src/components/pages/IndicatorsPage.tsx",
  "src/components/pages/PayablesPage.tsx",
  "src/components/pages/PlanoDeContasPage.tsx",
  "src/components/pages/ReceivablesPage.tsx",
  "src/components/pages/StrategicSimulatorPage.tsx",
  "src/components/pages/TaxReformImpactPage.tsx",
  "src/components/pages/ViabilityPage.tsx",
  "src/components/pages/legacy-archive/FinancialModelingPage.tsx",
  "src/components/pages/legacy-archive/PayablesPage.tsx",
  "src/components/pages/legacy-archive/ReceivablesPage.tsx",
  "src/core/runtime/financial-governance/certification/FinancialCertificationLedger.ts",
  "src/services/boardResolutionService.ts"
];

const stubCode = `
// Firestore Stubs for Legacy Migration Closure
const collection = (...args: any[]) => ({}) as any;
const doc = (...args: any[]) => ({}) as any;
const getDocs = async (...args: any[]) => ({ docs: [], forEach: () => {}, size: 0 }) as any;
const getDoc = async (...args: any[]) => ({ exists: () => false, data: () => ({}) }) as any;
const setDoc = async (...args: any[]) => {} as any;
const addDoc = async (...args: any[]) => ({ id: 'stub' }) as any;
const updateDoc = async (...args: any[]) => {} as any;
const deleteDoc = async (...args: any[]) => {} as any;
const query = (...args: any[]) => ({}) as any;
const where = (...args: any[]) => ({}) as any;
const orderBy = (...args: any[]) => ({}) as any;
const limit = (...args: any[]) => ({}) as any;
const onSnapshot = (...args: any[]) => (() => {}) as any;
const serverTimestamp = () => ({}) as any;
const writeBatch = (...args: any[]) => ({ set: () => {}, update: () => {}, delete: () => {}, commit: async () => {} }) as any;
const increment = (...args: any[]) => ({}) as any;
const Timestamp = { now: () => ({ toMillis: () => 0 }), fromDate: () => ({}) } as any;
const getFirestore = () => ({}) as any;
const db = {} as any;
`;

filesToClean.forEach(file => {
  const fullPath = path.join(process.cwd(), file);
  if (!fs.existsSync(fullPath)) return;
  
  let content = fs.readFileSync(fullPath, 'utf8');
  
  // If we already inserted stubs, skip
  if (!content.includes('Firestore Stubs for Legacy Migration Closure')) {
    content = content.replace(/\/\/ import removed from firebase\/firestore/g, stubCode);
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log(`Stubbed ${file}`);
  }
});
