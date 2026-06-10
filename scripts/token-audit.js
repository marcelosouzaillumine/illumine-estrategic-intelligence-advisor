// token-audit.js
// Simple token audit script for Illumine Governance design tokens
// Scans src/index.css for CSS variable definitions and outputs a JSON report.
// This script is for internal reference only; the generated report should not be committed.

const fs = require('fs');
const path = require('path');

const cssPath = path.resolve(__dirname, '../src/index.css');
const reportPath = path.resolve(__dirname, 'design-token-audit.json');

function extractTokens(content) {
  const tokenLines = content.split('\n').filter(line => line.trim().startsWith('--'));
  const tokens = tokenLines.map(line => {
    const match = line.trim().match(/^(--[\w-]+):\s*([^;]+);/);
    if (match) {
      return { name: match[1], value: match[2].trim() };
    }
    return null;
  }).filter(Boolean);
  return tokens;
}

try {
  const cssContent = fs.readFileSync(cssPath, 'utf8');
  const tokens = extractTokens(cssContent);
  const report = {
    generatedAt: new Date().toISOString(),
    tokenCount: tokens.length,
    tokens,
    notes: "This report is for reference only and should not be committed."
  };
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), 'utf8');
  console.log('Design token audit report generated at', reportPath);
} catch (err) {
  console.error('Error during token audit:', err);
  process.exit(1);
}
