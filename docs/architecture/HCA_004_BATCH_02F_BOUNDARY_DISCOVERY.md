# HCA-004 Batch 2F: Boundary Reduction Discovery

## 1. Contexto e Status Atual
A arquitetura do projeto (Synkra AIOX) está passando por um refinamento rígido para garantir que componentes de Interface do Usuário (UI) não acessem infraestrutura (Firebase, Auth, Storage) diretamente, ou chamem as engines de Core/Runtime fiduciário indevidamente. O isolamento se dá por meio de **Adapters** e **ViewModels**.

- **Baseline Atual:** 257 violações.
- **Meta do Batch 2F:** Reduzir o número para **~250 violações**.

## 2. Recálculo e Próximos Ofensores (Top Ranking)
Após o processamento via `validate_architecture_boundaries.cjs` filtrando o foco para **Componentes de UI** puros (ignorando as dependências pesadas de `core/` e `runtime/` por enquanto, e priorizando `Firebase/Auth`), os próximos ofensores identificados são:

1. `GestaoUsuariosPage.tsx` (Admin UI) - 3 violações (Firestore, Auth)
2. `useDLPAPageViewModel.ts` (DLPA ViewModel) - 3 violações (Firestore)
3. `DREApplicationService.ts` (DRE Service) - 3 violações (Firestore, Auth)
4. `ClientsApplicationService.ts` (Clients Service) - 2 violações (Firestore)
5. `AcademyAdminCoursePage.tsx` (Academy UI) - 1 violação (Firestore)
6. `LoginPage.tsx` (Auth UI) - 1 violação (Firebase Auth)
7. `useClientsPageViewModel.ts` (Clients ViewModel) - 1 violação (Firebase Auth)

## 3. Seleção de Alvos SAFE (Batch 2F)
Foram selecionados 4 alvos SAFE e pontuais para este lote. A escolha visa isolar a lógica de negócios atrelada ao Firebase em suas páginas sem risco de impactar lógicas financeiras centrais:

1. **`GestaoUsuariosPage.tsx`** (Admin)
   - *Violações estimadas removidas:* 3
   - *Proposta:* Criar `src/adapters/ui/useGestaoUsuariosAdapter.ts` para isolar buscas globais de usuários e chamadas de `sendPasswordResetEmail`.
   
2. **`AcademyAdminCoursePage.tsx`** (Academy)
   - *Violações estimadas removidas:* 1
   - *Proposta:* Criar `src/adapters/ui/useAcademyAdminCourseAdapter.ts` para abstrair operações CRUD de cursos.

3. **`LoginPage.tsx`** (Public/Auth)
   - *Violações estimadas removidas:* 1
   - *Proposta:* Extrair as chamadas diretas de `login`, `loginWithEmail`, `sendPasswordResetEmail` para um `useAuthAdapter.ts` ou injetá-las através do Provider existente se viável.

4. **`useClientsPageViewModel.ts`** (Clients ViewModel)
   - *Violações estimadas removidas:* 1
   - *Proposta:* Remover acoplamento direto com a variável `auth` do Firebase injetando a dependência ou capturando do contexto global/adapter local.

**Redução Esperada:** ~6 violações.
**Estimativa Final:** 257 → 251.

## 4. Regras e Restrições de Execução (Próximo Passo)
- Somente aplicar os fix listados acima.
- O visual e comportamento dessas 4 camadas não deve ser alterado (Zero Visual Impact).
- Manter o padrão de código já desenhado para os adapters de UI.
- Não mexer na lógica fiduciária (engines) e não tocar no core temporal.

*Aguardando autorização para iniciar a execução de certificação do Batch 2F.*
