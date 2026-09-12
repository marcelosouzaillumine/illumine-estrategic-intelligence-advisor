import fs from 'fs';
import path from 'path';
import { EvolutionSnapshot } from '../models/index';

export class EvolutionSnapshotGenerator {
  constructor(private readonly workspaceRoot: string) {}

  async generate(snapshot: EvolutionSnapshot): Promise<void> {
    const dir = path.join(this.workspaceRoot, 'artifacts', 'architecture-governance', `EVOLUTION-SNAPSHOT-v1`);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    const dest = path.join(dir, 'snapshot.json');
    fs.writeFileSync(dest, JSON.stringify(snapshot, null, 2), 'utf-8');
  }
}
