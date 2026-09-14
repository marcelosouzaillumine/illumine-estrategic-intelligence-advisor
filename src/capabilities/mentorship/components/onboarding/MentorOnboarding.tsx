import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, ChevronLeft, CheckCircle2, Loader2, User, Briefcase, Target, Clock, Sparkles } from 'lucide-react';
import { ProfileRepository } from '../../repositories/ProfileRepository';
import { OnboardingEngine } from '../../../../core/onboarding/OnboardingEngine';
import type { ExpertiseDomain, MentorExperience } from '../../domain';
import { z } from 'zod';

const EXPERTISE_OPTIONS: { value: ExpertiseDomain; label: string }[] = [
  { value: 'LEADERSHIP', label: 'Liderança' },
  { value: 'STRATEGY', label: 'Estratégia' },
  { value: 'FINANCE', label: 'Finanças' },
  { value: 'TECHNOLOGY', label: 'Tecnologia' },
  { value: 'MARKETING', label: 'Marketing' },
  { value: 'OPERATIONS', label: 'Operações' },
  { value: 'PEOPLE', label: 'Pessoas & RH' },
  { value: 'INNOVATION', label: 'Inovação' },
  { value: 'GOVERNANCE', label: 'Governança' },
  { value: 'ENTREPRENEURSHIP', label: 'Empreendedorismo' },
  { value: 'SALES', label: 'Vendas' },
  { value: 'PRODUCT', label: 'Produto' },
];

interface FormData {
  displayName: string;
  bio: string;
  expertiseDomains: ExpertiseDomain[];
  industries: string;
  currentRole: string;
  currentCompany: string;
  yearsExperience: number;
  highlights: string;
  mentoringStyle: string;
  expectedOutcomes: string;
  maxMentees: number;
  timezone: string;
}

const INITIAL: FormData = {
  displayName: '',
  bio: '',
  expertiseDomains: [],
  industries: '',
  currentRole: '',
  currentCompany: '',
  yearsExperience: 0,
  highlights: '',
  mentoringStyle: '',
  expectedOutcomes: '',
  maxMentees: 2,
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
};

interface MentorOnboardingProps {
  userId: string;
  tenantId: string;
  programId: string;
}

const STEPS = [
  { label: 'Perfil', icon: User },
  { label: 'Expertise', icon: Target },
  { label: 'Experiência', icon: Briefcase },
  { label: 'Estilo', icon: Sparkles },
  { label: 'Disponibilidade', icon: Clock },
];

