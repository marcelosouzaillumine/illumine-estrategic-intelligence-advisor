
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
import { useEmployeeManagerAdapter } from '../../../../adapters/ui/useEmployeeManagerAdapter';
import { formatCurrency } from '../../../../lib/utils';
import { calculateSeverance } from '../../../../services/taxService';
import { ExecutiveTable, ExecutiveTableHeader, ExecutiveTableBody, ExecutiveTableRow, ExecutiveTableHead, ExecutiveTableCell } from '../../../../components/ui/executive-table';
import { ExecutiveSurface } from '../../../../components/ui/executive-surface';
import { ExecutiveHeading } from '../../../../components/ui/executive-heading';
import { Input } from '../../../../components/ui/input';
import { Label } from '../../../../components/ui/label';
import { Button } from '../../../../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../components/ui/select';

export function EmployeeManager({ clientId, clientConfig }: { clientId: string, clientConfig: any }) {
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
  const { employees, loading, handleSave: saveAdapter, handleDelete } = useEmployeeManagerAdapter(clientId, clientConfig);

  const handleSave = () => {
    saveAdapter(formData, editingId, () => {
      setIsAdding(false);
      setEditingId(null);
      setFormData(initialForm);
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-surface-container rounded-xl flex items-center justify-center text-primary border border-border shadow-sm">
            <Users size={20} />
          </div>
          <div>
            <ExecutiveHeading as="h4" className="text-sm">Colaboradores</ExecutiveHeading>
            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Gerencie o quadro de pessoal para cálculos de custos.</p>
          </div>
        </div>
        {!isAdding && (
          <Button 
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 shadow-lg"
          >
            <Plus size={14} /> Adicionar Colaborador
          </Button>
        )}
      </div>

      {isAdding && (
        <ExecutiveSurface className="space-y-8">
           <div className="flex items-center justify-between">
              <ExecutiveHeading as="h5" className="flex items-center gap-2">
                 {editingId ? <Edit3 size={16} /> : <Plus size={16} />} 
                 {editingId ? 'Editar Colaborador' : 'Adicionar Colaborador'}
              </ExecutiveHeading>
              <Button variant="ghost" size="icon" onClick={() => { setIsAdding(false); setEditingId(null); }} className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors rounded-full">
                 <X size={20} />
              </Button>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label>Nome Completo</Label>
                <Input 
                  type="text" 
                  value={formData.nome}
                  onChange={e => setFormData({...formData, nome: e.target.value})}
                  className="w-full h-12 bg-background shadow-sm font-bold"
                />
              </div>
              <div className="space-y-2">
                <Label>Função / Cargo</Label>
                <Input 
                  type="text" 
                  value={formData.funcao}
                  onChange={e => setFormData({...formData, funcao: e.target.value})}
                  className="w-full h-12 bg-background shadow-sm font-bold"
                />
              </div>
              <div className="space-y-2">
                <Label>Área / Depto</Label>
                <Input 
                  type="text" 
                  value={formData.area}
                  onChange={e => setFormData({...formData, area: e.target.value})}
                  className="w-full h-12 bg-background shadow-sm font-bold"
                />
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pt-4 border-t border-border">
              <div className="space-y-2">
                <Label>Vínculo</Label>
                <Select 
                  value={formData.tipoContrato}
                  onValueChange={val => setFormData({...formData, tipoContrato: val})}
                >
                  <SelectTrigger className="w-full h-12 bg-background shadow-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CLT">CLT</SelectItem>
                    <SelectItem value="PJ">PJ / Terceirizado</SelectItem>
                    <SelectItem value="Estagiário">Estagiário</SelectItem>
                    <SelectItem value="Temporário">Temporário</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select 
                  value={formData.status}
                  onValueChange={val => setFormData({...formData, status: val})}
                >
                  <SelectTrigger className="w-full h-12 bg-background shadow-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Ativo">Ativo</SelectItem>
                    <SelectItem value="Afastado">Afastado</SelectItem>
                    <SelectItem value="Desligado">Desligado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Data Admissão</Label>
                <Input 
                  type="date" 
                  value={formData.admissao}
                  onChange={e => setFormData({...formData, admissao: e.target.value})}
                  className="w-full h-12 bg-background shadow-sm font-bold"
                />
              </div>
              <div className="space-y-2">
                <Label>Salário Base (R$)</Label>
                <Input 
                  type="number" 
                  value={formData.salarioBase}
                  onChange={e => setFormData({...formData, salarioBase: e.target.value})}
                  className="w-full h-12 bg-background shadow-sm font-bold [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </div>
           </div>

           <div className="bg-background p-6 rounded-2xl border border-border space-y-4 shadow-sm">
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
                    <div className="w-8 h-4 bg-slate-200 rounded-full peer peer-checked:bg-primary transition-colors"></div>
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
              <Button 
                variant="ghost"
                onClick={() => { setIsAdding(false); setEditingId(null); }}
              >
                Cancelar
              </Button>
              <Button 
                onClick={handleSave}
                disabled={loading}
                className="flex items-center gap-2 shadow-lg"
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : editingId ? <Save size={16} /> : <CheckCircle2 size={16} />}
                {editingId ? 'Salvar Edição' : 'Cadastrar Colaborador'}
              </Button>
           </div>
        </ExecutiveSurface>
      )}

      <ExecutiveSurface padding="none" className="overflow-hidden">
         <div className="overflow-x-auto">
           <ExecutiveTable className="w-full text-left">
             <ExecutiveTableHeader className="bg-slate-50">
               <ExecutiveTableRow>
                 <ExecutiveTableHead className="px-4 md:px-6 py-2.5 md:py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Nome / Cargo</ExecutiveTableHead>
                 <ExecutiveTableHead className="px-4 md:px-6 py-2.5 md:py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Área</ExecutiveTableHead>
                 <ExecutiveTableHead className="px-4 md:px-6 py-2.5 md:py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Vínculo</ExecutiveTableHead>
                 <ExecutiveTableHead className="px-4 md:px-6 py-2.5 md:py-4 text-right text-[10px] font-black text-muted-foreground uppercase tracking-widest">Salário Base</ExecutiveTableHead>
                 <ExecutiveTableHead className="px-4 md:px-6 py-2.5 md:py-4 text-right text-[10px] font-black text-muted-foreground uppercase tracking-widest">Ações</ExecutiveTableHead>
               </ExecutiveTableRow>
             </ExecutiveTableHeader>
             <ExecutiveTableBody className="divide-y divide-slate-100">
               {employees.length === 0 ? (
                   <ExecutiveTableRow>
                     <ExecutiveTableCell colSpan={5} className="px-6 py-12 text-center text-muted-foreground italic text-sm">
                        Nenhum colaborador cadastrado para este cliente.
                     </ExecutiveTableCell>
                   </ExecutiveTableRow>
                 ) : (
                   employees.map(emp => (
                     <ExecutiveTableRow key={emp.id} className="hover:bg-slate-50/50 transition-colors">
                       <ExecutiveTableCell className="px-4 md:px-6 py-2.5 md:py-4">
                          <p className="text-xs font-bold text-muted-foreground">{emp.nome}</p>
                          <p className="text-[10px] text-muted-foreground font-medium">{emp.funcao}</p>
                       </ExecutiveTableCell>
                       <ExecutiveTableCell className="px-4 md:px-6 py-2.5 md:py-4 text-[10px] font-black text-muted-foreground uppercase tracking-tighter">
                          {emp.area}
                       </ExecutiveTableCell>
                       <ExecutiveTableCell className="px-4 md:px-6 py-2.5 md:py-4">
                          <span className="px-2 py-0.5 bg-slate-50 border border-border rounded text-[9px] font-black text-muted-foreground uppercase">{emp.tipoContrato}</span>
                       </ExecutiveTableCell>
                       <ExecutiveTableCell className="px-4 md:px-6 py-2.5 md:py-4 text-right font-mono text-xs font-bold text-muted-foreground">
                          {formatCurrency(emp.salarioBase)}
                       </ExecutiveTableCell>
                       <ExecutiveTableCell className="px-4 md:px-6 py-2.5 md:py-4 text-right">
                           <div className="flex items-center justify-end gap-2">
                              <Button 
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                   setEditingId(emp.id);
                                   setFormData({ ...initialForm, ...emp });
                                   setIsAdding(true);
                                }}
                                className="text-muted-foreground hover:bg-secondary/10 hover:text-secondary transition-colors rounded-full"
                              >
                                 <Edit3 size={14} />
                              </Button>
                              <Button 
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDelete(emp.id)}
                                className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors rounded-full"
                              >
                                 <Trash2 size={14} />
                              </Button>
                           </div>
                       </ExecutiveTableCell>
                     </ExecutiveTableRow>
                   ))
                 )}
               </ExecutiveTableBody>
             </ExecutiveTable>
           </div>
        </ExecutiveSurface>
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
