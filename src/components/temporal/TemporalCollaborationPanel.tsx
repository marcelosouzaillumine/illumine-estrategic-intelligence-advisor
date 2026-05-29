import React, { useState } from 'react';
import { DataAccessContext } from '../../core/workflows/ExecutiveDecisionAdapter';

interface TemporalCollaborationPanelProps {
  lineageReference: string;
  temporalEvidence: string[];
  context: DataAccessContext;
  visibilityPolicy: string;
  onPostComment: (comment: string, auditData: any) => void;
}

export const TemporalCollaborationPanel: React.FC<TemporalCollaborationPanelProps> = ({
  lineageReference,
  temporalEvidence,
  context,
  visibilityPolicy,
  onPostComment
}) => {
  const [commentText, setCommentText] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Regra 4: Permitir comentários somente se houver lineage, evidence, actorId, tenantId, visibilityPolicy
  if (!lineageReference || !temporalEvidence || temporalEvidence.length === 0 || !context.actorId || !context.tenantId || !visibilityPolicy) {
    return null; // Fail-closed dummy renderer
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    // A validação cross-tenant e estrutural ocorre aqui antes de emitir (ou no adapter)
    if (!context.tenantId) {
      setError('CROSS_TENANT_BLOCKED');
      return;
    }

    const auditData = {
      lineageReference,
      temporalEvidence,
      actorId: context.actorId,
      tenantId: context.tenantId,
      visibilityPolicy,
      timestamp: new Date().toISOString()
    };

    onPostComment(commentText, auditData);
    setCommentText('');
    setError(null);
  };

  return (
    <div className="temporal-collaboration-panel p-6 bg-slate-900 border border-slate-700 rounded-lg shadow-md text-slate-100 mt-6">
      <div className="mb-4 border-b border-slate-700 pb-2 flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-slate-50">Executive Collaboration</h3>
          <p className="text-xs text-slate-400 mt-1">Audited discussion tied to temporal evidence</p>
        </div>
        <div className="text-right">
           <span className="px-2 py-1 bg-slate-800 rounded border border-slate-600 text-[10px] uppercase font-mono text-slate-400">
             {visibilityPolicy}
           </span>
        </div>
      </div>

      <div className="bg-slate-800 p-3 rounded text-xs text-slate-400 font-mono mb-4 border border-slate-700/50">
        Attached Evidence: {temporalEvidence.join(', ')}
        <br />
        Lineage Ref: {lineageReference.substring(0, 8)}
      </div>

      {error && (
        <div className="mb-4 p-2 bg-red-900/50 border border-red-500 rounded text-xs text-red-200">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <textarea 
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="Enter formal executive commentary..."
          className="w-full bg-slate-950 border border-slate-700 rounded p-3 text-sm text-slate-200 focus:outline-none focus:border-blue-500 resize-none h-24"
        />
        <div className="flex justify-between items-center">
          <div className="text-xs text-slate-500">
            Posting as: <span className="font-semibold text-slate-300">{context.actorId}</span>
          </div>
          <button 
            type="submit"
            disabled={!commentText.trim()}
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 text-white rounded text-xs font-semibold uppercase tracking-wider transition-colors"
          >
            Post Formal Comment
          </button>
        </div>
      </form>
    </div>
  );
};
