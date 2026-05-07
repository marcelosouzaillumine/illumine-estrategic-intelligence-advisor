
import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Users, 
  Loader2, 
  Search,
  DollarSign,
  TrendingUp,
  X,
  CheckCircle2
} from 'lucide-react';
import { collection, query, where, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { formatCurrency } from '../lib/utils';
import { calculatePayrollBurdens } from '../services/taxService';

export function EmployeeManager({ clientId, clientConfig }: { clientId: string, clientConfig: any }) {
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const initialForm = {
    nome: '',
    funcao: '',
    area: '',
    tipoContrato: 'CLT',
    status: 'Ativo',
    admissao: new Date().toISOString().split('T')[0],
    salarioBase: 0,
    encargos: 0,
    decimoTerceiroFerias: 0,
    verbasIndenizatorias: 0,
    custoMensal: 0,
    custoAnual: 0,
    custoRescisaoEstimado: 0
  };

  const [formData, setFormData] = useState(initialForm);

  useEffect(() => {
    fetchEmployees();
  }, [clientId]);

  const fetchEmployees = async () => {
    if (!clientId) return;
    setLoading(true);
    try {
      const q = query(collection(db, 'employees'), where('clientId', '==', clientId));
      const snap = await getDocs(q);
      const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setEmployees(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!auth.currentUser) return;
    
    setLoading(true);
    try {
      // Calculate burdens using taxService
      const burdens = calculatePayrollBurdens(formData.salarioBase, {
        fgts: clientConfig.folhaFgts || 8,
        inssPatronal: clientConfig.folhaInssPatronal || 20,
        inssFuncionario: clientConfig.folhaInssFuncionario || 11,
        multaFgts: clientConfig.folhaMultaFgts || 40,
        tabelaIRRF: clientConfig.folhaTabelaIRRF || []
      });

      const payload = {
        ...formData,
        encargos: burdens.fgts + burdens.inssPatronal,
        decimoTerceiroFerias: burdens.provisionFerias13,
        custoMensal: burdens.custoTotal,
        custoAnual: burdens.custoTotal * 12,
        clientId,
        ownerId: auth.currentUser.uid,
        updatedAt: serverTimestamp()
      };

      if (editingId) {
        await updateDoc(doc(db, 'employees', editingId), payload);
      } else {
        await addDoc(collection(db, 'employees'), payload);
      }
      
      setIsAdding(false);
      setEditingId(null);
      setFormData(initialForm);
      fetchEmployees();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Excluir colaborador?')) return;
    try {
      await deleteDoc(doc(db, 'employees', id));
      fetchEmployees();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 border border-blue-100">
            <Users size={20} />
          </div>
          <div>
            <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest">Colaboradores</h4>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Gerencie o quadro de pessoal para cálculos de custos.</p>
          </div>
        </div>
        {!isAdding && (
          <button 
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20"
          >
            <Plus size={14} /> Novo Colaborador
          </button>
        )}
      </div>

      {isAdding ? (
        <div className="bg-slate-50 p-8 rounded-[32px] border border-slate-200 shadow-sm space-y-8">
           <div className="flex items-center justify-between">
              <h5 className="text-[10px] font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
                 {editingId ? <Edit3 size={16} /> : <Plus size={16} />} 
                 {editingId ? 'Editar Colaborador' : 'Adicionar Colaborador'}
              </h5>
              <button onClick={() => { setIsAdding(false); setEditingId(null); }} className="text-slate-400 hover:text-rose-500 transition-colors">
                 <X size={20} />
              </button>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block px-1">Nome Completo</label>
                <input 
                  type="text" 
                  value={formData.nome}
                  onChange={e => setFormData({...formData, nome: e.target.value})}
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-blue-500"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block px-1">Função / Cargo</label>
                <input 
                  type="text" 
                  value={formData.funcao}
                  onChange={e => setFormData({...formData, funcao: e.target.value})}
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-blue-500"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block px-1">Área / Depto</label>
                <input 
                  type="text" 
                  value={formData.area}
                  onChange={e => setFormData({...formData, area: e.target.value})}
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-blue-500"
                />
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pt-4 border-t border-slate-100">
              <div className="space-y-2">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block px-1">Vínculo</label>
                <select 
                  value={formData.tipoContrato}
                  onChange={e => setFormData({...formData, tipoContrato: e.target.value})}
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-blue-500"
                >
                  <option value="CLT">CLT</option>
                  <option value="PJ">PJ / Terceirizado</option>
                  <option value="Estagiário">Estagiário</option>
                  <option value="Temporário">Temporário</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block px-1">Status</label>
                <select 
                  value={formData.status}
                  onChange={e => setFormData({...formData, status: e.target.value})}
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-blue-500"
                >
                  <option value="Ativo">Ativo</option>
                  <option value="Afastado">Afastado</option>
                  <option value="Desligado">Desligado</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block px-1">Data Admissão</label>
                <input 
                  type="date" 
                  value={formData.admissao}
                  onChange={e => setFormData({...formData, admissao: e.target.value})}
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-blue-500"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block px-1">Salário Base (R$)</label>
                <input 
                  type="number" 
                  value={formData.salarioBase}
                  onChange={e => setFormData({...formData, salarioBase: parseFloat(e.target.value) || 0})}
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-black outline-none focus:border-blue-500"
                />
              </div>
           </div>

           <div className="flex justify-end gap-3 pt-6">
              <button 
                onClick={() => { setIsAdding(false); setEditingId(null); }}
                className="px-6 py-2.5 text-[10px] font-black uppercase text-slate-500 hover:text-slate-700 underline transition-all"
              >
                Cancelar
              </button>
              <button 
                onClick={handleSave}
                disabled={loading}
                className="px-10 py-3 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg flex items-center gap-2"
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : editingId ? <Save size={16} /> : <CheckCircle2 size={16} />}
                {editingId ? 'Salvar Edição' : 'Cadastrar Colaborador'}
              </button>
           </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
           <div className="overflow-x-auto">
             <table className="w-full text-left">
               <thead className="bg-slate-50">
                 <tr>
                   <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Nome / Cargo</th>
                   <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Área</th>
                   <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Vínculo</th>
                   <th className="px-6 py-4 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Salário Base</th>
                   <th className="px-6 py-4 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Ações</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                 {employees.length === 0 ? (
                   <tr>
                     <td colSpan={5} className="px-6 py-12 text-center text-slate-400 italic text-sm">
                        Nenhum colaborador cadastrado para este cliente.
                     </td>
                   </tr>
                 ) : (
                   employees.map(emp => (
                     <tr key={emp.id} className="hover:bg-slate-50/50 transition-colors">
                       <td className="px-6 py-4">
                          <p className="text-xs font-bold text-slate-800">{emp.nome}</p>
                          <p className="text-[10px] text-slate-400 font-medium">{emp.funcao}</p>
                       </td>
                       <td className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-tighter">
                          {emp.area}
                       </td>
                       <td className="px-6 py-4">
                          <span className="px-2 py-0.5 bg-slate-50 border border-slate-100 rounded text-[9px] font-black text-slate-500 uppercase">{emp.tipoContrato}</span>
                       </td>
                       <td className="px-6 py-4 text-right font-mono text-xs font-bold text-slate-700">
                          {formatCurrency(emp.salarioBase)}
                       </td>
                       <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                             <button 
                               onClick={() => {
                                  setEditingId(emp.id);
                                  setFormData({ ...initialForm, ...emp });
                                  setIsAdding(true);
                               }}
                               className="p-1.5 text-slate-400 hover:text-blue-600 transition-colors"
                             >
                                <Edit3 size={14} />
                             </button>
                             <button 
                               onClick={() => handleDelete(emp.id)}
                               className="p-1.5 text-slate-400 hover:text-rose-500 transition-colors"
                             >
                                <Trash2 size={14} />
                             </button>
                          </div>
                       </td>
                     </tr>
                   ))
                 )}
               </tbody>
             </table>
           </div>
        </div>
      )}
    </div>
  );
}

function Save(props: any) {
  return (
    <svg 
      {...props} 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    >
      <path d="M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" />
      <path d="M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7" />
      <path d="M7 3v4a1 1 0 0 0 1 1h7" />
    </svg>
  );
}
