const fs = require('fs');

const files = process.argv.slice(2);

const replacements = {
  'bg-white': 'bg-card',
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
  'text-xs': 'text-sm'
};

files.forEach(file => {
  if (!fs.existsSync(file)) return;
  let content = fs.readFileSync(file, 'utf8');
  let original = content;
  
  for (const [oldClass, newClass] of Object.entries(replacements)) {
    const regex = new RegExp(`\\b${oldClass.replace(/\//g, '\\/')}\\b`, 'g');
    content = content.replace(regex, newClass);
  }
  
  // Clean up bg-card where it might not be structural
  content = content.replace(/bg-card\/60/g, 'bg-surface/60');
  content = content.replace(/bg-card\/30/g, 'bg-surface/30');
  
  if (content !== original) {
    fs.writeFileSync(file, content);
    console.log(`Updated ${file}`);
  }
});
