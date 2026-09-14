import { InstitutionalBoardPackOutput } from "../../../capabilities/runtime/institutional-reporting/institutional-reporting-types";
import { InstitutionalNodeBuilder } from "../InstitutionalNodeBuilder";
import { InstitutionalRelationshipBuilder } from "../InstitutionalRelationshipBuilder";
import { InstitutionalGraphRegistry } from "../InstitutionalGraphRegistry";

export class BoardDecisionGraphAdapter {
  static async registerBoardDecisionGraph(boardPack: InstitutionalBoardPackOutput): Promise<void> {
    try {
      const execId = boardPack.metadata.boardPackLineageHash;
      
      // 1. Create DECISION Nodes from Top3 Board Decisions
      const boardDecisions = boardPack.executiveDecisionPrioritization?.top3BoardDecisions || [];
      const decisionNodes = boardDecisions.map(d => {
        const node = new InstitutionalNodeBuilder()
          .ofType("DECISION")
          .withTitle(d.titulo || "Decisão")
          .withDescription(d.problema || d.titulo || "Não especificado")
          .build();
        InstitutionalGraphRegistry.registerNode(node);
        return node;
      });

      // 2. Map STRATEGIC_OBJECTIVE (Page Zero Direction)
      const pageZero = boardPack.executiveDecisionPrioritization?.pageZero;
      let strategicNode: any = null;
      if (pageZero?.decisaoMaisImportante) {
        strategicNode = new InstitutionalNodeBuilder()
          .ofType("STRATEGIC_OBJECTIVE")
          .withTitle("Primary Strategic Vector")
          .withDescription(pageZero.decisaoMaisImportante)
          .build();
        InstitutionalGraphRegistry.registerNode(strategicNode);
        
        // Connect decisions to objective
        decisionNodes.forEach(dNode => {
          const rel = new InstitutionalRelationshipBuilder()
            .between(dNode.nodeId, strategicNode.nodeId)
            .ofType("INFLUENCES")
            .build();
          InstitutionalGraphRegistry.registerRelationship(rel);
        });
      }

      // 3. Map RISK
      if (pageZero?.maiorRisco) {
        const riskNode = new InstitutionalNodeBuilder()
          .ofType("RISK")
          .withTitle("Dominant Execution Risk")
          .withDescription(pageZero.maiorRisco)
          .build();
        InstitutionalGraphRegistry.registerNode(riskNode);

        // RISK INFLUENCES DECISIONS
        decisionNodes.forEach(dNode => {
          const rel = new InstitutionalRelationshipBuilder()
            .between(riskNode.nodeId, dNode.nodeId)
            .ofType("INFLUENCES")
            .build();
          InstitutionalGraphRegistry.registerRelationship(rel);
        });
      }

      // 4. Map RECOMMENDATION (Top5 Executive Actions)
      const executiveActions = boardPack.executiveDecisionPrioritization?.top5ExecutiveActions || [];
      executiveActions.forEach((action: any) => {
        const recNode = new InstitutionalNodeBuilder()
          .ofType("RECOMMENDATION")
          .withTitle(action.titulo || "Ação Executiva")
          .withDescription(action.problema || action.titulo || "Não especificado")
          .build();
        InstitutionalGraphRegistry.registerNode(recNode);

        // RECOMMENDATION SUPPORTS DECISION (map to the first board decision as primary anchor)
        if (decisionNodes.length > 0) {
          const rel = new InstitutionalRelationshipBuilder()
            .between(recNode.nodeId, decisionNodes[0].nodeId)
            .ofType("SUPPORTS")
            .build();
          InstitutionalGraphRegistry.registerRelationship(rel);
        }
      });

      // 5. Map Constitutional Restrictions (BLOCKS)
      if (boardPack.status !== 'COMPLETE') {
        const restrictions = boardPack.constitutionalSection?.constitutionalRestrictions || [];
        restrictions.forEach(restriction => {
          const ruleNode = new InstitutionalNodeBuilder()
            .ofType("CONSTITUTIONAL_RULE")
            .withTitle("Active Governance Lock")
            .withDescription(restriction)
            .build();
          InstitutionalGraphRegistry.registerNode(ruleNode);

          // CONSTITUTIONAL_RULE BLOCKS DECISION
          decisionNodes.forEach(dNode => {
            const rel = new InstitutionalRelationshipBuilder()
              .between(ruleNode.nodeId, dNode.nodeId)
              .ofType("BLOCKS")
              .build();
            InstitutionalGraphRegistry.registerRelationship(rel);
          });
        });
      }

      console.log(`[BoardDecisionGraphAdapter] Successfully registered Knowledge Graph for Board Pack ${execId}`);
    } catch (error) {
      console.warn("[BoardDecisionGraphAdapter] Passive integration failed, ignoring to prevent runtime disruption:", error);
    }
  }
}
