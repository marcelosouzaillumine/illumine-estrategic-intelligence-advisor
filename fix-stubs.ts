import * as fs from 'fs';
import * as path from 'path';

function walk(dir: string, fileCallback: (filePath: string) => void) {
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      walk(filePath, fileCallback);
    } else {
      if (filePath.endsWith('.ts') || filePath.endsWith('.tsx')) {
        fileCallback(filePath);
      }
    }
  });
}

const stubLines = [
  "const collection: any = (...args: any[]) => ({});",
  "const doc: any = (...args: any[]) => ({});",
  "const getDocs: any = async (...args: any[]) => ({ docs: [], forEach: () => {}, size: 0 });",
  "const getDoc: any = async (...args: any[]) => ({ exists: () => false, data: () => ({}) });",
  "const setDoc: any = async (...args: any[]) => {};",
  "const addDoc: any = async (...args: any[]) => ({ id: 'stub' });",
  "const updateDoc: any = async (...args: any[]) => {};",
  "const deleteDoc: any = async (...args: any[]) => {};",
  "const query: any = (...args: any[]) => ({});",
  "const where: any = (...args: any[]) => ({});",
  "const orderBy: any = (...args: any[]) => ({});",
  "const limit: any = (...args: any[]) => ({});",
  "const onSnapshot: any = (...args: any[]) => (() => {});",
  "const serverTimestamp: any = () => ({});",
  "const writeBatch: any = (...args: any[]) => ({ set: () => {}, update: () => {}, delete: () => {}, commit: async () => {} });",
  "const increment: any = (...args: any[]) => ({});",
  "const Timestamp: any = { now: () => ({ toMillis: () => 0 }), fromDate: () => ({}) };",
  "const getFirestore = () => ({}) as any;",
  "const db = {} as any;",
  "// Firestore Stubs for Legacy Migration Closure",
  "import { db as firebaseDb } from '../../config/firebase';",
  "import { db as firebaseDb } from '../../../config/firebase';",
  "import { db as firebaseDb } from '../config/firebase';"
];

walk('src', (filePath) => {
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;
  
  const lines = content.split('\n');
  const newLines = lines.filter(line => !stubLines.includes(line.trim()));
  
  if (lines.length !== newLines.length) {
    fs.writeFileSync(filePath, newLines.join('\n'), 'utf8');
    console.log('Cleaned stubs in', filePath);
  }
});
