# RC1_BASELINE_FREEZE

**Illumine Platform RC-1 Frozen Baseline — Deployment Ready Candidate**

## 1. Baseline Registration
- **Commit/Hash Atual**: `19dbfdcb0076f0b6ec1fd835c53d41ff1d6c869b`
- **Data do Freeze**: 25 de Maio de 2026
- **Scripts Executados**: `npm run release:check`
- **Status Final**: COMPLIANT / FROZEN

## 2. Camadas Congeladas
As seguintes camadas estão oficialmente congeladas nesta baseline:
- **Runtime Analytics Layer**: Engines, Orchestrators, Evaluators (e.g. `BPEngine`, `DREEngine`, `ExecutiveOrchestrator`). Nenhuma fórmula matemática ou lógica de ingestão pode ser alterada.
- **Security & Governance Layer**: `TenantExecutionContext`, `PermissionEngine`, Audit Trails.
- **Topology & Intercompany**: Estrutura multi-entidade, consolidação em BRL, isolamento de tenant.
- **Staging / Ingest Pipeline**: Fluxos de onboarding passivos, isolamento temporário (Staging).

## 3. Critérios de Alteração Futura (Pós-RC-1)
Quaisquer alterações na codebase só poderão ser feitas sob os seguintes critérios estritos:
- Apenas ajustes na UI puramente estéticos ou documentais.
- Apenas fix de bugs *Critical/High* reportados em fase de staging que não afetem a integridade do Runtime (e.g., correção de tipagem, formatação de data).
- Se uma feature não pôde entrar na baseline RC-1, ela foi programada para a RC-2 ou v1.1 e não deve ser inserida agora.

## 4. Regras de Versionamento e Hotfix
- **Regra de Versionamento Pós-RC-1**: 
  - Todo novo commit após este baseline será prefixado como `chore(rc1-hardening):` ou `fix(rc1-bug):`.
  - Nenhuma branch `feature/*` será merjada nesta baseline.
- **Política de Hotfix**: 
  - Hotfixes no Runtime são estritamente desencorajados e requerem re-run completo de `npm run release:check` mais validação manual extensa de regressões financeiras.
- **Regra de Rollback**: 
  - Se um deploy apresentar falha crítica em dados ou corrompimento de UI produtivo, o rollback será efetuado obrigatoriamente e exclusivamente para a hash `19dbfdcb0076f0b6ec1fd835c53d41ff1d6c869b`.

---
*Este documento atesta o encerramento do desenvolvimento funcional para a versão RC-1.*
