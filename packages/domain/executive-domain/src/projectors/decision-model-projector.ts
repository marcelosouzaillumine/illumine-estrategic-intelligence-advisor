import { ExecutiveCaseAggregate } from '../aggregates/executive-case-aggregate';
import { BoardReportProjection, ExecutiveOpinion } from '@illumine/executive-contracts';

export class DecisionModelProjector {
  public static projectToBoardReport(caseAggregate: ExecutiveCaseAggregate, opinions: ExecutiveOpinion[]): BoardReportProjection {
    const integrity = caseAggregate.calculateIntegrityIndex();

    return {
      reportId: `proj-${caseAggregate.caseId}`,
      boardSessionId: `session-${caseAggregate.caseId}`,
      companyName: 'Illumine Corporate Enterprise',
      period: new Date().toISOString().substring(0, 7),
      executiveSummary: `Parecer executivo consolidado para o caso ${caseAggregate.title}. Status atual: ${caseAggregate.status}.`,
      opinions,
      overallIntegrityScore: integrity.compositeIntegrityScore,
      generatedAt: new Date().toISOString()
    };
  }
}
