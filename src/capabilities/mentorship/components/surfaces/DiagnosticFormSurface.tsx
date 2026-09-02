import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, ChevronRight, ChevronLeft, Loader2, Plus, Trash2, Sparkles } from 'lucide-react';
import { DiagnosticRepository } from '../../repositories/DiagnosticRepository';
import {
  ALL_COMPETENCIES, COMPETENCY_LABEL,
  type CompetencyRating, type DiagnosticAnswers, type LearningStyle, type Diagnostic,
} from '../../domain';

interface DiagnosticFormSurfaceProps {
  menteeId: string;
  programId: string;
  tenantId: string;
}

const LEARNING_STYLES: { value: LearningStyle; label: string; desc: string }[] = [
  { value: 'VISUAL',      label: 'Visual',     desc: 'Aprendo com gráficos, diagramas e imagens' },
  { value: 'AUDITORY',    label: 'Auditivo',   desc: 'Aprendo ouvindo e discutindo em voz alta' },
  { value: 'READING',     label: 'Leitura',    desc: 'Aprendo lendo e escrevendo anotações' },
  { value: 'KINESTHETIC', label: 'Prático',    desc: 'Aprendo fazendo e experimentando' },
];

const CADENCE_OPTIONS = ['Semanal', 'Quinzenal', 'Mensal'];

const STEPS = ['Contexto', 'Competências', 'Objetivos', 'Preferências'];

const defaultCompetencies = (): CompetencyRating[] =>
  ALL_COMPETENCIES.map(area => ({ area, currentLevel: 3, targetLevel: 4 }));

