import * as fs from 'fs';
const execLong = 'src/core/runtime/institutional-reporting/engines/ExecutiveLongitudinalIntegration.spec.ts';
if (fs.existsSync(execLong)) {
  let content = fs.readFileSync(execLong, 'utf-8');
  content = content.replace(/operationalGovernance: \{ executionIntegrity:/g, 'operationalGovernance: { executionIntegrity:');
  // Just cast operationalGovernance to any
  content = content.replace(/operationalGovernance: \{([^}]+)\}/g, 'operationalGovernance: {$1} as any');
  
  // Do the same for governance in the second test
  content = content.replace(/governance: \{ executionIntegrity:/g, 'governance: { executionIntegrity:');
  content = content.replace(/governance: \{([^}]+)\}/g, 'governance: {$1} as any');
  fs.writeFileSync(execLong, content);
}
