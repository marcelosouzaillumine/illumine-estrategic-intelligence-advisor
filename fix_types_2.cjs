const fs = require('fs');

// 1. ExecutiveSynthesisTypes.ts
let path = 'src/core/runtime/executive-consolidation/ExecutiveSynthesisTypes.ts';
let content = fs.readFileSync(path, 'utf8');
content = content.replace(/strategicSignificance: string;/g, 'strategicSignificance?: string;');
content = content.replace(/institutionalObservation: string;/g, 'institutionalObservation?: string;');
content = content.replace(/moduleContext\?: string;/g, 'moduleContext?: string;\n  strategicPriority?: string;\n  priorityRecommendation?: string;\n  recommendationPriority?: string;');
content = content.replace(/institutionalObservation: InstitutionalObservation;/g, 'institutionalObservation: InstitutionalObservation;\n  priorityRecommendation?: string;');
fs.writeFileSync(path, content);

// 2. ExecutiveDriverCatalog.ts
path = 'src/core/runtime/executive-consolidation/ExecutiveDriverCatalog.ts';
content = fs.readFileSync(path, 'utf8');
content = content.replace(/institutionalObservation: \{/g, 'strategicPriority?: { critical: string; warning: string; healthy: string; };\n  priorityRecommendation?: { critical: string; warning: string; healthy: string; };\n  institutionalObservation: {');
fs.writeFileSync(path, content);

// 3. IntelligenceLab.tsx
path = 'src/components/executive-workspace/IntelligenceLab.tsx';
if (fs.existsSync(path)) {
  content = fs.readFileSync(path, 'utf8');
  content = content.replace(/@\/packages\/application/g, '@application');
  fs.writeFileSync(path, content);
}

// 4. ExecutiveIntelligenceOutput.ts
path = 'src/core/intelligence/contracts/ExecutiveIntelligenceOutput.ts';
content = fs.readFileSync(path, 'utf8');
if (!content.includes('confidence?: any;')) {
  content = content.replace(/capabilityId\?: string;/g, 'capabilityId?: string;\n  confidence?: any;');
  fs.writeFileSync(path, content);
}

// 5. BalanceSheetIntelligenceUseCase.ts
path = 'src/capabilities/financial/application/usecases/BalanceSheetIntelligenceUseCase.ts';
content = fs.readFileSync(path, 'utf8');
content = content.replace(/const mockContext = \{/g, 'const mockContext: any = {');
content = content.replace(/const capitalContext = \{/g, 'const capitalContext: any = {');
fs.writeFileSync(path, content);

console.log('Fixes applied.');
