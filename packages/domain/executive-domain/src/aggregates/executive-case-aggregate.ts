import { Identifier, Timestamp } from '@illumine/core-primitives';
import {
  Fact,
  Evidence,
  Inference,
  Findings,
  Recommendation,
  BoardResolution,
  ExecutiveAction,
  DecisionIntegrityIndex
} from '@illumine/executive-contracts';

export class ExecutiveCaseAggregate {
  private _facts: Fact[] = [];
  private _evidences: Evidence[] = [];
  private _inferences: Inference[] = [];
  private _findings: Findings[] = [];
  private _recommendations: Recommendation[] = [];
  private _resolution: BoardResolution | null = null;
  private _actions: ExecutiveAction[] = [];
  private _status: 'DRAFT' | 'REASONING' | 'UNDER_REVIEW' | 'APPROVED' | 'EXECUTING' | 'COMPLETED' = 'DRAFT';

  constructor(
    public readonly caseId: Identifier,
    public readonly title: string,
    public readonly createdAt: Timestamp
  ) {}

  public get facts(): readonly Fact[] {
    return this._facts;
  }

  public get evidences(): readonly Evidence[] {
    return this._evidences;
  }

  public get inferences(): readonly Inference[] {
    return this._inferences;
  }

  public get findings(): readonly Findings[] {
    return this._findings;
  }

  public get recommendations(): readonly Recommendation[] {
    return this._recommendations;
  }

  public get resolution(): BoardResolution | null {
    return this._resolution;
  }

  public get status(): string {
    return this._status;
  }

  public addFact(fact: Fact): void {
    this._facts.push(fact);
  }

  public addEvidence(evidence: Evidence): void {
    this._evidences.push(evidence);
    if (this._status === 'DRAFT') {
      this._status = 'REASONING';
    }
  }

  public addInference(inference: Inference): void {
    this._inferences.push(inference);
  }

  public setFindings(findings: Findings): void {
    this._findings.push(findings);
  }

  public addRecommendation(recommendation: Recommendation): void {
    // Invariante 2: Nenhuma Recommendation sem Findings prévios
    if (this._findings.length === 0) {
      throw new Error('[DomainViolation] Cannot add recommendation without prior findings');
    }
    this._recommendations.push(recommendation);
    this._status = 'UNDER_REVIEW';
  }

  public approveResolution(resolution: BoardResolution): void {
    this._resolution = resolution;
    this._status = 'APPROVED';
  }

  public calculateIntegrityIndex(): DecisionIntegrityIndex {
    const evidenceCoverage = Math.min(100, this._evidences.length * 20);
    const explainability = Math.min(100, (this._facts.length + this._inferences.length) * 15);
    const composite = Math.round((evidenceCoverage + explainability) / 2);

    return {
      confidenceScore: { probability: { value: 0.95 } } as any,
      evidenceCoverageScore: { value: evidenceCoverage } as any,
      explainabilityScore: { value: explainability } as any,
      freshnessScore: { value: 90 } as any,
      policyComplianceScore: { value: 100 } as any,
      humanApprovalStatus: this._resolution?.boardDecision === 'APPROVED' ? 'APPROVED' : 'PENDING',
      predictionAccuracyScore: { value: 88 } as any,
      learningCoverageScore: { value: 85 } as any,
      compositeIntegrityScore: { value: composite } as any
    };
  }
}
