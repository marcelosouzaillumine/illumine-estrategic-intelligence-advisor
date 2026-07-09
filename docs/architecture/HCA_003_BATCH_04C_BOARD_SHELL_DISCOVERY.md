# HCA-003 Batch 4C: BoardExperienceShell Boundary Discovery

Este é o micro-discovery focado exclusivamente no componente de mais alto risco visual: `BoardExperienceShell.tsx`.

Devido à sua natureza (Fail-Closed e renderização em contexto fiduciário de Board Mode), qualquer abstração aqui requer atenção total para não gerar regressões no TFIF (Temporal Fiduciary Integrity Framework).

## 1. Topologia da Violação no Shell
Analisando `src/components/executive/board/BoardExperienceShell.tsx`, encontramos duas infrações diretas de *Dumb Renderer*:

1. **Vazamento de Sanitização no Loop de Render (`sanitizeExecutivePayload`)**:
   - A função `sanitizeExecutivePayload` é importada diretamente de `core/presentation/emergency-executive-sanitizer` e executada **dentro** do JSX (linha 79), varrendo `narrative.violations` em tempo real de renderização.

2. **Guardião Fiduciário na UI (`BoardModeGuard.assertSafeRendering`)**:
   - O componente invoca `BoardModeGuard.assertSafeRendering(narrative, sessionId)` estaticamente antes de inicializar o ViewModel. Embora garanta o Fail-Closed estrito, ele prende a UI à lógica de domínio, calculando um `guardErrorStatic` por fora do estado do ViewModel.

## 2. Riscos de Refatoração
- Mover a guarda fiduciária (`BoardModeGuard`) para dentro do ViewModel pode acionar o React Render Cycle de forma assíncrona, arriscando renderizar milissegundos de payload não autorizado se o estado não for inicializado síncronamente.
- O sanitizador de payload é 100% puro e sem estado, sendo altamente seguro de mover.

## 3. Proposta de Intervenção (Batch 4C)

Propomos atuar apenas onde o acoplamento é puramente funcional e não interfere nas diretrizes de Fail-Closed:

**Ação Principal: Migração da Sanitização de Payload**
1. Adicionar uma nova propriedade `safeViolations` no objeto `computed` dentro do `useBoardExperienceShellViewModel`.
2. O ViewModel passará a importar e aplicar o `sanitizeExecutivePayload` na fonte dos dados.
3. A UI do `BoardExperienceShell` simplesmente iterará sobre `computed.safeViolations` usando `map`, eliminando totalmente a importação e o processamento de Core de dentro do componente React.
4. **Guarda Fiduciária Intacta:** Manteremos o `BoardModeGuard.assertSafeRendering` exatamente onde está na UI por ora, pois trata-se de um portão de segurança absoluto. Ele é a única exceção aceitável do Dumb Renderer até que desenvolvamos um HOC (Higher-Order Component) blindado.

Aguardando aprovação para executar esta cirurgia pontual (Batch 4C).
