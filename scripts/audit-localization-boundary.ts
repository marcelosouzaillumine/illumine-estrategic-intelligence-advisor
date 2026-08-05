import { execSync } from 'child_process';
import * as path from 'path';
import * as fs from 'fs';

const TARGET_DIR = 'src/components';
const PROJECT_ROOT = process.cwd();

function runGrep(pattern: string, dir: string): number {
  try {
    // pattern will be enclosed in single quotes, so we shouldn't use single quotes inside pattern.
    const cmd = `grep -rE '${pattern}' ${dir} | grep -v "test" | grep -v "spec"`;
    const result = execSync(cmd, { cwd: PROJECT_ROOT, encoding: 'utf-8' });
    const lines = result.split('\n').filter(line => line.trim() !== '');
    return lines.length;
  } catch (error: any) {
    if (error.status === 1) {
      return 0;
    }
    console.error(`Error running grep for pattern ${pattern}:`, error.message);
    return 0;
  }
}

function runAudit() {
  console.log('Running Localization Boundary Audit...\n');

  if (!fs.existsSync(path.join(PROJECT_ROOT, TARGET_DIR))) {
    console.error(`Target directory ${TARGET_DIR} does not exist!`);
    process.exit(1);
  }

  // Dynamic Data Boundary
  console.log('Dynamic Data Boundary');
  console.log('---------------------');
  const toLocaleStringCount = runGrep('\\.toLocaleString\\(', TARGET_DIR);
  const intlNumberCount = runGrep('new Intl\\.NumberFormat', TARGET_DIR);
  const intlDateCount = runGrep('new Intl\\.DateTimeFormat', TARGET_DIR);
  const toLocaleDateCount = runGrep('\\.toLocaleDateString\\(', TARGET_DIR);
  const toLocaleTimeCount = runGrep('\\.toLocaleTimeString\\(', TARGET_DIR);

  const totalLocaleString = toLocaleStringCount + toLocaleDateCount + toLocaleTimeCount;

  console.log(`toLocaleString: ${totalLocaleString}`);
  console.log(`Intl.NumberFormat: ${intlNumberCount}`);
  console.log(`Intl.DateTimeFormat: ${intlDateCount}`);
  console.log('');

  // Semantic Translation Boundary
  console.log('Semantic Translation Boundary');
  console.log('-----------------------------');
  const hardcodedCount = runGrep('>(Crítico|Saudável|Atenção)<', TARGET_DIR);
  const hardcodedDoubleQuotes = runGrep('"(Crítico|Saudável|Atenção)"', TARGET_DIR);
  
  // For single quotes, we need to escape them properly for bash '...' string.
  // In bash, '\'' escapes a single quote inside a single quoted string.
  const hardcodedSingleQuotes = runGrep('\'\\\'\'(Crítico|Saudável|Atenção)\'\\\'\'', TARGET_DIR);
  
  const totalHardcoded = hardcodedCount + hardcodedDoubleQuotes + hardcodedSingleQuotes;
  
  console.log(`Hardcoded executive labels: ${totalHardcoded}`);
  console.log('');

  const totalViolations = totalLocaleString + intlNumberCount + intlDateCount + totalHardcoded;

  if (totalViolations > 0) {
    console.log(`STATUS: FAILED (${totalViolations} violations found)`);
    console.error('\nAudit Failed! Please replace native formatting APIs and hardcoded semantic strings with the ones authorized by I18N_COMPLIANCE_POLICY.md.');
    process.exit(1);
  } else {
    console.log('STATUS: PASSED');
    process.exit(0);
  }
}

runAudit();
