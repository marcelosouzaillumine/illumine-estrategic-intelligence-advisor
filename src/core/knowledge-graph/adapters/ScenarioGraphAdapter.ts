import { ScenarioSimulationResult } from "../../runtime/scenario/ScenarioTypes";
import { InstitutionalNodeBuilder } from "../InstitutionalNodeBuilder";
import { InstitutionalRelationshipBuilder } from "../InstitutionalRelationshipBuilder";
import { InstitutionalGraphRegistry } from "../InstitutionalGraphRegistry";

export class ScenarioGraphAdapter {
  static async registerScenarioGraph(result: ScenarioSimulationResult): Promise<void> {
    try {
      // 1. Create SCENARIO node
      const scenarioNode = new InstitutionalNodeBuilder()
        .ofType("SCENARIO")
        .withTitle(`Scenario ${result.scenarioId}`)
        .withDescription(`Execution ${result.executionId} - Confidence: ${result.projectedConfidence}`)
        .build();
      
      InstitutionalGraphRegistry.registerNode(scenarioNode);

      // 2. Map Shocks (Premissas) as DRIVER nodes
      result.shocksApplied.forEach(shock => {
        const driverNode = new InstitutionalNodeBuilder()
          .ofType("DRIVER")
          .withTitle(`Shock: ${shock.type}`)
          .withDescription(`Magnitude ${shock.magnitude} on ${shock.targetEntityId}`)
          .build();
        
        InstitutionalGraphRegistry.registerNode(driverNode);

        // DRIVER CAUSES SCENARIO (or SCENARIO DEPENDS_ON DRIVER)
        const rel = new InstitutionalRelationshipBuilder()
          .between(scenarioNode.nodeId, driverNode.nodeId)
          .ofType("DEPENDS_ON")
          .build();
        
        InstitutionalGraphRegistry.registerRelationship(rel);
      });

      // 3. Map Vulnerabilities / Stress as RISK nodes
      result.narrative.keyVulnerabilities.forEach(vuln => {
        const riskNode = new InstitutionalNodeBuilder()
          .ofType("RISK")
          .withTitle("Vulnerability Detected")
          .withDescription(vuln)
          .build();
          
        InstitutionalGraphRegistry.registerNode(riskNode);

        // SCENARIO GENERATES RISK
        const rel = new InstitutionalRelationshipBuilder()
          .between(scenarioNode.nodeId, riskNode.nodeId)
          .ofType("GENERATED_BY")
          .build();
          
        InstitutionalGraphRegistry.registerRelationship(rel);
      });

      // 4. Map Solvency Status as INDICATOR node
      const solvencyNode = new InstitutionalNodeBuilder()
        .ofType("INDICATOR")
        .withTitle("Group Solvency")
        .withDescription(`Status: ${result.institutionalStress.groupSolvencyStatus}`)
        .build();
      
      InstitutionalGraphRegistry.registerNode(solvencyNode);

      // SCENARIO INFLUENCES INDICATOR
      const relSolvency = new InstitutionalRelationshipBuilder()
        .between(scenarioNode.nodeId, solvencyNode.nodeId)
        .ofType("INFLUENCES")
        .build();
        
      InstitutionalGraphRegistry.registerRelationship(relSolvency);

      console.log(`[ScenarioGraphAdapter] Successfully registered Knowledge Graph for scenario ${result.scenarioId}`);
    } catch (error) {
      console.warn("[ScenarioGraphAdapter] Passive integration failed, ignoring to prevent runtime disruption:", error);
    }
  }
}
