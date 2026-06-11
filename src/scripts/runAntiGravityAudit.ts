import * as fs from 'fs';
import * as path from 'path';
import * as ts from 'typescript';
import { fileURLToPath } from 'url';
import { domainMap } from './antigravity/config/domain-map.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const SRC_DIR = path.resolve(__dirname, '../');

interface Violation {
  file: string;
  line: number;
  rule: string;
  message: string;
  severity: 'ERROR' | 'WARNING' | 'INFO' | 'MIGRATION';
}

const CANONICAL_COMPONENTS = [
  'ExecutiveSurface', 'MetricTile', 'SemanticCard', 'ExecutiveChart',
  'ExecutiveNarrative', 'ExecutiveTable', 'ExecutiveStat', 'ActionToolbar', 'ExecutiveCallout'
];

const RECHARTS_COMPONENTS = [
  'ResponsiveContainer', 'BarChart', 'LineChart', 'PieChart', 'RadarChart', 'ComposedChart', 'AreaChart'
];

// Trackers for adoption score
const usageStats = {
  MetricTile: { valid: 0, manual: 0 },
  ExecutiveSurface: { valid: 0, manual: 0 },
  ExecutiveChart: { valid: 0, manual: 0 },
  ExecutivePageTemplate: { valid: 0, manual: 0 }
};

// Map file to Domain
function getDomainForFile(filePath: string): string {
  const basename = path.basename(filePath, '.tsx');
  for (const [domain, files] of Object.entries(domainMap)) {
    if (files.includes(basename)) {
      return domain;
    }
  }
  // Fallbacks
  if (filePath.includes('/war-room/')) return 'WarRoom';
  if (filePath.includes('/advisor/')) return 'Advisor';
  if (filePath.includes('/public/')) return 'Public';
  return 'Unknown';
}

