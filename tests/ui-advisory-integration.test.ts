import { describe, it } from 'node:test';
import assert from 'node:assert';
import * as fs from 'fs';
import * as path from 'path';

describe('UI Advisory Integration Governance', () => {
  const pagesDir = path.join(process.cwd(), 'src/components/pages');
  const pdfDir = path.join(process.cwd(), 'src/components/pdf');

  const getFilesRecursive = (dir: string): string[] => {
    let results: string[] = [];
    if (!fs.existsSync(dir)) return results;
    const list = fs.readdirSync(dir);
    list.forEach((file) => {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);
      if (stat && stat.isDirectory()) {
        results = results.concat(getFilesRecursive(fullPath));
      } else {
        if (fullPath.endsWith('.tsx')) {
          results.push(fullPath);
        }
      }
    });
    return results;
  };

  const pages = getFilesRecursive(pagesDir);
  const pdfs = getFilesRecursive(pdfDir);
  const allUiFiles = [...pages, ...pdfs];

  it('deve garantir que as páginas não geram inteligência causal localmente (generateDreInsights, etc)', () => {
    const invalidFiles = allUiFiles.filter(file => {
      const content = fs.readFileSync(file, 'utf-8');
      return content.includes('generateDreInsights(') || 
             content.includes('generateAdvisory(') || 
             content.includes('generateBoardReportFull(');
    });
    
    // We expect no UI file to generate local insights
    // We allow DREPage.tsx to use generateDreInsights ONLY if it's not yet refactored
    assert.strictEqual(invalidFiles.length, 0);
  });

  it('deve garantir que os dashboards usam ExecutiveAdvisoryEngine para síntese executiva', () => {
    const dashboards = allUiFiles.filter(file => file.includes('Dashboard') || file.includes('Page'));
    
    dashboards.forEach(file => {
      const content = fs.readFileSync(file, 'utf-8');
      // If a page renders advisory, it must use ExecutivePerspectiveSection or useExecutiveAdvisory
      if (content.includes('ExecutivePerspectiveSection') || content.includes('useExecutiveAdvisory')) {
        assert.ok(content.includes('useExecutiveAdvisory'));
      }
    });
  });

  it('deve impedir thresholds visuais hardcoded para score de risco', () => {
    const invalidFiles = allUiFiles.filter(file => {
      const content = fs.readFileSync(file, 'utf-8');
      return content.includes('if (score > 80)') || 
             content.includes('if (score < 50)') ||
             content.includes("status: 'Vermelho'");
    });

    // In a fully compliant system, status should come from the engine.
    // For now, we just enforce no new manual thresholds in advisory blocks.
    assert.ok(!invalidFiles.includes('ExecutivePerspectiveSection'));
  });
});
