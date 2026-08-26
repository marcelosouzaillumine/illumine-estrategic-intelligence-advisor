import * as fs from 'fs';
const execLong = 'src/core/runtime/institutional-reporting/engines/ExecutiveLongitudinalIntegration.spec.ts';
if (fs.existsSync(execLong)) {
  let content = fs.readFileSync(execLong, 'utf-8');
  content = content.replace(/operationalGovernance: \{ executionIntegrity: \{ status: 'EXECUTION_STABLE', capabilityConfidence: 'HIGH', strainFactors: \[\] \} as any \},/g, 'operationalGovernance: { executionIntegrity: { status: "EXECUTION_STABLE", capabilityConfidence: "HIGH", strainFactors: [] } } as any,');
  content = content.replace(/governance: \{ executionIntegrity: \{ status: 'EXECUTION_STABLE', capabilityConfidence: 'HIGH', strainFactors: \[\] \} as any \},/g, 'governance: { executionIntegrity: { status: "EXECUTION_STABLE", capabilityConfidence: "HIGH", strainFactors: [] } } as any,');
  
  // Also just to be super safe, if the above regex misses because of quotes:
  content = content.replace(/operationalGovernance: \{ executionIntegrity:[^,]+, capabilityConfidence:[^,]+, strainFactors: \[\] \} as any \},/g, 'operationalGovernance: {} as any,');
  content = content.replace(/governance: \{ executionIntegrity:[^,]+, capabilityConfidence:[^,]+, strainFactors: \[\] \} as any \},/g, 'governance: {} as any,');
  
  fs.writeFileSync(execLong, content);
}
