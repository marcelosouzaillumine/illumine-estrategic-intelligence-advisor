import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

const output = {
  nocheck: [],
  asAny: [],
  firestore: [],
  phase7Docs: [],
  phase7Grep: [],
  waveDocs: [],
  archMap: {},
  eventSourcingGrep: [],
  transactionGrep: [],
  financialCoreMap: {},
};

function run(cmd: string): string {
  try {
    return execSync(cmd, { encoding: 'utf-8', stdio: 'pipe' });
  } catch (e: any) {
    return e.stdout ? e.stdout.toString() : '';
  }
}

console.log("Auditing Phase 6 Closure...");
output.nocheck = run('grep -Rn "@ts-nocheck" src/capabilities src/core || true').split('\n').filter(Boolean);
output.asAny = run('grep -Rn "as any" src/capabilities src/core || true').split('\n').filter(Boolean);
output.firestore = run('grep -Rn "firebase/firestore" src/capabilities/financial/domain src/capabilities/financial/governance src/capabilities/financial/application || true').split('\n').filter(Boolean);

console.log("Auditing Phase 7 Intention...");
output.phase7Docs = run('find . -type f -not -path "*/node_modules/*" -not -path "*/.git/*" -not -path "*/.gemini/*" -not -path "*/.agent/*" | grep -iE "phase.?7" || true').split('\n').filter(Boolean);
output.phase7Grep = run('grep -Rni "Phase 7" docs src scripts || true').split('\n').filter(Boolean);

console.log("Auditing Waves History...");
output.waveDocs = run('find . -type f -not -path "*/node_modules/*" -not -path "*/.git/*" -not -path "*/.gemini/*" -not -path "*/.agent/*" | grep -iE "wave.?(12|13|14|15|16|17|18)" || true').split('\n').filter(Boolean);

console.log("Auditing Event Sourcing...");
output.eventSourcingGrep = run('grep -RniE "EventStore|EventSourcing|DomainEvent|DomainEvents|EventStream|EventBus|EventReplay|Aggregate|AggregateRoot|Snapshot|Outbox|Inbox" src || true').split('\n').filter(Boolean);

console.log("Auditing Transactions...");
output.transactionGrep = run('grep -RniE "transaction|transactional|commit|rollback|idempotency|optimistic" src || true').split('\n').filter(Boolean);

console.log("Mapping Financial Core...");
output.financialCoreMap = run('find src/capabilities/financial -type d || true').split('\n').filter(Boolean);

fs.writeFileSync('audit_results.json', JSON.stringify(output, null, 2));
console.log("Audit complete. Results saved to audit_results.json");
