# ILLUMINE OS™ — DECLARATIVE RUNTIME IMPLEMENTATION PROMPT (v20.3)
## FASE 3: @illumine/runtime & @illumine/compiler

============================================================
PAPEL E MISSÃO DE ENGENHARIA DE PLATAFORMA
============================================================
Você é o Principal Runtime Platform Engineer responsável pela implementação da FASE 3 — Declarative Runtime da Illumine Executable Platform.
Sua missão é construir o motor de execução e compilação em tempo real que transforma metadados EME e manifestos declarativos (`.page.manifest.yml`) em árvores de componentes React 100% canônicas sem necessidade de JSX manual.

A implementação depende da FASE 1 e FASE 2:
- `@illumine/core` (EventBus, DependencyContainer, Logger, SecurityContext)
- `@illumine/metadata` (MetadataRegistry, EME Schemas)
- `@illumine/cli` & `@illumine/eslint-plugin` (Governança e Auditoria)

============================================================
PACOTE 05 — @illumine/runtime
============================================================
Pacote: `packages/runtime/` (`@illumine/runtime`)

Componentes e Módulos:
1. `engine/runtime-engine.ts`: Carrega manifestos, resolve layouts EAA/EFA e dispara o evento `RuntimeCompiled`.
2. `engine/manifest-loader.ts`: Carrega e valida os manifestos `.page.manifest.yml`.
3. `engine/component-resolver.ts`: Mapeia tipos declarativos (ex.: `KPI_CARD`, `EXECUTIVE_CHART`, `DATA_TABLE`) para as primitivas oficiais.
4. `routing/route-engine.ts` & `permission-router.ts`: Gerencia rotas declarativas e verifica permissões via `SecurityContext`.
5. `binding/metadata-binding.ts`: Conecta metadados EME à camada de apresentação React passiva.

============================================================
PACOTE 06 — @illumine/compiler
============================================================
Pacote: `packages/compiler/` (`@illumine/compiler`)

Componentes e Compilador AST (EUC Engine):
1. `parser/manifest-parser.ts`: Transforma o manifesto YAML em objeto estruturado.
2. `ast/ast-builder.ts`: Constrói a Árvore de Sintaxe Abstrata Semântica (Semantic AST).
3. `resolver/component-resolver.ts`: Valida se todos os nós da AST pertencem ao catálogo de primitivas canônicas.
4. `compiler-engine.ts`: Compila a AST em nós executáveis otimizados para o Virtual DOM.

Fluxo do Compilador EUC:
`.page.manifest.yml` ➔ `EUC Compiler` ➔ `AST Semântica` ➔ `Executive Components` ➔ `React Tree`

============================================================
CRITÉRIOS DE ACEITAÇÃO DA FASE 3
============================================================
✓ `@illumine/runtime` compilando sem erros
✓ `@illumine/compiler` compilando sem erros
✓ Demonstração executável: Um manifesto declarativo `.page.manifest.yml` é compilado pelo EUC e executado pelo ERE Runtime sem código React manual.
✓ Disparo automático do evento `RuntimeCompiled` no EventBus
✓ AHS $\ge 95$ | GCI $\ge 98\%$

============================================================
FORMATO DE ENTREGA DA IA
============================================================
1. Diagnóstico do status (Fase 1 + 2 ➔ Fase 3)
2. Arquitetura do Runtime Declarativo
3. Código dos pacotes `@illumine/runtime` e `@illumine/compiler`
4. Demonstração de compilação de manifesto
5. Testes unitários e de integração
6. Relatório AHS/GCI
7. Próxima etapa recomendada (v20.4 — Semantic Governance & Certification: `@illumine/see` & `@illumine/certification`)
