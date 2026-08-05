import React, { useEffect, useState } from 'react';
import { ExecutiveContext } from '../../../context/executive-context.types';
import { EnterpriseInsight } from '../../../intelligence/models/enterprise-insight.types';
import { ProviderFactory } from '../../../data/factory/provider.factory';
import { Network, AlertTriangle, TrendingUp, Lightbulb, Target } from 'lucide-react';

interface EnterpriseIntelligencePreviewProps {
  context: ExecutiveContext;
}

export const EnterpriseIntelligencePreview: React.FC<EnterpriseIntelligencePreviewProps> = ({ context }) => {
  const [insights, setInsights] = useState<EnterpriseInsight[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadIntelligence = async () => {
      try {
        const provider = ProviderFactory.getEnterpriseIntelligenceProvider();
        const priorityInsights = await provider.getPriorityInsights();
        setInsights(priorityInsights);
      } catch (error) {
        console.error('Failed to load enterprise intelligence:', error);
      } finally {
        setLoading(false);
      }
    };
    loadIntelligence();
  }, [context]);

  if (loading) return <div className="p-8 text-slate-400">Iniciando Enterprise Intelligence Fabric...</div>;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <header className="mb-10 border-b border-slate-800 pb-6">
        <div className="flex items-center gap-3 mb-2">
          <Network className="w-8 h-8 text-indigo-400" />
          <h1 className="text-3xl font-semibold text-slate-100 tracking-tight">Enterprise Intelligence Preview</h1>
        </div>
        <p className="text-slate-400 text-sm">Monitorando correlações cruzadas e cadeias de impacto sistêmico.</p>
      </header>

      <section>
        <h2 className="text-lg font-medium text-slate-200 mb-4 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-500" /> 
          Top Riscos Propagados (Cross-Office)
        </h2>
        <div className="space-y-4">
          {insights.map(insight => (
            <div key={insight.id} className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-slate-700 transition-colors">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="inline-block px-2 py-1 bg-red-900/30 text-red-400 text-xs font-medium rounded mb-3 uppercase tracking-wider">
                    Severity: {insight.businessImpact.severity}
                  </span>
                  <h3 className="text-xl font-medium text-slate-100">{insight.title}</h3>
                  <p className="text-slate-400 text-sm mt-1">{insight.narrative}</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-light text-slate-200">
                    {Math.round(insight.confidenceScore * 100)}%
                  </div>
                  <div className="text-xs text-slate-500 uppercase tracking-widest mt-1">Confiança</div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-slate-950 rounded-lg border border-slate-800/50">
                <h4 className="text-sm font-medium text-slate-300 mb-3 flex items-center gap-2">
                  <Network className="w-4 h-4 text-slate-500" />
                  Impact Chain Envolvida
                </h4>
                <div className="flex flex-wrap gap-2 items-center text-sm text-slate-400">
                  <span className="px-3 py-1 bg-slate-800 text-slate-300 rounded-full capitalize">{insight.sourceOffice}</span>
                  <span className="text-slate-600">→</span>
                  {insight.affectedOffices.map((office, idx) => (
                    <React.Fragment key={office}>
                      <span className="px-3 py-1 bg-indigo-900/20 text-indigo-300 rounded-full capitalize">{office}</span>
                      {idx < insight.affectedOffices.length - 1 && <span className="text-slate-600">→</span>}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              {insight.recommendedActions.length > 0 && (
                <div className="mt-6">
                  <h4 className="text-sm font-medium text-slate-300 mb-3 flex items-center gap-2">
                    <Target className="w-4 h-4 text-slate-500" />
                    Decisão Sugerida
                  </h4>
                  {insight.recommendedActions.map(rec => (
                    <div key={rec.id} className="flex items-start gap-3 p-3 bg-indigo-950/20 rounded border border-indigo-900/30">
                      <Lightbulb className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <div className="text-sm text-slate-200 font-medium">{rec.action}</div>
                        <div className="text-xs text-slate-500 mt-1">Alvo: Office {rec.targetOffice.toUpperCase()} • Resultado Esperado: {rec.expectedOutcome}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
          {insights.length === 0 && (
            <div className="text-center p-12 bg-slate-900/50 rounded-xl border border-dashed border-slate-800">
              <p className="text-slate-500">Nenhum risco sistêmico propagado detectado no momento.</p>
            </div>
          )}
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <section className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h2 className="text-lg font-medium text-slate-200 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-500" /> 
            Top Oportunidades Cruzadas
          </h2>
          <div className="text-center p-8 bg-slate-950 rounded-lg">
            <p className="text-slate-500 text-sm">Módulo em calibração (Aguardando dados de Commercial x COO).</p>
          </div>
        </section>

        <section className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h2 className="text-lg font-medium text-slate-200 mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-blue-500" /> 
            Decisões Pendentes (Trace)
          </h2>
          <div className="text-center p-8 bg-slate-950 rounded-lg">
            <p className="text-slate-500 text-sm">Integração com Governance Office ativa. 0 pendências críticas.</p>
          </div>
        </section>
      </div>

    </div>
  );
};
