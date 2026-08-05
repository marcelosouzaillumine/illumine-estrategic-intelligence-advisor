# Executive Intelligence Plugin Architecture Spec™

Esta é a especificação arquitetural definitiva (RFC) da Fase C da plataforma Illumine. A plataforma não possui mais o conceito de "diagnósticos acoplados". Tudo o que representa um domínio de inteligência organizacional agora deve obedecer estritamente a arquitetura de Plugins detalhada neste documento.

## 1. Princípios Arquiteturais (The Golden Rules)
1. **Zero Core Coupling:** O motor estrutural (Core) *jamais* pode conhecer a existência de um domínio específico. Nenhum `if (domain === 'financial')` ou `import { ... } from '../financial'` é tolerado no Core.
2. **Domain Isolation:** Um domínio não conhece a lógica interna de outro domínio.
3. **Data-Driven Routing:** Todo fluxo de interface, UI de Workspace e recomendações nasce de dados catalogados no *Registry* e caminhamentos de arestas no *Graph*, não de rotas hardcoded.

## 2. Responsabilidades dos Componentes Core

### 2.1 Domain Registry (`domain-registry.ts`)
- **Papel:** É o catálogo estático de domínios existentes no ecossistema.
- **Responsabilidade:** Conhecer quais domínios estão disponíveis, quais são de fundação (ex: Financial, Governance) e quais motores suportam (ex: Diagnostic, ERP, API).
- **Extensão:** Único local estrutural onde um novo domínio é injetado.

### 2.2 Executive Domain Graph™ (`executive-domain-graph.ts`)
- **Papel:** Mapa direcional de dependências e evolução estratégica.
- **Responsabilidade:** Determinar qual domínio a plataforma deve recomendar em seguida, caminhando através dos nós concluídos para nós órfãos adjacentes.
- **Extensão:** Adição de novas arestas (`addEdge(source, target, weight, reason)`) quando um novo domínio é criado.

### 2.3 Executive Profile Portfolio (`portfolio-types.ts` & `portfolio-summary.service.ts`)
- **Papel:** Agregador do estado organizacional.
- **Responsabilidade:** Armazenar o `ExecutiveDomainState` dinâmico para cada chave do registro e calcular o **Executive Intelligence Index™** através de cruzamentos (Maturity, Coverage, Balance, Foundations).

### 2.4 Narrative Engine (`executive-narrative.service.ts`)
- **Papel:** Tradutor abstrato de capacidades organizacionais.
- **Responsabilidade:** Ler o Estágio Organizacional e o Índice e transformar em um relato fluido para o Advisory.
- **Regra:** Nunca mencionar pontuações e extrair os nomes dos domínios dinamicamente do Registry.

### 2.5 Executive Memory (`executive-memory.service.ts`)
- **Papel:** Banco de armazenamento transversal de longo prazo.
- **Responsabilidade:** Retenção das chaves dinâmicas dos domínios sem inferência de tipo específico de domínio na raiz.

### 2.6 Executive Advisory Workspace (`ExecutiveAdvisoryWorkspacePage.tsx`)
- **Papel:** Visualizador executivo do Portfolio.
- **Responsabilidade:** Iterar sobre todos os nós informados pelo *Registry* e checar o estado dinâmico no *Portfolio* para colorir o Architecture Map e o Maturity Map.

## 3. Lifecycle de um Plugin de Domínio
1. **Creation:** A pasta do domínio é instanciada contendo seus modelos, questões, avaliador e perfis.
2. **Registration:** O domínio é declarado no `DomainRegistry`. A partir deste momento, ele surge instantaneamente no "Architecture Map" da interface, marcado como *Future*.
3. **Graph Mapping:** As arestas de evolução são amarradas no `ExecutiveDomainGraph`. O Copilot passa a saber como recomendá-lo.
4. **Execution:** O Concierge orquestra o diagnóstico e as repostas.
5. **Evaluation:** O `Evaluator` específico do domínio (o único que entende sua própria regra de negócio) calcula sua maturidade e gera um `ExecutiveProfile`.
6. **Portfolio Aggregation:** O sistema engole o profile, constrói o `ExecutiveDomainState`, atualiza o Index, regera a Narrativa e atualiza a Memória. Tudo genericamente.

## 4. Contratos Obrigatórios de um Plugin
Todo plugin **DEVE** expor:
1. Um literal string único mapeado via `DiagnosticDomain` (ex: `"operational"`).
2. Uma subclasse de `ExecutiveDiagnostic` para ser servida ao Concierge (via `DiagnosticRegistry`).
3. Uma instância de metadata em `DomainRegistry` (nome premium, suportes e boolean flag de fundação).

A quebra desses contratos resulta na reprovação arquitetural imediata nos testes de CI/CD.
