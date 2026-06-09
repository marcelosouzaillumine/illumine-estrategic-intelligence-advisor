import { ESGIMAssessment } from "../../runtime/esgim/esgimTypes";
import { InstitutionalNodeBuilder } from "../InstitutionalNodeBuilder";
import { InstitutionalRelationshipBuilder } from "../InstitutionalRelationshipBuilder";
import { InstitutionalGraphRegistry } from "../InstitutionalGraphRegistry";

export class ESGIMGraphAdapter {
  static async registerESGIMGraph(assessment: ESGIMAssessment): Promise<void> {
    try {
      const runId = assessment.lineageHash;
      
      // 1. Map Dimensions to DRIVER nodes
      assessment.dimensions.forEach(dim => {
        const driverNode = new InstitutionalNodeBuilder()
          .ofType("DRIVER")
          .withTitle(`Eixo ESGIM: ${dim.dimension}`)
          .withDescription(dim.explanation)
          .build();
        InstitutionalGraphRegistry.registerNode(driverNode);

        // INDICATOR node for score
        const indNode = new InstitutionalNodeBuilder()
          .ofType("INDICATOR")
          .withTitle(`Score ${dim.dimension}`)
          .withDescription(`Value: ${dim.score} (${dim.status})`)
          .build();
        InstitutionalGraphRegistry.registerNode(indNode);

        // INDICATOR INFLUENCES DRIVER
        const rel = new InstitutionalRelationshipBuilder()
          .between(indNode.nodeId, driverNode.nodeId)
          .ofType("INFLUENCES")
          .build();
        InstitutionalGraphRegistry.registerRelationship(rel);
      });

      // 2. Map Vulnerabilities to RISK nodes
      assessment.vulnerabilities.forEach(vuln => {
        const riskNode = new InstitutionalNodeBuilder()
          .ofType("RISK")
          .withTitle("Vulnerabilidade Material")
          .withDescription(vuln)
          .build();
        InstitutionalGraphRegistry.registerNode(riskNode);

        // DRIVER CAUSES RISK (we loosely bind to the general run ID or overall narrative)
        // Here we just map them as risks. We could connect them to a main objective.
      });

      // 3. Map Strengths to OPPORTUNITY nodes
      assessment.strengths.forEach(str => {
        const oppNode = new InstitutionalNodeBuilder()
          .ofType("OPPORTUNITY")
          .withTitle("Fortaleza Material")
          .withDescription(str)
          .build();
        InstitutionalGraphRegistry.registerNode(oppNode);
      });

      console.log(`[ESGIMGraphAdapter] Successfully registered Knowledge Graph for ESGIM Assessment ${runId}`);
    } catch (error) {
      console.warn("[ESGIMGraphAdapter] Passive integration failed:", error);
    }
  }
}
