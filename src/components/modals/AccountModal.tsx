import { useState } from 'react';
import { motion } from 'motion/react';
import { X, Save, Link2 } from 'lucide-react';
import { cn } from '../../lib/utils';
import { SYSTEM_KPI_CATEGORIES } from '../../constants';
import { suggestMapping } from '../../services/importService';

interface Account {
  id?: string;
  code: string;
  name: string;
  type: string;
  level: number;
  status: string;
  kpiMapping?: string;
  planType?: 'accounting' | 'managerial';
  accountingAccountIds?: string[];
}

interface AccountModalProps {
  account: Account | null;
  onClose: () => void;
  onSave: (data: any) => void;
  accountTypes: string[];
  existingAccounts: Account[];
  planType?: 'accounting' | 'managerial';
  accountingAccounts?: Account[];
}

export function AccountModal({ 
  account, 
  onClose, 
  onSave, 
  accountTypes, 
  existingAccounts,
  planType = 'accounting',
  accountingAccounts = []
}: AccountModalProps) {
  const [formData, setFormData] = useState<Account>(account || {
    code: '',
    name: '',
    type: 'Ativo',
    level: 1,
    status: 'Ativa',
    planType,
    accountingAccountIds: []
  });
  const [touched, setTouched] = useState({
    code: false,
    name: false,
    type: false
  });

  const getErrors = () => {
    const errors: any = {};
    const codeRegex = /^[\d.]+$/;
    
    if (!formData.code) {
      errors.code = 'O código é obrigatório';
    } else if (!codeRegex.test(formData.code)) {
      errors.code = 'Formato inválido (ex: 1.1.01)';
    } else {
      const isDuplicate = existingAccounts.some((acc: any) => 
        acc.code === formData.code && acc.id !== account?.id
      );
      if (isDuplicate) {
        errors.code = 'Este código já está em uso';
      }
    }

    if (!formData.name) {
      errors.name = 'O nome da conta é obrigatório';
    }

    if (!formData.type) {
      errors.type = 'O tipo é obrigatório';
    }

    return errors;
  };

  const errors = getErrors();

  const getSuggestedKpi = () => {
    const name = formData.name.toLowerCase();
    if (name.includes('receita líquida') || name.includes('faturamento líquido')) return 'receita_liquida';
    if (name.includes('lucro líquido') || name.includes('resultado líquido')) return 'lucro_liquido';
    if (name.includes('ebitda')) return 'ebitda';
    if (name.includes('faturamento bruto')) return 'faturamento_bruto';
    if (name.includes('caixa e equivalentes') || name.includes('disponibilidades')) return 'disponibilidades';
    return null;
  };

  const suggestedKpiId = getSuggestedKpi();
  const suggestedKpi = suggestedKpiId ? SYSTEM_KPI_CATEGORIES.find(c => c.id === suggestedKpiId) : null;

  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const handleSave = () => {
    setTouched({ code: true, name: true, type: true });
    if (Object.keys(errors).length === 0) {
      onSave(formData);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 text-left">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden"
      >
        <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div>
            <h3 className="text-xl font-bold text-slate-900">{account ? 'Editar Conta' : 'Nova Conta no Plano'}</h3>
            <p className="text-xs text-slate-500 mt-1 uppercase tracking-widest font-bold">
              {planType === 'accounting' ? 'Plano de Contas Contábil' : 'Plano de Contas Gerencial'}
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400"><X size={20} /></button>
        </div>
        
        <div className="p-8 space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">
                {planType === 'accounting' ? 'Código Contábil' : 'Código Gerencial'}
              </label>
              <input 
                type="text" 
                placeholder="Ex: 1.1.01"
                value={formData.code}
                onChange={e => setFormData({ ...formData, code: e.target.value })}
                onBlur={() => handleBlur('code')}
                className={cn(
                  "w-full px-4 py-3 bg-slate-50 border rounded-xl text-sm font-bold outline-none transition-all",
                  touched.code && errors.code ? "border-red-500 focus:ring-red-500/10 focus:bg-white" : "border-slate-100 focus:bg-white focus:ring-2 focus:ring-blue-500/10"
                )}
              />
              {touched.code && errors.code && (
                <p className="text-[9px] text-red-500 font-bold px-1">{errors.code}</p>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Grupo / Tipo</label>
              <select 
                value={formData.type}
                onChange={e => setFormData({ ...formData, type: e.target.value })}
                onBlur={() => handleBlur('type')}
                className={cn(
                  "w-full px-4 py-3 bg-slate-50 border rounded-xl text-sm font-bold outline-none transition-all",
                  touched.type && errors.type ? "border-red-500 focus:ring-red-500/10 focus:bg-white" : "border-slate-100 focus:bg-white focus:ring-2 focus:ring-blue-500/10"
                )}
              >
                {accountTypes.map((t: string) => <option key={t} value={t}>{t}</option>)}
              </select>
              {touched.type && errors.type && (
                <p className="text-[9px] text-red-500 font-bold px-1">{errors.type}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Nome da Conta</label>
            <input 
              type="text" 
              placeholder="Ex: Disponibilidades"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              onBlur={() => handleBlur('name')}
              className={cn(
                "w-full px-4 py-3 bg-slate-50 border rounded-xl text-sm font-bold outline-none transition-all",
                touched.name && errors.name ? "border-red-500 focus:ring-red-500/10 focus:bg-white" : "border-slate-100 focus:bg-white focus:ring-2 focus:ring-blue-500/10"
              )}
            />
            {touched.name && errors.name && (
              <p className="text-[9px] text-red-500 font-bold px-1">{errors.name}</p>
            )}
          </div>

          {(suggestedKpi && formData.kpiMapping !== suggestedKpi.id) && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-secondary/5 border border-secondary/10 p-4 rounded-xl flex items-center gap-4"
            >
              <div className="bg-white p-2 rounded-lg shadow-sm border border-secondary/10">
                <Link2 size={20} className="text-secondary" />
              </div>
              <div className="flex-1">
                <p className="text-[10px] font-black text-secondary uppercase tracking-widest">Sugestão de Vínculo</p>
                <p className="text-[11px] text-slate-500">Deseja vincular esta conta ao indicador <strong>{suggestedKpi.label}</strong>?</p>
              </div>
              <button 
                onClick={() => setFormData({ ...formData, kpiMapping: suggestedKpi.id })}
                className="px-3 py-1.5 bg-secondary text-white rounded-lg text-[10px] font-bold uppercase tracking-wider hover:bg-secondary/90 transition-all"
              >
                Vincular
              </button>
            </motion.div>
          )}

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Vincular a Indicador (Mapeamento)</label>
            <select 
              value={formData.kpiMapping || ''}
              onChange={e => setFormData({ ...formData, kpiMapping: e.target.value })}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold outline-none focus:bg-primary/5 focus:ring-2 focus:ring-secondary/20 transition-all text-primary"
            >
              <option value="">Não vinculado</option>
              {SYSTEM_KPI_CATEGORIES.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.label} ({cat.cat})</option>
              ))}
            </select>
            <p className="text-[9px] text-slate-400 mt-1 italic">Vincule esta conta a um indicador para que os dados importados alimentem os KPIs automaticamente.</p>
          </div>

          {planType === 'managerial' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Conexão com Plano Contábil</label>
                <button 
                  onClick={() => {
                    const suggested = suggestMapping(formData.name, accountingAccounts);
                    if (suggested.length > 0) {
                      setFormData({ ...formData, accountingAccountIds: [...new Set([...(formData.accountingAccountIds || []), ...suggested])] });
                    } else {
                      alert('Nenhuma sugestão encontrada por similaridade de nome.');
                    }
                  }}
                  className="text-[9px] font-black text-secondary uppercase tracking-widest hover:underline"
                >
                  Sugerir Vínculos
                </button>
              </div>
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 max-h-48 overflow-y-auto space-y-2">
                {accountingAccounts.length === 0 ? (
                  <p className="text-[11px] text-slate-400 italic text-center py-4">Nenhuma conta contábil cadastrada para vincular.</p>
                ) : (
                  accountingAccounts.map(acc => (
                    <label key={acc.id} className="flex items-center gap-3 p-2 hover:bg-white rounded-lg transition-all cursor-pointer group">
                      <input 
                        type="checkbox"
                        checked={(formData.accountingAccountIds || []).includes(acc.id!)}
                        onChange={e => {
                          const ids = formData.accountingAccountIds || [];
                          if (e.target.checked) {
                            setFormData({ ...formData, accountingAccountIds: [...ids, acc.id!] });
                          } else {
                            setFormData({ ...formData, accountingAccountIds: ids.filter(id => id !== acc.id) });
                          }
                        }}
                        className="w-4 h-4 rounded border-slate-300 text-secondary focus:ring-secondary/20 transition-all"
                      />
                      <div className="flex flex-col">
                        <span className="text-[11px] font-black text-slate-700 group-hover:text-primary transition-colors">{acc.name}</span>
                        <span className="text-[9px] font-mono font-bold text-slate-400">{acc.code}</span>
                      </div>
                    </label>
                  ))
                )}
              </div>
              <p className="text-[9px] text-slate-400 px-1 italic">Selecione as contas contábeis que compõem esta conta gerencial.</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Nível Hierárquico</label>
              <input 
                type="number" 
                min="1" 
                max="5"
                value={formData.level}
                onChange={e => setFormData({ ...formData, level: parseInt(e.target.value) })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/10 transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Status</label>
              <select 
                value={formData.status}
                onChange={e => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/10 transition-all"
              >
                <option value="Ativa">Ativa</option>
                <option value="Inativa">Inativa</option>
              </select>
            </div>
          </div>
        </div>

        <div className="p-8 bg-slate-50 border-t border-slate-100 flex justify-end gap-4">
          <button 
            onClick={onClose}
            className="px-4 md:px-6 py-2 md:py-2.5 text-slate-400 font-bold text-sm hover:text-slate-600 transition-colors"
          >
            Cancelar
          </button>
          <button 
            onClick={handleSave}
            className="px-8 py-2.5 bg-primary text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 flex items-center gap-2"
          >
            <Save size={18} /> {account ? 'Salvar Alterações' : 'Criar Conta'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
