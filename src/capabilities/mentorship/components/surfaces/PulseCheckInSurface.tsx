import React, { useState } from 'react';
import { CheckCircle2, Loader2, TrendingUp, Heart, Zap, Star, Target } from 'lucide-react';
import { db } from '../../../../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import type { PulseCheckIn, PulseCheckInType, PulseMetrics } from '../../domain';

interface Metric {
  key: keyof PulseMetrics;
  label: string;
  icon: React.ElementType;
  lowLabel: string;
  highLabel: string;
}

const METRICS: Metric[] = [
  { key: 'overallMomentum', label: 'Momentum Geral', icon: Zap, lowLabel: 'Estagnado', highLabel: 'Em aceleração' },
  { key: 'confidenceLevel', label: 'Nível de Confiança', icon: Star, lowLabel: 'Inseguro', highLabel: 'Muito confiante' },
  { key: 'challengeIntensity', label: 'Intensidade dos Desafios', icon: Target, lowLabel: 'Tranquilo', highLabel: 'Muito desafiador' },
  { key: 'mentorshipValue', label: 'Valor da Mentoria', icon: Heart, lowLabel: 'Pouco impacto', highLabel: 'Transformador' },
  { key: 'goalProgress', label: 'Progresso nos Objetivos', icon: TrendingUp, lowLabel: 'Parado', highLabel: 'Avançando muito' },
];

interface PulseCheckInSurfaceProps {
  menteeId: string;
  programId: string;
  tenantId: string;
  sessionId?: string;
  type?: PulseCheckInType;
  onComplete?: () => void;
}

export const PulseCheckInSurface: React.FC<PulseCheckInSurfaceProps> = ({
  menteeId,
  programId,
  tenantId,
  sessionId,
  type = 'WEEKLY',
  onComplete,
}) => {
  const [metrics, setMetrics] = useState<PulseMetrics>({
    overallMomentum: 5,
    confidenceLevel: 5,
    challengeIntensity: 5,
    mentorshipValue: 5,
    goalProgress: 5,
  });
  const [highlights, setHighlights] = useState('');
  const [blockers, setBlockers] = useState('');
  const [supportNeeded, setSupportNeeded] = useState('');
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);

  const setMetric = (key: keyof PulseMetrics, value: number) => {
    setMetrics(m => ({ ...m, [key]: value }));
  };

  const submit = async () => {
    if (!highlights.trim()) return;
    setSaving(true);
    try {
      await addDoc(collection(db, 'pulse_checkins'), {
        programId,
        menteeId,
        tenantId,
        sessionId: sessionId ?? null,
        type,
        metrics,
        highlights,
        blockers: blockers || null,
        supportNeeded: supportNeeded || null,
        createdAt: serverTimestamp(),
      });
      setDone(true);
      onComplete?.();
    } finally {
      setSaving(false);
    }
  };

  if (done) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-14 h-14 rounded-full bg-emerald-500/10 flex items-center justify-center mb-4">
          <CheckCircle2 size={28} className="text-emerald-500" />
        </div>
        <p className="text-base font-semibold text-foreground">Pulse registrado!</p>
        <p className="text-sm text-muted-foreground mt-1">Obrigado por compartilhar como você está.</p>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div>
        <h1 className="text-base font-semibold text-foreground">Pulse Check-In</h1>
        <p className="text-xs text-muted-foreground">
          {type === 'WEEKLY' ? 'Check-in semanal' :
           type === 'PRE_SESSION' ? 'Como você chega para a sessão?' :
           type === 'POST_SESSION' ? 'Como você saiu da sessão?' :
           'Check-in do programa'}
        </p>
      </div>

      {/* Metric sliders */}
      <div className="bg-card border border-border rounded-xl p-5 space-y-5">
        {METRICS.map(m => (
          <div key={m.key} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <m.icon size={14} className="text-muted-foreground" />
                <span className="text-xs font-medium text-foreground">{m.label}</span>
              </div>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(v => (
                  <button
                    key={v}
                    onClick={() => setMetric(m.key, v)}
                    className={`w-5 h-5 rounded-sm text-[9px] font-bold transition-colors ${
                      metrics[m.key] >= v
                        ? v <= 3 ? 'bg-red-500 text-white'
                        : v <= 6 ? 'bg-amber-500 text-white'
                        : 'bg-emerald-500 text-white'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex justify-between">
              <span className="text-[10px] text-muted-foreground">{m.lowLabel}</span>
              <span className="text-[10px] text-muted-foreground">{m.highLabel}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Qualitative */}
      <div className="bg-card border border-border rounded-xl p-5 space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-foreground">
            O que está indo bem? <span className="text-red-500">*</span>
          </label>
          <textarea
            value={highlights}
            onChange={e => setHighlights(e.target.value)}
            placeholder="Conte os seus destaques desta semana..."
            rows={3}
            className="w-full px-3 py-2.5 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500/20 resize-none"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-foreground">Algum bloqueio ou obstáculo? (opcional)</label>
          <textarea
            value={blockers}
            onChange={e => setBlockers(e.target.value)}
            placeholder="O que está travando seu progresso?"
            rows={2}
            className="w-full px-3 py-2.5 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500/20 resize-none"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-foreground">Que tipo de suporte você precisa? (opcional)</label>
          <textarea
            value={supportNeeded}
            onChange={e => setSupportNeeded(e.target.value)}
            placeholder="Feedback, conexão, recursos, prática..."
            rows={2}
            className="w-full px-3 py-2.5 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500/20 resize-none"
          />
        </div>
      </div>

      <button
        onClick={submit}
        disabled={!highlights.trim() || saving}
        className="w-full flex items-center justify-center gap-2 py-3 bg-emerald-600 text-white text-sm font-medium rounded-xl hover:bg-emerald-700 disabled:opacity-50 transition-colors"
      >
        {saving ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />}
        Enviar Pulse
      </button>
    </div>
  );
};
