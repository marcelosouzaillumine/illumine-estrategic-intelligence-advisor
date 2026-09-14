import fs from 'fs';
import path from 'path';
import { AdvisorySnapshot } from '../models/index';

export class AdvisorySnapshotGenerator {
  constructor(private readonly workspaceRoot: string) {}

  async generate(snapshot: AdvisorySnapshot): Promise<void> {
    const dir = path.join(this.workspaceRoot, 'artifacts', 'architecture-advisory', `ADVISORY-SNAPSHOT-v1`);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    const dest = path.join(dir, 'snapshot.json');
    fs.writeFileSync(dest, JSON.stringify(snapshot, null, 2), 'utf-8');
  }
}
