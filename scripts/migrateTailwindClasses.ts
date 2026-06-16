import fs from 'node:fs';
import path from 'node:path';

const targetFiles = [
  'src/components/pages/governance/SovereignBoardPackPage.tsx',
  'src/components/pages/InstitutionalBoardPackPage.tsx'
];

function migrateFile(filePath: string) {
  const fullPath = path.resolve(filePath);
  if (!fs.existsSync(fullPath)) return;
  
  let content = fs.readFileSync(fullPath, 'utf-8');
  let originalContent = content;

  // Excellent / Success
  content = content.replace(/\btext-emerald-[0-9]+\b/g, 'text-[var(--color-state-excellent)]');
  content = content.replace(/\bborder-emerald-[0-9]+(?:\/[0-9]+)?\b/g, 'border-state-excellent-border');
  content = content.replace(/\bbg-emerald-[0-9]+(?:\/[0-9]+)?\b/g, 'bg-state-excellent-soft');
  content = content.replace(/\bbg-success-soft0(?:\/[0-9]+)?\b/g, 'bg-state-excellent-soft');
  
  // Warning / Amber
  content = content.replace(/\btext-amber-[0-9]+\b/g, 'text-[var(--color-state-warning)]');
  content = content.replace(/\bborder-amber-[0-9]+(?:\/[0-9]+)?\b/g, 'border-state-warning-border');
  content = content.replace(/\bbg-amber-[0-9]+(?:\/[0-9]+)?\b/g, 'bg-state-warning-soft');
  content = content.replace(/\bbg-warning-soft0(?:\/[0-9]+)?\b/g, 'bg-state-warning-soft');

  // Critical / Red
  content = content.replace(/\btext-red-[0-9]+\b/g, 'text-[var(--color-state-critical)]');
  content = content.replace(/\bborder-red-[0-9]+(?:\/[0-9]+)?\b/g, 'border-state-critical-border');
  content = content.replace(/\bbg-red-[0-9]+(?:\/[0-9]+)?\b/g, 'bg-state-critical-soft');

  // Healthy / Blue
  content = content.replace(/\btext-blue-[0-9]+\b/g, 'text-[var(--color-state-healthy)]');
  content = content.replace(/\bborder-blue-[0-9]+(?:\/[0-9]+)?\b/g, 'border-state-healthy-border');
  content = content.replace(/\bbg-blue-[0-9]+(?:\/[0-9]+)?\b/g, 'bg-state-healthy-soft');

  // Text specific for foregrounds (dark:text-red-400 -> dark:text-[var(--color-state-critical)])
  // Wait, the above regex `\btext-emerald-[0-9]+\b` handles dark:text-emerald-400 correctly because it matches text-emerald-400.
  // Wait, let's also remove dark: classes where we use semantic tokens that adapt automatically.
  // Actually, keeping `dark:text-[var(--color-state-critical)]` is fine if `text-[...]` is used, but semantic tokens adapt automatically!
  // So `text-red-600 dark:text-red-400` -> `text-[var(--color-state-critical)] dark:text-[var(--color-state-critical)]`
  // That is redundant but harmless. Let's clean it up later if needed.

  if (content !== originalContent) {
    fs.writeFileSync(fullPath, content, 'utf-8');
    console.log(`Migrated tailwind classes in ${filePath}`);
  } else {
    console.log(`No changes needed in ${filePath}`);
  }
}

targetFiles.forEach(migrateFile);