function scanFile(filePath: string): Violation[] {
  const content = fs.readFileSync(filePath, 'utf8');
  const sourceFile = ts.createSourceFile(filePath, content, ts.ScriptTarget.Latest, true);
  const violations: Violation[] = [];
  const domain = getDomainForFile(filePath);

  // If it's a legacy domain under migration, downgrade ERRORs to MIGRATION
  const isLegacyDomain = domain === 'WarRoom' || domain === 'Advisor';

  const getLine = (node: ts.Node) => sourceFile.getLineAndCharacterOfPosition(node.getStart()).line + 1;

  let hasPageHeaderOrExecutiveTemplate = false;
  let isPageFile = filePath.endsWith('Page.tsx') || filePath.includes('/pages/');

  function visit(node: ts.Node) {
    if (ts.isJsxElement(node) || ts.isJsxSelfClosingElement(node)) {
      const openingElement = ts.isJsxElement(node) ? node.openingElement : node;
      const tagName = openingElement.tagName.getText();

      // Rule 1: Detect div replicating SemanticCard / MetricTile
      if (tagName === 'div') {
        const classNameAttr = openingElement.attributes.properties.find(
          attr => ts.isJsxAttribute(attr) && attr.name.getText() === 'className'
        ) as ts.JsxAttribute;

        if (classNameAttr && classNameAttr.initializer && ts.isStringLiteral(classNameAttr.initializer)) {
          const className = classNameAttr.initializer.text;
          
          // Phase 10: Hardcoded HEX check
          if (className.includes('bg-[#') || className.includes('text-[#')) {
            violations.push({
              file: filePath,
              line: getLine(node),
              rule: 'NO_HARDCODED_COLORS',
              message: `Hardcoded HEX colors found: "${className}". Use Design Tokens only.`,
              severity: 'ERROR'
            });
          }
          
          if (className.includes('bg-card') || className.includes('card-premium')) {
             if (className.includes('border') || className.includes('shadow') || className.includes('p-')) {
               usageStats.ExecutiveSurface.manual++;
               usageStats.MetricTile.manual++; // rough heuristic for manual KPIs
               violations.push({
                 file: filePath,
                 line: getLine(node),
                 rule: 'NO_MANUAL_SURFACES',
                 message: `Found manual surface div with classes "${className}". Use SemanticCard or ExecutiveSurface instead.`,
                 severity: isLegacyDomain ? 'MIGRATION' : 'ERROR'
               });
             }
          }
        }
      }
      
      // Phase 10: Detect Manual Narratives
      if (tagName === 'p' || tagName === 'span') {
         const classNameAttr = openingElement.attributes.properties.find(
          attr => ts.isJsxAttribute(attr) && attr.name.getText() === 'className'
        ) as ts.JsxAttribute;

        if (classNameAttr && classNameAttr.initializer && ts.isStringLiteral(classNameAttr.initializer)) {
          const className = classNameAttr.initializer.text;
          if (className.includes('text-muted') && className.includes('leading-') && !className.includes('text-xs')) {
             violations.push({
               file: filePath,
               line: getLine(node),
               rule: 'NO_MANUAL_NARRATIVES',
               message: `Found manual narrative text block. Use <ExecutiveNarrative> instead.`,
               severity: isLegacyDomain ? 'MIGRATION' : 'WARNING'
             });
          }
        }
      }

      // Track valid canonical usages
      if (tagName === 'MetricTile') usageStats.MetricTile.valid++;
      if (tagName === 'SemanticCard' || tagName === 'ExecutiveSurface') usageStats.ExecutiveSurface.valid++;
      if (tagName === 'ExecutiveChart') usageStats.ExecutiveChart.valid++;

      // Rule 2: ResponsiveContainer / Recharts usage in pages
      if (isPageFile && RECHARTS_COMPONENTS.includes(tagName)) {
         usageStats.ExecutiveChart.manual++;
         violations.push({
           file: filePath,
           line: getLine(node),
           rule: 'NO_MANUAL_CHARTS',
           message: `Direct use of ${tagName} found. Use ExecutiveChart instead.`,
           severity: isLegacyDomain ? 'MIGRATION' : 'ERROR'
         });
      }

      // Rule 3: Overriding Canonical Components
      if (CANONICAL_COMPONENTS.includes(tagName)) {
        const classNameAttr = openingElement.attributes.properties.find(
          attr => ts.isJsxAttribute(attr) && attr.name.getText() === 'className'
        ) as ts.JsxAttribute;

        if (classNameAttr && classNameAttr.initializer && ts.isStringLiteral(classNameAttr.initializer)) {
          const className = classNameAttr.initializer.text;
          const overrides = className.split(' ').filter(c => c.startsWith('bg-') || c.startsWith('text-') || c.startsWith('border-'));
          if (overrides.length > 0) {
            violations.push({
              file: filePath,
              line: getLine(node),
              rule: 'NO_CANONICAL_OVERRIDES',
              message: `Canonical component <${tagName}> is being overridden with: ${overrides.join(', ')}`,
              severity: 'WARNING'
            });
          }
        }

        // Rule 5: Empty States Policy Validation
        if (['MetricTile', 'ExecutiveScore', 'ExecutiveChart', 'ExecutiveTable'].includes(tagName)) {
          // Check for empty/loading/error props
          const hasEmptyProp = openingElement.attributes.properties.some(
            attr => ts.isJsxAttribute(attr) && (attr.name.getText() === 'empty' || attr.name.getText() === 'emptyMessage')
          );
          const hasLoadingProp = openingElement.attributes.properties.some(
            attr => ts.isJsxAttribute(attr) && attr.name.getText() === 'loading'
          );
          
          // While default props exist in the components, we enforce explicit handling or standard usage patterns
          // We issue a WARNING if neither loading nor empty props are explicitly passed to these data-driven components
          if (!hasEmptyProp && !hasLoadingProp) {
             violations.push({
               file: filePath,
               line: getLine(node),
               rule: 'MISSING_EMPTY_STATE_POLICY',
               message: `Component <${tagName}> should explicitly handle 'loading' or 'empty' states.`,
               severity: 'WARNING'
             });
          }
        }
      }

      // Rule 4 Tracker
      if (tagName === 'ExecutivePageTemplate' || tagName === 'PageHeader') {
        hasPageHeaderOrExecutiveTemplate = true;
        usageStats.ExecutivePageTemplate.valid++;
      }
    }

    ts.forEachChild(node, visit);
  }

  visit(sourceFile);

  // Rule 4 check
  let isTruePageFile = false;
  if (filePath.endsWith('Page.tsx')) {
    isTruePageFile = true;
  } else if (filePath.includes('/pages/')) {
    const relativePath = filePath.split('/pages/')[1] || '';
    const isTopLevel = !relativePath.includes('/');
    const isLeaf = ['Section.tsx', 'Toolbar.tsx', 'Filter.tsx', 'Status.tsx', 'Card.tsx', 'Modal.tsx'].some(ext => filePath.endsWith(ext));
    if (isTopLevel && !isLeaf) {
      isTruePageFile = true;
    }
  }

  if (isTruePageFile && !hasPageHeaderOrExecutiveTemplate && !filePath.includes('components/pages/index.tsx') && !filePath.includes('components/pages/SupportPage.tsx')) {
    const basename = path.basename(filePath, '.tsx');
    if (content.includes(`function ${basename}`) || content.includes(`const ${basename}`)) {
      usageStats.ExecutivePageTemplate.manual++;
      violations.push({
        file: filePath,
        line: 1,
        rule: 'MUST_USE_PAGE_TEMPLATE',
        message: `Top level page ${basename} must use <ExecutivePageTemplate> or <PageHeader>.`,
        severity: isLegacyDomain ? 'MIGRATION' : 'ERROR'
      });
    }
  }

  return violations;
}

