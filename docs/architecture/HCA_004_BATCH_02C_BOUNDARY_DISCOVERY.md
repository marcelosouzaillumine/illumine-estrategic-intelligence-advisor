# HCA-004 Batch 2C: Boundary Reduction Discovery

## 1. Contexto e Baseline Atual
Após o sucesso do Batch 2B, o limite (threshold) do projeto de redução de violações da arquitetura caiu de 297 para **287** violações.
Este documento identifica a próxima leva de refatorações incrementais com o objetivo de reduzir o endividamento técnico de acoplamento da UI com a camada de infraestrutura.

## 2. Descoberta (Top 10 Ofensores de Boundary)
Executamos o `validate:architecture` e mapeamos os 10 arquivos da UI que atualmente importam Firebase ou Core diretamente em maior volume, listados por severidade (quantidade de imports infratores):

1. `ClientExecutiveWorkspace.tsx` (15 violações) - *ALTO RISCO (Workspace denso, acopla múltiplos contextos)*
2. `EFOSPage.tsx` (6 violações) - *MÉDIO RISCO (Página de capability)*
3. `ProfilePage.tsx` (5 violações) - *BAIXO RISCO (Operações simples de Auth/Firebase)*
4. `DadosHistoricosPage.tsx` (5 violações) - *BAIXO RISCO (CRUD simples via Firestore/Storage)*
5. `CashFlowPage.tsx` (5 violações) - *MÉDIO RISCO (Página de capability)*
6. `ForcePasswordChangeModal.tsx` (5 violações) - *BAIXO RISCO (Operação simples de Auth/Firebase)*
7. `PilotExperienceDashboard.tsx` (4 violações) - *MÉDIO RISCO (Dashboard com métricas agregadas)*
8. `GovernanceDashboardPage.tsx` (4 violações) - *ALTO RISCO (Acoplamentos com engines e Runtime Fiduciário)*
9. `DashboardPage.tsx` (4 violações) - *MÉDIO RISCO (Dependências complexas)*
10. `DFCPage.tsx` (4 violações) - *ALTO RISCO (Engine Fiduciário)*

## 3. Seleção de Alvos (Batch 2C)
Seguindo o princípio de priorizar **Firebase/Core simples em UI** e **evitar Runtime/engines fiduciários** neste momento inicial, selecionamos 3 alvos estritamente marcados como **SAFE**:

1. **`ForcePasswordChangeModal.tsx`** (5 violações)
   - *Motivo:* Apenas manipulação simples do `firebase/auth` (`updatePassword`) e `firebase/firestore`. Pode ser resolvido extraindo para um hook `usePasswordChangeAdapter.ts`.
2. **`ProfilePage.tsx`** (5 violações)
   - *Motivo:* Centraliza lógicas de logout e atualização de perfil do usuário logado. Perfeitamente encapsulável em um `useProfileAdapter.ts`.
3. **`DadosHistoricosPage.tsx`** (5 violações)
   - *Motivo:* Focado em operações básicas de upload e consulta transacional para arquivos locais, mas ainda com imports pesados de Firestore/Storage diretamente na UI. O ideal é isolar esse CRUD num `useDadosHistoricosAdapter.ts`.

## 4. Meta do Batch 2C
- **Meta Primária:** Implementar Adapters UI para estes 3 arquivos, eliminando os acoplamentos diretos.
- **Redução Esperada:** Eliminar ~15 violações (5 de cada).
- **Projeção do Threshold:** Baixar o Baseline oficial de **287** para **~272**.

> *Aguardando aprovação explícita para iniciar as refatorações do Batch 2C baseadas nestes alvos.*
