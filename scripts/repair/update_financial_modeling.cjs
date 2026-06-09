const fs = require('fs');
const file = 'src/components/pages/FinancialModelingPage.tsx';
let content = fs.readFileSync(file, 'utf8');

// Replace imports
content = content.replace(
  /import \{ adaptScenarioToEFOSInput.*evaluateExecutiveDecision \} from '\.\.\/\.\.\/core\/runtime\/executive\/ExecutiveDecisionEngine';/s,
  `import { useScenarioExecutionIntelligence } from '../../hooks/useScenarioExecutionIntelligence';`
);

// Replace calculation block
const calcRegex = /const executionIntelligence = useMemo\(\(\) => \{[\s\S]*?\}, \[valuationOutput, scenarioValuationInput, efosSnapshot, hasData, scenarioImpacts\]\);/;
const replacement = `const executionIntelligence = useScenarioExecutionIntelligence(
    valuationOutput,
    scenarioValuationInput,
    efosSnapshot,
    hasData,
    scenarioImpacts
  );`;

if (!calcRegex.test(content)) {
    console.error("Could not find the executionIntelligence useMemo block");
    process.exit(1);
}
content = content.replace(calcRegex, replacement);

fs.writeFileSync(file, content);
console.log("Success");
