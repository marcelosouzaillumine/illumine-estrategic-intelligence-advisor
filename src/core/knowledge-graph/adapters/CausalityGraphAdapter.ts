import { CausalityEngineResolution, CausalRelationship } from "../../governance/causality/types";
import { InstitutionalNodeBuilder } from "../InstitutionalNodeBuilder";
import { InstitutionalRelationshipBuilder } from "../InstitutionalRelationshipBuilder";
import { InstitutionalGraphRegistry } from "../InstitutionalGraphRegistry";

export class CausalityGraphAdapter {
  static async registerCausalityGraph(resolution: CausalityEngineResolution<CausalRelationship[]>): Promise<void> {
    try {
      if (resolution.status !== 'READY' || !resolution.data) return;
      
      resolution.data.forEach(relData => {
        // Source Signal (DRIVER)
        const driverNode = new InstitutionalNodeBuilder()
          .ofType("DRIVER")
          .withTitle(`Causal Driver: ${relData.sourceSignalId}`)
          .withDescription(`Cross-domain impact factor (${relData.impactWeight}%)`)
          .build();
        InstitutionalGraphRegistry.registerNode(driverNode);

        // Target Domain Event (EVENT)
        const eventNode = new InstitutionalNodeBuilder()
          .ofType("EVENT")
          .withTitle(`Impacto em ${relData.targetDomain}`)
          .withDescription("Propagação Causal Detectada")
          .build();
        InstitutionalGraphRegistry.registerNode(eventNode);

        // DRIVER CAUSES EVENT
        const rel = new InstitutionalRelationshipBuilder()
          .between(driverNode.nodeId, eventNode.nodeId)
          .ofType("CAUSES")
          .build();
        InstitutionalGraphRegistry.registerRelationship(rel);
      });

      console.log(`[CausalityGraphAdapter] Successfully registered Knowledge Graph for Causality Engine`);
    } catch (error) {
      console.warn("[CausalityGraphAdapter] Passive integration failed:", error);
    }
  }
}
