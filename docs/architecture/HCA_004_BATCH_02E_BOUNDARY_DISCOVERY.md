# HCA-004 Batch 2E: Boundary Reduction Discovery

## 1. Contexto Atual (Baseline Recalculado)
O script de validação de arquitetura indicou que o sistema atualmente possui cerca de **272 violações totais detectadas**. (Nota: O Batch 2D introduziu artefatos incompletos que necessitam ser revisados, por isso a contagem real flutuou temporariamente de volta para o patamar original).
O objetivo deste Batch 2E é consolidar as correções pendentes das páginas de premissas e expandir a extração para novas páginas focadas, reduzindo o número total de violações da barreira de 272 para o alvo de **~257 violações**, focando estritamente em dependências `Firebase/Auth/Storage` que invadiram a camada de Apresentação.

## 2. Ofensores Identificados (Lista Parcial)
Os ofensores elegíveis (que não misturam lógica Fiduciária core/engines) identificados pelo scanner são:

| Arquivo (UI Component / ViewModel) | Tipo de Invasão | Contagem | Complexidade |
|------------------------------------|-----------------|----------|--------------|
| `PremissasClientePage.tsx` | Firebase | 3 | SAFE |
| `PremissasEconomicasPage.tsx` | Firebase | 3 | SAFE |
| `QuadroPessoalPage.tsx` | Firebase | 3 | SAFE |
| `GovernanceMaturityCenter.tsx` | Firebase | 3 | SAFE |
| `LeadershipDNACenter.tsx` | Firebase | 3 | SAFE |
| `LoginPage.tsx` | Firebase | 1 | SAFE |
| `useClientsPageViewModel.ts` | Firebase | 1 | SAFE |

## 3. Escopo Proposto para o Batch 2E (Execução)
Selecionamos 5 alvos classificados como **SAFE** para extração, combinando o reparo das premissas com novos centros de governança:

1. **`PremissasClientePage.tsx`** (Consolidar Adapter correto p/ `client_assumptions`)
2. **`PremissasEconomicasPage.tsx`** (Consolidar Adapter correto)
3. **`QuadroPessoalPage.tsx`** (Consolidar Adapter correto)
4. **`GovernanceMaturityCenter.tsx`** (Criar `useGovernanceMaturityAdapter.ts`)
5. **`LeadershipDNACenter.tsx`** (Criar `useLeadershipDNAAdapter.ts`)

**Meta Numérica:** Redução de **272 → ~257** violações.

## 4. Regras de Execução Restritas (Guardrails)
- **Não alterar comportamento nem layout**: Todo estado visual de modais e tabelas deve ser idêntico.
- **Zero impacto em Runtime / Fiduciário**: Não mexer em arquivos `.ts` do diretório `core/` ou `runtime/`.
- **Extração Analítica Exata**: O processo vai criar custom hooks em `src/adapters/ui/` clonando perfeitamente a leitura/escrita do Firebase que existe nativamente nos componentes originais.
- **Qualidade Garantida**: Executar os gates de `typecheck` e testes E2E/Fiduciários para provar a ausência de regressões antes da certificação.

---
**Status:** Aguardando aprovação para prosseguir com a implementação do Batch 2E.
