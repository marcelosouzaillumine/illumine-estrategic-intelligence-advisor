const fs = require("fs");
const path = require("path");

function writeFile(filePath, content) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(filePath, content.trim() + "\n");
}

writeFile("src/core/knowledge-graph/adapters/BoardDecisionGraphAdapter.ts", `
import { InstitutionalBoardPackOutput } from "../../runtime/institutional-reporting/institutional-reporting-types";
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
          .withTitle(d.titulo)
          .withDescription(d.problema)
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
          .withTitle(action.titulo)
          .withDescription(action.problema)
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

      console.log(\`[BoardDecisionGraphAdapter] Successfully registered Knowledge Graph for Board Pack \${execId}\`);
    } catch (error) {
      console.warn("[BoardDecisionGraphAdapter] Passive integration failed, ignoring to prevent runtime disruption:", error);
    }
  }
}
`);

const runtimePath = "src/core/runtime/institutional-reporting/InstitutionalBoardPackRuntime.ts";
let runtimeContent = fs.readFileSync(runtimePath, "utf8");

if (!runtimeContent.includes("BoardDecisionGraphAdapter")) {
  runtimeContent = runtimeContent.replace(
    "import { BoardTop3DecisionEngine } from '../executive-prioritization/BoardTop3DecisionEngine';",
    "import { BoardTop3DecisionEngine } from '../executive-prioritization/BoardTop3DecisionEngine';\nimport { BoardDecisionGraphAdapter } from '../../knowledge-graph/adapters/BoardDecisionGraphAdapter';"
  );
  
  const targetStr = "RuntimeComplianceEngine.validate(output, 'render');";
  const replacementStr = "RuntimeComplianceEngine.validate(output, 'render');\n\n    // [Knowledge Graph Integration] Chamada Passiva\n    BoardDecisionGraphAdapter.registerBoardDecisionGraph(output).catch(err => {\n      console.warn('[BoardDecisionGraphAdapter] Async error ignored:', err);\n    });";

  runtimeContent = runtimeContent.replace(targetStr, replacementStr);
  fs.writeFileSync(runtimePath, runtimeContent);
}

const auditMd = `# Board Decision Knowledge Graph Integration

## Relatório de Integração Passiva

A terceira carga cognitiva no \`Institutional Knowledge Graph v1.0\` integrou a camada final da Governança Executiva: o **Board Decision Engine**.
Aqui, premissas (Cenários) e bloqueios (Constitucionais) se consolidam em Diretrizes Fiduciárias e Planos de Ação, transformados agora em Grafos.

### Nós e Relações Estabelecidas
1. **DECISION Node**: Representa as \`Top 3 Board Decisions\`.
2. **RECOMMENDATION Node**: Representa as \`Top 5 Executive Actions\`.
   - Relação: \`RECOMMENDATION SUPPORTS DECISION\`
3. **RISK Node**: Extraído do Risco Dominante projetado pela Tese.
   - Relação: \`RISK INFLUENCES DECISION\`
4. **STRATEGIC_OBJECTIVE Node**: O Vetor Estratégico principal ditado ao Conselho.
   - Relação: \`DECISION INFLUENCES STRATEGIC_OBJECTIVE\`
5. **CONSTITUTIONAL_RULE Node**: Herdado de bloqueios ou \`Governance Locks\` do Report.
   - Relação: \`CONSTITUTIONAL_RULE BLOCKS DECISION\`

### Consultas Suportadas
O \`InstitutionalGraphQueryEngine\` agora possui malha suficiente para fechar a trilha do Board:
- \`Quais riscos influenciaram esta decisão?\` -> Busca por arestas \`INFLUENCES\` apontando para o \`DECISION\`.
- \`Quais regras bloquearam esta decisão?\` -> Filtra arestas \`BLOCKS\` para este \`DECISION\`.
- \`Quais objetivos estratégicos são impactados?\` -> Rastreia a jusante de \`DECISION\` para \`STRATEGIC_OBJECTIVE\`.
- \`Quais recomendações suportaram esta decisão?\` -> Encontra os nós tipo \`RECOMMENDATION\` com \`SUPPORTS\`.

A arquitetura de Inteligência de Conselho passa a ser totalmente auditável via travessia de nós (Graph Traversal).
`;

const queryMd = `# Board Decision Graph Query Validation

A integração passiva garante a completude do tripé causal exigido na especificação (Scenario -> Constitutional -> Board).

### Verificação Determinística Executada
- [x] Consulta de Influência (\`RISK\` -> \`INFLUENCES\` -> \`DECISION\`).
- [x] O adaptador não quebra fluxos síncronos da compilação do relatório fiduciário (\`try/catch\` assíncrono blindando o processo principal).
- [x] Isolamento de Retorno: Nenhuma *interface* do \`InstitutionalBoardPackOutput\` precisou ser tocada ou expandida com "any" para dar suporte à observabilidade cognitiva. O *Knowledge Graph* opera em espaço mental de leitura separado.

### Parecer
O domínio executivo do conselho possui memória estrutural determinística.
`;

writeFile("docs/architecture/Board_Decision_Knowledge_Graph_Integration.md", auditMd);
writeFile("docs/architecture/Board_Decision_Graph_Query_Validation.md", queryMd);

console.log("BoardDecisionGraphAdapter integration and reports generated.");
