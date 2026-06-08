// src/lib/institutional-lifecycle-assessment.ts

/**
 * Institutional Lifecycle Assessment Engine (ILAE)
 *
 * Provides a multidimensional assessment of a company's institutional stage.
 * The engine does NOT modify any KPI, score, or financial calculation –
 * it only returns contextual information used by narrative layers.
 */

/** Lifecycle stages */
export enum LifecycleStage {
  FORMATION = "FORMATION",
  SCALING = "SCALING",
  SUSTAINABLE = "SUSTAINABLE",
  RECOVERY = "RECOVERY",
  STRESSED = "STRESSED",
}

/** Transition states – represent migration between stages */
export type TransitionStage =
  | `TRANSITION_TO_${LifecycleStage}`
  | `TRANSITION_FROM_${LifecycleStage}`;

/** Dimensions used for assessment */
export type Dimension =
  | "HistoricalDepth"
  | "EconomicSelfSufficiency"
  | "CashSelfSufficiency"
  | "CapitalFormation"
  | "GrowthPattern";

/** Scores per dimension – low, medium, high (0‑100) */
export interface DimensionScore {
  /** 0‑100 confidence for the dimension */
  value: number;
}

/** Collection of all dimension scores */
export interface DimensionScores {
  HistoricalDepth: DimensionScore;
  EconomicSelfSufficiency: DimensionScore;
  CashSelfSufficiency: DimensionScore;
  CapitalFormation: DimensionScore;
  GrowthPattern: DimensionScore;
}

/** Company profile – raw data required for evaluation */
export interface CompanyProfile {
  /** Number of full fiscal years with complete statements */
  fiscalYears: number;
  /** Recent capitalisation flag (e.g., equity injection in last 12 months) */
  recentCapitalization: boolean;
  /** EBITDA (can be negative) */
  ebitda: number;
  /** EBIT (can be negative) */
  ebit: number;
  /** Net profit/loss */
  netProfit: number;
  /** Operating cash‑flow (FCO) */
  operatingCashFlow: number;
  /** Runway in months (based on cash balance) */
  runwayMonths: number;
  /** Revenue growth % YoY */
  revenueGrowthPct: number;
  /** EBITDA growth % YoY */
  ebitdaGrowthPct: number;
  /** Capital consumption indicators (e.g., DLPA) */
  dlpa: number;
}

/** Explanation provided for the assessment */
export interface LifecycleAssessmentExplanation {
  bulletPoints: string[];
}

/** Full assessment result */
export interface LifecycleAssessmentResult {
  /** Final stage or transition */
  stage: LifecycleStage | TransitionStage;
  /** Confidence that the chosen stage is correct (0‑100) */
  classificationConfidence: number;
  /** Confidence in the underlying data quality (0‑100) */
  dataConfidence: number;
  /** Scores for each dimension */
  scores: DimensionScores;
  /** Human‑readable explanation */
  explanation: LifecycleAssessmentExplanation;
}

/** Helper to clamp a number between 0 and 100 */
function clamp01(value: number): number {
  return Math.max(0, Math.min(100, value));
}

/** Evaluate each dimension – simplistic heuristic; can be refined later */
function evaluateHistoricalDepth(profile: CompanyProfile): DimensionScore {
  const confidence = profile.fiscalYears >= 3 ? 90 : profile.fiscalYears === 0 ? 30 : 60;
  return { value: clamp01(confidence) };
}

function evaluateEconomicSelfSufficiency(profile: CompanyProfile): DimensionScore {
  const profitMargin = profile.netProfit / Math.max(1, Math.abs(profile.revenueGrowthPct));
  const base = profitMargin > 0 ? 80 : 40;
  return { value: clamp01(base) };
}

function evaluateCashSelfSufficiency(profile: CompanyProfile): DimensionScore {
  const runwayScore = profile.runwayMonths >= 12 ? 90 : profile.runwayMonths >= 6 ? 70 : 40;
  return { value: clamp01(runwayScore) };
}

