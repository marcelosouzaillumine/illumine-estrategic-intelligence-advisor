

import React, { useState, useMemo, useEffect } from 'react';
import { Users, Target, Brain, BarChart, ChevronRight, CheckCircle2, AlertCircle, TrendingUp, Award, ShieldCheck, Briefcase, Compass, Zap, Info, ArrowRight, BookOpen, PieChart, Lightbulb, Search, Star, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { collection, addDoc, serverTimestamp, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { db, auth } from '../../lib/firebase';
import { GOVERNANCE_PRINCIPLES } from '../../lib/governanceIntelligence';
import { PageHeader, SectionHeader, StatusBadge } from '../Common';
import { cn } from '../../lib/utils';
import { ExecutivePageTemplate } from '../ui/executive-page-template';
import { createPortal } from 'react-dom';
import { ExecutiveSummarySection } from '../ui/executive-summary-section';
import { ExecutiveStrategicTensions } from '../ui/executive-strategic-tensions';
import { ExecutiveDecisionTrace } from '../ui/executive-decision-trace';
import { useLeadershipProfilePageViewModel } from '../../viewmodels/useLeadershipProfilePageViewModel';
import { ExecutiveHeading } from '../ui/executive-heading';
import { ExecutiveText } from '../ui/executive-typography';
import { ExecutiveSurface } from '../ui/executive-surface';
import { ExecutiveAccordion } from '../ui/executive-accordion';
import { ExecutiveEmptyState } from '../ui/executive-empty-state';

interface Role {
  id: string;
  title: string;
  category: 'Gerência' | 'Coordenação';
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

const LEADERSHIP_ROLES: Role[] = [
  {
    id: 'gerente_operacoes',
    title: 'Gerente de Operações',
    category: 'Gerência',
    description: 'Responsável pela eficiência dos processos produtivos, gestão de recursos e entrega de metas operacionais.',
    essentialSoftSkills: [
      { name: 'Gestão de Processos', description: 'Habilidade de otimizar fluxos e identificar gargalos operacionais.', idealLevel: 5 },
      { name: 'Liderança de Equipes', description: 'Capacidade de engajar times operacionais em torno de objetivos comuns.', idealLevel: 5 },
      { name: 'Foco em Resultados', description: 'Orientação constante para a entrega de KPIs de eficiência.', idealLevel: 5 },
      { name: 'Resolução de Problemas', description: 'Agilidade para lidar com imprevistos no dia a dia da operação.', idealLevel: 4 },
    ],
    idealProfile: {
      disc: { D: 35, I: 15, S: 20, C: 30 },
      enneagram: [1, 3, 6]
    }
  },
  {
    id: 'gerente_financeiro',
    title: 'Gerente Financeiro',
    category: 'Gerência',
    description: 'Garante o controle de fluxo de caixa, compliance fiscal e suporte financeiro para as decisões de negócio.',
    essentialSoftSkills: [
      { name: 'Precisão Analítica', description: 'Atenção extrema aos detalhes e integridade dos dados financeiros.', idealLevel: 5 },
      { name: 'Gestão de Riscos', description: 'Identificação proativa de ameaças ao patrimônio e liquidez.', idealLevel: 5 },
      { name: 'Negociação', description: 'Habilidade em tratar com bancos, fornecedores e parceiros.', idealLevel: 4 },
      { name: 'Comunicação Clara', description: 'Capacidade de explicar cenários financeiros para não-especialistas.', idealLevel: 4 },
    ],
    idealProfile: {
      disc: { D: 20, I: 10, S: 30, C: 40 },
      enneagram: [1, 5, 6]
    }
  },
  {
    id: 'gerente_comercial',
    title: 'Gerente Comercial',
    category: 'Gerência',
    description: 'Lidera a força de vendas, define estratégias de mercado e garante o crescimento da receita.',
    essentialSoftSkills: [
      { name: 'Influência e Persuasão', description: 'Habilidade de motivar o time e encantar grandes contas.', idealLevel: 5 },
      { name: 'Resiliência Comercial', description: 'Capacidade de manter o ritmo diante de rejeições e metas agressivas.', idealLevel: 5 },
      { name: 'Visão de Mercado', description: 'Leitura rápida de movimentos da concorrência e oportunidades.', idealLevel: 4 },
      { name: 'Desenvolvimento de Pessoas', description: 'Foco em treinar e elevar a performance dos vendedores.', idealLevel: 4 },
    ],
    idealProfile: {
      disc: { D: 40, I: 40, S: 10, C: 10 },
      enneagram: [3, 7, 8]
    }
  },
  {
    id: 'gerente_administrativo',
    title: 'Gerente Administrativo',
    category: 'Gerência',
    description: 'Gerencia a infraestrutura, serviços de apoio e rotinas administrativas para suporte ao negócio.',
    essentialSoftSkills: [
      { name: 'Organização Sistêmica', description: 'Estruturação de processos administrativos de suporte.', idealLevel: 5 },
      { name: 'Gestão de Contratos', description: 'Zelo pela eficiência na contratação de terceiros.', idealLevel: 5 },
      { name: 'Controle de Custos', description: 'Monitoramento rigoroso de despesas operacionais.', idealLevel: 5 },
      { name: 'Liderança de Apoio', description: 'Coordenação de equipes multifuncionais de suporte.', idealLevel: 4 },
    ],
    idealProfile: {
      disc: { D: 20, I: 15, S: 30, C: 35 },
      enneagram: [1, 6, 9]
    }
  },
  {
    id: 'coordenador_administrativo',
    title: 'Coordenador Administrativo',
    category: 'Coordenação',
    description: 'Coordena as rotinas de facilities, suprimentos internos e serviços gerais.',
    essentialSoftSkills: [
      { name: 'Execução de Processos', description: 'Garante que as rotinas administrativas sejam seguidas.', idealLevel: 5 },
      { name: 'Agilidade de Suporte', description: 'Rapidez na resolução de problemas de infraestrutura.', idealLevel: 5 },
      { name: 'Zelo Patrimonial', description: 'Cuidado com os ativos e ambiente de trabalho.', idealLevel: 5 },
      { name: 'Comunicação Interna', description: 'Interface entre as áreas e os serviços de apoio.', idealLevel: 4 },
    ],
    idealProfile: {
      disc: { D: 15, I: 15, S: 35, C: 35 },
      enneagram: [1, 6, 2]
    }
  },
  {
    id: 'gerente_logistica',
    title: 'Gerente de Logística',
    category: 'Gerência',
    description: 'Estrategista da cadeia de suprimentos, focado em otimização de malha, custos e nível de serviço.',
    essentialSoftSkills: [
      { name: 'Visão Sistêmica', description: 'Entendimento completo da cadeia de suprimentos.', idealLevel: 5 },
      { name: 'Negociação Logística', description: 'Habilidade com transportadores e operadores.', idealLevel: 5 },
      { name: 'Gestão de KPIs', description: 'Foco total em indicadores de prazo e custo.', idealLevel: 5 },
      { name: 'Resiliência Operacional', description: 'Capacidade de lidar com crises na cadeia.', idealLevel: 4 },
    ],
    idealProfile: {
      disc: { D: 30, I: 10, S: 25, C: 35 },
      enneagram: [6, 8, 1]
    }
  },
  {
    id: 'gerente_rh',
    title: 'Gerente de RH',
    category: 'Gerência',
    description: 'Estrategista de capital humano, guardião da cultura e parceiro do negócio em gente e gestão.',
    essentialSoftSkills: [
      { name: 'Visão Estratégica de Gente', description: 'Alinhamento de pessoas aos objetivos do negócio.', idealLevel: 5 },
      { name: 'Gestão de Cultura', description: 'Desenvolvimento e manutenção do DNA organizacional.', idealLevel: 5 },
      { name: 'Mediação de Conflitos', description: 'Habilidade em lidar com tensões em alto nível.', idealLevel: 5 },
      { name: 'Desenvolvimento de Líderes', description: 'Foco na formação da próxima geração de gestores.', idealLevel: 5 },
    ],
    idealProfile: {
      disc: { D: 15, I: 35, S: 35, C: 15 },
      enneagram: [2, 3, 9]
    }
  },
  {
    id: 'gerente_compras',
    title: 'Gerente de Compras',
    category: 'Gerência',
    description: 'Responsável pelo sourcing estratégico, redução de custos e gestão de parcerias com fornecedores.',
    essentialSoftSkills: [
      { name: 'Sourcing Estratégico', description: 'Capacidade de encontrar e desenvolver parceiros.', idealLevel: 5 },
      { name: 'Negociação de Alto Nível', description: 'Foco em ganhos de escala e condições comerciais.', idealLevel: 5 },
      { name: 'Integridade Comercial', description: 'Zelo absoluto pela ética nas contratações.', idealLevel: 5 },
      { name: 'Análise de Mercado', description: 'Leitura de tendências de preços e commodities.', idealLevel: 4 },
    ],
    idealProfile: {
      disc: { D: 35, I: 20, S: 10, C: 35 },
      enneagram: [1, 5, 8]
    }
  },
  {
    id: 'coordenador_compras',
    title: 'Coordenador de Compras',
    category: 'Coordenação',
    description: 'Coordena o fluxo de pedidos, homologação de fornecedores e cotações operacionais.',
    essentialSoftSkills: [
      { name: 'Agilidade em Cotações', description: 'Rapidez e precisão na busca por orçamentos.', idealLevel: 5 },
      { name: 'Follow-up de Pedidos', description: 'Garante que os prazos de entrega sejam cumpridos.', idealLevel: 5 },
      { name: 'Conformidade de Processo', description: 'Segue rigorosamente as alçadas de aprovação.', idealLevel: 5 },
      { name: 'Organização de Cadastro', description: 'Zelo pela base de dados de fornecedores.', idealLevel: 4 },
    ],
    idealProfile: {
      disc: { D: 25, I: 15, S: 25, C: 35 },
      enneagram: [6, 1, 5]
    }
  },
  {
    id: 'coordenador_logistica',
    title: 'Coordenador de Logística',
    category: 'Coordenação',
    description: 'Orquestra a movimentação de mercadorias, armazenagem e prazos de entrega ao cliente.',
    essentialSoftSkills: [
      { name: 'Senso de Urgência', description: 'Capacidade de priorizar tarefas em um ambiente dinâmico.', idealLevel: 5 },
      { name: 'Planejamento', description: 'Estruturação de rotas e estoques de forma eficiente.', idealLevel: 5 },
      { name: 'Liderança Operacional', description: 'Gestão próxima de equipes de armazém e transportes.', idealLevel: 4 },
      { name: 'Adaptabilidade', description: 'Habilidade de ajustar planos diante de problemas logísticos.', idealLevel: 4 },
    ],
    idealProfile: {
      disc: { D: 25, I: 15, S: 35, C: 25 },
      enneagram: [6, 1, 9]
    }
  },
  {
    id: 'coordenador_rh',
    title: 'Coordenador de RH',
    category: 'Coordenação',
    description: 'Focado no desenvolvimento da cultura, recrutamento de talentos e harmonia nas relações de trabalho.',
    essentialSoftSkills: [
      { name: 'Empatia', description: 'Sensibilidade para entender as necessidades e dores dos colaboradores.', idealLevel: 5 },
      { name: 'Comunicação Interpessoal', description: 'Habilidade de mediar conflitos e transmitir a cultura da empresa.', idealLevel: 5 },
      { name: 'Organização', description: 'Gestão de processos de DP e treinamento com precisão.', idealLevel: 4 },
      { name: 'Discrição', description: 'Tratamento ético e sigiloso de informações sensíveis.', idealLevel: 5 },
    ],
    idealProfile: {
      disc: { D: 10, I: 40, S: 40, C: 10 },
      enneagram: [2, 6, 9]
    }
  }
];

const DISC_QUESTIONS = [
  { id: 'q1', text: 'Gosto de assumir desafios e prefiro ter autonomia total sobre meu trabalho.', trait: 'D' },
  { id: 'q2', text: 'Sinto-me motivado quando posso influenciar a equipe através da minha fala.', trait: 'I' },
  { id: 'q3', text: 'Prefiro manter o ritmo atual e evitar mudanças bruscas que desestabilizem o time.', trait: 'S' },
  { id: 'q4', text: 'Analiso todos os dados técnicos antes de dar um feedback ou tomar uma decisão.', trait: 'C' },
  { id: 'q5', text: 'Foco muito mais no prazo final do que no processo para chegar lá.', trait: 'D' },
  { id: 'q6', text: 'Acredito que um clima leve e divertido é essencial para a produtividade.', trait: 'I' },
  { id: 'q7', text: 'Sou um ouvinte paciente e valorizo o consenso antes de agir.', trait: 'S' },
  { id: 'q8', text: 'Sigo as normas e regulamentos da empresa rigorosamente.', trait: 'C' },
  { id: 'q9', text: 'Sou direto e franco, mesmo que isso cause algum desconforto momentâneo.', trait: 'D' },
  { id: 'q10', text: 'Adoro organizar eventos e reuniões de integração para a equipe.', trait: 'I' },
  { id: 'q11', text: 'Dificilmente perco a calma, mesmo em situações de alta pressão operacional.', trait: 'S' },
  { id: 'q12', text: 'Prefiro trabalhar com metodologias estruturadas e previsíveis.', trait: 'C' },
];

const ENNEAGRAM_QUESTIONS = [
  { id: 'e1', text: 'Sinto que é minha obrigação fazer as coisas da maneira correta e ética.', type: 1 },
  { id: 'e2', text: 'Fico feliz quando percebo que sou indispensável para minha equipe.', type: 2 },
  { id: 'e3', text: 'Gosto de ser reconhecido pelos meus resultados e metas batidas.', type: 3 },
  { id: 'e4', text: 'Busco colocar um toque pessoal e único em tudo o que coordeno.', type: 4 },
  { id: 'e5', text: 'Prefiro entender toda a lógica de um problema antes de intervir.', type: 5 },
  { id: 'e6', text: 'Sempre penso no que pode dar errado para proteger a empresa.', type: 6 },
  { id: 'e7', text: 'Gosto de novos projetos e de brainstorming de ideias inovadoras.', type: 7 },
  { id: 'e8', text: 'Não tenho medo de confrontar situações de justiça na equipe.', type: 8 },
  { id: 'e9', text: 'Prefiro ceder em pequenos pontos para manter a harmonia do grupo.', type: 9 },
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

export function LeadershipProfilePage({ clientId }: { clientId: string }) {
  // Adapter: useLeadershipProfilePageAdapter
  // ViewModel: useLeadershipProfilePageViewModel
  const { state: vmState, computed: vmComputed, actions: vmActions } = useLeadershipProfilePageViewModel({ clientId });
  const portal = createPortal;
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

  const handleAnswer = (questionId: string, value: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

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
        adherenceScore,
        createdAt: serverTimestamp(),
        type: 'leadership_assessment'
      };

      await addDoc(collection(db, 'leadership_profiles'), resultsData);
      alert('Perfil de liderança salvo com sucesso no histórico da empresa!');
    } catch (error) {
      console.error('Error saving leadership profile:', error);
      alert('Erro ao salvar resultados.');
    } finally {
      setIsSaving(false);
    }
  };

  const calculateUserDISC = () => {
    const totals = { D: 0, I: 0, S: 0, C: 0 };
    const counts = { D: 0, I: 0, S: 0, C: 0 };

    DISC_QUESTIONS.forEach(q => {
      const trait = q.trait as keyof typeof totals;
      totals[trait] += (answers[q.id] || 3);
      counts[trait] += 5;
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
      scores[q.type] = (enneagramAnswers[q.id] || 3) * 20;
    });
    return scores;
  };

  const userProfile = useMemo(() => calculateUserDISC(), [answers]);
  const userEnneagram = useMemo(() => calculateUserEnneagram(), [enneagramAnswers]);

  const adherenceScore = useMemo(() => {
    if (!selectedRole) return 0;
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

  const governanceAlignmentScore = useMemo(() => {
    const answeredCount = Object.keys(dilemmaAnswers).length;
    if (answeredCount === 0) return 0;
    
    let totalScore = 0;
    Object.values(dilemmaAnswers).forEach(score => {
      // Normalize -2 to 2 into 0 to 100
      const normalized = ((score + 2) / 4) * 100;
      totalScore += normalized;
    });
    
    return Math.round(totalScore / answeredCount);
  }, [dilemmaAnswers]);

  const teamMetrics = useMemo(() => {
    if (teamAssessments.length === 0) return null;

    const avgDisc = { D: 0, I: 0, S: 0, C: 0 };
    const idealAvgDisc = { D: 0, I: 0, S: 0, C: 0 };
    let totalAdherence = 0;

    teamAssessments.forEach(ass => {
      avgDisc.D += ass.disc.D;
      avgDisc.I += ass.disc.I;
      avgDisc.S += ass.disc.S;
      avgDisc.C += ass.disc.C;
      totalAdherence += ass.adherenceScore;

      const role = LEADERSHIP_ROLES.find(r => r.id === ass.roleId);
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
      totalParticipants: count
    };
  }, [teamAssessments]);

  const dilemmasByAxis = useMemo(() => {
    const groups: Record<string, typeof ETHICAL_DILEMMAS> = {};
    ETHICAL_DILEMMAS.forEach(d => {
      const principle = GOVERNANCE_PRINCIPLES.find(p => p.id === d.id);
      const axis = principle?.axis || 'Outros';
      if (!groups[axis]) groups[axis] = [];
      groups[axis].push(d);
    });
    return groups;
  }, []);

  // Adapter: Firestore collection('assessments')/getDocs e GOVERNANCE_PRINCIPLES encapsulam os questionários éticos e perfis de liderança
  // ViewModel: teamMetrics, LEADERSHIP_ROLES e filteredAssessments mapeados para visualização do perfil de liderança
  return (
    <ExecutivePageTemplate header={{
      title: "Liderança: Gestão & Coordenação",
      description: "Mapeamento de competências, inteligência comportamental e alinhamento de perfil para lideranças táticas e operacionais.",
    }}>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">

        <div className="flex items-center gap-3">
          <StatusBadge status="Verde" label="Avaliação de Perfil Ativa" />
          <div className="px-4 md:px-6 py-2 md:py-3 bg-card border border-border rounded-md shadow-sm flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Brain size={14} className="text-secondary" />
              <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">DNA de Gestão Ativo</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('assessment')}
            className="btn-executive bg-secondary shadow-xl shadow-secondary/20"
          >
            <Zap size={14} /> INICIAR AUTOAVALIAÇÃO
          </button>
        </div>
      
      </div>

      <div className="mt-12 mb-8 border-t border-border pt-8" />
      <ExecutiveAccordion
        title="Painel de Mapeamento de Liderança"
        subtitle="Analise a aderência de perfis comportamentais e inteligência de governança da alta gestão."
        variant="analytics"
        defaultExpanded
      >


      <div className="flex gap-2 p-1 bg-surface-container/60 backdrop-blur-sm border border-border rounded-md w-fit -mt-6">
        {[
          { id: 'roles', label: 'Cargos e Perfil', icon: Users },
          { id: 'assessment', label: 'DNA de Gestão', icon: Brain },
          { id: 'dilemmas', label: 'Dilemas de Gestão', icon: ShieldCheck },
          { id: 'team', label: 'Análise do Time', icon: PieChart },
          { id: 'analysis', label: 'Gaps e Desenvolvimento', icon: TrendingUp },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={cn(
              "flex items-center gap-3 px-4 md:px-6 py-2 md:py-2.5 rounded-md text-[10px] font-medium uppercase tracking-widest transition-all",
              activeTab === tab.id 
                ? "bg-card text-foreground shadow-premium border border-border" 
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <tab.icon size={14} />
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
            <div className="lg:col-span-1 space-y-6">
              <SectionHeader 
                title="Lideranças" 
                subtitle="Selecione o cargo para ver o perfil ideal."
                icon={Briefcase}
              />
              
              <div className="space-y-4">
                {['Gerência', 'Coordenação'].map(cat => (
                  <div key={cat} className="space-y-2">
                    <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest ml-2">{cat}</p>
                    <div className="space-y-2">
                      {LEADERSHIP_ROLES.filter(r => r.category === cat).map(role => (
                        <button
                          key={role.id}
                          onClick={() => setSelectedRole(role)}
                          className={cn(
                            "w-full flex items-center justify-between p-4 rounded-md border transition-all text-left group",
                            selectedRole?.id === role.id 
                              ? "bg-executive border-executive text-white shadow-xl shadow-executive/20" 
                              : "bg-card border-border hover:border-secondary/30"
                          )}
                        >
                          <div className="flex items-center gap-4">
                            <div className={cn(
                              "w-10 h-10 rounded-md flex items-center justify-center transition-colors shadow-inner",
                              selectedRole?.id === role.id ? "bg-white/10" : "bg-surface-container"
                            )}>
                              <Star size={18} className={selectedRole?.id === role.id ? "text-white" : "text-secondary"} />
                            </div>
                            <div>
                              <p className="text-xs font-medium uppercase tracking-widest">{role.title}</p>
                              <p className={cn("text-[10px] font-medium uppercase tracking-widest mt-0.5", selectedRole?.id === role.id ? "text-white/60" : "text-muted-foreground")}>Ver perfil ideal</p>
                            </div>
                          </div>
                          <ChevronRight size={16} className={cn("transition-transform", selectedRole?.id === role.id ? "translate-x-1" : "group-hover:translate-x-1 text-muted-foreground/30")} />
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-2">
              {selectedRole ? (
                <div className="card-premium p-8 space-y-10 sticky top-32">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <StatusBadge status="Verde" />
                        <h2 className="text-3xl font-medium text-foreground tracking-tighter uppercase">{selectedRole.title}</h2>
                      </div>
                      <p className="text-[11px] text-muted-foreground max-w-2xl uppercase tracking-widest italic">{selectedRole.description}</p>
                    </div>
                    <div className="w-16 h-16 bg-surface-container rounded-md flex items-center justify-center text-primary border border-border shadow-inner">
                      <Zap size={32} strokeWidth={1.5} className="text-secondary" />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <h3 className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                        <Target size={14} className="text-secondary" />
                        Competências Chave
                      </h3>
                      <div className="space-y-4">
                        {selectedRole.essentialSoftSkills.map(skill => (
                          <div key={skill.name} className="p-4 bg-surface-container/30 rounded-md border border-border group hover:bg-card hover:shadow-premium transition-all">
                            <div className="flex justify-between items-center mb-2">
                              <p className="text-[11px] font-medium text-foreground uppercase tracking-widest">{skill.name}</p>
                              <div className="flex gap-1">
                                {[1, 2, 3, 4, 5].map(i => (
                                  <div 
                                    key={i} 
                                    className={cn(
                                      "w-1.5 h-3 rounded-full transition-all shadow-sm",
                                      i <= skill.idealLevel ? "bg-secondary" : "bg-border"
                                    )} 
                                  />
                                ))}
                              </div>
                            </div>
                            <p className="text-[10px] leading-relaxed text-muted-foreground italic uppercase tracking-widest">{skill.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-6">
                      <h3 className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                        <PieChart size={14} className="text-primary" />
                        Perfil DISC Esperado
                      </h3>
                      <div className="p-6 bg-executive rounded-md text-white space-y-6 shadow-premium border border-white/5">
                        <div className="grid grid-cols-4 gap-2">
                          {Object.entries(selectedRole.idealProfile.disc).map(([trait, val]) => (
                            <div key={trait} className="flex flex-col items-center gap-2">
                              <div className="w-full bg-white/10 rounded-md h-24 relative overflow-hidden flex flex-col justify-end shadow-inner border border-white/5">
                                <motion.div 
                                  initial={{ height: 0 }}
                                  animate={{ height: `${val}%` }}
                                  className="w-full bg-secondary shadow-premium"
                                />
                              </div>
               <span className="text-[10px] font-medium uppercase tracking-widest ">{trait}</span>
                              <span className="text-[10px] font-medium uppercase tracking-widest">{val}%</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="p-6 bg-secondary/5 rounded-md border border-secondary/10 flex items-start gap-4 shadow-inner">
                        <div className="w-10 h-10 rounded-md bg-secondary/10 flex items-center justify-center shrink-0 shadow-inner">
                          <Lightbulb size={20} className="text-secondary" />
                        </div>
                        <div>
             <p className="text-[10px] font-medium text-executive-secondary uppercase tracking-widest mb-1">Dica de Gestão</p>
                          <p className="text-[10px] text-muted-foreground leading-relaxed italic uppercase tracking-widest">
                            "Para {selectedRole.category.toLowerCase()}s, a aderência ao perfil DISC garante que a liderança seja exercida de forma fluida, reduzindo o turnover e aumentando o engajamento da base."
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-full min-h-[600px] flex flex-col items-center justify-center bg-surface-container/30 rounded-md border-2 border-dashed border-border text-center p-10">
                  <div className="w-20 h-20 bg-card rounded-md shadow-premium flex items-center justify-center text-muted-foreground/30 mb-6 border border-border">
                    <Users size={40} strokeWidth={1} />
                  </div>
                  <h3 className="text-h2 font-medium text-foreground tracking-tight uppercase">Escolha um cargo de liderança</h3>
                  <p className="mt-2 text-[11px] text-muted-foreground max-w-2xl uppercase tracking-widest font-medium italic">Mapeie as competências ideais para gerentes e coordenadores da sua organização.</p>
                </div>
              )}
            </div>
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
            <div className="card-premium overflow-hidden border-none shadow-2xl">
              <div className="bg-executive p-10 text-white relative">
                <div className="absolute top-0 right-0 p-10 opacity-10">
                  <Brain size={120} strokeWidth={1} />
                </div>
                <div className="relative z-10 space-y-2">
                  <div className="flex items-center gap-3 mb-4 py-2 px-4 bg-white/10 rounded-md w-fit border border-white/10 shadow-inner">
                    <Users size={14} className="text-secondary" />
                    <span className="text-[10px] font-medium tracking-widest uppercase">Avaliador: {auth.currentUser?.displayName || 'Convidado'}</span>
                  </div>
         <p className="text-[10px] font-medium uppercase tracking-[0.2em] ">Leadership DNA</p>
                  <h2 className="text-4xl font-medium tracking-tighter uppercase">
                    {!hasConfirmedRole ? 'Confirme seu Cargo' : assessmentType === 'disc' ? 'DNA de Gestão' : 'Eneagrama Tático'}
                  </h2>
                </div>
                {hasConfirmedRole && (
                  <div className="mt-10 flex gap-2">
                    <div className="flex gap-1 flex-1">
                      {Array.from({ length: Math.ceil((assessmentType === 'disc' ? DISC_QUESTIONS : ENNEAGRAM_QUESTIONS).length / 2) }).map((_, i) => (
                        <div 
                          key={i} 
                          className={cn(
                            "h-1.5 flex-1 rounded-full transition-all duration-500 shadow-sm",
                            i < assessmentStep ? "bg-secondary" : i === assessmentStep ? "bg-white" : "bg-white/20"
                          )} 
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="p-10 lg:p-16 space-y-12">
                {!hasConfirmedRole ? (
                  <div className="space-y-10">
                    <div className="p-8 bg-surface-container/30 rounded-md border border-border space-y-6 shadow-inner">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-md bg-executive flex items-center justify-center text-white shadow-premium">
                          <Users size={24} />
                        </div>
                        <div>
                          <h3 className="text-lg font-medium text-foreground uppercase tracking-widest">Para qual cargo você está respondendo?</h3>
                          <p className="text-[11px] text-muted-foreground uppercase tracking-widest italic font-medium">Isso garante que sua análise seja comparada ao perfil ideal correto.</p>
                        </div>
                      </div>
                      
                      <div className="grid sm:grid-cols-2 gap-3">
                        {LEADERSHIP_ROLES.map(role => (
                          <button
                            key={role.id}
                            onClick={() => setSelectedRole(role)}
                            className={cn(
                              "p-4 rounded-md border text-left transition-all",
                              selectedRole?.id === role.id 
                                ? "bg-card border-secondary shadow-premium ring-1 ring-secondary/5" 
                                : "bg-card border-border hover:border-muted-foreground/30"
                            )}
                          >
                            <p className="text-[11px] font-medium text-foreground uppercase tracking-widest">{role.title}</p>
              <p className="text-[9px] text-executive-secondary font-medium uppercase tracking-widest mt-0.5">{role.category}</p>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-center">
                      <button
                        disabled={!selectedRole}
                        onClick={() => setHasConfirmedRole(true)}
                        className="btn-executive bg-secondary shadow-xl shadow-secondary/20"
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
                            <h4 className="text-xl font-medium text-foreground tracking-tight uppercase">{q.text}</h4>
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
                                  "flex-1 h-16 rounded-md border font-medium text-lg transition-all active:scale-95 shadow-sm uppercase tracking-widest",
                                  (assessmentType === 'disc' ? answers[q.id] : enneagramAnswers[q.id]) === val 
                                    ? "bg-secondary border-secondary text-white shadow-xl shadow-secondary/20" 
                                    : "bg-card border-border text-muted-foreground hover:border-secondary/30 hover:text-secondary"
                                )}
                              >
                                {val}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-between pt-8 border-t border-border">
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
                        className="px-5 md:px-8 py-2 md:py-3 text-[10px] font-medium uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors disabled:opacity-30"
                      >
                        Voltar
                      </button>
                      
                      {assessmentStep < Math.ceil((assessmentType === 'disc' ? DISC_QUESTIONS : ENNEAGRAM_QUESTIONS).length / 2) - 1 ? (
                        <button
                          onClick={() => setAssessmentStep(s => s + 1)}
                          className="btn-executive bg-executive shadow-xl shadow-executive/20"
                        >
                          Próximo
                          <ArrowRight size={16} />
                        </button>
                      ) : assessmentType === 'disc' ? (
                        <button
                          onClick={() => {
                            setAssessmentType('enneagram');
                            setAssessmentStep(0);
                          }}
                          className="px-6 md:px-10 py-3 md:py-4 bg-secondary text-white rounded-2xl text-xs font-black uppercase tracking-widest flex items-center gap-3 hover:shadow-xl hover:shadow-secondary/20 transition-all active:scale-95"
                        >
                          Eneagrama
                          <ArrowRight size={16} />
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            setShowResults(true);
                            setActiveTab('analysis');
                          }}
                          className="px-6 md:px-10 py-3 md:py-4 bg-success-soft0 text-white rounded-2xl text-xs font-black uppercase tracking-widest flex items-center gap-3 hover:shadow-xl hover:shadow-emerald-500/20 transition-all active:scale-95"
                        >
                          Ver Resultados
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

        {activeTab === 'dilemmas' && (
          <motion.div 
            key="dilemmas"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="max-w-4xl mx-auto space-y-8"
          >
            <div className="flex justify-between items-end">
              <SectionHeader title="Dilemas de Gestão" subtitle="Avaliação de alinhamento com os 49 princípios da governança." icon={ShieldCheck} />
              <div className="text-right pb-2">
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Progresso do Diagnóstico</p>
        <p className="text-xl font-black text-primary">{dilemmaStep + 1} <span className="text-executive-secondary">/ {ETHICAL_DILEMMAS.length}</span></p>
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
                className="bg-white rounded-[40px] border border-border p-10 lg:p-16 shadow-premium space-y-10"
              >
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-primary/5 flex items-center justify-center text-primary shrink-0">
                      <AlertCircle size={28} />
                    </div>
                    <div>
           <p className="text-xs font-black text-executive-secondary uppercase tracking-widest mb-1">
                        {GOVERNANCE_PRINCIPLES.find(p => p.id === ETHICAL_DILEMMAS[dilemmaStep].principleId)?.axis}
                      </p>
                      <h4 className="text-2xl font-display font-black text-primary">{ETHICAL_DILEMMAS[dilemmaStep].title}</h4>
                    </div>
                  </div>
                  <div className="relative">
                    <div className="absolute -left-4 top-0 bottom-0 w-1 bg-secondary/20 rounded-full" />
          <p className="text-lg text-executive-secondary leading-relaxed italic pl-6">
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
                          : "bg-white border-border hover:border-secondary/30 text-muted-foreground hover:text-primary"
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

                <div className="flex justify-between items-center pt-10 border-t border-border">
                  <button
                    disabled={dilemmaStep === 0}
                    onClick={() => setDilemmaStep(s => s - 1)}
                    className="px-5 md:px-8 py-2 md:py-3 text-xs font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors disabled:opacity-20"
                  >
                    Anterior
                  </button>

                  {dilemmaStep === ETHICAL_DILEMMAS.length - 1 ? (
                    <button
                      onClick={() => {
                        setShowResults(true);
                        setActiveTab('analysis');
                      }}
                      className="px-6 md:px-10 py-3 md:py-4 bg-success-soft0 text-white rounded-2xl text-xs font-black uppercase tracking-widest flex items-center gap-3 hover:shadow-xl hover:shadow-emerald-500/20 transition-all active:scale-95"
                    >
                      Finalizar Diagnóstico
                      <Zap size={16} fill="currentColor" />
                    </button>
                  ) : (
                    <button
                      onClick={() => setDilemmaStep(s => s + 1)}
                      className="px-6 md:px-10 py-3 md:py-4 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest flex items-center gap-3 hover:shadow-xl hover:shadow-slate-900/20 transition-all active:scale-95"
                    >
                      Pular
                      <ArrowRight size={16} />
                    </button>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
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
              <div className="bg-white rounded-[40px] border border-border p-10 shadow-premium">
                <SectionHeader title="Análise de Gap de Liderança" subtitle="Comparativo entre seu perfil e o cargo almejado." icon={TrendingUp} />
                <div className="mt-10 grid lg:grid-cols-2 gap-10">
                  <div className="space-y-6">
                    <p className="text-sm font-bold text-primary">Seu Perfil DISC</p>
                    <div className="grid grid-cols-4 gap-4 h-48 items-end">
                      {Object.entries(userProfile).map(([trait, val]) => (
                        <div key={trait} className="space-y-2 text-center">
                          <div className="w-full bg-slate-100 rounded-xl relative h-32 overflow-hidden">
                            <motion.div 
                              initial={{ height: 0 }}
                              animate={{ height: `${val}%` }}
                              className="absolute bottom-0 w-full bg-secondary"
                            />
                          </div>
                          <span className="text-xs font-black">{trait}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-8">
                    <div className="p-8 bg-slate-50 rounded-3xl flex flex-col justify-center items-center text-center">
                      <p className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-2">Aderência ao Cargo (DISC)</p>
                      <div className="text-6xl font-black text-primary mb-4">{adherenceScore}%</div>
                      <p className="text-[11px] text-muted-foreground">
                        {adherenceScore > 80 ? 'Excelente alinhamento para cargos de liderança tática.' : 
                         adherenceScore > 50 ? 'Bom potencial, com pontos específicos de desenvolvimento.' : 
                         'Recomendamos foco em desenvolvimento de competências comportamentais.'}
                      </p>
                    </div>

                    <div className="p-8 bg-primary text-white rounded-3xl flex flex-col justify-center items-center text-center shadow-xl shadow-primary/20">
           <p className="text-xs font-black uppercase tracking-widest mb-2">Alinhamento de Governança</p>
                      <div className="text-6xl font-black mb-4">{governanceAlignmentScore}%</div>
           <p className="text-[11px] ">
                        {governanceAlignmentScore > 80 ? 'Alta maturidade ética e processual.' : 
                         governanceAlignmentScore > 50 ? 'Alinhamento médio com os padrões da organização.' : 
                         'Necessário treinamento intensivo em princípios de governança.'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-10 flex justify-center border-t border-border pt-10">
                  <button
                    onClick={handleSaveResults}
                    disabled={isSaving}
                    className="px-4 md:px-6 md:px-12 py-2 md:py-3 md:py-4 bg-primary text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-105 transition-all flex items-center gap-3 disabled:opacity-50"
                  >
                    {isSaving ? (
                      <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    ) : (
                      <Save size={18} />
                    )}
                    Salvar Resultado no Histórico
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-20 bg-slate-50 rounded-[40px] border-2 border-dashed border-border">
                <Brain size={60} className="mx-auto text-muted-foreground mb-6" />
        <h3 className="text-xl font-bold text-executive-secondary">Nenhum resultado para exibir</h3>
        <p className="text-executive-secondary mt-2">Complete a autoavaliação para ver sua análise de perfil.</p>
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
                  <div className="bg-white rounded-3xl border border-border p-8 shadow-premium space-y-8">
                    <div className="space-y-2">
                      <p className="text-xs font-black text-muted-foreground uppercase tracking-widest">Aderência Média do Time</p>
                      <div className="flex items-end gap-3">
                        <span className="text-5xl font-display font-black text-primary">{teamMetrics.avgAdherence}%</span>
                        <StatusBadge status={teamMetrics.avgAdherence > 80 ? 'Verde' : teamMetrics.avgAdherence > 60 ? 'Amarelo' : 'Vermelho'} />
                      </div>
                    </div>

                    <div className="space-y-6 pt-6 border-t border-border">
                      <p className="text-xs font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                        <Users size={14} />
                        Participantes ({teamMetrics.totalParticipants})
                      </p>
                      <div className="space-y-3">
                        {teamAssessments.map(ass => (
                          <div key={ass.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-border">
                            <div>
                              <p className="text-xs font-black text-primary">{ass.userName}</p>
                              <p className="text-[10px] text-muted-foreground font-bold">{ass.roleTitle}</p>
                            </div>
                            <span className="text-xs font-black text-secondary">{ass.adherenceScore}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-8 bg-slate-50 rounded-3xl border-2 border-dashed border-border text-center">
          <p className="text-sm text-executive-secondary">Nenhum dado de time disponível ainda.</p>
                  </div>
                )}
              </div>

              <div className="lg:col-span-2 space-y-8">
                {teamMetrics && (
                  <div className="bg-primary rounded-[40px] p-10 text-white space-y-12 shadow-xl shadow-primary/20">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-2xl font-display font-black">Sinergia Comportamental do Time</h3>
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
                          <span className="text-xs font-black uppercase tracking-widest">Fortaleza Coletiva</span>
                        </div>
                        <p className="text-sm leading-relaxed text-white/80">
                          {teamMetrics.actual.D > teamMetrics.actual.I ? 
                            "O time possui uma forte orientação para resultados e assertividade na execução tática." : 
                            "O time demonstra alta capacidade de influência, comunicação e engajamento interno."}
                        </p>
                      </div>
                      <div className="p-6 bg-white/5 rounded-3xl space-y-3">
                        <div className="flex items-center gap-2 text-amber-400">
                          <AlertCircle size={16} />
                          <span className="text-xs font-black uppercase tracking-widest">Ponto de Atenção</span>
                        </div>
                        <p className="text-sm leading-relaxed text-white/80">
                          {Math.abs(teamMetrics.actual.C - teamMetrics.ideal.C) > 15 ? 
                            "Há um desalinhamento significativo na precisão e conformidade técnica esperada para a estrutura atual." : 
                            "O equilíbrio de estabilidade indica um bom ritmo, mas cuidado com a resistência a mudanças rápidas."}
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
       <ExecutiveSummarySection 
         status={{ label: 'Liderança Mapeada', variant: 'success' }}
         question="Como está o alinhamento de competências e governança da liderança?"
         opinion="O perfil comportamental do time aponta excelente equilíbrio entre estabilidade corporativa e governança."
         driver="Perfis comportamentais DISC/Eneagrama, dilemas de gestão e alinhamento de liderança."
         implication="Alta assertividade na execução de políticas corporativas e baixo turnover em cargos chave."
         action="Acompanhar pontos de atenção relativos a desalinhamentos em processos de mudança organizacional."
       >
         <ExecutiveStrategicTensions tensions={[]} />
         <ExecutiveDecisionTrace trace={[]} />
       </ExecutiveSummarySection>
      </ExecutiveAccordion>
    </ExecutivePageTemplate>
  );
}
