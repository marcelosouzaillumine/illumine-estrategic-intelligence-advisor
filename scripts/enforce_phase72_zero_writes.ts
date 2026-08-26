import fs from 'fs';
import path from 'path';
import { globSync } from 'glob';

const WRITE_FUNCTIONS = ['addDoc', 'setDoc', 'updateDoc', 'deleteDoc', 'writeBatch', 'runTransaction'];
const IGNORED_DIRS = ['scripts', 'tests', 'supabase'];

function enforceZeroWrites() {
  const files = globSync('src/**/*.{ts,tsx,js,jsx}');
  
  let modifiedCount = 0;

  files.forEach(file => {
    if (IGNORED_DIRS.some(dir => file.includes(`src/${dir}/`))) return;

    let content = fs.readFileSync(file, 'utf-8');
    let hasChanges = false;

    // Check if it imports from firebase/firestore
    if (!content.includes('firebase/firestore')) return;

    WRITE_FUNCTIONS.forEach(fn => {
      // Very naive regex to replace the function calls
      // e.g., await addDoc(...) -> throw new Error("Phase 7.2 Architecture Violation: Firestore Writes are BLOCKED.")
      const regexStr = `(await\\s+)?${fn}\\s*\\(`;
      const regex = new RegExp(regexStr, 'g');
      
      if (regex.test(content)) {
        content = content.replace(regex, `(()=>{throw new Error("Phase 7.2 Architecture Violation: Firestore Writes are BLOCKED. Migrated to PostgreSQL.");})(); // ${fn}(`);
        hasChanges = true;
      }
    });

    if (hasChanges) {
      fs.writeFileSync(file, content, 'utf-8');
      console.log(`[BLOCKED] Writes disabled in: ${file}`);
      modifiedCount++;
    }
  });

  console.log(`\nComplete. Modified ${modifiedCount} files to block legacy writes.`);
}

enforceZeroWrites();
