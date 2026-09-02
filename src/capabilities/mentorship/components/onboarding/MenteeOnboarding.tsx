import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, ChevronLeft, CheckCircle2, Loader2, User, Target, Briefcase, Sparkles, MessageSquare } from 'lucide-react';
import { ProfileRepository } from '../../repositories/ProfileRepository';
import { OnboardingEngine } from '../../../../core/onboarding/OnboardingEngine';
import type { CareerStage, MenteePriorityArea } from '../../domain';

const CAREER_STAGES: { value: CareerStage; label: string; desc: string }[] = [
  { value: 'EARLY_CAREER', label: 'Início de Carreira', desc: '0-3 anos de experiência' },
  { value: 'MID_CAREER', label: 'Meio de Carreira', desc: '4-10 anos' },
  { value: 'SENIOR', label: 'Sênior', desc: '10+ anos' },
  { value: 'EXECUTIVE', label: 'Executivo', desc: 'C-Level ou equivalente' },
  { value: 'TRANSITION', label: 'Em Transição', desc: 'Mudando de área ou setor' },
  { value: 'ENTREPRENEUR', label: 'Empreendedor', desc: 'Fundador ou sócio' },
];

const PRIORITY_AREAS: { value: MenteePriorityArea; label: string }[] = [
  { value: 'CAREER_GROWTH', label: 'Crescimento de Carreira' },
  { value: 'LEADERSHIP_SKILLS', label: 'Liderança' },
  { value: 'TECHNICAL_SKILLS', label: 'Habilidades Técnicas' },
  { value: 'STRATEGIC_THINKING', label: 'Pensamento Estratégico' },
  { value: 'NETWORK_EXPANSION', label: 'Expansão de Rede' },
  { value: 'ENTREPRENEURSHIP', label: 'Empreendedorismo' },
  { value: 'EXECUTIVE_PRESENCE', label: 'Presença Executiva' },
  { value: 'WORK_LIFE_BALANCE', label: 'Equilíbrio Vida-Trabalho' },
];

interface FormData {
  displayName: string;
  bio: string;
  currentRole: string;
  company: string;
  industry: string;
  careerStage: CareerStage | '';
  yearsExperience: number;
  priorityAreas: MenteePriorityArea[];
  developmentGoals: string;
  biggestChallenge: string;
  mentorPreferenceNotes: string;
}

const INITIAL: FormData = {
  displayName: '',
  bio: '',
  currentRole: '',
  company: '',
  industry: '',
  careerStage: '',
  yearsExperience: 0,
  priorityAreas: [],
  developmentGoals: '',
  biggestChallenge: '',
  mentorPreferenceNotes: '',
};

const STEPS = [
  { label: 'Perfil', icon: User },
  { label: 'Carreira', icon: Briefcase },
  { label: 'Prioridades', icon: Target },
  { label: 'Objetivos', icon: Sparkles },
  { label: 'Preferências', icon: MessageSquare },
];

interface MenteeOnboardingProps {
  userId: string;
  tenantId: string;
  programId: string;
}

