import * as fs from 'fs';
import * as path from 'path';

function runProductionHardeningAudit() {
  console.log('Iniciando Production Hardening & Release Governance Audit...\n');

  let violations = 0;
  const srcPath = path.join(process.cwd(), 'src');
  const testsPath = path.join(process.cwd(), 'tests');

  const filesToCheck: string[] = [];
  const testFiles: string[] = [];

  const getFilesRecursive = (dir: string, fileList: string[]) => {
    if (!fs.existsSync(dir)) return;
    const list = fs.readdirSync(dir);
    list.forEach(file => {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);
      if (stat && stat.isDirectory()) {
        getFilesRecursive(fullPath, fileList);
      } else {
        if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
          fileList.push(fullPath);
        }
      }
    });
  };

  getFilesRecursive(srcPath, filesToCheck);
  getFilesRecursive(testsPath, testFiles);

  // 1. Check for Production Firebase Keys Leakage
  // Checks for strings matching AIzaSy followed by standard Firebase Key characters in src
  const KEY_REGEX = /AIzaSy[A-Za-z0-9_\-]{35}/g;
  for (const file of filesToCheck) {
    const content = fs.readFileSync(file, 'utf8');
    const matches = content.match(KEY_REGEX);
    if (matches) {
      // Allow only example or configuration files
      const relativePath = path.relative(process.cwd(), file);
      if (!relativePath.includes('firebase-applet-config.json') && !relativePath.includes('firebase.ts')) {
        console.error(`❌ SECURITY VIOLATION: Possible hardcoded Firebase API Key found in ${relativePath}:`);
        console.error(`   Found key prefix: "${matches[0].substring(0, 10)}..."\n`);
        violations++;
      }
    }
  }

  // 2. Check for Firestore Writes in Tests Without Mocks
  // Verifies that if a test uses doc/setDoc/addDoc, it also mocks/stubs firebase operations,
  // or checks for the emulator skip mechanism, or mocks AuditEventBus/ImmutableLedger.
  const WRITE_OPERATIONS = ['addDoc', 'setDoc', 'updateDoc', 'deleteDoc'];
  for (const file of testFiles) {
    const content = fs.readFileSync(file, 'utf8');
    const usesWrite = WRITE_OPERATIONS.some(op => content.includes(op));
    if (usesWrite) {
      const isMocked = 
        content.includes('saveEvent =') || 
        content.includes('saveLedger =') || 
        content.includes('setMockMode(true)') || 
        content.includes('withSecurityRulesDisabled') ||
        content.includes('FIRESTORE_EMULATOR_HOST') ||
        content.includes('rules.test.mjs');

      if (!isMocked) {
        const relativePath = path.relative(process.cwd(), file);
        console.error(`❌ GOVERNANCE VIOLATION: Test ${relativePath} uses Firestore write operations but does not mock AuditEventBus, ImmutableLedger, or check for emulator skip.`);
        console.error(`   Direct Firestore writes without emulator check will cause tests to hang or fail.\n`);
        violations++;
      }
    }
  }

  // 3. Check for Tenant Queries without tenantId/clientId Filtering
  // Queries on tenant-specific collections should filter by tenantId or clientId
  const TENANT_COLLECTIONS = ['indicators', 'financial_entries', 'payables', 'receivables', 'audit_events', 'anomalies', 'institutional_jobs', 'runtime_pressure'];
  for (const file of filesToCheck) {
    const content = fs.readFileSync(file, 'utf8');
    if (content.includes('query(') && content.includes('collection(')) {
      const relativePath = path.relative(process.cwd(), file);
      // Skip libraries, adapters, and audit files
      if (relativePath.includes('governed-repository') || relativePath.includes('governanceService') || relativePath.includes('importService') || relativePath.includes('runProductionHardeningAudit') || relativePath.includes('validateFirestoreIndexes') || relativePath.includes('seedCompany')) {
        continue;
      }
      
      const containsTenantCollection = TENANT_COLLECTIONS.some(coll => content.includes(`'${coll}'`) || content.includes(`"${coll}"`));
      if (containsTenantCollection) {
        const hasTenantFilter = content.includes('tenantId') || content.includes('clientId') || content.includes('ownsClient') || content.includes('activeTenant');
        if (!hasTenantFilter) {
          console.error(`❌ ISOLATION VIOLATION: Query in ${relativePath} accesses tenant collection but has no visible tenantId/clientId filter.`);
          violations++;
        }
      }
    }
  }

  // 4. Check for Demo Data Isolation (Must contain memorySource: 'DEMO' or environment: 'STAGING')
  const demoFiles = filesToCheck.filter(f => f.includes('seed') || f.includes('demo') || f.includes('mock'));
  for (const file of demoFiles) {
    const content = fs.readFileSync(file, 'utf8');
    const relativePath = path.relative(process.cwd(), file);
    if (content.includes('tenantId') && !content.includes('DEMO') && !content.includes('STAGING') && !relativePath.includes('types.ts')) {
      console.warn(`⚠️  DEMO ISOLATION WARNING: File ${relativePath} contains mock data but does not explicitly tag environment/source.`);
    }
  }

  if (violations > 0) {
    console.error(`\n❌ Falha na auditoria de Production Hardening. Foram detectadas ${violations} violações de segurança e governança.`);
    process.exit(1);
  } else {
    console.log('✅ Hardening de produção verificado: chaves seguras, queries isoladas por inquilino e testes devidamente mockados.');
    console.log('\nProduction Hardening & Release Governance Audit Finalizada. Status: COMPLIANT');
  }
}

try {
  runProductionHardeningAudit();
} catch (e: any) {
  console.error('❌ Production Hardening audit crashed:', e.message);
  process.exit(1);
}
