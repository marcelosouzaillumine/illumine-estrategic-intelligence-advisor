import fs from 'fs';
import path from 'path';
import { ArchitectureRiskAssessment } from '../models/index';

export class RiskSnapshotGenerator {
  constructor(private readonly workspaceRoot: string) {}

  async generate(assessment: ArchitectureRiskAssessment): Promise<void> {
    const dir = path.join(this.workspaceRoot, 'artifacts', 'architecture-risk', `RISK-SNAPSHOT-v1`);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    const dest = path.join(dir, 'assessment.json');
    fs.writeFileSync(dest, JSON.stringify(assessment, null, 2), 'utf-8');
  }
}
