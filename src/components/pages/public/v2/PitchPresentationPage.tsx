import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, Variants } from 'motion/react';
import { 
  Database, BarChart3, Target,
  ArrowRight, Brain, Cpu, ShieldCheck, 
  Network, ChevronLeft, ChevronRight,
  BriefcaseBusiness, Users, HelpCircle,
  Lightbulb, Zap, LineChart, AlertTriangle, ArrowDown, Ban,
  CheckCircle2, XCircle
} from 'lucide-react';

const SLIDES = 6;

// --- UTILS & WRAPPERS ---

const ScaleWrapper = ({ children }: { children: React.ReactNode }) => {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const handleResize = () => {
      // Subtract minimal padding so the slide fills more of the screen
      const paddingX = 40; // 20px on each side
      const paddingY = 40; // 20px on top/bottom
      const scaleX = (window.innerWidth - paddingX) / 1920;
      const scaleY = (window.innerHeight - paddingY) / 1080;
      setScale(Math.min(scaleX, scaleY, 1)); // Don't scale up beyond 1
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="flex items-center justify-center w-screen h-screen overflow-hidden bg-zinc-950 font-sans selection:bg-amber-500/30">
      <div 
        style={{ 
          width: 1920, 
          height: 1080, 
          transform: `scale(${scale})`,
          transformOrigin: 'center center'
        }} 
        className="relative bg-[#050507] overflow-hidden text-white shadow-[0_0_100px_rgba(0,0,0,0.8)] border border-white/5 rounded-2xl"
      >
        {children}
      </div>
    </div>
  );
};

// --- ANIMATION VARIANTS ---

const slideVariants: Variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 1920 : -1920,
    opacity: 0,
    scale: 0.95
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
    scale: 1,
    transition: { x: { type: "spring", stiffness: 250, damping: 30 }, opacity: { duration: 0.4 } }
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 1920 : -1920,
    opacity: 0,
    scale: 0.95,
    transition: { x: { type: "spring", stiffness: 250, damping: 30 }, opacity: { duration: 0.4 } }
  })
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } }
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 50 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 200, damping: 24 } }
};

const popIn: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  show: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 200, damping: 20 } }
};

// --- SLIDES ---

