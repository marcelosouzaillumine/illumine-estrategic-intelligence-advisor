# Analytics Migration Constitution™

Padrão oficial obrigatório para a migração e refatoração das mais de 40 páginas legadas da plataforma para a nova arquitetura do **Canonical Analytics Engine**.

Nenhuma página financeira ou operacional (órfã ou ativa) deve ser modernizada sem obedecer estritamente a este fluxograma de 4 etapas.

## Os 4 Passos da Migração Canônica

Durante o code-review, caso o componente não passe no questionário abaixo, o PR deve sofrer rejeição imediata (`Regression Guard`).

### Passo 1: "Ela calcula algo?"
* **Verificação:** Busque por operadores matemáticos, divisões, somas e reduções (`reduce`) sobre arrays de dados financeiros no corpo do componente (ex: `Ativo / Passivo`).
* **Ação Obrigatória:** Remover imediatamente o cálculo do componente. Transportá-lo para a camada infraestrutural (`Financial Calculation Engine`).

### Passo 2: "Ela interpreta algo?"
* **Verificação:** Busque por IFs lógicos que ditam condições de negócio (ex: `if (margem < 10) return "Ruim"`).
* **Ação Obrigatória:** Remover a lógica do frontend. Mover o julgamento de valor para a respectiva `Capability` (ex: `ProfitabilityCapability`) e o texto descritivo para o `Executive Narrative Engine`.

### Passo 3: "Ela consulta dados diretamente (sem Capabilities)?"
* **Verificação:** Componente usa endpoints antigos (`getBalanco`, `getIndicador`) e injeta os números direto nas *props* do gráfico ou tabela, ignorando a validação semântica.
* **Ação Obrigatória:** Substituir a chamada direta pela solicitação à Capability via `ExecutiveAnalyticsQuery` (ou fachada equivalente). A UI deve receber o `ExecutiveAnalyticsResult` completo com a Evidence Chain.

### Passo 4: "Ela apresenta narrativa?"
* **Verificação:** Textos como "Sua empresa possui...", "Recomendamos que...", "Observação:..." injetados estaticamente no JSX.
* **Ação Obrigatória:** Remover todo o texto estático e dinâmico. Consumir única e exclusivamente o `<ExecutiveNarrativeRenderer narrative={result.narrative} />`. O componente UI torna-se mudo.

---
*Assinado, ARB (Architecture Review Board)*
