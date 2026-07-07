const fs = require('fs');

const files = [
  'src/components/pages/public/EmpresasPage.tsx',
  'src/components/pages/public/ReferralProgramPage.tsx',
  'src/components/pages/public/LoginPage.tsx',
  'src/components/pages/governance/GovernanceKnowledgePanel.tsx',
  'src/components/pages/governance/ObservabilityConsolePage.tsx'
];

// Mappings for specific colors based on user instructions
// #FF8552 (orange/primary)
// #03080F, #02050A, #060D17, #040911, #010204 (dark blues/blacks -> background/surface)
// #10b981 (green -> success)
// #f59e0b (amber/orange -> warning)
// #ef4444 (red -> critical)

for (const file of files) {
  if (!fs.existsSync(file)) continue;
  let content = fs.readFileSync(file, 'utf-8');

  // Replace specific styles with classNames where possible
  // E.g. style={{ backgroundColor: '#03080F' }} -> className="bg-surface-default"
  content = content.replace(/style=\{\{\s*backgroundColor:\s*['"]#0[1-9A-Fa-f][0-9A-Fa-f]{4}['"]\s*\}\}/gi, 'className="bg-surface-default"');
  content = content.replace(/style=\{\{\s*backgroundColor:\s*['"]#FF8552['"]\s*\}\}/gi, 'className="bg-executive-primary"'); // assuming this exists, or surface
  content = content.replace(/style=\{\{\s*color:\s*['"]#FF8552['"]\s*\}\}/gi, 'className="text-executive-primary"');
  
  // Clean up any remaining style={{ backgroundColor: ... }} that matched the dark colors
  content = content.replace(/style=\{\{\s*backgroundColor:\s*['"]#[0-9a-fA-F]{6}['"]\s*\}\}/g, 'className="bg-surface-container"');

  // SVG fill and stroke replacements
  // #FF8552 -> text-executive-primary (for text/fill)
  content = content.replace(/fill=['"]#ff8552['"]/gi, 'fill="var(--color-executive-primary)"');
  content = content.replace(/stroke=['"]#ff8552['"]/gi, 'stroke="var(--color-executive-primary)"');
  
  // Dark colors fill/stroke
  content = content.replace(/fill=['"]#0[0-9a-fA-F]{5}['"]/gi, 'fill="var(--color-background)"');
  content = content.replace(/stroke=['"]#0[0-9a-fA-F]{5}['"]/gi, 'stroke="var(--color-background)"');

  // State colors (KnowledgePanel & Observability)
  content = content.replace(/fill=['"]#10b981['"]/gi, 'className="fill-success text-success"');
  content = content.replace(/fill=['"]#f59e0b['"]/gi, 'className="fill-warning text-warning"');
  content = content.replace(/fill=['"]#ef4444['"]/gi, 'className="fill-critical text-critical"');
  content = content.replace(/fill=['"]#9ca3af['"]/gi, 'className="fill-executive-secondary text-executive-secondary"');
  
  // Any stray text colors (e.g. text-[#FF8552])
  content = content.replace(/text-\[#FF8552\]/gi, 'text-executive-primary');
  content = content.replace(/text-\[#10b981\]/gi, 'text-success');
  content = content.replace(/text-\[#f59e0b\]/gi, 'text-warning');
  content = content.replace(/text-\[#ef4444\]/gi, 'text-critical');
  content = content.replace(/bg-\[#10b981\]/gi, 'bg-success');
  content = content.replace(/bg-\[#f59e0b\]/gi, 'bg-warning');
  content = content.replace(/bg-\[#ef4444\]/gi, 'bg-critical');

  // Hardcoded hex in style blocks that couldn't be regexed purely
  // Fallback replace for raw #FF8552 in inline styles
  content = content.replace(/#FF8552/gi, 'var(--color-executive-primary)');
  content = content.replace(/#10b981/gi, 'var(--color-success)');
  content = content.replace(/#f59e0b/gi, 'var(--color-warning)');
  content = content.replace(/#f97316/gi, 'var(--color-warning)');
  content = content.replace(/#ef4444/gi, 'var(--color-critical)');
  content = content.replace(/#9ca3af/gi, 'var(--color-executive-muted)');
  content = content.replace(/#1f2937/gi, 'var(--color-surface-container)');
  content = content.replace(/#334155/gi, 'var(--color-border)');
  content = content.replace(/#e2e8f0/gi, 'var(--color-executive-secondary)');
  content = content.replace(/#0[0-9a-f]{5}/gi, 'var(--color-background)'); // dark blues
  
  fs.writeFileSync(file, content);
}
console.log('Hex replaced');
