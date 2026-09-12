import { ExecutiveIntelligenceScoreResult } from './ExecutiveIntelligenceScore';

export interface TrajectoryPoint {
  readonly period: string; // ex: '2026-Q1', '2026-Q2'
  readonly result: ExecutiveIntelligenceScoreResult;
  readonly recordedAt: string;
}

export class IntelligenceTrajectory {
  private readonly points: TrajectoryPoint[] = [];

  public addPoint(point: TrajectoryPoint): void {
    this.points.push(point);
  }

  public getHistory(): readonly TrajectoryPoint[] {
    return this.points;
  }

  public getLatestScore(): ExecutiveIntelligenceScoreResult | undefined {
    if (this.points.length === 0) return undefined;
    return this.points[this.points.length - 1].result;
  }
}
