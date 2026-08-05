import { ExecutiveMemoryArtifact, MemoryLifecycleStatus } from './contracts/ExecutiveMemoryArtifact';

export class ExecutiveMemoryStore {
  // Simulating a database for long-term and short-term memory
  private shortTermMemory: ExecutiveMemoryArtifact[] = []; // Current session
  private longTermMemory: ExecutiveMemoryArtifact[] = [];  // Persistent

  public saveToShortTerm(artifact: ExecutiveMemoryArtifact): void {
    this.shortTermMemory.push(artifact);
  }

  public saveToLongTerm(artifact: ExecutiveMemoryArtifact): void {
    this.longTermMemory.push(artifact);
  }

  public getActiveLongTermMemories(): ExecutiveMemoryArtifact[] {
    return this.longTermMemory.filter(m => m.lifecycle.status === MemoryLifecycleStatus.ACTIVE);
  }

  public getSessionMemories(): ExecutiveMemoryArtifact[] {
    return [...this.shortTermMemory];
  }

  public clearShortTerm(): void {
    this.shortTermMemory = [];
  }

  public expireArtifact(id: string): void {
    const artifact = this.longTermMemory.find(a => a.id === id);
    if (artifact) {
      artifact.lifecycle.status = MemoryLifecycleStatus.ARCHIVED;
    }
  }

  public resolveArtifact(id: string): void {
    const artifact = this.longTermMemory.find(a => a.id === id);
    if (artifact) {
      artifact.lifecycle.status = MemoryLifecycleStatus.RESOLVED;
    }
  }
}
