# Executive Architecture Constitution v6.0

**Status:** APROVADA
**Autoridade:** RC-004 Architecture Checkpoint

Este documento estabelece as leis absolutas para o desenvolvimento, evolução e manutenção da plataforma **Munus Master**, com foco na robustez da *Executive Architecture*. 
A partir desta versão, estas regras são não-negociáveis e serão gradativamente vigiadas por mecanismos de CI automáticos (Guardrails).

---

## 1. Regras de Boundaries (Fronteiras e Imports)
A saúde do repositório depende estritamente do isolamento em camadas. O vazamento de inteligência para componentes visuais quebra a pureza da UI e anula a confiabilidade do sistema fiduciário.

* **[MUST] Dummy Renderer (A Lei de Ouro Visual):** A camada de UI (`src/components/pages`, `src/components/executive`, `src/components/governance`) NUNCA deve tomar decisões, processar lógica de negócios, calcular dados matemáticos ou importar ferramentas de infraestrutura direta (Firebase/Firestore). A UI é estrita e burramente encarregada apenas de renderizar o que recebe.
* **[MUST NOT] Importação Direta do Core/Runtime:** Componentes visuais **não devem** conter `import { Engine } from 'core/runtime...'`. Toda a comunicação fiduciária e estrutural deve passar pela camada intermédia de **ViewModels** ou **Adapters** canônicos.
* **[SHOULD] Uso de Barrels:** Em qualquer refatoração de estrutura de pastas, crie um arquivo proxy/barrel mantendo o caminho original antigo exportando do caminho novo, preservando a retrocompatibilidade temporária e impedindo regressões em cascata.

## 2. Regras de ViewModels (Contrato de Separação)
Toda Capability e Página rica obrigatoriamente terá sua ponte de dados definida por um ViewModel padronizado.

* **[MUST] Contrato Estrutural Obrigatório:** Todo Hook ViewModel (ex: `useFinancialViewModel.ts`) DEVE exportar estritamente três chaves padronizadas:
  1. `state`: Variáveis nativas do React (`useState`, `useReducer`), booleanos de loading, erros locais.
  2. `computed`: Dados matematicamente finalizados, transformados, enriquecidos e formatados (sem estado local reactivo). É daqui que a View desenha os gráficos e tabelas.
  3. `actions`: Funções de comando de usuário (handlers de cliques, paginação, submissão de forms) que orquestram a chamada a Serviços e Runtimes.
* **[MUST NOT] UI no ViewModel:** Um ViewModel não pode retornar JSX, CSS, instanciar bibliotecas de renderização, ou referenciar a `window` e o DOM de forma obstrutiva.

## 3. Regras de Services e Taxonomy
A inteligência do sistema que não possui estado de ciclo de vida visual vive aqui.

* **[MUST] Domínios Canônicos:** Todo novo service criado deve nascer dentro das pastas de domínios semânticos canônicos (`/services/financial`, `/services/intelligence`, `/services/governance`, `/services/platform`, `/services/integrations`), e **não** atirado solto na raiz do `/services/`.
* **[MUST NOT] Fat Services:** Serviços não devem assumir escopo global e cruzar fronteiras financeiras com inteligência artificial, exceto via um Orchestrator (Runtime Adapter).

## 4. Regras de Runtime e Segurança Fiduciária (TFIF)
A camada que não pode falhar, pois afeta diretamente relatórios e auditorias do Board.

* **[MUST] Pureza Fiduciária:** Motores do runtime (Engines) devem ser funções/classes puras, testáveis via Jest offline, sem dependência do React, do contexto de janela do Browser ou de componentes visuais.
* **[MUST] Fail-Closed Síncrono:** Todas as validações de autoridade, limites e acesso temporal de Board Mode (`BoardModeGuard`) devem estourar síncronamente antes da renderização e impedir totalmente a passagem de dados caso a credencial, tenant, ou ciclo de análise seja violado, sem *graceful degradation*. Não há "renderizar parcialmente" no ambiente Fiduciário.
* **[MUST] Discovery First:** Todo batch que envolva mudança sistêmica no Runtime deve começar por um *Discovery Systemic* puramente documental. Refatorações e consolidações (`DELETE` de arquivos, merge de Engines) só podem ocorrer mediante o plano prévio verde no Teste e Typecheck.

---
*Fim do documento. Ao comitar alterações contrárias a estas diretivas, os guardrails do HCA-004 e CI irão estourar falhas. Code gracefully.*
