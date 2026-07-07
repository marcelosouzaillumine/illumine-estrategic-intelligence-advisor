import test from 'node:test';
import assert from 'node:assert';
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

test('Design Token Sovereignty - Visual Registry is unique', () => {
  const cssFiles = getFilesRecursively('src', '.css');
  assert.strictEqual(cssFiles.length, 1, `There must be exactly one CSS file (src/index.css), found: ${cssFiles.join(', ')}`);
  assert.ok(cssFiles[0].endsWith('index.css'), 'The only CSS file must be index.css');
});

test('Design Token Sovereignty - No multiple registries', () => {
  const rootFiles = fs.readdirSync('.');
  const tailwindConfigs = rootFiles.filter(f => f.startsWith('tailwind.config'));
  assert.strictEqual(tailwindConfigs.length, 0, 'tailwind.config files are forbidden. Use src/index.css @theme directive instead.');
});

test('Design Token Sovereignty - No inline color styles or hardcoded hex colors', () => {
  const tsxFiles = getFilesRecursively('src', '.tsx').filter(f => !f.includes('/pdf/') && !f.includes('\\pdf\\'));
  
  // Exclude some test utility files or SVGs if they legitimately need it, but the goal is 0.
  // For now, strict check on all TSX.
  const hexColorRegex = /#[0-9A-Fa-f]{3,6}\b/g;
  const inlineStyleRegex = /style=\{\{[^}]*(color|background|backgroundColor|borderColor)\s*:\s*['"]([^'"]+)['"]/g;
  
  let hexViolations: string[] = [];
  let inlineStyleViolations: string[] = [];

  for (const file of tsxFiles) {
    const content = fs.readFileSync(file, 'utf-8');
    
    // Check for inline styles with colors
    const inlineMatches = [...content.matchAll(inlineStyleRegex)];
    for (const match of inlineMatches) {
        const val = match[2];
        if (val.startsWith('#') || val.startsWith('rgb') || val.startsWith('hsl')) {
            inlineStyleViolations.push(`${file}: ${match[0]}`);
        }
    }

    // Check for raw hex colors in code (e.g. fill="#FF0000")
    // We avoid matching things inside classNames arbitrarily, but mostly # is used for colors.
    // Also avoid matching URL fragments (href="#something")
    const lines = content.split('\n');
    lines.forEach((line, index) => {
        if (line.includes('href="') || line.includes("href='") || line.includes('`#')) return;
        
        const hexMatches = line.match(hexColorRegex);
        if (hexMatches) {
            // Check if it's not a var(--...) definition (though we are in TSX)
            hexViolations.push(`${file}:${index + 1} -> ${hexMatches.join(', ')}`);
        }
    });
  }

  // We are currently doing a gradual migration, so we will not fail the build immediately if there are legacy violations,
  // BUT the phase 7 requires it to fail. The sprint is not complete until this passes.
  assert.strictEqual(inlineStyleViolations.length, 0, 'Found inline color styles:\n' + inlineStyleViolations.join('\n'));
  
  assert.strictEqual(hexViolations.length, 0, 'Found hardcoded hex colors:\n' + hexViolations.join('\n'));
});

test('Design Token Sovereignty - Charts must use Universal Chart Palette', () => {
  const tsxFiles = getFilesRecursively('src', '.tsx').filter(f => !f.includes('/pdf/') && !f.includes('\\pdf\\'));
  let chartViolations: string[] = [];

  for (const file of tsxFiles) {
    const content = fs.readFileSync(file, 'utf-8');
    
    const lines = content.split('\n');
    lines.forEach((line, index) => {
        // Enforce that charts (identified by Recharts components)
        // do not use the institutional state palette (var(--color-state-*)) but instead use var(--chart-*)
        if (line.match(/<(Line|Bar|Area|Pie|Radar|Scatter|Cell|ReferenceLine)\b[^>]*\b(stroke|fill)=/) && line.includes('var(--color-state-')) {
            chartViolations.push(`${file}:${index + 1} -> ${line.trim()}`);
        }
    });
  }

  assert.strictEqual(chartViolations.length, 0, 'Charts must use var(--chart-*) instead of var(--color-state-*):\n' + chartViolations.join('\n'));
});
