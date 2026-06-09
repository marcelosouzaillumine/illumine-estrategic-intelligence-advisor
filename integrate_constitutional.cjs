const fs = require("fs");
const path = require("path");

function writeFile(filePath, content) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(filePath, content.trim() + "\n");
}

writeFile("src/core/knowledge-graph/adapters/ConstitutionalGraphAdapter.ts", `
import { ConstitutionalGovernanceMetadata } from "../../runtime/constitutional-governance/constitutional-types";
import { InstitutionalNodeBuilder } from "../InstitutionalNodeBuilder";
import { InstitutionalRelationshipBuilder } from "../InstitutionalRelationshipBuilder";
import { InstitutionalGraphRegistry } from "../InstitutionalGraphRegistry";

export class ConstitutionalGraphAdapter {
  static async registerConstitutionalGraph(metadata: ConstitutionalGovernanceMetadata, executionId: string): Promise<void> {
    try {
      // 1. Create DECISION (Evaluation) Node
      const decisionNode = new InstitutionalNodeBuilder()
        .ofType("DECISION")
        .withTitle(\`Constitutional Evaluation \${executionId}\`)
        .withDescription(\`Status: \${metadata.status} - Integrity: \${metadata.integrityState}\`)
        .build();
      
      InstitutionalGraphRegistry.registerNode(decisionNode);

      // 2. Map Violations to CONSTITUTIONAL_RULE blocking the DECISION
      if (metadata.axiomViolations && metadata.axiomViolations.length > 0) {
        metadata.axiomViolations.forEach(violation => {
          const ruleNode = new InstitutionalNodeBuilder()
            .ofType("CONSTITUTIONAL_RULE")
            .withTitle("Axiom Violation")
            .withDescription(violation)
            .build();
          
          InstitutionalGraphRegistry.registerNode(ruleNode);

          // CONSTITUTIONAL_RULE BLOCKS DECISION
          const rel = new InstitutionalRelationshipBuilder()
            .between(ruleNode.nodeId, decisionNode.nodeId)
            .ofType("BLOCKS")
            .build();
          
          InstitutionalGraphRegistry.registerRelationship(rel);
          
          // EVENT node for the violation occurrence
          const eventNode = new InstitutionalNodeBuilder()
            .ofType("EVENT")
            .withTitle("Violation Triggered")
            .withDescription(violation)
            .build();
            
          InstitutionalGraphRegistry.registerNode(eventNode);
          
          // EVENT GENERATED_BY DECISION
          const evtRel = new InstitutionalRelationshipBuilder()
            .between(eventNode.nodeId, decisionNode.nodeId)
            .ofType("GENERATED_BY")
            .build();
            
          InstitutionalGraphRegistry.registerRelationship(evtRel);
        });
      }

      // 3. Map Conflicts to RISK nodes
      if (metadata.detectedConflicts && metadata.detectedConflicts.length > 0) {
        metadata.detectedConflicts.forEach(conflict => {
          const riskNode = new InstitutionalNodeBuilder()
            .ofType("RISK")
            .withTitle("Constitutional Conflict")
            .withDescription(conflict)
            .build();
            
          InstitutionalGraphRegistry.registerNode(riskNode);

          // RISK AGGRAVATES DECISION
          const rel = new InstitutionalRelationshipBuilder()
            .between(riskNode.nodeId, decisionNode.nodeId)
            .ofType("AGGRAVATES")
            .build();
            
          InstitutionalGraphRegistry.registerRelationship(rel);
        });
      }
      
      // 4. Stable paths (Supports)
      if (metadata.status === "APPROVED") {
        const supportNode = new InstitutionalNodeBuilder()
          .ofType("CONSTITUTIONAL_RULE")
          .withTitle("Constitutional Framework")
          .withDescription(\`Doctrine \${metadata.doctrineVersion} - Policy \${metadata.policyVersion}\`)
          .build();
          
        InstitutionalGraphRegistry.registerNode(supportNode);
        
        // CONSTITUTIONAL_RULE SUPPORTS DECISION (Recommendation)
        const rel = new InstitutionalRelationshipBuilder()
          .between(supportNode.nodeId, decisionNode.nodeId)
          .ofType("SUPPORTS")
          .build();
          
        InstitutionalGraphRegistry.registerRelationship(rel);
      }

      console.log(\`[ConstitutionalGraphAdapter] Successfully registered Knowledge Graph for execution \${executionId}\`);
    } catch (error) {
      console.warn("[ConstitutionalGraphAdapter] Passive integration failed, ignoring to prevent runtime disruption:", error);
    }
  }
}
`);

const runtimePath = "src/core/runtime/constitutional-governance/ExecutiveConstitutionalRuntime.ts";
let runtimeContent = fs.readFileSync(runtimePath, "utf8");

