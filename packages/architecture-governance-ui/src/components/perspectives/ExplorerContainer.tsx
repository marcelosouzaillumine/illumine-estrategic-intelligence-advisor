import React, { useState, useEffect } from 'react';
import { ArchitectureExplorerModel, EnrichedArtifact } from '../../read-model/ArchitectureExplorerModel';
import { SnapshotHttpAdapter } from '../../adapters/SnapshotReader';
import { ArchitectureGraphViewer } from '../graph/ArchitectureGraphViewer';
import { CapabilityView } from './CapabilityView';
import { EvidenceViewer } from '../evidence/EvidenceViewer';

export const ExplorerContainer: React.FC = () => {
  const [model, setModel] = useState<ArchitectureExplorerModel | null>(null);
  const [capabilities, setCapabilities] = useState<EnrichedArtifact[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'DETAILS' | 'EVIDENCE' | 'AUDIT' | 'INTELLIGENCE' | 'EVOLUTION' | 'ADVISORY' | 'EXPOSURE' | 'DECISION' | 'KNOWLEDGE' | 'RECOMMENDATION'>('DETAILS');

  useEffect(() => {
    const loadModel = async () => {
      // Usamos a raiz do servidor web local para acessar a pasta artifacts (supondo proxy configurado ou mapeamento public)
      const adapter = new SnapshotHttpAdapter('/artifacts');
      const m = new ArchitectureExplorerModel(adapter);
      await m.load();
      setModel(m);
      setCapabilities(m.getCapabilities());
    };
    loadModel();
  }, []);

  if (!model) {
    return <div className="p-8 text-white">Loading Architecture Graph...</div>;
  }

  const globalMetrics = model.getGlobalMetrics();
  const selectedArtifact = selectedId ? model.getArtifactDetails(selectedId) : null;

  return (
    <div className="bg-[#09090b] min-h-screen text-white p-6 font-sans">
      <header className="mb-6 flex justify-between items-center border-b border-[#2a2a2f] pb-4">
        <div>
          <h1 className="text-2xl font-semibold">Architecture Governance Explorer</h1>
          <p className="text-sm text-white/50 mt-1">Read-only structural observation surface.</p>
        </div>
        <div className="flex gap-4 text-sm text-white/60">
          <div className="bg-[#121214] border border-[#2a2a2f] px-4 py-2 rounded">
            Capabilities: <span className="text-white font-medium">{globalMetrics.totalCapabilities}</span>
          </div>
          <div className="bg-[#121214] border border-[#2a2a2f] px-4 py-2 rounded">
            Artifacts: <span className="text-white font-medium">{globalMetrics.totalArtifacts}</span>
          </div>
          <div className="bg-[#121214] border border-[#2a2a2f] px-4 py-2 rounded">
            Rels: <span className="text-white font-medium">{globalMetrics.totalRelationships}</span>
          </div>
        </div>
      </header>

      <div className="flex gap-6 h-[calc(100vh-140px)]">
        {/* Main Graph Area */}
        <div className="flex-1 overflow-auto">
          <ArchitectureGraphViewer artifacts={capabilities} onSelectArtifact={setSelectedId} />
        </div>

        {/* Sidebar Insights */}
        <div className="w-96 flex flex-col gap-4">
          {selectedArtifact ? (
            <>
              <div className="flex gap-2">
                <button 
                  className={`flex-1 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'DETAILS' ? 'border-white text-white' : 'border-transparent text-white/50 hover:text-white/80'}`}
                  onClick={() => setActiveTab('DETAILS')}
                >
                  Capability
                </button>
                <button 
                  className={`flex-1 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'EVIDENCE' ? 'border-white text-white' : 'border-transparent text-white/50 hover:text-white/80'}`}
                  onClick={() => setActiveTab('EVIDENCE')}
                >
                  Evidence
                </button>
                <button 
                  className={`flex-1 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'AUDIT' ? 'border-white text-white' : 'border-transparent text-white/50 hover:text-white/80'}`}
                  onClick={() => setActiveTab('AUDIT')}
                >
                  Audit Trail
                </button>
                <button 
                  className={`flex-1 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'INTELLIGENCE' ? 'border-white text-white' : 'border-transparent text-white/50 hover:text-white/80'}`}
                  onClick={() => setActiveTab('INTELLIGENCE')}
                >
                  Intelligence
                </button>
                <button 
                  className={`flex-1 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'EVOLUTION' ? 'border-white text-white' : 'border-transparent text-white/50 hover:text-white/80'}`}
                  onClick={() => setActiveTab('EVOLUTION')}
                >
                  Evolution
                </button>
                <button 
                  className={`flex-1 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'ADVISORY' ? 'border-white text-white' : 'border-transparent text-white/50 hover:text-white/80'}`}
                  onClick={() => setActiveTab('ADVISORY')}
                >
                  Advisory
                </button>
                <button 
                  className={`flex-1 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'EXPOSURE' ? 'border-amber-400 text-amber-400' : 'border-transparent text-amber-400/50 hover:text-amber-400/80'}`}
                  onClick={() => setActiveTab('EXPOSURE')}
                >
                  Exposure
                </button>
                <button 
                  className={`flex-1 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'DECISION' ? 'border-indigo-400 text-indigo-400' : 'border-transparent text-indigo-400/50 hover:text-indigo-400/80'}`}
                  onClick={() => setActiveTab('DECISION')}
                >
                  Decision
                </button>
                <button 
                  className={`flex-1 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'KNOWLEDGE' ? 'border-purple-400 text-purple-400' : 'border-transparent text-purple-400/50 hover:text-purple-400/80'}`}
                  onClick={() => setActiveTab('KNOWLEDGE')}
                >
                  Knowledge
                </button>
                <button 
                  className={`flex-1 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'RECOMMENDATION' ? 'border-emerald-400 text-emerald-400' : 'border-transparent text-emerald-400/50 hover:text-emerald-400/80'}`}
                  onClick={() => setActiveTab('RECOMMENDATION')}
                >
                  Recommendation
                </button>
              </div>

              <div className="flex-1 overflow-hidden">
                {activeTab === 'DETAILS' && <CapabilityView artifact={selectedArtifact} />}
                {activeTab === 'EVIDENCE' && <EvidenceViewer artifact={selectedArtifact} />}
                {activeTab === 'AUDIT' && (
                  <div className="bg-[#121214] border border-[#2a2a2f] rounded-lg p-4 h-full overflow-y-auto">
                    <h3 className="text-xs font-semibold uppercase text-white/40 mb-4">Governance History</h3>
                    <div className="space-y-4">
                      <div className="border-l-2 border-[#2a2a2f] pl-4">
                        <p className="text-sm">DISCOVERY_COMPLETED</p>
                        <p className="text-xs text-white/40">system.discovery_engine • Snapshot v1</p>
                      </div>
                      <div className="border-l-2 border-[#2a2a2f] pl-4">
                        <p className="text-sm">EVALUATION_CREATED</p>
                        <p className="text-xs text-white/40">system.evaluation_layer • Snapshot v1</p>
                      </div>
                      <div className="border-l-2 border-[#2a2a2f] pl-4">
                        <p className="text-sm">CERTIFICATION_ISSUED</p>
                        <p className="text-xs text-white/40">system.certification_engine • CERT-0001</p>
                      </div>
                    </div>
                  </div>
                )}
                {activeTab === 'INTELLIGENCE' && (
                  <div className="bg-[#121214] border border-[#2a2a2f] rounded-lg p-4 h-full overflow-y-auto flex flex-col gap-6">
                    <div>
                      <h3 className="text-xs font-semibold uppercase text-white/40 mb-2">Structural Insights</h3>
                      <div className="p-3 border border-[#2a2a2f] rounded bg-[#1a1a1e]">
                        <p className="text-sm font-mono text-blue-400">[BOUNDARY_CHANGE]</p>
                        <p className="text-sm mt-1">Metric BOUNDARY-COHESION recorded value 0.9 on engine-payment-001</p>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xs font-semibold uppercase text-white/40 mb-2">Propagation Map</h3>
                      <div className="p-3 border border-[#2a2a2f] rounded bg-[#1a1a1e]">
                        <p className="text-sm">Target: <span className="font-mono text-white/70">engine-payment-001</span></p>
                        <p className="text-sm mt-1 text-white/60">Affected: engine-billing-001 (Depth: 1)</p>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xs font-semibold uppercase text-white/40 mb-2">Evidence Chain</h3>
                      <p className="text-xs text-white/50 font-mono">
                        Discovery: DISCOVERY-SNAPSHOT-v1<br/>
                        Evaluation: EVALUATION-SNAPSHOT-v1<br/>
                        Certification: CERTIFICATION-0001
                      </p>
                    </div>
                  </div>
                )}
                {activeTab === 'EVOLUTION' && (
                  <div className="bg-[#121214] border border-[#2a2a2f] rounded-lg p-4 h-full overflow-y-auto flex flex-col gap-6">
                    <div>
                      <h3 className="text-xs font-semibold uppercase text-white/40 mb-2">Evolution Timeline</h3>
                      <div className="space-y-4">
                        <div className="border-l-2 border-[#2a2a2f] pl-4">
                          <p className="text-sm font-mono text-white/40">Jan 2026</p>
                          <p className="text-sm text-green-400 mt-1">+ Created</p>
                          <p className="text-xs text-white/60">FinancialReportContract</p>
                        </div>
                        <div className="border-l-2 border-[#2a2a2f] pl-4">
                          <p className="text-sm font-mono text-white/40">Feb 2026</p>
                          <p className="text-sm text-blue-400 mt-1">Modified</p>
                          <p className="text-xs text-white/60">PaymentEngine</p>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xs font-semibold uppercase text-white/40 mb-2">Snapshot Diff Explorer</h3>
                      <div className="p-3 border border-[#2a2a2f] rounded bg-[#1a1a1e]">
                        <p className="text-sm font-mono text-white/60">v1.0 ↔ v2.0</p>
                        <p className="text-sm mt-2 text-green-400">1 Created</p>
                        <p className="text-sm text-blue-400">1 Modified</p>
                        <p className="text-sm text-red-400">0 Deleted</p>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xs font-semibold uppercase text-white/40 mb-2">Capability Trajectory</h3>
                      <div className="p-3 border border-[#2a2a2f] rounded bg-[#1a1a1e]">
                        <p className="text-sm font-semibold">Financial Intelligence</p>
                        <div className="mt-2 text-xs font-mono text-white/50 pl-2 border-l border-[#2a2a2f]">
                          v1<br/>
                          |<br/>
                          + Contract Layer<br/>
                          |<br/>
                          v2<br/>
                          |<br/>
                          + Engine Layer
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {activeTab === 'ADVISORY' && (
                  <div className="bg-[#121214] border border-[#2a2a2f] rounded-lg p-4 h-full overflow-y-auto flex flex-col gap-6">
                    <div>
                      <h3 className="text-xs font-semibold uppercase text-white/40 mb-2">Architecture Narrative</h3>
                      <div className="p-3 border border-[#2a2a2f] rounded bg-[#1a1a1e] font-serif italic text-white/80 text-sm">
                        "A capability Financial Intelligence exibiu o padrão estrutural DEPENDENCY_EXPANSION na categoria DEPENDENCY, em conjunto com BOUNDARY_EXPANSION entre os snapshots analisados. Ocorreu também uma evolução material com CHANGE_CONCENTRATION observada no período."
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xs font-semibold uppercase text-white/40 mb-2">Structural Signals</h3>
                      <div className="space-y-3">
                        <div className="p-3 border border-[#2a2a2f] rounded bg-[#1a1a1e] flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-amber-400">Dependency Expansion</p>
                            <p className="text-xs text-white/50">TOPOLOGY</p>
                          </div>
                          <span className="text-xs font-mono px-2 py-1 bg-amber-500/10 text-amber-400 rounded">HIGH CONFIDENCE</span>
                        </div>
                        <div className="p-3 border border-[#2a2a2f] rounded bg-[#1a1a1e] flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-blue-400">Boundary Expansion</p>
                            <p className="text-xs text-white/50">BOUNDARY</p>
                          </div>
                          <span className="text-xs font-mono px-2 py-1 bg-blue-500/10 text-blue-400 rounded">HIGH CONFIDENCE</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xs font-semibold uppercase text-white/40 mb-2">Evidence Chain (Graph)</h3>
                      <div className="p-3 border border-[#2a2a2f] rounded bg-[#1a1a1e]">
                        <p className="text-sm font-semibold mb-2 text-white/70">Advisory Node: NARR-12345</p>
                        <div className="border-l border-[#2a2a2f] pl-4 space-y-2 mt-2">
                          <div>
                            <p className="text-xs text-green-400">← SIG-DEP-1 (DEPENDENCY)</p>
                            <p className="text-[10px] text-white/40 pl-3">↳ OBS-1 (fan-out &gt; 15)</p>
                          </div>
                          <div>
                            <p className="text-xs text-green-400">← SIG-BND-2 (BOUNDARY)</p>
                            <p className="text-[10px] text-white/40 pl-3">↳ OBS-3 (contracts added)</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {activeTab === 'EXPOSURE' && (
                  <div className="bg-[#121214] border border-[#2a2a2f] rounded-lg p-4 h-full overflow-y-auto flex flex-col gap-6">
                    <div>
                      <h3 className="text-xs font-semibold uppercase text-white/40 mb-2">Architecture Exposure Index</h3>
                      <div className="p-4 border border-[#2a2a2f] rounded bg-[#1a1a1e] flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-white/70">Exposure Level</span>
                          <span className="text-sm font-bold text-amber-400 px-3 py-1 bg-amber-500/10 rounded">HIGH</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-white/70">Policy Version</span>
                          <span className="text-sm font-mono text-white/50">v1.0.0</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xs font-semibold uppercase text-white/40 mb-2">Exposure Factors</h3>
                      <div className="space-y-3">
                        <div className="p-3 border border-[#2a2a2f] rounded bg-[#1a1a1e] flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-white/90">Dependency Concentration Exposure</p>
                            <p className="text-xs text-white/50 mt-1">Exposure driven by DEPENDENCY architecture signal</p>
                          </div>
                          <span className="text-xs font-mono px-2 py-1 bg-amber-500/10 text-amber-400 rounded">MAGNITUDE +3</span>
                        </div>
                        <div className="p-3 border border-[#2a2a2f] rounded bg-[#1a1a1e] flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-white/90">Boundary Volatility Exposure</p>
                            <p className="text-xs text-white/50 mt-1">Exposure driven by BOUNDARY architecture signal</p>
                          </div>
                          <span className="text-xs font-mono px-2 py-1 bg-amber-500/10 text-amber-400 rounded">MAGNITUDE +2</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xs font-semibold uppercase text-white/40 mb-2">Assessment Timeline & Evidence</h3>
                      <div className="p-3 border border-[#2a2a2f] rounded bg-[#1a1a1e]">
                        <p className="text-sm font-semibold mb-2 text-white/70">Risk Assessment: ASSESS-12345</p>
                        <div className="border-l border-[#2a2a2f] pl-4 space-y-3 mt-2">
                          <div>
                            <p className="text-xs text-amber-400">← RISK-SIG-DEP-1 (DEPENDENCY_EXPANSION)</p>
                            <p className="text-[10px] text-white/50 pl-3">↳ Derived from: Advisory Signal SIG-DEP-1</p>
                          </div>
                          <div>
                            <p className="text-xs text-amber-400">← RISK-SIG-BND-2 (BOUNDARY_EXPANSION)</p>
                            <p className="text-[10px] text-white/50 pl-3">↳ Derived from: Advisory Signal SIG-BND-2</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {activeTab === 'DECISION' && (
                  <div className="bg-[#121214] border border-[#2a2a2f] rounded-lg p-4 h-full overflow-y-auto flex flex-col gap-6">
                    <div>
                      <h3 className="text-xs font-semibold uppercase text-white/40 mb-2">Architecture Review Board</h3>
                      <div className="p-4 border border-indigo-900/30 rounded bg-indigo-900/10 flex flex-col gap-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-indigo-300/70">Verdict Status</span>
                          <span className="text-xs font-bold text-indigo-300 px-3 py-1 bg-indigo-900/50 rounded">REVIEW_REQUIRED</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-indigo-300/70">Decision Outcome</span>
                          <span className="text-sm font-mono text-white/90">INVESTIGATE</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xs font-semibold uppercase text-white/40 mb-2">Decision Confidence</h3>
                      <div className="p-3 border border-indigo-900/30 rounded bg-[#1a1a1e] grid grid-cols-2 gap-2">
                        <div className="flex justify-between">
                          <span className="text-xs text-white/50">Overall</span>
                          <span className="text-xs font-bold text-indigo-400">92%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-xs text-white/50">Evidence</span>
                          <span className="text-xs text-white/80">95%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-xs text-white/50">Context Completeness</span>
                          <span className="text-xs text-white/80">100%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-xs text-white/50">Constitutional</span>
                          <span className="text-xs text-white/80">100%</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xs font-semibold uppercase text-white/40 mb-2">Decision Explainability Report™</h3>
                      <div className="space-y-4 border border-[#2a2a2f] rounded p-4 bg-[#1a1a1e]">
                        <div>
                          <p className="text-xs font-bold text-white/70">Why was this decision taken?</p>
                          <p className="text-sm text-white/90 mt-1">O pacote apresenta forte violação estrutural que reduz a coesão do domínio financeiro, exigindo intervenção.</p>
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white/70">Counterfactual Analysis</p>
                          <p className="text-sm text-white/90 mt-1 text-red-300/80">Se a oposta fosse tomada (NO_ACTION), o débito técnico se propagaria para o Core de Faturamento, causando acoplamento irreversível na Wave G5.</p>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xs font-semibold uppercase text-white/40 mb-2">Architecture Memory™ (Timeline)</h3>
                      <div className="space-y-4 border-l border-indigo-900/50 pl-4 ml-2">
                        <div className="relative">
                          <div className="absolute -left-5 top-1.5 w-2 h-2 rounded-full bg-indigo-500/30 ring-4 ring-[#121214]"></div>
                          <p className="text-xs font-mono text-white/50 mb-1">DEC-POL-001 • v1.0.0</p>
                          <p className="text-sm text-white/90">Formal board decision initialized as INVESTIGATE.</p>
                        </div>
                        <div className="relative">
                          <div className="absolute -left-5 top-1.5 w-2 h-2 rounded-full bg-indigo-400 ring-4 ring-[#121214]"></div>
                          <p className="text-xs font-mono text-white/50 mb-1">Human Review</p>
                          <p className="text-sm text-white/90">Pending human acceptance.</p>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xs font-semibold uppercase text-white/40 mb-2">Immutable Context Hash</h3>
                      <div className="p-3 border border-[#2a2a2f] rounded bg-[#1a1a1e]">
                        <p className="text-xs font-mono text-white/50 break-all">ctx_8f43b2a9c1d3e8f7...</p>
                        <p className="text-[10px] text-white/40 mt-1">Locks Certification, Advisory, Risk, and Evolution snapshots deterministically.</p>
                      </div>
                    </div>
                  </div>
                )}
                {activeTab === 'KNOWLEDGE' && (
                  <div className="bg-[#121214] border border-[#2a2a2f] rounded-lg p-4 h-full overflow-y-auto flex flex-col gap-6">
                    <div>
                      <h3 className="text-xs font-semibold uppercase text-white/40 mb-2">Architecture Canon™</h3>
                      <div className="p-4 border border-purple-900/30 rounded bg-purple-900/10 flex flex-col gap-3">
                        <p className="text-sm text-purple-300">Este pacote (KnowledgeNode: PackageNode) está devidamente registrado no Cânone Arquitetural Institucional (v3.1).</p>
                        <p className="text-xs text-white/50">Fundamentação: Artigo 7.2 da Executive Constitution</p>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xs font-semibold uppercase text-white/40 mb-2">Architecture Impact Graph™</h3>
                      <div className="p-4 border border-[#2a2a2f] rounded bg-[#1a1a1e]">
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center justify-between border-b border-[#2a2a2f] pb-2">
                            <span className="text-sm text-white/90">Financial Core (DomainNode)</span>
                            <span className="text-xs text-red-400 border border-red-900 px-2 py-0.5 rounded">CRITICAL / Structural</span>
                          </div>
                          <div className="flex items-center justify-between border-b border-[#2a2a2f] pb-2">
                            <span className="text-sm text-white/90">Reporting Panel (PageNode)</span>
                            <span className="text-xs text-amber-400 border border-amber-900 px-2 py-0.5 rounded">HIGH / Visual</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-white/90">Audit Logger (CapabilityNode)</span>
                            <span className="text-xs text-indigo-400 border border-indigo-900 px-2 py-0.5 rounded">MEDIUM / Governance</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {activeTab === 'RECOMMENDATION' && (
                  <div className="bg-[#121214] border border-[#2a2a2f] rounded-lg p-4 h-full overflow-y-auto flex flex-col gap-6">
                    <div>
                      <h3 className="text-xs font-semibold uppercase text-emerald-400 mb-2">Recommendation Studio™</h3>
                      <p className="text-xs text-white/50 mb-4">Avaliando alternativas fundamentadas na arquitetura canônica e na memória institucional.</p>
                      
                      <div className="space-y-4">
                        <div className="p-4 border border-emerald-900/30 rounded bg-emerald-900/10">
                          <h4 className="text-xs font-bold text-white/70 mb-1">Context</h4>
                          <p className="text-sm text-white/90">Capability Finance apresenta saturação de responsabilidades e alto risco de regressão arquitetural se mantida sem divisão (Evolution Trajectory diverge das políticas de coesão).</p>
                        </div>
                        
                        <div>
                          <h4 className="text-xs font-bold text-white/70 mb-2">Options</h4>
                          <div className="space-y-2">
                            <div className="p-3 border border-[#2a2a2f] rounded bg-[#1a1a1e] flex flex-col gap-1">
                              <span className="text-xs text-emerald-400 font-mono">OPTION-001 : SPLIT_CAPABILITY</span>
                              <p className="text-sm text-white/90">Separar o sub-domínio de Reporting em uma Capability independente.</p>
                              <div className="flex justify-between mt-2 pt-2 border-t border-[#2a2a2f]">
                                <span className="text-[10px] text-white/50">Effects: High Cohesion</span>
                                <span className="text-[10px] text-white/50">Confidence: HIGH</span>
                              </div>
                            </div>
                            <div className="p-3 border border-[#2a2a2f] rounded bg-[#1a1a1e] flex flex-col gap-1 opacity-75">
                              <span className="text-xs text-white/50 font-mono">OPTION-002 : EXTEND_EXISTING</span>
                              <p className="text-sm text-white/70">Manter e refatorar pacotes internos sem quebrar a Capability principal.</p>
                              <div className="flex justify-between mt-2 pt-2 border-t border-[#2a2a2f]">
                                <span className="text-[10px] text-white/50">Effects: Increasing technical debt</span>
                                <span className="text-[10px] text-white/50">Confidence: MEDIUM</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h4 className="text-xs font-bold text-white/70 mb-2">Evidence</h4>
                          <div className="flex gap-2">
                            <span className="text-xs bg-[#1a1a1e] border border-[#2a2a2f] px-2 py-1 rounded text-white/70">MEMORY: MEM-008</span>
                            <span className="text-xs bg-[#1a1a1e] border border-[#2a2a2f] px-2 py-1 rounded text-white/70">KNOWLEDGE: KNW-042</span>
                          </div>
                        </div>

                        <div className="mt-4 p-4 border border-emerald-500/50 rounded-lg bg-[#1a1a1e] flex items-center justify-between">
                          <div>
                            <h4 className="text-xs font-bold text-white mb-1">Decision Bridge</h4>
                            <p className="text-xs text-white/50">Requires Human Decision Authority</p>
                          </div>
                          <button className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium rounded transition-colors">
                            Promote to Decision
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="bg-[#121214] border border-[#2a2a2f] rounded-lg p-6 flex items-center justify-center h-full text-white/40 text-sm text-center">
              Select a Capability cluster in the Graph Viewer to inspect structural facts and provenance.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
