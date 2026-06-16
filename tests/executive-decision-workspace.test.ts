import fs from 'fs';
import path from 'path';
import assert from 'assert';
import { test } from 'node:test';

function getFilesRecursively(dir: string, ext: string): string[] {
  let results: string[] = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getFilesRecursively(filePath, ext));
    } else if (filePath.endsWith(ext)) {
      results.push(filePath);
    }
  });
  return results;
}

test('Executive Decision Workspace Sovereignty (No local plan implementations)', () => {
  const tsxFiles = getFilesRecursively('src/components', '.tsx');
  let violations: string[] = [];

  const forbiddenLocalClasses = [
    'ExecutiveDecisionSummary',
    'ExecutiveActionGrid',
    'ExecutiveActionCard',
    'ExecutiveActionPlanSummary',
    'ExecutiveActionRoadmap'
  ];

  for (const file of tsxFiles) {
    // Skip the canonical V2/V3 components
    if (file.includes('executive-decision-summary.tsx') || file.includes('executive-execution-plan.tsx')) {
      continue;
    }
    
    // Skip the old V1 deprecated ones to allow them to be physically present if needed, 
    // but forbid any OTHER page from importing them.
    if (file.includes('executive-action-grid.tsx') || 
        file.includes('executive-action-card.tsx')) {
      continue;
    }

    const content = fs.readFileSync(file, 'utf-8');
    const lines = content.split('\n');

    lines.forEach((line, index) => {
      // Allow the actual import of ExecutiveDecisionSummary to not fail
      if (line.includes("import { ExecutiveDecisionSummary")) return;

      // Check for usage of V1 or legacy local action plan components
      if (line.includes('<ExecutiveActionGrid') || line.includes('<ExecutiveActionCard') || line.includes('<ExecutiveActionPlanSummary') || line.includes('<ExecutiveActionRoadmap') || line.includes('<ExecutiveRoadmap')) {
        violations.push(`${file}:${index + 1} -> [PROIBIDO] Uso de componente local ou obsoleto de plano executivo. Utilize <ExecutiveDecisionSummary> e <ExecutiveExecutionPlan> por composição.`);
      }

      // Check for forbidden contextual strings
      if (line.match(/Roadmap Executivo|Roadmap Estratégico|Executive Roadmap/gi)) {
        violations.push(`${file}:${index + 1} -> [PROIBIDO] Uso da nomenclatura "Roadmap" para recomendações executivas. Utilize "Plano de Execução Prioritário".`);
      }
    });
  }

  assert.strictEqual(violations.length, 0, 'Found local implementations of Executive Plans bypassing the V2 Canonical Contract:\n' + violations.join('\n'));
});
