import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, X, Rocket, TrendingUp, ShieldCheck, Zap } from 'lucide-react';
import { cn } from '../../lib/utils';

interface WelcomeMessageProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
  userName?: string;
}

const WELCOME_MESSAGES = [
  "\"Sem direcionamento, o povo se perde, mas, quanto mais conselheiros sábios, melhores soluções.\" — Provérbios 11:14 (A Mensagem)",
  "\"Entregue ao Eterno o comando do seu trabalho, e o que você planejou dará certo.\" — Provérbios 16:3 (A Mensagem)",
  "\"Um bom líder detesta todo tipo de injustiça, pois é na justiça que a liderança se fundamenta.\" — Provérbios 16:12 (A Mensagem)",
  "\"A integridade é fazer o que é certo, mesmo quando ninguém está olhando.\" — C.S. Lewis",
  "\"A humildade não é pensar menos de si mesmo, mas pensar menos em si mesmo.\" — C.S. Lewis",
  "\"O trabalho realizado com excelência é a melhor forma de servir ao próximo.\" — Inspirado em Martinho Lutero",
  "\"A fé é dar o primeiro passo mesmo quando você não vê toda a escadaria.\" — Martin Luther King Jr.",
  "\"Faça todo o bem que puder, por todos os meios que puder, de todas as maneiras que puder.\" — John Wesley",
];

export const getRandomWelcomeMessage = () => {
  return WELCOME_MESSAGES[Math.floor(Math.random() * WELCOME_MESSAGES.length)];
};

export function WelcomeMessage({ isOpen, onClose, message, userName }: WelcomeMessageProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-lg bg-white rounded-[32px] shadow-2xl overflow-hidden"
          >
            {/* Top decorative element */}
            <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-primary via-secondary to-primary" />
            
            <div className="p-8 sm:p-10">
              <div className="flex justify-between items-start mb-8">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                  <Sparkles size={28} className="animate-pulse" />
                </div>
                <button
                  onClick={onClose}
                  className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-all"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <h3 className="text-3xl font-black tracking-tight text-primary leading-tight">
                  {userName ? `Olá, ${userName.split(' ')[0]}!` : 'Olá!'}
                </h3>
                <p className="text-lg text-slate-600 leading-relaxed font-medium">
                  {message}
                </p>
              </div>

              <div className="mt-10 grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col gap-2">
                  <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary">
                    <Rocket size={16} />
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Objetivo</p>
                  <p className="text-xs font-bold text-slate-700">Crescimento</p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                    <ShieldCheck size={16} />
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Segurança</p>
                  <p className="text-xs font-bold text-slate-700">Ambiente Protegido</p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="mt-10 w-full h-14 bg-primary text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group"
              >
                Acessar meu Painel
                <Zap size={16} className="group-hover:fill-current" />
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
