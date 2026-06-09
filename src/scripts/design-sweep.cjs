const fs = require('fs');
const path = require('path');

const isApplyMode = process.argv.includes('--apply');
const srcDir = path.join(process.cwd(), 'src');
const reportPath = path.join(process.cwd(), '.aiox', 'reports', 'design-sweep-report.json');

const targetExtensions = ['.ts', '.tsx', '.css'];
let report = [];

function scanDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      scanDir(fullPath);
    } else {
      if (targetExtensions.includes(path.extname(fullPath))) {
        processFile(fullPath);
      }
    }
  }
}

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;
  const lines = content.split('\n');
  const fileReport = [];
  let fileChanged = false;

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    const originalLine = line;

    // Detect purples
    const purpleRegex = /\b(?:bg|text|border)-(?:purple|violet|fuchsia|indigo)-\d+(?:\/\d+)?\b/g;
    let match;
    while ((match = purpleRegex.exec(originalLine)) !== null) {
      const cls = match[0];
      let recommendation = 'primary';
      const lowerLine = line.toLowerCase();
      
      if (lowerLine.includes('insight') || lowerLine.includes('ai') || lowerLine.includes('recommend') || lowerLine.includes('suggest')) {
        recommendation = cls.startsWith('text-') ? 'text-insight' : cls.startsWith('bg-') ? 'bg-insight' : 'border-insight';
      } else if (lowerLine.includes('hover') || lowerLine.includes('btn') || lowerLine.includes('button') || lowerLine.includes('action')) {
        recommendation = cls.startsWith('text-') ? 'text-accent' : cls.startsWith('bg-') ? 'bg-accent' : 'border-accent';
      } else {
        recommendation = cls.startsWith('text-') ? 'text-primary' : cls.startsWith('bg-') ? 'bg-primary' : 'border-primary';
      }

      fileReport.push({
        line: i + 1,
        category: 'purple-family',
        severity: 'high',
        found: cls,
        recommendation,
        status: isApplyMode ? 'APPLIED' : 'SAFE_TO_APPLY'
      });

      if (isApplyMode) {
        line = line.replace(cls, recommendation);
      }
    }

    // Detect text-slate/gray
    const textGrayRegex = /\btext-(?:slate|gray)-\d+(?:\/\d+)?\b/g;
    while ((match = textGrayRegex.exec(originalLine)) !== null) {
      fileReport.push({
        line: i + 1,
        category: 'text-gray',
        severity: 'medium',
        found: match[0],
        recommendation: 'text-muted-foreground',
        status: isApplyMode ? 'APPLIED' : 'SAFE_TO_APPLY'
      });
      if (isApplyMode) line = line.replace(match[0], 'text-muted-foreground');
    }

    // Detect border-slate/gray
    const borderGrayRegex = /\bborder-(?:slate|gray)-\d+(?:\/\d+)?\b/g;
    while ((match = borderGrayRegex.exec(originalLine)) !== null) {
      fileReport.push({
        line: i + 1,
        category: 'border-gray',
        severity: 'low',
        found: match[0],
        recommendation: 'border-border',
        status: isApplyMode ? 'APPLIED' : 'SAFE_TO_APPLY'
      });
      if (isApplyMode) line = line.replace(match[0], 'border-border');
    }

    // Detect bg-slate/gray (AMBIGUOUS)
    const bgGrayRegex = /\bbg-(?:slate|gray)-\d+(?:\/\d+)?\b/g;
    while ((match = bgGrayRegex.exec(originalLine)) !== null) {
      fileReport.push({
        line: i + 1,
        category: 'bg-gray',
        severity: 'high',
        found: match[0],
        recommendation: 'TODO_VISUAL_REVIEW (bg-background, bg-surface, or bg-card)',
        status: 'AMBIGUOUS'
      });
      // WE DO NOT APPLY AMBIGUOUS BACKGROUNDS AUTOMATICALLY
    }

    // Detect HEX colors
    const hexRegex = /#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})\b/g;
    while ((match = hexRegex.exec(originalLine)) !== null) {
      // Ignore valid hex colors if they are standard white/black
      if (match[0].toLowerCase() === '#ffffff' || match[0].toLowerCase() === '#000000') continue;
      
      fileReport.push({
        line: i + 1,
        category: 'hex-color',
        severity: 'critical',
        found: match[0],
        recommendation: 'TODO_VISUAL_REVIEW',
        status: 'AMBIGUOUS'
      });
    }

    if (line !== lines[i]) {
      lines[i] = line;
      fileChanged = true;
    }
  }

  if (fileReport.length > 0) {
    report.push({
      file: filePath.replace(process.cwd() + '/', ''),
      occurrences: fileReport
    });
  }

  if (isApplyMode && fileChanged) {
    fs.writeFileSync(filePath, lines.join('\n'));
  }
}

console.log(`Starting Executive Design System Sweep (${isApplyMode ? 'APPLY MODE' : 'DRY RUN'})...`);
scanDir(srcDir);

fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
console.log(`Scan complete. Found issues in ${report.length} files.`);
console.log(`Report generated at: ${reportPath}`);
