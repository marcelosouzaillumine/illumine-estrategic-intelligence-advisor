import type {
  GovernanceDigitalTwinInput,
  GovernanceDigitalTwin,
  GovernanceExecutionCapacity,
  InstitutionalTrajectory,
} from "./governance-digital-twin-types";

const FIDUCIARY_DISCLAIMER =
  "As simulações do Governance Digital Twin são puramente determinísticas, geradas com base na inteligência e memória institucional. Elas não constituem previsão financeira, não alteram valores da camada fiduciária e não utilizam inferência estatística.";

export function buildGovernanceDigitalTwin(
  input: GovernanceDigitalTwinInput | undefined,
): GovernanceDigitalTwin | undefined {
  if (!input?.governanceIntelligence || !input?.governanceMemory) {
    return undefined;
  }

  const { governanceIntelligence } = input;
  
  const executionRatio = governanceIntelligence.decisionEffectiveness.effectivenessRatio;
  
  let classification: "HIGH" | "MODERATE" | "LOW" = "LOW";
  if (executionRatio >= 0.8) {
    classification = "HIGH";
  } else if (executionRatio >= 0.5) {
    classification = "MODERATE";
  }

  const executionCapacity: GovernanceExecutionCapacity = {
    executionRatio,
    classification,
  };

  const currentTrajectory: InstitutionalTrajectory = {
    scenario: "Baseline",
    description: 
      classification === "LOW" 
      ? "Execution remains below decision volume. Current trajectory suggests governance congestion." 
      : "Execution follows decision pace, indicating stable institutional momentum.",
  };

  const executionTrajectory: InstitutionalTrajectory = {
    scenario: "Execution Continuity",
    description: 
      classification === "LOW"
      ? "Approved initiatives may accumulate faster than execution capacity."
      : "Execution capability supports ongoing and new strategic commitments.",
  };

  const riskTrajectory: InstitutionalTrajectory = {
    scenario: "Risk Exposure",
    description: 
      governanceIntelligence.persistentRisks.length > 0
      ? `Recurring themes indicate persistent exposure to ${governanceIntelligence.persistentRisks.length} recurring risk domains.`
      : "Current risk closure rate suggests stable exposure management.",
  };

  const governanceTrajectory: InstitutionalTrajectory = {
    scenario: "Governance Evolution",
    description: 
      governanceIntelligence.recurringTopics.length > 0
      ? "Governance maturity depends on converting recurring discussions into executed actions."
      : "Governance framework effectively resolving topics without chronic recurrence.",
  };

  const institutionalWarnings: string[] = [];
  const institutionalOpportunities: string[] = [];

  if (classification === "LOW") {
    institutionalWarnings.push("Execution capacity remains below institutional demand.");
    institutionalOpportunities.push("Execution improvements may unlock institutional momentum.");
  } else {
    institutionalOpportunities.push("High execution capacity permits acceleration of strategic roadmap.");
  }

  if (governanceIntelligence.persistentRisks.length > 0) {
    institutionalWarnings.push("Risk recurrence indicates unresolved structural causes.");
  }

  if (governanceIntelligence.governanceFrictions.length > 0) {
    institutionalWarnings.push("Governance friction remains present across multiple cycles.");
    institutionalOpportunities.push("Resolving recurring governance frictions creates prioritization opportunities.");
  }

  if (governanceIntelligence.recurringTopics.length > 0) {
    institutionalOpportunities.push("Recurring governance themes create prioritization opportunities.");
  }

  return {
    currentTrajectory,
    executionTrajectory,
    riskTrajectory,
    governanceTrajectory,
    executionCapacity,
    institutionalWarnings,
    institutionalOpportunities,
    fiduciaryDisclaimer: FIDUCIARY_DISCLAIMER,
  };
}