function evaluateCapitalFormation(profile: CompanyProfile): DimensionScore {
  const score = profile.recentCapitalization ? 80 : 50;
  return { value: clamp01(score) };
}

function evaluateGrowthPattern(profile: CompanyProfile): DimensionScore {
  const growth = profile.revenueGrowthPct;
  const score = growth >= 30 ? 90 : growth >= 10 ? 70 : 40;
  return { value: clamp01(score) };
}

/** Decision‑matrix mapping – each stage prioritises a set of dimensions */
const decisionMatrix: Record<LifecycleStage, Dimension[]> = {
  [LifecycleStage.FORMATION]: ["HistoricalDepth", "CapitalFormation"],
  [LifecycleStage.SCALING]: ["GrowthPattern", "EconomicSelfSufficiency"],
  [LifecycleStage.SUSTAINABLE]: ["CashSelfSufficiency", "EconomicSelfSufficiency"],
  [LifecycleStage.RECOVERY]: ["CashSelfSufficiency", "CapitalFormation"],
  [LifecycleStage.STRESSED]: ["CashSelfSufficiency", "CapitalFormation"],
};

/** Generate explanation bullet points based on scores */
function buildExplanation(scores: DimensionScores, profile: CompanyProfile): string[] {
  const bullets: string[] = [];
  if (profile.fiscalYears < 3) bullets.push("• Histórico insuficiente (menos de 3 exercícios completos).");
  if (profile.recentCapitalization) bullets.push("• Dependência recente de capitalização dos sócios.");
  if (profile.ebitda < 0) bullets.push("• EBITDA negativo.");
  if (profile.operatingCashFlow < 0) bullets.push("• Fluxo de caixa operacional negativo.");
  if (profile.revenueGrowthPct < 10) bullets.push("• Crescimento de receita abaixo de 10% ao ano.");
  return bullets;
}

/** Main assessment function */
export function assessLifecycle(profile: CompanyProfile): LifecycleAssessmentResult {
  // Evaluate all dimensions
  const scores: DimensionScores = {
    HistoricalDepth: evaluateHistoricalDepth(profile),
    EconomicSelfSufficiency: evaluateEconomicSelfSufficiency(profile),
    CashSelfSufficiency: evaluateCashSelfSufficiency(profile),
    CapitalFormation: evaluateCapitalFormation(profile),
    GrowthPattern: evaluateGrowthPattern(profile),
  };

  // Compute data confidence – simple aggregate of available fiscal years and completeness
  const dataConfidence = clamp01((profile.fiscalYears / 5) * 100);

  // Determine candidates per stage using the decision matrix
  const stageCandidates: { stage: LifecycleStage; scoreSum: number }[] = [];
  for (const stage of Object.values(LifecycleStage)) {
    const prioritized = decisionMatrix[stage];
    const sum = prioritized.reduce((acc, dim) => acc + (scores[dim as keyof DimensionScores] as DimensionScore).value, 0);
    stageCandidates.push({ stage, scoreSum: sum });
  }

  // Sort by highest sum
  stageCandidates.sort((a, b) => b.scoreSum - a.scoreSum);

  // Identify top candidate and second candidate for possible transition
  const top = stageCandidates[0];
  const second = stageCandidates[1];

  // Classification confidence – proportion of top sum to total possible (2 * 100 per dimension)
  const maxPossible = decisionMatrix[top.stage].length * 100;
  const classificationConfidence = clamp01((top.scoreSum / maxPossible) * 100);

  // Transition detection (difference < 10%)
  const diff = Math.abs(top.scoreSum - second.scoreSum);
  const transitionThreshold = 0.1 * maxPossible; // 10% of max possible for the stage
  let finalStage: LifecycleStage | TransitionStage = top.stage;
  if (diff < transitionThreshold) {
    finalStage = `TRANSITION_TO_${top.stage}` as TransitionStage;
  }

  const explanation: LifecycleAssessmentExplanation = {
    bulletPoints: buildExplanation(scores, profile),
  };

  return {
    stage: finalStage,
    classificationConfidence,
    dataConfidence,
    scores,
    explanation,
  };
}

/** Export types for external use */

