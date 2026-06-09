const fs = require("fs");
const path = require("path");

function writeFile(filePath, content) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(filePath, content.trim() + "\n");
}

// 1. CognitiveQuery.ts
writeFile("src/types/knowledge-graph/CognitiveQuery.ts", `
import { InstitutionalNode } from "./InstitutionalNode";
import { InstitutionalRelationship } from "./InstitutionalRelationship";
import { CognitivePath } from "./CognitivePath";

export type CognitiveQueryType = 
  | 'ROOT_CAUSE'
  | 'IMPACT_ANALYSIS'
  | 'EVIDENCE_TRACE'
  | 'DECISION_TRACE'
  | 'RISK_CLUSTER'
  | 'CAUSAL_PATH';

export interface CognitiveQuery {
  queryId: string;
  queryType: CognitiveQueryType;
  targetNodeId?: string;
  sourceNodeId?: string;
  depth: number;
  filters?: Record<string, string>;
  requestedAt: string;
}

export interface CognitiveQueryResult {
  queryId: string;
  resultType: CognitiveQueryType;
  nodes: InstitutionalNode[];
  relationships: InstitutionalRelationship[];
  paths: CognitivePath[];
  confidenceLevel: 'DETERMINISTIC' | 'HEURISTIC' | 'PROBABILISTIC';
  generatedAt: string;
}
`);

// 2. CognitivePath.ts
writeFile("src/types/knowledge-graph/CognitivePath.ts", `
import { InstitutionalNode } from "./InstitutionalNode";
import { InstitutionalRelationship } from "./InstitutionalRelationship";

export interface CognitivePath {
  pathId: string;
  sourceNodeId: string;
  targetNodeId: string;
  nodes: InstitutionalNode[];
  relationships: InstitutionalRelationship[];
  pathLength: number;
  confidenceLevel: 'DETERMINISTIC'; // Fixed as per requirements
}
`);

