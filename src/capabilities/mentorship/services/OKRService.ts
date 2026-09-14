import { OKRRepository } from '../repositories/OKRRepository';
import type { OKR, KeyResult } from '../domain';

export class OKRService {
  static async createOKR(
    data: Pick<OKR, 'programId' | 'menteeId' | 'tenantId' | 'objective' | 'description' | 'quarter' | 'keyResults'>
  ): Promise<string> {
    const keyResults = data.keyResults.map((kr, idx) => ({
      ...kr,
      id: `kr-${idx}-${Date.now()}`,
      currentValue: kr.startValue,
      progress: 0,
      status: 'ACTIVE' as const,
      updates: [],
    }));

    return OKRRepository.create({
      ...data,
      keyResults,
      overallProgress: 0,
      status: 'ACTIVE',
      linkedSessionIds: [],
    });
  }

  static async updateKeyResult(
    okrId: string,
    krId: string,
    currentValue: number,
    note: string,
    updatedBy: string
  ): Promise<void> {
    const okr = await OKRRepository.getById(okrId);
    if (!okr) throw new Error('OKR_NOT_FOUND');

    const keyResults = okr.keyResults.map(kr => {
      if (kr.id !== krId) return kr;

      const range = kr.targetValue - kr.startValue;
      const progress = range === 0 ? 100 : Math.min(100, Math.round(((currentValue - kr.startValue) / range) * 100));
      const status: KeyResult['status'] = progress >= 100 ? 'ACHIEVED' : progress < 20 && okr.status === 'ACTIVE' ? 'AT_RISK' : 'ACTIVE';

      return {
        ...kr,
        currentValue,
        progress,
        status,
        updates: [...kr.updates, { value: currentValue, note, updatedAt: new Date().toISOString(), updatedBy }],
      };
    });

    const overallProgress = Math.round(
      keyResults.reduce((sum, kr) => sum + kr.progress, 0) / keyResults.length
    );

    const allAchieved = keyResults.every(kr => kr.status === 'ACHIEVED');
    const anyAtRisk = keyResults.some(kr => kr.status === 'AT_RISK');
    const status: OKR['status'] = allAchieved ? 'ACHIEVED' : anyAtRisk ? 'AT_RISK' : 'ACTIVE';

    await OKRRepository.update(okrId, { keyResults, overallProgress, status });
  }

  static async listMenteeOKRs(menteeId: string, programId: string): Promise<OKR[]> {
    return OKRRepository.listByMentee(menteeId, programId);
  }

  static async linkSession(okrId: string, sessionId: string): Promise<void> {
    const okr = await OKRRepository.getById(okrId);
    if (!okr) return;
    if (okr.linkedSessionIds.includes(sessionId)) return;
    await OKRRepository.update(okrId, { linkedSessionIds: [...okr.linkedSessionIds, sessionId] });
  }
}
