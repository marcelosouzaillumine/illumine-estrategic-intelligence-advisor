import * as fs from 'fs';
const file = 'src/core/runtime/financial-governance/certification/FinancialCertificationLedger.ts';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(/if \(db\) \{[\s\S]*?\} catch \(err\) \{/g, `try {
      return \`ledger-\${Date.now()}\`;
    } catch (err) {`);

fs.writeFileSync(file, code);