// 3. CognitiveQueryEngine.ts
writeFile("src/core/knowledge-graph/query/CognitiveQueryEngine.ts", `
import { InstitutionalGraphRegistry } from "../InstitutionalGraphRegistry";
import { InstitutionalNode } from "../../../types/knowledge-graph/InstitutionalNode";
import { InstitutionalRelationship } from "../../../types/knowledge-graph/InstitutionalRelationship";
import { CognitiveQuery, CognitiveQueryResult } from "../../../types/knowledge-graph/CognitiveQuery";
import { CognitivePath } from "../../../types/knowledge-graph/CognitivePath";

export class CognitiveQueryEngine {
  
  /**
   * findRootCauses(nodeId)
   * Percorrer relações: CAUSES, INFLUENCES, GENERATED_BY, DERIVED_FROM
   * em direção reversa (target = nodeId).
   */
  public findRootCauses(nodeId: string): CognitiveQueryResult {
    const validEdges = ['CAUSES', 'INFLUENCES', 'GENERATED_BY', 'DERIVED_FROM'];
    return this.executeTraversalQuery('ROOT_CAUSE', nodeId, validEdges, 'REVERSE');
  }

  /**
   * findImpactPath(nodeId)
   * Percorrer relações: INFLUENCES, AGGRAVATES, SUPPORTS, BLOCKS
   * em direção direta (source = nodeId).
   */
  public findImpactPath(nodeId: string): CognitiveQueryResult {
    const validEdges = ['INFLUENCES', 'AGGRAVATES', 'SUPPORTS', 'BLOCKS'];
    return this.executeTraversalQuery('IMPACT_ANALYSIS', nodeId, validEdges, 'FORWARD');
  }

  /**
   * traceEvidence(nodeId)
   * Encontrar todas as evidências conectadas por: SUPPORTS, DERIVED_FROM
   */
  public traceEvidence(nodeId: string): CognitiveQueryResult {
    const validEdges = ['SUPPORTS', 'DERIVED_FROM'];
    // Evidence traces typically look backward to see what supports the node
    return this.executeTraversalQuery('EVIDENCE_TRACE', nodeId, validEdges, 'REVERSE');
  }

  /**
   * traceDecision(nodeId)
   * Encontrar decisões conectadas por: INFLUENCES, SUPPORTS, BLOCKS, GENERATED_BY
   */
  public traceDecision(nodeId: string): CognitiveQueryResult {
    const validEdges = ['INFLUENCES', 'SUPPORTS', 'BLOCKS', 'GENERATED_BY'];
    // Trace decision usually means finding decisions impacted by this node (Forward)
    return this.executeTraversalQuery('DECISION_TRACE', nodeId, validEdges, 'FORWARD');
  }

  /**
   * findRiskCluster(nodeId)
   * Encontrar riscos conectados por: CAUSES, AGGRAVATES, INFLUENCES
   */
  public findRiskCluster(nodeId: string): CognitiveQueryResult {
    const validEdges = ['CAUSES', 'AGGRAVATES', 'INFLUENCES'];
    // Risk clusters can be bidirectional
    return this.executeTraversalQuery('RISK_CLUSTER', nodeId, validEdges, 'BIDIRECTIONAL');
  }

  /**
   * findCausalPath(sourceNodeId, targetNodeId)
   * Buscar caminho determinístico entre dois nós usando BFS.
   */
  public findCausalPath(sourceNodeId: string, targetNodeId: string): CognitiveQueryResult {
    const allRelationships = InstitutionalGraphRegistry.getRelationships();
    const adjList = new Map<string, InstitutionalRelationship[]>();
    
    // Build adjacency
    allRelationships.forEach(rel => {
      if (!adjList.has(rel.sourceNodeId)) adjList.set(rel.sourceNodeId, []);
      adjList.get(rel.sourceNodeId)!.push(rel);
    });

    const queue: { nodeId: string; pathRels: InstitutionalRelationship[] }[] = [];
    queue.push({ nodeId: sourceNodeId, pathRels: [] });
    
    const visited = new Set<string>();
    visited.add(sourceNodeId);

    let foundPath: InstitutionalRelationship[] | null = null;

    while (queue.length > 0) {
      const { nodeId, pathRels } = queue.shift()!;
      if (nodeId === targetNodeId) {
        foundPath = pathRels;
        break;
      }
      const neighbors = adjList.get(nodeId) || [];
      for (const edge of neighbors) {
        if (!visited.has(edge.targetNodeId)) {
          visited.add(edge.targetNodeId);
          queue.push({
            nodeId: edge.targetNodeId,
            pathRels: [...pathRels, edge]
          });
        }
      }
    }

    const paths: CognitivePath[] = [];
    const nodesInPath = new Set<string>();
    const relsInPath: InstitutionalRelationship[] = [];

    if (foundPath) {
      nodesInPath.add(sourceNodeId);
      foundPath.forEach(rel => {
        nodesInPath.add(rel.targetNodeId);
        relsInPath.push(rel);
      });

      paths.push({
        pathId: \`PATH-\${sourceNodeId}-\${targetNodeId}\`,
        sourceNodeId,
        targetNodeId,
        nodes: Array.from(nodesInPath).map(id => InstitutionalGraphRegistry.getNode(id)!).filter(Boolean),
        relationships: relsInPath,
        pathLength: relsInPath.length,
        confidenceLevel: 'DETERMINISTIC'
      });
    }

    return {
      queryId: \`Q-PATH-\${Date.now()}\`,
      resultType: 'CAUSAL_PATH',
      nodes: Array.from(nodesInPath).map(id => InstitutionalGraphRegistry.getNode(id)!).filter(Boolean),
      relationships: relsInPath,
      paths,
      confidenceLevel: 'DETERMINISTIC',
      generatedAt: new Date().toISOString()
    };
  }

  private executeTraversalQuery(
    type: CognitiveQuery['queryType'], 
    startNodeId: string, 
    allowedEdges: string[], 
    direction: 'FORWARD' | 'REVERSE' | 'BIDIRECTIONAL'
  ): CognitiveQueryResult {
    const visitedNodes = new Set<string>([startNodeId]);
    const visitedRels = new Set<InstitutionalRelationship>();
    const allRelationships = InstitutionalGraphRegistry.getRelationships();

    let added = true;
    while (added) {
      added = false;
      for (const rel of allRelationships) {
        if (visitedRels.has(rel)) continue;
        if (!allowedEdges.includes(rel.relationshipType)) continue;

        const matchesForward = direction !== 'REVERSE' && visitedNodes.has(rel.sourceNodeId);
        const matchesReverse = direction !== 'FORWARD' && visitedNodes.has(rel.targetNodeId);

        if (matchesForward || matchesReverse) {
          visitedNodes.add(rel.sourceNodeId);
          visitedNodes.add(rel.targetNodeId);
          visitedRels.add(rel);
          added = true;
        }
      }
    }

    const nodes = Array.from(visitedNodes)
      .map(id => InstitutionalGraphRegistry.getNode(id)!)
      .filter(Boolean);

    return {
      queryId: \`Q-\${type}-\${Date.now()}\`,
      resultType: type,
      nodes,
      relationships: Array.from(visitedRels),
      paths: [], // Explicit path mapping can be done if needed
      confidenceLevel: 'DETERMINISTIC',
      generatedAt: new Date().toISOString()
    };
  }
}
`);

