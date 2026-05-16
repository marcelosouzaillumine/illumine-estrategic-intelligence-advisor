import React, { useState, useMemo, useEffect } from 'react';
import { 
  Users, 
  Target, 
  Brain, 
  BarChart, 
  ChevronRight, 
  CheckCircle2, 
  AlertCircle,
  TrendingUp,
  Award,
  ShieldCheck,
  Briefcase,
  Compass,
  Zap,
  Info,
  ArrowRight,
  BookOpen,
  PieChart,
  Lightbulb,
  Search
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { collection, addDoc, serverTimestamp, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db, auth } from '../../lib/firebase';
import { GOVERNANCE_PRINCIPLES } from '../../lib/governanceIntelligence';
import { PageHeader, SectionHeader, StatusBadge } from '../Common';
import { cn } from '../../lib/utils';

interface Role {
  id: string;
  title: string;
  category: 'Direção' | 'Conselho';
  description: string;
  essentialSoftSkills: {
    name: string;
    description: string;
    idealLevel: number; // 1-5
  }[];
  idealProfile: {
    disc: {
      D: number;
      I: number;
      S: number;
      C: number;
    };
    enneagram: number[]; // Predominant types
  };
}

const GOVERNANCE_ROLES: Role[] = [
  {
    id: 'ceo',
    title: 'Chief Executive Officer (CEO)',
    category: 'Direção',
    description: 'Responsável pela visão estratégica global e pela execução das diretrizes aprovadas pelo conselho.',
    essentialSoftSkills: [
      { name: 'Liderança Inspiradora', description: 'Capacidade de motivar e alinhar a equipe com o propósito da organização.', idealLevel: 5 },
      { name: 'Tomada de Decisão', description: 'Agilidade e assertividade em decisões complexas sob pressão.', idealLevel: 5 },
      { name: 'Visão Sistêmica', description: 'Compreensão de como todas as partes do negócio se conectam.', idealLevel: 5 },
      { name: 'Resiliência', description: 'Capacidade de lidar com crises e manter o foco no longo prazo.', idealLevel: 4 },
    ],
    idealProfile: {
      disc: { D: 45, I: 30, S: 10, C: 15 },
      enneagram: [3, 8, 1]
    }
  },
  {
    id: 'cfo',
    title: 'Diretor Financeiro (CFO)',
    category: 'Direção',
    description: 'Guardião da saúde financeira, focado em compliance, eficiência e suporte à decisão estratégica.',
    essentialSoftSkills: [
      { name: 'Integridade', description: 'Adesão inabalável a princípios éticos e normas de transparência.', idealLevel: 5 },
      { name: 'Gestão de Risco', description: 'Habilidade em identificar e mitigar ameaças financeiras e operacionais.', idealLevel: 5 },
      { name: 'Pensamento Analítico', description: 'Capacidade de extrair insights de dados complexos.', idealLevel: 5 },
      { name: 'Comunicação Técnica', description: 'Habilidade de traduzir números em diretrizes estratégicas.', idealLevel: 4 },
    ],
    idealProfile: {
      disc: { D: 25, I: 10, S: 25, C: 40 },
      enneagram: [1, 5, 6]
    }
  },
  {
    id: 'marketing',
    title: 'Diretor de Marketing (CMO)',
    category: 'Direção',
    description: 'Lidera o posicionamento da marca, crescimento de mercado e experiência do cliente.',
    essentialSoftSkills: [
      { name: 'Criatividade', description: 'Capacidade de gerar soluções inovadoras para desafios de mercado.', idealLevel: 5 },
      { name: 'Empatia', description: 'Forte compreensão das necessidades e dores do cliente.', idealLevel: 5 },
      { name: 'Visão de Futuro', description: 'Antecipação de tendências e mudanças no comportamento do consumidor.', idealLevel: 4 },
      { name: 'Colaboração', description: 'Habilidade de trabalhar transversalmente com outras áreas.', idealLevel: 4 },
    ],
    idealProfile: {
      disc: { D: 20, I: 50, S: 20, C: 10 },
      enneagram: [4, 7, 3]
    }
  },
  {
    id: 'independent_board',
    title: 'Conselheiro Independente',
    category: 'Conselho',
    description: 'Fornece visão externa e imparcial, focando na sustentabilidade do negócio e nos interesses de todos os stakeholders.',
    essentialSoftSkills: [
      { name: 'Pensamento Crítico', description: 'Capacidade de questionar premissas e analisar situações de forma objetiva.', idealLevel: 5 },
      { name: 'Independência', description: 'Coragem para manter seu posicionamento mesmo sob pressão.', idealLevel: 5 },
      { name: 'Escuta Ativa', description: 'Habilidade de processar diferentes pontos de vista antes de opinar.', idealLevel: 4 },
      { name: 'Diplomacia', description: 'Capacidade de tratar temas sensíveis de forma construtiva.', idealLevel: 4 },
    ],
    idealProfile: {
      disc: { D: 30, I: 20, S: 20, C: 30 },
      enneagram: [5, 6, 9]
    }
  },
  {
    id: 'board_chairman',
    title: 'Presidente do Conselho (Chairman)',
    category: 'Conselho',
    description: 'Lidera o conselho de administração, garantindo sua eficácia e a interface harmônica com o CEO.',
    essentialSoftSkills: [
      { name: 'Mediação de Conflitos', description: 'Habilidade de conduzir divergências para consensos produtivos.', idealLevel: 5 },
      { name: 'Liderança de Colegiado', description: 'Capacidade de orquestrar talentos diversos em um grupo sênior.', idealLevel: 5 },
      { name: 'Visão de Longo Prazo', description: 'Foco na perpetuidade e legado da organização.', idealLevel: 5 },
      { name: 'Autoridade Moral', description: 'Exemplo de conduta que gera confiança imediata.', idealLevel: 5 },
    ],
    idealProfile: {
      disc: { D: 35, I: 25, S: 20, C: 20 },
      enneagram: [8, 1, 9]
    }
  },
  {
    id: 'diretor_comercial',
    title: 'Diretor Comercial (CCO)',
    category: 'Direção',
    description: 'Lidera a estratégia de vendas, expansão de mercado e relacionamento com grandes contas, garantindo o crescimento da receita sustentável.',
    essentialSoftSkills: [
      { name: 'Negociação Estratégica', description: 'Habilidade em fechar acordos complexos de alto valor.', idealLevel: 5 },
      { name: 'Liderança de Vendas', description: 'Capacidade de engajar e extrair performance de times comerciais.', idealLevel: 5 },
      { name: 'Visão de Mercado', description: 'Leitura de oportunidades e movimentos da concorrência.', idealLevel: 5 },
      { name: 'Foco em Resultados', description: 'Orientação obstinada para o batimento de metas e ROI.', idealLevel: 5 },
    ],
    idealProfile: {
      disc: { D: 40, I: 40, S: 10, C: 10 },
      enneagram: [3, 7, 8]
    }
  },
  {
    id: 'diretor_operacoes',
    title: 'Diretor de Operações (COO)',
    category: 'Direção',
    description: 'Garante a eficiência operacional, escalabilidade dos processos e a entrega da promessa de valor ao cliente.',
    essentialSoftSkills: [
      { name: 'Excelência Operacional', description: 'Domínio de metodologias de otimização de processos e qualidade.', idealLevel: 5 },
      { name: 'Gestão de Crises', description: 'Capacidade de resolver problemas complexos na cadeia produtiva.', idealLevel: 5 },
      { name: 'Prudência Financeira', description: 'Zelo pela eficiência no uso dos recursos operacionais.', idealLevel: 4 },
      { name: 'Liderança Servidora', description: 'Foco em remover obstáculos para as equipes de execução.', idealLevel: 5 },
    ],
    idealProfile: {
      disc: { D: 35, I: 15, S: 20, C: 30 },
      enneagram: [1, 6, 8]
    }
  },
  {
    id: 'diretor_tecnologia',
    title: 'Diretor de Tecnologia (CTO)',
    category: 'Direção',
    description: 'Orquestra a infraestrutura tecnológica, inovação digital e segurança da informação como alavancas de negócio.',
    essentialSoftSkills: [
      { name: 'Visão Tecnológica', description: 'Capacidade de antecipar tendências e aplicar tecnologia ao negócio.', idealLevel: 5 },
      { name: 'Agilidade Decisória', description: 'Tomada de decisão rápida em ambientes de alta incerteza técnica.', idealLevel: 5 },
      { name: 'Gestão de Talentos Tech', description: 'Habilidade em atrair e reter perfis técnicos altamente qualificados.', idealLevel: 4 },
      { name: 'Segurança e Compliance', description: 'Zelo absoluto pela integridade e proteção dos dados.', idealLevel: 5 },
    ],
    idealProfile: {
      disc: { D: 25, I: 15, S: 20, C: 40 },
      enneagram: [5, 6, 1]
    }
  },
  {
    id: 'board_member_owner',
    title: 'Membro do Conselho (Quadro Societário)',
    category: 'Conselho',
    description: 'Representa os interesses dos acionistas, focando na perenidade do negócio, proteção do patrimônio e legado.',
    essentialSoftSkills: [
      { name: 'Visão de Dono', description: 'Zelo extremo pelo capital investido e pela reputação da marca.', idealLevel: 5 },
      { name: 'Discernimento Estratégico', description: 'Capacidade de analisar cenários de longo prazo e riscos sistêmicos.', idealLevel: 5 },
      { name: 'Mediação Societária', description: 'Habilidade em alinhar interesses divergentes entre sócios.', idealLevel: 5 },
      { name: 'Ética e Honra', description: 'Compromisso inegociável com os valores e a cultura da organização.', idealLevel: 5 },
    ],
    idealProfile: {
      disc: { D: 30, I: 20, S: 25, C: 25 },
      enneagram: [1, 8, 9]
    }
  }
];

const DISC_QUESTIONS = [
  { id: 'q1', text: 'Em situações de conflito, eu prefiro assumir o controle e resolver rapidamente.', trait: 'D' },
  { id: 'q2', text: 'Eu me sinto energizado ao interagir com novas pessoas e influenciar suas opiniões.', trait: 'I' },
  { id: 'q3', text: 'Eu valorizo a estabilidade e prefiro processos previsíveis a mudanças constantes.', trait: 'S' },
  { id: 'q4', text: 'Eu sou extremamente atento a detalhes e prefiro trabalhar com regras claras.', trait: 'C' },
  { id: 'q5', text: 'Tomar decisões difíceis de forma direta é algo natural para mim.', trait: 'D' },
  { id: 'q6', text: 'Sou otimista e costumo motivar os outros através do entusiasmo.', trait: 'I' },
  { id: 'q7', text: 'Prefiro trabalhar em equipe e sou um bom ouvinte para meus colegas.', trait: 'S' },
  { id: 'q8', text: 'Analiso todos os dados minuciosamente antes de chegar a uma conclusão.', trait: 'C' },
  { id: 'q9', text: 'Foco mais na eficiência e resultados do que nos sentimentos da equipe.', trait: 'D' },
  { id: 'q10', text: 'Gosto de ser o centro das atenções e liderar apresentações públicas.', trait: 'I' },
  { id: 'q11', text: 'Tenho dificuldade em dizer "não" para pedidos de ajuda de colegas.', trait: 'S' },
  { id: 'q12', text: 'Sigo padrões e normas mesmo quando ninguém está olhando.', trait: 'C' },
];

const ENNEAGRAM_QUESTIONS = [
  { id: 'e1', text: 'Eu busco a perfeição e me cobro muito para não cometer erros.', type: 1 },
  { id: 'e2', text: 'Eu sinto uma necessidade forte de ser amado e ajudar os outros.', type: 2 },
  { id: 'e3', text: 'O sucesso e a imagem de eficiência são minhas prioridades.', type: 3 },
  { id: 'e4', text: 'Eu me sinto diferente dos outros e busco profundidade emocional.', type: 4 },
  { id: 'e5', text: 'Eu prefiro observar e acumular conhecimento antes de agir.', type: 5 },
  { id: 'e6', text: 'Eu sou muito cauteloso e sempre antecipo o que pode dar errado.', type: 6 },
  { id: 'e7', text: 'Eu busco novas experiências e evito situações de tédio ou dor.', type: 7 },
  { id: 'e8', text: 'Eu valorizo o poder, o controle e a justiça direta.', type: 8 },
  { id: 'e9', text: 'Eu evito conflitos e busco a paz e a harmonia no ambiente.', type: 9 },
];

const ETHICAL_DILEMMAS = GOVERNANCE_PRINCIPLES
  .filter(p => p.managerDilemma)
  .map(p => ({
    id: p.id,
    title: p.name,
    principleId: p.id,
    scenario: p.managerDilemma!.scenario,
    options: p.managerDilemma!.options
  }));

export function EstruturaGovernancaPage({ clientId }: { clientId: string }) {
  const [activeTab, setActiveTab] = useState<'roles' | 'assessment' | 'analysis' | 'dilemmas' | 'team'>('roles');
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [assessmentStep, setAssessmentStep] = useState(0);
  const [assessmentType, setAssessmentType] = useState<'disc' | 'enneagram'>('disc');
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [enneagramAnswers, setEnneagramAnswers] = useState<Record<string, number>>({});
  const [dilemmaAnswers, setDilemmaAnswers] = useState<Record<string, number>>({});
  const [dilemmaStep, setDilemmaStep] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [teamAssessments, setTeamAssessments] = useState<any[]>([]);
  const [hasConfirmedRole, setHasConfirmedRole] = useState(false);

  useEffect(() => {
    const fetchTeamData = async () => {
      try {
        const q = query(
          collection(db, 'leadership_profiles'),
          where('clientId', '==', clientId),
          where('type', '==', 'governance_assessment'),
          orderBy('createdAt', 'desc')
        );
        const snapshot = await getDocs(q);
        setTeamAssessments(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error("Error fetching team data:", error);
      }
    };
    fetchTeamData();
  }, [clientId]);

  const handleSaveResults = async () => {
    if (!auth.currentUser) {
      alert('Você precisa estar autenticado para salvar os resultados.');
      return;
    }

    setIsSaving(true);
    try {
      const resultsData = {
        clientId,
        userId: auth.currentUser.uid,
        userName: auth.currentUser.displayName,
        roleId: selectedRole?.id || 'none',
        roleTitle: selectedRole?.title || 'Personalizado',
        disc: calculateUserDISC(),
        enneagram: calculateUserEnneagram(),
        adherenceScore: adherenceScore,
        governançaAlignment: governançaAlignment.score,
        createdAt: serverTimestamp(),
        type: 'governance_assessment'
      };

      await addDoc(collection(db, 'leadership_profiles'), resultsData);
      alert('Perfil de governança salvo com sucesso!');
    } catch (error) {
      console.error('Error saving governance profile:', error);
      alert('Erro ao salvar resultados.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAnswer = (questionId: string, value: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const calculateUserDISC = () => {
    const totals = { D: 0, I: 0, S: 0, C: 0 };
    const counts = { D: 0, I: 0, S: 0, C: 0 };

    DISC_QUESTIONS.forEach(q => {
      const trait = q.trait as keyof typeof totals;
      totals[trait] += (answers[q.id] || 3);
      counts[trait] += 5; // Max possible per question
    });

    return {
      D: Math.round((totals.D / counts.D) * 100),
      I: Math.round((totals.I / counts.I) * 100),
      S: Math.round((totals.S / counts.S) * 100),
      C: Math.round((totals.C / counts.C) * 100),
    };
  };

  const calculateUserEnneagram = () => {
    const scores = Array(10).fill(0);
    ENNEAGRAM_QUESTIONS.forEach(q => {
      scores[q.type] = (enneagramAnswers[q.id] || 3) * 20; // 0-100 scale
    });
    return scores;
  };

  const userProfile = useMemo(() => calculateUserDISC(), [answers]);
  const userEnneagram = useMemo(() => calculateUserEnneagram(), [enneagramAnswers]);

  const adherenceScore = useMemo(() => {
    if (!selectedRole) return 0;
    
    // Weighted adherence: 60% DISC, 40% Enneagram
    let discAdherence = 0;
    const traits: (keyof typeof userProfile)[] = ['D', 'I', 'S', 'C'];
    traits.forEach(t => {
      const diff = Math.abs(userProfile[t] - selectedRole.idealProfile.disc[t]);
      discAdherence += (100 - diff);
    });
    discAdherence /= 4;

    let enneagramAdherence = 0;
    selectedRole.idealProfile.enneagram.forEach(type => {
      const score = userEnneagram[type] || 0;
      enneagramAdherence += score;
    });
    enneagramAdherence = Math.min(100, enneagramAdherence / selectedRole.idealProfile.enneagram.length);

    return Math.round((discAdherence * 0.6) + (enneagramAdherence * 0.4));
  }, [selectedRole, userProfile, userEnneagram]);

  const analysis = useMemo(() => {
    if (!selectedRole) return null;
    
    const gaps = [];
    const discGaps = [];

    // Compare DISC
    for (const trait in selectedRole.idealProfile.disc) {
      const t = trait as keyof typeof userProfile;
      const ideal = selectedRole.idealProfile.disc[t];
      const actual = userProfile[t];
      const diff = actual - ideal;
      
      if (Math.abs(diff) > 15) {
        discGaps.push({
          trait: t,
          ideal,
          actual,
          severity: Math.abs(diff) > 25 ? 'high' : 'medium',
          direction: diff > 0 ? 'excess' : 'deficit'
        });
      }
    }

    return { discGaps };
  }, [selectedRole, userProfile]);

  const governançaAlignment = useMemo(() => {
    const answeredCount = Object.keys(dilemmaAnswers).length;
    if (answeredCount === 0) return { score: 0, status: 'Não Iniciado' };
    
    let totalScore = 0;
    Object.values(dilemmaAnswers).forEach(score => {
      // Normalize -2 to 2 into 0 to 100
      const normalized = ((score + 2) / 4) * 100;
      totalScore += normalized;
    });
    
    const percentage = totalScore / answeredCount;
    
    return {
      score: Math.round(percentage),
      status: percentage > 80 ? 'Alta Convergência' : percentage > 50 ? 'Alinhamento em Construção' : 'Risco de Desalinhamento'
    };
  }, [dilemmaAnswers]);

  const teamMetrics = useMemo(() => {
    if (teamAssessments.length === 0) return null;

    const avgDisc = { D: 0, I: 0, S: 0, C: 0 };
    const idealAvgDisc = { D: 0, I: 0, S: 0, C: 0 };
    let totalAdherence = 0;
    let totalGov = 0;

    teamAssessments.forEach(ass => {
      avgDisc.D += ass.disc.D;
      avgDisc.I += ass.disc.I;
      avgDisc.S += ass.disc.S;
      avgDisc.C += ass.disc.C;
      totalAdherence += ass.adherenceScore;
      totalGov += (ass.governançaAlignment || 0);

      const role = GOVERNANCE_ROLES.find(r => r.id === ass.roleId);
      if (role) {
        idealAvgDisc.D += role.idealProfile.disc.D;
        idealAvgDisc.I += role.idealProfile.disc.I;
        idealAvgDisc.S += role.idealProfile.disc.S;
        idealAvgDisc.C += role.idealProfile.disc.C;
      }
    });

    const count = teamAssessments.length;
    return {
      actual: {
        D: Math.round(avgDisc.D / count),
        I: Math.round(avgDisc.I / count),
        S: Math.round(avgDisc.S / count),
        C: Math.round(avgDisc.C / count),
      },
      ideal: {
        D: Math.round(idealAvgDisc.D / count),
        I: Math.round(idealAvgDisc.I / count),
        S: Math.round(idealAvgDisc.S / count),
        C: Math.round(idealAvgDisc.C / count),
      },
      avgAdherence: Math.round(totalAdherence / count),
      avgGov: Math.round(totalGov / count),
      totalParticipants: count
    };
  }, [teamAssessments]);

  const getDevelopmentTrail = (gaps: any[]) => {
    const trails = [];
    if (gaps.some(g => g.trait === 'D' && g.direction === 'deficit')) {
      trails.push({
        title: 'Fortalecimento da Executividade',
        description: 'Foco em assertividade, tomada de decisão e orientação para resultados.',
        items: ['Workshop de Gestão Ágil', 'Mentoria com Diretores de Operações', 'Leitura: "Extreme Ownership"']
      });
    }
    if (gaps.some(g => g.trait === 'I' && g.direction === 'deficit')) {
      trails.push({
        title: 'Excelência na Comunicação Influente',
        description: 'Desenvolvimento de habilidades de persuasão e networking estratégico.',
        items: ['Curso de Oratória Moderna', 'Treinamento de Negociação Win-Win', 'Prática de Storytelling Executivo']
      });
    }
    if (gaps.some(g => g.trait === 'C' && g.direction === 'deficit')) {
      trails.push({
        title: 'Refinamento Analítico e Compliance',
        description: 'Melhoria da atenção aos detalhes e estruturação de processos.',
        items: ['Certificação em Gestão de Riscos', 'Imersão em Governança Corporativa', 'Curso de Data Literacy']
      });
    }

    if (trails.length === 0) {
      trails.push({
        title: 'Aprimoramento Contínuo',
        description: 'Seu perfil está muito alinhado. Foque em mentorar outros e expandir sua visão global.',
        items: ['Programa de Board Membership Avançado', 'Networking Internacional', 'Fóruns de Pensamento Estratégico']
      });
    }

    return trails;
  };

  return (
    <div className="space-y-10 pb-20">
      <PageHeader 
        title="Estrutura de Governança" 
        subtitle="Mapeamento de papéis, responsabilidades e alinhamento de perfil comportamental para alta performance."
        icon={ShieldCheck}
        color="bg-slate-900"
      />

      <div className="flex items-center justify-between gap-4 flex-wrap bg-white/60 p-4 rounded-3xl border border-slate-200/60 backdrop-blur-sm shadow-sm -mt-6 mb-10">
        <div className="flex items-center gap-3">
          <div className="px-6 py-3 bg-white border border-slate-200 rounded-2xl shadow-sm flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Award size={14} className="text-secondary" />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Protocolo de Alta Direção</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => {
              setAnswers({});
              setEnneagramAnswers({});
              setDilemmaAnswers({});
              setHasConfirmedRole(false);
              setShowResults(false);
              setAssessmentStep(0);
              setDilemmaStep(0);
              setActiveTab('roles');
            }}
            className="px-6 py-3.5 bg-white border border-slate-200 text-slate-400 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:text-primary hover:border-primary transition-all"
          >
            Refazer Tudo
          </button>
          
          <button 
            disabled={isSaving}
            onClick={handleSaveResults}
            className="flex items-center gap-2 px-8 py-3.5 bg-emerald-500 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-emerald-500/20 hover:scale-105 transition-all disabled:opacity-50"
          >
            <Zap size={14} fill="currentColor" />
            {isSaving ? 'SALVANDO...' : 'SALVAR NO HISTÓRICO'}
          </button>
        </div>
      </div>


      {/* Navigation Tabs */}
      <div className="flex gap-2 p-1.5 bg-bg-surface/50 backdrop-blur-xl border border-white/20 rounded-2xl w-fit">
        {[
          { id: 'roles', label: 'Papéis e Skills', icon: Users },
          { id: 'assessment', label: 'DNA Comportamental', icon: Brain },
          { id: 'dilemmas', label: 'Prudência Decisória', icon: ShieldCheck },
          { id: 'team', label: 'Análise do Time', icon: PieChart },
          { id: 'analysis', label: 'Gaps e Desenvolvimento', icon: TrendingUp },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={cn(
              "flex items-center gap-3 px-6 py-3 rounded-xl text-xs font-bold transition-all",
              activeTab === tab.id 
                ? "bg-white text-primary shadow-premium" 
                : "text-text-dim hover:text-text-main"
            )}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'roles' && (
          <motion.div 
            key="roles"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid lg:grid-cols-3 gap-8"
          >
            {/* Left Col: Categories & Role List */}
            <div className="lg:col-span-1 space-y-6">
              <SectionHeader 
                title="Cargos de Governança" 
                subtitle="Selecione um cargo para ver o perfil ideal."
                icon={Briefcase}
              />
              
              <div className="space-y-4">
                {['Direção', 'Conselho'].map(cat => (
                  <div key={cat} className="space-y-2">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">{cat}</p>
                    <div className="space-y-2">
                      {GOVERNANCE_ROLES.filter(r => r.category === cat).map(role => (
                        <button
                          key={role.id}
                          onClick={() => setSelectedRole(role)}
                          className={cn(
                            "w-full flex items-center justify-between p-4 rounded-2xl border transition-all text-left group",
                            selectedRole?.id === role.id 
                              ? "bg-primary border-primary text-white shadow-xl shadow-primary/20" 
                              : "bg-white border-slate-100 hover:border-primary/30"
                          )}
                        >
                          <div className="flex items-center gap-4">
                            <div className={cn(
                              "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
                              selectedRole?.id === role.id ? "bg-white/10" : "bg-slate-50"
                            )}>
                              {cat === 'Direção' ? <Zap size={18} className={selectedRole?.id === role.id ? "text-white" : "text-primary"} /> : <ShieldCheck size={18} className={selectedRole?.id === role.id ? "text-white" : "text-secondary"} />}
                            </div>
                            <div>
                              <p className="text-sm font-black">{role.title}</p>
                              <p className={cn("text-[10px] font-medium", selectedRole?.id === role.id ? "text-white/60" : "text-slate-400")}>Clique para ver detalhes</p>
                            </div>
                          </div>
                          <ChevronRight size={16} className={cn("transition-transform", selectedRole?.id === role.id ? "translate-x-1" : "group-hover:translate-x-1 text-slate-300")} />
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Col: Details */}
            <div className="lg:col-span-2">
              {selectedRole ? (
                <div className="bg-white rounded-[32px] border border-slate-100 p-8 shadow-premium space-y-10 sticky top-32">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <StatusBadge status={selectedRole.category === 'Direção' ? 'Verde' : 'Amarelo'} />
                        <h2 className="text-3xl font-display font-black text-primary">{selectedRole.title}</h2>
                      </div>
                      <p className="text-slate-500 max-w-2xl">{selectedRole.description}</p>
                    </div>
                    <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-primary border border-slate-100">
                      <Compass size={32} strokeWidth={1.5} />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                        <Target size={14} className="text-secondary" />
                        Soft Skills Essenciais
                      </h3>
                      <div className="space-y-4">
                        {selectedRole.essentialSoftSkills.map(skill => (
                          <div key={skill.name} className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100 group hover:bg-white hover:shadow-lg hover:shadow-slate-200/50 transition-all">
                            <div className="flex justify-between items-center mb-2">
                              <p className="text-sm font-black text-primary">{skill.name}</p>
                              <div className="flex gap-1">
                                {[1, 2, 3, 4, 5].map(i => (
                                  <div 
                                    key={i} 
                                    className={cn(
                                      "w-1.5 h-3 rounded-full transition-all",
                                      i <= skill.idealLevel ? "bg-secondary" : "bg-slate-200"
                                    )} 
                                  />
                                ))}
                              </div>
                            </div>
                            <p className="text-[11px] leading-relaxed text-slate-500">{skill.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-6">
                      <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                        <PieChart size={14} className="text-primary" />
                        Perfil Comportamental Ideal (DISC)
                      </h3>
                      <div className="p-6 bg-primary rounded-3xl text-white space-y-6 shadow-xl shadow-primary/10">
                        <div className="grid grid-cols-4 gap-2">
                          {Object.entries(selectedRole.idealProfile.disc).map(([trait, val]) => (
                            <div key={trait} className="flex flex-col items-center gap-2">
                              <div className="w-full bg-white/10 rounded-full h-24 relative overflow-hidden flex flex-col justify-end">
                                <motion.div 
                                  initial={{ height: 0 }}
                                  animate={{ height: `${val}%` }}
                                  className="w-full bg-white/30 backdrop-blur-md"
                                />
                              </div>
                              <span className="text-[10px] font-black opacity-60">{trait}</span>
                              <span className="text-xs font-bold">{val}%</span>
                            </div>
                          ))}
                        </div>
                        <div className="pt-4 border-t border-white/10">
                          <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-2">Arquétipos de Eneagrama</p>
                          <div className="flex gap-2">
                            {selectedRole.idealProfile.enneagram.map(type => (
                              <div key={type} className="px-3 py-1 bg-white/10 rounded-lg text-[10px] font-bold">
                                Tipo {type}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="p-6 bg-secondary/5 rounded-3xl border border-secondary/10 flex items-start gap-4">
                        <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center shrink-0">
                          <Lightbulb size={20} className="text-secondary" />
                        </div>
                        <div>
                          <p className="text-xs font-black text-secondary uppercase tracking-widest mb-1">Insight do Advisor</p>
                          <p className="text-[11px] text-slate-600 leading-relaxed italic">
                            "Para este cargo, buscamos um equilíbrio entre a {selectedRole.category === 'Direção' ? 'agilidade executiva e a visão estratégica' : 'imparcialidade e a profundidade analítica'}. O perfil deve inspirar confiança imediata."
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-full min-h-[600px] flex flex-col items-center justify-center bg-slate-50/50 rounded-[32px] border-2 border-dashed border-slate-200 text-center p-10">
                  <div className="w-20 h-20 bg-white rounded-3xl shadow-lg flex items-center justify-center text-slate-300 mb-6">
                    <Users size={40} strokeWidth={1} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">Nenhum cargo selecionado</h3>
                  <p className="mt-2 text-slate-500 max-w-sm">Escolha uma função na lista ao lado para explorar as competências e o perfil ideal de governança.</p>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {activeTab === 'dilemmas' && (
          <motion.div 
            key="dilemmas"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="max-w-4xl mx-auto space-y-8"
          >
            <div className="flex justify-between items-end">
              <SectionHeader title="Prudência Decisória" subtitle="Avaliação de tomada de decisão para Diretores e Conselheiros." icon={ShieldCheck} />
              <div className="text-right pb-2">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Progresso do Diagnóstico</p>
                <p className="text-xl font-black text-primary">{dilemmaStep + 1} <span className="text-slate-300">/ {ETHICAL_DILEMMAS.length}</span></p>
              </div>
            </div>

            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${((dilemmaStep + 1) / ETHICAL_DILEMMAS.length) * 100}%` }}
                className="h-full bg-secondary"
              />
            </div>
            
            <AnimatePresence mode="wait">
              <motion.div 
                key={ETHICAL_DILEMMAS[dilemmaStep].id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white rounded-[40px] border border-slate-100 p-10 lg:p-16 shadow-premium space-y-10"
              >
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-primary/5 flex items-center justify-center text-primary shrink-0">
                      <AlertCircle size={28} />
                    </div>
                    <div>
                      <p className="text-xs font-black text-secondary uppercase tracking-widest mb-1">
                        {GOVERNANCE_PRINCIPLES.find(p => p.id === ETHICAL_DILEMMAS[dilemmaStep].principleId)?.axis}
                      </p>
                      <h4 className="text-2xl font-display font-black text-primary">{ETHICAL_DILEMMAS[dilemmaStep].title}</h4>
                    </div>
                  </div>
                  <div className="relative">
                    <div className="absolute -left-4 top-0 bottom-0 w-1 bg-secondary/20 rounded-full" />
                    <p className="text-lg text-slate-600 leading-relaxed italic pl-6">
                      "{ETHICAL_DILEMMAS[dilemmaStep].scenario}"
                    </p>
                  </div>
                </div>

                <div className="grid gap-4">
                  {ETHICAL_DILEMMAS[dilemmaStep].options.map((opt, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setDilemmaAnswers(prev => ({ ...prev, [ETHICAL_DILEMMAS[dilemmaStep].id]: opt.score }));
                        if (dilemmaStep < ETHICAL_DILEMMAS.length - 1) {
                          setTimeout(() => setDilemmaStep(s => s + 1), 300);
                        }
                      }}
                      className={cn(
                        "w-full p-6 rounded-3xl border-2 text-left transition-all text-base font-bold group",
                        dilemmaAnswers[ETHICAL_DILEMMAS[dilemmaStep].id] === opt.score
                          ? "bg-primary border-primary text-white shadow-xl shadow-primary/20"
                          : "bg-white border-slate-100 hover:border-secondary/30 text-slate-600 hover:text-primary"
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <span>{opt.text}</span>
                        <ChevronRight size={18} className={cn(
                          "transition-all",
                          dilemmaAnswers[ETHICAL_DILEMMAS[dilemmaStep].id] === opt.score ? "translate-x-1 opacity-100" : "opacity-0 group-hover:opacity-100 group-hover:translate-x-1"
                        )} />
                      </div>
                    </button>
                  ))}
                </div>

                <div className="flex justify-between items-center pt-10 border-t border-slate-100">
                  <button
                    disabled={dilemmaStep === 0}
                    onClick={() => setDilemmaStep(s => s - 1)}
                    className="px-8 py-3 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-primary transition-colors disabled:opacity-20"
                  >
                    Anterior
                  </button>

                  {dilemmaStep === ETHICAL_DILEMMAS.length - 1 ? (
                    <button
                      onClick={() => {
                        setShowResults(true);
                        setActiveTab('analysis');
                      }}
                      className="px-10 py-4 bg-emerald-500 text-white rounded-2xl text-xs font-black uppercase tracking-widest flex items-center gap-3 hover:shadow-xl hover:shadow-emerald-500/20 transition-all active:scale-95"
                    >
                      Finalizar Simulação
                      <Zap size={16} fill="currentColor" />
                    </button>
                  ) : (
                    <button
                      onClick={() => setDilemmaStep(s => s + 1)}
                      className="px-8 py-3 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-primary transition-colors"
                    >
                      Pular
                    </button>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        )}
        {activeTab === 'assessment' && (
          <motion.div 
            key="assessment"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="max-w-4xl mx-auto"
          >
            <div className="bg-white rounded-[40px] border border-slate-100 shadow-2xl shadow-slate-900/5 overflow-hidden">
              <div className="bg-primary p-10 text-white relative">
                <div className="absolute top-0 right-0 p-10 opacity-10">
                  <Brain size={120} strokeWidth={1} />
                </div>
                <div className="relative z-10 space-y-2">
                  <div className="flex items-center gap-3 mb-4 py-2 px-4 bg-white/10 rounded-full w-fit">
                    <Users size={14} className="text-secondary" />
                    <span className="text-[10px] font-bold tracking-widest uppercase">Avaliador: {auth.currentUser?.displayName || 'Convidado'}</span>
                  </div>
                  <p className="text-xs font-black uppercase tracking-[0.2em] opacity-60">Deep Profile Analysis</p>
                  <h2 className="text-4xl font-display font-black">
                    {!hasConfirmedRole ? 'Confirme seu Cargo' : assessmentType === 'disc' ? 'DNA Comportamental' : 'Arquétipo de Eneagrama'}
                  </h2>
                </div>

                <div className="mt-10 flex gap-2">
                  <div className="flex gap-1 flex-1">
                    {Array.from({ length: Math.ceil((assessmentType === 'disc' ? DISC_QUESTIONS : ENNEAGRAM_QUESTIONS).length / 2) }).map((_, i) => (
                      <div 
                        key={i} 
                        className={cn(
                          "h-1.5 flex-1 rounded-full transition-all duration-500",
                          i < assessmentStep ? "bg-secondary" : i === assessmentStep ? "bg-white" : "bg-white/20"
                        )} 
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-10 lg:p-16 space-y-12">
                {!hasConfirmedRole ? (
                  <div className="space-y-10">
                    <div className="p-8 bg-slate-50 rounded-[32px] border border-slate-100 space-y-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-white">
                          <Users size={24} />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-primary">Confirme sua posição de Governança</h3>
                          <p className="text-sm text-slate-500">Isso garante que sua análise seja comparada ao perfil ideal correto do cargo.</p>
                        </div>
                      </div>
                      
                      <div className="grid sm:grid-cols-2 gap-3">
                        {GOVERNANCE_ROLES.map(role => (
                          <button
                            key={role.id}
                            onClick={() => setSelectedRole(role)}
                            className={cn(
                              "p-4 rounded-2xl border-2 text-left transition-all",
                              selectedRole?.id === role.id 
                                ? "bg-white border-primary shadow-lg ring-4 ring-primary/5" 
                                : "bg-white border-slate-100 hover:border-slate-200"
                            )}
                          >
                            <p className="text-sm font-black text-primary">{role.title}</p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{role.category}</p>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-center">
                      <button
                        disabled={!selectedRole}
                        onClick={() => setHasConfirmedRole(true)}
                        className="px-12 py-4 bg-secondary text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-secondary/20 hover:scale-105 transition-all disabled:opacity-30 disabled:hover:scale-100"
                      >
                        Confirmar e Iniciar Avaliação
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-12">
                    <div className="grid gap-12">
                  {(assessmentType === 'disc' ? DISC_QUESTIONS : ENNEAGRAM_QUESTIONS).slice(assessmentStep * 2, (assessmentStep * 2) + 2).map((q) => (
                    <div key={q.id} className="space-y-8">
                      <div className="space-y-4">
                        <span className="text-[10px] font-black text-secondary uppercase tracking-widest flex items-center gap-2">
                          <CheckCircle2 size={12} />
                          {assessmentType === 'disc' ? 'Comportamento' : 'Motivação'}
                        </span>
                        <h4 className="text-xl font-bold text-primary leading-tight">{q.text}</h4>
                      </div>
                      
                      <div className="flex flex-col gap-4">
                        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400 px-2">
                          <span>Discordo Totalmente</span>
                          <span>Concordo Totalmente</span>
                        </div>
                        <div className="flex gap-4">
                          {[1, 2, 3, 4, 5].map((val) => (
                            <button
                              key={val}
                              onClick={() => {
                                if (assessmentType === 'disc') {
                                  handleAnswer(q.id, val);
                                } else {
                                  setEnneagramAnswers(prev => ({ ...prev, [q.id]: val }));
                                }
                              }}
                              className={cn(
                                "flex-1 h-16 rounded-2xl border-2 font-black text-lg transition-all active:scale-95",
                                (assessmentType === 'disc' ? answers[q.id] : enneagramAnswers[q.id]) === val 
                                  ? "bg-secondary border-secondary text-white shadow-xl shadow-secondary/20" 
                                  : "bg-white border-slate-100 text-slate-400 hover:border-secondary/30 hover:text-secondary"
                              )}
                            >
                              {val}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between pt-8 border-t border-slate-100">
                  <button
                    disabled={assessmentStep === 0 && assessmentType === 'disc'}
                    onClick={() => {
                      if (assessmentStep > 0) {
                        setAssessmentStep(s => s - 1);
                      } else if (assessmentType === 'enneagram') {
                        setAssessmentType('disc');
                        setAssessmentStep(Math.ceil(DISC_QUESTIONS.length / 2) - 1);
                      }
                    }}
                    className="px-8 py-3 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-primary transition-colors disabled:opacity-30"
                  >
                    Voltar
                  </button>
                  
                  {assessmentStep < Math.ceil((assessmentType === 'disc' ? DISC_QUESTIONS : ENNEAGRAM_QUESTIONS).length / 2) - 1 ? (
                    <button
                      onClick={() => setAssessmentStep(s => s + 1)}
                      className="px-10 py-4 bg-primary text-white rounded-2xl text-xs font-black uppercase tracking-widest flex items-center gap-3 hover:shadow-xl hover:shadow-primary/20 transition-all active:scale-95"
                    >
                      Próximas Questões
                      <ArrowRight size={16} />
                    </button>
                  ) : assessmentType === 'disc' ? (
                    <button
                      onClick={() => {
                        setAssessmentType('enneagram');
                        setAssessmentStep(0);
                      }}
                      className="px-10 py-4 bg-secondary text-white rounded-2xl text-xs font-black uppercase tracking-widest flex items-center gap-3 hover:shadow-xl hover:shadow-secondary/20 transition-all active:scale-95"
                    >
                      Iniciar Eneagrama
                      <ArrowRight size={16} />
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setShowResults(true);
                        setActiveTab('analysis');
                      }}
                      className="px-10 py-4 bg-emerald-500 text-white rounded-2xl text-xs font-black uppercase tracking-widest flex items-center gap-3 hover:shadow-xl hover:shadow-emerald-500/20 transition-all active:scale-95"
                    >
                      Finalizar Análise
                      <Zap size={16} fill="currentColor" />
                    </button>
                  )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'analysis' && (
          <motion.div 
            key="analysis"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-10"
          >
            {showResults ? (
              <>
                {/* Result Hero */}
                <div className="grid lg:grid-cols-2 gap-8">
                  <div className="bg-white rounded-[40px] border border-slate-100 p-10 shadow-premium flex flex-col justify-between">
                    <div className="space-y-6">
                      <SectionHeader title="Seu Perfil Atual" subtitle="Baseado na autoavaliação DISC." icon={Brain} />
                      <div className="grid grid-cols-4 gap-4 h-48 items-end pt-4">
                        {Object.entries(userProfile).map(([trait, val]) => (
                          <div key={trait} className="space-y-4 text-center">
                            <div className="relative group">
                              <motion.div 
                                initial={{ height: 0 }}
                                animate={{ height: `${val * 1.5}px` }}
                                className={cn(
                                  "w-full rounded-2xl transition-all shadow-lg",
                                  trait === 'D' ? "bg-rose-500 shadow-rose-500/20" :
                                  trait === 'I' ? "bg-amber-500 shadow-amber-500/20" :
                                  trait === 'S' ? "bg-emerald-500 shadow-emerald-500/20" :
                                  "bg-indigo-500 shadow-indigo-500/20"
                                )}
                              />
                              <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-black px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                {val}%
                              </div>
                            </div>
                            <div>
                              <p className="text-sm font-black text-primary">{trait}</p>
                              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                                {trait === 'D' ? 'Domínio' : 
                                 trait === 'I' ? 'Influência' : 
                                 trait === 'S' ? 'Estabilidade' : 'Cautela'}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="mt-10 p-6 bg-slate-50 rounded-3xl border border-slate-100">
                      <p className="text-xs font-black text-primary uppercase tracking-widest mb-2">Resumo Comportamental</p>
                      <p className="text-[11px] text-slate-500 leading-relaxed">
                        Seu perfil demonstra uma forte orientação para {userProfile.D > 40 ? 'resultados e tomada de decisão assertiva' : userProfile.I > 40 ? 'comunicação e influência interpessoal' : userProfile.S > 40 ? 'estabilidade e trabalho em equipe' : 'precisão e conformidade técnica'}.
                      </p>
                    </div>
                  </div>

                  <div className="bg-primary rounded-[40px] p-10 text-white shadow-2xl shadow-primary/20 space-y-8">
                    <SectionHeader title="Análise de Gap" subtitle="Comparação com o perfil de referência." icon={Target} tone="amber" />
                    
                    {/* Governança Alignment Card */}
                    <div className="p-6 bg-white/10 rounded-3xl border border-white/20 backdrop-blur-md mb-8">
                      <div className="flex justify-between items-center mb-6">
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-secondary">Aderência ao Cargo</p>
                          <h4 className="text-xl font-black">Gráfico de Aderência (DISC + Eneagrama)</h4>
                        </div>
                        <div className="text-right">
                          <span className="text-4xl font-black text-secondary">{adherenceScore}%</span>
                        </div>
                      </div>
                      
                      <div className="space-y-6">
                        {/* Radar-like comparison visualization */}
                        <div className="grid grid-cols-2 gap-8">
                           {/* DISC Alignment */}
                           <div className="space-y-3">
                              <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Aderência DISC</p>
                              <div className="space-y-2">
                                {['D', 'I', 'S', 'C'].map((t) => {
                                  const trait = t as keyof typeof userProfile;
                                  const actual = userProfile[trait];
                                  const ideal = selectedRole.idealProfile.disc[trait];
                                  return (
                                    <div key={t} className="space-y-1">
                                      <div className="flex justify-between text-[9px] font-bold">
                                        <span>{t}</span>
                                        <span>{actual}% / {ideal}%</span>
                                      </div>
                                      <div className="h-1 bg-white/10 rounded-full overflow-hidden flex">
                                        <div className="h-full bg-secondary" style={{ width: `${actual}%` }} />
                                        <div className="h-full bg-white/30 border-l border-white/50" style={{ width: '2px', marginLeft: `calc(${ideal}% - ${actual}%)` }} />
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                           </div>

                           {/* Enneagram Alignment */}
                           <div className="space-y-3">
                              <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Aderência Eneagrama</p>
                              <div className="flex flex-wrap gap-2 pt-2">
                                {selectedRole.idealProfile.enneagram.map(type => (
                                  <div key={type} className={cn(
                                    "px-3 py-1.5 rounded-lg text-[10px] font-bold border transition-all",
                                    userEnneagram[type] > 60 
                                      ? "bg-secondary border-secondary text-white shadow-lg"
                                      : "bg-white/5 border-white/10 text-white/40"
                                  )}>
                                    Tipo {type}: {userEnneagram[type]}%
                                  </div>
                                ))}
                              </div>
                           </div>
                        </div>
                      </div>

                      <div className="mt-8 pt-8 border-t border-white/10">
                        <div className="flex justify-between items-center mb-6">
                          <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-secondary">Inteligência Governança</p>
                            <h4 className="text-xl font-black">Alinhamento de Princípios</h4>
                          </div>
                          <div className="text-right">
                            <span className="text-3xl font-black text-secondary">{governançaAlignment.score}%</span>
                          </div>
                        </div>
                      
                      <div className="w-full bg-white/10 rounded-full h-2 mb-4">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${governançaAlignment.score}%` }}
                          className="h-full bg-secondary rounded-full"
                        />
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-2 h-2 rounded-full",
                          governançaAlignment.score > 80 ? "bg-emerald-400" : governançaAlignment.score > 50 ? "bg-amber-400" : "bg-rose-400"
                        )} />
                        <p className="text-xs font-bold opacity-80">{governançaAlignment.status}</p>
                      </div>

                      <p className="mt-4 text-[11px] opacity-60 leading-relaxed italic">
                        "Este score reflete o quanto sua tomada de decisão individual converge com os Princípios de Governança da Inteligência Governança. Um score alto indica que sua liderança preservará o DNA espiritual e ético da organização."
                      </p>
                    </div>
                  </div>
                    
                  {selectedRole ? (
                      <div className="space-y-6">
                        <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/10">
                          <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-secondary">
                            <Compass size={24} />
                          </div>
                          <div>
                            <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Cargo Alvo</p>
                            <p className="text-lg font-black">{selectedRole.title}</p>
                          </div>
                        </div>

                        <div className="space-y-4">
                          {analysis?.discGaps.map((gap: any) => (
                            <div key={gap.trait} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl">
                              <div className="flex items-center gap-4">
                                <div className={cn(
                                  "w-2 h-2 rounded-full",
                                  gap.severity === 'high' ? "bg-rose-500 animate-pulse" : "bg-amber-500"
                                )} />
                                <div>
                                  <p className="text-xs font-black">Traço: {gap.trait === 'D' ? 'Domínio' : gap.trait === 'I' ? 'Influência' : gap.trait === 'S' ? 'Estabilidade' : 'Cautela'}</p>
                                  <p className="text-[10px] opacity-60">Sinal de {gap.direction === 'excess' ? 'excesso' : 'necessidade de desenvolvimento'}</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-xs font-black text-secondary">{gap.actual}% vs {gap.ideal}%</p>
                                <p className="text-[9px] opacity-40 uppercase font-black">Gap de {Math.abs(gap.actual - gap.ideal)}%</p>
                              </div>
                            </div>
                          ))}
                          {analysis?.discGaps.length === 0 && (
                            <div className="flex flex-col items-center justify-center py-10 text-center space-y-4">
                              <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-400">
                                <CheckCircle2 size={32} />
                              </div>
                              <p className="text-sm font-bold">Perfil Altamente Alinhado</p>
                              <p className="text-xs opacity-60 max-w-xs">Não foram identificados gaps críticos entre seu perfil e as exigências do cargo.</p>
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-20 text-center opacity-40">
                        <Info size={40} strokeWidth={1} />
                        <p className="mt-4 text-sm font-bold uppercase tracking-widest">Selecione um cargo na aba "Papéis" para comparar.</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Development Trails */}
                <div className="space-y-6">
                  <SectionHeader title="Trilhas de Desenvolvimento" subtitle="Caminhos personalizados para mitigar os gaps identificados." icon={BookOpen} />
                  
                  <div className="grid md:grid-cols-3 gap-6">
                    {getDevelopmentTrail(analysis?.discGaps || []).map((trail, idx) => (
                      <motion.div 
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="bg-white rounded-3xl border border-slate-100 p-8 shadow-premium group hover:border-secondary/50 transition-all"
                      >
                        <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary mb-6 group-hover:scale-110 transition-transform">
                          <Award size={24} />
                        </div>
                        <h4 className="text-lg font-black text-primary mb-2">{trail.title}</h4>
                        <p className="text-xs text-slate-500 leading-relaxed mb-6">{trail.description}</p>
                        
                        <div className="space-y-3">
                          {trail.items.map((item, i) => (
                            <div key={i} className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl">
                              <div className="mt-1">
                                <div className="w-1.5 h-1.5 rounded-full bg-secondary" />
                              </div>
                              <span className="text-[11px] font-bold text-slate-700">{item}</span>
                            </div>
                          ))}
                        </div>
                        
                        <button className="w-full mt-8 py-3 border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-secondary hover:border-secondary transition-all flex items-center justify-center gap-2">
                          Acessar Conteúdo <ArrowRight size={14} />
                        </button>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="min-h-[500px] flex flex-col items-center justify-center bg-slate-50/50 rounded-[40px] border-2 border-dashed border-slate-200 text-center p-10">
                <div className="w-24 h-24 bg-white rounded-full shadow-xl flex items-center justify-center text-primary mb-8 animate-bounce">
                  <Brain size={48} strokeWidth={1} />
                </div>
                <h3 className="text-2xl font-black text-primary">Aguardando Avaliação</h3>
                <p className="mt-4 text-slate-500 max-w-md mx-auto leading-relaxed">
                  Para visualizar a análise de gaps e receber suas trilhas de desenvolvimento, primeiro complete o questionário de autoavaliação comportamental.
                </p>
                <button 
                  onClick={() => setActiveTab('assessment')}
                  className="mt-8 px-10 py-4 bg-primary text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-primary/20 flex items-center gap-3 hover:scale-105 transition-all"
                >
                  Ir para Questionário <ArrowRight size={16} />
                </button>
              </div>
            )}
          </motion.div>
        )}
        {activeTab === 'team' && (
          <motion.div 
            key="team"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-10"
          >
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1 space-y-6">
                <SectionHeader title="Visão Consolidada" subtitle="Sobreposição do perfil real do time vs. estrutura ideal de cargos." icon={Users} />
                
                {teamMetrics ? (
                  <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-premium space-y-8">
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Aderência Média do Time</p>
                        <div className="flex items-end gap-3">
                          <span className="text-5xl font-display font-black text-primary">{teamMetrics.avgAdherence}%</span>
                          <StatusBadge status={teamMetrics.avgAdherence > 80 ? 'Verde' : teamMetrics.avgAdherence > 60 ? 'Amarelo' : 'Vermelho'} />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Maturidade de Governança</p>
                        <div className="flex items-end gap-3">
                          <span className="text-3xl font-display font-black text-secondary">{teamMetrics.avgGov}%</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6 pt-6 border-t border-slate-100">
                      <p className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <Users size={14} />
                        Participantes ({teamMetrics.totalParticipants})
                      </p>
                      <div className="space-y-3">
                        {teamAssessments.map(ass => (
                          <div key={ass.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                            <div>
                              <p className="text-xs font-black text-primary">{ass.userName}</p>
                              <p className="text-[10px] text-slate-500 font-bold">{ass.roleTitle}</p>
                            </div>
                            <span className="text-xs font-black text-secondary">{ass.adherenceScore}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-8 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 text-center">
                    <p className="text-sm text-slate-500">Nenhum dado de time disponível ainda.</p>
                  </div>
                )}
              </div>

              <div className="lg:col-span-2 space-y-8">
                {teamMetrics && (
                  <div className="bg-primary rounded-[40px] p-10 text-white space-y-12 shadow-xl shadow-primary/20">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-2xl font-display font-black">Sinergia de Governança do Time</h3>
                        <p className="text-white/60 text-sm">Comparativo entre a média real da equipe e o perfil ideal dos cargos ocupados.</p>
                      </div>
                      <div className="flex gap-4">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-white/20" />
                          <span className="text-[10px] font-bold uppercase tracking-wider text-white/60">Ideal</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-secondary" />
                          <span className="text-[10px] font-bold uppercase tracking-wider text-white/60">Real</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-4 gap-8">
                      {['D', 'I', 'S', 'C'].map(trait => (
                        <div key={trait} className="space-y-6">
                          <div className="relative h-64 w-full bg-white/5 rounded-full flex flex-col justify-end overflow-hidden">
                            {/* Ideal Bar */}
                            <motion.div 
                              initial={{ height: 0 }}
                              animate={{ height: `${teamMetrics.ideal[trait as keyof typeof teamMetrics.ideal]}%` }}
                              className="absolute inset-x-0 bottom-0 bg-white/10 border-t border-white/20"
                            />
                            {/* Actual Bar */}
                            <motion.div 
                              initial={{ height: 0 }}
                              animate={{ height: `${teamMetrics.actual[trait as keyof typeof teamMetrics.actual]}%` }}
                              className="relative w-full bg-secondary shadow-[0_0_20px_rgba(var(--secondary-rgb),0.5)] z-10"
                            >
                              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full pb-2">
                                <span className="text-xs font-black">{teamMetrics.actual[trait as keyof typeof teamMetrics.actual]}%</span>
                              </div>
                            </motion.div>
                          </div>
                          <div className="text-center space-y-1">
                            <p className="text-lg font-black">{trait}</p>
                            <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">
                              Ideal: {teamMetrics.ideal[trait as keyof typeof teamMetrics.ideal]}%
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="pt-8 border-t border-white/10 grid md:grid-cols-2 gap-8">
                      <div className="p-6 bg-white/5 rounded-3xl space-y-3">
                        <div className="flex items-center gap-2 text-secondary">
                          <Zap size={16} />
                          <span className="text-xs font-black uppercase tracking-widest">Análise de Grupo</span>
                        </div>
                        <p className="text-sm leading-relaxed text-white/80">
                          {teamMetrics.avgGov > 70 ? 
                            "O time de governança demonstra alta maturidade e alinhamento com os 49 princípios." : 
                            "Existem gaps de governança que precisam ser endereçados para garantir a perenidade do negócio."}
                        </p>
                      </div>
                      <div className="p-6 bg-white/5 rounded-3xl space-y-3">
                        <div className="flex items-center gap-2 text-amber-400">
                          <AlertCircle size={16} />
                          <span className="text-xs font-black uppercase tracking-widest">Sinergia de Cargos</span>
                        </div>
                        <p className="text-sm leading-relaxed text-white/80">
                          {teamMetrics.avgAdherence > 80 ? 
                            "A sobreposição entre os perfis reais e os cargos ideais está em alto nível de excelência." : 
                            "Há necessidade de ajustes finos nas atribuições ou treinamentos para alinhar o time aos cargos."}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
