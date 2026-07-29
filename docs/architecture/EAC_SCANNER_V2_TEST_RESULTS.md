# EAC Scanner V2 Test Results

| Fixture | Objetivo | Resultado | Confiança |
|---|---|---|---|
| `perfect-analytical.tsx` | Página analítica perfeita | ✅ 100% | High |
| `analytical-inverted.tsx` | Technical antes de Summary | ✅ 80% (Penalizado por inversão e não subordinação) | High |
| `board-mode-incomplete.tsx` | Board Mode apenas com Identity | ✅ 20% (Falso positivo de 100% corrigido) | High |
| `admin-no-actions.tsx` | Formulário administrativo sem Actions | ✅ 60% (Ausência de Actions penaliza) | High |
| `operational-no-working.tsx` | Operacional sem Working Area | ✅ 65% | High |
| `page-with-modal.tsx` | Modal que não interfere no fluxo principal | ✅ 100% (Scanner V2 extrai `mainReturn` do component principal) | Medium |
| `page-with-loading.tsx` | JSX condicional de loading/empty | ✅ 100% | High |
| `imported-components.tsx` | Resolução via Alias/Import | ✅ Registry/Fallback acionado | High |
| `repeated-blocks.tsx` | Múltiplos blocos KPI/Analytics sequenciais | ✅ 100% (Blocos subsequentes condensados, sem penalidade falsa) | High |

O Scanner V2 demonstrou capacidade de:
1. Penalizar fortemente falhas obrigatórias com score positivo (inicia em 0, soma até 100).
2. Não dar 100% para páginas que possuem apenas Page Identity.
3. Não confundir renders antecipados (`if(loading) return <Loader />`) com o fluxo arquitetural principal.
