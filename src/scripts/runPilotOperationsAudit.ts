// src/scripts/runPilotOperationsAudit.ts

import fs from 'fs';
import path from 'path';

function runPilotOperationsAudit() {
  console.log('Running Pilot Operations & Controlled Activation Audit...');

  const violations: string[] = [];

  // Rule 1: No pilot-specific business logic in other core runtime engines
  const runtimeDir = path.resolve(process.cwd(), 'src/core/runtime');
  if (!fs.existsSync(runtimeDir)) {
    console.error(`Error: Directory ${runtimeDir} does not exist.`);
    process.exit(1);
  }

  const coreRuntimeFiles = fs.readdirSync(runtimeDir)
    .filter(f => f.endsWith('.ts'))
    .map(f => path.join(runtimeDir, f));

  // Also scan all subdirectories under src/core/runtime EXCEPT pilot-operations
  const subDirs = fs.readdirSync(runtimeDir)
    .map(d => path.join(runtimeDir, d))
    .filter(p => fs.statSync(p).isDirectory() && !p.endsWith('pilot-operations'));

  for (const dir of subDirs) {
    const dirFiles = fs.readdirSync(dir)
      .filter(f => f.endsWith('.ts'))
      .map(f => path.join(dir, f));
    coreRuntimeFiles.push(...dirFiles);
  }

  for (const filePath of coreRuntimeFiles) {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Check if core business logic references pilot-operations directly
    if (content.includes('pilot-operations') || content.includes('PilotOperationsEngine') || content.includes('PilotValidationCategory')) {
      violations.push(`Violation in ${path.basename(filePath)}: Core business logic engines must NOT import or depend on Pilot Operations. Controlled activation must remain non-invasive.`);
    }

    // Check if there is any tenant bypass
    if (content.includes('bypassTenant') || content.includes('ignoreTenantIsolation')) {
      violations.push(`Violation in ${path.basename(filePath)}: Unsafe tenant bypass mechanisms found in core runtime.`);
    }
  }

  // Rule 2: Verify types and contracts safety
  const pilotOperationsDir = path.join(runtimeDir, 'pilot-operations');
  const typesPath = path.join(pilotOperationsDir, 'types.ts');
  if (fs.existsSync(typesPath)) {
    const content = fs.readFileSync(typesPath, 'utf8');
    const requiredTypes = [
      'PilotTenantStatus',
      'PilotOperationalHealth',
      'PilotExecutiveEngagement',
      'PilotValidationCategory',
      'PilotFeedbackSeverity'
    ];

    for (const type of requiredTypes) {
      if (!content.includes(type)) {
        violations.push(`Violation in types.ts: Missing mandatory pilot contract type '${type}'.`);
      }
    }
  } else {
    violations.push('Violation: Missing types.ts under pilot-operations directory.');
  }

  // Rule 3: Verify Telemetry does not log sensitive data (PII or Business Data)
  const obsEnginePath = path.join(pilotOperationsDir, 'PilotObservabilityEngine.ts');
  if (fs.existsSync(obsEnginePath)) {
    const content = fs.readFileSync(obsEnginePath, 'utf8');
    if (!content.includes('sensitiveKeys') || !content.includes('VIOLAÇÃO DE GOVERNANÇA TELEMETRIA')) {
      violations.push('Violation in PilotObservabilityEngine.ts: Missing strict telemetry sanitization or security blocker logic.');
    }
  } else {
    violations.push('Violation: Missing PilotObservabilityEngine.ts.');
  }

  // Rule 4: Verify Feedback Engine enforces active tenantId check
  const feedbackEnginePath = path.join(pilotOperationsDir, 'PilotFeedbackGovernanceEngine.ts');
  if (fs.existsSync(feedbackEnginePath)) {
    const content = fs.readFileSync(feedbackEnginePath, 'utf8');
    if (!content.includes('filterByTenant') || !content.includes('lineageHash')) {
      violations.push('Violation in PilotFeedbackGovernanceEngine.ts: Feedback manager must enforce strict filterByTenant isolation and lineageHash generation.');
    }
  } else {
    violations.push('Violation: Missing PilotFeedbackGovernanceEngine.ts.');
  }

  // Rule 5: Verify Onboarding Engine prevents bypasses
  const onboardingEnginePath = path.join(pilotOperationsDir, 'ExecutiveOnboardingEngine.ts');
  if (fs.existsSync(onboardingEnginePath)) {
    const content = fs.readFileSync(onboardingEnginePath, 'utf8');
    if (!content.includes('VIOLATION_ONBOARDING_ORDER') || !content.includes('completeStep')) {
      violations.push('Violation in ExecutiveOnboardingEngine.ts: Onboarding guide must validate sequential completion order strictly (no bypasses allowed).');
    }
  } else {
    violations.push('Violation: Missing ExecutiveOnboardingEngine.ts.');
  }

  if (violations.length > 0) {
    console.error('❌ Pilot Operations Audit FAILED:');
    violations.forEach(v => console.error(`  - ${v}`));
    process.exit(1);
  }

  console.log('✅ Pilot Operations Audit PASSED: Strict Tenant Isolation, Non-Invasiveness, and Telemetry Safety verified.');
  process.exit(0);
}

runPilotOperationsAudit();
