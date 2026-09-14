import type {
  ESGIntelligenceInput,
  ESGIntelligence,
  ESGDimensionAssessment,
} from "./esg-intelligence-types";

const FIDUCIARY_DISCLAIMER =
  "Esta camada ESG extrai padrões deterministicamente a partir de registros e evidências de governança. Não constitui auditoria ambiental ou social externa, nem interfere em cálculos fiduciários.";

function getClassification(score: number): "HIGH" | "MODERATE" | "LOW" {
  if (score >= 80) return "HIGH";
  if (score >= 50) return "MODERATE";
  return "LOW";
}

export function buildESGIntelligence(
  input: ESGIntelligenceInput | undefined,
): ESGIntelligence | undefined {
  if (!input?.governanceMemory || !input?.governanceIntelligence || !input?.governanceDigitalTwin) {
    return undefined;
  }

  const { governanceMemory, governanceIntelligence, governanceDigitalTwin } = input;

  // 1. Environmental (E) Assessment
  // Searching events for environmental keywords to establish evidence-based scoring
  let envScore = 40; // baseline LOW
  const envStrengths: string[] = [];
  const envOpportunities: string[] = [];

  const envKeywords = ["ambient", "sustent", "energ", "recurs", "carbon", "resid", "environment", "sustainab", "eco"];
  const envEvents = governanceMemory.events.filter(e => 
    envKeywords.some(kw => e.description.toLowerCase().includes(kw))
  );

  if (envEvents.length > 0) {
    envScore += 20 * envEvents.length; // Basic logic: each event adds 20 points
    envStrengths.push(`Identificados ${envEvents.length} eventos institucionais relacionados à dimensão ambiental.`);
  } else {
    envOpportunities.push("Ausência de pautas ambientais ou de otimização de recursos mapeadas nos ciclos recentes.");
  }
  
  if (envScore > 100) envScore = 100;

  const environmental: ESGDimensionAssessment = {
    score: envScore,
    classification: getClassification(envScore),
    strengths: envStrengths,
    opportunities: envOpportunities,
  };

  // 2. Social (S) Assessment
  let socScore = 40; // baseline LOW
  const socStrengths: string[] = [];
  const socOpportunities: string[] = [];

  const socKeywords = ["pesso", "cultur", "stakeholder", "social", "comunidad", "diversidad", "treinamento", "equipe"];
  const socEvents = governanceMemory.events.filter(e => 
    socKeywords.some(kw => e.description.toLowerCase().includes(kw))
  );

  if (socEvents.length > 0) {
    socScore += 20 * socEvents.length;
    socStrengths.push(`Identificados ${socEvents.length} eventos institucionais relacionados à dimensão social.`);
  } else {
    socOpportunities.push("Ausência de discussões sobre engajamento de stakeholders e responsabilidade social nos ciclos recentes.");
  }

  if (socScore > 100) socScore = 100;

  const social: ESGDimensionAssessment = {
    score: socScore,
    classification: getClassification(socScore),
    strengths: socStrengths,
    opportunities: socOpportunities,
  };

  // 3. Governance (G) Assessment
  // Heavily relies on GDT and GIN
  let govScore = 0;
  const govStrengths: string[] = [];
  const govOpportunities: string[] = [];

  // Execution capacity from GDT
  const execRatio = governanceDigitalTwin.executionCapacity.executionRatio;
  govScore += execRatio * 60; // Up to 60 points for execution effectiveness

  // Frictions penalty
  const frictions = governanceIntelligence.governanceFrictions.length;
  govScore += Math.max(0, 40 - (frictions * 10)); // Up to 40 points for smooth governance

  if (execRatio >= 0.8) {
    govStrengths.push("Governance execution capacity remains strong.");
    govStrengths.push("Decision effectiveness demonstrates organizational discipline.");
  } else {
    govOpportunities.push("Aprimorar a efetividade da conversão de deliberações em ações executadas.");
  }

  if (frictions > 0) {
    govOpportunities.push("Reduzir o atrito de governança em pautas reincidentes.");
  }

  if (governanceIntelligence.institutionalLearnings.length > 0) {
    govStrengths.push("Institutional learning processes are active.");
  }

  if (govScore > 100) govScore = 100;
  govScore = Math.round(govScore);

  const governance: ESGDimensionAssessment = {
    score: govScore,
    classification: getClassification(govScore),
    strengths: govStrengths,
    opportunities: govOpportunities,
  };

  // Overall Score
  const overallScore = Math.round((envScore + socScore + govScore) / 3);

  // Institutional Highlights & Warnings
  const institutionalHighlights: string[] = [];
  const institutionalWarnings: string[] = [];

  if (governanceIntelligence.institutionalLearnings.length > 0) {
    institutionalHighlights.push("Institutional learning processes are active.");
  }
  
  if (execRatio >= 0.8) {
    institutionalHighlights.push("Governance execution capacity remains strong.");
    institutionalHighlights.push("Decision effectiveness demonstrates organizational discipline.");
  } else {
    institutionalWarnings.push("Execution capacity remains below institutional demand.");
  }

  if (frictions > 0) {
    institutionalWarnings.push("Governance friction remains recurrent.");
  }

  if (governanceIntelligence.persistentRisks.length > 0) {
    institutionalWarnings.push("Recurring risks indicate structural weaknesses.");
  }

  return {
    environmental,
    social,
    governance,
    overallScore,
    institutionalHighlights,
    institutionalWarnings,
    fiduciaryDisclaimer: FIDUCIARY_DISCLAIMER,
  };
}
