import React, { useState } from 'react';
import { 
  X, 
  Building2, 
  Landmark, 
  Calendar, 
  DollarSign,
  Percent,
  Calculator,
  FileText,
  Save,
  Loader2
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

interface ContractModalProps {
  clientId: string;
  onClose: () => void;
  onSuccess: () => void;
  contractToEdit?: any;
}

export function ContractModal({ clientId, onClose, onSuccess, contractToEdit }: ContractModalProps) {
  const [loading, setLoading] = useState(false);
  const [contractType, setContractType] = useState<'FINANCIAMENTO' | 'TRIBUTARIO'>(
    contractToEdit?.tipo === 'TRIBUTARIO' ? 'TRIBUTARIO' : 'FINANCIAMENTO'
  );

  const [formData, setFormData] = useState(contractToEdit || {
    titulo: '',
    credor: '',
    tipoModalidade: '',
    valorPrincipal: 0,
    taxaJuros: 0,
    indexador: 'PRÉ',
    prazoMeses: 12,
    carenciaMeses: 0,
    dataPrimeiroVencimento: new Date().toISOString().slice(0, 10),
    sistemaAmortizacao: 'PRICE',
    // Tributario specific
    esfera: 'FEDERAL',
    reducaoMultaJuros: 0,
    exigibilidadeSuspensa: true
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({
      ...prev,
      [name]: name.includes('valor') || name.includes('taxa') || name.includes('prazo') || name.includes('carencia') || name.includes('reducao') 
        ? Number(value) 
        : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulating API call
    setTimeout(() => {
      setLoading(false);
      onSuccess();
    }, 800);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white rounded-[32px] w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden"
      >
        <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h2 className="text-xl font-black text-slate-900">
              {contractToEdit ? 'Editar Contrato' : 'Novo Contrato'}
            </h2>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
              {contractType === 'FINANCIAMENTO' ? 'Empréstimos & Financiamentos' : 'Parcelamento de Passivo Tributário'}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-all"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-8 overflow-y-auto custom-scrollbar flex-1 bg-white">
          <div className="flex bg-slate-100/50 p-1.5 rounded-[20px] border border-slate-200/50 mb-8 w-max">
            <button
              onClick={() => setContractType('FINANCIAMENTO')}
              className={cn(
                "px-4 md:px-6 py-2 md:py-2.5 text-[10px] font-black rounded-xl transition-all uppercase tracking-widest flex items-center gap-2",
                contractType === 'FINANCIAMENTO' ? "bg-white text-blue-600 shadow-md" : "text-slate-400 hover:text-slate-600"
              )}
            >
              <Landmark size={14} /> Financiamento / Bancário
            </button>
            <button
              onClick={() => setContractType('TRIBUTARIO')}
              className={cn(
                "px-4 md:px-6 py-2 md:py-2.5 text-[10px] font-black rounded-xl transition-all uppercase tracking-widest flex items-center gap-2",
                contractType === 'TRIBUTARIO' ? "bg-white text-rose-600 shadow-md" : "text-slate-400 hover:text-slate-600"
              )}
            >
              <Building2 size={14} /> Passivo Tributário
            </button>
          </div>

          <form id="contract-form" onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Identificação / Título
                </label>
                <input
                  required
                  name="titulo"
                  value={formData.titulo}
                  onChange={handleChange}
                  placeholder={contractType === 'FINANCIAMENTO' ? "Ex: Capital de Giro Itaú" : "Ex: PERT Federal 2017"}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-800"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  {contractType === 'FINANCIAMENTO' ? 'Credor / Banco' : 'Órgão Competente'}
                </label>
                <input
                  required
                  name="credor"
                  value={formData.credor}
                  onChange={handleChange}
                  placeholder={contractType === 'FINANCIAMENTO' ? "Ex: Itaú Unibanco" : "Ex: Receita Federal do Brasil"}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-800"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                  <DollarSign size={12} /> Valor Principal
                </label>
                <input
                  required
                  type="number"
                  name="valorPrincipal"
                  value={formData.valorPrincipal}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-800"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                  <Calendar size={12} /> Prazo Total (Meses)
                </label>
                <input
                  required
                  type="number"
                  name="prazoMeses"
                  value={formData.prazoMeses}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-800"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                  <Calendar size={12} /> 1º Vencimento
                </label>
                <input
                  required
                  type="date"
                  name="dataPrimeiroVencimento"
                  value={formData.dataPrimeiroVencimento}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-800"
                />
              </div>
            </div>

            {contractType === 'FINANCIAMENTO' && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-6 bg-blue-50/30 rounded-2xl border border-blue-100">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-blue-600 uppercase tracking-widest flex items-center gap-1">
                    <Percent size={12} /> Taxa Mensal (%)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    name="taxaJuros"
                    value={formData.taxaJuros}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white border border-blue-200 rounded-xl font-bold text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-blue-900"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-blue-600 uppercase tracking-widest">
                    Indexador
                  </label>
                  <select
                    name="indexador"
                    value={formData.indexador}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white border border-blue-200 rounded-xl font-bold text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-blue-900"
                  >
                    <option value="PRÉ">Pré-fixado</option>
                    <option value="CDI">CDI</option>
                    <option value="IPCA">IPCA</option>
                    <option value="TR">TR</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-blue-600 uppercase tracking-widest flex items-center gap-1">
                    <Calculator size={12} /> Amortização
                  </label>
                  <select
                    name="sistemaAmortizacao"
                    value={formData.sistemaAmortizacao}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white border border-blue-200 rounded-xl font-bold text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-blue-900"
                  >
                    <option value="PRICE">PRICE</option>
                    <option value="SAC">SAC</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-blue-600 uppercase tracking-widest">
                    Carência (Meses)
                  </label>
                  <input
                    type="number"
                    name="carenciaMeses"
                    value={formData.carenciaMeses}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white border border-blue-200 rounded-xl font-bold text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-blue-900"
                  />
                </div>
              </div>
            )}

            {contractType === 'TRIBUTARIO' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 bg-rose-50/30 rounded-2xl border border-rose-100">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-rose-600 uppercase tracking-widest">
                    Esfera
                  </label>
                  <select
                    name="esfera"
                    value={formData.esfera}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white border border-rose-200 rounded-xl font-bold text-sm outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all text-rose-900"
                  >
                    <option value="FEDERAL">Federal</option>
                    <option value="ESTADUAL">Estadual</option>
                    <option value="MUNICIPAL">Municipal</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-rose-600 uppercase tracking-widest">
                    Redução Obtida (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    name="reducaoMultaJuros"
                    value={formData.reducaoMultaJuros}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white border border-rose-200 rounded-xl font-bold text-sm outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all text-rose-900"
                  />
                  <p className="text-[9px] text-rose-400 font-bold">Ref. Multas/Juros</p>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-rose-600 uppercase tracking-widest">
                    Exigibilidade Suspensa?
                  </label>
                  <select
                    name="exigibilidadeSuspensa"
                    value={String(formData.exigibilidadeSuspensa)}
                    onChange={(e) => setFormData(p => ({ ...p, exigibilidadeSuspensa: e.target.value === 'true' }))}
                    className="w-full px-4 py-3 bg-white border border-rose-200 rounded-xl font-bold text-sm outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all text-rose-900"
                  >
                    <option value="true">Sim, débito regular</option>
                    <option value="false">Não</option>
                  </select>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                <FileText size={12} /> Observações Estratégicas
              </label>
              <textarea
                name="observacoes"
                value={formData.observacoes || ''}
                onChange={handleChange as any}
                rows={3}
                placeholder="Detalhes sobre garantias, finalidade do capital, ou regras do edital..."
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-medium text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-800 resize-none custom-scrollbar"
              />
            </div>
          </form>
        </div>

        <div className="p-8 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 md:px-6 py-2 md:py-3 font-bold text-slate-500 hover:text-slate-700 transition-all"
          >
            Cancelar
          </button>
          <button
            type="submit"
            form="contract-form"
            disabled={loading}
            className="px-5 md:px-8 py-2 md:py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-black uppercase tracking-widest transition-all flex items-center gap-2 shadow-lg shadow-slate-900/20 disabled:opacity-50"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            {loading ? 'Salvando...' : 'Salvar Contrato'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
