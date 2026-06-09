const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const PROJECT_ROOT = path.join(__dirname, '../../');
const SRC_DIR = path.join(PROJECT_ROOT, 'src');

const PATTERNS = {
  any: /:\s*any\b|<\s*any\s*>|\bas\s+any\b/g,
  unknown: /:\s*unknown\b|<\s*unknown\s*>|\bas\s+unknown\b/g,
  tsIgnore: /@ts-ignore/g,
  tsExpectError: /@ts-expect-error/g,
  recordStringAny: /Record<string,\s*any>/g,
};

function determineRiskLevel(filePath) {
  const relativePath = path.relative(PROJECT_ROOT, filePath);
  
  if (
    relativePath.startsWith('src/core/runtime/') ||
    relativePath.startsWith('src/runtime/') ||
    relativePath.startsWith('src/core/governance/') ||
    relativePath.startsWith('src/core/financial/') ||
    relativePath.startsWith('src/services/') ||
    relativePath.startsWith('src/adapters/') ||
    relativePath.includes('RBAC') ||
    relativePath.includes('logging') ||
    relativePath.includes('firebase')
  ) {
    return 'CRITICAL';
  }
  
  if (
    relativePath.startsWith('src/context/') ||
    relativePath.startsWith('src/hooks/') ||
    relativePath.startsWith('src/utils/mappers') ||
    relativePath.includes('provider')
  ) {
    return 'HIGH';
  }
  
  if (
    relativePath.startsWith('src/components/') ||
    relativePath.startsWith('src/pages/') ||
    relativePath.startsWith('tests/') ||
    relativePath.includes('report')
  ) {
    return 'MEDIUM';
  }
  
  if (
    relativePath.startsWith('scripts/') ||
    relativePath.startsWith('src/scripts/') ||
    relativePath.includes('legacy') ||
    relativePath.includes('fixtures') ||
    relativePath.includes('mock')
  ) {
    return 'LOW';
  }
  
  return 'MEDIUM'; // Default fallback
}

function scanFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  const occurrences = [];
  
  lines.forEach((line, index) => {
    const lineNumber = index + 1;
    
    for (const [type, pattern] of Object.entries(PATTERNS)) {
      let match;
      while ((match = pattern.exec(line)) !== null) {
        occurrences.push({
          file: path.relative(PROJECT_ROOT, filePath),
          line: lineNumber,
          content: line.trim(),
          type,
          risk: determineRiskLevel(filePath)
        });
      }
    }
  });
  
  return occurrences;
}

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    if (isDirectory) {
      if (f !== 'node_modules' && f !== '.git' && f !== 'dist' && f !== 'build') {
        walkDir(dirPath, callback);
      }
    } else {
      if (f.endsWith('.ts') || f.endsWith('.tsx')) {
        callback(dirPath);
      }
    }
  });
}

function main() {
  const occurrences = [];
  
  // Scan src and tests and scripts
  const dirsToScan = [
    path.join(PROJECT_ROOT, 'src'),
    path.join(PROJECT_ROOT, 'tests'),
    path.join(PROJECT_ROOT, 'scripts')
  ];
  
  dirsToScan.forEach(dir => {
    if (fs.existsSync(dir)) {
      walkDir(dir, (filePath) => {
        occurrences.push(...scanFile(filePath));
      });
    }
  });
  
  // Create output dir
  const outputDir = path.join(PROJECT_ROOT, 'docs', 'architecture');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  const jsonPath = path.join(outputDir, 'type-safety-audit.json');
  fs.writeFileSync(jsonPath, JSON.stringify({ occurrences }, null, 2));
  
  // Generate Markdown
  let markdown = `# Type Safety Audit Report\n\n`;
  markdown += `**Data:** ${new Date().toISOString()}\n\n`;
  
  const summary = {
    CRITICAL: 0,
    HIGH: 0,
    MEDIUM: 0,
    LOW: 0,
    types: {}
  };
  
  occurrences.forEach(o => {
    summary[o.risk]++;
    summary.types[o.type] = (summary.types[o.type] || 0) + 1;
  });
  
  markdown += `## Resumo Geral\n\n`;
  markdown += `- **Total de Ocorrências:** ${occurrences.length}\n`;
  markdown += `- **CRITICAL:** ${summary.CRITICAL}\n`;
  markdown += `- **HIGH:** ${summary.HIGH}\n`;
  markdown += `- **MEDIUM:** ${summary.MEDIUM}\n`;
  markdown += `- **LOW:** ${summary.LOW}\n\n`;
  
  markdown += `## Por Tipo\n\n`;
  for (const [type, count] of Object.entries(summary.types)) {
    markdown += `- **${type}:** ${count}\n`;
  }
  
  markdown += `\n## Detalhamento CRITICAL e HIGH\n\n`;
  const criticalHigh = occurrences.filter(o => o.risk === 'CRITICAL' || o.risk === 'HIGH');
  
  const grouped = {};
  criticalHigh.forEach(o => {
    if (!grouped[o.file]) grouped[o.file] = [];
    grouped[o.file].push(o);
  });
  
  for (const [file, items] of Object.entries(grouped)) {
    markdown += `### ${file}\n\n`;
    items.forEach(i => {
      markdown += `- Line ${i.line}: \`${i.type}\` (${i.risk}) -> \`${i.content}\`\n`;
    });
    markdown += `\n`;
  }
  
  const mdPath = path.join(outputDir, 'Type_Safety_Audit.md');
  fs.writeFileSync(mdPath, markdown);
  
  console.log(`Auditoria concluída. ${occurrences.length} ocorrências encontradas.`);
  console.log(`Relatórios gerados em: \n- ${jsonPath}\n- ${mdPath}`);
}

main();
