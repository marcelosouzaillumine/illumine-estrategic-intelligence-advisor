import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ChevronLeft, CheckCircle2, Loader2, CalendarDays } from 'lucide-react';
import { ProfileRepository } from '../../repositories/ProfileRepository';
import { MentoringSessionService } from '../../services/MentoringSessionService';
import { MentoringSessionRepository } from '../../repositories/MentoringSessionRepository';
import type { MenteeProfile, SessionFormat } from '../../domain';

const FORMAT_OPTIONS: { value: SessionFormat; label: string; desc: string }[] = [
  { value: 'VIDEO', label: 'Vídeo', desc: 'Google Meet, Zoom, Teams' },
  { value: 'IN_PERSON', label: 'Presencial', desc: 'Encontro face a face' },
  { value: 'PHONE', label: 'Telefone', desc: 'Ligação de voz' },
  { value: 'ASYNC', label: 'Assíncrono', desc: 'Troca de mensagens/áudio' },
];

interface ScheduleSessionSurfaceProps {
  mentorId: string;
  programId: string;
  tenantId: string;
}

export const ScheduleSessionSurface: React.FC<ScheduleSessionSurfaceProps> = ({
  mentorId, programId, tenantId,
}) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const prefillMenteeId = searchParams.get('menteeId');

  const [mentees, setMentees] = useState<MenteeProfile[]>([]);
  const [selectedMenteeId, setSelectedMenteeId] = useState(prefillMenteeId ?? '');
  const [scheduledAt, setScheduledAt] = useState('');
  const [durationMinutes, setDurationMinutes] = useState(60);
  const [format, setFormat] = useState<SessionFormat>('VIDEO');
  const [agenda, setAgenda] = useState('');
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    ProfileRepository.listMenteesByProgram(programId).then(setMentees);
  }, [programId]);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!selectedMenteeId) e.mentee = 'Selecione o mentorado';
    if (!scheduledAt) e.scheduledAt = 'Selecione data e hora';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      // Count existing sessions for this pair to determine session number
      const existing = await MentoringSessionRepository.listByPair(mentorId, selectedMenteeId);
      const sessionNumber = existing.length + 1;

      const sessionId = await MentoringSessionService.scheduleSession({
        programId,
        tenantId,
        mentorId,
        menteeId: selectedMenteeId,
        sessionNumber,
        format,
        scheduledAt: new Date(scheduledAt).toISOString(),
        durationMinutes,
        agenda: agenda.trim() || undefined,
      });

      navigate(`/mentor/workspace/sessions/${sessionId}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/mentor/workspace/sessions')}
          className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        >
          <ChevronLeft size={18} />
        </button>
        <div>
          <h1 className="text-base font-semibold text-foreground">Agendar Sessão</h1>
          <p className="text-xs text-muted-foreground">Defina o mentorado, data e formato</p>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-5 space-y-5">
        {/* Mentee select */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-foreground">Mentorado</label>
          <select
            value={selectedMenteeId}
            onChange={e => {
              setSelectedMenteeId(e.target.value);
              setErrors(prev => ({ ...prev, mentee: '' }));
            }}
            className={`w-full px-3 py-2.5 bg-background border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 ${errors.mentee ? 'border-red-500' : 'border-border'}`}
          >
            <option value="">Selecione...</option>
            {mentees.map(m => (
              <option key={m.id} value={m.id}>{m.displayName} — {m.developmentContext.currentRole}</option>
            ))}
          </select>
          {errors.mentee && <p className="text-xs text-red-500">{errors.mentee}</p>}
        </div>

        {/* Date/time */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-foreground">Data e Hora</label>
          <input
            type="datetime-local"
            value={scheduledAt}
            onChange={e => {
              setScheduledAt(e.target.value);
              setErrors(prev => ({ ...prev, scheduledAt: '' }));
            }}
            min={new Date().toISOString().slice(0, 16)}
            className={`w-full px-3 py-2.5 bg-background border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 ${errors.scheduledAt ? 'border-red-500' : 'border-border'}`}
          />
          {errors.scheduledAt && <p className="text-xs text-red-500">{errors.scheduledAt}</p>}
        </div>

        {/* Duration */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-foreground">Duração</label>
          <div className="flex gap-2">
            {[30, 45, 60, 90].map(d => (
              <button
                key={d}
                type="button"
                onClick={() => setDurationMinutes(d)}
                className={`flex-1 py-2 rounded-lg text-xs font-medium transition-colors ${
                  durationMinutes === d
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                {d}min
              </button>
            ))}
          </div>
        </div>

        {/* Format */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-foreground">Formato</label>
          <div className="grid grid-cols-2 gap-2">
            {FORMAT_OPTIONS.map(opt => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setFormat(opt.value)}
                className={`flex flex-col items-start p-2.5 rounded-lg border text-left transition-colors ${
                  format === opt.value
                    ? 'border-primary bg-primary/10'
                    : 'border-border hover:bg-muted/50'
                }`}
              >
                <span className={`text-xs font-medium ${format === opt.value ? 'text-primary' : 'text-foreground'}`}>
                  {opt.label}
                </span>
                <span className="text-[10px] text-muted-foreground">{opt.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Agenda */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-foreground">Pauta (opcional)</label>
          <textarea
            value={agenda}
            onChange={e => setAgenda(e.target.value)}
            placeholder="O que você pretende discutir nesta sessão?"
            rows={3}
            className="w-full px-3 py-2.5 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
          />
        </div>
      </div>

      {/* Preview */}
      {selectedMenteeId && scheduledAt && (
        <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1.5">
            <CalendarDays size={14} className="text-primary" />
            <p className="text-xs font-medium text-primary">Resumo</p>
          </div>
          <p className="text-sm text-foreground">
            {mentees.find(m => m.id === selectedMenteeId)?.displayName} ·{' '}
            {new Date(scheduledAt).toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' })} às{' '}
            {new Date(scheduledAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })} ·{' '}
            {durationMinutes}min · {FORMAT_OPTIONS.find(f => f.value === format)?.label}
          </p>
        </div>
      )}

      <button
        onClick={submit}
        disabled={saving}
        className="w-full flex items-center justify-center gap-2 py-3 bg-primary text-primary-foreground text-sm font-medium rounded-xl hover:opacity-90 disabled:opacity-50 transition-opacity"
      >
        {saving ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />}
        Confirmar Agendamento
      </button>
    </div>
  );
};
