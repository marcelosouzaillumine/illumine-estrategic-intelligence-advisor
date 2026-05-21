import React, { useState, useEffect } from 'react';
import { X, Sparkles, Building2, Loader2, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { generateAICompanyPayload, createAICompanyInFirestore } from '../../services/aiService';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

export function GenerateAICompanyModal({ 
  isOpen, 
  onClose, 
  onSuccess,
  initialData
}: { 
  isOpen: boolean, 
  onClose: () => void, 
  onSuccess: (clientId?: string) => void,
  initialData?: {
    segment?: string;
    description?: string;
    axisDescriptions?: {
      governanca: string;
      cultura: string;
      financeiro: string;
      inovacao: string;
      marketing: string;
      comercial: string;
      operacional: string;
    }
  }
}) {
  const [segment, setSegment] = useState(initialData?.segment || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [axisDescriptions, setAxisDescriptions] = useState(initialData?.axisDescriptions || {
    governanca: '',
    cultura: '',
    financeiro: '',
    inovacao: '',
    marketing: '',
    comercial: '',
    operacional: ''
  });
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState('');
  const [error, setError] = useState('');

  // Update state if initialData changes
  useEffect(() => {
    if (initialData) {
      if (initialData.segment) setSegment(initialData.segment);
      if (initialData.description) setDescription(initialData.description);
      if (initialData.axisDescriptions) setAxisDescriptions(initialData.axisDescriptions);
    }
  }, [initialData]);

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
      const payload = await generateAICompanyPayload(segment, description, axisDescriptions);
      
      setStep(`Injetando dados históricos (${new Date().getFullYear() - 4}-${new Date().getFullYear()}) e DRE...`);
      const newClientId = await createAICompanyInFirestore(payload);
      
      setStep('Concluído!');
      setTimeout(() => {
        setLoading(false);
        setSegment('');
        setDescription('');
        setAxisDescriptions({
          governanca: '',
          cultura: '',
          financeiro: '',
          inovacao: '',
          marketing: '',
          comercial: '',
          operacional: ''
        });
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
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden bg-white rounded-[32px] border-slate-200">
        <DialogHeader className="p-6 border-b border-slate-100 bg-slate-50/50 flex flex-row items-center gap-3 space-y-0">
          <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center shadow-sm">
            <Sparkles size={20} />
          </div>
          <div>
            <DialogTitle className="text-lg font-black text-slate-900 tracking-tight">Gerador Inteligente</DialogTitle>
            <DialogDescription className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
              Powered by Google Gemini
            </DialogDescription>
          </div>
        </DialogHeader>

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
            <Label className="text-[11px] font-black text-slate-800 uppercase tracking-widest block">Qual o segmento de atuação?</Label>
            <p className="text-xs text-slate-500 font-medium">A IA criará um nome, CNPJ, estrutura de DRE/Balanço de 5 anos, premissas de valuation e um relatório estratégico baseado neste setor.</p>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                <Building2 size={18} />
              </div>
              <Input 
                type="text" 
                autoFocus
                placeholder="Ex: Rede de Clínicas Odontológicas, Software SaaS, Construtora..."
                value={segment}
                onChange={(e) => setSegment(e.target.value)}
                disabled={loading}
                className="w-full pl-12 h-12 bg-slate-50 border-slate-200 rounded-2xl text-sm font-bold text-slate-700"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !loading) {
                    handleGenerate();
                  }
                }}
              />
            </div>
          </div>

          <div className="space-y-3">
            <Label className="text-[11px] font-black text-slate-800 uppercase tracking-widest block">Características & Referências (Opcional)</Label>
            <p className="text-xs text-slate-500 font-medium">Descreva detalhes gerais como desafios atuais, número de funcionários ou perfil de clientes.</p>
            <textarea 
              placeholder="Ex: Empresa familiar em transição, enfrenta dificuldades no fluxo de caixa, possui 15 funcionários..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={loading}
              rows={2}
              className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all placeholder:font-medium placeholder:text-slate-400 resize-none"
            />
          </div>

          <div className="pt-4 border-t border-slate-100">
            <label className="text-[11px] font-black text-slate-800 uppercase tracking-widest block mb-4">Detalhamento por Eixo (Base para IA)</label>
            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
              {[
                { id: 'governanca', label: 'Governança Corporativa', placeholder: 'Ex: Conselho em formação, foco em sucessão...' },
                { id: 'cultura', label: 'Cultura Organizacional', placeholder: 'Ex: Cultura de alta performance, foco em inovação...' },
                { id: 'financeiro', label: 'Gestão Financeira', placeholder: 'Ex: Foco em redução de custos e aumento de margem...' },
                { id: 'inovacao', label: 'Gestão de Inovação', placeholder: 'Ex: Desenvolvimento de novos produtos digitais...' },
                { id: 'marketing', label: 'Gestão de Marketing', placeholder: 'Ex: Foco em branding e presença digital...' },
                { id: 'comercial', label: 'Gestão Comercial', placeholder: 'Ex: Expansão de canais de venda e CRM...' },
                { id: 'operacional', label: 'Gestão Operacional', placeholder: 'Ex: Otimização de processos e logística...' },
              ].map(axis => (
                <div key={axis.id} className="space-y-1.5">
                  <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{axis.label}</Label>
                  <textarea 
                    placeholder={axis.placeholder}
                    value={(axisDescriptions as any)[axis.id]}
                    onChange={(e) => setAxisDescriptions(prev => ({ ...prev, [axis.id]: e.target.value }))}
                    disabled={loading}
                    rows={2}
                    className="w-full px-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none focus:border-indigo-500 transition-all placeholder:font-medium placeholder:text-slate-400 resize-none"
                  />
                </div>
              ))}
            </div>
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
          <Button 
            variant="outline"
            onClick={onClose}
            disabled={loading}
            className="text-xs uppercase tracking-widest font-bold"
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleGenerate}
            disabled={loading || !segment.trim()}
            className="bg-indigo-600 text-white font-black text-xs uppercase tracking-widest hover:bg-indigo-700 flex items-center gap-2"
          >
            {loading ? 'Gerando...' : 'Gerar com IA'}
            {!loading && <Sparkles size={14} />}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
