import { OperationalIntelligenceContract } from '../../contracts/OperationalIntelligenceContract';
import { DreNormalizer } from '../../infrastructure/adapters/DreNormalizer';
import { OperationalMetricsEngine } from '../../intelligence/operational/OperationalMetricsEngine';
import { OperationalRiskRules } from '../../intelligence/operational/rules/OperationalRiskRules';
import { SignalIntelligenceEngine } from '../../intelligence/signals/SignalIntelligenceEngine';
import { ExecutiveQuestionEngine } from '../../intelligence/questions/ExecutiveQuestionEngine';
import { HistoricalEvolutionEngine } from '../../intelligence/historical/HistoricalEvolutionEngine';
import { OperationalHistoricalNarrativeEngine } from '../../intelligence/operational/historical/OperationalHistoricalNarrativeEngine';
import { OperationalScoreEngine } from '../../intelligence/operational/score/OperationalScoreEngine';
import { AnalyticalEvidenceResolver } from '../../intelligence/missing/AnalyticalEvidenceResolver';
import { ExecutivePositionSummaryEngine } from '../../intelligence/narrative/ExecutivePositionSummaryEngine';

export class DreIntelligenceUseCase {
    public analyzeDre(rawData: any): OperationalIntelligenceContract {
        try {
            // 1. Foundation: Normalize Raw Data
            const dataset = DreNormalizer.normalize(rawData);
            
            // 2. Operational Metrics
            const metrics = OperationalMetricsEngine.calculate(dataset);

            // 3. Risk Rules / Exposures
            const rawExposures = OperationalRiskRules.evaluate(metrics);

            // 4. Signal Synthesis & Traceability
            const signalsData = SignalIntelligenceEngine.synthesize(
                rawExposures, 
                dataset.history, 
                dataset.current,
                (period) => {
                    const tempMetrics = OperationalMetricsEngine.calculate({ current: period, history: dataset.history });
                    return OperationalRiskRules.evaluate(tempMetrics);
                }
            );
            const questionsData = ExecutiveQuestionEngine.generateQuestionsForSignals(signalsData);

            signalsData.forEach(sig => {
                const relatedQ = questionsData.find(q => q.originSignalId === sig.id);
                if (relatedQ) {
                    sig.relatedQuestion = relatedQ.id;
                }
            });

            const signals = {
                available: signalsData.length > 0,
                items: signalsData,
                availabilityReason: signalsData.length === 0 ? {
                    type: "LOW_CONFIDENCE",
                    title: "Sinais Indisponíveis",
                    explanation: "Não há anomalias operacionais materiais detectadas",
                    impact: "Atenção fiduciária desnecessária"
                } as any : undefined
            };

            const executiveQuestions = {
                available: questionsData.length > 0,
                items: questionsData,
                availabilityReason: questionsData.length === 0 ? {
                    type: "LOW_CONFIDENCE",
                    title: "Sem Tópicos de Governança",
                    explanation: "As evidências atuais não sugerem pontos de inflexão na operação.",
                    impact: "Dispensa formulação de questionamentos executivos."
                } as any : undefined
            };

            // 5. Historical Operational Intelligence
            let historicalEvolution: any;
            const periodsAnalyzed = dataset.history.length;
            
            if (periodsAnalyzed >= 2) {
                // Here we extract movements but focused on Operational metrics if possible, or we adapt HistoricalEvolutionEngine.
                // For now, let's fake a metric extraction that is compliant with HistoricalMovement structure.
                const movements = [
                    {
                        metric: 'Receita Líquida',
                        period: `${dataset.history[0].period.year}-${dataset.current.period.year}`,
                        variation: {
                            absolute: dataset.current.revenue.netRevenue - dataset.history[0].revenue.netRevenue,
                            percentage: dataset.history[0].revenue.netRevenue > 0 ? ((dataset.current.revenue.netRevenue / dataset.history[0].revenue.netRevenue) - 1) * 100 : 0
                        },
                        interpretation: '',
                        evidence: { source: 'DreNormalizer' }
                    },
                    {
                        metric: 'OPEX',
                        period: `${dataset.history[0].period.year}-${dataset.current.period.year}`,
                        variation: {
                            absolute: dataset.current.expenses.opex - dataset.history[0].expenses.opex,
                            percentage: dataset.history[0].expenses.opex > 0 ? ((dataset.current.expenses.opex / dataset.history[0].expenses.opex) - 1) * 100 : 0
                        },
                        interpretation: '',
                        evidence: { source: 'DreNormalizer' }
                    }
                ];

                const historicalIntell = OperationalHistoricalNarrativeEngine.synthesize(
                    movements, 
                    periodsAnalyzed, 
                    dataset.history[0].period.year, 
                    dataset.current.period.year
                );
                historicalEvolution = { available: true, items: [historicalIntell] };
            } else {
                historicalEvolution = AnalyticalEvidenceResolver.resolveMissingHistory() as any;
                historicalEvolution.items = [];
            }

            // 6. Operational Score
            const scoreData = OperationalScoreEngine.calculate(metrics, periodsAnalyzed);
            const score = { available: scoreData.available, items: [scoreData] };

            // 7. Executive Position Summary & Overview
            // For now, map simple rules for Health Status based on score
            let healthStatus: 'STRONG' | 'VULNERABLE' | 'CRITICAL' | 'NEUTRAL' = 'NEUTRAL';
            let financialMeaning = 'A estrutura operacional requer monitoramento.';
            
            if (scoreData.composite > 75) {
                healthStatus = 'STRONG';
                financialMeaning = 'A operação apresenta tração e rentabilidade consistentes.';
            } else if (scoreData.composite < 40) {
                healthStatus = 'CRITICAL';
                financialMeaning = 'A operação demonstra degradação acentuada, pressionando a geração de caixa.';
            } else {
                healthStatus = 'VULNERABLE';
                financialMeaning = 'A eficiência operacional apresenta tensões estruturais que limitam a conversão.';
            }

            const executiveSummary = {
                available: true,
                items: [
                    ExecutivePositionSummaryEngine.synthesize(
                        signals.items,
                        executiveQuestions.items,
                        healthStatus
                    )
                ]
            };

            const confidence: 'HIGH' | 'MEDIUM' | 'LOW' = scoreData.confidence === 'high' ? 'HIGH' : scoreData.confidence === 'medium' ? 'MEDIUM' : 'LOW';

            const overview = {
                healthStatus,
                confidence,
                drivers: [],
                observation: 'A performance operacional foi consolidada.',
                evidence: 'Métricas normalizadas da DRE.',
                financialMeaning
            };

            // 8. Technical Evidence (Raw mapping)
            const technicalEvidence = {
                available: true,
                items: [{ source: dataset.current.source, year: dataset.current.period.year, netRevenue: dataset.current.revenue.netRevenue }]
            };

            return {
                executiveSummary,
                score,
                overview,
                metrics,
                signals,
                historicalEvolution,
                executiveQuestions,
                technicalEvidence
            };

        } catch (error) {
            console.error('[DreGovernanceUseCase] Failed:', error);
            // Return fallback mock
            return {
                executiveSummary: { available: false, items: [], availabilityReason: {} as any },
                score: { available: false, items: [], availabilityReason: {} as any },
                overview: { healthStatus: 'NEUTRAL', confidence: 'LOW', drivers: [], observation: '', evidence: '', financialMeaning: '' },
                metrics: { available: false } as any,
                signals: { available: false, items: [], availabilityReason: {} as any },
                historicalEvolution: { available: false, items: [], availabilityReason: {} as any },
                executiveQuestions: { available: false, items: [], availabilityReason: {} as any },
                technicalEvidence: { available: false, items: [], availabilityReason: {} as any }
            };
        }
    }
}
