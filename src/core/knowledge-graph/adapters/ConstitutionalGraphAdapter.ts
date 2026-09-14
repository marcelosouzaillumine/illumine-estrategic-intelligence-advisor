import { ConstitutionalGovernanceMetadata } from "../../../capabilities/runtime/constitutional-governance/constitutional-types";
import { InstitutionalNodeBuilder } from "../InstitutionalNodeBuilder";
import { InstitutionalRelationshipBuilder } from "../InstitutionalRelationshipBuilder";
import { InstitutionalGraphRegistry } from "../InstitutionalGraphRegistry";

export class ConstitutionalGraphAdapter {
  static async registerConstitutionalGraph(metadata: ConstitutionalGovernanceMetadata, executionId: string): Promise<void> {
    try {
      // 1. Create DECISION (Evaluation) Node
      const decisionNode = new InstitutionalNodeBuilder()
        .ofType("DECISION")
        .withTitle(`Constitutional Evaluation ${executionId}`)
        .withDescription(`Status: ${metadata.status} - Integrity: ${metadata.integrityState}`)
        .build();
      
      InstitutionalGraphRegistry.registerNode(decisionNode);

      // 2. Map Violations to CONSTITUTIONAL_RULE blocking the DECISION
      if (metadata.axiomViolations && metadata.axiomViolations.length > 0) {
        metadata.axiomViolations.forEach(violation => {
          const ruleNode = new InstitutionalNodeBuilder()
            .ofType("CONSTITUTIONAL_RULE")
            .withTitle("Axiom Violation")
            .withDescription(violation)
            .build();
          
          InstitutionalGraphRegistry.registerNode(ruleNode);

          // CONSTITUTIONAL_RULE BLOCKS DECISION
          const rel = new InstitutionalRelationshipBuilder()
            .between(ruleNode.nodeId, decisionNode.nodeId)
            .ofType("BLOCKS")
            .build();
          
          InstitutionalGraphRegistry.registerRelationship(rel);
          
          // EVENT node for the violation occurrence
          const eventNode = new InstitutionalNodeBuilder()
            .ofType("EVENT")
            .withTitle("Violation Triggered")
            .withDescription(violation)
            .build();
            
          InstitutionalGraphRegistry.registerNode(eventNode);
          
          // EVENT GENERATED_BY DECISION
          const evtRel = new InstitutionalRelationshipBuilder()
            .between(eventNode.nodeId, decisionNode.nodeId)
            .ofType("GENERATED_BY")
            .build();
            
          InstitutionalGraphRegistry.registerRelationship(evtRel);
        });
      }

      // 3. Map Conflicts to RISK nodes
      if (metadata.detectedConflicts && metadata.detectedConflicts.length > 0) {
        metadata.detectedConflicts.forEach(conflict => {
          const riskNode = new InstitutionalNodeBuilder()
            .ofType("RISK")
            .withTitle("Constitutional Conflict")
            .withDescription(conflict)
            .build();
            
          InstitutionalGraphRegistry.registerNode(riskNode);

          // RISK AGGRAVATES DECISION
          const rel = new InstitutionalRelationshipBuilder()
            .between(riskNode.nodeId, decisionNode.nodeId)
            .ofType("AGGRAVATES")
            .build();
            
          InstitutionalGraphRegistry.registerRelationship(rel);
        });
      }
      
      // 4. Stable paths (Supports)
      if (metadata.status === "APPROVED") {
        const supportNode = new InstitutionalNodeBuilder()
          .ofType("CONSTITUTIONAL_RULE")
          .withTitle("Constitutional Framework")
          .withDescription(`Doctrine ${metadata.doctrineVersion} - Policy ${metadata.policyVersion}`)
          .build();
          
        InstitutionalGraphRegistry.registerNode(supportNode);
        
        // CONSTITUTIONAL_RULE SUPPORTS DECISION (Recommendation)
        const rel = new InstitutionalRelationshipBuilder()
          .between(supportNode.nodeId, decisionNode.nodeId)
          .ofType("SUPPORTS")
          .build();
          
        InstitutionalGraphRegistry.registerRelationship(rel);
      }

      console.log(`[ConstitutionalGraphAdapter] Successfully registered Knowledge Graph for execution ${executionId}`);
    } catch (error) {
      console.warn("[ConstitutionalGraphAdapter] Passive integration failed, ignoring to prevent runtime disruption:", error);
    }
  }
}