const Slide0 = () => (
  <motion.div className="absolute inset-0 flex flex-col items-center justify-center bg-[#020203] p-24 overflow-hidden" variants={staggerContainer} initial="hidden" animate="show" exit="hidden">
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1400px] h-[1400px] bg-red-950/20 rounded-full blur-[150px] pointer-events-none" />
    
    <div className="relative z-10 w-full max-w-[1700px] flex flex-col items-center mt-[-40px]">
      
      {/* Top Headline */}
      <motion.div variants={fadeUp} className="text-center mb-8 max-w-[1400px]">
        <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-red-500/10 border border-red-500/20 mb-8">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span className="text-sm font-bold tracking-[0.2em] text-red-400 uppercase">O Risco Invisível</span>
        </div>
        
        <h2 className="text-[48px] font-light tracking-tight text-slate-300 leading-tight mb-4 whitespace-nowrap">
          O maior risco para a alta administração não é a falta de visão.
        </h2>
        <h2 className="text-[64px] font-bold tracking-tight text-white font-serif italic leading-none">
          É a visão fragmentada da realidade.
        </h2>
      </motion.div>
      
      <motion.p variants={fadeUp} className="text-2xl text-slate-400 font-light text-center mb-16 max-w-4xl">
        Decisões de altíssimo impacto são construídas a partir de recortes isolados do negócio.
      </motion.p>

      {/* The Shattered Constellation */}
      <div className="w-full relative h-[450px] flex items-center justify-center mb-12">
        
        {/* Floating Perspectives */}
        <div className="absolute inset-0 z-0">
          {[
            { label: 'Liquidez', top: '0%', left: '10%', delay: 0 },
            { label: 'Crescimento', top: '5%', left: '75%', delay: 0.1 },
            { label: 'Conformidade', top: '85%', left: '15%', delay: 0.2 },
            { label: 'Pessoas', top: '80%', left: '75%', delay: 0.3 },
            { label: 'Operação', top: '45%', left: '-5%', delay: 0.15 },
            { label: 'Mercado', top: '40%', left: '90%', delay: 0.25 },
            { label: 'Riscos', top: '-10%', left: '45%', delay: 0.35 },
            { label: 'Clientes', top: '100%', left: '50%', delay: 0.05 },
          ].map((item, i) => (
            <motion.div
              key={i}
              className="absolute"
              style={{ top: item.top, left: item.left }}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ 
                opacity: 0.8, 
                scale: 1,
                y: [0, -15, 0],
                x: [0, 10, 0]
              }}
              transition={{ 
                opacity: { duration: 0.8, delay: item.delay },
                scale: { duration: 0.8, delay: item.delay },
                y: { duration: 6, repeat: Infinity, ease: "easeInOut", delay: item.delay * 2 },
                x: { duration: 8, repeat: Infinity, ease: "easeInOut", delay: item.delay * 3 }
              }}
            >
              <div className="px-8 py-4 bg-white/[0.04] border border-white/10 rounded-full text-slate-300 text-xl font-light tracking-widest uppercase backdrop-blur-md shadow-[0_0_30px_rgba(0,0,0,0.8)]">
                {item.label}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Central Question Box */}
        <motion.div variants={popIn} className="relative z-20 max-w-5xl w-full p-12 bg-black/80 border-2 border-red-500/20 backdrop-blur-3xl rounded-[3rem] shadow-[0_0_100px_rgba(220,38,38,0.15)] text-center">
          <p className="text-3xl text-slate-400 font-light mb-6">
            No momento exato de definir o rumo da empresa...
          </p>
          <h3 className="text-[44px] font-bold text-white leading-tight">
            Quem garante que a sua diretoria não está decidindo <br />
            com base em apenas uma <span className="text-red-500 font-serif italic">fração da verdade?</span>
          </h3>
        </motion.div>

      </div>

      {/* Transition Phrase */}
      <motion.div variants={fadeUp} className="max-w-5xl text-center">
        <p className="text-3xl text-slate-400 font-light leading-relaxed">
          Cada líder enxerga uma parte da realidade.<br/>
          <strong className="text-white font-medium">As melhores decisões integram todas as perspectivas.</strong>
        </p>
      </motion.div>

    </div>
  </motion.div>
);

