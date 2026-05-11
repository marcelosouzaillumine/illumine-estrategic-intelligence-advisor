import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Save, Landmark } from 'lucide-react';
import { cn } from '../../lib/utils';
import { collection, addDoc, serverTimestamp, updateDoc, doc } from 'firebase/firestore';
import { db, auth } from '../../lib/firebase';

interface BankAccountModalProps {
  clientId: string;
  onClose: () => void;
  account?: any; // Add account prop for editing
}

export function BankAccountModal({ clientId, onClose, account }: BankAccountModalProps) {
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [formData, setFormData] = useState({
    banco: account?.banco || '',
    agencia: account?.agencia || '',
    conta: account?.conta || '',
    tipoConta: account?.tipoConta || 'Conta Corrente',
    moeda: account?.moeda || 'BRL',
    saldoInicial: account?.saldoInicial?.toString() || '',
    saldoAtual: account?.saldoAtual?.toString() || ''
  });

  const [touched, setTouched] = useState({
    banco: false,
    saldoInicial: false
  });

  const getErrors = () => {
    const errors: any = {};
    if (!formData.banco) errors.banco = 'O nome da instituição é obrigatório';
    if (!formData.saldoInicial && formData.saldoInicial !== '0') errors.saldoInicial = 'O saldo inicial é obrigatório';
    return errors;
  };

  const errors = getErrors();

  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const handleSave = async () => {
    setTouched({ banco: true, saldoInicial: true });
    setSubmitError('');
    
    if (Object.keys(errors).length > 0) {
      setSubmitError('Preencha os campos obrigatórios.');
      return;
    }

    setLoading(true);
    try {
      const parseValue = (val: any) => {
        if (typeof val === 'number') return val;
        if (!val || typeof val !== 'string') return 0;
        return parseFloat(val.replace(/\./g, '').replace(',', '.')) || 0;
      };

      const initialValue = parseValue(formData.saldoInicial);
      const currentValue = formData.saldoAtual ? parseValue(formData.saldoAtual) : initialValue;

      const dateNow = new Date();
      const monthStr = dateNow.toLocaleString('pt-BR', { month: 'short' });
      const formattedMonth = monthStr.charAt(0).toUpperCase() + monthStr.slice(1);

      const dataToSave: any = {
        banco: formData.banco,
        agencia: formData.agencia,
        conta: formData.conta,
        tipoConta: formData.tipoConta,
        moeda: formData.moeda,
        saldoInicial: initialValue,
        saldoAtual: currentValue,
        dataAtualizacao: dateNow.toLocaleDateString('pt-BR'),
        updatedAt: serverTimestamp()
      };

      if (account?.id) {
        // For updates, only send fields that can change. 
        // Avoid sending clientId or createdBy if they are already set to prevent permission issues.
        await updateDoc(doc(db, 'financial_positions', account.id), dataToSave);
      } else {
        const newData = {
          ...dataToSave,
          clientId,
          createdBy: auth.currentUser?.uid,
          createdAt: serverTimestamp(),
          historico: [
            { mes: formattedMonth, saldo: initialValue }
          ],
        };
        await addDoc(collection(db, 'financial_positions'), newData);
      }
      
      onClose();
    } catch (error: any) {
      console.error('Error saving bank account:', error);
      setSubmitError('Erro ao salvar conta: ' + (error.message || 'Verifique as permissões.'));
    } finally {
      setLoading(false);
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
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
              <Landmark size={24} className="text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">{account ? 'Editar Conta Bancária' : 'Nova Conta Bancária'}</h3>
              <p className="text-xs text-slate-500 mt-1 uppercase tracking-widest font-bold">Posição Financeira</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-8 space-y-6">
          {submitError && (
            <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs font-bold">
              {submitError}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Instituição Financeira / Banco</label>
            <input 
              type="text" 
              placeholder="Ex: Itaú, Bradesco, XP"
              value={formData.banco}
              onChange={e => setFormData({ ...formData, banco: e.target.value })}
              onBlur={() => handleBlur('banco')}
              className={cn(
                "w-full px-4 py-3 bg-slate-50 border rounded-xl text-sm font-bold outline-none transition-all",
                touched.banco && errors.banco ? "border-red-500 focus:ring-red-500/10 focus:bg-white" : "border-slate-100 focus:bg-white focus:ring-2 focus:ring-primary/10"
              )}
            />
            {touched.banco && errors.banco && (
              <p className="text-[9px] text-red-500 font-bold px-1">{errors.banco}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Agência</label>
              <input 
                type="text" 
                placeholder="Ex: 0001"
                value={formData.agencia}
                onChange={e => setFormData({ ...formData, agencia: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold outline-none focus:bg-white focus:ring-2 focus:ring-primary/10 transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Conta</label>
              <input 
                type="text" 
                placeholder="Ex: 12345-6"
                value={formData.conta}
                onChange={e => setFormData({ ...formData, conta: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold outline-none focus:bg-white focus:ring-2 focus:ring-primary/10 transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Tipo de Conta</label>
              <select 
                value={formData.tipoConta}
                onChange={e => setFormData({ ...formData, tipoConta: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold outline-none focus:bg-white focus:ring-2 focus:ring-primary/10 transition-all text-slate-700"
              >
                <option value="Conta Corrente">Conta Corrente</option>
                <option value="Conta Poupança">Conta Poupança</option>
                <option value="Conta de Investimento">Conta de Investimento</option>
                <option value="Caixa">Caixa (Físico)</option>
                <option value="Outros">Outros</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Moeda</label>
              <select 
                value={formData.moeda}
                onChange={e => setFormData({ ...formData, moeda: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold outline-none focus:bg-white focus:ring-2 focus:ring-primary/10 transition-all text-slate-700"
              >
                <option value="BRL">BRL (Real)</option>
                <option value="USD">USD (Dólar)</option>
                <option value="EUR">EUR (Euro)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Saldo Inicial</label>
              <input 
                type="text" 
                placeholder="Ex: 50000,00"
                value={formData.saldoInicial}
                onChange={e => setFormData({ ...formData, saldoInicial: e.target.value })}
                onBlur={() => handleBlur('saldoInicial')}
                className={cn(
                  "w-full px-4 py-3 bg-slate-50 border rounded-xl text-sm font-bold outline-none transition-all",
                  touched.saldoInicial && errors.saldoInicial ? "border-red-500 focus:ring-red-500/10 focus:bg-white" : "border-slate-100 focus:bg-white focus:ring-2 focus:ring-primary/10"
                )}
              />
              <p className="text-[9px] text-slate-400 px-1">Apenas números e vírgula.</p>
              {touched.saldoInicial && errors.saldoInicial && (
                <p className="text-[9px] text-red-500 font-bold px-1">{errors.saldoInicial}</p>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Saldo Atual</label>
              <input 
                type="text" 
                placeholder="Igual ao inicial se vazio"
                value={formData.saldoAtual}
                onChange={e => setFormData({ ...formData, saldoAtual: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold outline-none focus:bg-white focus:ring-2 focus:ring-primary/10 transition-all"
              />
            </div>
          </div>
        </div>

        <div className="p-8 bg-slate-50 border-t border-slate-100 flex justify-end gap-4">
          <button 
            onClick={onClose}
            className="px-6 py-2.5 text-slate-400 font-bold text-sm hover:text-slate-600 transition-colors"
          >
            Cancelar
          </button>
          <button 
            onClick={handleSave}
            disabled={loading}
            className="px-8 py-2.5 bg-primary text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 flex items-center gap-2 disabled:opacity-50"
          >
            <Save size={18} /> {loading ? 'Salvando...' : account ? 'Salvar Alterações' : 'Cadastrar Conta'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