function walkDir(dir: string, callback: (path: string) => void) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      walkDir(fullPath, callback);
    } else if (fullPath.endsWith('.tsx')) {
      callback(fullPath);
    }
  }
}

function runAudit() {
  console.log('🚀 Iniciando AntiGravity™ Architectural Enforcement Audit...');
  
  const allViolations: Violation[] = [];
  const domainTotalFiles: Record<string, number> = {};
  const domainFilesWithErrors: Record<string, Set<string>> = {};
  
  walkDir(path.join(SRC_DIR, 'components'), (filePath) => {
    try {
      const v = scanFile(filePath);
      allViolations.push(...v);
      
      const domain = getDomainForFile(filePath);
      domainTotalFiles[domain] = (domainTotalFiles[domain] || 0) + 1;
      
      if (!domainFilesWithErrors[domain]) domainFilesWithErrors[domain] = new Set();
      
      const hasErrors = v.some(vi => vi.severity === 'ERROR');
      if (hasErrors) {
         domainFilesWithErrors[domain].add(filePath);
      }
    } catch (e) {
      console.error(`Error scanning ${filePath}:`, e);
    }
  });

  console.log(`\n📊 AntiGravity™ Compliance Report`);
  console.log(`=================================================`);
  
  // Calculate Component Scores
  console.log(`\n🧩 Component Adoption Scores:`);
  for (const [comp, stats] of Object.entries(usageStats)) {
    const total = stats.valid + stats.manual;
    const adoption = total === 0 ? 100 : Math.round((stats.valid / total) * 100);
    console.log(`   - ${comp}: ${adoption}%`);
  }

  // Calculate Domain Scores
  console.log(`\n🏢 Domain Compliance:`);
  for (const domain of Object.keys(domainTotalFiles)) {
    const totalFiles = domainTotalFiles[domain];
    const filesWithErrors = domainFilesWithErrors[domain]?.size || 0;
    const cleanFiles = totalFiles - filesWithErrors;
    const compliance = totalFiles === 0 ? 100 : Math.round((cleanFiles / totalFiles) * 100);
    console.log(`   - ${domain}: ${compliance}%`);
  }

  if (allViolations.length === 0) {
    console.log('\n✅ ZERO VIOLATIONS. Architecture is strictly compliant.');
    return;
  }

  console.log(`\n❌ Found ${allViolations.length} architectural findings.\n`);
  
  const byModule: Record<string, Violation[]> = {};
  for (const v of allViolations) {
    const mod = getDomainForFile(v.file);
    if (!byModule[mod]) byModule[mod] = [];
    byModule[mod].push(v);
  }

  let hasBlockingErrors = false;

  for (const [mod, violations] of Object.entries(byModule)) {
    console.log(`\n📁 Module: ${mod.toUpperCase()} (${violations.length} findings)`);
    console.log(`-------------------------------------------------`);
    for (const v of violations) {
      const relPath = path.relative(SRC_DIR, v.file);
      console.log(`[${v.severity}] [${v.rule}] ${relPath}:${v.line}`);
      console.log(`   ↳ ${v.message}`);
      if (v.severity === 'ERROR') hasBlockingErrors = true;
    }
  }

  console.log(`\n=================================================`);
  if (hasBlockingErrors) {
    console.log(`⚠️  AntiGravity Enforcement Failed due to ERROR level violations.`);
    process.exit(1);
  } else {
    console.log(`✅ Passed. Only MIGRATION, INFO or WARNING findings detected.`);
    process.exit(0);
  }
}

runAudit();
