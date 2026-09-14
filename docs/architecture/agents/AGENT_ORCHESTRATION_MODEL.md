# AGENT_ORCHESTRATION_MODEL.md — Modelo de Orquestração Hierárquica e Fronteiras de Responsabilidade

> **Documento Normativo de Orquestração da Rede Cognitiva (Wave 15A)**  
> *Princípio: O especialista analisa, o decisor sintetiza e o orquestrador coordena*

---

## 1. Arquitetura da Rede Cognitiva de Agentes Executivos

```
                 Enterprise Governance Orchestrator (@illumine/executive-orchestrator)
                                           |
        -----------------------------------------------------------------------
        |                                                                     |
Executive Decision Agent                                            Executive Advisory Board
        |                                                                     |
 -------------------------------------------------------------------------------------------------------
 |           |            |           |         |           |           |          |           |
CFO      Controller   Governance   Strategy Operations   People       Risk    Commercial  Customer   Innovation
Agent      Agent        Agent       Agent     Agent      Agent       Agent      Agent       Agent      Agent
```

---

## 2. Separação Estrita de Responsabilidades (Boundary Matrix)

1. **Especialistas de Domínio (Dominion Agents)**:
   - *CFO, Controller, Governance, Strategy, Operations, People, Risk, Commercial, Customer, Innovation Agents*.
   - **Função**: Analisam dados do seu domínio específico, identificam sinais de negócio, geram inferências contextuais e emitem pareceres individuais de `ExecutiveOpinion`.
   - **Restrição**: Não tomam decisões finais fora do seu escopo e não invocam diretamente outros agentes (Invariante 11).

2. **Decisor Sintetizador (`Executive Decision Agent`)**:
   - **Função**: Agrega pareceres dos agentes especialistas, pondera os prós e contras, calcula a matriz de pesos (`WeightMatrix`) e projeta a recomendação final de `BoardResolution`.

3. **Coordenador da Rede (`Enterprise Orchestrator`)**:
   - **Função**: Aplica a política `CapabilitySelectionPolicy` para convocar os agentes relevantes para a pauta, verifica divergências com `ConflictResolver` e garante o fluxo neutro de coordenação (*Coordinator, Not Controller*).
