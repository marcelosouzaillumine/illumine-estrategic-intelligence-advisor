import * as fs from 'fs';

const path = 'src/core/runtime/financial-governance/pipeline/FinancialPipelineOrchestrator.ts';
let content = fs.readFileSync(path, 'utf-8');
content = content.replace('FinancialCertificationLedger.recordCertification(', 'new FinancialCertificationLedger().certify(');
fs.writeFileSync(path, content);
