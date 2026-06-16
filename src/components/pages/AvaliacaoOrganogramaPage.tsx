import React, { useState } from 'react';
import { Users, Plus, Upload, GitFork, Layers, TrendingUp, CheckCircle2, AlertCircle, Search, ChevronRight, MoreVertical, Building2, Trash2, Edit2, Save, X } from 'lucide-react';
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
        id: crypto.randomUUID(),
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
        icon={GitFork}
        color="executive"
        actions={
          <div className="flex gap-4">
            <button 
              onClick={handleSave}
              disabled={isSaving || loading}
              className="btn-executive bg-success"
            >
              <Save size={16} />
              {isSaving ? 'Salvando...' : 'Salvar Alterações'}
            </button>
            <button className="btn-executive bg-card border border-border -foreground">
              <Upload size={16} />
              Importar Dados
            </button>
            <button 
              onClick={() => {
                setViewMode('manual');
                setIsAdding(true);
              }}
              className="btn-executive bg-secondary"
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
          { label: 'Departamentos', value: new Set(nodes.map(n => n.department)).size, icon: Building2, color: 'text-success' },
          { label: 'Amplitude de Controle', value: '1:6', icon: GitFork, color: 'text-primary' },
        ].map((stat, i) => (
          <div key={i} className="card-premium p-6 flex items-center gap-4">
            <div className={cn("w-12 h-12 rounded-md bg-surface-container flex items-center justify-center shadow-inner", stat.color)}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">{stat.label}</p>
              <p className="text-2xl font-medium text-foreground tracking-tighter">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-2 p-1 bg-surface-container/60 backdrop-blur-sm border border-border rounded-md w-fit -mt-6">
        <button
          onClick={() => setViewMode('visual')}
          className={cn(
            "flex items-center gap-3 px-4 md:px-6 py-2 md:py-2.5 rounded-md text-[10px] font-medium uppercase tracking-widest transition-all",
            viewMode === 'visual' ? "bg-card text-foreground shadow-premium border border-border" : "text-muted-foreground hover:text-foreground"
          )}
        >
          <GitFork size={14} />
          Visualização Gráfica
        </button>
        <button
          onClick={() => setViewMode('manual')}
          className={cn(
            "flex items-center gap-3 px-4 md:px-6 py-2 md:py-2.5 rounded-md text-[10px] font-medium uppercase tracking-widest transition-all",
            viewMode === 'manual' ? "bg-card text-foreground shadow-premium border border-border" : "text-muted-foreground hover:text-foreground"
          )}
        >
          <Users size={14} />
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
            <div className="card-premium overflow-hidden">
              <div className="p-8 border-b border-border flex justify-between items-center bg-surface-container/30">
                <SectionHeader title="Gestão de Estrutura" subtitle="Adicione ou remova cargos e departamentos manualmente." icon={Building2} />
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="Buscar colaborador..." 
                    className="pl-10 pr-4 py-2 bg-card border border-border rounded-md text-xs font-medium focus:outline-none focus:border-secondary transition-all w-64 uppercase tracking-widest"
                  />
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                </div>
              </div>

              <div className="p-8 overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest border-b border-border">
                      <th className="pb-4 px-4">Colaborador</th>
                      <th className="pb-4 px-4">Cargo</th>
                      <th className="pb-4 px-4">Departamento</th>
                      <th className="pb-4 px-4">Nível</th>
                      <th className="pb-4 px-4">Superior</th>
                      <th className="pb-4 px-4 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {nodes.map((node) => (
                      <tr key={node.id} className="group hover:bg-surface-container/30 transition-colors">
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center text-primary font-medium text-xs shadow-inner">
                              {node.name.charAt(0)}
                            </div>
                            <span className="text-xs font-medium text-foreground uppercase tracking-widest">{node.name}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">{node.role}</span>
                        </td>
                        <td className="py-4 px-4">
                          <span className="px-3 py-1 bg-surface-container rounded-md text-[10px] font-medium text-muted-foreground uppercase tracking-widest border border-border">
                            {node.department}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <StatusBadge status={node.type === 'executive' ? 'Verde' : node.type === 'management' ? 'Amarelo' : 'Azul'} label={node.type} />
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-[10px] font-medium text-muted-foreground/40 uppercase tracking-widest">
                            {nodes.find(n => n.id === node.parentId)?.name || '-'}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="p-2 text-muted-foreground hover:text-primary transition-colors">
                              <Edit2 size={14} />
                            </button>
                            <button 
                              onClick={() => removeNode(node.id)}
                              className="p-2 text-muted-foreground hover:text-destructive transition-colors"
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
                            className="w-full bg-card border border-border rounded-md px-3 py-1.5 text-[10px] font-medium uppercase tracking-widest outline-none focus:border-secondary"
                            value={newNode.name}
                            onChange={e => setNewNode({...newNode, name: e.target.value})}
                          />
                        </td>
                        <td className="py-4 px-4">
                          <input 
                            type="text" 
                            placeholder="Cargo"
                            className="w-full bg-card border border-border rounded-md px-3 py-1.5 text-[10px] font-medium uppercase tracking-widest outline-none focus:border-secondary"
                            value={newNode.role}
                            onChange={e => setNewNode({...newNode, role: e.target.value})}
                          />
                        </td>
                        <td className="py-4 px-4">
                          <input 
                            type="text" 
                            placeholder="Depto"
                            className="w-full bg-card border border-border rounded-md px-3 py-1.5 text-[10px] font-medium uppercase tracking-widest outline-none focus:border-secondary"
                            value={newNode.department}
                            onChange={e => setNewNode({...newNode, department: e.target.value})}
                          />
                        </td>
                        <td className="py-4 px-4">
                          <select 
                            className="w-full bg-card border border-border rounded-md px-3 py-1.5 text-[10px] font-medium uppercase tracking-widest outline-none focus:border-secondary"
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
                            className="w-full bg-card border border-border rounded-md px-3 py-1.5 text-[10px] font-medium uppercase tracking-widest outline-none focus:border-secondary"
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
                              className="p-2 bg-success text-white rounded-md hover:opacity-90 transition-opacity shadow-sm"
                            >
                              <Save size={14} />
                            </button>
                            <button 
                              onClick={() => setIsAdding(false)}
                              className="p-2 bg-surface-container text-muted-foreground rounded-md hover:bg-border transition-colors"
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
            className="card-premium p-12 min-h-[600px] flex flex-col items-center"
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
                  <div className="w-px bg-border" />
                </div>

                {/* Sub Levels (Simplified for render) */}
                <div className="flex justify-center gap-16 relative flex-wrap">
                   {nodes.filter(n => n.parentId !== null && nodes.some(p => p.id === n.parentId && p.parentId === null)).map(node => (
                     <div key={node.id} className="relative pt-8">
                       <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-8 bg-border" />
                       <OrgCard node={node} />
                     </div>
                   ))}
                </div>

                <div className="mt-20 p-8 bg-secondary/5 border border-secondary/10 rounded-md flex items-start gap-4 shadow-inner">
                  <div className="w-12 h-12 rounded-md bg-secondary/10 flex items-center justify-center shrink-0 shadow-inner">
                    <TrendingUp size={24} className="text-secondary" />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-medium text-secondary uppercase tracking-widest mb-1">Diagnóstico de Estrutura</h4>
                    <p className="text-[11px] text-muted-foreground leading-relaxed max-w-2xl font-medium">
                      Sua estrutura atual apresenta uma amplitude de controle saudável na diretoria. Recomendamos avaliar se os níveis gerenciais possuem autonomia suficiente para reduzir a dependência da alta cúpula em decisões operacionais.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center space-y-6 opacity-40 py-20">
                <GitFork size={80} strokeWidth={1} className="text-muted-foreground" />
                <div className="space-y-2">
                  <h3 className="text-h2 font-medium text-foreground tracking-tight">Nenhum dado de organograma</h3>
                  <p className="text-[11px] text-muted-foreground max-w-2xl font-medium">Inicie a criação da estrutura organizacional manualmente ou importe os dados da sua planilha.</p>
                </div>
                <button 
                  onClick={() => {
                    setViewMode('manual');
                    setIsAdding(true);
                  }}
                  className="btn-executive bg-secondary"
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
    <div className="bg-card border border-border rounded-md p-4 shadow-premium min-w-[200px] text-center hover:border-secondary/30 transition-all cursor-default">
      <div className={cn(
        "w-10 h-10 rounded-md mx-auto mb-3 flex items-center justify-center text-white shadow-inner",
        node.type === 'executive' ? "bg-executive" : "bg-secondary"
      )}>
        {node.name.charAt(0)}
      </div>
      <p className="text-xs font-medium text-foreground uppercase tracking-widest">{node.name}</p>
      <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest mt-0.5">{node.role}</p>
      <div className="mt-3 pt-3 border-t border-border">
        <span className="text-[9px] font-medium text-muted-foreground uppercase tracking-widest bg-surface-container px-2 py-0.5 rounded-sm border border-border">
          {node.department}
        </span>
      </div>
    </div>
  );
}
