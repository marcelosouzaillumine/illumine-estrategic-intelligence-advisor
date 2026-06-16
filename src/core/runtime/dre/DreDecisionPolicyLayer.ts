import { DreExecutiveFacts } from './DreExecutiveFactsBuilder';
import { DreEconomicScenario } from './DreScenarioClassifier';
import { DreExecutiveLanguageCompiler } from './DreExecutiveLanguageCompiler';
import { 
  DreSemanticValidator, 
  AdjectiveTriggers,
  PanelIntent,
  getCausalFragment,
  ExecutivePlanTriggers
} from './DreSemanticRegistry';
import { DreNarrativeSeverity, NarrativeSeverity } from './DreNarrativeSeverity';

export interface BoardQuestion {
  title: string;
  response: string;
  rationale: string;
  recommendation: string;
}

export interface DreExecutiveDecisionContract {
  economicPositioning: string;
  healthIndex: number;
  confidenceScore: number;
  boardQuestions: {
    p1ValueCreation: BoardQuestion;
    p2StructureSupport: BoardQuestion;
    p3EconomicEquilibrium: BoardQuestion;
    p4PrimaryConstraint: BoardQuestion;
    p5EconomicOpportunity: BoardQuestion;
    p6InactionRisk: BoardQuestion;
    p7BoardPriority: BoardQuestion;
  };
  executiveDiagnosis: {
    currentSituation: string;
    strategicPriority: string;
    operationalOutlook: string;
    primaryRecommendation: string;
    primaryEconomicDriver: string;
    severityState: "critical" | "warning" | "healthy" | "neutral";
    recommendationPriority: "high" | "medium" | "low";
    dominantStrength: string;
    secondaryAttention: string;
  };
  executivePlan: {
    shortTerm: string;
    mediumTerm: string;
    longTerm: string;
  };
  historicalIntelligence: {
    message: string;
  };
}

