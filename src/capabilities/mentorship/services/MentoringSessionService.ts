import { MentoringSessionRepository } from '../repositories/MentoringSessionRepository';
import type { MentoringSession, SessionStatus } from '../domain';

export class MentoringSessionService {
  static async scheduleSession(
    data: Pick<MentoringSession, 'programId' | 'tenantId' | 'mentorId' | 'menteeId' | 'sessionNumber' | 'format' | 'scheduledAt' | 'durationMinutes' | 'agenda'>
  ): Promise<string> {
    return MentoringSessionRepository.create({
      ...data,
      status: 'SCHEDULED',
    });
  }

  static async transition(sessionId: string, nextStatus: SessionStatus): Promise<void> {
    await MentoringSessionRepository.update(sessionId, { status: nextStatus });
  }

  static async submitMentorNotes(sessionId: string, notes: string): Promise<void> {
    const session = await MentoringSessionRepository.getById(sessionId);
    if (!session) throw new Error('SESSION_NOT_FOUND');

    const existing = session.notes;
    const bothSubmitted = existing?.menteeNotes !== undefined;

    await MentoringSessionRepository.update(sessionId, {
      notes: {
        submittedBy: bothSubmitted ? 'BOTH' : 'MENTOR',
        mentorNotes: notes,
        menteeNotes: existing?.menteeNotes,
        submittedAt: new Date().toISOString(),
      },
      status: bothSubmitted ? 'SYNTHESIS_PENDING' : 'NOTES_PENDING',
    });
  }

  static async submitMenteeNotes(sessionId: string, notes: string): Promise<void> {
    const session = await MentoringSessionRepository.getById(sessionId);
    if (!session) throw new Error('SESSION_NOT_FOUND');

    const existing = session.notes;
    const bothSubmitted = existing?.mentorNotes !== undefined;

    await MentoringSessionRepository.update(sessionId, {
      notes: {
        submittedBy: bothSubmitted ? 'BOTH' : 'MENTEE',
        mentorNotes: existing?.mentorNotes,
        menteeNotes: notes,
        submittedAt: new Date().toISOString(),
      },
      status: bothSubmitted ? 'SYNTHESIS_PENDING' : 'NOTES_PENDING',
    });
  }

  static async getSessionsByMentor(mentorId: string, programId: string): Promise<MentoringSession[]> {
    return MentoringSessionRepository.listByMentor(mentorId, programId);
  }

  static async getSessionsByMentee(menteeId: string, programId: string): Promise<MentoringSession[]> {
    return MentoringSessionRepository.listByMentee(menteeId, programId);
  }

  static async cancel(sessionId: string, reason: string): Promise<void> {
    await MentoringSessionRepository.update(sessionId, {
      status: 'CANCELLED',
      cancelReason: reason,
    });
  }
}
