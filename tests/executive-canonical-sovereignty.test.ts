import test from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';

function getFilesRecursively(dir: string, ext: string): string[] {
  let results: string[] = [];
  if (!fs.existsSync(dir)) return results;
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

test('Executive Canonical Sovereignty - No custom badges in tsx', () => {
  const tsxFiles = getFilesRecursively('src', '.tsx').filter(f => !f.includes('/ui/executive-status-badge.tsx') && !f.includes('\\ui\\executive-status-badge.tsx') && !f.includes('/pdf/'));
  
  let customBadgeViolations: string[] = [];
  
  // Look for inline badges mimicking the canonical one: rounded-full + text-xs + px- + py-
  const customBadgeRegex = /className=["'`][^"'`]*rounded-full[^"'`]*px-[0-9][^"'`]*py-[0-9][^"'`]*text-(xs|sm|\[10px\])[^"'`]*["'`]/;
  // Look for arbitrary span/div with status colors manually assigned
  const manualStatusColorRegex = /className=["'`][^"'`]*bg-state-(excellent|warning|critical|healthy)-soft[^"'`]*text-state-/;

  for (const file of tsxFiles) {
    const content = fs.readFileSync(file, 'utf-8');
    const lines = content.split('\n');
    lines.forEach((line, index) => {
      if (customBadgeRegex.test(line) || manualStatusColorRegex.test(line)) {
        // Skip some specific allowed places like charts Tooltips if they accidentally match
        if (line.includes('Tooltip') || file.includes('Chart')) return;
        customBadgeViolations.push(`${file}:${index + 1} -> ${line.trim()}`);
      }
    });
  }

  // Permite 0 violações
  assert.strictEqual(customBadgeViolations.length, 0, 'Found custom badges bypassing ExecutiveStatusBadge:\n' + customBadgeViolations.join('\n'));
});

test('Executive Canonical Sovereignty - No opaque or muted scores in HealthSummaryCard', () => {
  const file = path.join('src', 'components', 'ui', 'executive-health-summary-card.tsx');
  if (!fs.existsSync(file)) return;
  const content = fs.readFileSync(file, 'utf-8');
  
  // The Score should use ExecutiveMetric heroMetric and MUST NOT have opaque/muted classes
  assert.ok(content.includes('variant="heroMetric"') || (content.includes('text-4xl') && content.includes('font-black') && content.includes('text-foreground')), 'Score must use heroMetric or text-4xl font-black');
  assert.ok(!content.match(/variant="heroMetric"[^>]*text-executive-muted/), 'Score must not use muted');
  assert.ok(!content.match(/variant="heroMetric"[^>]*opacity-(50|60|70|80|90|0)/), 'Score must not have reduced opacity');
});

test('Executive Canonical Sovereignty - Value strings in MetricCard must not be concatenated (AST check)', () => {
  const tsxFiles = getFilesRecursively('src', '.tsx');
  let complexValueViolations: string[] = [];

  for (const file of tsxFiles) {
    const content = fs.readFileSync(file, 'utf-8');
    const lines = content.split('\n');
    
    // Simplistic check for <ExecutiveMetricCard ... value={"alguma string com | ou - ou :"} />
    // We check if value is passed as a string literal or expression containing forbidden separators
    // We already added a runtime error, but we want the test to fail.
    
    let insideCard = false;
    let label = '';
    
    for (let i=0; i<lines.length; i++) {
        const line = lines[i];
        if (line.includes('<ExecutiveMetricCard')) {
            insideCard = true;
        }
        if (insideCard && line.includes('label=')) {
            const m = line.match(/label=["'{]([^"'}]*)["'}]/);
            if (m) label = m[1];
        }
        if (insideCard && line.includes('value=')) {
            // Check if value receives a complex string directly like value="Alto | Risco" or value={`Alto - ${var}`}
            if (line.match(/value=["'`][^"'`]*[|:][^"'`]*["'`]/)) {
                // Allows timestamps like 12:00, but general concatenations should be avoided
                if (!line.match(/\d{2}:\d{2}/)) {
                   complexValueViolations.push(`${file}:${i + 1} -> ${line.trim()}`);
                }
            }
        }
        if (insideCard && line.includes('/>')) {
            insideCard = false;
            label = '';
        }
    }
  }

  assert.strictEqual(complexValueViolations.length, 0, 'Found ExecutiveMetricCard with complex concatenated value strings. Move secondary data to description:\n' + complexValueViolations.join('\n'));
});

test('Executive Canonical Sovereignty - Subtitle Contrast Enforcement (Hotfix v1.1)', () => {
  const tsxFiles = getFilesRecursively('src/components', '.tsx');
  let subtitleViolations: string[] = [];

  const forbiddenMuted = ['text-muted', 'text-muted-foreground'];
  const forbiddenAccent = ['text-secondary'];
  const forbiddenAbsoluteColors = ['text-gray-', 'text-slate-', 'text-zinc-'];
  const forbiddenOpacity = ['opacity-'];
  
  const allowedMetadataClasses = ['text-xs', 'text-[10px]', 'text-[11px]', 'text-[12px]'];
  
  // Target only Executive, Pages, and specific semantic components
  const targetFiles = tsxFiles.filter(f => {
    const name = path.basename(f).toLowerCase();
    return name.startsWith('executive-') || 
           name.startsWith('balancesheet') || 
           name.startsWith('dre') ||
           name.startsWith('dlpa') ||
           name.startsWith('dfc') ||
           name.startsWith('semantic-') ||
           name.includes('page');
  });

  for (const file of targetFiles) {
    const content = fs.readFileSync(file, 'utf-8');
    const lines = content.split('\n');
    
    lines.forEach((line, index) => {
      // 1. Reprovar text-secondary (accent) em subtítulos executivos
      if (forbiddenAccent.some(c => line.includes(c))) {
        if (line.includes('<p') || line.includes('subtitle') || line.includes('description') || line.includes('summary')) {
          subtitleViolations.push(`${file}:${index + 1} -> [USO DE ACCENT text-secondary] ${line.trim()}`);
        }
      }

      // 2. Reprovar opacity-* em textos
      if (forbiddenOpacity.some(c => line.includes(c)) && (line.includes('<p') || line.includes('<h') || line.includes('<span'))) {
        // Ignorar SVG paths, gradients ou ícones onde opacidade é normal
        if (!line.includes('<svg') && !line.includes('<path') && !line.includes('<stop')) {
          subtitleViolations.push(`${file}:${index + 1} -> [USO DE OPACITY EM TEXTO] ${line.trim()}`);
        }
      }

      // 3. Reprovar cores absolutas (gray, slate, zinc)
      if (forbiddenAbsoluteColors.some(c => line.includes(c))) {
        subtitleViolations.push(`${file}:${index + 1} -> [USO DE COR ABSOLUTA] ${line.trim()}`);
      }

      // 4. Reprovar muted para narrativas
      if (forbiddenMuted.some(c => line.includes(c))) {
        const isMetadata = allowedMetadataClasses.some(c => line.includes(c));
        const isHelper = line.toLowerCase().includes('placeholder') || line.toLowerCase().includes('breadcrumb') || line.toLowerCase().includes('caption');
        const isIcon = line.includes('<') && line.includes('w-') && line.includes('h-') && line.match(/<[A-Z][A-Za-z0-9]* /);

        if (!isMetadata && !isHelper && !isIcon) {
          if (line.includes('<p') || line.includes('<h') || line.includes('text-sm') || line.includes('text-base') || line.includes('text-[14px]') || line.includes('text-[16px]')) {
            subtitleViolations.push(`${file}:${index + 1} -> [USO DE MUTED EM NARRATIVA] ${line.trim()}`);
          }
        }
      }
    });
  }

  assert.strictEqual(subtitleViolations.length, 0, 'Found Executive Subtitles/Narratives using forbidden classes. Use text-executive-secondary instead:\n' + subtitleViolations.join('\n'));
});
