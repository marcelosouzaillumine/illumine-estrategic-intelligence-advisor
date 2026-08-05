import { describe, it, expect, beforeEach } from 'vitest';
import { ExecutiveMemoryStore } from '../ExecutiveMemoryStore';
import { MemoryLifecycleStatus } from '../contracts/ExecutiveMemoryArtifact';

describe('ExecutiveMemoryStore', () => {
  let store: ExecutiveMemoryStore;

  beforeEach(() => {
    store = new ExecutiveMemoryStore();
  });

  it('should persist and expire memories properly', () => {
    const artifact: any = { id: 'm1', lifecycle: { status: MemoryLifecycleStatus.ACTIVE } };
    
    store.saveToLongTerm(artifact);
    expect(store.getActiveLongTermMemories().length).toBe(1);

    store.expireArtifact('m1');
    expect(store.getActiveLongTermMemories().length).toBe(0);
  });
});
