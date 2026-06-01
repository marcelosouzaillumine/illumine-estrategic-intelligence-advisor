import fs from 'fs';

const files = [
  'src/core/runtime/institutional-reporting/engines/GovernanceReportingEngine.ts',
  'src/core/runtime/institutional-reporting/engines/InstitutionalDisclosureEngine.ts',
  'src/core/runtime/institutional-reporting/engines/InstitutionalExplainabilityAppendixEngine.ts',
  'src/core/runtime/institutional-reporting/engines/InstitutionalLineageAppendixEngine.ts',
  'src/core/runtime/institutional-reporting/engines/FiduciaryTimelineEngine.ts',
  'src/core/runtime/institutional-reporting/InstitutionalBoardPackRuntime.ts'
];

for (const file of files) {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    content = content.replace(/as any/g, 'as unknown');
    fs.writeFileSync(file, content);
  }
}
