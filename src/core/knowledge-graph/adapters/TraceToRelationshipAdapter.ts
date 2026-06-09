import { InstitutionalRelationshipBuilder } from "../InstitutionalRelationshipBuilder";
import { InstitutionalRelationship } from "../../../types/knowledge-graph/InstitutionalRelationship";

export class TraceToRelationshipAdapter {
  static mapSupport(evidenceNodeId: string, targetNodeId: string): InstitutionalRelationship {
    return new InstitutionalRelationshipBuilder()
      .between(evidenceNodeId, targetNodeId)
      .ofType("SUPPORTS")
      .build();
  }

  static mapCausality(driverNodeId: string, outcomeNodeId: string): InstitutionalRelationship {
    return new InstitutionalRelationshipBuilder()
      .between(driverNodeId, outcomeNodeId)
      .ofType("CAUSES")
      .build();
  }
}
