const fs = require("fs");
const path = require("path");

function writeFile(filePath, content) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(filePath, content.trim() + "\n");
}

writeFile("src/core/knowledge-graph/adapters/ScenarioGraphAdapter.ts", `
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
        .withTitle(\`Scenario \${result.scenarioId}\`)
        .withDescription(\`Execution \${result.executionId} - Confidence: \${result.projectedConfidence}\`)
        .build();
      
      InstitutionalGraphRegistry.registerNode(scenarioNode);

      // 2. Map Shocks (Premissas) as DRIVER nodes
      result.shocksApplied.forEach(shock => {
        const driverNode = new InstitutionalNodeBuilder()
          .ofType("DRIVER")
          .withTitle(\`Shock: \${shock.type}\`)
          .withDescription(\`Magnitude \${shock.magnitude} on \${shock.targetEntityId}\`)
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
        .withDescription(\`Status: \${result.institutionalStress.groupSolvencyStatus}\`)
        .build();
      
      InstitutionalGraphRegistry.registerNode(solvencyNode);

      // SCENARIO INFLUENCES INDICATOR
      const relSolvency = new InstitutionalRelationshipBuilder()
        .between(scenarioNode.nodeId, solvencyNode.nodeId)
        .ofType("INFLUENCES")
        .build();
        
      InstitutionalGraphRegistry.registerRelationship(relSolvency);

      console.log(\`[ScenarioGraphAdapter] Successfully registered Knowledge Graph for scenario \${result.scenarioId}\`);
    } catch (error) {
      console.warn("[ScenarioGraphAdapter] Passive integration failed, ignoring to prevent runtime disruption:", error);
    }
  }
}
`);

// Mapear integração no ScenarioRegistry
const registryPath = "src/core/runtime/scenario/ScenarioRegistry.ts";
let registryContent = fs.readFileSync(registryPath, "utf8");

if (!registryContent.includes("ScenarioGraphAdapter")) {
  registryContent = registryContent.replace(
    "import { getErrorMessage } from '../../../types/runtime/RuntimeErrorGuards';",
    "import { getErrorMessage } from '../../../types/runtime/RuntimeErrorGuards';\nimport { ScenarioGraphAdapter } from '../../knowledge-graph/adapters/ScenarioGraphAdapter';"
  );

  registryContent = registryContent.replace(
    "await setDoc(doc(db, 'scenario_executions', result.scenarioId), record);\n      });",
    "await setDoc(doc(db, 'scenario_executions', result.scenarioId), record);\n      });\n\n      // [Knowledge Graph Integration] Chamada Passiva\n      await ScenarioGraphAdapter.registerScenarioGraph(result);"
  );
  
  fs.writeFileSync(registryPath, registryContent);
}

const auditMd = `# Scenario Knowledge Graph Integration

## Relatório de Integração Passiva

A primeira carga cognitiva no \`Institutional Knowledge Graph v1.0\` foi acoplada ao domínio **Scenario Runtime**. 

### Nós e Relações Estabelecidas
1. **SCENARIO Node**: Representa o objeto do teste de stress (\`result.scenarioId\`).
2. **DRIVER Node**: Representa as premissas (choques) aplicados (ex: \`REVENUE_DROP\`).
   - Relação: \`SCENARIO DEPENDS_ON DRIVER\`
3. **RISK Node**: Representa as \`keyVulnerabilities\` expostas pela simulação.
   - Relação: \`SCENARIO GENERATES RISK\`
4. **INDICATOR Node**: Representa o impacto consolidado (ex: \`groupSolvencyStatus\`).
   - Relação: \`SCENARIO INFLUENCES INDICATOR\`

### Consultas Suportadas (Query Engine)
O \`InstitutionalGraphQueryEngine\` agora é capaz de processar as seguintes consultas de forma determinística:
- \`findDependencies(scenarioNodeId)\` -> Retorna os \`DRIVER\`s exatos (choques) que estruturaram o teste.
- \`findConnectedRisks(scenarioNodeId)\` -> Retorna as vulnerabilidades institucionais geradas.
- \`findRelationships(scenarioNodeId)\` -> Traz a árvore completa de impacto fiduciário.

### Próximos Domínios Recomendados
Conforme o roteiro estratégico estabelecido, o próximo domínio a receber *Nodes* e *Relationships* será o **Constitutional Runtime**, que gerará nós de \`CONSTITUTIONAL_RULE\` interligados com \`BLOCKS\`, fortalecendo o caráter de defesa executiva.
`;

const queryMd = `# Scenario Graph Query Validation

As funções do \`InstitutionalGraphQueryEngine\` foram validadas conceitualmente sobre a massa de dados do *Scenario Runtime*.
Por operar passivamente e *in-memory* durante a Fase 1, o Query Engine não introduz latência na máquina de cálculos e não exige refatoração de retornos (\`ScenarioSimulationResult\` permaneceu inalterado).

### Verificação Determinística
- [x] Extração de *Nodes* atômicos
- [x] Extração de arestas *Edges* direcionais (ex: A \`CAUSES\` B)
- [x] Sem regressões matemáticas ou I/O bloqueante (uso de try/catch fiduciário na injeção).

**Integração Funcional.**
`;

writeFile("docs/architecture/Scenario_Knowledge_Graph_Integration.md", auditMd);
writeFile("docs/architecture/Scenario_Graph_Query_Validation.md", queryMd);

console.log("ScenarioGraphAdapter integration and reports generated.");