export const MenteeOnboarding: React.FC<MenteeOnboardingProps> = ({ userId, tenantId, programId }) => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormData>(INITIAL);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  const set = <K extends keyof FormData>(key: K, value: FormData[K]) => {
    setForm(f => ({ ...f, [key]: value }));
    setErrors(e => ({ ...e, [key]: undefined }));
  };

  const togglePriority = (area: MenteePriorityArea) => {
    setForm(f => {
      const has = f.priorityAreas.includes(area);
      if (!has && f.priorityAreas.length >= 3) return f;
      return {
        ...f,
        priorityAreas: has ? f.priorityAreas.filter(a => a !== area) : [...f.priorityAreas, area],
      };
    });
  };

  const validateStep = (): boolean => {
    const e: typeof errors = {};
    if (step === 0) {
      if (!form.displayName.trim() || form.displayName.length < 2) e.displayName = 'Nome obrigatório (mín. 2 caracteres)';
    }
    if (step === 1) {
      if (!form.currentRole.trim()) e.currentRole = 'Cargo atual obrigatório';
      if (!form.industry.trim()) e.industry = 'Setor obrigatório';
      if (!form.careerStage) e.careerStage = 'Selecione seu estágio';
    }
    if (step === 2) {
      if (form.priorityAreas.length === 0) e.priorityAreas = 'Selecione ao menos 1 prioridade';
    }
    if (step === 3) {
      if (!form.developmentGoals.trim()) e.developmentGoals = 'Informe ao menos um objetivo';
      if (!form.biggestChallenge.trim() || form.biggestChallenge.length < 20) e.biggestChallenge = 'Descreva seu maior desafio (mín. 20 caracteres)';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => {
    if (!validateStep()) return;
    setStep(s => s + 1);
  };

  const submit = async () => {
    if (!validateStep()) return;
    setSaving(true);
    try {
      await ProfileRepository.upsertMentee({
        id: `${userId}-${programId}`,
        userId,
        tenantId,
        programId,
        displayName: form.displayName,
        bio: form.bio,
        developmentContext: {
          currentRole: form.currentRole,
          company: form.company || undefined,
          industry: form.industry,
          careerStage: form.careerStage as CareerStage,
          yearsExperience: form.yearsExperience,
          priorityAreas: form.priorityAreas,
          developmentGoals: form.developmentGoals.split('\n').filter(Boolean),
          biggestChallenge: form.biggestChallenge,
        },
        mentorPreferences: {
          preferredExpertise: [],
          notes: form.mentorPreferenceNotes || undefined,
        },
        onboardingCompleted: true,
      });

      OnboardingEngine.transitionTo(tenantId, 'MENTEE_CONTEXT_SETUP', userId);
      OnboardingEngine.transitionTo(tenantId, 'COMPLETED', userId);

      navigate('/mentee/workspace');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-600/10 mb-4">
            <Target size={22} className="text-emerald-600" />
          </div>
          <h1 className="text-xl font-bold text-foreground">Bem-vindo ao Programa!</h1>
          <p className="text-sm text-muted-foreground mt-1">Configure seu perfil em {STEPS.length} passos e encontre o mentor ideal.</p>
        </div>

        {/* Stepper */}
        <div className="flex items-center justify-between mb-8 px-2">
          {STEPS.map((s, i) => (
            <React.Fragment key={s.label}>
              <div className="flex flex-col items-center gap-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                  i < step ? 'bg-emerald-600 text-white' :
                  i === step ? 'bg-emerald-600/20 text-emerald-600 border-2 border-emerald-600' :
                  'bg-muted text-muted-foreground'
                }`}>
                  {i < step ? <CheckCircle2 size={16} /> : i + 1}
                </div>
                <span className={`text-[10px] font-medium ${i === step ? 'text-emerald-600' : 'text-muted-foreground'}`}>
                  {s.label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`flex-1 h-px mx-1 mb-4 ${i < step ? 'bg-emerald-600' : 'bg-border'}`} />
              )}
            </React.Fragment>
          ))}
        </div>

        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
          {step === 0 && <MenteeStepProfile form={form} errors={errors} set={set} />}
          {step === 1 && <MenteeStepCareer form={form} errors={errors} set={set} />}
          {step === 2 && <MenteeStepPriorities form={form} errors={errors} set={set} toggle={togglePriority} />}
          {step === 3 && <MenteeStepGoals form={form} errors={errors} set={set} />}
          {step === 4 && <MenteeStepPreferences form={form} errors={errors} set={set} />}
        </div>

        <div className="flex items-center justify-between mt-6">
          <button
            onClick={() => setStep(s => Math.max(0, s - 1))}
            disabled={step === 0}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors"
          >
            <ChevronLeft size={16} />
            Voltar
          </button>
          {step < STEPS.length - 1 ? (
            <button
              onClick={next}
              className="flex items-center gap-1.5 px-5 py-2.5 bg-emerald-600 text-white text-sm font-medium rounded-xl hover:bg-emerald-700 transition-colors"
            >
              Continuar <ChevronRight size={16} />
            </button>
          ) : (
            <button
              onClick={submit}
              disabled={saving}
              className="flex items-center gap-1.5 px-5 py-2.5 bg-emerald-600 text-white text-sm font-medium rounded-xl hover:bg-emerald-700 disabled:opacity-50 transition-colors"
            >
              {saving ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />}
              Concluir Perfil
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// Helpers
const Field: React.FC<{ label: string; error?: string; children: React.ReactNode }> = ({ label, error, children }) => (
  <div className="space-y-1.5">
    <label className="text-xs font-medium text-foreground">{label}</label>
    {children}
    {error && <p className="text-xs text-red-500">{error}</p>}
  </div>
);

const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { hasError?: boolean }> = ({ hasError, ...props }) => (
  <input
    {...props}
    className={`w-full px-3 py-2.5 bg-background border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-shadow ${
      hasError ? 'border-red-500' : 'border-border'
    } ${props.className ?? ''}`}
  />
);

const Textarea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement> & { hasError?: boolean }> = ({ hasError, ...props }) => (
  <textarea
    {...props}
    className={`w-full px-3 py-2.5 bg-background border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500/20 resize-none transition-shadow ${
      hasError ? 'border-red-500' : 'border-border'
    } ${props.className ?? ''}`}
  />
);

interface StepProps {
  form: FormData;
  errors: Partial<Record<keyof FormData, string>>;
  set: <K extends keyof FormData>(key: K, value: FormData[K]) => void;
  toggle?: (a: MenteePriorityArea) => void;
}

const MenteeStepProfile: React.FC<StepProps> = ({ form, errors, set }) => (
  <div className="space-y-4">
    <h2 className="text-sm font-semibold text-foreground mb-4">Quem é você?</h2>
    <Field label="Nome completo" error={errors.displayName}>
      <Input value={form.displayName} onChange={e => set('displayName', e.target.value)} placeholder="Seu nome" hasError={!!errors.displayName} />
    </Field>
    <Field label="Apresentação breve (opcional)">
      <Textarea value={form.bio} onChange={e => set('bio', e.target.value)} placeholder="Fale um pouco sobre você e o que te trouxe ao programa..." rows={4} />
    </Field>
  </div>
);

const MenteeStepCareer: React.FC<StepProps> = ({ form, errors, set }) => (
  <div className="space-y-4">
    <h2 className="text-sm font-semibold text-foreground mb-4">Contexto Profissional</h2>
    <div className="grid grid-cols-2 gap-3">
      <Field label="Cargo atual" error={errors.currentRole}>
        <Input value={form.currentRole} onChange={e => set('currentRole', e.target.value)} placeholder="Gerente, Analista..." hasError={!!errors.currentRole} />
      </Field>
      <Field label="Empresa (opcional)">
        <Input value={form.company} onChange={e => set('company', e.target.value)} placeholder="Nome da empresa" />
      </Field>
    </div>
    <Field label="Setor" error={errors.industry}>
      <Input value={form.industry} onChange={e => set('industry', e.target.value)} placeholder="Tecnologia, Varejo, Saúde..." hasError={!!errors.industry} />
    </Field>
    <Field label="Estágio de carreira" error={errors.careerStage}>
      <div className="grid grid-cols-2 gap-2 mt-1">
        {CAREER_STAGES.map(cs => (
          <button
            key={cs.value}
            type="button"
            onClick={() => set('careerStage', cs.value)}
            className={`flex flex-col items-start p-2.5 rounded-lg border text-left transition-colors ${
              form.careerStage === cs.value
                ? 'border-emerald-600 bg-emerald-600/10'
                : 'border-border hover:bg-muted/50'
            }`}
          >
            <span className={`text-xs font-medium ${form.careerStage === cs.value ? 'text-emerald-600' : 'text-foreground'}`}>{cs.label}</span>
            <span className="text-[10px] text-muted-foreground">{cs.desc}</span>
          </button>
        ))}
      </div>
    </Field>
    <Field label="Anos de experiência">
      <Input type="number" min={0} max={50} value={form.yearsExperience} onChange={e => set('yearsExperience', Number(e.target.value))} />
    </Field>
  </div>
);

const MenteeStepPriorities: React.FC<StepProps> = ({ form, errors, set, toggle }) => (
  <div className="space-y-4">
    <h2 className="text-sm font-semibold text-foreground mb-1">O que você quer desenvolver?</h2>
    <p className="text-xs text-muted-foreground mb-4">Selecione até 3 prioridades.</p>
    <Field label="Áreas prioritárias" error={errors.priorityAreas as string}>
      <div className="grid grid-cols-2 gap-2 mt-1">
        {PRIORITY_AREAS.map(pa => {
          const selected = form.priorityAreas.includes(pa.value);
          return (
            <button
              key={pa.value}
              type="button"
              onClick={() => toggle?.(pa.value)}
              className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border text-left text-xs font-medium transition-colors ${
                selected
                  ? 'border-emerald-600 bg-emerald-600/10 text-emerald-600'
                  : 'border-border text-muted-foreground hover:bg-muted/50 hover:text-foreground'
              }`}
            >
              {selected && <CheckCircle2 size={12} className="flex-shrink-0" />}
              {pa.label}
            </button>
          );
        })}
      </div>
    </Field>
  </div>
);

