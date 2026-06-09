# Legacy Test Failure Inventory

### Diagnóstico da Suíte de Testes (Baseado no histórico de execução contínua)

Foram mapeadas as seguintes falhas residuais persistentes no pipeline `npm run test`:

#### 1. `tests/i18n-enum-leak-audit.test.ts`
- **Falha**: O teste estático (Regex) detecta "vazamento de enums" porque localiza strings puramente em maiúsculas renderizadas diretamente em JSX (ex: `> CANCELAR <`, `> IMPORTAR <`, `> STATUS <`, `> COMPLETED <`).
- **Classificação**: **I18N_CONTRACT_DRIFT** / **LEGACY_EXPECTATION**
- **Motivo**: O regex `>\s*([A-Z0-9_]{4,})\s*<` captura labels de botões, cabeçalhos de tabela e *badges* semânticos em maiúsculo (como `COMPLETED` ou `REJECTED`). Isso é um falso positivo se a plataforma ainda não impôs tradução obrigatória para todos os botões do sistema na nova UI executiva.

#### 2. `tests/institutional-language-regression.test.tsx`
- **Falha**: `EXECUTIVE_LANGUAGE_LEAK` provocado pela detecção de tokens proibidos (`BOARD`, `EXECUTIVE`, `TECHNICAL`, `EQE`) no texto renderizado da `DFCPage`.
- **Classificação**: **SEMANTIC_POLICY_DRIFT**
- **Motivo**: A própria estrutura de saída do Runtime (`mockRuntimeOutput`) possui campos como `boardOutlook` e strings como "Geração operacional...". Ao cruzar com a validação "case-insensitive", a presença legítima da palavra (seja no label ou na navegação) aciona o alarme antiescape de vocabulário legado.

#### 3. `tests/institutional-memory-engine.test.ts`
- **Falha**: Falha de asserção na verificação do `docOutput.markdownSections.institutionalMemorySummary`.
- **Classificação**: **LEGACY_EXPECTATION**
- **Motivo**: O `InstitutionalBoardPackDocumentRuntime` foi fortemente refatorado nas *sprints* de Reporting e Fiduciary Sovereign. As antigas seções explícitas de Markdown que o teste exigia (como `fiduciaryTimelineReport`) mudaram de nome ou foram consolidadas no relatório Executivo Unificado. O teste ainda exige as chaves antigas.

#### 4. `tests/sovereign-decision-engine.test.ts`
- **Falha**: Falha de asserção na estrutura gerada pelo Board Pack Runtime para a saída do `SovereignDecisionAdapter`.
- **Classificação**: **LEGACY_EXPECTATION**
- **Motivo**: Mesmo motivo acima. Exige `md.sovereignDecisionSummary` e `md.survivabilityDecisionFramework`, quando a arquitetura atual de governança condensa isso na `fiduciaryRationale` ou em artefatos de aprovação integrados.