export const DiagnosticFormSurface: React.FC<DiagnosticFormSurfaceProps> = ({
  menteeId, programId, tenantId,
}) => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [diagnostic, setDiagnostic] = useState<Diagnostic | null>(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  // Step 0
  const [currentRole, setCurrentRole] = useState('');
  const [company, setCompany] = useState('');
  const [yearsInRole, setYearsInRole] = useState(1);
  const [biggestChallenge, setBiggestChallenge] = useState('');
  const [recentWin, setRecentWin] = useState('');

  // Step 1
  const [competencies, setCompetencies] = useState<CompetencyRating[]>(defaultCompetencies());

  // Step 2
  const [expectations, setExpectations] = useState('');
  const [goals, setGoals] = useState<string[]>(['']);

  // Step 3
  const [learningStyle, setLearningStyle] = useState<LearningStyle>('VISUAL');
  const [hoursPerWeek, setHoursPerWeek] = useState(3);
  const [cadence, setCadence] = useState('Quinzenal');

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    DiagnosticRepository.getByMentee(menteeId, programId).then(async d => {
      if (!d) {
        const id = await DiagnosticRepository.create({ menteeId, programId, tenantId });
        const created = await DiagnosticRepository.getById(id);
        setDiagnostic(created);
      } else {
        setDiagnostic(d);
        if (d.answers) {
          setCurrentRole(d.answers.currentRole);
          setCompany(d.answers.company ?? '');
          setYearsInRole(d.answers.yearsInRole);
          setBiggestChallenge(d.answers.biggestChallenge);
          setRecentWin(d.answers.recentWin);
          setCompetencies(d.answers.competencies);
          setExpectations(d.answers.mentoringExpectations);
          setGoals(d.answers.specificGoals.length ? d.answers.specificGoals : ['']);
          setLearningStyle(d.answers.learningStyle);
          setHoursPerWeek(d.answers.availableHoursPerWeek);
          setCadence(d.answers.preferredMeetingCadence);
        }
        if (d.status === 'SUBMITTED' || d.status === 'REVIEWED') {
          navigate('/mentee/workspace/diagnostico/relatorio');
          return;
        }
      }
      setLoading(false);
    });
  }, [menteeId, programId, tenantId]);

  const buildAnswers = (): DiagnosticAnswers => ({
    currentRole, company: company || undefined, yearsInRole,
    biggestChallenge, recentWin, competencies,
    mentoringExpectations: expectations,
    specificGoals: goals.filter(g => g.trim()),
    learningStyle, availableHoursPerWeek: hoursPerWeek,
    preferredMeetingCadence: cadence,
  });

  const validateStep = () => {
    const e: Record<string, string> = {};
    if (step === 0) {
      if (!currentRole.trim()) e.currentRole = 'Informe seu cargo';
      if (!biggestChallenge.trim() || biggestChallenge.length < 20)
        e.biggestChallenge = 'Descreva em ao menos 20 caracteres';
      if (!recentWin.trim() || recentWin.length < 20)
        e.recentWin = 'Descreva em ao menos 20 caracteres';
    }
    if (step === 2) {
      if (!expectations.trim() || expectations.length < 30)
        e.expectations = 'Descreva suas expectativas em ao menos 30 caracteres';
      if (goals.filter(g => g.trim()).length === 0)
        e.goals = 'Adicione ao menos um objetivo';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = async () => {
    if (!validateStep()) return;
    if (!diagnostic) return;
    setSaving(true);
    await DiagnosticRepository.saveAnswers(diagnostic.id, buildAnswers());
    setSaving(false);
    if (step < STEPS.length - 1) setStep(s => s + 1);
  };

  const submit = async () => {
    if (!validateStep()) return;
    if (!diagnostic) return;
    setSaving(true);
    await DiagnosticRepository.submit(diagnostic.id, buildAnswers());
    setSaving(false);
    navigate('/mentee/workspace/diagnostico/relatorio');
  };

  const updateCompetency = (index: number, field: 'currentLevel' | 'targetLevel', value: number) =>
    setCompetencies(prev => prev.map((c, i) => i === index ? { ...c, [field]: value } : c));

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 size={20} className="animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 text-emerald-600 text-xs font-medium rounded-full">
          <Sparkles size={12} />
          Diagnóstico Inicial
        </div>
        <h1 className="text-xl font-bold text-foreground">
          Vamos entender seu momento atual
        </h1>
        <p className="text-sm text-muted-foreground max-w-md mx-auto">
          Este diagnóstico ajuda seu mentor a preparar uma jornada personalizada para você.
          Leva cerca de 10 minutos.
        </p>
      </div>

      {/* Stepper */}
      <div className="flex items-center gap-0">
        {STEPS.map((s, i) => (
          <React.Fragment key={s}>
            <div className="flex flex-col items-center gap-1 flex-1">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                i < step ? 'bg-emerald-500 text-white' :
                i === step ? 'bg-emerald-600 text-white ring-4 ring-emerald-500/20' :
                'bg-muted text-muted-foreground'
              }`}>
                {i < step ? <CheckCircle2 size={14} /> : i + 1}
              </div>
              <span className={`text-[10px] font-medium ${i === step ? 'text-emerald-600' : 'text-muted-foreground'}`}>
                {s}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`h-px flex-1 mb-5 transition-colors ${i < step ? 'bg-emerald-500' : 'bg-border'}`} />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Step 0 — Contexto Atual */}
      {step === 0 && (
        <div className="bg-card border border-border rounded-xl p-6 space-y-5">
          <p className="text-sm font-semibold text-foreground">Seu contexto atual</p>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5 col-span-2 sm:col-span-1">
              <label className="text-xs font-medium text-foreground">Cargo atual *</label>
              <input
                value={currentRole}
                onChange={e => { setCurrentRole(e.target.value); setErrors(p => ({...p, currentRole:''})); }}
                placeholder="Ex: Gerente de Produto"
                className={`w-full px-3 py-2.5 bg-background border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500/20 ${errors.currentRole ? 'border-red-500' : 'border-border'}`}
              />
              {errors.currentRole && <p className="text-xs text-red-500">{errors.currentRole}</p>}
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">Empresa</label>
              <input
                value={company}
                onChange={e => setCompany(e.target.value)}
                placeholder="Nome da empresa"
                className="w-full px-3 py-2.5 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-foreground">Anos neste cargo/área: <span className="text-emerald-600 font-bold">{yearsInRole} ano{yearsInRole !== 1 ? 's' : ''}</span></label>
            <input
              type="range" min={0} max={30} value={yearsInRole}
              onChange={e => setYearsInRole(Number(e.target.value))}
              className="w-full accent-emerald-600"
            />
            <div className="flex justify-between text-[10px] text-muted-foreground">
              <span>Menos de 1 ano</span><span>30+ anos</span>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-foreground">Qual é o seu maior desafio hoje? *</label>
            <textarea
              value={biggestChallenge}
              onChange={e => { setBiggestChallenge(e.target.value); setErrors(p => ({...p, biggestChallenge:''})); }}
              placeholder="Descreva o principal obstáculo que você enfrenta no trabalho..."
              rows={3}
              className={`w-full px-3 py-2.5 bg-background border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500/20 resize-none ${errors.biggestChallenge ? 'border-red-500' : 'border-border'}`}
            />
            <div className="flex justify-between items-center">
              {errors.biggestChallenge
                ? <p className="text-xs text-red-500">{errors.biggestChallenge}</p>
                : <span />}
              <p className="text-[10px] text-muted-foreground">{biggestChallenge.length}/1000</p>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-foreground">Uma conquista recente que te orgulha *</label>
            <textarea
              value={recentWin}
              onChange={e => { setRecentWin(e.target.value); setErrors(p => ({...p, recentWin:''})); }}
              placeholder="Conte sobre algo que você realizou e que te deixou orgulhoso(a)..."
              rows={3}
              className={`w-full px-3 py-2.5 bg-background border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500/20 resize-none ${errors.recentWin ? 'border-red-500' : 'border-border'}`}
            />
            {errors.recentWin && <p className="text-xs text-red-500">{errors.recentWin}</p>}
          </div>
        </div>
      )}

      {/* Step 1 — Competências */}
      {step === 1 && (
        <div className="bg-card border border-border rounded-xl p-6 space-y-5">
          <div>
            <p className="text-sm font-semibold text-foreground">Autoavaliação de Competências</p>
            <p className="text-xs text-muted-foreground mt-1">
              Para cada área, avalie seu nível atual e onde quer chegar (1 = iniciante · 5 = referência)
            </p>
          </div>
          <div className="space-y-5">
            {competencies.map((c, i) => (
              <div key={c.area} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-foreground">{COMPETENCY_LABEL[c.area]}</span>
                  <span className="text-[10px] text-muted-foreground">
                    Atual: <strong className="text-foreground">{c.currentLevel}</strong>
                    {' → '}
                    Meta: <strong className="text-emerald-600">{c.targetLevel}</strong>
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-[10px] text-muted-foreground">Nível atual</p>
                    <div className="flex gap-1">
                      {[1,2,3,4,5].map(n => (
                        <button
                          key={n}
                          type="button"
                          onClick={() => updateCompetency(i, 'currentLevel', n)}
                          className={`flex-1 h-7 rounded text-xs font-medium transition-colors ${
                            n <= c.currentLevel
                              ? 'bg-slate-600 text-white'
                              : 'bg-muted text-muted-foreground hover:bg-muted/80'
                          }`}
                        >{n}</button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] text-muted-foreground">Onde quero chegar</p>
                    <div className="flex gap-1">
                      {[1,2,3,4,5].map(n => (
                        <button
                          key={n}
                          type="button"
                          onClick={() => updateCompetency(i, 'targetLevel', n)}
                          className={`flex-1 h-7 rounded text-xs font-medium transition-colors ${
                            n <= c.targetLevel
                              ? 'bg-emerald-600 text-white'
                              : 'bg-muted text-muted-foreground hover:bg-muted/80'
                          }`}
                        >{n}</button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Step 2 — Objetivos */}
      {step === 2 && (
        <div className="bg-card border border-border rounded-xl p-6 space-y-5">
          <p className="text-sm font-semibold text-foreground">Objetivos e Expectativas</p>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-foreground">O que você espera desta mentoria? *</label>
            <textarea
              value={expectations}
              onChange={e => { setExpectations(e.target.value); setErrors(p => ({...p, expectations:''})); }}
              placeholder="Descreva o que você quer conquistar ao final do programa..."
              rows={4}
              className={`w-full px-3 py-2.5 bg-background border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500/20 resize-none ${errors.expectations ? 'border-red-500' : 'border-border'}`}
            />
            {errors.expectations && <p className="text-xs text-red-500">{errors.expectations}</p>}
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-foreground">Objetivos específicos *</label>
              {goals.length < 5 && (
                <button
                  type="button"
                  onClick={() => setGoals(p => [...p, ''])}
                  className="flex items-center gap-1 text-xs text-emerald-600 font-medium hover:text-emerald-700 transition-colors"
                >
                  <Plus size={12} /> Adicionar
                </button>
              )}
            </div>
            {errors.goals && <p className="text-xs text-red-500">{errors.goals}</p>}
            {goals.map((g, i) => (
              <div key={i} className="flex gap-2">
                <input
                  value={g}
                  onChange={e => {
                    setGoals(p => p.map((x, idx) => idx === i ? e.target.value : x));
                    setErrors(p => ({...p, goals:''}));
                  }}
                  placeholder={`Objetivo ${i + 1}`}
                  className="flex-1 px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
                {goals.length > 1 && (
                  <button
                    type="button"
                    onClick={() => setGoals(p => p.filter((_, idx) => idx !== i))}
                    className="p-2 text-muted-foreground hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Step 3 — Preferências */}
      {step === 3 && (
        <div className="bg-card border border-border rounded-xl p-6 space-y-5">
          <p className="text-sm font-semibold text-foreground">Estilo de Aprendizagem e Preferências</p>

          <div className="space-y-2">
            <p className="text-xs font-medium text-foreground">Como você aprende melhor?</p>
            <div className="grid grid-cols-2 gap-2">
              {LEARNING_STYLES.map(ls => (
                <button
                  key={ls.value}
                  type="button"
                  onClick={() => setLearningStyle(ls.value)}
                  className={`flex flex-col items-start p-3 rounded-xl border text-left transition-colors ${
                    learningStyle === ls.value
                      ? 'border-emerald-500 bg-emerald-500/10'
                      : 'border-border hover:bg-muted/50'
                  }`}
                >
                  <span className={`text-xs font-semibold ${learningStyle === ls.value ? 'text-emerald-600' : 'text-foreground'}`}>
                    {ls.label}
                  </span>
                  <span className="text-[10px] text-muted-foreground mt-0.5 leading-relaxed">{ls.desc}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-foreground">
              Horas disponíveis por semana para desenvolvimento: <span className="text-emerald-600 font-bold">{hoursPerWeek}h</span>
            </label>
            <input
              type="range" min={1} max={20} value={hoursPerWeek}
              onChange={e => setHoursPerWeek(Number(e.target.value))}
              className="w-full accent-emerald-600"
            />
            <div className="flex justify-between text-[10px] text-muted-foreground">
              <span>1h</span><span>20h</span>
            </div>
          </div>

          <div className="space-y-1.5">
            <p className="text-xs font-medium text-foreground">Cadência preferida de encontros</p>
            <div className="flex gap-2">
              {CADENCE_OPTIONS.map(opt => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setCadence(opt)}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-medium transition-colors ${
                    cadence === opt
                      ? 'bg-emerald-600 text-white'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center gap-3">
        {step > 0 && (
          <button
            onClick={() => setStep(s => s - 1)}
            className="flex items-center gap-2 px-4 py-2.5 bg-muted text-muted-foreground text-sm font-medium rounded-xl hover:bg-muted/80 transition-colors"
          >
            <ChevronLeft size={16} /> Voltar
          </button>
        )}
        <div className="flex-1" />
        {step < STEPS.length - 1 ? (
          <button
            onClick={next}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 text-white text-sm font-medium rounded-xl hover:bg-emerald-700 disabled:opacity-50 transition-colors"
          >
            {saving ? <Loader2 size={16} className="animate-spin" /> : null}
            Próximo <ChevronRight size={16} />
          </button>
        ) : (
          <button
            onClick={submit}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 text-white text-sm font-medium rounded-xl hover:bg-emerald-700 disabled:opacity-50 transition-colors"
          >
            {saving ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />}
            Enviar Diagnóstico
          </button>
        )}
      </div>
    </div>
  );
};
