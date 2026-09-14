import * as fs from 'fs';
const execLong = 'src/core/runtime/institutional-reporting/engines/ExecutiveLongitudinalIntegration.spec.ts';
if (fs.existsSync(execLong)) {
  let content = fs.readFileSync(execLong, 'utf-8');
  content = content.replace(/, activeFrictions: \[\]/g, '');
  content = content.replace(/activeFrictions: \[\], /g, '');
  fs.writeFileSync(execLong, content);
}
