import React, { useState } from 'react';
import { 
  Users, 
  Plus, 
  Upload, 
  GitFork, 
  Layers, 
  TrendingUp, 
  CheckCircle2, 
  AlertCircle,
  Search,
  ChevronRight,
  MoreVertical,
  Building2,
  Trash2,
  Edit2,
  Save,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PageHeader, SectionHeader, StatusBadge } from '../Common';
import { cn } from '../../lib/utils';
import { db } from '../../lib/firebase';
import { collection, query, where, onSnapshot, doc, setDoc, serverTimestamp } from 'firebase/firestore';

interface OrgNode {
  id: string;
  name: string;
  role: string;
  department: string;
  parentId: string | null;
  type: 'executive' | 'management' | 'operational';
}

export function AvaliacaoOrganogramaPage({ clientId }: { clientId: string }) {
  const [nodes, setNodes] = useState<OrgNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [viewMode, setViewMode] = useState<'visual' | 'manual'>('visual');
  const [isAdding, setIsAdding] = useState(false);
  const [newNode, setNewNode] = useState<Partial<OrgNode>>({
    name: '',
    role: '',
    department: '',
    type: 'operational',
    parentId: null
  });

  // Load data from Firestore
  React.useEffect(() => {
    if (!clientId) return;
    setLoading(true);
    
    const q = query(collection(db, 'org_charts'), where('clientId', '==', clientId));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const data = snapshot.docs[0].data();
        setNodes(data.nodes || []);
      } else {
        setNodes([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [clientId]);

  const handleSave = async () => {
    if (!clientId) return;
    setIsSaving(true);
    try {
      // Use a fixed doc ID based on clientId to avoid duplicates
      const docRef = doc(db, 'org_charts', `org_${clientId}`);
      await setDoc(docRef, {
        clientId,
        nodes,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error saving org chart:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddNode = () => {
    if (newNode.name && newNode.role) {
      const node: OrgNode = {
        id: Math.random().toString(36).substr(2, 9),
        name: newNode.name,
        role: newNode.role,
        department: newNode.department || 'Geral',
        parentId: newNode.parentId || null,
        type: newNode.type || 'operational'
      };
      setNodes([...nodes, node]);
      setIsAdding(false);
      setNewNode({ name: '', role: '', department: '', type: 'operational', parentId: null });
    }
  };

  const removeNode = (id: string) => {
    setNodes(nodes.filter(n => n.id !== id));
  };

  return (
    <div className="space-y-10 pb-20">
      <PageHeader
        title="Avaliação de Organograma"
        subtitle="Analise a estrutura hierárquica, amplitude de controle e eficiência organizacional."
        actions={
          <div className="flex gap-4">
            <button 
              onClick={handleSave}
              disabled={isSaving || loading}
              className="flex items-center gap-2 px-6 py-2.5 bg-emerald-500 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-emerald-500/20 hover:scale-[1.02] transition-all disabled:opacity-50"
            >
              <Save size={16} />
              {isSaving ? 'Salvando...' : 'Salvar Alterações'}
            </button>
            <button className="flex items-center gap-2 px-6 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-50 transition-all">
              <Upload size={16} />
              Importar Dados
            </button>
            <button 
              onClick={() => {
                setViewMode('manual');
                setIsAdding(true);
              }}
              className="flex items-center gap-2 px-6 py-2.5 bg-secondary text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-secondary/20 hover:scale-[1.02] transition-all"
            >
              <Plus size={16} />
              Criar Estrutura
            </button>
          </div>
        }
      />

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Stats Summary */}
        {[
          { label: 'Total de Colaboradores', value: nodes.length, icon: Users, color: 'text-primary' },
          { label: 'Níveis Hierárquicos', value: '3', icon: Layers, color: 'text-secondary' },
          { label: 'Departamentos', value: new Set(nodes.map(n => n.department)).size, icon: Building2, color: 'text-emerald-500' },
          { label: 'Amplitude de Controle', value: '1:6', icon: GitFork, color: 'text-indigo-500' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-premium flex items-center gap-4">
            <div className={cn("w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center", stat.color)}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
              <p className="text-2xl font-display font-black text-primary">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-2 p-1.5 bg-bg-surface/50 backdrop-blur-xl border border-white/20 rounded-2xl w-fit">
        <button
          onClick={() => setViewMode('visual')}
          className={cn(
            "flex items-center gap-3 px-6 py-3 rounded-xl text-xs font-bold transition-all",
            viewMode === 'visual' ? "bg-white text-primary shadow-premium" : "text-text-dim hover:text-text-main"
          )}
        >
          <GitFork size={16} />
          Visualização Gráfica
        </button>
        <button
          onClick={() => setViewMode('manual')}
          className={cn(
            "flex items-center gap-3 px-6 py-3 rounded-xl text-xs font-bold transition-all",
            viewMode === 'manual' ? "bg-white text-primary shadow-premium" : "text-text-dim hover:text-text-main"
          )}
        >
          <Users size={16} />
          Inserção Manual
        </button>
      </div>

      <AnimatePresence mode="wait">
        {viewMode === 'manual' ? (
          <motion.div 
            key="manual"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            <div className="bg-white rounded-[32px] border border-slate-100 shadow-premium overflow-hidden">
              <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
                <SectionHeader title="Gestão de Estrutura" subtitle="Adicione ou remova cargos e departamentos manualmente." icon={Building2} />
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="Buscar colaborador..." 
                    className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-primary transition-all w-64"
                  />
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                </div>
              </div>

              <div className="p-8 overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                      <th className="pb-4 px-4">Colaborador</th>
                      <th className="pb-4 px-4">Cargo</th>
                      <th className="pb-4 px-4">Departamento</th>
                      <th className="pb-4 px-4">Nível</th>
                      <th className="pb-4 px-4">Superior</th>
                      <th className="pb-4 px-4 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {nodes.map((node) => (
                      <tr key={node.id} className="group hover:bg-slate-50/50 transition-colors">
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                              {node.name.charAt(0)}
                            </div>
                            <span className="text-sm font-bold text-slate-700">{node.name}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-sm text-slate-600">{node.role}</span>
                        </td>
                        <td className="py-4 px-4">
                          <span className="px-3 py-1 bg-slate-100 rounded-lg text-[10px] font-bold text-slate-500 uppercase tracking-tight">
                            {node.department}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <StatusBadge status={node.type === 'executive' ? 'Verde' : node.type === 'management' ? 'Amarelo' : 'Azul'} label={node.type} />
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-sm text-slate-400">
                            {nodes.find(n => n.id === node.parentId)?.name || '-'}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="p-2 text-slate-400 hover:text-primary transition-colors">
                              <Edit2 size={14} />
                            </button>
                            <button 
                              onClick={() => removeNode(node.id)}
                              className="p-2 text-slate-400 hover:text-rose-500 transition-colors"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {isAdding && (
                      <tr className="bg-secondary/5">
                        <td className="py-4 px-4">
                          <input 
                            type="text" 
                            placeholder="Nome"
                            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-secondary"
                            value={newNode.name}
                            onChange={e => setNewNode({...newNode, name: e.target.value})}
                          />
                        </td>
                        <td className="py-4 px-4">
                          <input 
                            type="text" 
                            placeholder="Cargo"
                            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-secondary"
                            value={newNode.role}
                            onChange={e => setNewNode({...newNode, role: e.target.value})}
                          />
                        </td>
                        <td className="py-4 px-4">
                          <input 
                            type="text" 
                            placeholder="Depto"
                            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-secondary"
                            value={newNode.department}
                            onChange={e => setNewNode({...newNode, department: e.target.value})}
                          />
                        </td>
                        <td className="py-4 px-4">
                          <select 
                            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-secondary"
                            value={newNode.type}
                            onChange={e => setNewNode({...newNode, type: e.target.value as any})}
                          >
                            <option value="executive">Executivo</option>
                            <option value="management">Gerencial</option>
                            <option value="operational">Operacional</option>
                          </select>
                        </td>
                        <td className="py-4 px-4">
                          <select 
                            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-secondary"
                            value={newNode.parentId || ''}
                            onChange={e => setNewNode({...newNode, parentId: e.target.value || null})}
                          >
                            <option value="">Nenhum</option>
                            {nodes.map(n => <option key={n.id} value={n.id}>{n.name}</option>)}
                          </select>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button 
                              onClick={handleAddNode}
                              className="p-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
                            >
                              <Save size={14} />
                            </button>
                            <button 
                              onClick={() => setIsAdding(false)}
                              className="p-2 bg-slate-200 text-slate-600 rounded-lg hover:bg-slate-300 transition-colors"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="visual"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="bg-white rounded-[40px] border border-slate-100 shadow-premium p-12 min-h-[600px] flex flex-col items-center"
          >
            {nodes.length > 0 ? (
              <div className="w-full max-w-4xl space-y-12">
                {/* CEO Level */}
                <div className="flex justify-center">
                  {nodes.filter(n => n.parentId === null).map(node => (
                    <OrgCard key={node.id} node={node} />
                  ))}
                </div>

                {/* Connector line */}
                <div className="flex justify-center h-8">
                  <div className="w-px bg-slate-200" />
                </div>

                {/* Sub Levels (Simplified for render) */}
                <div className="flex justify-center gap-16 relative flex-wrap">
                   {nodes.filter(n => n.parentId !== null && nodes.some(p => p.id === n.parentId && p.parentId === null)).map(node => (
                     <div key={node.id} className="relative pt-8">
                       <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-8 bg-slate-200" />
                       <OrgCard node={node} />
                     </div>
                   ))}
                </div>

                <div className="mt-20 p-8 bg-secondary/5 border border-secondary/10 rounded-3xl flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center shrink-0">
                    <TrendingUp size={24} className="text-secondary" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-secondary uppercase tracking-widest mb-1">Diagnóstico de Estrutura</h4>
                    <p className="text-xs text-slate-600 leading-relaxed max-w-2xl">
                      Sua estrutura atual apresenta uma amplitude de controle saudável na diretoria. Recomendamos avaliar se os níveis gerenciais possuem autonomia suficiente para reduzir a dependência da alta cúpula em decisões operacionais.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center space-y-6 opacity-40 py-20">
                <GitFork size={80} strokeWidth={1} className="text-slate-300" />
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-slate-900">Nenhum dado de organograma</h3>
                  <p className="text-sm text-slate-500 max-w-sm">Inicie a criação da estrutura organizacional manualmente ou importe os dados da sua planilha.</p>
                </div>
                <button 
                  onClick={() => {
                    setViewMode('manual');
                    setIsAdding(true);
                  }}
                  className="px-8 py-3 bg-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest"
                >
                  Começar Estrutura
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function OrgCard({ node }: { node: OrgNode }) {
  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-lg min-w-[200px] text-center hover:border-primary/30 transition-all cursor-default">
      <div className={cn(
        "w-10 h-10 rounded-xl mx-auto mb-3 flex items-center justify-center text-white",
        node.type === 'executive' ? "bg-primary" : "bg-secondary"
      )}>
        {node.name.charAt(0)}
      </div>
      <p className="text-sm font-black text-primary truncate">{node.name}</p>
      <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest truncate">{node.role}</p>
      <div className="mt-3 pt-3 border-t border-slate-50">
        <span className="text-[9px] font-black text-slate-300 uppercase tracking-tighter bg-slate-50 px-2 py-0.5 rounded">
          {node.department}
        </span>
      </div>
    </div>
  );
}
