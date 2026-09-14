import * as fs from 'fs';

const t1 = 'src/tests/balance-sheet/balanceSheetSingleInterpretationSource.contract.test.ts';
if (fs.existsSync(t1)) {
  let content = fs.readFileSync(t1, 'utf-8');
  content = content.replace("import { describe, it } from 'node:test';", "import { describe, it, expect } from 'vitest';");
  fs.writeFileSync(t1, content);
}

const t2 = 'src/tests/balance-sheet/balanceSheetTechnicalLayerGuarantee.contract.test.ts';
if (fs.existsSync(t2)) {
  let content = fs.readFileSync(t2, 'utf-8');
  content = content.replace("import { describe, it } from 'node:test';", "import { describe, it, expect } from 'vitest';");
  fs.writeFileSync(t2, content);
}

