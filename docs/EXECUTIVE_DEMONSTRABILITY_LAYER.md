# Executive Demonstrability Layer (RC-1.1B) 🏛️

Esta documentação define a arquitetura, regras fiduciárias, políticas de governança e implementação para a camada de demonstração executiva da plataforma Illumine.

## Diretriz Central

A demonstração executiva não pode ser uma simulação livre nem uma experiência visual desacoplada do runtime. Ela deve ser uma reprodução institucional controlada, auditável, imutável, versionada e **fail-closed**. Qualquer tentativa de bypassar ou corromper os parâmetros de auditoria do runtime resultará no bloqueio imediato da visualização.

---

## 1. Princípios de Demonstrabilidade (Dummy Renderer Doctrine)

Sob a **Dummy Renderer Doctrine**, a camada visual opera de forma puramente passiva. A interface do usuário é um mero renderizador de dados auditados pelo core de inteligência. A UI é regida pelos seguintes limites rígidos:

* **Fullscreen Mode**: Modo de apresentação sem distrações para conselhos (`BoardPresentationMode`), garantindo isolamento de contexto visual.
* **Read-Only**: Proibição de interações ou inputs que modifiquem as propriedades do cenário ou gerem novos dados em tempo de renderização.
* **Sem Cálculo Local**: Todos os indicadores, scores e métricas provêm do snapshot do runtime. O frontend não executa cálculos nem estimativas locais.
* **Sem Alteração Narrativa**: As sínteses descritivas e conclusões textuais são carregadas imutavelmente a partir do registro do cenário. O frontend não pode reescrever, atenuar ou mascarar conclusões.
* **Sem Ocultação de Violações**: Violações de compliance ativas (`activeViolations`) registradas não podem ser filtradas ou suprimidas. Se existirem, a renderização visual é obrigatória.
* **Sem Reconstrução de Timeline**: O fluxo de eventos causais temporais (`timelineEvents`) é lido diretamente do payload homologado. Não há computação ou agrupamento dinâmico local.
* **Sem Summary fora do Runtime**: A descrição geral do cenário provém exclusivamente do snapshot do runtime e é validada contra o hash de linhagem.

---

## 2. Componentes e Motores Centrais

A Camada de Demonstrabilidade é composta por cinco módulos de runtime e componentes de interface integrados:

