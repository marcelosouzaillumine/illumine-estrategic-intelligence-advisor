import * as fs from 'fs';

const p01 = 'src/capabilities/financial/domain/__tests__/P01DataChain.spec.ts';
if (fs.existsSync(p01)) {
  let content = fs.readFileSync(p01, 'utf-8');
  content = content.replace(/as unknown as FinancialPositionIntelligenceContract/g, 'as any');
  fs.writeFileSync(p01, content);
}

const p02 = 'src/capabilities/financial/domain/__tests__/P02_04_05.spec.ts';
if (fs.existsSync(p02)) {
  let content = fs.readFileSync(p02, 'utf-8');
  content = content.replace(/as unknown as FinancialPositionIntelligenceContract/g, 'as any');
  fs.writeFileSync(p02, content);
}

