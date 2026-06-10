import React, { useEffect } from 'react';
import { 
  Target, Activity, Layers, Briefcase, CheckCircle2, 
  BarChart3, Users, Sparkles, Ban, DollarSign, ArrowRight
} from 'lucide-react';
import { useDocumentTitle } from '../../../hooks/useDocumentTitle';
import { useNavigate } from 'react-router-dom';

// Editorial Causal Mesh backdrop (Static & Extremely Understated)
const CausalTopologyVisual = () => {
  const nodes = [
    { id: 1, x: 120, y: 150, label: 'Capital de Giro' },
    { id: 2, x: 380, y: 110, label: 'Pressão de Caixa' },
    { id: 3, x: 260, y: 280, label: 'Estrutura Fiduciária' },
    { id: 4, x: 550, y: 220, label: 'Alinhamento Missional' },
    { id: 5, x: 720, y: 120, label: 'Continuidade Institucional' },
    { id: 6, x: 440, y: 350, label: 'Elasticidade Operacional' },
    { id: 7, x: 740, y: 300, label: 'Sucessão & Legado' }
  ];

  const links = [
    { from: 1, to: 2 },
    { from: 1, to: 3 },
    { from: 2, to: 4 },
    { from: 3, to: 6 },
    { from: 4, to: 5 },
    { from: 6, to: 7 },
    { from: 4, to: 6 },
    { from: 2, to: 3 },
    { from: 5, to: 7 }
  ];

  return (
    <div className="absolute inset-0 pointer-events-none opacity-[0.05] overflow-hidden flex items-center justify-center">
      <svg className="w-full h-full max-w-[1200px] max-h-[600px] text-white" viewBox="0 0 900 480" fill="none" xmlns="http://www.w3.org/2000/svg">
        {links.map((link, i) => {
          const fromNode = nodes.find(n => n.id === link.from);
          const toNode = nodes.find(n => n.id === link.to);
          if (!fromNode || !toNode) return null;

          return (
            <line 
              key={i}
              x1={fromNode.x} 
              y1={fromNode.y} 
              x2={toNode.x} 
              y2={toNode.y} 
              stroke="rgba(255, 255, 255, 0.3)" 
              strokeWidth="0.5"
            />
          );
        })}

        {nodes.map((node) => (
          <g key={node.id}>
            <circle cx={node.x} cy={node.y} r="2.5" fill="#FF8552" />
            <text
              x={node.x}
              y={node.y + 18}
              textAnchor="middle"
              fill="rgba(255, 255, 255, 0.5)"
              fontSize="8"
              letterSpacing="0.1em"
              className="font-sans font-medium uppercase select-none"
            >
              {node.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
};

export function ReferralProgramPage() {
  const navigate = useNavigate();
  useDocumentTitle('Programa de Parceiros de Indicação | Illumine');

  useEffect(() => {
    window.scrollTo(0, 0);
    document.documentElement.classList.add('dark');
    const originalHtmlBg = document.documentElement.style.backgroundColor;
    const originalBodyBg = document.body.style.backgroundColor;
    document.documentElement.style.backgroundColor = '#03080F';
    document.body.style.backgroundColor = '#03080F';

    return () => {
      document.documentElement.classList.remove('dark');
      document.documentElement.style.backgroundColor = originalHtmlBg;
      document.body.style.backgroundColor = originalBodyBg;
    };
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleWhatsApp = () => {
    window.open('https://wa.me/554131514537?text=Ol%C3%A1%21%20Gostaria%20de%20me%20tornar%20um%20Parceiro%20de%20Indica%C3%A7%C3%A3o%20Illumine%20Governance%E2%84%A2.', '_blank');
  };

  return (
    <main className="min-h-screen bg-[#03080F] text-white relative overflow-x-hidden font-sans selection:bg-secondary/20 selection:text-secondary antialiased">
      
      {/* Background Ambient Lights - Softer, larger spread for premium feel */}
      <div className="fixed top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-secondary/3 blur-[200px] pointer-events-none z-0" />
      <div className="fixed bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-white/[0.015] blur-[200px] pointer-events-none z-0" />

      {/* Navbar Minimalist & Premium */}
      <nav className="fixed top-0 inset-x-0 h-24 z-50 border-b border-white/5 backdrop-blur-xl bg-[#03080F]/60 transition-all duration-500">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 h-full flex items-center justify-between gap-8">
          
          {/* Logo Signature */}
          <div className="flex items-center gap-0 cursor-pointer group opacity-90 hover:opacity-100 transition-opacity" onClick={() => navigate('/')}>
            <div className="w-[44px] h-[44px] flex items-center justify-center relative -translate-y-[2px]">
              <img src="/logo.png" alt="Illumine Icon" className="relative z-10 w-full h-full object-contain" />
            </div>
            <div className="flex flex-col items-start w-fit">
              <span 
                className="text-[34px] tracking-[-0.06em] text-white leading-[0.8] block" 
                style={{ fontFamily: '"Tilt Warp", sans-serif' }}
              >
                illumine
              </span>
              <div 
                className="flex justify-between w-full text-[6.5px] text-white uppercase mt-[2px] whitespace-nowrap font-semibold" 
                style={{ fontFamily: '"Work Sans", sans-serif', paddingLeft: '2px', paddingRight: '0.5px' }}
              >
                {"Governance".split('').map((char, i) => (
                  <span key={i}>{char === ' ' ? '\u00A0' : char}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Nav Links - Removed bulky buttons, using clean text links */}
          <div className="hidden lg:flex items-center gap-12">
            <button onClick={() => scrollToSection('objetivo')} className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 hover:text-white transition-colors cursor-pointer">
              Programa
            </button>
            <button onClick={() => scrollToSection('remuneracao')} className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 hover:text-white transition-colors cursor-pointer">
              Remuneração
            </button>
            <button onClick={() => scrollToSection('regras')} className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 hover:text-white transition-colors cursor-pointer">
              Critérios
            </button>
          </div>

          <div className="flex items-center gap-8">
            <button onClick={handleWhatsApp} className="hidden sm:flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 hover:text-white transition-colors">
              Fale Conosco
            </button>
            <button 
              onClick={handleWhatsApp} 
              className="px-6 h-11 rounded-full bg-white text-[#03080F] font-bold text-[10px] uppercase tracking-[0.2em] hover:bg-white/90 hover:scale-105 transition-all duration-300 cursor-pointer flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.05)]"
            >
              Seja Parceiro
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-48 pb-32 px-6 relative overflow-hidden z-10 border-b border-white/[0.03]">
        <CausalTopologyVisual />
        <div className="max-w-4xl mx-auto text-center space-y-10 relative z-10">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/5 text-white/80 text-[10px] font-medium uppercase tracking-[0.2em] backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-secondary shadow-[0_0_8px_rgba(255,133,82,0.8)] animate-pulse" />
            Illumine Governance™
          </span>
          <h1 className="text-5xl md:text-7xl font-display font-medium tracking-tight text-white leading-[1.05] text-primary">
            Programa de Parceiros<br/><span className="text-white/40 italic">de Indicação</span>
          </h1>
          <p className="text-lg md:text-xl text-white/50 font-sans leading-relaxed max-w-2xl mx-auto font-light">
            Política de Comissionamento transparente para profissionais que constroem oportunidades estratégicas e crescimento sustentável junto à Illumine.
          </p>
        </div>
      </section>

      {/* Main Content - Increased spacing to space-y-32 for better rhythm */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 relative z-10 space-y-32 pt-28 pb-32">
        
        {/* Objetivo & Quem Pode Ser Parceiro */}
        <div id="objetivo" className="grid lg:grid-cols-2 gap-8">
          {/* Objetivo */}
          <div className="p-12 bg-gradient-to-br from-[#060D17] to-[#03080F] border border-white/5 rounded-3xl hover:border-white/10 transition-colors group">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-10 h-10 rounded-full bg-secondary/5 flex items-center justify-center border border-secondary/10 group-hover:bg-secondary/10 transition-colors">
                <Target className="w-5 h-5 text-secondary" strokeWidth={1.5} />
              </div>
              <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-white/70">Objetivo</h2>
            </div>
            <div className="space-y-6">
              <p className="text-[15px] text-white/60 leading-relaxed font-sans font-light">
                O Programa de Parceiros de Indicação tem como objetivo reconhecer e remunerar profissionais e organizações que contribuam para a geração de novas oportunidades comerciais para a plataforma e serviços associados.
              </p>
              <p className="text-[15px] text-white/60 leading-relaxed font-sans font-light border-l-2 border-white/10 pl-5">
                O parceiro atua exclusivamente como agente de relacionamento e indicação, <span className="text-white/90 font-medium">não participando</span> da implantação, operação, suporte ou execução dos serviços.
              </p>
            </div>
          </div>

          {/* Quem Pode Ser */}
          <div className="p-12 bg-gradient-to-br from-[#060D17] to-[#03080F] border border-white/5 rounded-3xl hover:border-white/10 transition-colors group">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-10 h-10 rounded-full bg-secondary/5 flex items-center justify-center border border-secondary/10 group-hover:bg-secondary/10 transition-colors">
                <Users className="w-5 h-5 text-secondary" strokeWidth={1.5} />
              </div>
              <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-white/70">Quem Pode Ser Parceiro</h2>
            </div>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-5 gap-x-6 text-[15px] text-white/60 font-sans font-light">
              {[
                'Consultores', 'Contadores', 'Advogados', 'Conselheiros', 
                'Mentores', 'Empresários', 'Organizações parceiras', 'Líderes de mercado'
              ].map((item, idx) => (
                <li key={idx} className="flex items-center gap-4 group/li">
                  <span className="w-1.5 h-1.5 rounded-full bg-white/10 group-hover/li:bg-secondary/70 transition-colors shrink-0" />
                  <span className="leading-tight group-hover/li:text-white/90 transition-colors">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Como Funciona */}
        <div className="p-12 md:p-16 bg-gradient-to-br from-[#060D17] to-[#040911] border border-white/5 rounded-[2.5rem] relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-secondary/[0.015] rounded-full blur-[100px] pointer-events-none" />
          
          <div className="text-center mb-16 relative z-10">
            <h2 className="text-3xl md:text-5xl font-display font-medium text-white mb-4">Como Funciona</h2>
            <p className="text-[15px] text-white/40 font-sans italic font-light">Seu papel é conectar oportunidades. O resto é com a gente.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 relative z-10">
            {[
              { step: 1, text: 'Identifica uma oportunidade na sua rede.' },
              { step: 2, text: 'Realiza a indicação formal para a Illumine.' },
              { step: 3, text: 'A Illumine conduz diagnóstico e comercial.' },
              { step: 4, text: 'O cliente contrata os serviços.' },
              { step: 5, text: 'Você recebe sua remuneração mensal.' }
            ].map((s) => (
              <div key={s.step} className="bg-[#03080F]/50 border border-white/[0.03] hover:border-white/10 hover:-translate-y-1 transition-all duration-300 rounded-2xl p-6 flex flex-col items-center text-center gap-5">
                <span className="w-10 h-10 rounded-full bg-secondary/5 border border-secondary/10 text-secondary text-[14px] font-mono flex items-center justify-center font-bold shadow-[0_0_15px_rgba(255,133,82,0.05)]">{s.step}</span>
                <p className="text-[14px] text-white/60 font-sans leading-relaxed font-light">{s.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Por que indicar */}
        <div className="p-12 md:p-16 bg-[#040911]/80 border border-white/5 rounded-[2.5rem] relative overflow-hidden">
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-white/[0.01] rounded-full blur-[120px] pointer-events-none" />
          
          <div className="max-w-4xl mx-auto space-y-12 relative z-10 text-center md:text-left">
            <h2 className="text-3xl md:text-5xl font-display font-medium text-white">Por que indicar a Illumine?</h2>
            
            <div className="space-y-8 text-[16px] md:text-[18px] text-white/60 font-sans leading-relaxed font-light border-l-2 border-secondary/20 pl-8">
              <p>Muitos empresários possuem acesso a informações. <span className="text-white/90 font-medium italic block mt-2">Poucos possuem clareza para transformá-las em decisões estratégicas.</span></p>
              <p>Ao indicar a Illumine Governance™, você não está apenas apresentando uma plataforma. Está conectando seus clientes a uma estrutura de inteligência institucional capaz de fortalecer sua gestão, governança e capacidade de crescimento sustentável.</p>
            </div>

            <div className="pt-6 border-t border-white/5">
              <p className="text-[11px] font-mono uppercase tracking-[0.15em] text-white/40 mb-8 font-bold text-center md:text-left">O que você entrega ao cliente:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-6 gap-x-10">
                {[
                  'Melhoria na governança', 'Organização de indicadores',
                  'Tomada de decisão baseada em dados', 'Preparação para sucessão',
                  'Inteligência institucional', 'Crescimento mais saudável'
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4 text-[14px] text-white/70 font-light group">
                    <CheckCircle2 size={16} strokeWidth={1.5} className="text-secondary/50 group-hover:text-secondary transition-colors shrink-0" />
                    <span className="group-hover:text-white transition-colors">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Remuneração */}
        <div id="remuneracao" className="space-y-16">
          <div className="text-center">
            <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-secondary block mb-4">Modelo Comercial</span>
            <h2 className="text-4xl md:text-5xl font-display font-medium text-white">Estrutura de Remuneração</h2>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="p-12 md:p-14 bg-gradient-to-b from-[#040911] to-[#03080F] border border-white/5 rounded-[2.5rem] relative overflow-hidden group hover:border-white/10 transition-all duration-500">
              <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover:opacity-[0.04] group-hover:scale-110 transition-all duration-700">
                <DollarSign className="w-48 h-48" strokeWidth={1} />
              </div>
              
              <div className="relative z-10 flex flex-col h-full">
                <h3 className="text-[11px] font-mono uppercase tracking-[0.2em] font-bold text-white/50 mb-12">Comissão de Ativação</h3>
                
                <div className="mb-12">
                  <span className="text-8xl font-display font-medium text-white tracking-tight">10%</span>
                  <span className="block text-[13px] text-white/50 mt-4 font-light">sobre a <strong className="text-white/80 font-normal">Ativação Institucional</strong></span>
                </div>
                
                <p className="text-[15px] text-white/60 leading-relaxed font-sans font-light mb-12 flex-grow">
                  Comissão calculada sobre o valor bruto da Ativação Institucional efetivamente contratada pelo cliente.
                </p>
                
                <div className="pt-8 border-t border-white/5">
                  <p className="text-[10px] uppercase tracking-[0.15em] text-white/30 mb-6 font-bold font-mono">Regras de Apuração:</p>
                  <ul className="space-y-4 text-[14px] text-white/60 font-sans font-light">
                    {['Assinatura do contrato', 'Emissão da Nota Fiscal', 'Recebimento integral'].map((req, i) => (
                      <li key={i} className="flex items-center gap-4"><CheckCircle2 size={16} strokeWidth={1.5} className="text-secondary/60" /> {req}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="p-12 md:p-14 bg-gradient-to-b from-[#040911] to-[#03080F] border border-white/5 rounded-[2.5rem] relative overflow-hidden group hover:border-white/10 transition-all duration-500">
              <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover:opacity-[0.04] group-hover:scale-110 transition-all duration-700">
                <Activity className="w-48 h-48" strokeWidth={1} />
              </div>
              
              <div className="relative z-10 flex flex-col h-full">
                <h3 className="text-[11px] font-mono uppercase tracking-[0.2em] font-bold text-white/50 mb-12">Comissão Recorrente</h3>
                
                <div className="mb-12">
                  <span className="text-8xl font-display font-medium text-white tracking-tight">3%</span>
                  <span className="block text-[13px] text-white/50 mt-4 font-light">sobre <strong className="text-white/80 font-normal">mensalidades totais</strong></span>
                </div>
                
                <p className="text-[15px] text-white/60 leading-relaxed font-sans font-light mb-12 flex-grow">
                  Comissão contínua sobre o valor bruto das mensalidades recorrentes contratadas pelo cliente.
                </p>
                
                <div className="pt-8 border-t border-white/5">
                  <p className="text-[10px] uppercase tracking-[0.15em] text-white/30 mb-6 font-bold font-mono">Base de Cálculo:</p>
                  <ul className="space-y-4 text-[14px] text-white/60 font-sans font-light mb-6">
                    <li className="flex items-center gap-4"><Layers size={16} strokeWidth={1.5} className="text-secondary/60" /> Plataforma Illumine Governance™</li>
                    <li className="flex items-center gap-4"><Briefcase size={16} strokeWidth={1.5} className="text-secondary/60" /> Advisory Governance™</li>
                  </ul>
                  <p className="text-[12px] text-white/40 font-sans italic pt-2">
                    Devida enquanto o cliente permanecer ativo e adimplente.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Exemplos de Potencial de Ganhos */}
        <div className="space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-display font-medium text-white">Potencial de Ganhos</h2>
            <p className="text-[14px] text-white/40 font-sans font-light italic">Cenário ilustrativo: Clientes do plano Growth.</p>
          </div>
          
          <div className="max-w-3xl mx-auto bg-[#040911]/80 border border-white/5 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-md">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 bg-white/[0.02]">
                  <th className="p-8 text-[10px] font-mono uppercase tracking-[0.2em] text-white/40 font-bold">Volume de Indicações</th>
                  <th className="p-8 text-[10px] font-mono uppercase tracking-[0.2em] text-white/40 font-bold text-right">Receita Anual Estimada</th>
                </tr>
              </thead>
              <tbody className="text-[16px] text-white/70 font-sans font-light">
                {[
                  { clients: '1 Cliente Ativo', revenue: 'R$ 2.940' },
                  { clients: '3 Clientes Ativos', revenue: 'R$ 8.820' },
                  { clients: '5 Clientes Ativos', revenue: 'R$ 14.700' },
                  { clients: '10 Clientes Ativos', revenue: 'R$ 29.400' },
                ].map((row, i) => (
                  <tr key={i} className="border-b border-white/[0.03] hover:bg-white/[0.03] transition-colors group">
                    <td className="p-8 font-medium group-hover:text-white transition-colors">{row.clients}</td>
                    <td className="p-8 font-mono text-secondary text-right text-2xl group-hover:text-secondary/90 transition-colors">{row.revenue}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Exemplo Prático Detalhado */}
        <div className="relative p-12 md:p-16 bg-gradient-to-br from-[#060D17] to-[#040911] border border-white/5 rounded-[3rem] overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-secondary/[0.015] rounded-full blur-[120px] pointer-events-none translate-x-1/3 -translate-y-1/3" />
          
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-16 gap-6 relative z-10 border-b border-white/5 pb-8">
            <div className="flex items-center gap-5">
              <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center border border-secondary/20">
                <BarChart3 className="w-5 h-5 text-secondary" strokeWidth={1.5} />
              </div>
              <div>
                <h2 className="text-2xl font-display font-medium text-white">O cálculo na prática</h2>
                <p className="text-[13px] text-white/40 font-sans font-light mt-1">Como a composição de comissões funciona na vida real.</p>
              </div>
            </div>
            <div className="px-5 py-2 rounded-full bg-white/5 border border-white/10 text-[11px] font-mono font-bold uppercase tracking-widest text-white/60">
              Cenário: <span className="text-white">Plano Growth</span>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 relative z-10">
            {/* Esquerda: Contratação */}
            <div>
              <h4 className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/40 mb-10 font-bold">Valores Contratados pelo Cliente</h4>
              <div className="space-y-6">
                <div className="flex justify-between items-center text-[16px] font-sans font-light bg-white/[0.02] p-5 rounded-xl">
                  <span className="text-white/60">Ativação Inicial:</span>
                  <span className="font-mono text-white/90">R$ 15.000</span>
                </div>
                <div className="flex justify-between items-center text-[16px] font-sans font-light bg-white/[0.02] p-5 rounded-xl">
                  <span className="text-white/60">Plataforma (Mensal):</span>
                  <span className="font-mono text-white/90">R$ 1.500</span>
                </div>
                <div className="flex justify-between items-center text-[16px] font-sans font-light bg-white/[0.02] p-5 rounded-xl">
                  <span className="text-white/60">Advisory (Mensal):</span>
                  <span className="font-mono text-white/90">R$ 2.500</span>
                </div>
                <div className="pt-4 flex justify-between items-center px-5">
                  <span className="text-[12px] uppercase tracking-wider text-white/40 font-bold font-mono">Receita Recorrente Total (Mês):</span>
                  <span className="font-mono text-white text-xl">R$ 4.000</span>
                </div>
              </div>
            </div>

            {/* Direita: Receita do Parceiro */}
            <div>
              <h4 className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/40 mb-10 font-bold">Extrato do Parceiro</h4>
              
              <div className="space-y-8">
                <div className="flex justify-between items-center bg-[#03080F]/50 p-6 rounded-2xl border border-white/5">
                  <div className="space-y-2">
                    <span className="text-[12px] uppercase tracking-wider text-white/60 block font-bold font-mono">Ativação (10%)</span>
                    <span className="text-[12px] text-white/30 block font-sans font-light">De R$ 15.000</span>
                  </div>
                  <span className="font-display text-3xl text-white">R$ 1.500</span>
                </div>
                
                <div className="flex justify-between items-center bg-[#03080F]/50 p-6 rounded-2xl border border-white/5">
                  <div className="space-y-2">
                    <span className="text-[12px] uppercase tracking-wider text-white/60 block font-bold font-mono">Recorrente (3%)</span>
                    <span className="text-[12px] text-white/30 block font-sans font-light">De R$ 4.000 / mês</span>
                  </div>
                  <span className="font-display text-3xl text-white">R$ 120<span className="text-lg text-white/30">/mês</span></span>
                </div>

                <div className="pt-6 space-y-4">
                  <div className="flex justify-between items-center px-4">
                    <span className="text-[15px] text-white/50 font-sans font-light">Projeção Ano 1</span>
                    <span className="font-mono text-white/90 text-xl">R$ 2.940</span>
                  </div>
                  <div className="flex justify-between items-center px-4">
                    <span className="text-[15px] text-white/50 font-sans font-light">Contrato de 3 anos</span>
                    <span className="font-mono text-secondary text-2xl font-bold">R$ 5.820</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Receitas Não Comissionáveis & Regras */}
        <div id="regras" className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 p-10 bg-[#060D17] border border-white/5 rounded-3xl">
            <div className="flex items-center gap-4 mb-8">
              <Ban className="w-5 h-5 text-red-400/50" strokeWidth={1.5} />
              <h2 className="text-[11px] font-mono font-bold uppercase tracking-widest text-white/50">Não Comissionáveis</h2>
            </div>
            <p className="text-[14px] text-white/50 mb-8 font-sans font-light leading-relaxed">
              Serviços consultivos extras (Projetos Estratégicos, Valuation, M&A, Treinamentos) ou qualquer contratação adicional pós-escopo inicial não incidem comissão.
            </p>
          </div>

          <div className="lg:col-span-2 grid sm:grid-cols-2 gap-8">
            <div className="p-10 bg-[#03080F] border border-white/5 rounded-3xl">
              <h3 className="text-[11px] font-mono font-bold uppercase tracking-widest text-white/50 mb-6">Validação</h3>
              <p className="text-[14px] text-white/50 font-sans font-light leading-relaxed">
                A indicação deve ser registrada formalmente antes do envio da proposta. Se o cliente já estiver em negociação ativa com a Illumine, a indicação não será validada.
              </p>
            </div>
            <div className="p-10 bg-[#03080F] border border-white/5 rounded-3xl">
              <h3 className="text-[11px] font-mono font-bold uppercase tracking-widest text-white/50 mb-6">Pagamentos</h3>
              <p className="text-[14px] text-white/50 font-sans font-light leading-relaxed">
                Apuração mensal. Pagamento até o dia 15 do mês subsequente ao recebimento do cliente, condicionado à adimplência e apresentação de NF pelo parceiro.
              </p>
            </div>
          </div>
        </div>

        {/* Caminho de Evolução do Parceiro */}
        <div className="p-16 md:p-20 bg-gradient-to-b from-[#040911] to-[#03080F] border border-white/5 rounded-[3rem] text-center space-y-16 relative overflow-hidden">
          <h2 className="text-3xl md:text-5xl font-display font-medium text-white relative z-10">Caminho de Evolução</h2>
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6 relative z-10">
            <div className="px-8 py-4 bg-white/[0.02] border border-white/10 rounded-2xl text-white/60 text-[14px] font-sans font-light w-full md:w-auto">
              Parceiro de Indicação
            </div>
            <ArrowRight className="w-5 h-5 text-white/20 hidden md:block" strokeWidth={1.5} />
            <div className="w-px h-8 bg-white/10 md:hidden" />
            
            <div className="px-8 py-4 bg-white/[0.02] border border-white/10 rounded-2xl text-white/80 text-[14px] font-sans font-medium w-full md:w-auto">
              Advisor Certificado
            </div>
            <ArrowRight className="w-5 h-5 text-secondary/40 hidden md:block" strokeWidth={1.5} />
            <div className="w-px h-8 bg-white/10 md:hidden" />
            
            <div className="px-10 py-4 bg-secondary/10 border border-secondary/30 rounded-2xl text-secondary text-[14px] font-sans font-bold w-full md:w-auto shadow-[0_0_30px_rgba(255,133,82,0.1)]">
              Strategic Alliance
            </div>
          </div>

          <div className="max-w-2xl mx-auto text-[16px] text-white/50 font-sans font-light leading-relaxed relative z-10">
            <p>A Illumine acredita na construção de relacionamentos de longo prazo. Parceiros que desejarem poderão evoluir para programas de certificação e alianças estratégicas, ampliando seu nível de atuação e geração de valor.</p>
          </div>
        </div>

        {/* Princípios do Programa */}
        <div className="py-24 border-t border-white/5 text-center space-y-16">
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-secondary flex items-center justify-center gap-3">
            <Sparkles size={14} strokeWidth={1.5} />
            Nossa Filosofia
          </span>
          <div className="space-y-10 max-w-5xl mx-auto">
            <p className="text-3xl md:text-5xl font-display font-medium text-white leading-[1.2]">
              Nosso objetivo <span className="text-white/30 line-through decoration-1">não</span> é construir<br/>uma rede de afiliados.
            </p>
            <p className="text-xl md:text-3xl font-display font-medium text-white/60 leading-relaxed italic max-w-4xl mx-auto">
              "Estamos construindo uma comunidade de profissionais comprometidos com a boa governança, a inteligência institucional e o crescimento sustentável."
            </p>
          </div>
        </div>
      </div>

      {/* CTA Final */}
      <div className="py-40 relative z-10 border-t border-white/[0.03] bg-gradient-to-b from-[#02050A] to-[#010204]">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-16">
          <h2 className="text-5xl md:text-7xl font-display font-medium text-white tracking-tight">Vamos construir<br/>valor juntos?</h2>
          <p className="text-xl text-white/50 font-sans max-w-2xl mx-auto leading-relaxed font-light">
            Se você acredita que seus clientes podem se beneficiar de uma visão mais estruturada de gestão, teremos satisfação em recebê-lo em nosso ecossistema.
          </p>
          <div className="pt-4">
            <button
              onClick={handleWhatsApp}
              className="px-12 h-16 rounded-full bg-white text-[#03080F] font-bold text-[12px] uppercase tracking-[0.2em] hover:bg-white/90 hover:scale-105 transition-all duration-300 cursor-pointer shadow-[0_0_40px_rgba(255,255,255,0.15)] flex items-center justify-center gap-4 mx-auto group"
            >
              Quero ser um Parceiro
              <ArrowRight size={18} strokeWidth={2} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* Minimal Footer */}
      <footer className="border-t border-white/5 bg-[#010204] py-12 z-10 relative">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">
            © {new Date().getFullYear()} Illumine Governance™. Todos os direitos reservados.
          </div>
          <div className="flex gap-8">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 hover:text-white/70 cursor-pointer transition-colors">Termos de Uso</span>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 hover:text-white/70 cursor-pointer transition-colors">Privacidade</span>
          </div>
        </div>
      </footer>
      
    </main>
  );
}
