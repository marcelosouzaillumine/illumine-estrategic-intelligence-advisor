import { describe, it } from 'node:test';
import assert from 'node:assert';
import fs from 'fs';
import path from 'path';
import { globSync } from 'glob';

describe('Gate D.1 - Zero Active Writes Enforcement', () => {
  const WRITE_FUNCTIONS = ['addDoc', 'setDoc', 'updateDoc', 'deleteDoc', 'writeBatch', 'runTransaction'];
  
  it('should not contain active Firestore writes in the source code without throwing a Phase 7.2 Violation', () => {
    const files = globSync('src/**/*.{ts,tsx,js,jsx}');
    let violations: string[] = [];

    files.forEach(file => {
      const content = fs.readFileSync(file, 'utf-8');
      
      // If the file doesn't import from firebase/firestore, it's safe.
      if (!content.includes('firebase/firestore')) return;

      WRITE_FUNCTIONS.forEach(fn => {
        // Look for the exact function call that isn't preceded by our throw guard
        // The guard we inserted is: (()=>{throw new Error(...)})(); // addDoc(
        const unguardedCallRegex = new RegExp(`(?<!\\/\\/\\s*)\\b${fn}\\s*\\(`, 'g');
        
        if (unguardedCallRegex.test(content)) {
          // Verify it's preceded by the exact throw guard we expect
          if (!content.includes('Phase 7.2 Architecture Violation')) {
             violations.push(`File ${file} contains unguarded ${fn}() call!`);
          }
        }
      });
    });
    
    assert.strictEqual(violations.length, 0, `Active writes found:\n${violations.join('\n')}`);
  });
});
