const fs = require('fs');

const files = [
  'src/components/executive-interaction/InstitutionalBlockingDialog.tsx',
  'src/components/executive-interaction/InstitutionalUnavailableState.tsx',
  'src/components/strategic-intelligence/InstitutionalDirectionHeatmap.tsx',
  'src/components/strategic-intelligence/InstitutionalVectorMap.tsx'
];

for (const file of files) {
  if (fs.existsSync(file)) {
    let code = fs.readFileSync(file, 'utf8');
    code = code.replace(/..\/..\/i18n\/LanguageContext/g, '../../contexts/LanguageContext');
    fs.writeFileSync(file, code);
  }
}

// Fix BoardPackScenarioPlayground.tsx
const pg = 'src/components/pages/BoardPackScenarioPlayground.tsx';
if (fs.existsSync(pg)) {
  let code = fs.readFileSync(pg, 'utf8');
  code = code.replace(/..\/..\/core\/runtime\/validation\/MockBoardPackScenarios/g, '../../core/runtime/shared/MockBoardPackScenarios');
  fs.writeFileSync(pg, code);
}

// Fix InstitutionalBoardPackCenter.tsx
const bc = 'src/components/institutional-reporting/InstitutionalBoardPackCenter.tsx';
if (fs.existsSync(bc)) {
  let code = fs.readFileSync(bc, 'utf8');
  code = code.replace(/<QuarantineModeSurface\n\s*reason=\{/g, '<QuarantineModeSurface\nisAccountingFailure={false}\nreason={');
  fs.writeFileSync(bc, code);
}

// Fix InstitutionalBoardPackRuntime.ts metadata
const br = 'src/core/runtime/institutional-reporting/InstitutionalBoardPackRuntime.ts';
if (fs.existsSync(br)) {
  let code = fs.readFileSync(br, 'utf8');
  code = code.replace(/generationTimestamp: new Date/g, 'reportGenerationTimestamp: new Date');
  code = code.replace(/executiveDirectives,/g, 'executiveDirectives: report.executiveCommand!,');
  fs.writeFileSync(br, code);
}

// Fix validateBoardPacks.ts import
const vb = 'src/scripts/validateBoardPacks.ts';
if (fs.existsSync(vb)) {
  let code = fs.readFileSync(vb, 'utf8');
  code = code.replace(/..\/core\/runtime\/consolidated\/InstitutionalFinancialDomainOrchestrator/g, '../core/orchestration/consolidated/InstitutionalFinancialDomainOrchestrator');
  fs.writeFileSync(vb, code);
}

// Fix constitutional-runtime-integration.spec.ts
const cr = 'tests/constitutional-runtime-integration.spec.ts';
if (fs.existsSync(cr)) {
  let code = fs.readFileSync(cr, 'utf8');
  code = code.replace(/report\.constitutionalEvaluation/g, '(report as any).constitutionalEvaluation');
  fs.writeFileSync(cr, code);
}

// Fix test-scen-f.ts
const tsf = 'test-scen-f.ts';
if (fs.existsSync(tsf)) {
  let code = fs.readFileSync(tsf, 'utf8');
  code = code.replace(/BoardPackRuntime\.generate\(report, metadata\)/g, 'BoardPackRuntime.generate(report)');
  fs.writeFileSync(tsf, code);
}

console.log('Fixed additional typescript issues');
