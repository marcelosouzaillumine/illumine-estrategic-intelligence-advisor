# BoardResolutionEngine Forensic Audit Report
## Resolução de Redundância Crítica (Arquitetura)

Este documento registra o resultado do raio-X forense executado sobre a abstração `BoardResolutionEngine`, sinalizada como **Risco Alto** no relatório de redundâncias estruturais por conta de um empate de imports e presença em diretórios estratégicos paralelos.

### 1. Diagnóstico do Problema
A heurística apontou um conflito entre dois arquivos homônimos:
- `src/core/runtime/board-decision/BoardResolutionEngine.ts` (161 linhas)
- `src/core/runtime/prescriptive-governance/BoardResolutionEngine.ts` (27 linhas)

### 2. Investigação Forense (Comparativo)

#### Implementação 1: `runtime/board-decision/`
- **Contrato e Funções:** Contém o método estático `formalizeResolution(tenantId, clientId, scenario, rationale, approverId, approverRole, report)`.
- **Dependências:** É importado centralmente pelo `FiduciaryRuntimeAdapter` e ativamente fiscalizado pelo script de auditoria `runDecisionGovernanceAudit.ts`.
- **Papel Arquitetural:** Este é o **Motor Fiduciário Oficial de Formalização**. Ele executa travas rigorosas (fail-closed) verificando o `lineageHash` do cenário, aciona o `DecisionComplianceEngine` e o `InstitutionalSurvivabilityEngine` para validar sustentabilidade, e assina criptograficamente a decisão gerando um `resolutionHash`. 
- **Tipo de Risco:** Motor central de certificação. Mutá-lo anularia a rastreabilidade do conselho.

#### Implementação 2: `runtime/prescriptive-governance/`
- **Contrato e Funções:** Contém o método estático `generateResolutions(agenda)`.
- **Dependências:** É importado apenas pelo React hook `usePrescriptiveGovernance.ts`.
- **Papel Arquitetural:** Este é um **Gerador de Minutas Prescritivas**. Ele apenas lê uma Pauta (Agenda) e, para cada item "DELIBERATIVO", produz um rascunho em texto sugerindo o que deve ser deliberado, sem executar qualquer cálculo fiduciário ou travar estados.

### 3. Veredito: Colisão Nominal
O caso **não é uma duplicidade funcional nem código legado substituído**. Trata-se novamente de uma **Colisão Nominal** flagrante. Dois domínios arquiteturais diferentes criaram classes com o mesmo nome para lidar com conceitos distintos (Formalização Criptográfica vs. Rascunho de Ata).

Até os tipos de retorno colidem nominalmente:
- A engine *Board-Decision* retorna a interface `BoardResolution` importada de `board-decision-types.ts` (com hashes, status, assinaturas).
- A engine *Prescriptive-Governance* retorna a interface `BoardResolution` importada de `PrescriptiveTypes.ts` (com títulos, drafts, pautas).

### 4. Risco de Consolidação e Próximos Passos
**Ação Cirúrgica Executada:**
1. O arquivo em `runtime/board-decision/BoardResolutionEngine.ts` foi mantido intacto como o motor oficial.
2. O arquivo `runtime/prescriptive-governance/BoardResolutionEngine.ts` foi renomeado para `BoardDraftingEngine.ts`.
3. Os imports no hook `usePrescriptiveGovernance` foram atualizados para refletir o novo nome, mitigando a entropia nominal sem regressões.

*(Resolvido na Sprint de Redundancy Consolidation como Colisão Nominal)*
