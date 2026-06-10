# Protocolo de Decomposição e Migração Estrutural (Canonical Migration Protocol)

Este documento define o padrão de engenharia da plataforma Illumine Governance™ para a modernização estrutural e visual de suas páginas executivas monolíticas (BP, DFC, DRE, DLPA, ESGIM, etc.).

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

---

## Modelo de Responsabilidade em Camadas (Executive Pages)

Para sustentar o objetivo de orquestração declarativa, toda a refatoração deve obedecer à seguinte matriz de responsabilidades:

| Camada | Responsabilidade | O que pode conhecer e importar |
| :--- | :--- | :--- |
| **Página** (`*Page.tsx`) | Orquestrar, buscar dados, resolver `i18n`, montar DTOs de exibição | Hooks, adapters, engines, serviços, contextos. |
| **Seções** (`*Section.tsx`) | Organizar blocos visuais relacionados e gerenciar grid | Apenas `props` (ViewModels e DTOs) preparadas pelo pai. |
| **Componentes Folha** (`*Card`, `*Toolbar`) | Renderização pura, microinterações (UI) | Strings, números, callbacks simples e DTOs estritos. |
| **Tipos** (`types.ts`) | Definir os contratos exatos de apresentação | Interfaces e *types* somente (sem implementações). |

---

## Regras Operacionais de Props

Durante as microextrações de apresentação, as seguintes regras são inegociáveis para evitar a propagação de dívida técnica:
- **Payloads Mínimos:** Nunca passar objetos gigantes ou relatórios completos se o componente utilizar apenas dois ou três campos específicos.
- **Tipagem Estrita:** É proibido o uso de `any`. Interfaces explícitas (`type` ou `interface`) devem ser declaradas descrevendo estritamente a forma dos dados esperados. Caso o conceito se repita, crie e importe tipos centralizados (ex: `types.ts`).
- **Pré-processamento no Orquestrador:** Componentes de apresentação não devem realizar buscas (`find`, `filter`, `map` complexos) sobre estruturas pesadas de domínio quando isso puder ser pré-processado pelo componente pai. O orquestrador deve resolver os dados brutos e enviar objetos purificados (ex: `ViewModel`) diretamente para o filho.
- **Resolução Centralizada de i18n:** Todo texto dinâmico traduzido deve ser resolvido no componente orquestrador (`Page.tsx`) e repassado aos filhos folha/seção como `string` pronta para exibição.
- **Lógica Isolada:** Não mover lógica de negócio, transformações complexas ou cálculos pesados para dentro do componente extraído. Ele recebe dados prontos e apenas renderiza, permitindo delegar interações via callbacks primitivos (`onClick`, `onChange`).

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
