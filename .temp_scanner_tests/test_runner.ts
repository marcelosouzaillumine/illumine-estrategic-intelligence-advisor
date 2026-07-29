import { detectRegressions } from '../src/governance/RegressionDetectionEngine';
import * as fs from 'fs';

// Scenario 1: The real service (simulated by creating a dummy file with allowed imports at the correct path)
fs.writeFileSync('.temp_scanner_tests/src/services/intelligence/BoardReportIntelligenceService.ts', "import { bpEngine } from '../../lib/bpEngine';");
let res = detectRegressions(['.temp_scanner_tests']);
console.log("Scenario 1 (Valid Path & Valid Import):", res.passed ? "PASSED" : "FAILED", res.violations);

// Scenario 2: Fake copy in another path
fs.mkdirSync('.temp_scanner_tests/src/services/fake', { recursive: true });
fs.writeFileSync('.temp_scanner_tests/src/services/fake/BoardReportIntelligenceService.ts', "import { bpEngine } from '../../lib/bpEngine';");
res = detectRegressions(['.temp_scanner_tests']);
console.log("Scenario 2 (Fake Path):", res.passed ? "PASSED" : "FAILED", res.violations);

// Scenario 3: Valid Path, but unallowed import added
fs.writeFileSync('.temp_scanner_tests/src/services/intelligence/BoardReportIntelligenceService.ts', "import { score } from '../../lib/bpEngine';\nimport { fake } from '../../lib/fake-engine';");
// Wait, the regex checks for score-engine|financial-engine|bpEngine. If we import score-engine but it's NOT in allowed list (it IS in allowed list). What if we import a fake math engine? The regex won't trigger. 
// What if we remove master-causal-engine from allowedImports and import it?
