import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

describe('@illumine/governance (Wave 17 Phase 6 Executive Journey Personalization)', () => {
  it('should verify EXECUTIVE_INTERACTION_MODEL.md details personas CEO, Diretor, Conselheiro, Controller and Advisor', () => {
    const docPath = path.resolve(process.cwd(), 'docs/architecture/product/EXECUTIVE_INTERACTION_MODEL.md');
    const content = fs.readFileSync(docPath, 'utf-8');

    expect(content).toContain('CEO');
    expect(content).toContain('Conselheiro');
    expect(content).toContain('Controller');
    expect(content).toContain('Advisor');
  });
});
