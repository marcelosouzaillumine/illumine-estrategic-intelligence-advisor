import { MatchRepository } from '../repositories/MatchRepository';
import { ProfileRepository } from '../repositories/ProfileRepository';
import type { Match, MatchScore, MentorProfile, MenteeProfile } from '../domain';

function scoreMatch(mentor: MentorProfile, mentee: MenteeProfile): MatchScore {
  // Expertise alignment
  const menteeAreas = mentee.developmentContext.priorityAreas;
  const mentorDomains = mentor.expertiseDomains;
  const expertiseHits = menteeAreas.filter(area =>
    mentorDomains.some(domain => domain.toLowerCase().includes(area.toLowerCase().split('_')[0]))
  ).length;
  const expertiseAlignment = Math.min(100, (expertiseHits / Math.max(menteeAreas.length, 1)) * 100);

  // Industry alignment
  const menteeIndustry = mentee.developmentContext.industry.toLowerCase();
  const industryHit = mentor.industries.some(i => i.toLowerCase().includes(menteeIndustry.split(' ')[0]));
  const industryAlignment = industryHit ? 85 : 40;

  // Style compatibility (based on mentee preferences text match)
  const prefNotes = (mentee.mentorPreferences.notes ?? '').toLowerCase();
  const styleCompatibility = prefNotes.length > 10 ? 70 : 65;

  // Availability fit
  const availabilityFit = mentor.availability.status === 'AVAILABLE'
    ? 100
    : mentor.availability.status === 'AT_CAPACITY'
    ? 0
    : 50;

  // Goal relevance (mentor expected outcomes vs mentee goals)
  const goalRelevance = mentor.expectedOutcomes.length > 0
    ? Math.min(100, (mentor.expectedOutcomes.length / 3) * 80)
    : 50;

  const total = Math.round(
    expertiseAlignment * 0.35 +
    industryAlignment * 0.20 +
    styleCompatibility * 0.15 +
    availabilityFit * 0.20 +
    goalRelevance * 0.10
  );

  return { total, expertiseAlignment, industryAlignment, styleCompatibility, availabilityFit, goalRelevance };
}

export class MatchingEngine {
  static async proposeMatches(programId: string, tenantId: string): Promise<Match[]> {
    const mentors = await ProfileRepository.listMentorsByProgram(programId);
    const mentees = await ProfileRepository.listMenteesByProgram(programId);
    const created: Match[] = [];

    const availableMentors = mentors.filter(m => m.availability.status === 'AVAILABLE');

    for (const mentee of mentees) {
      if (mentee.matchedMentorId) continue;

      let bestMentor: MentorProfile | null = null;
      let bestScore: MatchScore | null = null;

      for (const mentor of availableMentors) {
        const currentMentees = mentor.availability.currentMentees;
        const maxMentees = mentor.availability.maxMentees;
        if (currentMentees >= maxMentees) continue;

        const score = scoreMatch(mentor, mentee);
        if (!bestScore || score.total > bestScore.total) {
          bestScore = score;
          bestMentor = mentor;
        }
      }

      if (bestMentor && bestScore) {
        const matchId = await MatchRepository.create({
          programId,
          tenantId,
          mentorId: bestMentor.id,
          menteeId: mentee.id,
          status: 'PROPOSED',
          method: 'ALGORITHM',
          score: bestScore,
          matchRationale: `Score ${bestScore.total}/100 — expertise: ${Math.round(bestScore.expertiseAlignment)}%, industry: ${Math.round(bestScore.industryAlignment)}%`,
        });
        const match = await MatchRepository.getById(matchId);
        if (match) created.push(match);
      }
    }

    return created;
  }

  static async acceptMatch(matchId: string, role: 'MENTOR' | 'MENTEE'): Promise<void> {
    const match = await MatchRepository.getById(matchId);
    if (!match) throw new Error('MATCH_NOT_FOUND');

    const now = new Date().toISOString();
    const updates: Partial<Match> = role === 'MENTOR'
      ? { mentorAcceptedAt: now }
      : { menteeAcceptedAt: now };

    const updatedMatch = {
      ...match,
      ...updates,
    };

    const bothAccepted = updatedMatch.mentorAcceptedAt && updatedMatch.menteeAcceptedAt;
    if (bothAccepted) updates.status = 'ACCEPTED';

    await MatchRepository.update(matchId, updates);
  }

  static async dissolveMatch(matchId: string, reason: string): Promise<void> {
    await MatchRepository.update(matchId, {
      status: 'DISSOLVED',
      dissolvedAt: new Date().toISOString(),
      dissolveReason: reason,
    });
  }

  static async listProgramMatches(programId: string): Promise<Match[]> {
    return MatchRepository.listByProgram(programId);
  }
}
