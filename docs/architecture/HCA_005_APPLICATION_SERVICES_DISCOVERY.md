# HCA-005 Batch 0: Application Services Canonicalization - Discovery

## 1. Contexto e Objetivo
Após o encerramento bem-sucedido do HCA-004 (UI Boundary Reduction), que reduziu as violações arquiteturais da camada de Apresentação de 297 para 198, o foco passa a ser a padronização dos Application Services, ViewModels e Domain Services (HCA-005).

O objetivo deste documento é mapear os remanescentes de violações nessas camadas, separando-os por nível de risco e propondo os primeiros alvos seguros para abstração, seguindo a diretriz de **Zero-Impact Engine Assurance** e aderência ao TFIF.

## 2. Mapa de Violações por Severidade
Através de análise sintática e de estrutura de diretórios, identificamos 30 arquivos com algum nível de violação (acoplamento direto ao `Firebase` ou acesso direto ao `Core` burlando as portas de adapter).

### Categoria A: SAFE (ViewModels e Application Services isolados)
Arquivos que fazem a ponte direta UI -> Firebase, mas que já possuem limites claros. A abstração pode ser feita através de Domain Adapters sem risco aos motores críticos.

| Arquivo | Violações (Firebase/Core) | Justificativa |
|---|---|---|
| `BalanceSheetApplicationService.ts` | 1 Firebase | Operação restrita. |
| `useBalanceSheetPageViewModel.ts` | 1 Firebase | Dependência transitiva injetada facilmente. |
| `ClientsApplicationService.ts` | 1 Firebase | Operações CRUD simples. |
| `useClientsPageViewModel.ts` | 1 Firebase | Abstração simples. |
| `useDLPAPageViewModel.ts` | 1 Firebase | Abstração simples (DLPA). |
| `DREApplicationService.ts` | 1 Firebase | Abstração simples (DRE). |
| `InstitutionalDigitalTwinViewModel.ts` | 1 Core | Consome Core direto; fácil de redirecionar para AppService. |
| `GovernanceTimeMachineViewModel.ts` | 2 Core | Consome Core direto; fácil de redirecionar para AppService. |

*Nota:* Testes (`.contract.test.ts`) também registraram imports do core, mas serão desconsiderados por serem SAFE assertions.

### Categoria B: HIGH (Domain Services e Runtimes do Core)
Arquivos localizados em `src/services/` que orquestram cálculos pesados (CQS, CDIL, TFIF). A alteração aqui requer testes de contrato rigorosos.

| Arquivo | Violações | Justificativa / Risco |
|---|---|---|
| `FiduciaryRuntimeAdapter.ts` | >200 Core | Coração do sistema TFIF. (INTOCÁVEL NO INÍCIO) |
| `cashFlowService.ts` | 2 Firebase, 2 Core | Motor de projeção de DFC. |
| `governanceService.ts` | 2 Firebase, 2 Core | Gestão de topologia de tenants. |
| `boardResolutionService.ts` | 2 Firebase, 2 Core | Motor de geração de atas e pareceres. |
| `efosGuard.ts` | 5 Core | Guardrail institucional. |
| `aiService.ts` | 2 Firebase | Serviço de infraestrutura secundário (mas espalhado). |

## 3. Sugestão de Intervenção (Top 5 Alvos SAFE - Batch 0)
Para mantermos o momento do HCA-004 e começarmos a canonicalização dos Serviços sem risco de estourar testes, sugiro os seguintes arquivos para a execução do Batch 0:

1. **`BalanceSheetApplicationService.ts`**
2. **`useBalanceSheetPageViewModel.ts`**
3. **`ClientsApplicationService.ts`**
4. **`useClientsPageViewModel.ts`**
5. **`DREApplicationService.ts`**

**Ação Proposta:**
Criar adaptadores de persistência em `src/adapters/persistence/` para encapsular as chamadas do Firebase (ex: `FirestoreClientsAdapter`, `FirestoreFinancialAdapter`) e injetá-los nesses Application Services/ViewModels, removendo os imports diretos de `firebase/firestore`.

**Meta Estimada:** Remover ~5-6 violações e estabelecer o padrão de injeção de persistência no projeto.

---
*Aguardando aprovação para proceder com a criação dos persistences adapters e execução do Batch 0 do HCA-005!*
