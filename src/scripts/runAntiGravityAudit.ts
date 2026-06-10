import * as fs from 'fs';
import * as path from 'path';
import * as ts from 'typescript';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const SRC_DIR = path.resolve(__dirname, '../');

interface Violation {
  file: string;
  line: number;
  rule: string;
  message: string;
}

const CANONICAL_COMPONENTS = [
  'ExecutiveSurface', 'MetricTile', 'SemanticCard', 'ExecutiveChart',
  'ExecutiveNarrative', 'ExecutiveTable', 'ExecutiveStat', 'ActionToolbar', 'ExecutiveCallout'
];

const RECHARTS_COMPONENTS = [
  'ResponsiveContainer', 'BarChart', 'LineChart', 'PieChart', 'RadarChart', 'ComposedChart', 'AreaChart'
];

function scanFile(filePath: string): Violation[] {
  const content = fs.readFileSync(filePath, 'utf8');
  const sourceFile = ts.createSourceFile(filePath, content, ts.ScriptTarget.Latest, true);
  const violations: Violation[] = [];

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
          if (className.includes('bg-card') || className.includes('card-premium')) {
             if (className.includes('border') || className.includes('shadow') || className.includes('p-')) {
               violations.push({
                 file: filePath,
                 line: getLine(node),
                 rule: 'NO_MANUAL_SURFACES',
                 message: `Found manual surface div with classes "${className}". Use SemanticCard or ExecutiveSurface instead.`
               });
             }
          }
        }
      }

      // Rule 2: ResponsiveContainer / Recharts usage in pages
      if (isPageFile && RECHARTS_COMPONENTS.includes(tagName)) {
         violations.push({
           file: filePath,
           line: getLine(node),
           rule: 'NO_MANUAL_CHARTS',
           message: `Direct use of ${tagName} found. Use ExecutiveChart instead.`
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
              message: `Canonical component <${tagName}> is being overridden with: ${overrides.join(', ')}`
            });
          }
        }
      }

      // Rule 4 Tracker
      if (tagName === 'ExecutivePageTemplate' || tagName === 'PageHeader') {
        hasPageHeaderOrExecutiveTemplate = true;
      }
    }

    ts.forEachChild(node, visit);
  }

  visit(sourceFile);

  // Rule 4 check
  if (isPageFile && !hasPageHeaderOrExecutiveTemplate && !filePath.includes('components/pages/index.tsx') && !filePath.includes('components/pages/SupportPage.tsx')) {
    // Only flag if it's actually exporting a component matching the filename
    const basename = path.basename(filePath, '.tsx');
    if (content.includes(`function ${basename}`) || content.includes(`const ${basename}`)) {
      violations.push({
        file: filePath,
        line: 1,
        rule: 'MUST_USE_PAGE_TEMPLATE',
        message: `Top level page ${basename} must use <ExecutivePageTemplate> or <PageHeader>.`
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
  
  walkDir(path.join(SRC_DIR, 'components'), (filePath) => {
    try {
      const v = scanFile(filePath);
      allViolations.push(...v);
    } catch (e) {
      console.error(`Error scanning ${filePath}:`, e);
    }
  });

  console.log(`\\n📊 AntiGravity™ Compliance Report`);
  console.log(`=================================================`);
  
  if (allViolations.length === 0) {
    console.log('✅ ZERO VIOLATIONS. Architecture is strictly compliant.');
    return;
  }

  console.log(`❌ Found ${allViolations.length} architectural violations.\\n`);
  
  // Group by module (folder name under pages)
  const byModule: Record<string, Violation[]> = {};
  for (const v of allViolations) {
    let mod = 'components';
    if (v.file.includes('/pages/')) {
       const rel = v.file.split('/pages/')[1];
       mod = rel.includes('/') ? rel.split('/')[0] : 'core-pages';
    } else if (v.file.includes('/war-room/')) {
       mod = 'war-room';
    } else if (v.file.includes('/advisor/')) {
       mod = 'advisor';
    }
    
    if (!byModule[mod]) byModule[mod] = [];
    byModule[mod].push(v);
  }

  for (const [mod, violations] of Object.entries(byModule)) {
    console.log(`\\n📁 Module: ${mod.toUpperCase()} (${violations.length} violations)`);
    console.log(`-------------------------------------------------`);
    for (const v of violations) {
      const relPath = path.relative(SRC_DIR, v.file);
      console.log(`[${v.rule}] ${relPath}:${v.line}`);
      console.log(`   ↳ ${v.message}`);
    }
  }

  console.log(`\\n=================================================`);
  console.log(`⚠️  AntiGravity Enforcement Failed. Please fix the above violations.`);
  process.exit(1);
}

runAudit();
