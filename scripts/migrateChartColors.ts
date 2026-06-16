import fs from 'node:fs';
import path from 'node:path';

function getFilesRecursively(dir: string, ext: string): string[] {
  let results: string[] = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getFilesRecursively(filePath, ext));
    } else if (file.endsWith(ext)) {
      results.push(filePath);
    }
  }
  return results;
}

const map: Record<string, string> = {
  'var(--color-state-excellent)': 'var(--chart-positive)',
  'var(--color-state-healthy)': 'var(--chart-positive)',
  'var(--color-state-critical)': 'var(--chart-negative)',
  'var(--color-state-warning)': 'var(--chart-warning)',
  'var(--color-state-neutral)': 'var(--chart-neutral)',
  'var(--color-state-insufficient)': 'var(--chart-neutral)',
  'var(--color-primary)': 'var(--chart-primary)',
  'var(--color-accent)': 'var(--chart-secondary)',
};

function migrateCharts() {
  const tsxFiles = getFilesRecursively('src', '.tsx').filter(f => !f.includes('/pdf/') && !f.includes('\\pdf\\'));
  let migratedCount = 0;

  for (const file of tsxFiles) {
    let content = fs.readFileSync(file, 'utf-8');
    let originalContent = content;

    // Check if file seems to have recharts
    if (!content.includes('recharts') && !content.includes('Chart')) continue;

    // We only replace inside stroke="..." or fill="..." or style={{ fill: '...' }}
    // A simpler way: we just find lines with `stroke=` or `fill=` or `color:` and replace any known variable.
    // Let's use a regex that matches `var(--color-...)`
    
    const lines = content.split('\n');
    let changed = false;
    
    for (let i = 0; i < lines.length; i++) {
        let line = lines[i];
        if (line.includes('stroke=') || line.includes('fill=')) {
            for (const [oldVar, newVar] of Object.entries(map)) {
                if (line.includes(oldVar)) {
                    lines[i] = line.split(oldVar).join(newVar);
                    changed = true;
                }
            }
        }
    }

    if (changed) {
      fs.writeFileSync(file, lines.join('\n'), 'utf-8');
      migratedCount++;
    }
  }

  console.log(`Migrated ${migratedCount} files to Universal Chart Palette.`);
}

migrateCharts();
