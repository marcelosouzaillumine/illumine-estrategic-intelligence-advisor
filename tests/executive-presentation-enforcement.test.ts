import { test } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';

test('Executive Presentation Enforcement Sprint v1.0', async () => {
  const violations: string[] = [];
  
  // Target components
  const componentsPath = path.join(process.cwd(), 'src/components/ui');
  const targetFiles = [
    path.join(componentsPath, 'executive-decision-summary.tsx'),
    path.join(componentsPath, 'executive-execution-plan.tsx'),
    path.join(componentsPath, 'executive-section-header.tsx')
  ];

  for (const file of targetFiles) {
    if (!fs.existsSync(file)) {
      violations.push(`File missing: ${file}`);
      continue;
    }
    
    const content = fs.readFileSync(file, 'utf-8');
    const lines = content.split('\n');

    lines.forEach((line, index) => {
      // 1. Prohibit raw English states in the UI. 
      // They must be provided by the adapter/model already translated.
      // Ignoring case switches or exact literal comparisons
      if (!line.includes('case ') && !line.includes('===') && !line.includes('!==')) {
        if (line.match(/'MONITORING'|"MONITORING"|'MEDIUM'|"MEDIUM"|'HIGH'|"HIGH"|'LOW'|"LOW"/)) {
          violations.push(`${file}:${index + 1} -> [PROIBIDO] Uso de strings cruas de status (MONITORING, MEDIUM, etc) na UI. Use dados normalizados pelo Adapter.`);
        }
      }

      // 2. Prohibit unhandled placeholders
      if (line.includes('Plano Executivo |')) {
        violations.push(`${file}:${index + 1} -> [PROIBIDO] Uso de placeholder sujo (Plano Executivo |). O Adapter deve sanitizar isso.`);
      }

      // 3. Prohibit non-canonical typography classes
      if (line.match(/text-muted\b|text-muted-foreground|text-secondary|opacity-[0-9]+|text-gray-[0-9]+|text-slate-[0-9]+/)) {
        violations.push(`${file}:${index + 1} -> [PROIBIDO] Uso de classes genéricas (text-muted, opacity-*, etc) na UI Executiva. Use ExecutiveText.`);
      }
    });
  }

  // 4. Validate Balance Sheet Case Zero uses all canonical components
  const bsPath = path.join(process.cwd(), 'src/components/pages/balance-sheet/BalanceSheetExecutivePlan.tsx');
  if (fs.existsSync(bsPath)) {
    const bsContent = fs.readFileSync(bsPath, 'utf-8');
    if (!bsContent.includes('<ExecutiveSectionHeader')) {
      violations.push(`${bsPath} -> [PROIBIDO] Falta de <ExecutiveSectionHeader> na página executiva.`);
    }
    if (!bsContent.includes('<ExecutiveDecisionSummary')) {
      violations.push(`${bsPath} -> [PROIBIDO] Falta de <ExecutiveDecisionSummary> na página executiva.`);
    }
    if (!bsContent.includes('<ExecutiveExecutionPlan')) {
      violations.push(`${bsPath} -> [PROIBIDO] Falta de <ExecutiveExecutionPlan> na página executiva.`);
    }
  } else {
    violations.push(`File missing: ${bsPath}`);
  }

  if (violations.length > 0) {
    console.error('\n[EXECUTIVE PRESENTATION ENFORCEMENT FAILED]');
    violations.forEach(v => console.error(v));
    assert.fail(`${violations.length} regressões visuais/semânticas encontradas na camada executiva.`);
  }
});
