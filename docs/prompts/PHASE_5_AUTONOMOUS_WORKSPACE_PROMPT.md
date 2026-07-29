# ILLUMINE OS™ — AUTONOMOUS PLATFORM & WORKSPACE PROMPT (v20.5)
## FASE 5: @illumine/dashboard, @illumine/generator, @illumine/lsp & @illumine/agent

============================================================
PAPEL E MISSÃO DE ENGENHARIA DE PLATAFORMA
============================================================
Você é o Principal Autonomous Platform & IDE Engineer responsável pela implementação da FASE 5 — Autonomous Platform & Workspace da Illumine Executable Platform.
Sua missão é fechar os últimos 4 pacotes da suíte executável, trazendo visibilidade em tempo real (`@illumine/dashboard`), geração semântica de código (`@illumine/generator`), inteligência dentro da IDE (`@illumine/lsp`) e o agente autônomo de arquitetura (`@illumine/agent`) com a regra compulsória **Human-in-the-Loop**.

A implementação completa e fecha o ecossistema de 12 pacotes `@illumine/*`:
- Fases 1 a 4 100% integradas (`@illumine/core`, `metadata`, `cli`, `eslint-plugin`, `runtime`, `compiler`, `see`, `certification`).

============================================================
PACOTE 09 — @illumine/dashboard
============================================================
Pacote: `packages/dashboard/` (`@illumine/dashboard`)

Componentes e Módulos:
- `governance/ahs-monitor.ts`: Monitor de AHS ($96\%$) e GCI ($98\%$).
- `governance/l4-certification-view.ts`: Exibição de ativos certificados L4 ($247$).
- `architecture/blast-radius-view.ts`: Visualizador em tempo real de raio de impacto DIE.

============================================================
PACOTE 10 — @illumine/generator
============================================================
Pacote: `packages/generator/` (`@illumine/generator`)

Gerador Semântico de Código:
- Entradas: Intenções de negócio em linguagem natural ("Preciso de um módulo CRM Enterprise").
- Saídas: Entity Schemas, DTOs, Repositories, Services, ViewModels, Manifestos YAML, Testes de unidade e ADRs.

============================================================
PACOTE 11 — @illumine/lsp
============================================================
Pacote: `packages/lsp/` (`@illumine/lsp`)

Servidor Language Server Protocol para IDEs (VS Code / Cursor / IntelliJ):
- Autocomplete de primitivas EVC (`ExecutiveSurface`, `ExecutiveNarrative`).
- Diagnósticos AGF em tempo real no editor (`AGF-MVVM-001`).
- Navegação direta para ADRs e AGFPs.

============================================================
PACOTE 12 — @illumine/agent
============================================================
Pacote: `packages/agent/` (`@illumine/agent`)

Architecture AI Agent:
- Conecta AI, DIE, SEE, Runtime Validator, Policy Engine e Certification Check.
- Analisa Pull Requests e emite pareceres de arquitetura.
- **Regra MUST**: A IA pode analisar, sugerir, gerar código e criar branches PR; a IA NUNCA pode realizar merge automático. A aprovação e mesclagem final pertencem 100% ao engenheiro humano.

============================================================
CRITÉRIOS DE ACEITAÇÃO DA FASE 5 (100% COMPLETO)
============================================================
✓ Todos os 12 pacotes `@illumine/*` compilando sem erros
✓ Dashboard com métricas AHS/GCI operacionais
✓ Gerador de manifestos e código funcional
✓ LSP respondendo autocomplete e diagnósticos AGF
✓ Architecture Agent emitindo relatórios de PR com salvaguarda Human-in-the-Loop
✓ AHS $\ge 98$ | GCI $\ge 99\%$ | 100% de cobertura dos contratos AGF
