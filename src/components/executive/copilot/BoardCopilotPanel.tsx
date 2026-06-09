import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, MessageSquare, AlertTriangle, FileText, CheckCircle2, ChevronRight, Activity, Cpu } from 'lucide-react';
import type { CopilotMessage } from '../../../hooks/useBoardCopilot';
import type { GovernanceCopilotQuestion } from '../../../lib/governance-copilot-reasoning-types';

export interface BoardCopilotPanelProps {
  messages: CopilotMessage[];
  isProcessing: boolean;
  suggestedQuestions: GovernanceCopilotQuestion[];
  onAskQuestion: (q: GovernanceCopilotQuestion) => void;
  onClear: () => void;
}

export function BoardCopilotPanel({ messages, isProcessing, suggestedQuestions, onAskQuestion, onClear }: BoardCopilotPanelProps) {
  
  return (
    <div className="bg-slate-900 rounded-3xl overflow-hidden shadow-xl border border-slate-800 mt-8 mb-8">
      {/* Header */}
      <div className="p-6 border-b border-white/10 bg-gradient-to-r from-indigo-900/30 to-slate-900 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-500/20 rounded-xl border border-indigo-500/30">
            <Cpu className="text-indigo-400" size={24} />
          </div>
          <div>
            <h3 className="text-xl font-black text-white flex items-center gap-2">
              Board Meeting Copilot 
              <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-300 text-[10px] uppercase tracking-widest rounded font-black border border-indigo-500/30">
                BMCL v4.4
              </span>
            </h3>
            <p className="text-xs text-slate-400">Inteligência Determinística de Apoio a Decisões de Conselho</p>
          </div>
        </div>
        {messages.length > 0 && (
          <button 
            onClick={onClear}
            className="px-3 py-1.5 text-[10px] uppercase tracking-widest font-black text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors border border-slate-700"
          >
            Clear Session
          </button>
        )}
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 min-h-[400px]">
        
        {/* Left Side: Suggested Questions (Context Agenda) */}
        <div className="lg:col-span-1 border-r border-slate-800 bg-slate-900/50 p-6 flex flex-col">
          <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-4 flex items-center gap-2">
            <Activity size={14} /> Contexto da Agenda
          </h4>
          
          <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
            {suggestedQuestions.map((q) => (
              <button
                key={q.questionId}
                onClick={() => onAskQuestion(q)}
                disabled={isProcessing}
                className="w-full text-left p-3 rounded-xl bg-slate-800/50 hover:bg-indigo-900/30 border border-slate-700 hover:border-indigo-500/30 transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="flex justify-between items-start gap-2">
                  <span className="text-xs text-slate-300 group-hover:text-indigo-200 leading-relaxed font-medium">
                    {q.text}
                  </span>
                  <ChevronRight size={14} className="text-slate-600 group-hover:text-indigo-400 shrink-0 mt-0.5" />
                </div>
              </button>
            ))}
            
            {suggestedQuestions.length === 0 && (
              <p className="text-xs text-slate-500 italic text-center py-8">Nenhuma questão sugerida baseada no contexto atual.</p>
            )}
          </div>
        </div>

        {/* Right Side: Conversation Area */}
        <div className="lg:col-span-2 p-6 flex flex-col bg-slate-950/30">
          
          {messages.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center px-8 opacity-60">
              <ShieldCheck size={48} className="text-slate-700 mb-4" />
              <h4 className="text-sm font-black text-slate-400 mb-2">Copilot Read-Only</h4>
              <p className="text-xs text-slate-500 max-w-sm">
                Selecione uma questão sugerida ao lado. As respostas são baseadas estritamente em evidências e inteligência institucional certificada, sem geração livre de texto.
              </p>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto pr-2 space-y-6 custom-scrollbar">
              <AnimatePresence initial={false}>
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex flex-col ${msg.type === 'QUESTION' ? 'items-end' : 'items-start'}`}
                  >
                    {msg.type === 'QUESTION' ? (
                      <div className="max-w-[80%] bg-indigo-600 text-white p-4 rounded-2xl rounded-tr-sm shadow-sm">
                        <p className="text-sm font-medium">{msg.text}</p>
                      </div>
                    ) : (
                      <div className="max-w-[95%] bg-slate-800 border border-slate-700 rounded-2xl rounded-tl-sm shadow-md overflow-hidden">
                        {msg.result && (
                          <>
                            {/* Response Content */}
                            <div className="p-5">
                              <p className="text-sm text-slate-200 leading-relaxed mb-4">
                                {msg.result.response.executiveSummary}
                              </p>
                              
                              {msg.result.response.keyFindings.length > 0 && (
                                <div className="mb-4">
                                  <h5 className="text-[10px] uppercase tracking-widest font-black text-indigo-400 mb-2">Key Findings</h5>
                                  <ul className="space-y-2">
                                    {msg.result.response.keyFindings.map((finding, idx) => (
                                      <li key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                                        <CheckCircle2 size={12} className="text-indigo-500 shrink-0 mt-0.5" />
                                        <span>{finding}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                            
                            {/* Traceability Footer */}
                            <div className="bg-slate-900/80 px-5 py-3 border-t border-slate-800 flex flex-wrap items-center gap-4">
                              <div className="flex items-center gap-1.5" title="Evidências processadas">
                                <FileText size={12} className="text-slate-500" />
                                <span className="text-[10px] font-mono text-slate-400">{msg.result.traceability.evidenceCount} Evidências</span>
                              </div>
                              <div className="flex items-center gap-1.5" title="Conflitos identificados">
                                <AlertTriangle size={12} className={msg.result.traceability.conflictCount > 0 ? "text-amber-500" : "text-slate-500"} />
                                <span className="text-[10px] font-mono text-slate-400">{msg.result.traceability.conflictCount} Conflitos</span>
                              </div>
                              <div className="flex items-center gap-1.5 ml-auto">
                                <span className="text-[10px] uppercase tracking-widest font-black text-slate-500">Confiança:</span>
                                <span className={`px-2 py-0.5 text-[9px] uppercase tracking-widest font-black rounded ${
                                  msg.result.traceability.confidenceLevel === 'HIGH' || msg.result.traceability.confidenceLevel === 'VERY_HIGH' 
                                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                  : msg.result.traceability.confidenceLevel === 'MODERATE'
                                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                                  : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                                }`}>
                                  {msg.result.traceability.confidenceLevel}
                                </span>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {isProcessing && (
                <div className="flex items-start">
                  <div className="bg-slate-800 border border-slate-700 rounded-2xl rounded-tl-sm p-4 flex items-center gap-3">
                    <div className="flex gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                    <span className="text-xs text-slate-400 font-medium">Orquestrando contexto institucional...</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
