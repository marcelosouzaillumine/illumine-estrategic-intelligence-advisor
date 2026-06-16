import { describe, it } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';

describe('DRE Board Card No Duplication Contract', () => {
  it('must not pass statusBadge to ExecutiveDecisionPanel in DREBoardDecisionSupportSection', () => {
    const sectionPath = path.join(process.cwd(), 'src/components/pages/dre/DREBoardDecisionSupportSection.tsx');
    
    if (!fs.existsSync(sectionPath)) {
      return; // file doesn't exist, ignore
    }

    const content = fs.readFileSync(sectionPath, 'utf-8');
    
    if (content.includes('statusBadge={')) {
      assert.fail('DREBoardDecisionSupportSection.tsx still passes statusBadge, causing duplication of response text before and after the confidence score.');
    }
  });
});
