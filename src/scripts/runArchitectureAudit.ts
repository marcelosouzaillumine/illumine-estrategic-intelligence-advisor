import fs from 'fs';
import path from 'path';

const FORBIDDEN_IMPORT = 'firebase/firestore';
const TARGET_DIRS = ['src/components', 'src/pages', 'src/hooks'];

// Arquivos que ainda estão acoplados e serão refatorados nas próximas ondas
const EXEMPT_FILES = [
  'ExecutiveCommentary.tsx',
  'ImportBankStatementModal.tsx',
  'ImportFinancialModal.tsx',
  'ImportPlanoModal.tsx',
  'ImportTransactionsModal.tsx',
  'AxisDashboardPage.tsx',
  'CleanupTool.tsx',
  'ConsolidatedGroupAdminPage.tsx',
  'DLPAPage.tsx',
  'FinancialAdminDashboard.tsx',
  'FinancialModelingPage.tsx',
  'FinancialPositionPage.tsx',
  'GovernanceDashboardPage.tsx',
  'IndicatorsPage.tsx',
  'LeadershipProfilePage.tsx',
  'MaintenancePage.tsx',
  'MeetingMinutesPage.tsx',
  'PartnersPage.tsx',
  'PayablesPage.tsx',
  'PlanoAcaoPage.tsx',
  'PlanoDeContasPage.tsx',
  'ReceivablesPage.tsx',
  'StrategicSimulatorPage.tsx',
  'TaxReformImpactPage.tsx',
  'ViabilityPage.tsx'
];

let violations = 0;

function walkDir(dir: string, isSrcRoot = false) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      walkDir(fullPath);
    } else if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx')) {
      checkFile(fullPath);
      checkAdapterPlacement(fullPath, file);
    }
  }
}

function checkAdapterPlacement(filePath: string, fileName: string) {
  if (fileName.startsWith('Firestore') && fileName.endsWith('Adapter.ts')) {
    if (!filePath.includes('src/adapters/persistence')) {
      console.error(`[ARCHITECTURE VIOLATION] Firestore adapter found outside persistence layer: ${filePath}. Must be inside src/adapters/persistence.`);
      violations++;
    }
  }
}

function checkFile(filePath: string) {
  const isUIOrHook = TARGET_DIRS.some(dir => filePath.includes(dir));
  const isExempt = EXEMPT_FILES.some(exempt => filePath.includes(exempt));
  
  const content = fs.readFileSync(filePath, 'utf-8');

  // Check forbidden UI imports
  if (isUIOrHook && !isExempt) {
    if (content.includes(`from '${FORBIDDEN_IMPORT}'`) || content.includes(`from "${FORBIDDEN_IMPORT}"`)) {
      console.error(`[ARCHITECTURE VIOLATION] File ${filePath} imports from '${FORBIDDEN_IMPORT}' directly.`);
      violations++;
    }

    const forbiddenFirestoreFunctions = ['getDocs(', 'collection(', 'query('];
    for (const fn of forbiddenFirestoreFunctions) {
      if (content.includes(fn)) {
        console.error(`[ARCHITECTURE VIOLATION] File ${filePath} calls Firestore function ${fn} directly.`);
        violations++;
      }
    }
  }

  // Check UI Identity checks
  if (isUIOrHook) {
    const forbiddenIdentityPatterns = [
      'user.role ===',
      'session.role ===',
      'user.userType ===',
      'currentUser.role ==='
    ];

    for (const pattern of forbiddenIdentityPatterns) {
      if (content.includes(pattern)) {
        console.error(`[ARCHITECTURE VIOLATION] File ${filePath} contains hardcoded identity check: "${pattern}". Use \`can(CAPABILITY)\`.`);
        violations++;
      }
    }

    // Check raw string capabilities
    const canRawStringRegex = /can\(['"][A-Z_.]+['"]\)/g;
    const matches = content.match(canRawStringRegex);
    if (matches) {
      console.error(`[ARCHITECTURE VIOLATION] File ${filePath} uses raw strings for capabilities: ${matches.join(', ')}. Use CAPABILITIES enum.`);
      violations++;
    }
  }

  // Check Navigation rules
  if (filePath.includes('src/navigation')) {
    const fixedLabelRegex = /label:\s*['"][^'"]+['"]/g;
    if (fixedLabelRegex.test(content)) {
      console.error(`[ARCHITECTURE VIOLATION] File ${filePath} contains fixed label text instead of labelKey.`);
      violations++;
    }

    const forbiddenNavIdentityPatterns = [
      'role ===',
      'userType ===',
      '.role'
    ];
    for (const pattern of forbiddenNavIdentityPatterns) {
      if (content.includes(pattern)) {
        console.error(`[ARCHITECTURE VIOLATION] File ${filePath} contains role checks instead of capabilities: "${pattern}".`);
        violations++;
      }
    }
  }
}

console.log(`Starting Architecture Audit...`);
console.log(`Checking directories: ${TARGET_DIRS.join(', ')} for forbidden import: ${FORBIDDEN_IMPORT}\n`);

// Check TARGET_DIRS for UI rules
TARGET_DIRS.forEach(dir => walkDir(path.resolve(process.cwd(), dir)));
// Check src for Firestore adapters placement
walkDir(path.resolve(process.cwd(), 'src'));

if (violations > 0) {
  console.error(`\n❌ Architecture Audit FAILED with ${violations} violations.`);
  process.exit(1);
} else {
  console.log(`\n✅ Architecture Audit PASSED! The platform is adhering to structural constraints.`);
}