export const MentorOnboarding: React.FC<MentorOnboardingProps> = ({ userId, tenantId, programId }) => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormData>(INITIAL);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  const set = <K extends keyof FormData>(key: K, value: FormData[K]) => {
    setForm(f => ({ ...f, [key]: value }));
    setErrors(e => ({ ...e, [key]: undefined }));
  };

  const toggleExpertise = (domain: ExpertiseDomain) => {
    setForm(f => {
      const has = f.expertiseDomains.includes(domain);
      if (!has && f.expertiseDomains.length >= 5) return f;
      return {
        ...f,
        expertiseDomains: has
          ? f.expertiseDomains.filter(d => d !== domain)
          : [...f.expertiseDomains, domain],
      };
    });
  };

  const validateStep = (): boolean => {
    const e: typeof errors = {};
    if (step === 0) {
      if (!form.displayName.trim() || form.displayName.length < 2) e.displayName = 'Nome obrigatório (mín. 2 caracteres)';
      if (!form.bio.trim() || form.bio.length < 50) e.bio = 'Bio deve ter ao menos 50 caracteres';
    }
    if (step === 1) {
      if (form.expertiseDomains.length === 0) e.expertiseDomains = 'Selecione ao menos 1 área';
      if (!form.industries.trim()) e.industries = 'Informe ao menos um setor';
    }
    if (step === 2) {
      if (!form.currentRole.trim()) e.currentRole = 'Cargo atual obrigatório';
    }
    if (step === 3) {
      if (!form.mentoringStyle.trim() || form.mentoringStyle.length < 20) e.mentoringStyle = 'Descreva seu estilo (mín. 20 caracteres)';
      if (!form.expectedOutcomes.trim()) e.expectedOutcomes = 'Informe ao menos um resultado esperado';
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
      const experience: MentorExperience[] = [{
        role: form.currentRole,
        company: form.currentCompany,
        years: form.yearsExperience,
        highlights: form.highlights.split('\n').filter(Boolean),
      }];

      await ProfileRepository.upsertMentor({
        id: `${userId}-${programId}`,
        userId,
        tenantId,
        programId,
        displayName: form.displayName,
        bio: form.bio,
        expertiseDomains: form.expertiseDomains,
        industries: form.industries.split(',').map(s => s.trim()).filter(Boolean),
        experience,
        availability: {
          status: 'AVAILABLE',
          maxMentees: form.maxMentees,
          currentMentees: 0,
          timezone: form.timezone,
        },
        mentoringStyle: form.mentoringStyle,
        expectedOutcomes: form.expectedOutcomes.split('\n').filter(Boolean),
        onboardingCompleted: true,
      });

      OnboardingEngine.transitionTo(tenantId, 'MENTOR_PROFILE_SETUP', userId);
      OnboardingEngine.transitionTo(tenantId, 'COMPLETED', userId);

      navigate('/mentor/workspace');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 mb-4">
            <Sparkles size={22} className="text-primary" />
          </div>
          <h1 className="text-xl font-bold text-foreground">Bem-vindo, Mentor!</h1>
          <p className="text-sm text-muted-foreground mt-1">Configure seu perfil em {STEPS.length} passos simples.</p>
        </div>

        {/* Stepper */}
        <div className="flex items-center justify-between mb-8 px-2">
          {STEPS.map((s, i) => (
            <React.Fragment key={s.label}>
              <div className="flex flex-col items-center gap-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                  i < step ? 'bg-primary text-primary-foreground' :
                  i === step ? 'bg-primary/20 text-primary border-2 border-primary' :
                  'bg-muted text-muted-foreground'
                }`}>
                  {i < step ? <CheckCircle2 size={16} /> : i + 1}
                </div>
                <span className={`text-[10px] font-medium ${i === step ? 'text-primary' : 'text-muted-foreground'}`}>
                  {s.label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`flex-1 h-px mx-1 mb-4 ${i < step ? 'bg-primary' : 'bg-border'}`} />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Card */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
          {step === 0 && (
            <StepProfile form={form} errors={errors} set={set} />
          )}
          {step === 1 && (
            <StepExpertise form={form} errors={errors} set={set} toggle={toggleExpertise} />
          )}
          {step === 2 && (
            <StepExperience form={form} errors={errors} set={set} />
          )}
          {step === 3 && (
            <StepStyle form={form} errors={errors} set={set} />
          )}
          {step === 4 && (
            <StepAvailability form={form} errors={errors} set={set} />
          )}
        </div>

        {/* Navigation */}
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
              className="flex items-center gap-1.5 px-5 py-2.5 bg-primary text-primary-foreground text-sm font-medium rounded-xl hover:opacity-90 transition-opacity"
            >
              Continuar
              <ChevronRight size={16} />
            </button>
          ) : (
            <button
              onClick={submit}
              disabled={saving}
              className="flex items-center gap-1.5 px-5 py-2.5 bg-primary text-primary-foreground text-sm font-medium rounded-xl hover:opacity-90 disabled:opacity-50 transition-opacity"
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

// Step components

const Field: React.FC<{ label: string; error?: string; children: React.ReactNode }> = ({ label, error, children }) => (
  <div className="space-y-1.5">
    <label className="text-xs font-medium text-foreground">{label}</label>
    {children}
    {error && <p className="text-xs text-red-500">{error}</p>}
  </div>
);

const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { error?: boolean }> = ({ error, ...props }) => (
  <input
    {...props}
    className={`w-full px-3 py-2.5 bg-background border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-shadow ${
      error ? 'border-red-500' : 'border-border'
    } ${props.className ?? ''}`}
  />
);

const Textarea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement> & { error?: boolean }> = ({ error, ...props }) => (
  <textarea
    {...props}
    className={`w-full px-3 py-2.5 bg-background border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none transition-shadow ${
      error ? 'border-red-500' : 'border-border'
    } ${props.className ?? ''}`}
  />
);

interface StepProps {
  form: FormData;
  errors: Partial<Record<keyof FormData, string>>;
  set: <K extends keyof FormData>(key: K, value: FormData[K]) => void;
  toggle?: (d: ExpertiseDomain) => void;
}

const StepProfile: React.FC<StepProps> = ({ form, errors, set }) => (
  <div className="space-y-4">
    <h2 className="text-sm font-semibold text-foreground mb-4">Informações Básicas</h2>
    <Field label="Nome completo" error={errors.displayName}>
      <Input
        value={form.displayName}
        onChange={e => set('displayName', e.target.value)}
        placeholder="Seu nome"
        error={!!errors.displayName}
      />
    </Field>
    <Field label="Bio / Apresentação" error={errors.bio}>
      <Textarea
        value={form.bio}
        onChange={e => set('bio', e.target.value)}
        placeholder="Apresente-se: quem você é, o que o motiva a ser mentor, e qual é a sua missão como líder..."
        rows={5}
        error={!!errors.bio}
      />
      <p className="text-[10px] text-muted-foreground">{form.bio.length}/2000 caracteres (mín. 50)</p>
    </Field>
  </div>
);

const StepExpertise: React.FC<StepProps> = ({ form, errors, set, toggle }) => (
  <div className="space-y-4">
    <h2 className="text-sm font-semibold text-foreground mb-4">Áreas de Expertise</h2>
    <Field label="Domínios de expertise (máx. 5)" error={errors.expertiseDomains as string}>
      <div className="flex flex-wrap gap-2 mt-1">
        {EXPERTISE_OPTIONS.map(opt => {
          const selected = form.expertiseDomains.includes(opt.value);
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => toggle?.(opt.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                selected
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </Field>
    <Field label="Setores de atuação" error={errors.industries}>
      <Input
        value={form.industries}
        onChange={e => set('industries', e.target.value)}
        placeholder="ex: Tecnologia, Varejo, Saúde (separados por vírgula)"
        error={!!errors.industries}
      />
    </Field>
  </div>
);

const StepExperience: React.FC<StepProps> = ({ form, errors, set }) => (
  <div className="space-y-4">
    <h2 className="text-sm font-semibold text-foreground mb-4">Experiência Profissional</h2>
    <div className="grid grid-cols-2 gap-3">
      <Field label="Cargo atual" error={errors.currentRole}>
        <Input
          value={form.currentRole}
          onChange={e => set('currentRole', e.target.value)}
          placeholder="CEO, VP, Diretor..."
          error={!!errors.currentRole}
        />
      </Field>
      <Field label="Empresa">
        <Input
          value={form.currentCompany}
          onChange={e => set('currentCompany', e.target.value)}
          placeholder="Nome da empresa"
        />
      </Field>
    </div>
    <Field label="Anos de experiência">
      <Input
        type="number"
        min={0}
        max={50}
        value={form.yearsExperience}
        onChange={e => set('yearsExperience', Number(e.target.value))}
      />
    </Field>
    <Field label="Principais realizações (uma por linha)">
      <Textarea
        value={form.highlights}
        onChange={e => set('highlights', e.target.value)}
        placeholder="Escalei empresa de 10 a 500 pessoas&#10;Liderou fusão de R$200M&#10;Criou programa de inovação premiado..."
        rows={4}
      />
    </Field>
  </div>
);

const StepStyle: React.FC<StepProps> = ({ form, errors, set }) => (
  <div className="space-y-4">
    <h2 className="text-sm font-semibold text-foreground mb-4">Estilo de Mentoria</h2>
    <Field label="Como você conduz as sessões?" error={errors.mentoringStyle}>
      <Textarea
        value={form.mentoringStyle}
        onChange={e => set('mentoringStyle', e.target.value)}
        placeholder="Sou direto e orientado a resultados. Gosto de fazer perguntas desafiadoras e definir ações claras em cada sessão. Valorizo autonomia e responsabilidade do mentorado..."
        rows={4}
        error={!!errors.mentoringStyle}
      />
    </Field>
    <Field label="O que seus mentorados podem esperar alcançar?" error={errors.expectedOutcomes}>
      <Textarea
        value={form.expectedOutcomes}
        onChange={e => set('expectedOutcomes', e.target.value)}
        placeholder="Clareza sobre o próximo passo de carreira&#10;Habilidades de liderança aplicadas&#10;Rede de contatos estratégica..."
        rows={3}
        error={!!errors.expectedOutcomes}
      />
    </Field>
  </div>
);

const StepAvailability: React.FC<StepProps> = ({ form, errors, set }) => (
  <div className="space-y-4">
    <h2 className="text-sm font-semibold text-foreground mb-4">Disponibilidade</h2>
    <Field label="Máximo de mentorados simultâneos">
      <div className="flex gap-2 mt-1">
        {[1, 2, 3, 4, 5].map(n => (
          <button
            key={n}
            type="button"
            onClick={() => set('maxMentees', n)}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
              form.maxMentees === n
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            {n}
          </button>
        ))}
      </div>
    </Field>
    <Field label="Fuso horário">
      <Input
        value={form.timezone}
        onChange={e => set('timezone', e.target.value)}
        placeholder="America/Sao_Paulo"
      />
    </Field>
    <div className="mt-4 p-4 bg-primary/5 border border-primary/20 rounded-xl">
      <p className="text-xs font-medium text-primary mb-1">Quase lá!</p>
      <p className="text-xs text-muted-foreground">
        Após concluir, você será redirecionado ao seu workspace de mentor onde poderá ver seus mentorados, sessões e acessar o Pre-Brief com IA antes de cada sessão.
      </p>
    </div>
  </div>
);
