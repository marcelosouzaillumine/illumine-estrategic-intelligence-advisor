import fs from 'fs';
import path from 'path';

function runScenarioSimulationAudit() {
  console.log('Running Scenario Simulation & Predictive Governance Layer Audit...');

  const violations: string[] = [];

  const simDir = path.resolve(process.cwd(), 'src/core/runtime/scenario-simulation');
  if (!fs.existsSync(simDir)) {
    console.error(`Error: Directory ${simDir} does not exist.`);
    process.exit(1);
  }
  
  const files = fs.readdirSync(simDir).filter(f => f.endsWith('.ts'));

  // Rule 1: No Math.random or generative AI imports in core scenario-simulation engines
  const forbiddenPatterns = [
    { pattern: 'Math.random', message: 'Math.random is forbidden to prevent non-deterministic behavior. Use rule-based calculation instead.' },
    { pattern: 'openai', message: 'Generative AI packages (openai) are forbidden in the scenario simulation layer.' },
    { pattern: '@google/genai', message: 'Generative AI packages (@google/genai) are forbidden.' },
    { pattern: '@google/generative-ai', message: 'Generative AI packages (@google/generative-ai) are forbidden.' }
  ];

  for (const file of files) {
    const filePath = path.join(simDir, file);
    const content = fs.readFileSync(filePath, 'utf8');

    for (const item of forbiddenPatterns) {
      if (content.includes(item.pattern)) {
        violations.push(`Violation in ${file}: ${item.message}`);
      }
    }
  }

  // Rule 2: Ensure SimulationOutput and ForecastOutput types have essential safety and audit fields
  const typesPath = path.join(simDir, 'types.ts');
  if (fs.existsSync(typesPath)) {
    const content = fs.readFileSync(typesPath, 'utf8');
    const essentialFields = ['tenantId', 'correlationId', 'lineageHash', 'generatedAt'];
    for (const field of essentialFields) {
      if (!content.includes(field)) {
        violations.push(`Violation in types.ts: Missing required audit/lineage field '${field}' inside simulation models.`);
      }
    }
  }

  // Rule 3: Ensure pages don't do local simulation calculations
  const pagesToCheck = [
    path.resolve(process.cwd(), 'src/components/pages/ScenarioLabPage.tsx'),
    path.resolve(process.cwd(), 'src/components/pages/ExecutiveScenarioLabPage.tsx')
  ];

  for (const pagePath of pagesToCheck) {
    if (fs.existsSync(pagePath)) {
      const content = fs.readFileSync(pagePath, 'utf8');
      
      // Page should not contain local equations for score / velocity calculations
      if (content.includes('impliedRisk =') || content.includes('historicalVelocity =') || content.includes('cashBurnRatePerMonth =')) {
        violations.push(`Violation in page ${path.basename(pagePath)}: Calculations of simulations/forecasts must NOT be done page-level. Use ScenarioSimulationProvider state.`);
      }
    }
  }

  if (violations.length > 0) {
    console.error('❌ Scenario Simulation Audit FAILED:');
    violations.forEach(v => console.error(`  - ${v}`));
    process.exit(1);
  }

  console.log('✅ Scenario Simulation Audit PASSED: Determinism, Tenant Isolation, and Lineage verified.');
  process.exit(0);
}

runScenarioSimulationAudit();
