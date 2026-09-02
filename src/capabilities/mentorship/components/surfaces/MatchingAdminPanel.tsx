import React, { useEffect, useState } from 'react';
import {
  GitMerge, CheckCircle2, X, Users, Loader2,
  Sparkles, ChevronDown, ChevronUp, AlertCircle,
} from 'lucide-react';
import { MatchingEngine } from '../../services/MatchingEngine';
import { ProfileRepository } from '../../repositories/ProfileRepository';
import { MatchRepository } from '../../repositories/MatchRepository';
import type { Match, MentorProfile, MenteeProfile } from '../../domain';

interface MatchingAdminPanelProps {
  programId: string;
  tenantId: string;
}

export const MatchingAdminPanel: React.FC<MatchingAdminPanelProps> = ({ programId, tenantId }) => {
  const [mentors, setMentors] = useState<MentorProfile[]>([]);
  const [mentees, setMentees] = useState<MenteeProfile[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [expandedMatch, setExpandedMatch] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const load = async () => {
    const [m, me, ma] = await Promise.all([
      ProfileRepository.listMentorsByProgram(programId),
      ProfileRepository.listMenteesByProgram(programId),
      MatchingEngine.listProgramMatches(programId),
    ]);
    setMentors(m);
    setMentees(me);
    setMatches(ma.sort((a, b) => (b.score?.total ?? 0) - (a.score?.total ?? 0)));
    setLoading(false);
  };

  useEffect(() => { load(); }, [programId]);

  const runMatching = async () => {
    setRunning(true);
    try {
      await MatchingEngine.proposeMatches(programId, tenantId);
      await load();
    } finally {
      setRunning(false);
    }
  };

  const approve = async (matchId: string) => {
    setActionLoading(matchId);
    try {
      await MatchRepository.update(matchId, { status: 'ACTIVE' });
      await load();
    } finally {
      setActionLoading(null);
    }
  };

  const dissolve = async (matchId: string) => {
    setActionLoading(matchId);
    try {
      await MatchingEngine.dissolveMatch(matchId, 'Admin decision');
      await load();
    } finally {
      setActionLoading(null);
    }
  };

  const getMentor = (id: string) => mentors.find(m => m.id === id || m.userId === id);
  const getMentee = (id: string) => mentees.find(m => m.id === id || m.userId === id);

  const proposed = matches.filter(m => m.status === 'PROPOSED');
  const active = matches.filter(m => m.status === 'ACTIVE' || m.status === 'ACCEPTED');
  const dissolved = matches.filter(m => m.status === 'DISSOLVED');
  const unmatchedMentees = mentees.filter(me => !active.find(m => m.menteeId === me.id));

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 size={20} className="animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-base font-semibold text-foreground">Matching de Pares</h1>
          <p className="text-xs text-muted-foreground">
            {active.length} par{active.length !== 1 ? 'es' : ''} ativo{active.length !== 1 ? 's' : ''} ·{' '}
            {unmatchedMentees.length} sem match
          </p>
        </div>
        <button
          onClick={runMatching}
          disabled={running || unmatchedMentees.length === 0}
          className="flex items-center gap-1.5 px-4 py-2 bg-violet-600 text-white text-sm font-medium rounded-lg hover:bg-violet-700 disabled:opacity-50 transition-colors"
        >
          {running ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
          {running ? 'Rodando...' : 'Rodar Algoritmo'}
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Propostas', value: proposed.length, color: 'text-violet-500 bg-violet-500/10' },
          { label: 'Ativos', value: active.length, color: 'text-emerald-500 bg-emerald-500/10' },
          { label: 'Sem Match', value: unmatchedMentees.length, color: 'text-amber-500 bg-amber-500/10' },
        ].map(s => (
          <div key={s.label} className={`${s.color} rounded-xl p-4 text-center`}>
            <p className="text-2xl font-bold">{s.value}</p>
            <p className="text-xs font-medium mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Proposed matches */}
      {proposed.length > 0 && (
        <div className="space-y-3">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Propostas do Algoritmo ({proposed.length})
          </p>
          {proposed.map(match => {
            const mentor = getMentor(match.mentorId);
            const mentee = getMentee(match.menteeId);
            const isExpanded = expandedMatch === match.id;

            return (
              <div key={match.id} className="bg-card border border-border rounded-xl overflow-hidden">
                <div className="flex items-center gap-4 p-4">
                  {/* Mentor */}
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-blue-500/15 flex items-center justify-center text-xs font-bold text-blue-600 flex-shrink-0">
                      {mentor?.displayName?.charAt(0) ?? '?'}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-foreground truncate">{mentor?.displayName ?? 'Mentor'}</p>
                      <p className="text-[10px] text-muted-foreground truncate">
                        {mentor?.expertiseDomains?.slice(0, 2).join(', ')}
                      </p>
                    </div>
                  </div>

                  {/* Score */}
                  <div className="flex flex-col items-center flex-shrink-0 px-3">
                    <GitMerge size={14} className="text-violet-500 mb-0.5" />
                    {match.score && (
                      <span className="text-sm font-bold text-violet-600">{match.score.total}</span>
                    )}
                    <span className="text-[10px] text-muted-foreground">pts</span>
                  </div>

                  {/* Mentee */}
                  <div className="flex items-center gap-2 flex-1 min-w-0 justify-end">
                    <div className="min-w-0 text-right">
                      <p className="text-xs font-medium text-foreground truncate">{mentee?.displayName ?? 'Mentorado'}</p>
                      <p className="text-[10px] text-muted-foreground truncate">
                        {mentee?.developmentContext?.currentRole}
                      </p>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-emerald-500/15 flex items-center justify-center text-xs font-bold text-emerald-600 flex-shrink-0">
                      {mentee?.displayName?.charAt(0) ?? '?'}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 ml-4 flex-shrink-0">
                    <button
                      onClick={() => setExpandedMatch(isExpanded ? null : match.id)}
                      className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                    >
                      {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>
                    <button
                      onClick={() => dissolve(match.id)}
                      disabled={actionLoading === match.id}
                      className="p-1.5 rounded-lg text-red-500 hover:bg-red-500/10 transition-colors disabled:opacity-50"
                      title="Rejeitar"
                    >
                      {actionLoading === match.id ? <Loader2 size={14} className="animate-spin" /> : <X size={14} />}
                    </button>
                    <button
                      onClick={() => approve(match.id)}
                      disabled={actionLoading === match.id}
                      className="flex items-center gap-1 px-3 py-1.5 bg-emerald-600 text-white text-xs font-medium rounded-lg hover:bg-emerald-700 disabled:opacity-50 transition-colors"
                    >
                      {actionLoading === match.id ? <Loader2 size={12} className="animate-spin" /> : <CheckCircle2 size={12} />}
                      Aprovar
                    </button>
                  </div>
                </div>

                {/* Expanded score detail */}
                {isExpanded && match.score && (
                  <div className="border-t border-border px-4 py-3 bg-muted/30">
                    <p className="text-xs font-medium text-muted-foreground mb-2">Breakdown do Score</p>
                    <div className="grid grid-cols-2 lg:grid-cols-5 gap-2">
                      {[
                        { label: 'Expertise', value: match.score.expertiseAlignment },
                        { label: 'Setor', value: match.score.industryAlignment },
                        { label: 'Estilo', value: match.score.styleCompatibility },
                        { label: 'Disponib.', value: match.score.availabilityFit },
                        { label: 'Objetivos', value: match.score.goalRelevance },
                      ].map(dim => (
                        <div key={dim.label} className="text-center">
                          <div className="h-1.5 bg-muted rounded-full overflow-hidden mb-1">
                            <div
                              className="h-full bg-violet-500 rounded-full"
                              style={{ width: `${dim.value}%` }}
                            />
                          </div>
                          <p className="text-[10px] text-muted-foreground">{dim.label}</p>
                          <p className="text-xs font-bold text-foreground">{Math.round(dim.value)}%</p>
                        </div>
                      ))}
                    </div>
                    {match.matchRationale && (
                      <p className="text-[10px] text-muted-foreground mt-2">{match.matchRationale}</p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Active matches */}
      {active.length > 0 && (
        <div className="space-y-3">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Pares Ativos ({active.length})
          </p>
          {active.map(match => {
            const mentor = getMentor(match.mentorId);
            const mentee = getMentee(match.menteeId);
            return (
              <div key={match.id} className="flex items-center gap-4 p-4 bg-card border border-emerald-500/20 rounded-xl">
                <CheckCircle2 size={16} className="text-emerald-500 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">
                    {mentor?.displayName ?? 'Mentor'} → {mentee?.displayName ?? 'Mentorado'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Ativo desde {match.mentorAcceptedAt
                      ? new Date(match.mentorAcceptedAt).toLocaleDateString('pt-BR')
                      : '—'}
                    {match.score && ` · Score: ${match.score.total}pts`}
                  </p>
                </div>
                <button
                  onClick={() => dissolve(match.id)}
                  disabled={actionLoading === match.id}
                  className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-red-500 border border-red-500/30 rounded-lg hover:bg-red-500/10 disabled:opacity-50 transition-colors"
                >
                  {actionLoading === match.id ? <Loader2 size={12} className="animate-spin" /> : <X size={12} />}
                  Dissolver
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Unmatched mentees */}
      {unmatchedMentees.length > 0 && (
        <div className="space-y-3">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
            <AlertCircle size={12} className="text-amber-500" />
            Sem Match ({unmatchedMentees.length})
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {unmatchedMentees.map(mentee => (
              <div key={mentee.id} className="flex items-center gap-3 p-3 bg-card border border-amber-500/20 rounded-xl">
                <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center text-xs font-bold text-amber-600 flex-shrink-0">
                  {mentee.displayName.charAt(0)}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{mentee.displayName}</p>
                  <p className="text-xs text-muted-foreground truncate">{mentee.developmentContext?.currentRole}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
