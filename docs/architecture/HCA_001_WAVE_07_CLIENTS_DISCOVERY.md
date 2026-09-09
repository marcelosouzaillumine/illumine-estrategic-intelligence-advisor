# HCA-001 Wave 07 — Clients Capability Discovery

## 1. Escopo da Análise
**Alvo:** `src/components/pages/ClientsPage.tsx`
**Tamanho do Componente:** ~2.523 linhas (149 KB)
**Objetivo:** Mapear acoplamentos fiduciários e de IA, preparando o escopo seguro para a Wave 07A (refatoração para Dumb Renderer + Application Service + ViewModel).

## 2. Métricas de Acoplamento de Estado e Ciclo de Vida
A página apresenta uma imensa concentração de estado local e orquestração de efeitos:
- **`useState`**: 16 ocorrências (Gerenciamento de view, forms, validações, modais, paginação e filtros).
- **`useEffect`**: 4 ocorrências (Busca inicial de dados, auto-fetch de CNPJ e inscrições em eventos).
- **`useMemo`**: 2 ocorrências (Filtragem e segmentação de clientes).
- **`useCallback`**: 0 ocorrências.

## 3. Mapeamento de Lógica Local de IA
Embora a importação do modal de IA (`GenerateAICompanyModal`) tenha sido comentada/removida, a UI ainda realiza o "parsing" direto da estrutura de IA na aba de `relatorio_ia`:
- A UI inspeciona ativamente propriedades estruturais de IA em tempo de renderização:
  - `(formData as any).aiAnalysis?.challenges`
  - `(formData as any).aiAnalysis?.growthSuggestions`
  - `(formData as any).aiAnalysis?.governance`
  - `(formData as any).aiAnalysis?.operationalFlow`
  - `(formData as any).aiAnalysis?.dashboardIdeas`
- **Violação:** A UI toma a decisão de como renderizar e interpretar dados que pertencem ao domínio da Inteligência Artificial e Governance.

## 4. Mapeamento de Imports e Acesso a Dados
- O componente acessa o Firebase e o Firestore **diretamente**:
  - `collection`, `addDoc`, `updateDoc`, `deleteDoc`, `doc`, `query`, `getDocs`, `onSnapshot`, `writeBatch`.
- O componente faz requisições HTTP externas **diretamente**:
  - `fetch("https://brasilapi.com.br/api/cnpj/v1...")` para buscar dados da empresa a partir do CNPJ.

## 5. Proposta de Desacoplamento (Arquitetura Alvo)
A estrutura será dividida rigorosamente entre:

1. **`useClientsPageViewModel.ts` (ViewModel)**
   - Receberá os 16 `useState`, 4 `useEffect` e as lógicas de filtro (`useMemo`).
   - Controlará as abas do formulário (`dados`, `estrutura`, `fiscal`, `relatorio_ia`, etc.).
   - Exporá a interface consolidada: `{ state, computed, actions }`.

2. **`ClientsApplicationService.ts` (Application Service)**
   - Assumirá 100% da responsabilidade sobre Firestore (`addDoc`, `updateDoc`, `deleteDoc`, `getDocs`, etc.).
   - Isolamento da requisição HTTP ao `brasilapi.com.br` para validação de CNPJ.
   - Fornecerá os dados ao ViewModel de forma agnóstica de banco de dados.

3. **`ClientGovernanceService.ts` (Domain/AI Service)**
   - Ficará responsável por prover a estrutura `aiAnalysis` validada.
   - A UI (`relatorio_ia`) apenas renderizará os dados mapeados, sem precisar realizar casting local (`as any`).

## 6. Escopo Seguro para Wave 07A
Para garantir segurança técnica (sem risco de regressão):
- **Passo 1:** Criar `ClientsApplicationService.ts` e transferir todas as mutações/consultas do Firebase e do BrasilAPI.
- **Passo 2:** Criar `useClientsPageViewModel.ts` e transferir todos os hooks de estado (`useState`, `useEffect`) e handlers de interface, conectando com o `ClientsApplicationService`.
- **Passo 3:** Converter o `ClientsPage.tsx` em um *Dumb Renderer*, preservando toda a sua estrutura visual (Zero mudança visual).
- **Critério de Aceite:** `npm run typecheck`, `npm run build` e testes totalmente verdes. Nenhuma alteração funcional percebida pelo usuário final.
