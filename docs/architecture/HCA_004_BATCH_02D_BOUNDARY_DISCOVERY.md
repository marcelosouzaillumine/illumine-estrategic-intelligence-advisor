# HCA-004 Batch 2D: Boundary Reduction Discovery

## 1. Status do Baseline Atual
Após a execução e certificação do Batch 2C, o sistema foi validado em **272 violações de boundary**. 

O objetivo contínuo desta iniciativa é separar estritamente a comunicação direta com o banco de dados e backend (Firebase/Auth/Storage) dos componentes visuais (UI), sem impactar ou alterar o motor fiduciário e mantendo total retrocompatibilidade de comportamento.

- **Baseline Anterior (Batch 2C):** 287 violações
- **Baseline Atual:** 272 violações
- **Meta Projetada (Batch 2D):** ~260 violações

## 2. Discovery de Novos Ofensores
Ao analisar os componentes da camada de apresentação (`src/components/pages/`), identificamos um grupo considerável de telas focadas em operações auxiliares e de configuração (CRUDs). Estas telas são ideais para o Batch 2D, pois possuem baixa sensibilidade fiduciária em relação a motores core como CQS e TFIF, mas detém bastante acoplamento legado ao Firestore.

### TOP 5 Alvos Candidatos:
1. `PlanoDeContasPage.tsx` (~600 linhas)
2. `PremissasClientePage.tsx` (~500 linhas)
3. `PremissasEconomicasPage.tsx` (~350 linhas)
4. `QuadroPessoalPage.tsx`
5. `PortfolioPage.tsx`

Estas telas lidam com leitura, criação, atualização e deleção (`onSnapshot`, `addDoc`, `updateDoc`, `deleteDoc`) diretamente com o Firestore para gerenciar cadastros estruturais que alimentam o motor indiretamente, mas as páginas em si **não rodam cálculos fiduciários**.

## 3. Seleção SAFE para o Batch 2D
Para mitigar os riscos e seguir o método de _"Safe Incrementalism"_, propõe-se atacar as **4 páginas de configuração/premissas** listadas abaixo. Elas são cruciais para a usabilidade, mas mecanicamente simples:

1. **`PlanoDeContasPage.tsx`**
2. **`PremissasClientePage.tsx`**
3. **`PremissasEconomicasPage.tsx`**
4. **`QuadroPessoalPage.tsx`**

**Justificativa Técnica (Baixo Risco):**
- **Zero Risco Fiduciário Direto:** Estas páginas executam apenas CRUDs básicos sobre coleções (`account_plans`, `client_premises`, `economic_premises`, `staff_list`). Elas alimentam os inputs dos motores, mas não possuem as lógicas de motor dentro do componente.
- **Rápido Isolamento:** A lógica é simétrica. Pode ser totalmente encapsulada em hooks como `usePlanoDeContasAdapter`, `usePremissasClienteAdapter`, etc., retornando estado de _loading_, coleções salvas e funções puras (`add`, `update`, `remove`).

## 4. Regras de Execução (Restrições)
Caso aprovado, o Batch 2D seguirá as seguintes restrições:
1. Não corrigir nenhuma violação fora deste escopo aprovado.
2. Não alterar comportamento funcional ou renderização.
3. Isolar 100% das importações relativas a `firebase/firestore` e `../../lib/firebase` nesses arquivos.
4. Reduzir as violações de 272 para cerca de 264 (uma queda mínima garantida de 8 instâncias de violação, dependendo da ramificação exata de imports do Firebase dentro de cada).
5. Rodar os testes após as extrações (Quality Gates padrão).

---

> **Aguardando autorização:** Podemos iniciar a extração destes Adapters e executar o Batch 2D?
