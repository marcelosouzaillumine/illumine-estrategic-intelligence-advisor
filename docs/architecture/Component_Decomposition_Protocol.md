# Illumine Governance Component Decomposition Protocol

## Princípio Fundamental (A Regra de Ouro)

> **"Toda complexidade deve caminhar em direção ao orquestrador ou aos adaptadores (mappers); os componentes de apresentação devem caminhar continuamente em direção à simplicidade."**

Esta regra sintetiza a essência da arquitetura de UI da plataforma. Ela cria uma fronteira clara entre domínio e interface, reduz acoplamento, facilita testes, torna as migrações visuais previsíveis e fornece um modelo escalável de evolução segura.

---

Este documento define a estratégia, as diretrizes e as restrições inegociáveis para a refatoração e migração dos grandes componentes executivos (ex: `BalanceSheetPage.tsx`, `DREPage.tsx`, `DFCPage.tsx`) da plataforma Illumine Governance™.

## Princípio de Ouro (Golden Rule)

> **Nunca combinar refatoração estrutural com refatoração visual na mesma alteração.**

Separar estritamente essas preocupações gera benefícios operacionais claros:
* A decomposição passa a ser mecanicamente mais simples e de risco altamente mitigado.
* A revisão de código (*code review*) e a rastreabilidade ficam muito mais objetivas.
* O impacto de uma eventual regressão é local e facilmente isolado.
* A migração para o *Design System* (Camada Canônica) atua sobre componentes focados e bem delimitados, impedindo falhas em cascata que ocorreriam em arquivos gigantescos.

## Ciclo de Modernização (As 4 Fases)

| Fase | Objetivo | Critério de Sucesso |
| :--- | :--- | :--- |
| **1. Decomposição Estrutural** | Reduzir arquivos monolíticos em componentes locais de responsabilidade única. | Zero mudança funcional ou visual; `typecheck` e `lint` completamente aprovados. |
| **2. Estabilização** | Consolidar interfaces, tipagem estrita e fronteiras entre os componentes recém-extraídos. | Componentes perfeitamente coesos, com `props` explícitas, livres do tipo `any` e sem dependências residuais. |
| **3. Canonicalização** | Migrar os blocos locais gradualmente para os componentes canônicos (`MetricTile`, `SemanticCard`, `ExecutiveChart`, `ExecutiveTable`, etc.). | Adoção madura do *Design System* sem regressões e com controle modular total. |
| **4. Simplificação e Orquestração Final** | Transformar a página principal em um orquestrador declarativo. | Arquivo original contendo mínima complexidade de JSX (poucas centenas de linhas), delegando 100% da responsabilidade de apresentação aos subcomponentes. |
| **5. Consolidação de Adaptadores de Apresentação** | Desacoplar definitivamente contratos de domínio da camada visual. | Nenhuma página acessa objetos complexos de engines diretamente. Toda conversão ocorre via funções puras (`mappers.ts`) gerando `ViewModels` estritos. Mudanças no domínio não quebram a UI. |

---

## Modelo de Responsabilidade em Camadas (Executive Pages)

Para sustentar o objetivo de orquestração declarativa, toda a refatoração deve obedecer à seguinte matriz de responsabilidades:

| Camada | Responsabilidade | O que pode conhecer e importar |
| :--- | :--- | :--- |
| **Página** (`*Page.tsx`) | Orquestrar, buscar dados, montar DTOs de exibição | Hooks, adapters, engines, serviços, contextos e mappers. |
| **Mappers** (`mappers.ts`) | Funções puras que convertem Domain DTOs em ViewModels | Tipos de domínio e `view-models.ts` (sem dependência de React). Onde `i18n` e formatações pesadas ocorrem. |
| **Seções** (`*Section.tsx`) | Organizar blocos visuais relacionados e gerenciar grid | Apenas `props` (ViewModels estritos) preparadas pelo pai/mapper. |
| **Componentes Folha** (`*Card`, `*Toolbar`) | Renderização pura, microinterações (UI) | Strings, números, callbacks simples e ViewModels. |
| **Tipos** (`types.ts`, `view-models.ts`) | Contratos estruturais e contratos de apresentação | Interfaces e *types* somente (sem implementações). |

