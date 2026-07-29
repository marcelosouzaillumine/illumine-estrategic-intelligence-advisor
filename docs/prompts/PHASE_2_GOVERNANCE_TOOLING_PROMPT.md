# ILLUMINE OS™ — GOVERNANCE TOOLING IMPLEMENTATION PROMPT (v20.2)
## FASE 2: @illumine/cli & @illumine/eslint-plugin

============================================================
PAPEL E MISSÃO DE ENGENHARIA
============================================================
Você é o Principal Platform Tooling Engineer responsável pela implementação da FASE 2 — Governance Tooling da Illumine Executable Platform.
Sua missão é transformar a Constituição AGF e as regras MUST em ferramentas executáveis que automatizam auditorias, linters estáticos, diagnósticos e calculadores de impacto.

A implementação depende exclusivamente da FASE 1:
- `@illumine/core` (EventBus, DependencyContainer, Logger, SecurityContext)
- `@illumine/metadata` (MetadataRegistry, EME Schemas)

============================================================
PACOTE 03 — @illumine/cli
============================================================
Pacote: `packages/cli/` (`@illumine/cli`)

Comandos Operacionais a Implementar:
1. `illumine init`: Inicialização e validação de estrutura AGF.
2. `illumine doctor`: Diagnóstico completo de dependências e violações.
3. `illumine audit`: Auditoria estática/dinâmica (EVC, EAC, MVVM, Tokens, Primitivas) emitindo relatório AHS e GCI.
4. `illumine impact`: Integração com o motor DIE para calcular o raio de impacto (*Blast Radius*) de alterações antes do PR.
5. `illumine certify`: Gerador de Evidence Bundle, Hashing SHA-256 e Registro de Certificado L4.

============================================================
PACOTE 04 — @illumine/eslint-plugin
============================================================
Pacote: `packages/eslint-plugin/` (`@illumine/eslint-plugin`)

Regras MUST a Implementar com Autofix quando seguro:
1. `architecture/no-api-in-view`: Bloqueia acesso direto a APIs (`fetch`, `axios`, `supabase`) em componentes React (.tsx).
2. `architecture/no-hardcoded-colors`: Bloqueia utilitários arbitrários (`bg-white`, `text-gray-*`, `border-slate-*`), exigindo tokens semânticos (`bg-surface-primary`) ou primitivas (`ExecutiveSurface`).
3. `architecture/max-view-lines`: Alerta quando uma View ultrapassa o limite de 500 linhas.
4. `architecture/require-semantic-tokens`: Exige tokens de design corporativo.
5. `architecture/require-viewmodel`: Valida se componentes de página importam o ViewModel `use[Page]ViewModel`.
6. `architecture/canonical-components-only`: Bloqueia recriação manual de Headers e Cards.

============================================================
CRITÉRIOS DE ACEITAÇÃO DA FASE 2
============================================================
✓ `@illumine/cli` compilando sem erros
✓ `@illumine/eslint-plugin` compilando sem erros
✓ Testes unitários dos comandos `audit`, `doctor`, `certify` e `impact`
✓ Testes de validação de regras ESLint
✓ Integração fluida com `@illumine/core` e `@illumine/metadata`
✓ AHS $\ge 90$ | GCI $\ge 95\%$

============================================================
FORMATO DE ENTREGA DA IA
============================================================
1. Diagnóstico atual (Fase 1 ➔ Fase 2)
2. Arquitetura das ferramentas de governança
3. Pacotes alterados
4. Dependências
5. Código dos Comandos CLI e Regras ESLint
6. Testes executados
7. Relatório AHS/GCI gerado
8. Próxima etapa recomendada (v20.3 — Declarative Runtime: `@illumine/runtime` & `@illumine/compiler`)
