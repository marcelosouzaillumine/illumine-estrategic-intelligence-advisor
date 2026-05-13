import React, { useState } from 'react';
import { X, Sparkles, Building2, Loader2, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { generateAICompanyPayload, createAICompanyInFirestore } from '../../services/aiService';

export function GenerateAICompanyModal({ isOpen, onClose, onSuccess }: { isOpen: boolean, onClose: () => void, onSuccess: (clientId?: string) => void }) {
  const [segment, setSegment] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleGenerate = async () => {
    if (!segment.trim()) {
      setError('Por favor, informe um segmento (ex: Clínica Médica, Agência de Marketing, SaaS).');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      setStep('Consultando a IA do Gemini para estruturar a empresa...');
      const payload = await generateAICompanyPayload(segment, description);
      
      setStep(`Injetando dados históricos (${new Date().getFullYear() - 4}-${new Date().getFullYear()}) e DRE...`);
      const newClientId = await createAICompanyInFirestore(payload);
      
      setStep('Concluído!');
      setTimeout(() => {
        setLoading(false);
        setSegment('');
        setDescription('');
        onSuccess(newClientId);
        onClose();
      }, 1000);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Ocorreu um erro ao gerar a empresa. Verifique sua chave de API e conexão.');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white rounded-[32px] shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200"
      >
        <div className="p-8 pb-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center shadow-sm">
              <Sparkles size={20} />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900 tracking-tight">Gerador Inteligente</h3>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Powered by Google Gemini</p>
            </div>
          </div>
          <button onClick={onClose} disabled={loading} className="text-slate-400 hover:text-slate-600 transition-colors p-2 rounded-xl hover:bg-slate-100">
            <X size={20} />
          </button>
        </div>

        <div className="p-8 space-y-6">
          {error && (
            <div className="bg-rose-50 text-rose-600 p-4 rounded-2xl border border-rose-100 flex items-start gap-3">
              <AlertCircle size={18} className="shrink-0 mt-0.5" />
              <div className="text-sm font-medium leading-relaxed">
                {error}
              </div>
            </div>
          )}

          <div className="space-y-3">
            <label className="text-[11px] font-black text-slate-800 uppercase tracking-widest block">Qual o segmento de atuação?</label>
            <p className="text-xs text-slate-500 font-medium">A IA criará um nome, CNPJ, estrutura de DRE/Balanço de 5 anos, premissas de valuation e um relatório estratégico baseado neste setor.</p>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                <Building2 size={18} />
              </div>
              <input 
                type="text" 
                autoFocus
                placeholder="Ex: Rede de Clínicas Odontológicas, Software SaaS, Construtora..."
                value={segment}
                onChange={(e) => setSegment(e.target.value)}
                disabled={loading}
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all placeholder:font-medium placeholder:text-slate-400"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !loading) {
                    handleGenerate();
                  }
                }}
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[11px] font-black text-slate-800 uppercase tracking-widest block">Características & Referências (Opcional)</label>
            <p className="text-xs text-slate-500 font-medium">Descreva detalhes como: desafios atuais, número de funcionários, perfil de clientes ou qualquer particularidade para que a IA gere dados integrados e realistas.</p>
            <textarea 
              placeholder="Ex: Empresa familiar em transição, enfrenta dificuldades no fluxo de caixa, possui 15 funcionários e busca expansão para o Nordeste..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={loading}
              rows={4}
              className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all placeholder:font-medium placeholder:text-slate-400 resize-none"
            />
          </div>

          {loading && (
            <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100 flex flex-col items-center justify-center text-center space-y-4">
              <Loader2 size={32} className="text-indigo-600 animate-spin" />
              <div>
                <p className="text-sm font-black text-indigo-900 tracking-tight">Construindo sua Empresa...</p>
                <p className="text-xs font-bold text-indigo-600/70 mt-1">{step}</p>
              </div>
            </div>
          )}
        </div>

        <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
          <button 
            onClick={onClose}
            disabled={loading}
            className="px-6 py-2.5 text-slate-500 font-bold text-xs uppercase tracking-widest hover:text-slate-700 hover:bg-slate-200/50 rounded-xl transition-all"
          >
            Cancelar
          </button>
          <button 
            onClick={handleGenerate}
            disabled={loading || !segment.trim()}
            className="flex items-center gap-2 px-8 py-2.5 bg-indigo-600 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20 active:scale-95 disabled:opacity-50 disabled:active:scale-100"
          >
            {loading ? 'Gerando...' : 'Gerar com IA'}
            {!loading && <Sparkles size={14} />}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