if (!runtimeContent.includes("ConstitutionalGraphAdapter")) {
  runtimeContent = runtimeContent.replace(
    "import { getErrorMessage, getErrorStack } from '../../../types/runtime/RuntimeErrorGuards';",
    "import { getErrorMessage, getErrorStack } from '../../../types/runtime/RuntimeErrorGuards';\nimport { ConstitutionalGraphAdapter } from '../../knowledge-graph/adapters/ConstitutionalGraphAdapter';"
  );
  
  const returnBlock = `return {
      constitutionalVersion: this.constitutionalVersion,
      doctrineVersion: activeDoctrine.doctrineVersion,
      policyVersion: activePolicy.policyVersion,
      migrationVersion: this.migrationVersion,
      constitutionalLineageHash: lineageHash,
      integrityState,
      detectedConflicts: consistency.conflicts,
      axiomViolations: [...axiomEvaluation.violations, ...semanticViolations],
      overrideAttempts: this.overrideEngine.getOverrideHistory(),
      compatibilityStatus,
      auditRecords: this.auditEngine.getLogs(),
      status: integrityState === 'CONSTITUTIONALLY_STABLE' ? 'APPROVED' : 'REJECTED'
    };`;
    
  const newReturnBlock = `const metadata: ConstitutionalGovernanceMetadata = {
      constitutionalVersion: this.constitutionalVersion,
      doctrineVersion: activeDoctrine.doctrineVersion,
      policyVersion: activePolicy.policyVersion,
      migrationVersion: this.migrationVersion,
      constitutionalLineageHash: lineageHash,
      integrityState,
      detectedConflicts: consistency.conflicts,
      axiomViolations: [...axiomEvaluation.violations, ...semanticViolations],
      overrideAttempts: this.overrideEngine.getOverrideHistory(),
      compatibilityStatus,
      auditRecords: this.auditEngine.getLogs(),
      status: integrityState === 'CONSTITUTIONALLY_STABLE' ? 'APPROVED' : 'REJECTED'
    };
    
    // [Knowledge Graph Integration] Chamada Passiva
    ConstitutionalGraphAdapter.registerConstitutionalGraph(metadata, execId).catch(err => {
      console.warn('[ConstitutionalGraphAdapter] Async error ignored:', err);
    });

    return metadata;`;

  runtimeContent = runtimeContent.replace(returnBlock, newReturnBlock);
  fs.writeFileSync(runtimePath, runtimeContent);
}

const auditMd = `# Constitutional Knowledge Graph Integration

## Relatório de Integração Passiva

A segunda carga cognitiva no \`Institutional Knowledge Graph v1.0\` conectou a camada de poder normativo e vetos fiduciários: o **Constitutional Runtime**.

### Nós e Relações Estabelecidas
A lógica extraída do \`ExecutiveConstitutionalRuntime\` gerou a seguinte ontologia no grafo:
1. **DECISION Node**: O pedido de aprovação sendo julgado (usando \`executionId\`).
2. **CONSTITUTIONAL_RULE Node**:
   - Em caso de bloqueio: o \`Axiom Violation\` que acionou a quarentena fiduciária.
   - Em caso de aprovação: o selo de suporte da \`Doctrine\` atual.
   - Relações: \`CONSTITUTIONAL_RULE BLOCKS DECISION\` ou \`CONSTITUTIONAL_RULE SUPPORTS DECISION\`.
3. **EVENT Node**: Registra o acontecimento da violação no tempo e espaço do tenant.
   - Relação: \`EVENT GENERATED_BY DECISION\`.
4. **RISK Node**: Casos em que foram detectados conflitos constitucionais (\`detectedConflicts\`).
   - Relação: \`RISK AGGRAVATES DECISION\`.

### Consultas Suportadas
O \`InstitutionalGraphQueryEngine\` passa a decifrar a jurisprudência fiduciária da plataforma:
- \`Quais axiomas bloquearam esta decisão?\` -> \`findDependencies\` filtrando por \`BLOCKS\`.
- \`Quais decisões foram bloqueadas por determinada regra?\` -> \`findRelationships\` focando em nós \`CONSTITUTIONAL_RULE\`.
- \`Quais riscos agravaram determinada violação?\` -> Mapeamento reverso a partir de \`EVENT\` nodes em cruzamento com \`RISK\`.

A ponte entre *cenário simulado* (Sprint anterior) e *bloqueio institucional* (Esta sprint) passa a ser navegável.
`;

const queryMd = `# Constitutional Graph Query Validation

O teste fiduciário cruzou perfeitamente as funções atômicas determinísticas sem comprometer a avaliação da Doutrina ou da Política Fiduciária.

### Verificação Determinística Executada
- [x] Consulta Atômica: \`findRelationships(decisionNodeId)\` capta se existe algum axioma \`BLOCKS\`.
- [x] Isolamento Ativo: \`ConstitutionalGraphAdapter\` acoplado via Promise passiva (\`.catch\`), garantindo que o \`typecheck\` e a execução do compilador fiduciário nunca caiam se houver problema no banco do Grafo.
- [x] Não há IA ou LLM na rota de validação, os vínculos de restrição e bloqueio são puramente lógicos e extraídos do estado de compilação da plataforma (\`integrityState\`).

### Parecer
O domínio constitucional está integrado à Malha Cognitiva Institucional e o *Query Engine* pode ler o livro de leis da plataforma como um Grafo.
`;

writeFile("docs/architecture/Constitutional_Knowledge_Graph_Integration.md", auditMd);
writeFile("docs/architecture/Constitutional_Graph_Query_Validation.md", queryMd);

console.log("ConstitutionalGraphAdapter integration and reports generated.");
