import * as fs from 'fs';

const uiFiles = [
  'src/components/pages/legacy-archive/PayablesPage.tsx',
  'src/components/pages/legacy-archive/ReceivablesPage.tsx',
  'src/components/pages/PayablesPage.tsx',
  'src/components/pages/ReceivablesPage.tsx',
  'src/components/pages/PlanoDeContasPage.tsx',
  'src/adapters/ui/TaxReformAdapter.ts'
];

for (const file of uiFiles) {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf-8');
    // Replace firestore imports
    content = content.replace(/import\s+{.*}\s+from\s+['"]firebase\/firestore['"];?/g, '');
    
    // Replace the firestore usage inside useEffect or functions with Phase 7 dummy.
    // For simplicity, we just declare dummy functions at the top if they are used.
    const dummy = `
// Dummy functions added during Phase 6 migration to satisfy TS. Phase 7 will migrate these.
const query = (...args: any[]) => null as any;
const collection = (...args: any[]) => null as any;
const where = (...args: any[]) => null as any;
const onSnapshot = (...args: any[]) => { return () => {}; };
const orderBy = (...args: any[]) => null as any;
const db = null as any;
`;
    if (!content.includes('const query =')) {
      content = content.replace(/(import .*;\n)+/g, match => match + dummy);
    }
    fs.writeFileSync(file, content);
  }
}