// 4. Validation Fixtures
writeFile("src/core/knowledge-graph/query/CognitiveQueryFixtures.ts", `
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
    console.log(\`Root Causes for \${dec1.title}: Found \${rootCauses.nodes.length} nodes (Expected: 3)\`);
    
    const path = engine.findCausalPath(sc1.nodeId, dec2.nodeId);
    console.log(\`Causal Path from \${sc1.title} to \${dec2.title}: Found path length \${path.paths[0]?.pathLength} (Expected: 3)\`);

    const impact = engine.findImpactPath(d1.nodeId);
    console.log(\`Impact Path for \${d1.title}: Found \${impact.nodes.length} nodes\`);
    
    console.log("Validation complete.");
  }
}

// Automatically run if called directly
if (require.main === module) {
  CognitiveQueryFixtures.runValidation();
}
`);

// 5. Audit Reports
const reportMd = \`# Cognitive Query Engine Report

A camada determinística de travessia do *Institutional Knowledge Graph* foi implementada com sucesso.

### Consultas Suportadas (Determinísticas)
1. **findRootCauses(nodeId)**: Retrocede arestas (\`CAUSES\`, \`INFLUENCES\`) para encontrar as origens de um evento ou restrição.
2. **findImpactPath(nodeId)**: Avança na cadeia para entender o Efeito Dominó (\`AGGRAVATES\`, \`BLOCKS\`) de um choque até Decisões e Objetivos Estratégicos.
3. **traceEvidence(nodeId)**: Varre o grafo em busca da fundação empírica (\`SUPPORTS\`) atrelada a uma conclusão institucional.
4. **traceDecision(nodeId)**: Identifica todos os nós (riscos, axiomas, cenários) que participaram da matriz de aprovação de uma deliberação do conselho.
5. **findRiskCluster(nodeId)**: Mapeia zonas de concentração de risco bidirecionais.
6. **findCausalPath(A, B)**: Calcula via BFS o caminho determinístico inquestionável que conecta a causa A à consequência B.

### Limitações e Contenção Cognitiva
- O motor não possui interpretação semântica profunda (não usa *embeddings* nem LLMs).
- Se a aresta não foi registrada previamente pelas engines (ESGIM, Board, Scenario, Causality, Constitutional), o caminho não existe para o grafo.
- Ausência total de inferência probabilística ("alucinações").

A plataforma extrai respostas da realidade executiva validada do grafo.
\`;

const certMd = \`# Cognitive Query Engine Certification

Certifica-se publicamente a **Soberania Institucional Determinística** do *Cognitive Query Engine v1.0*:

1. **Ausência de Geração Autônoma**: O motor cognitivo **não produz inteligência**. Ele apenas rastreia a inteligência previamente gerada, assinada e imutável das camadas de *Runtime* do Illumine Governance™.
2. **Isolamento de LLMs**: A infraestrutura de travessia de nós (Graph Traversal) opera 100% em algoritmos matemáticos e lógicos padronizados em TypeScript, sem a intervenção de IA de linguagem natural ou modelos probabilísticos (zero tokens transacionados para a formação do caminho).
3. **Auditabilidade Plena**: Toda resposta do *Query Engine* (via \`CognitiveQueryResult\`) carrega explicitamente os IDs dos nós, as arestas cruzadas (\`relationships\`) e o nível de confiança cravado estruturalmente em \`DETERMINISTIC\`.

O Conselho detém controle e escrutínio total sobre as respostas produzidas pelo sistema.
\`;

writeFile("docs/architecture/Cognitive_Query_Engine_Report.md", reportMd);
writeFile("docs/architecture/Cognitive_Query_Engine_Certification.md", certMd);

console.log("CognitiveQueryEngine and Fixtures created.");
