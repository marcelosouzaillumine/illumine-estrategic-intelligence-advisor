import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, CheckCircle2, Loader2, Sparkles, AlertCircle, Plus, X } from 'lucide-react';
import { DiagnosticRepository } from '../../repositories/DiagnosticRepository';
import { COMPETENCY_LABEL, ALL_COMPETENCIES, type Diagnostic, type CompetencyArea } from '../../domain';
import { DiagnosticReportSurface } from './DiagnosticReportSurface';

interface MentorDiagnosticSurfaceProps {
  programId: string;
  mentorId: string;
}

export const MentorDiagnosticSurface: React.FC<MentorDiagnosticSurfaceProps> = ({
  programId, mentorId,
}) => {
  const { menteeId } = useParams<{ menteeId: string }>();
  const navigate = useNavigate();
  const [diagnostic, setDiagnostic] = useState<Diagnostic | null>(null);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<'view' | 'annotate'>('view');

  const [observations, setObservations] = useState('');
  const [planNotes, setPlanNotes] = useState('');
  const [focusAreas, setFocusAreas] = useState<CompetencyArea[]>([]);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!menteeId) return;
    DiagnosticRepository.getByMentee(menteeId, programId).then(d => {
      setDiagnostic(d);
      if (d?.mentorAnnotation) {
        setObservations(d.mentorAnnotation.observations);
        setPlanNotes(d.mentorAnnotation.initialPlanNotes);
        setFocusAreas(d.mentorAnnotation.suggestedFocusAreas);
      }
      setLoading(false);
    });
  }, [menteeId, programId]);

  const toggleFocusArea = (area: CompetencyArea) =>
    setFocusAreas(prev =>
      prev.includes(area) ? prev.filter(a => a !== area) : prev.length < 3 ? [...prev, area] : prev
    );

  const validate = () => {
    const e: Record<string, string> = {};
    if (!observations.trim() || observations.length < 30)
      e.observations = 'Escreva ao menos 30 caracteres de observação';
    if (focusAreas.length === 0) e.focusAreas = 'Selecione ao menos uma área de foco';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async () => {
    if (!validate() || !diagnostic || !menteeId) return;
    setSaving(true);
    await DiagnosticRepository.addMentorAnnotation(diagnostic.id, {
      observations: observations.trim(),
      suggestedFocusAreas: focusAreas,
      initialPlanNotes: planNotes.trim(),
      annotatedAt: new Date().toISOString(),
      annotatedBy: mentorId,
    });
    setSaving(false);
    setMode('view');
    const updated = await DiagnosticRepository.getByMentee(menteeId, programId);
    setDiagnostic(updated);
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 size={20} className="animate-spin text-muted-foreground" />
    </div>
  );

  if (!diagnostic || !diagnostic.answers) return (
    <div className="space-y-4">
      <button
        onClick={() => navigate(`/mentor/workspace/mentees/${menteeId}`)}
        className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
      >
        <ChevronLeft size={14} /> Voltar
      </button>
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <AlertCircle size={28} className="text-amber-500/50 mb-3" />
        <p className="text-sm font-medium text-foreground">Diagnóstico ainda não enviado</p>
        <p className="text-xs text-muted-foreground mt-1">O mentorado ainda não completou o formulário de diagnóstico.</p>
      </div>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(`/mentor/workspace/mentees/${menteeId}`)}
          className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        >
          <ChevronLeft size={18} />
        </button>
        <div className="flex-1">
          <h1 className="text-base font-semibold text-foreground">Diagnóstico do Mentorado</h1>
          <p className="text-xs text-muted-foreground">
            {diagnostic.status === 'REVIEWED' ? 'Revisado pelo mentor' : 'Aguardando revisão'}
          </p>
        </div>
        {mode === 'view' && (
          <button
            onClick={() => setMode('annotate')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-primary-foreground text-xs font-medium rounded-lg hover:opacity-90 transition-opacity"
          >
            <Sparkles size={13} />
            {diagnostic.status === 'REVIEWED' ? 'Editar Anotação' : 'Revisar Diagnóstico'}
          </button>
        )}
      </div>

      {/* Report view */}
      {mode === 'view' && menteeId && (
        <DiagnosticReportSurface
          menteeId={menteeId}
          programId={programId}
          role="MENTOR"
          diagnosticId={diagnostic.id}
        />
      )}

      {/* Annotation form */}
      {mode === 'annotate' && (
        <div className="bg-card border border-border rounded-xl p-6 space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles size={14} className="text-primary" />
              <p className="text-sm font-semibold text-foreground">Suas Observações</p>
            </div>
            <button
              onClick={() => setMode('view')}
              className="p-1 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X size={14} />
            </button>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-foreground">Observações gerais *</label>
            <textarea
              value={observations}
              onChange={e => { setObservations(e.target.value); setErrors(p => ({...p, observations:''})); }}
              placeholder="Compartilhe suas impressões sobre o perfil do mentorado, pontos fortes percebidos e oportunidades de desenvolvimento..."
              rows={5}
              className={`w-full px-3 py-2.5 bg-background border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none ${errors.observations ? 'border-red-500' : 'border-border'}`}
            />
            {errors.observations && <p className="text-xs text-red-500">{errors.observations}</p>}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-foreground">Áreas de foco sugeridas *</label>
              <span className="text-[10px] text-muted-foreground">{focusAreas.length}/3 selecionadas</span>
            </div>
            {errors.focusAreas && <p className="text-xs text-red-500">{errors.focusAreas}</p>}
            <div className="flex flex-wrap gap-2">
              {ALL_COMPETENCIES.map(area => {
                const selected = focusAreas.includes(area);
                const disabled = !selected && focusAreas.length >= 3;
                return (
                  <button
                    key={area}
                    type="button"
                    onClick={() => { toggleFocusArea(area); setErrors(p => ({...p, focusAreas:''})); }}
                    disabled={disabled}
                    className={`px-2.5 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                      selected
                        ? 'bg-primary text-primary-foreground border-primary'
                        : disabled
                          ? 'bg-muted/50 text-muted-foreground/50 border-border cursor-not-allowed'
                          : 'bg-muted text-muted-foreground border-border hover:border-primary/50'
                    }`}
                  >
                    {COMPETENCY_LABEL[area]}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-foreground">Notas para o plano inicial</label>
            <textarea
              value={planNotes}
              onChange={e => setPlanNotes(e.target.value)}
              placeholder="Ideias iniciais para o plano de desenvolvimento, recursos a recomendar, temas para o primeiro encontro..."
              rows={3}
              className="w-full px-3 py-2.5 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
            />
          </div>

          <button
            onClick={submit}
            disabled={saving}
            className="w-full flex items-center justify-center gap-2 py-3 bg-primary text-primary-foreground text-sm font-medium rounded-xl hover:opacity-90 disabled:opacity-50 transition-opacity"
          >
            {saving ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />}
            Salvar Anotações
          </button>
        </div>
      )}
    </div>
  );
};
