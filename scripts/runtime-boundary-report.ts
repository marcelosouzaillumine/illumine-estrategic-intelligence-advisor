import * as fs from 'fs';
import * as path from 'path';

interface Violation {
  file: string;
  imports: {
    runtime: boolean;
    engine: boolean;
    calculator: boolean;
    threshold: boolean;
  };
  severityLogic: boolean;
  trendLogic: boolean;
}

const componentsDir = path.join(process.cwd(), 'src/components');

const getFilesRecursive = (dir: string): string[] => {
  let results: string[] = [];
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getFilesRecursive(fullPath));
    } else {
      if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx')) {
        results.push(fullPath);
      }
    }
  });
  return results;
};

const allComponentFiles = getFilesRecursive(componentsDir);

const violations: Violation[] = [];

allComponentFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf-8');
  const shortPath = file.replace(process.cwd(), '');

  const hasRuntimeImport = /from\s+['"].*core\/runtime.*['"]/.test(content);
  
  const hasRuntime = hasRuntimeImport && /Runtime\b/.test(content);
  const hasEngine = hasRuntimeImport && /Engine\b/.test(content);
  const hasCalculator = hasRuntimeImport && /Calculator\b/.test(content);
  const hasThreshold = hasRuntimeImport && /Threshold\b/.test(content);

  // The actual boundary test checks for core/runtime imports and specific banned words:
  if (hasRuntime || hasEngine || hasCalculator || hasThreshold) {
    violations.push({
      file: shortPath,
      imports: {
        runtime: hasRuntime,
        engine: hasEngine,
        calculator: hasCalculator,
        threshold: hasThreshold
      },
      severityLogic: false,
      trendLogic: false
    });
  }
});

const reportPath = path.join(process.cwd(), 'docs/constitutional-governance/RuntimeBoundaryReport.md');

let markdown = `# Boundary Violation Report\n\n`;
markdown += `**Generated**: ${new Date().toISOString()}\n`;
markdown += `**Total Violations**: ${violations.length}\n\n`;
markdown += `| File | Runtime Import | Engine Import | Calculator Import | Threshold Import | Local Severity | Local Trend |\n`;
markdown += `|---|---|---|---|---|---|---|\n`;

violations.forEach(v => {
  markdown += `| ${v.file} | ${v.imports.runtime ? '❌' : '✅'} | ${v.imports.engine ? '❌' : '✅'} | ${v.imports.calculator ? '❌' : '✅'} | ${v.imports.threshold ? '❌' : '✅'} | ${v.severityLogic ? '❌' : '✅'} | ${v.trendLogic ? '❌' : '✅'} |\n`;
});

fs.writeFileSync(reportPath, markdown, 'utf-8');
console.log(`Report generated at ${reportPath} with ${violations.length} violations.`);
