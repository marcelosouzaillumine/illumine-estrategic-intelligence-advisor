import { describe, it } from 'node:test';
import assert from 'node:assert';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('Canonical Enforcement Tests', () => {
  const componentDir = path.join(__dirname, '../src/components');
  
  const readAllFiles = (dir: string, fileList: string[] = []) => {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const filePath = path.join(dir, file);
      if (fs.statSync(filePath).isDirectory()) {
        readAllFiles(filePath, fileList);
      } else if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
        fileList.push(filePath);
      }
    }
    return fileList;
  };

  const allFiles = readAllFiles(componentDir);

  it('No raw English statuses in UI badges', () => {
    for (const file of allFiles) {
      const content = fs.readFileSync(file, 'utf-8');
      
      const manualBadgePattern = /<span[^>]*>(CRITICAL|WARNING|HEALTHY|EXCELLENT|NEUTRAL)<\/span>/i;
      const match = content.match(manualBadgePattern);
      
      if (match) {
        assert.fail(`Found manual English status badge in UI at ${file}: ${match[0]}`);
      }
    }
  });

  it('No hardcoded NaN or undefined text fallbacks', () => {
    for (const file of allFiles) {
      const content = fs.readFileSync(file, 'utf-8');
      
      const nanFallbackPattern = />NaN<\/|>undefined<\/|>null<\//i;
      const match = content.match(nanFallbackPattern);
      
      if (match) {
        assert.fail(`Found hardcoded NaN/undefined/null UI text in ${file}: ${match[0]}`);
      }
    }
  });

  it('No hardcoded ExecutiveStatusBadge colors', () => {
    for (const file of allFiles) {
      const content = fs.readFileSync(file, 'utf-8');
      
      if (file.includes('executive-status-badge.tsx')) continue;
      
      const hardcodedBadgeColorPattern = /className="[^"]*(bg-(rose|emerald|amber|slate|blue)-[0-9]+)[^"]*"[^>]*>(CRITICAL|WARNING|HEALTHY|EXCELLENT|NEUTRAL)/i;
      const match = content.match(hardcodedBadgeColorPattern);
      
      if (match) {
        assert.fail(`Found hardcoded UI badge colors bypassing canonical component in ${file}: ${match[0]}`);
      }
    }
  });

  it('No functional text with low opacity (< 70%) in executive cards and BP sections', () => {
    const targetFiles = allFiles.filter(f => 
      f.includes('executive-health-summary-card.tsx') || 
      f.includes('executive-metric-card.tsx') || 
      f.includes('pages/balance-sheet/')
    );

    for (const file of targetFiles) {
      const content = fs.readFileSync(file, 'utf-8');
      
      const lowOpacityPattern = /(text-muted-foreground\/40|text-muted-foreground\/50|text-foreground\/40|text-foreground\/50|opacity-40|opacity-50)/i;
      const match = content.match(lowOpacityPattern);
      
      if (match) {
        assert.fail(`Found functional text with low opacity (${match[1]}) in ${file}, which violates the Executive Contrast rule.`);
      }
    }
  });
  
  it('ExecutiveMetricCard only accepts ExecutiveStatusBadge rendering', () => {
    // We already refactored ExecutiveMetricCard to wrap strings in ExecutiveStatusBadge.
    // Check that ExecutiveMetricCard imports ExecutiveStatusBadge.
    const metricCardPath = allFiles.find(f => f.endsWith('executive-metric-card.tsx'));
    if (metricCardPath) {
      const content = fs.readFileSync(metricCardPath, 'utf-8');
      assert.ok(content.includes('import { ExecutiveStatusBadge }'));
      assert.ok(content.includes('<ExecutiveStatusBadge'));
    }
  });

  it('BalanceSheet components use standard metric mappings', () => {
    const bpSection = allFiles.find(f => f.endsWith('BalanceSheetCapitalPreservationSection.tsx'));
    if (bpSection) {
      const content = fs.readFileSync(bpSection, 'utf-8');
      assert.ok(content.includes('ExecutiveMetricCard'));
      // Ensure NaN is stripped in formatting
      assert.ok(!content.includes('return NaN'));
    }
  });
});
