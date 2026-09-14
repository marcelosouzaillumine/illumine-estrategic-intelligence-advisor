import fs from 'fs';
import path from 'path';
import { GovernanceMemoryEvent } from '../models/GovernanceMemoryEvent';

export class MemoryTimelineEngine {
  constructor(private readonly workspaceRoot: string) {}

  async appendEvent(event: GovernanceMemoryEvent): Promise<void> {
    const dir = path.join(this.workspaceRoot, 'artifacts', 'architecture-memory');
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    const dest = path.join(dir, 'timeline.jsonl');
    fs.appendFileSync(dest, JSON.stringify(event) + '\n', 'utf-8');
  }

  async getTimeline(): Promise<GovernanceMemoryEvent[]> {
    const dest = path.join(this.workspaceRoot, 'artifacts', 'architecture-memory', 'timeline.jsonl');
    if (!fs.existsSync(dest)) return [];
    
    const content = fs.readFileSync(dest, 'utf-8');
    return content.split('\n').filter(l => l.trim()).map(l => JSON.parse(l));
  }
}
