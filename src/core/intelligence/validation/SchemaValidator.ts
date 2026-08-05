import { ExecutiveArtifactSchema, ExecutiveArtifact } from '../contracts/schema/v1/ExecutiveArtifact.schema';
import { IntelligenceCapability } from '../contracts/capability/IntelligenceCapability';

export class SchemaValidator {
  /**
   * Validates the structure of the artifact using Zod.
   */
  static validateExecutiveArtifactStructure(artifact: unknown): ExecutiveArtifact {
    return ExecutiveArtifactSchema.parse(artifact);
  }

  /**
   * Validates strict governance rules.
   * Throws an error if any governance rule is violated.
   */
  static enforceGovernanceRules(artifact: ExecutiveArtifact): void {
    // Rule 1: Finding sem Fact -> Bloquear (Evita hallucination)
    const hasFindings = artifact.reasoning.findings && artifact.reasoning.findings.length > 0;
    if (hasFindings) {
      for (const finding of artifact.reasoning.findings) {
        if (!finding.relatedFacts || finding.relatedFacts.length === 0) {
          throw new Error('BLOCKED - Governance Validation Failed: Finding without Fact is not allowed (Hallucination Prevention).');
        }
      }
    }

    // Rule 2: Recommendation sem Confidence -> Bloquear
    // Note: Zod schema already requires confidenceLevel on Recommendation, 
    // but we can enforce it explicitly here as a business rule just in case it was bypassed.
    const hasRecommendations = artifact.decision.recommendations && artifact.decision.recommendations.length > 0;
    if (hasRecommendations) {
      for (const rec of artifact.decision.recommendations) {
        if (!rec.confidenceLevel) {
          throw new Error('BLOCKED - Governance Validation Failed: Recommendation without Confidence Score is not allowed.');
        }
      }
    }

    // Rule 3: Global Confidence and Evidence
    // Ensuring the artifact has an overall confidence score and provenance traces
    if (!artifact.governance.confidence || !artifact.governance.confidence.level) {
      throw new Error('BLOCKED - Governance Validation Failed: Overall Confidence is missing.');
    }

    if (!artifact.governance.decisionProvenance || artifact.governance.decisionProvenance.length === 0) {
      throw new Error('BLOCKED - Governance Validation Failed: No Decision Provenance Trace (Evidence) provided.');
    }
  }

  /**
   * Complete validation pipeline
   */
  static validate(artifact: unknown): ExecutiveArtifact {
    const validStructure = this.validateExecutiveArtifactStructure(artifact);
    this.enforceGovernanceRules(validStructure);
    return validStructure;
  }

  /**
   * Validate Capability Contract
   */
  static validateCapability(capability: IntelligenceCapability): void {
    if (!capability.id || !capability.domain || !capability.version) {
      throw new Error('Invalid Capability: Missing core identity fields (id, domain, version).');
    }
    if (!capability.knowledgeRequired || capability.knowledgeRequired.length === 0) {
      throw new Error('Invalid Capability: Must declare required knowledge.');
    }
  }
}
