import { describe, it, expect } from 'vitest';
import { KnowledgeVersionManager } from '../registry/KnowledgeVersionManager';

describe('KnowledgeCompatibility', () => {
  it('should allow packs requiring an ontology version equal to or lower than the active one', () => {
    const manager = new KnowledgeVersionManager();
    const isCompatible = manager.isOntologyCompatible('1.0.0', '1.0.0');
    expect(isCompatible).toBe(true);

    const isCompatible2 = manager.isOntologyCompatible('1.0.0', '1.1.0');
    expect(isCompatible2).toBe(true);
  });

  it('should block packs requiring a higher ontology version than the active one', () => {
    const manager = new KnowledgeVersionManager();
    const isCompatible = manager.isOntologyCompatible('2.0.0', '1.5.0');
    expect(isCompatible).toBe(false);
  });
});
