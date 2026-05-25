import fs from 'fs';
import path from 'path';

export interface RegressionResult {
  passed: boolean;
  violations: string[];
}

const FORBIDDEN_PATTERNS = [
  { pattern: /score\s*=\s*999/g, message: 'Score local detectado (Hardcoded score).' },
  { pattern: /tendenciaProjetada/g, message: 'Propriedade obsoleta (tendenciaProjetada) detectada em AI Service.' },
  { pattern: /evolucaoLiquidez/g, message: 'Propriedade obsoleta (evolucaoLiquidez) detectada em AI Service.' },
  { pattern: /FAKE_FALLBACK_ENGANOSO/g, message: 'Fallback genérico não permitido.' },
  { pattern: /if\s*\([^)]*year\s*>\s*prevYear[^)]*\)\s*{[^}]*alta[^}]*}/gi, message: 'Lógica YoY local detectada.' },
  { pattern: /parseBrNumber\([^)]*\)\s*\?\?\s*0/g, message: 'FAIL-SILENT: Uso de zero silencioso detectado. Proibido pela Import Governance.' }
];

const FORBIDDEN_UI_PATTERNS = [
  { pattern: /calculateTrend/g, message: 'UI não pode calcular tendência. Use RuntimeOutput.' },
  { pattern: /growthRate/g, message: 'UI não pode calcular growthRate. Use RuntimeOutput.' },
  { pattern: /\bCAGR\b/g, message: 'UI não pode calcular CAGR. Use RuntimeOutput.' },
  { pattern: /yearOverYear/g, message: 'UI não pode calcular YoY. Use RuntimeOutput.' },
  { pattern: /deltaRevenue/g, message: 'UI não pode calcular deltas. Use RuntimeOutput.' },
  { pattern: /deltaEbitda/g, message: 'UI não pode calcular deltas. Use RuntimeOutput.' },
  { pattern: /trendAnalysis/g, message: 'UI não pode analisar tendência. Use RuntimeOutput.' },
  { pattern: /classifyTrend/g, message: 'UI não pode classificar tendência. Use RuntimeOutput.' },
  { pattern: /inferTrend/g, message: 'UI não pode inferir tendência. Use RuntimeOutput.' },
  { pattern: /generateInsight/g, message: 'UI não pode gerar insight temporal local.' }
];

export function detectRegressions(directoriesToScan: string[]): RegressionResult {
  const violations: string[] = [];
  
  const scanDirectory = (dir: string) => {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        scanDirectory(fullPath);
      } else if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx')) {
        const content = fs.readFileSync(fullPath, 'utf8');
        FORBIDDEN_PATTERNS.forEach(({ pattern, message }) => {
          if (pattern.test(content)) {
            violations.push(`[${fullPath}]: ${message}`);
          }
        });

        // UI specific bans (Progressive Rollout - Strictly enforced on migrated pages)
        const isMigratedPage = fullPath.includes('BalanceSheetPage.tsx');
        
        if (fullPath.includes('src/components/pages') || fullPath.endsWith('.tsx')) {
          FORBIDDEN_UI_PATTERNS.forEach(({ pattern, message }) => {
            if (pattern.test(content)) {
              if (isMigratedPage) {
                violations.push(`[${fullPath}]: ${message}`);
              } else {
                // Just log a warning for pages not yet migrated
                console.warn(`[WARNING] Legacy Component ${path.basename(fullPath)} violou UI rule: ${message}. Será consertado nas próximas etapas.`);
              }
            }
          });
        }
      }
    }
  };

  directoriesToScan.forEach(dir => scanDirectory(path.resolve(process.cwd(), dir)));

  return {
    passed: violations.length === 0,
    violations
  };
}
