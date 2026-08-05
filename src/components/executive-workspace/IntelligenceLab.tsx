import React, { useState } from 'react';
import { IntelligenceProcessingPipeline } from '@application/intelligence/pipeline/IntelligenceProcessingPipeline';
// Note: In a real app, DI handles instantiation.
// Here we mock the required imports for the simulation view.

export function IntelligenceLab({ securityContext }: { securityContext: any }) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState<any>(null);

  // Authorization Check
  if (!securityContext?.permissions?.includes("INTELLIGENCE_LAB_ACCESS")) {
    return (
      <div className="p-8 text-center text-red-600">
        <h1 className="text-2xl font-bold">Acesso Negado</h1>
        <p>Você não possui a permissão INTELLIGENCE_LAB_ACCESS requerida para este ambiente simulado.</p>
      </div>
    );
  }

  const runSimulation = () => {
    // In a real environment, this invokes the IntelligenceProcessingPipeline
    // For now, we simulate the UI states
    setOutput({
      status: 'pending',
      signals: [],
      confidence: 0
    });
    
    setTimeout(() => {
      // Mocking the scenario outcome directly for UI display
      let result = { status: 'validated', signals: ['Observation'], confidence: 70 };
      if (input.includes('caiu')) result = { status: 'validated', signals: ['Revenue Risk', 'Margin Decline'], confidence: 85 };
      if (input.includes('talvez')) result = { status: 'blocked', signals: [], confidence: 32 };
      if (input.includes('reduzir')) result = { status: 'pending_human_decision', signals: ['People Capability'], confidence: 90 };
      
      setOutput(result);
    }, 1000);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Intelligence Simulation Workspace™</h1>
        <p className="text-gray-500">Laboratório restrito para testes da governança orgânica sem dependência externa de LLMs.</p>
      </header>
      
      <div className="grid grid-cols-2 gap-8">
        <div className="border p-4 rounded shadow-sm bg-white">
          <h2 className="text-xl font-semibold mb-4">Executive Conversation Input</h2>
          <textarea 
            className="w-full h-32 p-2 border rounded mb-4" 
            placeholder="Digite a fala executiva (ex: 'A receita caiu 20%...')"
            value={input}
            onChange={e => setInput(e.target.value)}
          />
          <button 
            className="w-full bg-black text-white font-bold py-2 rounded hover:bg-gray-800"
            onClick={runSimulation}
          >
            Run Intelligence (Mock)
          </button>
        </div>

        {output && (
          <div className="border p-4 rounded shadow-sm bg-gray-50">
            <h2 className="text-xl font-semibold mb-4">Inference & Validation Output</h2>
            <div className="space-y-3">
              <p><strong>Status da Factory:</strong> 
                <span className={`ml-2 px-2 py-1 rounded text-sm ${output.status === 'blocked' ? 'bg-red-200 text-red-800' : 'bg-green-200 text-green-800'}`}>
                  {output.status.toUpperCase()}
                </span>
              </p>
              <p><strong>Confiança (Engine):</strong> {output.confidence}%</p>
              <div>
                <strong>Sinais Extraídos:</strong>
                <ul className="list-disc pl-5 mt-1 text-gray-700">
                  {output.signals.map((sig: string, i: number) => <li key={i}>{sig}</li>)}
                  {output.signals.length === 0 && <li>Nenhum sinal válido</li>}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
