# Component Naming Migration Registry

**Status:** In Progress
**Wave:** 2A.5 / 2A.6

De acordo com as decisões de arquitetura internacional da Illumine OS, todos os nomes internos de componentes (`.tsx`, classes, interfaces) devem ser em inglês padronizado, evitando o uso de termos em português no código. 

A migração de nomenclatura deve ocorrer gradualmente para evitar conflitos de merge extensivos e perda de histórico no Git.

### Migration Queue

Abaixo estão listados os componentes que possuem nomes em português no código-fonte e precisam ser migrados para a nova convenção no futuro:

| Componente Original | Novo Nome Proposto (Inglês) | Status da Migração |
| :--- | :--- | :--- |
| `DiagnosticoPage.tsx` | `ExecutiveAssessmentPage.tsx` | ⏳ Pendente |
| `ControladoriaPage.tsx` | `ControllershipPage.tsx` | ⏳ Pendente |
| `PrecificacaoPage.tsx` | `PricingStrategyPage.tsx` | ⏳ Pendente |
| `QuadroPessoalPage.tsx` | `HeadcountPlanningPage.tsx` | ⏳ Pendente |
| `MarketingComercialPage.tsx` | `CommercialMarketingPage.tsx` | ⏳ Pendente |
| `ViabilityPage.tsx` (se contiver português interno) | - | ⏳ Pendente |

### Como Migrar um Componente

1. Atualize o arquivo `.tsx` e todos os seus exports para o novo nome.
2. Atualize todas as referências ao componente no projeto (ex: `App.tsx`, roteadores, etc).
3. Marque o status nesta tabela como `✅ Concluído`.
4. Garanta que todas as URLs mapeadas no `internationalRoutes.ts` sejam mantidas (as URLs públicas permanecem no idioma do usuário independente do nome do componente).