const Slide1 = () => (
  <motion.div className="absolute inset-0 flex items-center justify-center bg-[#020203] p-12" variants={staggerContainer} initial="hidden" animate="show" exit="hidden">
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] bg-amber-500/5 rounded-full blur-[150px] opacity-70" />
    </div>

    <div className="relative z-10 w-full max-w-[1700px] flex flex-col items-center text-center mt-[-20px]">
      
      <motion.div variants={fadeUp} className="mb-10 w-full">
        <h2 className="text-[40px] font-bold tracking-tighter text-white mb-2 whitespace-nowrap">
          Decisões estratégicas não são difíceis porque faltam dados.
        </h2>
        <h2 className="text-[32px] font-light tracking-tight text-amber-500/80 font-serif italic whitespace-nowrap">
          Elas são difíceis porque cada área avalia a decisão sob uma perspectiva diferente.
        </h2>
      </motion.div>

      {/* The Board Meeting Scenario */}
      <div className="w-full max-w-[1500px] relative mb-8 flex flex-col items-center">
        
        {/* Central Question */}
        <motion.div variants={popIn} className="z-20 w-full max-w-2xl text-center mb-8">
          <div className="py-5 px-8 bg-black/90 border border-amber-500/40 rounded-3xl shadow-[0_0_80px_rgba(245,158,11,0.2)] backdrop-blur-2xl inline-block">
            <h3 className="text-xs font-bold text-slate-500 tracking-[0.2em] uppercase mb-2">A Pergunta do CEO</h3>
            <p className="text-3xl text-white font-medium leading-tight">
              "Devemos acelerar nossa expansão?"
            </p>
          </div>
        </motion.div>

        {/* 5 Perspectives Grid - Single Row */}
        <div className="flex flex-row justify-between w-full max-w-[1400px] gap-4">
          {[
            { role: 'CFO', icon: LineChart, msg: '"Financeiramente, temos capacidade."', color: 'text-amber-400', border: 'border-amber-500/30', bg: 'bg-amber-500/10' },
            { role: 'Comercial', icon: Target, msg: '"O mercado responde positivamente."', color: 'text-emerald-400', border: 'border-emerald-500/30', bg: 'bg-emerald-500/10' },
            { role: 'Operações', icon: Zap, msg: '"Nossa estrutura ainda precisa evoluir."', color: 'text-blue-400', border: 'border-blue-500/30', bg: 'bg-blue-500/10' },
            { role: 'Pessoas', icon: Users, msg: '"Não conseguiremos contratar no ritmo necessário."', color: 'text-rose-400', border: 'border-rose-500/30', bg: 'bg-rose-500/10' },
            { role: 'Riscos', icon: AlertTriangle, msg: '"Existem variáveis que precisam ser consideradas."', color: 'text-purple-400', border: 'border-purple-500/30', bg: 'bg-purple-500/10' }
          ].map((item, i) => (
            <motion.div variants={popIn} key={i} className={`flex-1 p-5 rounded-3xl border ${item.border} bg-white/[0.02] backdrop-blur-md flex flex-col items-center text-center relative overflow-hidden group`}>
              <div className={`absolute top-0 right-0 w-20 h-20 ${item.bg} rounded-full blur-[40px] opacity-50 group-hover:opacity-100 transition-opacity`} />
              <div className={`w-10 h-10 rounded-xl ${item.bg} flex items-center justify-center mb-4 relative z-10`}>
                <item.icon className={`w-5 h-5 ${item.color}`} />
              </div>
              <div className="relative z-10">
                <span className={`text-sm font-bold ${item.color} tracking-widest uppercase block mb-2`}>{item.role}</span>
                <p className="text-lg text-slate-300 font-light italic leading-snug">{item.msg}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <motion.div variants={fadeUp} className="max-w-[1000px] w-full bg-red-950/20 border border-red-500/30 rounded-[2rem] p-5 backdrop-blur-md text-center mt-2">
          <p className="text-lg text-slate-300 font-light leading-relaxed">
            Todos estão certos.<br/>
            <strong className="text-white font-medium text-2xl mt-1 block">Mas quem integra todas essas perspectivas antes da decisão?</strong>
          </p>
      </motion.div>

    </div>
  </motion.div>
);

const Slide2 = () => (
  <motion.div className="absolute inset-0 flex flex-col items-center justify-center bg-[#020203] p-24" variants={staggerContainer} initial="hidden" animate="show" exit="hidden">
    
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/10 via-[#020203] to-[#020203]" />

    <div className="relative z-10 w-full max-w-[1600px] text-center mb-16 mt-[-40px]">
      <motion.h2 variants={fadeUp} className="text-[48px] font-bold tracking-tighter text-white leading-tight">
        Toda empresa possui sistemas para <span className="text-slate-500">operar</span>.<br/>
        Poucas possuem uma arquitetura para <span className="text-amber-500">decidir</span>.
      </motion.h2>
    </div>

    <div className="relative z-10 w-full max-w-[1200px] flex flex-col items-center gap-10">
      
      {/* Top: Operation Architecture */}
      <motion.div variants={fadeUp} className="w-full grid grid-cols-3 gap-6">
        {['ERP', 'CRM', 'Sistemas Operacionais'].map((sys, i) => (
          <div key={i} className="py-5 bg-slate-800/30 border border-slate-700/50 rounded-2xl text-xl text-slate-400 font-medium text-center shadow-lg">
            {sys}
          </div>
        ))}
      </motion.div>

      {/* Middle: The GAP -> Filled by Illumine */}
      <motion.div variants={popIn} className="w-full relative h-[320px] flex items-center justify-center">
        
        {/* Background Void (Fades out or stays behind) */}
        <div className="absolute inset-0 border-2 border-dashed border-red-500/20 rounded-[3rem] bg-red-900/5 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold text-red-500/30 tracking-[0.3em] uppercase">Decision Architecture Gap™</span>
        </div>

        {/* Illumine filling the gap */}
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 1.5, type: 'spring', stiffness: 100 }}
          className="absolute inset-[0px] bg-gradient-to-r from-amber-400 via-amber-600 to-amber-400 rounded-[3rem] p-[2px] shadow-[0_0_100px_-20px_rgba(245,158,11,0.5)] z-20"
        >
          <div className="w-full h-full bg-[#050505] rounded-[2.9rem] flex flex-col items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
            <div className="relative z-10 flex flex-col items-center">
              <div className="flex items-center gap-6 mb-6">
                <div className="w-20 h-20"><img src="/logo.png" alt="Illumine" className="w-full h-full object-contain filter drop-shadow-[0_0_20px_rgba(245,158,11,0.6)]" /></div>
                <h3 className="text-6xl font-bold tracking-widest text-white">ILLUMINE</h3>
              </div>
              <p className="text-2xl text-amber-500 font-bold tracking-[0.2em] uppercase">Enterprise Decision Architecture™</p>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Bottom: Decision Makers */}
      <motion.div variants={fadeUp} className="flex gap-8">
        <div className="px-12 py-5 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-2xl text-white font-bold shadow-[0_0_30px_-10px_rgba(245,158,11,0.2)]">Conselho de Administração</div>
        <div className="px-12 py-5 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-2xl text-white font-bold shadow-[0_0_30px_-10px_rgba(245,158,11,0.2)]">CEO & Diretoria</div>
      </motion.div>

    </div>
  </motion.div>
);

