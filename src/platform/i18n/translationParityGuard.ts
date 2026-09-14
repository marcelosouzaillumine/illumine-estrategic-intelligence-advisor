import fs from 'fs';
import path from 'path';

import { fileURLToPath } from 'url';

// This utility compares translation dictionaries across locales
// to detect missing keys, orphan keys, and inconsistent structures.

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const localesDir = path.join(__dirname);
const defaultLocale = 'pt-BR';
const targetLocales = ['en-US', 'es-ES'];

function flattenObject(obj: Record<string, any>, prefix = ''): Record<string, string> {
  let result: Record<string, string> = {};
  for (const [key, value] of Object.entries(obj)) {
    const newKey = prefix ? `${prefix}.${key}` : key;
    if (typeof value === 'object' && value !== null) {
      Object.assign(result, flattenObject(value, newKey));
    } else {
      result[newKey] = value;
    }
  }
  return result;
}

async function loadLocale(locale: string): Promise<Record<string, string>> {
  try {
    const filePath = path.join(localesDir, `${locale}.ts`);
    const module = await import(filePath);
    return flattenObject(module.default || module[locale.replace('-', '')] || module.dictionary || module);
  } catch (error) {
    console.error(`Failed to load locale file for ${locale}:`, error);
    return {};
  }
}

export async function runCoverageAudit() {
  console.log(`Starting Translation Coverage Audit...\n`);
  const baseModule = await import(path.join(localesDir, `${defaultLocale}.ts`));
  const baseKeys = flattenObject(baseModule.default || baseModule);
  let totalErrors = 0;

  for (const target of targetLocales) {
    const targetModule = await import(path.join(localesDir, `${target}.ts`));
    const targetKeys = flattenObject(targetModule.default || targetModule);
    const missingKeys: string[] = [];
    const orphanKeys: string[] = [];

    // Check for missing keys
    for (const key of Object.keys(baseKeys)) {
      if (!(key in targetKeys)) {
        missingKeys.push(key);
      } else if (targetKeys[key] === baseKeys[key]) {
        // Warning: Untranslated keys (except where preserved)
        // This is a naive check. A robust check would filter against SEMANTIC_PRESERVATION_TERMS.
        // For now, we omit it to avoid noise on naturally identical words (e.g. "Total").
      }
    }

    // Check for orphan keys
    for (const key of Object.keys(targetKeys)) {
      if (!(key in baseKeys)) {
        orphanKeys.push(key);
      }
    }

    console.log(`=== Audit for ${target} ===`);
    if (missingKeys.length > 0) {
      console.warn(`[WARN] Missing ${missingKeys.length} keys in ${target}:`);
      missingKeys.slice(0, 10).forEach(k => console.warn(`  - ${k}`));
      if (missingKeys.length > 10) console.warn(`  ... and ${missingKeys.length - 10} more.`);
      totalErrors += missingKeys.length;
    } else {
      console.log(`[OK] No missing keys in ${target}.`);
    }

    if (orphanKeys.length > 0) {
      console.warn(`[WARN] Orphan ${orphanKeys.length} keys in ${target} (not in ${defaultLocale}):`);
      orphanKeys.slice(0, 10).forEach(k => console.warn(`  - ${k}`));
      if (orphanKeys.length > 10) console.warn(`  ... and ${orphanKeys.length - 10} more.`);
      // Orphans don't necessarily increment totalErrors for failing CI, but should be noted.
    } else {
      console.log(`[OK] No orphan keys in ${target}.`);
    }
    console.log();
  }

  if (totalErrors > 0) {
    console.warn(`[RESULT] Audit completed with warnings (${totalErrors} missing keys).`);
  } else {
    console.log(`[RESULT] Audit completed successfully. 100% translation parity.`);
  }
  
  return totalErrors === 0;
}

// Run if executed directly
const isMain = import.meta.url === `file://${process.argv[1]}`;
if (isMain) {
  runCoverageAudit().then(isOk => {
    if (!isOk) {
      process.exit(1);
    }
  });
}
