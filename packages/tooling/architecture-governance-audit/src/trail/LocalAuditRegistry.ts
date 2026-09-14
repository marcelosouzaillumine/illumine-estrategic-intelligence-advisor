import fs from 'fs';
import path from 'path';
import { GovernanceEvent } from '../events/GovernanceEvent';

export interface AuditRegistry {
  appendEvent(event: GovernanceEvent): Promise<void>;
  getTimeline(): Promise<GovernanceEvent[]>;
}

export class LocalAuditRegistry implements AuditRegistry {
  private readonly eventsFile: string;

  constructor(workspaceRoot: string) {
    const auditDir = path.join(workspaceRoot, 'artifacts', 'architecture-audit');
    if (!fs.existsSync(auditDir)) {
      fs.mkdirSync(auditDir, { recursive: true });
    }
    this.eventsFile = path.join(auditDir, 'audit-trail.jsonl');
  }

  async appendEvent(event: GovernanceEvent): Promise<void> {
    const line = JSON.stringify(event) + '\n';
    fs.appendFileSync(this.eventsFile, line, 'utf-8');
  }

  async getTimeline(): Promise<GovernanceEvent[]> {
    if (!fs.existsSync(this.eventsFile)) {
      return [];
    }
    const content = fs.readFileSync(this.eventsFile, 'utf-8');
    const lines = content.split('\n').filter(l => l.trim() !== '');
    return lines.map(line => {
      const obj = JSON.parse(line);
      return {
        ...obj,
        timestamp: new Date(obj.timestamp)
      };
    });
  }
}