const Slide3 = ({ view }: { view: 'empresas' | 'advisors' }) => {


  const content = {
    empresas: {
      title: "Para quem decide",
      antes: [
        'Cada líder decide a partir de uma perspectiva parcial.',
        'O contexto estratégico precisa ser reconstruído a cada decisão importante.',
        'Riscos e oportunidades sistêmicas são percebidos tarde demais.'
      ],
      depois: [
        'Inteligência institucional compartilhada entre Conselho e Diretoria.',
        'Capacidade de analisar cenários antes de comprometer capital e recursos.',
        'Maior confiança, velocidade e consistência nas decisões estratégicas.'
      ]
    },
    advisors: {
      title: "Para quem orienta",
      antes: [
        'Horas não faturáveis reconstruindo o contexto de cada cliente.',
        'Dificuldade de manter consistência estratégica em uma carteira maior.',
        'Recomendações baseadas em fotografias periódicas e retroativas.'
      ],
      depois: [
        'Entrada imediata no contexto estratégico contínuo do cliente.',
        'Capacidade de atender mais organizações mantendo a profundidade.',
        'Conhecimento estratégico preservado e evoluindo continuamente.'
      ]
    }
  };

  return (
    <motion.div className="absolute inset-0 flex items-center justify-center bg-[#020203] p-12" variants={staggerContainer} initial="hidden" animate="show" exit="hidden">
      <div className="relative z-10 w-full max-w-[1700px] mt-[-20px]">
        
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div variants={fadeUp} className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-4">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-sm font-bold tracking-[0.2em] text-emerald-400 uppercase">A Transformação</span>
          </motion.div>
          <motion.h2 variants={fadeUp} className="text-[44px] font-bold tracking-tighter text-white mb-2">
            A Illumine fortalece quem decide e quem orienta decisões.
          </motion.h2>
          <motion.p variants={fadeUp} className="text-xl text-slate-400 font-light">
            A mesma inteligência institucional. Duas formas de gerar valor.
          </motion.p>
        </div>

        {/* View Toggle */}
        <motion.div variants={fadeUp} className="flex justify-center mb-10">
          <div className="flex bg-white/5 border border-white/10 p-1.5 rounded-full backdrop-blur-md">
            <button
              className={`px-10 py-3 rounded-full text-lg font-bold transition-all cursor-default ${view === 'empresas' ? 'bg-white text-black shadow-lg' : 'text-slate-400 opacity-50'}`}
            >
              {content.empresas.title}
            </button>
            <button
              className={`px-10 py-3 rounded-full text-lg font-bold transition-all cursor-default ${view === 'advisors' ? 'bg-amber-500 text-black shadow-[0_0_20px_rgba(245,158,11,0.4)]' : 'text-slate-400 opacity-50'}`}
            >
              {content.advisors.title}
            </button>
          </div>
        </motion.div>

        {/* Content Comparison */}
        <div className="grid grid-cols-2 gap-10">
          
          {/* Antes */}
          <motion.div 
            key={`antes-${view}`}
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}
            className="p-12 bg-white/[0.02] border border-white/5 rounded-[2.5rem] relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-red-500/5 to-transparent" />
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center">
                  <XCircle className="w-5 h-5 text-red-400" />
                </div>
                <h3 className="text-3xl font-light text-slate-300">Como é <strong className="text-white font-bold">Hoje</strong></h3>
              </div>
              <ul className="space-y-6">
                {content[view].antes.map((text, i) => (
                  <li key={i} className="flex gap-5 items-start">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500/50 shrink-0 mt-2.5" />
                    <p className="text-[22px] text-slate-400 font-light leading-relaxed">{text}</p>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* Com Illumine */}
          <motion.div 
            key={`depois-${view}`}
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}
            className="p-12 bg-gradient-to-br from-amber-500/10 to-blue-500/5 border border-amber-500/30 rounded-[2.5rem] relative overflow-hidden shadow-[0_0_50px_-10px_rgba(245,158,11,0.15)]"
          >
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-amber-500/10 rounded-full blur-[80px]" />
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-amber-400" />
                </div>
                <h3 className="text-3xl font-light text-slate-300">Com a <strong className="text-white font-bold">Illumine</strong></h3>
              </div>
              <ul className="space-y-6">
                {content[view].depois.map((text, i) => (
                  <li key={i} className="flex gap-5 items-start">
                    <div className="w-2 h-2 rounded-full bg-amber-500 shrink-0 mt-2.5" />
                    <p className="text-[22px] text-white font-medium leading-relaxed">{text}</p>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

        </div>
      </div>
    </motion.div>
  );
};

const Slide4 = () => (
  <motion.div className="absolute inset-0 flex items-center justify-center bg-[#000000] overflow-hidden p-8" variants={staggerContainer} initial="hidden" animate="show" exit="hidden">
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1500px] h-[1000px] bg-gradient-to-b from-amber-500/10 to-transparent blur-[120px] pointer-events-none" />
    
    <div className="relative z-10 w-full max-w-[1700px] flex flex-col items-center justify-center text-center">
      
      <motion.div variants={fadeUp} className="mb-10 max-w-6xl">
        <h2 className="text-[44px] font-light text-slate-300 leading-tight">
          As organizações que <strong className="text-white font-bold">liderarão o futuro</strong> não serão reconhecidas pelos sistemas que utilizam.
        </h2>
      </motion.div>
      
      <motion.div variants={fadeUp} className="mb-12 max-w-6xl">
        <h3 className="text-[56px] font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-amber-600 font-serif italic leading-tight">
          Serão reconhecidas pela qualidade das decisões que conseguem tomar.
        </h3>
      </motion.div>

      <motion.div variants={popIn} className="w-20 h-20 mb-4 relative">
        <div className="absolute inset-0 bg-amber-500/20 blur-[50px] rounded-full" />
        <img src="/logo.png" alt="Illumine" className="w-full h-full object-contain relative z-10 opacity-90" />
      </motion.div>
      
      <motion.h2 variants={fadeUp} className="text-[32px] font-bold tracking-widest text-white mb-2">
        ILLUMINE
      </motion.h2>
      
      <motion.p variants={fadeUp} className="text-sm text-slate-500 font-medium tracking-[0.2em] uppercase mb-10">
        Executive Governance Platform™
                      </motion.p>

      <motion.div variants={fadeUp} className="mt-4 flex items-center gap-10 p-8 pr-16 bg-white/[0.03] border border-amber-500/20 rounded-[2.5rem] backdrop-blur-md hover:bg-white/[0.05] transition-colors cursor-default">
        <div className="p-4 bg-white rounded-3xl shadow-[0_0_50px_rgba(245,158,11,0.3)]">
          {/* Gerador público gratuito de QR Code apontando para a Illumine */}
          <img 
            src="https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=https://illuminegovernance.com&color=000000&bgcolor=ffffff" 
            alt="QR Code Illumine" 
            className="w-[160px] h-[160px]" 
          />
        </div>
        <div className="text-left flex flex-col justify-center">
          <span className="text-slate-400 font-light text-2xl mb-2">Explore a plataforma</span>
          <span className="text-white font-bold text-4xl mb-4 tracking-tight">illuminegovernance.com</span>
          <span className="text-amber-500 font-bold text-lg tracking-[0.2em] uppercase flex items-center gap-3">
            Agendar Executive Demo <ArrowRight className="w-6 h-6" />
          </span>
        </div>
      </motion.div>

    </div>
  </motion.div>
);

// --- MAIN CONTROLLER ---

export function PitchPresentationPage() {
  const [[page, direction], setPage] = useState([0, 0]);

  const paginate = (newDirection: number) => {
    const newPage = page + newDirection;
    if (newPage >= 0 && newPage < SLIDES) {
      setPage([newPage, newDirection]);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'ArrowDown') {
        paginate(1);
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        paginate(-1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [page]);

  const slides = [<Slide0 key="0" />, <Slide1 key="1" />, <Slide2 key="2" />, <Slide3 key="3a" view="empresas" />, <Slide3 key="3b" view="advisors" />, <Slide4 key="4" />];

  return (
    <ScaleWrapper>
      {/* Slide Container */}
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={page}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          className="absolute inset-0"
        >
          {slides[page]}
        </motion.div>
      </AnimatePresence>

      {/* Floating Navigation Controls */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-6">
        <button 
          onClick={() => paginate(-1)}
          disabled={page === 0}
          className="text-white/30 hover:text-white disabled:opacity-10 transition-all hover:-translate-x-1"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        
        <div className="flex gap-3">
          {Array.from({ length: SLIDES }).map((_, i) => (
            <button 
              key={i} 
              onClick={() => {
                if(i !== page) setPage([i, i > page ? 1 : -1])
              }}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                i === page 
                  ? 'bg-amber-500 w-8 shadow-[0_0_10px_rgba(245,158,11,0.4)]' 
                  : 'bg-white/20 w-1.5 hover:bg-white/40 hover:w-3'
              }`} 
            />
          ))}
        </div>
        
        <button 
          onClick={() => paginate(1)}
          disabled={page === SLIDES - 1}
          className="text-white/30 hover:text-white disabled:opacity-10 transition-all hover:translate-x-1"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Progress Bar Top */}
      <div className="absolute top-0 left-0 h-[6px] bg-white/5 w-full z-50">
        <div 
          className="h-full bg-gradient-to-r from-amber-600 via-amber-400 to-amber-600 transition-all duration-700 ease-out shadow-[0_0_20px_rgba(245,158,11,0.8)]" 
          style={{ width: `${((page + 1) / SLIDES) * 100}%` }}
        />
      </div>
    </ScaleWrapper>
  );
}
