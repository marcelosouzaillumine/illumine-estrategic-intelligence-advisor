import React from 'react';
import { ExecutiveSurface } from '../../ui/executive-surface';
import { ExecutiveHeading } from '../../ui/executive-heading';
import { ExecutiveText } from '../../ui/executive-typography';
import { History, TrendingUp, AlertCircle, HelpCircle } from 'lucide-react';
import { HistoricalIntelligenceResult } from '../../../core/experience/contracts/FinancialPositionPureViewModel';
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

interface HistoricalEvolutionSectionProps {
  historicalEvolution?: HistoricalIntelligenceResult;
}

function formatCurrencyShort(value: number): string {
  if (Math.abs(value) >= 1_000_000) return `R$ ${(value / 1_000_000).toFixed(1)}M`;
  if (Math.abs(value) >= 1_000) return `R$ ${(value / 1_000).toFixed(0)}K`;
  return `R$ ${value.toFixed(0)}`;
}

export function HistoricalEvolutionSection({ historicalEvolution }: HistoricalEvolutionSectionProps) {
  if (!historicalEvolution || !historicalEvolution.trajectory) return null;

  const trajectory = historicalEvolution.trajectory as {
    confidence: 'low' | 'medium' | 'high';
    classification: 'strengthening' | 'stable' | 'deteriorating';
    explanation: string;
  };

  const periodCoverage = historicalEvolution.periodCoverage as { firstYear: number; lastYear: number };
  const executiveContext = historicalEvolution.executiveContext as { implication: string };
  const chartData: any[] = (historicalEvolution as any).chartData ?? [];
  const movements: any[] = historicalEvolution.movements ?? [];

  const confidenceLabel = trajectory.confidence === 'high' ? 'Alta' : trajectory.confidence === 'medium' ? 'Média' : 'Baixa';

  return (
    <div className="mb-8">
      <ExecutiveSurface variant="default" elevation="md" className="p-8 border-t border-t-border/40">
        <div className="flex items-start justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <History className="text-foreground w-6 h-6" />
              <ExecutiveHeading as="h2" variant="moduleTitle" className="text-foreground">
                Evolução Histórica Patrimonial
              </ExecutiveHeading>
            </div>
            <ExecutiveText variant="bodyStandard" className="text-muted-foreground">
              Trajetória da estrutura de capital ao longo do tempo
            </ExecutiveText>
          </div>
          <div className="flex items-center gap-2 bg-brand-50 px-4 py-2 rounded-lg border border-brand-100">
            <ExecutiveText variant="label" className="text-brand-800">
              Confiança Temporal: {confidenceLabel}
            </ExecutiveText>
          </div>
        </div>

        {/* Trajetória */}
        <div className="bg-muted/30 p-6 rounded-xl border border-border/50 mb-8">
          <div className="flex items-start gap-4">
            <div className="mt-1">
              {trajectory.classification === 'strengthening' ? (
                <TrendingUp className="w-6 h-6 text-green-600" />
              ) : trajectory.classification === 'deteriorating' ? (
                <AlertCircle className="w-6 h-6 text-red-600" />
              ) : (
                <History className="w-6 h-6 text-brand-600" />
              )}
            </div>
            <div>
              <ExecutiveText variant="label" className="text-foreground font-bold mb-1 uppercase tracking-wide">
                {trajectory.classification === 'strengthening' ? 'Expansão patrimonial consistente' :
                 trajectory.classification === 'deteriorating' ? 'Retração patrimonial material' :
                 'Manutenção da estrutura de capital'}
              </ExecutiveText>
              <ExecutiveText variant="bodyStandard" className="text-muted-foreground leading-relaxed">
                {trajectory.explanation}
              </ExecutiveText>
            </div>
          </div>
        </div>

        {/* Gráfico de evolução */}
        {chartData.length > 1 && chartData.some((d: any) => d.ativo !== 0 || d.pl !== 0) && (
          <div className="mb-8">
            <ExecutiveText variant="label" className="text-foreground font-semibold mb-4 uppercase tracking-wider block">
              Composição Patrimonial por Período
            </ExecutiveText>
            <div className="w-full h-64">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={chartData} margin={{ top: 4, right: 16, left: 8, bottom: 4 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.5} />
                  <XAxis dataKey="year" tick={{ fontSize: 12 }} stroke="var(--muted-foreground)" />
                  <YAxis tickFormatter={formatCurrencyShort} tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" width={70} />
                  <Tooltip
                    formatter={(value: number, name: string) => [formatCurrencyShort(value), name]}
                    contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid var(--border)', background: 'var(--card)' }}
                    labelStyle={{ fontWeight: 600 }}
                  />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Bar dataKey="ativo" name="Ativo Total" fill="var(--primary)" opacity={0.8} radius={[3, 3, 0, 0]} />
                  <Bar dataKey="passivo" name="Passivo" fill="var(--state-critical-soft, #fca5a5)" opacity={0.8} radius={[3, 3, 0, 0]} />
                  <Line dataKey="pl" name="Patrimônio Líquido" stroke="var(--state-success-foreground, #16a34a)" strokeWidth={2} dot={{ r: 4 }} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Movimentos Principais */}
        {movements.length > 0 && (
          <div className="mb-8">
            <ExecutiveText variant="label" className="text-foreground font-semibold mb-4 uppercase tracking-wider">
              Movimentos Estruturais Principais
            </ExecutiveText>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {movements.map((movement, idx) => (
                <div key={idx} className="bg-background border border-border p-4 rounded-lg shadow-sm">
                  <div className="flex justify-between items-center mb-2">
                    <ExecutiveText variant="bodyStandard" className="font-semibold text-foreground">
                      {movement.metric}
                    </ExecutiveText>
                    <span className={`text-sm font-bold ${typeof movement.variation.percentage === 'number' ? (movement.variation.percentage > 0 ? 'text-green-600' : 'text-red-600') : 'text-muted-foreground'}`}>
                      {typeof movement.variation.percentage === 'number' ? `${movement.variation.percentage > 0 ? '+' : ''}${movement.variation.percentage.toFixed(1)}%` : 'N/A'}
                    </span>
                  </div>
                  <ExecutiveText variant="caption" className="text-muted-foreground italic mb-2">
                    {movement.period}
                  </ExecutiveText>
                  <ExecutiveText variant="bodyStandard" className="text-muted-foreground leading-tight">
                    {movement.interpretation}
                  </ExecutiveText>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Questão Executiva Derivada */}
        <div className="bg-brand-900 text-brand-50 p-6 rounded-xl relative overflow-hidden">
          <div className="flex items-start gap-4">
            <HelpCircle className="w-6 h-6 text-brand-300 mt-1 flex-shrink-0" />
            <div>
              <ExecutiveText variant="label" className="text-brand-300 uppercase tracking-wider mb-2 block">
                Ponto de Reflexão Histórica
              </ExecutiveText>
              <ExecutiveText variant="bodyLarge" className="text-brand-50 font-medium leading-relaxed">
                {periodCoverage.firstYear && periodCoverage.lastYear
                  ? `Quais mudanças relevantes podem ser observadas na estrutura patrimonial entre ${periodCoverage.firstYear} e ${periodCoverage.lastYear}?`
                  : 'Como a estrutura patrimonial evoluiu nos períodos disponíveis?'}
              </ExecutiveText>
              <ExecutiveText variant="bodyStandard" className="text-brand-200 mt-4 italic">
                {executiveContext?.implication || ''}
              </ExecutiveText>
            </div>
          </div>
        </div>

      </ExecutiveSurface>
    </div>
  );
}
