# Release Hardening Checklist

Este checklist cobre as diretrizes estritas do *Architectural Integrity Audit & Release Hardening* (Phase 5). Ele serve como um portal de qualidade (*quality gate*) obrigatório antes de declarar a plataforma Illumine como **Release Candidate Ready**.

O script `npm run release:check` automatiza todos os passos abaixo de forma sequencial.

## Quality Gates Obrigatórios

### 1. Integridade de Tipagem e Testes Básicos
- [ ] `npm run typecheck` - Compilação TypeScript livre de erros de assinatura e tipagem (Nenhum tipo `any` não justificado, `unknown` resolvido).
- [ ] `npm run test` - Passagem 100% da bateria unitária, incluindo validadores lógicos causais, consolidadores numéricos e testes de componentes restritos.

### 2. Auditorias de Governança
- [ ] `npm run governance:audit` - Garantir o selo `SUCCESS: Plataforma 100% Runtime-Compliant`. Zero violações nos HOCs visuais e regras estritas do `RegressionDetectionEngine` assegurando o padrão "Dummy Renderer".
- [ ] Validação Runtime First - Garantir que a UI jamais defina severidades, confidence metrics, avisos qualitativos ou rode cálculos não autorizados.

### 3. Auditoria Arquitetural (Phase 5 Tools)
- [ ] `npm run architecture:audit` - 0 falhas CRITICAL. Nenhum *bypass* em que a UI importa a lógica primária (Ex.: `ExecutiveOrchestrationEngine` chamado via hook customizado não sancionado ao invés da API/Gateway oficial).
- [ ] `npm run imports:audit` - 0 falhas HIGH. Limpeza e migração absoluta de *imports* banidos (`scenario-simulation-engine.ts`, `financial-engine.ts`, `executive-causality-engine.ts`).
- [ ] `npm run mocks:audit` - 0 falhas HIGH. Ausência de `const mock...` nas páginas finais de produção. O sistema deve operar de ponta a ponta com dados institucionais (Firestore/Runtime).
- [ ] `npm run docs:audit` - Zero documentos essenciais ausentes ou não padronizados na árvore `docs/`. Renomeação e alinhamento dos `MASTER_*.md`.

### 4. Empacotamento Final
- [ ] `npm run build` - Build minificado (`vite build`) finalizando limpo, o que confirma indiretamente rollup paths corretos.

## Plano de Execução Pós-Report (Saneamento)
Quando a plataforma apresentar 0 CRITICAL e 0 HIGH, o relatório de auditoria `ARCHITECTURAL_INTEGRITY_AUDIT.md` deverá ser atualizado para **APROVADO**, conferindo à versão atual o status de RC (Release Candidate).