### A. `ExecutiveDemoScenarioRegistry`
Repositório central de cenários homologados e imutáveis. Fornece instâncias congeladas (`Object.freeze`) para evitar mutações de propriedades em runtime.
* Arquivo: [ExecutiveDemoScenarioRegistry.ts](file:///Users/marcelosouza/Documents/illumine-strategic-intelligence-advisor/src/core/runtime/executive/demo/ExecutiveDemoScenarioRegistry.ts)

### B. `GuidedBoardJourneyEngine`
Orquestrador de navegação sequencial baseado em causalidade. Bloqueia transições fora da sequência auditada ou que tentem saltar análises essenciais de integridade.
* Regulamento de Transição:
  1. Impedir saltos diretos (ex: navegar de `SUMMARY` para `RECOMMENDATIONS` pulando etapas).
  2. Impedir saltar `ROOT_CAUSE`.
  3. Bloquear visualização de `RECOMMENDATIONS` sem `evidenceChain` ativa.
  4. Bloquear visualização de `TIMELINE` sem memória de runtime.
  5. Bloquear inspeção de `PROPAGATION` sem linhagem validada.
* Arquivo: [GuidedBoardJourneyEngine.ts](file:///Users/marcelosouza/Documents/illumine-strategic-intelligence-advisor/src/core/runtime/executive/demo/GuidedBoardJourneyEngine.ts)

### C. `InstitutionalDemoDatasetGuard`
O gatekeeper absoluto da integridade do cenário. Valida se todas as declarações e propriedades críticas (`lineage`, `confidence`, `evidenceChain`, `runtimeSnapshotReference`, `disclosure rules`, `activeViolations`) estão íntegras e correspondem aos hashes registrados na base.
* Arquivo: [InstitutionalDemoDatasetGuard.ts](file:///Users/marcelosouza/Documents/illumine-strategic-intelligence-advisor/src/core/runtime/executive/demo/InstitutionalDemoDatasetGuard.ts)

### D. `ExecutiveDemoSession`
Gerenciador de estado de sessão do apresentador. Controla a permissão e o consentimento de termos de fiduciary disclosure.
* Arquivo: [ExecutiveDemoSession.ts](file:///Users/marcelosouza/Documents/illumine-strategic-intelligence-advisor/src/core/runtime/executive/demo/ExecutiveDemoSession.ts)

---

## 3. Cenários Homologados no Registro

O `ExecutiveDemoScenarioRegistry` possui quatro cenários de reprodução imutáveis:

1. **`TURNAROUND`** (Strategic Turnaround Plan): Alta confiabilidade de dados (`confidenceState: 'HIGH'`), aviso de alavancagem de curto prazo.
2. **`ACCELERATED_GROWTH`** (Accelerated Growth Simulation): Perfil de expansão corporativa rápida com nível médio de confiança de dados.
3. **`SYSTEMIC_CONTAGION`** (Systemic Stress Contagion): Análise de holding multi-entidades com propagação de estresse de liquidez e violação crítica ativa.
4. **`CASH_COLLAPSE`** (Cash Runway Collapse): Deterioração severa no caixa operacional, acionando aviso de runway crítico (abaixo de 30 dias).

---

## 4. Testes de Vetores de Falha (Fail-Closed Enforcement)

A suite de testes em [executive-demo.test.ts](file:///Users/marcelosouza/Documents/illumine-strategic-intelligence-advisor/tests/executive-demo.test.ts) valida rigidamente 8 vetores de falha, garantindo o bloqueio da renderização (`fail-closed`):

1. **Cenário Fake**: Tentativa de injetar um objeto de cenário customizado ou não cadastrado no catálogo homologado resulta em bloqueio imediato.
2. **Cenário Corrompido**: Cenários sem metadados obrigatórios (ausência de lineage, confidence, evidenceChain, runtimeSnapshotReference, disclosure rules ou activeViolations) são imediatamente abortados pelo guard.
3. **Disclosure Oculto**: Tentativa de navegar no dashboard ou entrar em modo apresentação sem consentimento prévio dos termos de fiduciary disclosure (`disclosureState !== 'ACKNOWLEDGED'`) impede a inicialização.
4. **Tentativa de Free Navigation**: Tentativa de saltar etapas causais diretas ou visualizar recomendações e timelines sem suporte de linhagem ou memória de runtime é interceptada pelo `GuidedBoardJourneyEngine`.
5. **Timeline Reconstruída Localmente**: Cenários onde a propriedade `timelineEvents` esteja ausente ou nula impedem a renderização no componente visual `InstitutionalScenarioTimeline` para evitar reconstruções locais no client-side.
6. **Summary sem Lineage**: Tentativa de renderizar a descrição/sumário narrativa de um cenário cuja referência de linhagem (`lineageIntegrityHash`) esteja vazia ou corrompida dispara o bloqueio imediato.
7. **Tentativa de Ocultar Violações**: Tentativa de suprimir ou editar a lista de `activeViolations` em relação ao registro original do cenário resulta em falha de integridade pelo `InstitutionalDemoDatasetGuard`.
8. **Cenário não Homologado**: Cenários com ID desconhecido ou cujos hashes não batam exatamente com as especificações estáticas do registro oficial são rejeitados de forma permanente.

---

## 5. Auditoria de Governança

Para validar e auditar a conformidade técnica, execute o comando:
```bash
npm run release:check
```
Este comando executa a esteira completa contendo:
* Validação estática de tipagem (`typecheck`)
* Suite de testes unitários e de regressão causais (`test`)
* Auditoria ativa de governança executiva (`governance:audit`)
* Geração do bundle produtivo de distribuição (`build`)
