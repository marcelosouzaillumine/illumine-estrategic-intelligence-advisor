
import React, { useState } from 'react';
import { Target, Flag, Rocket, Plus, Trash2, Edit2, Save, X, Eye, FileText, Heart, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useModuleData } from '../../hooks/useModuleData';
import { Diretriz } from '../../types/modules';
import { SectionHeader } from '../Common';
import { cn } from '../../lib/utils';

interface DiretrizesPageProps {
  clientId: string;
}

export function DiretrizesPage({ clientId }: DiretrizesPageProps) {
  const { data, add, update, loading } = useModuleData<Diretriz>('diretrizes', clientId);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<Diretriz>>({
    proposito: '',
    historia: '',
    missao: '',
    visao: '',
    valores: []
  });

  const currentDiretriz = data[0];

  React.useEffect(() => {
    if (currentDiretriz) {
      setFormData(currentDiretriz);
    }
  }, [currentDiretriz]);

  const handleSave = async () => {
    const payload = {
      proposito: formData.proposito || '',
      historia: formData.historia || '',
      missao: formData.missao || '',
      visao: formData.visao || '',
      valores: formData.valores || []
    };

    if (currentDiretriz?.id) {
      await update(currentDiretriz.id, payload);
    } else {
      await add(payload);
    }
    setIsEditing(false);
  };

  const addValor = () => {
    setFormData(prev => ({
      ...prev,
      valores: [...(prev.valores || []), { nome: '', definicao: '' }]
    }));
  };

  const removeValor = (index: number) => {
    setFormData(prev => ({
      ...prev,
      valores: prev.valores?.filter((_, i) => i !== index)
    }));
  };

  const updateValor = (index: number, field: 'nome' | 'definicao', value: string) => {
    setFormData(prev => ({
      ...prev,
      valores: prev.valores?.map((v, i) => i === index ? { ...v, [field]: value } : v)
    }));
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-secondary"></div>
    </div>
  );

  return (
    <div className="space-y-8 pb-32">
      {/* Header Estilizado - Padrão Monitoramento */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-slate-900 p-8 rounded-[32px] text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-secondary/20 flex items-center justify-center">
              <Flag size={20} className="text-secondary" />
            </div>
            <h1 className="text-3xl font-display font-black tracking-tight">Identidade & Diretrizes</h1>
          </div>
          <p className="text-slate-400 text-sm font-medium">O DNA e o norte estratégico da empresa</p>
        </div>

        <button
          onClick={() => setIsEditing(!isEditing)}
          className={cn(
            "relative z-10 flex items-center gap-2 px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all",
            isEditing 
              ? "bg-white/10 text-white hover:bg-white/20 border border-white/10" 
              : "bg-secondary text-white hover:bg-secondary/90 shadow-xl shadow-secondary/20"
          )}
        >
          {isEditing ? <><X size={14} /> Cancelar</> : <><Edit2 size={14} /> Editar Diretrizes</>}
        </button>
      </div>

      {/* Propósito */}
      <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-8 text-rose-50">
            <Heart size={120} strokeWidth={1} />
          </div>
          <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-500">
                <Heart size={24} />
              </div>
              <h3 className="text-xl font-black text-slate-800">Propósito</h3>
            </div>
            {isEditing ? (
              <textarea
                value={formData.proposito || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, proposito: e.target.value }))}
                className="w-full h-24 p-6 bg-slate-50 border border-slate-100 rounded-3xl outline-none focus:ring-2 focus:ring-rose-500/20 transition-all font-medium text-slate-600 resize-none"
                placeholder="Por que a empresa existe? Qual a sua causa?"
              />
            ) : (
              <p className="text-slate-500 leading-relaxed font-semibold text-lg italic">
                {currentDiretriz?.proposito ? `"${currentDiretriz.proposito}"` : 'O propósito ainda não foi definido. Ele é o "porquê" por trás de tudo.'}
              </p>
            )}
          </div>
        </motion.div>

      {/* História - Movido para abaixo do Propósito */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 p-8 text-slate-50">
          <BookOpen size={120} strokeWidth={1} />
        </div>
        <div className="relative z-10 space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-600">
              <BookOpen size={24} />
            </div>
            <h3 className="text-xl font-black text-slate-800">Nossa História & Origem</h3>
          </div>
          {isEditing ? (
            <textarea
              value={formData.historia || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, historia: e.target.value }))}
              className="w-full h-48 p-6 bg-slate-50 border border-slate-100 rounded-3xl outline-none focus:ring-2 focus:ring-slate-500/20 transition-all font-medium text-slate-600 resize-none"
              placeholder="Conte como tudo começou, os desafios superados e a herança da marca..."
            />
          ) : (
            <div className="text-slate-500 leading-relaxed font-medium space-y-4">
              {currentDiretriz?.historia ? (
                currentDiretriz.historia.split('\n').map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))
              ) : (
                <p className="italic text-slate-400">A história da empresa ainda não foi registrada. O storytelling é fundamental para criar conexão e confiança.</p>
              )}
            </div>
          )}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Missão */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-8 text-slate-50">
            <Target size={120} strokeWidth={1} />
          </div>
          <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                <Target size={24} />
              </div>
              <h3 className="text-xl font-black text-slate-800">Missão</h3>
            </div>
            {isEditing ? (
              <textarea
                value={formData.missao || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, missao: e.target.value }))}
                className="w-full h-32 p-6 bg-slate-50 border border-slate-100 rounded-3xl outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium text-slate-600 resize-none"
                placeholder="Qual o propósito fundamental da organização?"
              />
            ) : (
              <p className="text-slate-500 leading-relaxed font-medium italic">
                "{currentDiretriz?.missao || 'Não definida.'}"
              </p>
            )}
          </div>
        </motion.div>

        {/* Visão */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-8 text-slate-50">
            <Rocket size={120} strokeWidth={1} />
          </div>
          <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary">
                <Rocket size={24} />
              </div>
              <h3 className="text-xl font-black text-slate-800">Visão</h3>
            </div>
            {isEditing ? (
              <textarea
                value={formData.visao || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, visao: e.target.value }))}
                className="w-full h-32 p-6 bg-slate-50 border border-slate-100 rounded-3xl outline-none focus:ring-2 focus:ring-secondary/20 transition-all font-medium text-slate-600 resize-none"
                placeholder="Onde a empresa deseja chegar a longo prazo?"
              />
            ) : (
              <p className="text-slate-500 leading-relaxed font-medium italic">
                "{currentDiretriz?.visao || 'Não definida.'}"
              </p>
            )}
          </div>
        </motion.div>
      </div>

      {/* Valores */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-slate-900 p-12 rounded-[50px] shadow-2xl relative overflow-hidden"
      >
        <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-primary/10 blur-3xl rounded-full"></div>
        <div className="relative z-10 space-y-10">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-secondary">
                <Flag size={24} />
              </div>
              <h3 className="text-2xl font-black text-white">Nossos Valores</h3>
            </div>
            {isEditing && (
              <button
                onClick={addValor}
                className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-2xl flex items-center gap-2 font-black uppercase tracking-widest text-[10px] transition-all"
              >
                <Plus size={14} /> Adicionar Valor
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {formData.valores?.map((valor, idx) => (
                <motion.div
                  key={idx}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-white/5 border border-white/10 p-8 rounded-3xl group relative hover:bg-white/10 transition-all"
                >
                  {isEditing ? (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <input
                          value={valor.nome}
                          onChange={(e) => updateValor(idx, 'nome', e.target.value)}
                          className="bg-transparent text-lg font-black text-white outline-none border-b border-white/20 focus:border-secondary w-full mr-4"
                          placeholder="Nome do Valor"
                        />
                        <button onClick={() => removeValor(idx)} className="text-rose-400 hover:text-rose-300">
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <textarea
                        value={valor.definicao}
                        onChange={(e) => updateValor(idx, 'definicao', e.target.value)}
                        className="bg-transparent text-sm text-slate-400 outline-none w-full h-20 resize-none"
                        placeholder="Definição operacional..."
                      />
                    </div>
                  ) : (
                    <>
                      <h4 className="text-xl font-black text-secondary mb-3 tracking-tight">{valor.nome}</h4>
                      <p className="text-slate-300 text-sm leading-relaxed font-medium">
                        {valor.definicao}
                      </p>
                    </>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
            {!formData.valores?.length && !isEditing && (
              <div className="col-span-full py-20 text-center text-slate-500 font-bold italic">
                Nenhum valor cadastrado ainda.
              </div>
            )}
          </div>

          {isEditing && (
            <div className="flex justify-center pt-8">
              <button
                onClick={handleSave}
                className="bg-secondary hover:bg-secondary/90 text-white px-12 py-4 rounded-3xl font-black uppercase tracking-widest text-sm shadow-xl shadow-secondary/20 flex items-center gap-3 transition-all transform hover:scale-105 active:scale-95"
              >
                <Save size={20} /> Salvar Diretrizes Corporativas
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
