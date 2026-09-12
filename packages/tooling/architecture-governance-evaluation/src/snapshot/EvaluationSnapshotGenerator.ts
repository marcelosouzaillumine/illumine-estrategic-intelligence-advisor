import { ArchitectureObservation } from '../models/ArchitectureObservation';
import { ArchitectureFinding } from '../models/ArchitectureFinding';
import fs from 'fs';
import path from 'path';

export class EvaluationSnapshotGenerator {
  public generate(observations: ArchitectureObservation[], findings: ArchitectureFinding[], baseDir: string = process.cwd()) {
    const snapshotId = `EVALUATION-SNAPSHOT-v1`;
    const outDir = path.join(baseDir, `artifacts/architecture-evaluation/${snapshotId}`);

    fs.mkdirSync(outDir, { recursive: true });

    const metadata = `Evaluation:
  version: 1.0
  generatedAt: ${new Date().toISOString()}
Source:
  discoverySnapshot: DISCOVERY-SNAPSHOT-v1
`;

    fs.writeFileSync(path.join(outDir, 'metadata.yaml'), metadata);
    fs.writeFileSync(path.join(outDir, 'observations.json'), JSON.stringify(observations, null, 2));
    fs.writeFileSync(path.join(outDir, 'findings.json'), JSON.stringify(findings, null, 2));

    console.log(`Evaluation Snapshot created at: ${outDir}`);
  }
}
