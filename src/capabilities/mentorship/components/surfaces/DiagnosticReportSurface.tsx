import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, Legend,
} from 'recharts';
import {
  Loader2, CheckCircle2, Clock, Sparkles, ChevronRight, AlertCircle,
} from 'lucide-react';
import { DiagnosticRepository } from '../../repositories/DiagnosticRepository';
import { COMPETENCY_LABEL, type Diagnostic } from '../../domain';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface DiagnosticReportSurfaceProps {
  menteeId: string;
  programId: string;
  role: 'MENTOR' | 'MENTEE';
  diagnosticId?: string;
}

export const DiagnosticReportSurface: React.FC<DiagnosticReportSurfaceProps> = ({
  menteeId, programId, role, diagnosticId,
}) => {
  const navigate = useNavigate();
  const [diagnostic, setDiagnostic] = useState<Diagnostic | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const d = diagnosticId
        ? await DiagnosticRepository.getById(diagnosticId)
        : await DiagnosticRepository.getByMentee(menteeId, programId);
      setDiagnostic(d);
      setLoading(false);
    };
    load();
  }, [menteeId, programId, diagnosticId]);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 size={20} className="animate-spin text-muted-foreground" />
    </div>
  );

  if (!diagnostic || !diagnostic.answers) return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <AlertCircle size={28} className="text-muted-foreground/30 mb-3" />
      <p className="text-sm text-muted-foreground">Diagnóstico não encontrado.</p>
      {role === 'MENTEE' && (
        <button
          onClick={() => navigate('/mentee/workspace/diagnostico')}
          className="mt-4 px-4 py-2 bg-emerald-600 text-white text-xs font-medium rounded-lg hover:bg-emerald-700 transition-colors"
        >
          Iniciar Diagnóstico
        </button>
      )}
    </div>
  );

  const { answers, mentorAnnotation, status } = diagnostic;

  const radarData = answers.competencies.map(c => ({
    subject: COMPETENCY_LABEL[c.area].split(' ')[0],
    fullLabel: COMPETENCY_LABEL[c.area],
    Atual: c.currentLevel,
    Meta: c.targetLevel,
  }));

  const gapCompetencies = [...answers.competencies]
    .sort((a, b) => (b.targetLevel - b.currentLevel) - (a.targetLevel - a.currentLevel))
    .slice(0, 3);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles size={14} className="text-emerald-500" />
            <span className="text-xs font-medium text-emerald-600">Diagnóstico Inicial</span>
          </div>
          <h1 className="text-lg font-bold text-foreground">Relatório de Competências</h1>
          {answers.currentRole && (
            <p className="text-xs text-muted-foreground mt-0.5">
              {answers.currentRole}
              {answers.company && ` · ${answers.company}`}
            </p>
          )}
        </div>
        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${
          status === 'REVIEWED'
            ? 'bg-emerald-500/10 text-emerald-600'
            : 'bg-amber-500/10 text-amber-600'
        }`}>
          {status === 'REVIEWED'
            ? <><CheckCircle2 size={12} /> Revisado</>
            : <><Clock size={12} /> Aguardando revisão</>}
        </div>
      </div>

      {/* Radar Chart */}
      <div className="bg-card border border-border rounded-xl p-6">
        <p className="text-sm font-semibold text-foreground mb-4">Mapa de Competências</p>
        <ResponsiveContainer width="100%" height={320}>
          <RadarChart data={radarData} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
            <PolarGrid stroke="currentColor" className="text-border" />
            <PolarAngleAxis
              dataKey="subject"
              tick={{ fontSize: 10, fill: 'currentColor', className: 'text-muted-foreground' }}
            />
            <Radar
              name="Nível Atual"
              dataKey="Atual"
              stroke="#64748b"
              fill="#64748b"
              fillOpacity={0.2}
              strokeWidth={2}
            />
            <Radar
              name="Meta"
              dataKey="Meta"
              stroke="#10b981"
              fill="#10b981"
              fillOpacity={0.15}
              strokeWidth={2}
              strokeDasharray="4 2"
            />
            <Legend
              iconType="circle"
              iconSize={8}
              formatter={(value) => <span className="text-xs text-muted-foreground">{value}</span>}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Competency bars */}
      <div className="bg-card border border-border rounded-xl p-5">
        <p className="text-sm font-semibold text-foreground mb-4">Detalhamento por Competência</p>
        <div className="space-y-3">
          {answers.competencies.map(c => {
            const gap = c.targetLevel - c.currentLevel;
            return (
              <div key={c.area} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-foreground">{COMPETENCY_LABEL[c.area]}</span>
                  <span className="text-muted-foreground">
                    {c.currentLevel}/5
                    {gap > 0 && <span className="text-amber-500 ml-1">(gap: +{gap})</span>}
                    {gap === 0 && <span className="text-emerald-500 ml-1">✓ meta atingida</span>}
                  </span>
                </div>
                <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="absolute inset-y-0 left-0 bg-slate-500/40 rounded-full"
                    style={{ width: `${(c.targetLevel / 5) * 100}%` }}
                  />
                  <div
                    className={`absolute inset-y-0 left-0 rounded-full ${
                      c.currentLevel >= c.targetLevel ? 'bg-emerald-500' : 'bg-slate-600'
                    }`}
                    style={{ width: `${(c.currentLevel / 5) * 100}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Biggest gaps */}
      <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-5">
        <p className="text-sm font-semibold text-foreground mb-3">Maiores Oportunidades de Desenvolvimento</p>
        <div className="space-y-2">
          {gapCompetencies.map((c, i) => (
            <div key={c.area} className="flex items-center gap-3">
              <span className="w-5 h-5 rounded-full bg-amber-500 text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                {i + 1}
              </span>
              <span className="text-sm text-foreground">{COMPETENCY_LABEL[c.area]}</span>
              <span className="text-xs text-amber-600 font-medium ml-auto">
                gap de {c.targetLevel - c.currentLevel} nível{c.targetLevel - c.currentLevel !== 1 ? 'is' : ''}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Context answers */}
      <div className="bg-card border border-border rounded-xl p-5 space-y-4">
        <p className="text-sm font-semibold text-foreground">Contexto Declarado</p>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-xs text-muted-foreground">Experiência na área</p>
            <p className="font-medium text-foreground">{answers.yearsInRole} ano{answers.yearsInRole !== 1 ? 's' : ''}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Disponibilidade semanal</p>
            <p className="font-medium text-foreground">{answers.availableHoursPerWeek}h/semana</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Cadência preferida</p>
            <p className="font-medium text-foreground">{answers.preferredMeetingCadence}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Estilo de aprendizagem</p>
            <p className="font-medium text-foreground capitalize">
              {answers.learningStyle === 'VISUAL' ? 'Visual' :
               answers.learningStyle === 'AUDITORY' ? 'Auditivo' :
               answers.learningStyle === 'READING' ? 'Leitura' : 'Prático'}
            </p>
          </div>
        </div>
        <div>
          <p className="text-xs text-muted-foreground mb-1">Maior desafio atual</p>
          <p className="text-sm text-foreground leading-relaxed">{answers.biggestChallenge}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground mb-1">Expectativas da mentoria</p>
          <p className="text-sm text-foreground leading-relaxed">{answers.mentoringExpectations}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground mb-2">Objetivos específicos</p>
          <ul className="space-y-1">
            {answers.specificGoals.map((g, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                <ChevronRight size={14} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                {g}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Mentor annotation */}
      {mentorAnnotation && (
        <div className="bg-primary/5 border border-primary/20 rounded-xl p-5 space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles size={14} className="text-primary" />
            <p className="text-sm font-semibold text-foreground">Observações do Mentor</p>
            <span className="text-[10px] text-muted-foreground ml-auto">
              {format(new Date(mentorAnnotation.annotatedAt), "dd 'de' MMM, yyyy", { locale: ptBR })}
            </span>
          </div>
          <p className="text-sm text-foreground leading-relaxed">{mentorAnnotation.observations}</p>
          {mentorAnnotation.initialPlanNotes && (
            <div>
              <p className="text-xs text-muted-foreground mb-1">Notas para o plano inicial</p>
              <p className="text-sm text-foreground leading-relaxed">{mentorAnnotation.initialPlanNotes}</p>
            </div>
          )}
          {mentorAnnotation.suggestedFocusAreas.length > 0 && (
            <div>
              <p className="text-xs text-muted-foreground mb-1.5">Áreas de foco sugeridas</p>
              <div className="flex flex-wrap gap-1.5">
                {mentorAnnotation.suggestedFocusAreas.map(a => (
                  <span key={a} className="px-2 py-1 bg-primary/10 text-primary text-xs font-medium rounded-lg">
                    {COMPETENCY_LABEL[a]}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Mentor CTA */}
      {role === 'MENTOR' && status === 'SUBMITTED' && (
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-foreground">Diagnóstico aguardando sua revisão</p>
            <p className="text-xs text-muted-foreground mt-0.5">Adicione observações para personalizar a jornada</p>
          </div>
          <button
            onClick={() => navigate(`/mentor/workspace/mentees/${menteeId}/diagnostico/revisar`)}
            className="flex-shrink-0 px-4 py-2 bg-amber-500 text-white text-xs font-medium rounded-lg hover:bg-amber-600 transition-colors"
          >
            Revisar agora
          </button>
        </div>
      )}
    </div>
  );
};
