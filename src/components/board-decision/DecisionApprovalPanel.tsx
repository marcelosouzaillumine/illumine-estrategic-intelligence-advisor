// src/components/board-decision/DecisionApprovalPanel.tsx
import React, { useState } from 'react';
import { FileSignature, ShieldCheck, AlertTriangle } from 'lucide-react';
import { InstitutionalScenarioResult } from '../../services/FiduciaryRuntimeAdapter';
import { BoardResolutionEngine } from '../../services/FiduciaryRuntimeAdapter';
import { BoardResolutionService } from '../../services/boardResolutionService';
import { useInstitutionalAuth } from '../../core/security/auth/InstitutionalAuthProvider';

interface Props {
  selectedScenario: InstitutionalScenarioResult;
  tenantId: string;
  clientId: string;
  onApprovalSuccess: () => void;
}

export function DecisionApprovalPanel({ selectedScenario, tenantId, clientId, onApprovalSuccess }: Props) {
  const { user } = useInstitutionalAuth(); // or mock master user if not available
  const [rationale, setRationale] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const approverId = user?.uid || 'MASTER_USER_01';
  const approverRole = 'Master Executive';

  const handleApprove = async () => {
    setError('');
    
    if (rationale.length < 20) {
      setError('O racional fiduciário deve conter ao menos 20 caracteres fundamentando a decisão.');
      return;
    }

    setIsSubmitting(true);
    try {
      // 1. Generate Formal Resolution (Runtime Engine - Math/Hash)
      const resolution = BoardResolutionEngine.formalizeResolution(
        tenantId,
        clientId,
        selectedScenario,
        rationale,
        approverId,
        approverRole
      );

      // 2. Persist in append-only Firestore (Service)
      await BoardResolutionService.persistResolution(resolution);
      
      onApprovalSuccess();
    } catch (err: any) {
      setError(err.message || 'Erro ao registrar a deliberação do conselho.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-xl text-slate-100">
      <div className="flex items-center gap-3 mb-6 border-b border-slate-800 pb-4">
        <FileSignature className="text-emerald-400" size={24} />
        <div>
          <h3 className="text-sm font-black uppercase tracking-widest text-slate-100">Board Resolution</h3>
          <p className="text-xs text-slate-400">Formalização Estrutural de Decisão Executiva</p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-slate-800/50 p-4 rounded-xl space-y-3">
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold text-slate-400">Scenario Target:</span>
            <span className="font-mono text-emerald-400">{selectedScenario.id}</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold text-slate-400">Lineage Hash:</span>
            <span className="font-mono text-slate-300 bg-slate-800 px-2 py-0.5 rounded text-[10px]">
              {selectedScenario.explainability?.lineageHash || 'MISSING_HASH'}
            </span>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-300 mb-2">Racional Fiduciário (Ata de Deliberação)</label>
          <textarea 
            value={rationale}
            onChange={(e) => setRationale(e.target.value)}
            placeholder="Descreva o embasamento institucional para acatar as propagações e riscos deste cenário..."
            className="w-full h-32 bg-slate-800 border border-slate-700 rounded-xl p-3 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all resize-none"
          />
        </div>

        {error && (
          <div className="bg-rose-950/30 border border-rose-900/50 p-3 rounded-xl flex items-start gap-2 text-rose-400">
            <AlertTriangle size={16} className="mt-0.5 shrink-0" />
            <p className="text-xs font-medium leading-relaxed">{error}</p>
          </div>
        )}

        <button 
          onClick={handleApprove}
          disabled={isSubmitting}
          className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white p-3 rounded-xl transition-all font-bold text-xs uppercase tracking-wider"
        >
          {isSubmitting ? 'Registrando na Blockchain Institucional...' : 'Assinar & Registrar Resolução'}
          {!isSubmitting && <ShieldCheck size={16} />}
        </button>
      </div>
    </div>
  );
}
