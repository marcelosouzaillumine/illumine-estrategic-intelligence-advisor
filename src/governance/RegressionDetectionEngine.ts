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
  { pattern: /parseBrNumber\([^)]*\)\s*\?\?\s*0/g, message: 'FAIL-SILENT: Uso de zero silencioso detectado. Proibido pela Import Governance.' },
  { pattern: /from\s+['"]\.\.\/lib\/scenario-simulation-engine['"]/g, message: 'MOTOR LEGADO: Importação do antigo motor de simulação detectada. Use o novo em src/core/runtime/scenario-intelligence/' },
  { pattern: /CommercialPlanEngine\..*(scores|causality|advisory|severity)\s*=/g, message: 'ComercialPlanEngine não pode alterar outputs financeiros.' },
  { pattern: /import\s+.*from\s+['"].*\/lib\/(score-engine|financial-engine|bpEngine)['"]/gi, message: 'EXPERIENCE BYPASS: Importação direta de motor matemático nas camadas de visualização ou experiência.' }
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
  { pattern: /generateInsight/g, message: 'UI não pode gerar insight temporal local.' },
  { pattern: /calculateScore/g, message: 'UI não pode calcular score localmente. Use RuntimeOutput.' },
  { pattern: /localScore/g, message: 'Score local não é permitido. Use RuntimeOutput.' },
  { pattern: /generateAdvisory/g, message: 'UI não pode gerar advisory. Use RuntimeOutput.' },
  { pattern: /localAdvisory/g, message: 'Advisory local não é permitido. Use RuntimeOutput.' },
  { pattern: /simulateScenario/g, message: 'UI não pode simular cenário localmente. Use Scenario Layer.' },
  { pattern: /projectedEbitda/g, message: 'UI não pode calcular EBITDA projetado localmente. Use Scenario Output.' },
  { pattern: /scenarioAdvisory/g, message: 'Advisory preditivo local não é permitido. Use Scenario Output.' },
  { pattern: /RuntimeTraceEngine/g, message: 'UI não pode instanciar RuntimeTraceEngine. Tracing deve ocorrer no Runtime.' },
  { pattern: /RuntimeProfiler/g, message: 'UI não pode fazer profiling local. Use runtimeMetadata.' },
  { pattern: /ExecutionLineageTracker/g, message: 'UI não pode rastrear lineage. Use runtimeMetadata.' },
  { pattern: /console\.time\(/g, message: 'Profiling local (console.time) não é permitido na UI. Use RuntimeProfiler no Core.' },
  { pattern: /calculateSystemicRisk/g, message: 'UI não pode calcular risco sistêmico localmente.' },
  { pattern: /inferContagion/g, message: 'UI não pode inferir contágio localmente.' },
  { pattern: /generateRecommendation/g, message: 'UI não pode gerar recomendação localmente.' },
  { pattern: /calculatePropagation/g, message: 'UI não pode calcular propagação localmente.' },
  { pattern: /localRiskScore/g, message: 'UI não pode calcular score localmente.' },
  { pattern: /systemicScore/g, message: 'UI não pode calcular score sistêmico localmente.' },
  { pattern: /riskMatrix/g, message: 'UI não pode montar matriz de risco localmente (apenas exibição).' },
  { pattern: /aiAnalysis/g, message: 'UI não pode fazer análise por IA local.' },
  { pattern: /severity\s*=/g, message: 'UI não pode definir ou recalcular severidade.' },
  { pattern: /confidence\s*=/g, message: 'UI não pode definir ou recalcular confiança.' },
  { pattern: /\.sort\([^)]*(risco|risk|severity|severidade|confidence|priority|peso|weight)[^)]*\)/gi, message: 'UI não pode usar .sort() para ranquear risco ou severidade.' },
  { pattern: /import\s+.*ConsolidatedStressPropagationEngine/g, message: 'UI não pode importar a Engine do Runtime Consolidado. Apenas tipos são permitidos.' }
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
        const isBypassAllowed = [
          'ImportFinancialModal.tsx',
          'ManualFinancialModal.tsx',
          'BalanceSheetPage.tsx',
          'LegacyFinancialAdapter.ts',
          'LegacyDFCAdapter.ts',
          'aiBoardReportService.ts',
          'intelligenceEngine.ts'
        ].includes(path.basename(fullPath));

        FORBIDDEN_PATTERNS.forEach(({ pattern, message }) => {
          if (pattern.test(content)) {
            if (message.includes('EXPERIENCE BYPASS') && isBypassAllowed) {
              return;
            }
            violations.push(`[${fullPath}]: ${message}`);
          }
        });

        // UI specific bans (Progressive Rollout - Strictly enforced on migrated pages)
        const isMigratedPage = fullPath.includes('BalanceSheetPage.tsx') || fullPath.includes('systemic-heatmap');
        
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

        // Fiduciary Experience & Exporting Hardening (Phase 10)
        const isExperienceOrExporting = fullPath.includes('src/core/executive-experience') || 
                                        fullPath.includes('src/core/executive-delivery') ||
                                        fullPath.includes('src/components/executive-delivery') ||
                                        fullPath.includes('src/core/exporting') ||
                                        fullPath.includes('AdvisorWorkspacePage') ||
                                        fullPath.includes('ClientExecutiveWorkspace');
                                        
        if (isExperienceOrExporting) {
          FORBIDDEN_UI_PATTERNS.forEach(({ pattern, message }) => {
            if (pattern.test(content)) {
              violations.push(`[${fullPath}]: Experience/Exporting Layer violou regra: ${message}`);
            }
          });
        }

        // Commercial and Pilot Dashboard Hardening (Phase 11)
        const isCommercialOrDashboard = fullPath.includes('src/core/commercial') || 
                                        fullPath.includes('PilotExperienceDashboard');

        if (isCommercialOrDashboard) {
          const cleanContentForCheck = content.replace(/\/\*[\s\S]*?\*\/|\/\/.*$/gm, '');
          const COMMERCIAL_BANS = [
            { pattern: /score\s*=/gi, message: 'Atribuição ou cálculo local de score proibida na camada comercial/dashboard.' },
            { pattern: /risk\s*=/gi, message: 'Atribuição ou cálculo local de risco proibida na camada comercial/dashboard.' },
            { pattern: /advisory\s*=/gi, message: 'Atribuição ou cálculo local de advisory proibida na camada comercial/dashboard.' },
            { pattern: /causality\s*=/gi, message: 'Atribuição ou cálculo local de causação/causalidade proibida na camada comercial/dashboard.' },
            { pattern: /severity\s*=/gi, message: 'Atribuição ou cálculo local de severidade proibida na camada comercial/dashboard.' },
            { pattern: /score-engine|scoreEngine/gi, message: 'Bypass de motor matemático (score-engine) proibido na camada comercial/dashboard.' },
            { pattern: /causality-orchestrator|causalityOrchestrator|CausalityEngine/gi, message: 'Bypass de motor causal proibido na camada comercial/dashboard.' }
          ];

          COMMERCIAL_BANS.forEach(({ pattern, message }) => {
            if (pattern.test(cleanContentForCheck)) {
              violations.push(`[${fullPath}]: Commercial/Dashboard Layer violou regra: ${message}`);
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
