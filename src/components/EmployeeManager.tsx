
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
import { calculatePayrollBurdens, calculateSeverance } from '../services/taxService';

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
    salarioBase: '' as any,
    encargos: 0,
    decimoTerceiroFerias: 0,
    verbasIndenizatorias: 0,
    custoMensal: 0,
    custoAnual: 0,
    custoRescisaoEstimado: 0,
    avisoIndenizado: true
  };

  const [formData, setFormData] = useState(initialForm);

  useEffect(() => {
    fetchEmployees();
  }, [clientId, auth.currentUser]);

  const fetchEmployees = async () => {
    if (!clientId || !auth.currentUser) return;
    setLoading(true);
    try {
      const q = query(
        collection(db, 'employees'), 
        where('clientId', '==', clientId),
        where('ownerId', '==', auth.currentUser.uid)
      );
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
      const baseSalario = typeof formData.salarioBase === 'string' ? parseFloat(formData.salarioBase) || 0 : formData.salarioBase;
      const burdens = calculatePayrollBurdens(baseSalario, {
        fgts: clientConfig.folhaFgts || 8,
        inssPatronal: clientConfig.folhaInssPatronal || 20,
        inssFuncionario: clientConfig.folhaInssFuncionario || 11,
        multaFgts: clientConfig.folhaMultaFgts || 40,
        tabelaIRRF: clientConfig.folhaTabelaIRRF || []
      });

      const severance = calculateSeverance(baseSalario, formData.admissao, {
        multaFgts: clientConfig.folhaMultaFgts || 40
      }, {
        avisoIndenizado: formData.avisoIndenizado
      });

      const payload = {
        ...formData,
        salarioBase: baseSalario,
        encargos: burdens.fgts + burdens.inssPatronal,
        decimoTerceiroFerias: burdens.provisionFerias13,
        custoMensal: burdens.custoTotal,
        custoAnual: burdens.custoTotal * 12,
        custoRescisaoEstimado: severance.totalRescisao,
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
            <h4 className="text-sm font-black text-muted-foreground uppercase tracking-widest">Colaboradores</h4>
            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Gerencie o quadro de pessoal para cálculos de custos.</p>
          </div>
        </div>
        {!isAdding && (
          <button 
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20"
          >
            <Plus size={14} /> Adicionar Colaborador
          </button>
        )}
      </div>

      {isAdding && (
        <div className="bg-slate-50 p-8 rounded-[32px] border border-border shadow-sm space-y-8">
           <div className="flex items-center justify-between">
              <h5 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                 {editingId ? <Edit3 size={16} /> : <Plus size={16} />} 
                 {editingId ? 'Editar Colaborador' : 'Adicionar Colaborador'}
              </h5>
              <button onClick={() => { setIsAdding(false); setEditingId(null); }} className="text-muted-foreground hover:text-rose-500 transition-colors">
                 <X size={20} />
              </button>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-[9px] font-black text-muted-foreground uppercase tracking-widest block px-1">Nome Completo</label>
                <input 
                  type="text" 
                  value={formData.nome}
                  onChange={e => setFormData({...formData, nome: e.target.value})}
                  className="w-full px-4 py-2.5 bg-white border border-border rounded-xl text-xs font-bold outline-none focus:border-blue-500"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-black text-muted-foreground uppercase tracking-widest block px-1">Função / Cargo</label>
                <input 
                  type="text" 
                  value={formData.funcao}
                  onChange={e => setFormData({...formData, funcao: e.target.value})}
                  className="w-full px-4 py-2.5 bg-white border border-border rounded-xl text-xs font-bold outline-none focus:border-blue-500"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-black text-muted-foreground uppercase tracking-widest block px-1">Área / Depto</label>
                <input 
                  type="text" 
                  value={formData.area}
                  onChange={e => setFormData({...formData, area: e.target.value})}
                  className="w-full px-4 py-2.5 bg-white border border-border rounded-xl text-xs font-bold outline-none focus:border-blue-500"
                />
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pt-4 border-t border-border">
              <div className="space-y-2">
                <label className="text-[9px] font-black text-muted-foreground uppercase tracking-widest block px-1">Vínculo</label>
                <select 
                  value={formData.tipoContrato}
                  onChange={e => setFormData({...formData, tipoContrato: e.target.value})}
                  className="w-full px-4 py-3 bg-white border border-border rounded-xl text-xs font-bold outline-none focus:border-blue-500"
                >
                  <option value="CLT">CLT</option>
                  <option value="PJ">PJ / Terceirizado</option>
                  <option value="Estagiário">Estagiário</option>
                  <option value="Temporário">Temporário</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-black text-muted-foreground uppercase tracking-widest block px-1">Status</label>
                <select 
                  value={formData.status}
                  onChange={e => setFormData({...formData, status: e.target.value})}
                  className="w-full px-4 py-3 bg-white border border-border rounded-xl text-xs font-bold outline-none focus:border-blue-500"
                >
                  <option value="Ativo">Ativo</option>
                  <option value="Afastado">Afastado</option>
                  <option value="Desligado">Desligado</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-black text-muted-foreground uppercase tracking-widest block px-1">Data Admissão</label>
                <input 
                  type="date" 
                  value={formData.admissao}
                  onChange={e => setFormData({...formData, admissao: e.target.value})}
                  className="w-full px-4 py-2.5 bg-white border border-border rounded-xl text-xs font-bold outline-none focus:border-blue-500"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-black text-muted-foreground uppercase tracking-widest block px-1">Salário Base (R$)</label>
                <input 
                  type="number" 
                  value={formData.salarioBase}
                  onChange={e => setFormData({...formData, salarioBase: e.target.value})}
                  className="w-full px-4 py-2.5 bg-white border border-border rounded-xl text-xs font-black outline-none focus:border-blue-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </div>
           </div>

           <div className="bg-white p-6 rounded-2xl border border-border space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-4">
                <div>
                  <h6 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Premissas de Rescisão</h6>
                  <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-tighter">Configurações para cálculo de provisão de risco</p>
                </div>
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Considerar Aviso Indenizado</span>
                  <div className="relative">
                    <input 
                      type="checkbox" 
                      checked={formData.avisoIndenizado}
                      onChange={e => setFormData({...formData, avisoIndenizado: e.target.checked})}
                      className="sr-only peer" 
                    />
                    <div className="w-8 h-4 bg-slate-200 rounded-full peer peer-checked:bg-blue-600 transition-colors"></div>
                    <div className="absolute left-0.5 top-0.5 w-3 h-3 bg-white rounded-full transition-transform peer-checked:translate-x-4"></div>
                  </div>
                </label>
              </div>

              {formData.salarioBase > 0 && formData.admissao && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: 'Aviso Prévio', val: calculateSeverance(formData.salarioBase, formData.admissao, { multaFgts: clientConfig.folhaMultaFgts || 40 }, { avisoIndenizado: formData.avisoIndenizado }).valorAviso },
                    { label: 'Multa FGTS (Est.)', val: calculateSeverance(formData.salarioBase, formData.admissao, { multaFgts: clientConfig.folhaMultaFgts || 40 }, { avisoIndenizado: formData.avisoIndenizado }).valorMultaFgts },
                    { label: '13º Prop.', val: calculateSeverance(formData.salarioBase, formData.admissao, { multaFgts: clientConfig.folhaMultaFgts || 40 }, { avisoIndenizado: formData.avisoIndenizado }).decimoTerceiroProp },
                    { label: 'Férias + 1/3 Prop.', val: calculateSeverance(formData.salarioBase, formData.admissao, { multaFgts: clientConfig.folhaMultaFgts || 40 }, { avisoIndenizado: formData.avisoIndenizado }).feriasProp + calculateSeverance(formData.salarioBase, formData.admissao, { multaFgts: clientConfig.folhaMultaFgts || 40 }, { avisoIndenizado: formData.avisoIndenizado }).umTercoFerias },
                  ].map((item, idx) => (
                    <div key={idx}>
                      <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest mb-0.5">{item.label}</p>
                      <p className="text-xs font-bold text-muted-foreground">{formatCurrency(item.val)}</p>
                    </div>
                  ))}
                </div>
              )}
           </div>

           <div className="flex justify-end gap-3 pt-6">
              <button 
                onClick={() => { setIsAdding(false); setEditingId(null); }}
                className="px-4 md:px-6 py-2 md:py-2.5 text-[10px] font-black uppercase text-muted-foreground hover:text-muted-foreground underline transition-all"
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
      )}

      <div className="bg-white rounded-3xl border border-border overflow-hidden shadow-sm">
         <div className="overflow-x-auto">
           <table className="w-full text-left">
             <thead className="bg-slate-50">
               <tr>
                 <th className="px-4 md:px-6 py-2.5 md:py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Nome / Cargo</th>
                 <th className="px-4 md:px-6 py-2.5 md:py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Área</th>
                 <th className="px-4 md:px-6 py-2.5 md:py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Vínculo</th>
                 <th className="px-4 md:px-6 py-2.5 md:py-4 text-right text-[10px] font-black text-muted-foreground uppercase tracking-widest">Salário Base</th>
                 <th className="px-4 md:px-6 py-2.5 md:py-4 text-right text-[10px] font-black text-muted-foreground uppercase tracking-widest">Ações</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-slate-100">
               {employees.length === 0 ? (
                   <tr>
                     <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground italic text-sm">
                        Nenhum colaborador cadastrado para este cliente.
                     </td>
                   </tr>
                 ) : (
                   employees.map(emp => (
                     <tr key={emp.id} className="hover:bg-slate-50/50 transition-colors">
                       <td className="px-4 md:px-6 py-2.5 md:py-4">
                          <p className="text-xs font-bold text-muted-foreground">{emp.nome}</p>
                          <p className="text-[10px] text-muted-foreground font-medium">{emp.funcao}</p>
                       </td>
                       <td className="px-4 md:px-6 py-2.5 md:py-4 text-[10px] font-black text-muted-foreground uppercase tracking-tighter">
                          {emp.area}
                       </td>
                       <td className="px-4 md:px-6 py-2.5 md:py-4">
                          <span className="px-2 py-0.5 bg-slate-50 border border-border rounded text-[9px] font-black text-muted-foreground uppercase">{emp.tipoContrato}</span>
                       </td>
                       <td className="px-4 md:px-6 py-2.5 md:py-4 text-right font-mono text-xs font-bold text-muted-foreground">
                          {formatCurrency(emp.salarioBase)}
                       </td>
                       <td className="px-4 md:px-6 py-2.5 md:py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                             <button 
                               onClick={() => {
                                  setEditingId(emp.id);
                                  setFormData({ ...initialForm, ...emp });
                                  setIsAdding(true);
                               }}
                               className="p-1.5 text-muted-foreground hover:text-blue-600 transition-colors"
                             >
                                <Edit3 size={14} />
                             </button>
                             <button 
                               onClick={() => handleDelete(emp.id)}
                               className="p-1.5 text-muted-foreground hover:text-rose-500 transition-colors"
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
