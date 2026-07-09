import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Save, Briefcase, TrendingUp, DollarSign, PieChart, Activity } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAssetModalAdapter } from '../../adapters/ui/useAssetModalAdapter';

interface AssetModalProps {
  clientId: string;
  onClose: () => void;
  asset?: any;
}

export function AssetModal({ clientId, onClose, asset }: AssetModalProps) {
  const { saveAsset, loading } = useAssetModalAdapter(clientId, asset, onClose);
  const [submitError, setSubmitError] = useState('');
  const [formData, setFormData] = useState({
    name: asset?.name || '',
    category: asset?.category || 'Renda Fixa',
    value: asset?.value?.toString() || '',
    profit: asset?.profit?.toString() || '',
    change: asset?.change?.toString() || '',
    status: asset?.status || 'Verde',
    applicationDate: asset?.applicationDate || new Date().toISOString().split('T')[0],
    initialValue: asset?.initialValue?.toString() || '',
    yieldType: asset?.yieldType || 'CDI',
    composesCashFlow: asset?.composesCashFlow ?? true
  });

  const [touched, setTouched] = useState({
    name: false,
    value: false,
    initialValue: false
  });

  const getErrors = () => {
    const errors: any = {};
    if (!formData.name) errors.name = 'O nome do ativo é obrigatório';
    if (!formData.value && formData.value !== '0') errors.value = 'O valor atual é obrigatório';
    if (!formData.initialValue && formData.initialValue !== '0') errors.initialValue = 'O saldo inicial é obrigatório';
    return errors;
  };

  const errors = getErrors();

  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const handleSave = async () => {
    setTouched({ name: true, value: true, initialValue: true });
    setSubmitError('');
    
    if (Object.keys(errors).length > 0) {
      setSubmitError('Preencha os campos obrigatórios.');
      return;
    }

    const res = await saveAsset(formData);
    if (!res.success) {
      setSubmitError(res.error || 'Erro ao salvar.');
    }
  };

  const categories = ['Renda Fixa', 'Ações', 'Tesouro', 'Internacional', 'Cripto', 'Imobiliário', 'Outros'];
  const yieldTypes = ['CDI', 'IPCA', 'SELIC', 'Prefixado', 'Dividendos', 'Outros'];
  const statuses = [
    { value: 'Verde', label: 'Verde (Bom)' },
    { value: 'Amarelo', label: 'Amarelo (Alerta)' },
    { value: 'Vermelho', label: 'Vermelho (Crítico)' }
  ];

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 text-left">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh]"
      >
        <div className="p-8 border-b border-border flex justify-between items-center bg-slate-50/50 shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-secondary/10 rounded-2xl flex items-center justify-center">
              <Briefcase size={24} className="text-secondary" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-muted-foreground">{asset ? 'Editar Ativo' : 'Novo Ativo'}</h3>
              <p className="text-xs text-muted-foreground mt-1 uppercase tracking-widest font-bold">Gestão de Ativos Financeiros</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-muted-foreground">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-8 space-y-6 overflow-y-auto">
          {submitError && (
            <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs font-bold">
              {submitError}
            </div>
          )}

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2 col-span-2">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-1">Nome do Ativo</label>
              <input 
                type="text" 
                placeholder="Ex: CDB Liquidez Diária, Ações Vale"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                onBlur={() => handleBlur('name')}
                className={cn(
                  "w-full px-4 py-3 bg-slate-50 border rounded-xl text-sm font-bold outline-none transition-all",
                  touched.name && errors.name ? "border-red-500 focus:ring-red-500/10 focus:bg-white" : "border-border focus:bg-white focus:ring-2 focus:ring-secondary/10"
                )}
              />
              {touched.name && errors.name && (
                <p className="text-[9px] text-red-500 font-bold px-1">{errors.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-1">Classe / Categoria</label>
              <select 
                value={formData.category}
                onChange={e => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 border border-border rounded-xl text-sm font-bold outline-none focus:bg-white focus:ring-2 focus:ring-secondary/10 transition-all text-muted-foreground"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-1">Tipo de Rendimento</label>
              <select 
                value={formData.yieldType}
                onChange={e => setFormData({ ...formData, yieldType: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 border border-border rounded-xl text-sm font-bold outline-none focus:bg-white focus:ring-2 focus:ring-secondary/10 transition-all text-muted-foreground"
              >
                {yieldTypes.map(yt => (
                  <option key={yt} value={yt}>{yt}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-1">Data da Aplicação</label>
              <input 
                type="date" 
                value={formData.applicationDate}
                onChange={e => setFormData({ ...formData, applicationDate: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 border border-border rounded-xl text-sm font-bold outline-none focus:bg-white focus:ring-2 focus:ring-secondary/10 transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-1">Status (Sinalização)</label>
              <select 
                value={formData.status}
                onChange={e => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 border border-border rounded-xl text-sm font-bold outline-none focus:bg-white focus:ring-2 focus:ring-secondary/10 transition-all text-muted-foreground"
              >
                {statuses.map(st => (
                  <option key={st.value} value={st.value}>{st.label}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-1">Saldo Inicial (R$)</label>
              <input 
                type="text" 
                placeholder="Ex: 50000.00"
                value={formData.initialValue}
                onChange={e => setFormData({ ...formData, initialValue: e.target.value })}
                onBlur={() => handleBlur('initialValue')}
                className={cn(
                  "w-full px-4 py-3 bg-slate-50 border rounded-xl text-sm font-bold outline-none transition-all",
                  touched.initialValue && errors.initialValue ? "border-red-500 focus:ring-red-500/10 focus:bg-white" : "border-border focus:bg-white focus:ring-2 focus:ring-secondary/10"
                )}
              />
              {touched.initialValue && errors.initialValue && (
                <p className="text-[9px] text-red-500 font-bold px-1">{errors.initialValue}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-1">Valor Atual (R$)</label>
              <input 
                type="text" 
                placeholder="Ex: 51000.00"
                value={formData.value}
                onChange={e => setFormData({ ...formData, value: e.target.value })}
                onBlur={() => handleBlur('value')}
                className={cn(
                  "w-full px-4 py-3 bg-slate-50 border rounded-xl text-sm font-bold outline-none transition-all",
                  touched.value && errors.value ? "border-red-500 focus:ring-red-500/10 focus:bg-white" : "border-border focus:bg-white focus:ring-2 focus:ring-secondary/10"
                )}
              />
              {touched.value && errors.value && (
                <p className="text-[9px] text-red-500 font-bold px-1">{errors.value}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-1">Lucro Acumulado (R$)</label>
              <input 
                type="text" 
                placeholder="Ex: 1000.00"
                value={formData.profit}
                onChange={e => setFormData({ ...formData, profit: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 border border-border rounded-xl text-sm font-bold outline-none focus:bg-white focus:ring-2 focus:ring-secondary/10 transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-1">Rentabilidade no Mês (%)</label>
              <input 
                type="text" 
                placeholder="Ex: 0.85"
                value={formData.change}
                onChange={e => setFormData({ ...formData, change: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 border border-border rounded-xl text-sm font-bold outline-none focus:bg-white focus:ring-2 focus:ring-secondary/10 transition-all"
              />
            </div>

            <div className="col-span-2 p-4 bg-slate-50 border border-border rounded-2xl flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Compor Fluxo de Caixa</p>
                <p className="text-[9px] text-muted-foreground font-medium">Considerar este ativo como saldo disponível para o fluxo.</p>
              </div>
              <button 
                onClick={() => setFormData({ ...formData, composesCashFlow: !formData.composesCashFlow })}
                className={cn(
                  "w-12 h-6 rounded-full transition-all relative",
                  formData.composesCashFlow ? "bg-secondary" : "bg-slate-300"
                )}
              >
                <div className={cn(
                  "absolute top-1 w-4 h-4 bg-white rounded-full transition-all",
                  formData.composesCashFlow ? "right-1" : "left-1"
                )} />
              </button>
            </div>
          </div>
        </div>

        <div className="p-8 bg-slate-50 border-t border-border flex justify-end gap-4 shrink-0">
          <button 
            onClick={onClose}
            className="px-4 md:px-6 py-2 md:py-2.5 text-muted-foreground font-bold text-sm hover:text-muted-foreground transition-colors"
          >
            Cancelar
          </button>
          <button 
            onClick={handleSave}
            disabled={loading}
            className="px-8 py-2.5 bg-secondary text-muted-foreground rounded-xl text-xs font-black uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-secondary/20 flex items-center gap-2 disabled:opacity-50"
          >
            <Save size={18} /> {loading ? 'Salvando...' : asset ? 'Salvar Alterações' : 'Adicionar Ativo'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
