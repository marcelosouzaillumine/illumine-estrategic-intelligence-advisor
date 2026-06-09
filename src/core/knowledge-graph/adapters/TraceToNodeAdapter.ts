import { InstitutionalNodeBuilder } from "../InstitutionalNodeBuilder";
import { InstitutionalNode } from "../../../types/knowledge-graph/InstitutionalNode";

// Stubs for future complex ingestion logic
export class TraceToNodeAdapter {
  static fromEvidence(evidenceId: string, name: string): InstitutionalNode {
    return new InstitutionalNodeBuilder()
      .ofType("EVIDENCE")
      .withTitle(`Evidência: ${name}`)
      .withDescription(`Base documental rastreada: ${evidenceId}`)
      .build();
  }

  static fromExplainability(driverId: string, driverTitle: string): InstitutionalNode {
    return new InstitutionalNodeBuilder()
      .ofType("DRIVER")
      .withTitle(driverTitle)
      .withDescription(`Fator causal rastreado via ${driverId}`)
      .build();
  }
}
