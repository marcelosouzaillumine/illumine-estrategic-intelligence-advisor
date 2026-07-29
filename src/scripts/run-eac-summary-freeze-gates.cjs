const { execSync } = require('child_process');
const fs = require('fs');

const commands = [
  "npx tsx --test tests/executive-summary-section.test.tsx",
  "npx tsx --test tests/executive-strategic-semantic-cards.test.tsx",
  "npx tsx --test tests/eac-architecture-scanner.test.ts",
  "npm run typecheck",
  "npm run test",
  "node src/scripts/executiveArchitectureScannerV2.cjs",
  "node src/scripts/eac-global-discovery.cjs"
];

const results = [];
let hasFailure = false;

for (let i = 0; i < commands.length; i++) {
  const cmd = commands[i];
  console.log(`Running: ${cmd}`);
  const start = Date.now();
  const startedAt = new Date().toISOString();
  let stdout = '';
  let stderr = '';
  let exitCode = 0;
  
  try {
    stdout = execSync(cmd, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] });
  } catch (err) {
    exitCode = err.status || 1;
    stdout = err.stdout || '';
    stderr = err.stderr || '';
    hasFailure = true;
  }
  
  const end = Date.now();
  const finishedAt = new Date().toISOString();
  const durationMs = end - start;
  
  const logFilename = `gate-${i+1}.log`;
  const logPath = `docs/architecture/evidence/eac-summary-freeze/${logFilename}`;
  fs.writeFileSync(logPath, `STDOUT:\n${stdout}\n\nSTDERR:\n${stderr}`);

  results.push({
    command: cmd,
    startedAt,
    finishedAt,
    durationMs,
    exitCode,
    passed: exitCode === 0,
    testSummary: null,
    logPath
  });
}

fs.writeFileSync('docs/architecture/evidence/eac-summary-freeze/EAC_SUMMARY_FREEZE_GATES.json', JSON.stringify(results, null, 2));

if (hasFailure) {
  console.error('Um ou mais gates falharam. Verifique os logs.');
  process.exit(1);
} else {
  console.log('Todos os gates passaram com sucesso!');
}
