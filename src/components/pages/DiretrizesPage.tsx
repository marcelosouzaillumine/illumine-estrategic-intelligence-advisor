
import React, { useState } from 'react';
import { Target, Flag, Rocket, Plus, Trash2, Edit2, Save, X, Eye, FileText, Heart, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useModuleData } from '../../hooks/useModuleData';
import { Diretriz } from '../../types/modules';
import { PageHeader, SectionHeader } from '../Common';
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
      <PageHeader 
        title="Identidade & Diretrizes" 
        subtitle="O DNA e o norte estratégico da organização — Propósito, Missão, Visão e Valores."
        icon={Flag}
        color="executive"
      />

      <div className="flex items-center justify-between gap-4 flex-wrap bg-surface-container/60 p-4 rounded-md border border-border backdrop-blur-sm shadow-sm -mt-6 mb-10">
        <div className="flex items-center gap-3">
          <div className="px-4 md:px-6 py-2 md:py-3 bg-card border border-border rounded-md shadow-sm flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Rocket size={14} className="text-secondary" />
              <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">DNA Corporativo Ativo</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className={cn(
              "btn-executive",
              isEditing 
                ? "bg-surface-container text-foreground border border-border" 
                : "bg-secondary text-white shadow-xl shadow-secondary/20"
            )}
          >
            {isEditing ? <><X size={14} /> CANCELAR</> : <><Edit2 size={14} /> EDITAR DIRETRIZES</>}
          </button>
        </div>
      </div>


      {/* Propósito */}
      <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-premium p-10 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-8 text-destructive/5 opacity-20">
            <Heart size={120} strokeWidth={1} />
          </div>
          <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-md bg-destructive/10 flex items-center justify-center text-destructive shadow-inner">
                <Heart size={24} />
              </div>
              <h3 className="text-xl font-medium text-foreground tracking-tight uppercase">Propósito</h3>
            </div>
            {isEditing ? (
              <textarea
                value={formData.proposito || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, proposito: e.target.value }))}
                className="w-full h-24 p-6 bg-surface-container border border-border rounded-md outline-none focus:ring-1 focus:ring-destructive/20 transition-all font-medium text-foreground text-sm uppercase tracking-widest placeholder:text-muted-foreground/30 shadow-inner resize-none italic"
                placeholder="Por que a empresa existe? Qual a sua causa?"
              />
            ) : (
              <p className="text-muted-foreground leading-relaxed font-medium text-lg italic uppercase tracking-widest">
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
        className="card-premium p-10 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 p-8 text-muted-foreground/5 opacity-20">
          <BookOpen size={120} strokeWidth={1} />
        </div>
        <div className="relative z-10 space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-md bg-surface-container flex items-center justify-center text-muted-foreground shadow-inner">
              <BookOpen size={24} />
            </div>
            <h3 className="text-xl font-medium text-foreground tracking-tight uppercase">Nossa História & Origem</h3>
          </div>
          {isEditing ? (
            <textarea
              value={formData.historia || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, historia: e.target.value }))}
              className="w-full h-48 p-6 bg-surface-container border border-border rounded-md outline-none focus:ring-1 focus:ring-secondary/20 transition-all font-medium text-foreground text-sm uppercase tracking-widest placeholder:text-muted-foreground/30 shadow-inner resize-none"
              placeholder="Conte como tudo começou, os desafios superados e a herança da marca..."
            />
          ) : (
            <div className="text-muted-foreground leading-relaxed font-medium space-y-4 uppercase tracking-widest text-[11px] italic">
              {currentDiretriz?.historia ? (
                currentDiretriz.historia.split('\n').map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))
              ) : (
                <p className="italic text-muted-foreground/40">A história da empresa ainda não foi registrada. O storytelling é fundamental para criar conexão e confiança.</p>
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
          className="card-premium p-10 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-8 text-primary/5 opacity-20">
            <Target size={120} strokeWidth={1} />
          </div>
          <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-md bg-primary/10 flex items-center justify-center text-primary shadow-inner">
                <Target size={24} />
              </div>
              <h3 className="text-xl font-medium text-foreground tracking-tight uppercase">Missão</h3>
            </div>
            {isEditing ? (
              <textarea
                value={formData.missao || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, missao: e.target.value }))}
                className="w-full h-32 p-6 bg-surface-container border border-border rounded-md outline-none focus:ring-1 focus:ring-primary/20 transition-all font-medium text-foreground text-sm uppercase tracking-widest placeholder:text-muted-foreground/30 shadow-inner resize-none italic"
                placeholder="Qual o propósito fundamental da organização?"
              />
            ) : (
              <p className="text-muted-foreground leading-relaxed font-medium italic uppercase tracking-widest text-[11px]">
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
          className="card-premium p-10 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-8 text-secondary/5 opacity-20">
            <Rocket size={120} strokeWidth={1} />
          </div>
          <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-md bg-secondary/10 flex items-center justify-center text-secondary shadow-inner">
                <Rocket size={24} />
              </div>
              <h3 className="text-xl font-medium text-foreground tracking-tight uppercase">Visão</h3>
            </div>
            {isEditing ? (
              <textarea
                value={formData.visao || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, visao: e.target.value }))}
                className="w-full h-32 p-6 bg-surface-container border border-border rounded-md outline-none focus:ring-1 focus:ring-secondary/20 transition-all font-medium text-foreground text-sm uppercase tracking-widest placeholder:text-muted-foreground/30 shadow-inner resize-none italic"
                placeholder="Onde a empresa deseja chegar a longo prazo?"
              />
            ) : (
              <p className="text-muted-foreground leading-relaxed font-medium italic uppercase tracking-widest text-[11px]">
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
        className="bg-executive p-12 rounded-md shadow-premium relative overflow-hidden border border-white/5"
      >
        <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-secondary/10 blur-3xl rounded-full shadow-inner"></div>
        <div className="relative z-10 space-y-10">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-md bg-white/10 flex items-center justify-center text-secondary shadow-inner">
                <Flag size={24} />
              </div>
              <h3 className="text-2xl font-medium text-white tracking-tight uppercase">Nossos Valores</h3>
            </div>
            {isEditing && (
              <button
                onClick={addValor}
                className="btn-executive bg-white/10 hover:bg-white/20 border border-white/10"
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
                  className="bg-white/5 border border-white/10 p-8 rounded-md group relative hover:bg-white/10 transition-all shadow-inner"
                >
                  {isEditing ? (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <input
                          value={valor.nome}
                          onChange={(e) => updateValor(idx, 'nome', e.target.value)}
                          className="bg-transparent text-lg font-medium text-white outline-none border-b border-white/20 focus:border-secondary w-full mr-4 uppercase tracking-tighter"
                          placeholder="Nome do Valor"
                        />
                        <button onClick={() => removeValor(idx)} className="text-destructive hover:text-destructive/80 shadow-sm">
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <textarea
                        value={valor.definicao}
                        onChange={(e) => updateValor(idx, 'definicao', e.target.value)}
                        className="bg-transparent text-[10px] text-white/60 outline-none w-full h-20 resize-none uppercase tracking-widest italic"
                        placeholder="Definição operacional..."
                      />
                    </div>
                  ) : (
                    <>
                      <h4 className="text-xl font-medium text-secondary mb-3 tracking-tight uppercase">{valor.nome}</h4>
                      <p className="text-white/60 text-[11px] leading-relaxed font-medium uppercase tracking-widest italic">
                        {valor.definicao}
                      </p>
                    </>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
            {!formData.valores?.length && !isEditing && (
              <div className="col-span-full py-20 text-center text-white/20 font-medium uppercase tracking-widest text-[10px] italic">
                Nenhum valor cadastrado ainda.
              </div>
            )}
          </div>

          {isEditing && (
            <div className="flex justify-center pt-8">
              <button
                onClick={handleSave}
                className="btn-executive bg-secondary hover:bg-secondary/90 shadow-xl shadow-secondary/20 border border-white/10"
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