export class DreDecisionPolicyLayer {
  public static generatePolicy(facts: DreExecutiveFacts, scenario: DreEconomicScenario, year?: number): DreExecutiveDecisionContract {
    const compiler = new DreExecutiveLanguageCompiler();

    // Consultar Severidades
    const netMarginSeverity = DreNarrativeSeverity.getCompositeSeverity(facts, DreNarrativeSeverity.forNetMargin(facts.netMargin));
    const ebitdaSeverity = DreNarrativeSeverity.getCompositeSeverity(facts, DreNarrativeSeverity.forEbitdaMargin(facts.ebitdaMargin));
    const breakEvenSeverity = DreNarrativeSeverity.getCompositeSeverity(facts, DreNarrativeSeverity.forBreakEvenCoverage(facts.breakEvenCoverage));

    // Compilação dos Painéis do Board via Compiler
    const compileBoardQuestion = (title: string, intent: PanelIntent, severity: NarrativeSeverity): BoardQuestion => {
      const frag = getCausalFragment(intent, severity);
      const compiled = compiler.compilePanelResponse(intent, frag, severity);
      
      return {
        title,
        response: compiled.response,
        rationale: compiled.rationale,
        recommendation: compiled.recommendation
      };
    };

    const p1 = compileBoardQuestion("P1 — Criação de Valor", 'VALUE_CREATION', netMarginSeverity);
    const p2 = compileBoardQuestion("P2 — Sustentação", 'STRUCTURE_SUSTAINABILITY', ebitdaSeverity);
    const p3 = compileBoardQuestion("P3 — Equilíbrio", 'SURVIVAL_THRESHOLD', breakEvenSeverity);
    const p4 = compileBoardQuestion("P4 — Restrição", 'GROWTH_CONSTRAINT', netMarginSeverity);
    const p5 = compileBoardQuestion("P5 — Oportunidade", 'SCALE_EFFICIENCY', netMarginSeverity);
    const p6 = compileBoardQuestion("P6 — Inação", 'INACTION_RISK', breakEvenSeverity);
    const p7 = compileBoardQuestion("P7 — Prioridade do Conselho", 'BOARD_MANDATE', ebitdaSeverity);

    // Adjetivos Rígidos
    const adjStatus = [];
    if (AdjectiveTriggers.robusto(facts.ebitdaMargin, facts.netMargin)) adjStatus.push("robusta");
    if (AdjectiveTriggers.critico(facts.netMargin, facts.breakEvenCoverage)) adjStatus.push("crítica");
    if (AdjectiveTriggers.saudavel(facts.netMargin, facts.breakEvenCoverage)) adjStatus.push("saudável");

    const isCritica = adjStatus.includes('crítica');
    const isBreakEvenBottleneck = breakEvenSeverity === 'UNSUSTAINABLE' || breakEvenSeverity === 'PRESSURIZED';
    const isMarginBottleneck = netMarginSeverity === 'UNSUSTAINABLE' || netMarginSeverity === 'PRESSURIZED';

    // Rótulos temporários para compatibilidade com o diagnóstico
    const ebitdaLabel = ebitdaSeverity === 'UNSUSTAINABLE' ? 'Déficit Operacional' : 
                        ebitdaSeverity === 'PRESSURIZED' ? 'Geração Operacional Frágil' :
                        ebitdaSeverity === 'BORDERLINE' ? 'Geração Operacional Funcional' : 'Geração Operacional Consistente';
                        
    const netMarginLabel = netMarginSeverity === 'UNSUSTAINABLE' ? 'Destruição Econômica' :
                           netMarginSeverity === 'BORDERLINE' ? 'Margem Crítica' :
                           netMarginSeverity === 'ADEQUATE' ? 'Margem Moderada' : 'Margem Sólida';

    // Diagnóstico
    const diag = compiler.compileExecutiveDiagnosis(
      facts, 
      ebitdaLabel, 
      netMarginLabel, 
      adjStatus, 
      isBreakEvenBottleneck, 
      isMarginBottleneck,
      year
    );

    // Health Index
    let healthIndex = 50;
    if (netMarginSeverity === 'UNSUSTAINABLE' || breakEvenSeverity === 'UNSUSTAINABLE') {
      healthIndex = Math.min(30, Math.max(0, 0 + (facts.ebitdaMargin * 100)));
    } else if (netMarginSeverity === 'PRESSURIZED' || breakEvenSeverity === 'PRESSURIZED') {
      healthIndex = Math.min(65, Math.max(30, 30 + (facts.ebitdaMargin * 100)));
    } else if ((netMarginSeverity === 'ADEQUATE' || netMarginSeverity === 'STRONG' || netMarginSeverity === 'EXCELLENT') && (ebitdaSeverity === 'ADEQUATE' || ebitdaSeverity === 'STRONG' || ebitdaSeverity === 'EXCELLENT')) {
      healthIndex = Math.min(90, Math.max(65, 65 + (facts.ebitdaMargin * 50)));
    } else {
      healthIndex = Math.min(100, Math.max(90, 90 + (facts.ebitdaMargin * 25)));
    }

    const economicPositioning = `${ebitdaLabel} com ${netMarginLabel}`;

    const severityStateMapping: Record<NarrativeSeverity, "critical" | "warning" | "healthy" | "neutral"> = {
      UNSUSTAINABLE: 'critical',
      PRESSURIZED: 'warning',
      BORDERLINE: 'warning',
      ADEQUATE: 'healthy',
      STRONG: 'healthy',
      EXCELLENT: 'healthy'
    };
    
    const severityState = (netMarginSeverity === 'UNSUSTAINABLE' || breakEvenSeverity === 'UNSUSTAINABLE')
      ? 'critical' 
      : (netMarginSeverity === 'PRESSURIZED' || breakEvenSeverity === 'PRESSURIZED' || netMarginSeverity === 'BORDERLINE') 
        ? 'warning' 
        : 'healthy';
      
    const recommendationPriority = severityState === 'critical' ? 'high' : (severityState === 'warning' ? 'medium' : 'low');

    const dominantStrength = netMarginSeverity === 'UNSUSTAINABLE' ? "Receita Líquida Imediata" : "Margem de Contribuição Ativa";
    const secondaryAttention = breakEvenSeverity === 'UNSUSTAINABLE' ? "Inchaço Operacional" : "Conservação de Eficiência";

    let confidenceScore = 100;
    if (!facts.hasMeaningfulHistory) confidenceScore -= 20;
    if (facts.ebitda > facts.grossProfit) confidenceScore -= 15;
    if (facts.netIncome > facts.ebitda) confidenceScore -= 10;
    if (facts.breakEvenCoverage <= 0) confidenceScore -= 15;
    confidenceScore = Math.max(30, Math.min(100, confidenceScore));

    return {
      economicPositioning,
      boardQuestions: {
        p1ValueCreation: p1,
        p2StructureSupport: p2,
        p3EconomicEquilibrium: p3,
        p4PrimaryConstraint: p4,
        p5EconomicOpportunity: p5,
        p6InactionRisk: p6,
        p7BoardPriority: p7,
      },
      healthIndex: parseFloat(healthIndex.toFixed(2)),
      confidenceScore,
      executiveDiagnosis: {
        currentSituation: diag.currentSituation,
        strategicPriority: diag.strategicPriority,
        operationalOutlook: isCritica ? "Cenário exigindo intervenção para assegurar estabilidade." : "Ambiente com lastro analítico preservado.",
        primaryRecommendation: p1.recommendation,
        primaryEconomicDriver: diag.primaryEconomicDriver,
        severityState,
        recommendationPriority,
        dominantStrength,
        secondaryAttention
      },
      executivePlan: ExecutivePlanTriggers.getPlan(
        netMarginSeverity === 'UNSUSTAINABLE' || breakEvenSeverity === 'UNSUSTAINABLE' ? 'UNSUSTAINABLE' : netMarginSeverity,
        facts.netIncome < 0
      ),
      historicalIntelligence: {
        message: compiler.compileLongitudinalIntelligence(facts),
      }
    };
  }
}
