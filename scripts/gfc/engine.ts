import { Project, SourceFile, Node } from 'ts-morph';

export interface AuditContext {
  project: Project;
  domainFiles: SourceFile[];
  contractFiles: SourceFile[];
  typesFiles: SourceFile[];
  evaluationFiles: SourceFile[];
  uiFiles: SourceFile[];
  packagesDir: string;
}

export interface GFCEvidence {
  audit: string;
  rule: string;
  finding: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  file: string;
  result: 'PASS' | 'FAIL';
}

export interface ArchitectureRuleEvaluator {
  ruleId: string;
  name: string;
  evaluate(context: AuditContext): GFCEvidence[];
}

export class GFCEngine {
  private rules: ArchitectureRuleEvaluator[] = [];

  constructor(private context: AuditContext) {}

  registerRule(rule: ArchitectureRuleEvaluator) {
    this.rules.push(rule);
  }

  evaluateAll(): GFCEvidence[] {
    const allEvidence: GFCEvidence[] = [];
    for (const rule of this.rules) {
      const evidence = rule.evaluate(this.context);
      allEvidence.push(...evidence);
    }
    return allEvidence;
  }
}
