# Legacy Test Stabilization Plan

### Objetivo
Estabilizar a base de testes legada mitigando falsos positivos criados por *contract drift* e falsas regressões provocadas pelas refatorações recentes do Runtime Executivo. Nenhuma engine real será alterada, garantindo o princípio de soberania estabelecido.

### Plano de Correção Controlada

#### 1. `tests/i18n-enum-leak-audit.test.ts`
- **Classificação**: UPDATE_TEST
- **Ação**: Atualizar a regex no teste estático ou construir uma *whitelist* explícita para labels de botões (`IMPORTAR`, `CANCELAR`), colunas (`NOME`, `VALOR`, `STATUS`) e badges semânticos (`CRITICAL`, `WARNING`, `DRAFT`, `COMPLETED`).
- **Risco**: Muito Baixo. Não altera funcionalidade em produção.

#### 2. `tests/institutional-language-regression.test.tsx`
- **Classificação**: UPDATE_TEST
- **Ação**: Aprimorar o `cleanText` extractor para não disparar falso positivo de "Executive Language Leak" em keys de JSON ou chaves internas do sistema (ex: `boardOutlook`). Garantir que os tokens em uppercase (`BOARD`, `EXECUTIVE`, `TECHNICAL`, `EQE`) possuam word boundaries rigorosos e desconsiderem ocorrências em `camelCase`.
- **Risco**: Muito Baixo.

#### 3. `tests/institutional-memory-engine.test.ts`
- **Classificação**: UPDATE_TEST
- **Ação**: Atualizar o mock payload injetado no método `InstitutionalBoardPackDocumentRuntime.generateDocument(reportPayload, 'BOARD')`. O teste exige a existência das chaves de retorno geradas (ex: `docOutput.markdownSections.institutionalMemorySummary`). É preciso garantir que o formato do JSON de entrada atenda as restrições rigorosas da nova arquitetura.
- **Risco**: Baixo.

#### 4. `tests/sovereign-decision-engine.test.ts`
- **Classificação**: UPDATE_TEST
- **Ação**: Da mesma forma que o IME, ajustar os *mock contexts* para que o `reportPayload` passe pelo `InstitutionalBoardPackDocumentRuntime` validamente, retornando os outputs marcados como `md.sovereignDecisionSummary` e `md.survivabilityDecisionFramework`.
- **Risco**: Baixo.

### Execução e Restrições (Fase 5)
Conforme as ordens restritas:
- **Proibido**: Alterar runtime, outputs fiduciários, engines, regras, cálculos ou scores.
- **Proibido**: Silenciar testes com `.skip` sem uma justificativa explícita de "teste obsoleto de MVP".
