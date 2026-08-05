import { describe, it, expect, beforeEach } from 'vitest';
import { ExecutiveMemoryClassifier } from '../ExecutiveMemoryClassifier';
import { MemoryType } from '../contracts/ExecutiveMemoryArtifact';

describe('ExecutiveMemoryClassifier', () => {
  let classifier: ExecutiveMemoryClassifier;

  beforeEach(() => {
    classifier = new ExecutiveMemoryClassifier();
  });

  it('should ignore chat noise', () => {
    const memory = classifier.classify('Ok, entendido', 'User');
    expect(memory).toBeNull();
  });

  it('should classify a decision properly', () => {
    const memory = classifier.classify('Foi decidido investir na expansão.', 'User');
    expect(memory).toBeDefined();
    expect(memory!.type).toBe(MemoryType.DECISION_CONTEXT);
  });
});
