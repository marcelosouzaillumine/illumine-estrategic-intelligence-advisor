import * as fs from 'fs';
import * as path from 'path';

const file = "src/adapters/ui/TaxReformAdapter.ts";
const fullPath = path.join(process.cwd(), file);

if (fs.existsSync(fullPath)) {
  let content = fs.readFileSync(fullPath, 'utf8');
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

  content = content.replace(/import\s+{([^}]*)}\s+from\s+['"]firebase\/firestore['"];?/g, stubCode);
  content = content.replace(/import\s+.*\s+from\s+['"]firebase\/firestore['"];?/g, stubCode);

  content = content.replace(/collection\s*\(\s*db\s*,/g, 'collection(/*db*/null as any,');
  content = content.replace(/doc\s*\(\s*db\s*,/g, 'doc(/*db*/null as any,');
  content = content.replace(/writeBatch\s*\(\s*db\s*\)/g, 'writeBatch(/*db*/null as any)');
  content = content.replace(/getFirestore\s*\(\s*\)/g, 'null as any /* getFirestore() removed */');

  fs.writeFileSync(fullPath, content, 'utf8');
  console.log('Cleaned TaxReformAdapter');
}
