import { InstitutionalNodeBuilder } from "../InstitutionalNodeBuilder";
import { InstitutionalRelationshipBuilder } from "../InstitutionalRelationshipBuilder";
import { InstitutionalGraphRegistry } from "../InstitutionalGraphRegistry";
import { CognitiveQueryEngine } from "./CognitiveQueryEngine";

export class CognitiveQueryFixtures {
  static runValidation() {
    console.log("Setting up Graph Fixtures...");

    // 1. Driver -> Risk -> Decision
    const d1 = new InstitutionalNodeBuilder().ofType("DRIVER").withTitle("Macroeconomic Shock").build();
    const r1 = new InstitutionalNodeBuilder().ofType("RISK").withTitle("Liquidity Crunch").build();
    const dec1 = new InstitutionalNodeBuilder().ofType("DECISION").withTitle("Halt CapEx").build();
    
    InstitutionalGraphRegistry.registerNode(d1);
    InstitutionalGraphRegistry.registerNode(r1);
    InstitutionalGraphRegistry.registerNode(dec1);
    
    InstitutionalGraphRegistry.registerRelationship(new InstitutionalRelationshipBuilder().between(d1.nodeId, r1.nodeId).ofType("CAUSES").build());
    InstitutionalGraphRegistry.registerRelationship(new InstitutionalRelationshipBuilder().between(r1.nodeId, dec1.nodeId).ofType("INFLUENCES").build());

    // 2. Evidence -> Indicator -> Recommendation
    const ev1 = new InstitutionalNodeBuilder().ofType("EVIDENCE").withTitle("Audit Report").build();
    const ind1 = new InstitutionalNodeBuilder().ofType("INDICATOR").withTitle("Compliance Score").build();
    const rec1 = new InstitutionalNodeBuilder().ofType("RECOMMENDATION").withTitle("Strengthen Controls").build();
    
    InstitutionalGraphRegistry.registerNode(ev1);
    InstitutionalGraphRegistry.registerNode(ind1);
    InstitutionalGraphRegistry.registerNode(rec1);

    InstitutionalGraphRegistry.registerRelationship(new InstitutionalRelationshipBuilder().between(ev1.nodeId, ind1.nodeId).ofType("SUPPORTS").build());
    InstitutionalGraphRegistry.registerRelationship(new InstitutionalRelationshipBuilder().between(ind1.nodeId, rec1.nodeId).ofType("SUPPORTS").build());

    // 3. Scenario -> Risk -> Constitutional Rule -> Blocked Decision
    const sc1 = new InstitutionalNodeBuilder().ofType("SCENARIO").withTitle("Stress Test A").build();
    const r2 = new InstitutionalNodeBuilder().ofType("RISK").withTitle("Capital Erosion").build();
    const cr1 = new InstitutionalNodeBuilder().ofType("CONSTITUTIONAL_RULE").withTitle("Capital Preservation Axiom").build();
    const dec2 = new InstitutionalNodeBuilder().ofType("DECISION").withTitle("Dividend Payout").build();

    InstitutionalGraphRegistry.registerNode(sc1);
    InstitutionalGraphRegistry.registerNode(r2);
    InstitutionalGraphRegistry.registerNode(cr1);
    InstitutionalGraphRegistry.registerNode(dec2);

    InstitutionalGraphRegistry.registerRelationship(new InstitutionalRelationshipBuilder().between(sc1.nodeId, r2.nodeId).ofType("GENERATED_BY").build());
    InstitutionalGraphRegistry.registerRelationship(new InstitutionalRelationshipBuilder().between(r2.nodeId, cr1.nodeId).ofType("INFLUENCES").build());
    InstitutionalGraphRegistry.registerRelationship(new InstitutionalRelationshipBuilder().between(cr1.nodeId, dec2.nodeId).ofType("BLOCKS").build());

    const engine = new CognitiveQueryEngine();
    
    console.log("Running Deterministic Queries...");
    
    const rootCauses = engine.findRootCauses(dec1.nodeId);
    console.log(`Root Causes for ${dec1.title}: Found ${rootCauses.nodes.length} nodes (Expected: 3)`);
    
    const path = engine.findCausalPath(sc1.nodeId, dec2.nodeId);
    console.log(`Causal Path from ${sc1.title} to ${dec2.title}: Found path length ${path.paths[0]?.pathLength} (Expected: 3)`);

    const impact = engine.findImpactPath(d1.nodeId);
    console.log(`Impact Path for ${d1.title}: Found ${impact.nodes.length} nodes`);
    
    console.log("Validation complete.");
  }
}

// Automatically run if called directly
if (require.main === module) {
  CognitiveQueryFixtures.runValidation();
}