---

## Regras Operacionais de Props

Durante as microextrações de apresentação, as seguintes regras são inegociáveis para evitar a propagação de dívida técnica:
- **Payloads Mínimos:** Nunca passar objetos gigantes ou relatórios completos se o componente utilizar apenas dois ou três campos específicos.
- **Tipagem Estrita:** É proibido o uso de `any`. Interfaces explícitas (`type` ou `interface`) devem ser declaradas descrevendo estritamente a forma dos dados esperados. Caso o conceito se repita, crie e importe tipos centralizados (ex: `types.ts`).
- **Pré-processamento no Orquestrador/Mapper:** Componentes de apresentação não devem realizar buscas (`find`, `filter`, `map` complexos) sobre estruturas pesadas de domínio quando isso puder ser pré-processado. O orquestrador deve invocar o `mappers.ts` para resolver os dados brutos e enviar objetos purificados (ex: `ViewModel`) diretamente para o filho.
- **Resolução Centralizada de i18n:** Todo texto dinâmico traduzido deve ser resolvido no componente orquestrador (`Page.tsx`) ou no `mappers.ts` e repassado aos filhos folha/seção como `string` pronta para exibição.
- **Lógica Isolada:** Não mover lógica de negócio, transformações complexas ou cálculos pesados para dentro do componente extraído. Ele recebe dados prontos e apenas renderiza, permitindo delegar interações via callbacks primitivos (`onClick`, `onChange`).

---

## Indicadores Objetivos de Sucesso (Métricas de Maturidade)

Uma microextração e consolidação só é considerada 100% finalizada quando cumprir os seguintes critérios na camada de apresentação (Folhas e Seções):
- **0 hooks** (`useLanguage`, `useMemo`, `useContext`, etc.) em componentes folha.
- **0 imports** de engines, serviços, ou adapters de domínio em componentes folha.
- **0 uso de `any`** em novos componentes (tudo tipado via `types.ts` ou `view-models.ts`).
- **100% das transformações de dados** concentradas em orquestradores ou `mappers.ts`.
- **1 responsabilidade por componente**, mantendo cada arquivo focado exclusivamente em uma única função visual.

---

## Protocolo Operacional Padrão (Fase 1)

Ao atuar no desmonte estrutural de qualquer página, todos os desenvolvedores e agentes autônomos devem operar sob o seguinte protocolo cirúrgico de *Loop* restrito:

1. **Escolher:** Identificar e eleger **apenas um bloco** autocontido (iniciar sempre pelos menores e mais simples componentes de apresentação).
2. **Extrair:** Criar o arquivo no diretório apropriado (ex: `src/components/pages/<feature>/`), utilizando estritamente a tipagem necessária. **Restrição máxima:** É expressamente proibido alterar a árvore do JSX nativo, classes de CSS e fluxo lógico originário.
3. **Validar Criação:** Executar rigorosamente `npm run typecheck` para atestar o acoplamento das novas interfaces tipadas.
4. **Integrar:** Substituir o bloco bruto isolado no arquivo monolítico original por uma instância do novo componente extraído.
5. **Validar Integração:** Executar uma nova rodada de `npm run typecheck`.
6. **Polimento:** Executar `npm run lint`.
7. **Homologação:** Validar visualmente/funcionalmente o resultado limpo.
8. **Checkpoint Seguro:** Efetivar a modificação via `git commit`, blindando a alteração iterativa.
9. **Reiniciar:** Apenas após a finalização bem-sucedida do commit, a equipe está autorizada a escolher a próxima extração.

> **Regra de Transição:** O avanço para a Fase 3 (Canonicalização) está bloqueado até que todas as extrações locais e isolamentos estruturais de uma página atinjam plena completude e estabilidade na Fase 2.