const MenteeStepGoals: React.FC<StepProps> = ({ form, errors, set }) => (
  <div className="space-y-4">
    <h2 className="text-sm font-semibold text-foreground mb-4">Objetivos de Desenvolvimento</h2>
    <Field label="O que você quer alcançar neste programa? (um por linha)" error={errors.developmentGoals}>
      <Textarea
        value={form.developmentGoals}
        onChange={e => set('developmentGoals', e.target.value)}
        placeholder="Conseguir minha primeira posição de liderança&#10;Aprender a fazer apresentações executivas&#10;Definir meu plano de carreira de 5 anos"
        rows={4}
        hasError={!!errors.developmentGoals}
      />
    </Field>
    <Field label="Qual é o seu maior desafio agora?" error={errors.biggestChallenge}>
      <Textarea
        value={form.biggestChallenge}
        onChange={e => set('biggestChallenge', e.target.value)}
        placeholder="Tenho dificuldade em delegar e acabo sobrecarregado. Sinto que preciso de mais autoridade com o time..."
        rows={3}
        hasError={!!errors.biggestChallenge}
      />
    </Field>
  </div>
);

const MenteeStepPreferences: React.FC<StepProps> = ({ form, errors, set }) => (
  <div className="space-y-4">
    <h2 className="text-sm font-semibold text-foreground mb-4">Preferências de Mentor</h2>
    <Field label="Há algo específico que busca em um mentor? (opcional)">
      <Textarea
        value={form.mentorPreferenceNotes}
        onChange={e => set('mentorPreferenceNotes', e.target.value)}
        placeholder="Prefiro alguém do setor de tecnologia que já tenha escalado equipes. Gosto de mentores diretos e orientados a dados..."
        rows={4}
      />
    </Field>
    <div className="p-4 bg-emerald-600/5 border border-emerald-600/20 rounded-xl">
      <p className="text-xs font-medium text-emerald-600 mb-1">Pronto para começar!</p>
      <p className="text-xs text-muted-foreground">
        Com seu perfil completo, o algoritmo de matching irá propor um mentor ideal. Você também poderá ver suas sessões, OKRs e a síntese de cada encontro gerada por IA.
      </p>
    </div>
  </div>
);
