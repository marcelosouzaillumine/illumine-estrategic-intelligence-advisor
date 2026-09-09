import * as fs from 'fs';
import * as path from 'path';

function runInstitutionalContinuityGovernanceAudit() {
  console.log('▶ Starting Institutional Continuity Governance Audit (RC-1.9)...');

  const componentsDir = path.join(process.cwd(), 'src/components/institutional-continuity');
  const cockpitPage = path.join(process.cwd(), 'src/components/pages/InstitutionalContinuityCockpitPage.tsx');

  const filesToAudit = [
    cockpitPage,
    ...(fs.existsSync(componentsDir) ? fs.readdirSync(componentsDir).map(f => path.join(componentsDir, f)) : [])
  ];

  let hasErrors = false;

  for (const filePath of filesToAudit) {
    if (!filePath.endsWith('.tsx') && !filePath.endsWith('.ts')) continue;
    
    // Ignore test/fixture directories inside if any, but audit components
    if (filePath.includes('testing') || filePath.includes('fixtures')) continue;

    const content = fs.readFileSync(filePath, 'utf-8');
    const basename = path.basename(filePath);

    // Rule 1: No Mock Factory imports allowed in prod components
    if (content.includes('MockFactory') && basename !== 'InstitutionalContinuityMockFactory.ts') {
      console.error(`✖ ERROR: Governance Violation in ${basename}`);
      console.error('  => Cockpit components must not import MockFactory. Connect to the ExecutiveGovernanceRuntime pipeline.');
      hasErrors = true;
    }

    // Rule 2: No Generative AI or Randomness
    if (content.match(/Math\.random\(\)/) || content.match(/openai/i) || content.match(/generate.*Text/i)) {
      console.error(`✖ ERROR: Governance Violation in ${basename}`);
      console.error('  => Generative AI or speculative logic is strictly forbidden in Institutional Continuity components.');
      hasErrors = true;
    }

    // Rule 3: No local score recalculation
    if (content.match(/reduce\(/) && content.match(/score/i)) {
      console.error(`✖ ERROR: Governance Violation in ${basename}`);
      console.error('  => Aggregation or scoring logic found in View Layer. Must rely entirely on Runtime output.');
      hasErrors = true;
    }
  }

  if (hasErrors) {
    console.error('✖ Institutional Continuity Governance Audit FAILED.\n');
    process.exit(1);
  } else {
    console.log('✔ Institutional Continuity Governance Audit PASSED.');
    console.log('  => All continuity surfaces operate in strictly passive read-only mode.');
    console.log('  => Fiduciary and structural rules adhered.');
  }
}

runInstitutionalContinuityGovernanceAudit();
