import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDocumentTitle } from '../../../hooks/useDocumentTitle';
import { motion } from 'motion/react';
import { Target, ArrowRight, MessageSquare } from 'lucide-react';
import { Button } from '../../ui/button';

export function DiagnosticoPage() {
  useDocumentTitle('Illumine | Diagnóstico Estratégico');
  const navigate = useNavigate();

  const handleCTAClick = () => {
    window.open(
      `https://wa.me/554131514537?text=${encodeURIComponent('Gostaria de agendar um diagnóstico estratégico')}`,
      '_blank'
    );
  };

  return (
    <main className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden text-foreground">
      <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-secondary/5 blur-[120px] pointer-events-none" />
      
      <button 
        onClick={() => navigate(-1)}
    className="absolute top-6 left-6 text-sm font-bold text-executive-secondary hover:text-foreground flex items-center gap-2 transition-colors z-50"
      >
        <span className="text-xl">&larr;</span> Voltar
      </button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl text-center space-y-8 z-10"
      >
        <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
          <Target className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-primary" style={{ fontFamily: "'Tilt Warp', sans-serif" }}>
          Diagnóstico Estratégico
        </h1>
    <p className="text-lg text-executive-secondary font-medium leading-relaxed">
          O Diagnóstico Estratégico Inicial realiza uma análise aprofundada da estrutura financeira, operacional, organizacional e gerencial da sua empresa para identificar riscos, gargalos, oportunidades e prioridades.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
          <Button onClick={handleCTAClick} className="h-14 px-8 font-bold uppercase tracking-widest text-sm flex gap-2 w-full sm:w-auto">
            <MessageSquare size={18} /> Agendar com Especialista
          </Button>
          <Button variant="outline" onClick={() => navigate('/empresas')} className="h-14 px-8 font-bold uppercase tracking-widest text-sm flex gap-2 w-full sm:w-auto">
            Conhecer Estrutura <ArrowRight size={18} />
          </Button>
        </div>
      </motion.div>
    </main>
  );
}
