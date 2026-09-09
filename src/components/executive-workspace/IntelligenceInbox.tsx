import React, { useState } from 'react';
import { IntelligenceArtifact } from '@/core/intelligence/artifacts/IntelligenceArtifact';
import { ExecutiveDecisionArtifact } from '@/core/intelligence/decision/ExecutiveDecisionArtifact';

export function IntelligenceInbox() {
  const [activeQueue, setActiveQueue] = useState<'pending' | 'approved' | 'rejected' | 'executed' | 'learning'>('pending');
  
  // Mock data for UI demonstration
  const [artifacts] = useState<IntelligenceArtifact[]>([]);

  return (
    <div className="p-8">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">Governance Inbox™</h1>
        <p className="text-gray-500">Human Governance Layer | Executive Workspace</p>
      </header>

      <div className="flex gap-4 border-b mb-6">
        {['pending', 'approved', 'rejected', 'executed', 'learning'].map(queue => (
          <button
            key={queue}
            onClick={() => setActiveQueue(queue as any)}
            className={`pb-2 px-1 capitalize ${activeQueue === queue ? 'border-b-2 border-black font-semibold' : 'text-gray-500'}`}
          >
            {queue}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {artifacts.length === 0 ? (
          <div className="p-6 bg-gray-50 rounded text-center text-gray-500">
            Nenhuma inteligência pendente nesta fila.
          </div>
        ) : (
          artifacts.map(artifact => (
            <div key={artifact.id} className="p-4 border rounded shadow-sm">
              <div className="flex justify-between">
                <span className="font-semibold">{artifact.domain} {artifact.artifactType}</span>
                <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  Confiança: {artifact.confidence.score}%
                </span>
              </div>
              {/* Evidence, context, and action buttons would go here */}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
