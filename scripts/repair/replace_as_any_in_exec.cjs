const fs = require('fs');

const file = 'src/core/runtime/executive-intelligence-runtime.ts';
let content = fs.readFileSync(file, 'utf8');

// Replace (bpSummary as any) with bpSummary
content = content.replace(/\(bpSummary as any\)/g, 'bpSummary');

// Replace (rawCapitalGov.diagnostics as any).fiduciaryOutput
content = content.replace(/\(rawCapitalGov\.diagnostics as any\)\.fiduciaryOutput/g, '(rawCapitalGov.diagnostics as unknown as { fiduciaryOutput: unknown }).fiduciaryOutput');

// Replace ((recoveryReport as any) as { regressionReport?: any })
content = content.replace(/\(\(recoveryReport as any\) as { regressionReport\?: any }\)/g, '((recoveryReport as unknown as { regressionReport?: unknown }))');
content = content.replace(/\(\(recoveryReport as any\) as { resilienceReport\?: any }\)/g, '((recoveryReport as unknown as { resilienceReport?: unknown }))');

// Replace fiduciaryEnforcement as any
content = content.replace(/fiduciaryEnforcement: fiduciaryEnforcement as any,/g, 'fiduciaryEnforcement,');

fs.writeFileSync(file, content);
console.log('Fixed as any in executive-intelligence-runtime.ts');
