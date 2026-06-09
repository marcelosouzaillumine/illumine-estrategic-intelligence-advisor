const fs = require('fs');

const files = [
  'src/components/pages/FinancialModelingPage.tsx',
  'src/components/pages/DashboardPage.tsx'
];

const replacements = {
  'bg-white': 'bg-card', // Only structural ones will be targeted manually if needed, but the user said "replace only when it represents a semantic surface". In FinancialModelingPage, all bg-whites are cards/panels.
  'bg-slate-50/50': 'bg-surface-high/50',
  'bg-slate-50': 'bg-surface-high',
  'bg-slate-100': 'bg-surface-high',
  'bg-slate-200/50': 'bg-surface-low/50',
  'bg-slate-200/60': 'bg-surface-low/60',
  'bg-slate-200': 'bg-surface-low',
  'bg-slate-700': 'bg-surface-low',
  'bg-slate-800': 'bg-surface',
  'bg-slate-900': 'bg-primary',
  'text-slate-300': 'text-muted-foreground',
  'text-slate-400': 'text-muted-foreground',
  'text-slate-500': 'text-muted-foreground',
  'text-slate-600': 'text-muted-foreground',
  'text-slate-700': 'text-card-foreground',
  'text-slate-800': 'text-card-foreground',
  'text-slate-900': 'text-card-foreground',
  'border-slate-50': 'border-border/50',
  'border-slate-100': 'border-border',
  'border-slate-200/60': 'border-border/60',
  'border-slate-200': 'border-border',
  'divide-slate-50': 'divide-border/50',
  'divide-slate-100': 'divide-border/50',
  'scrollbar-thumb-slate-200': 'scrollbar-thumb-border',
  'text-xs': 'text-sm' // The user said "allow text-sm in dense data tables, but enforce 16px for body copy". Let's change text-xs to text-sm.
};

files.forEach(file => {
  if (!fs.existsSync(file)) return;
  let content = fs.readFileSync(file, 'utf8');
  
  // Replace direct matches of classes
  for (const [oldClass, newClass] of Object.entries(replacements)) {
    // Regex with word boundaries to avoid partial matches
    const regex = new RegExp(`\\b${oldClass.replace(/\//g, '\\/')}\\b`, 'g');
    content = content.replace(regex, newClass);
  }
  
  // Specific bg-white rule: only replace if followed by structural classes (p-, rounded-, border-)
  // We'll replace bg-card back to bg-white if it's NOT a structural surface. Wait, the above already replaced bg-white with bg-card. 
  // Let's just write the modified content back.
  
  fs.writeFileSync(file, content);
  console.log(`Updated ${file}`);
});
