import { ContagionEdge } from './stress-types';

export class StressPropagationAuditTrail {
  private trails: string[] = [];

  public logPropagation(edge: ContagionEdge): void {
    const logEntry = `[STRESS AUDIT] ${new Date().toISOString()} | TYPE: ${edge.propagationType} | WEIGHT: ${edge.propagationWeight} | SOURCE: ${edge.sourceEntity} -> TARGET: ${edge.targetEntity} | REASON: ${edge.causalReason} | CONFIDENCE: ${edge.confidence}`;
    this.trails.push(logEntry);
  }

  public getTrails(): string[] {
    return [...this.trails];
  }
}
