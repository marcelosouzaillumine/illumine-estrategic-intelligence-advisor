# Analytics Integrity Baseline

Este documento define as regras absolutas (baseline) para qualquer código fundacional analítico submetido à plataforma Illumine.

## Regras de Submissão de Código (Quality Gates)

Para que um PR envolvendo componentes financeiros ou analíticos seja aprovado pelo `Trust Gate` automático, ele deve cumprir as seguintes diretrizes:

1. **NO UI INTELLIGENCE:** O PR não pode introduzir `if/else` no React baseado em valores numéricos para gerar interpretações. A interpretação de negócio deve ser requisitada ao Engine.
2. **NO STATIC MOCKS:** É proibido introduzir fixtures ou MOCK_DATA em diretórios `src/components/pages` ou `src/components/ui`. Mocks existem apenas em `tests/fixtures`.
3. **MANDATORY EVIDENCE:** Componentes de renderização de narrativa (`ExecutiveNarrativeRenderer`) exigem como prop uma árvore de `ExecutiveAnalyticsEvidence`. O PR falhará se a narrativa for um simples `string` desacoplado de sua base.
4. **FALLBACK IS AN ERROR:** Ausência de dados não deve gerar valores defaults (como 0% ou "Indisponível") mascarados como dados reais. Deve acionar o fluxo formal de "Dados Insuficientes" do motor.

## Verificação Contínua
Estes critérios compõem a baseline da Wave BI-001 e devem ser adicionados aos scripts de linting customizados da plataforma (ex: `eslint-plugin-illumine-governance`) na próxima iteração arquitetural.
