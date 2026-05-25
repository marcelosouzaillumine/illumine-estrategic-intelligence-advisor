# MASTER EARLY WARNING ENGINE

Este documento estipula a arquitetura da camada de **Predictive Governance & Early Warning System**, responsável por transformar a Illumine em uma **Predictive Governance & Early Warning Infrastructure**. O sistema atua como o "radar institucional" da plataforma, identificando tendências de deterioração *antes* que se convertam em falência financeira irrecuperável.

## Princípios Fiduciários Preditivos

1. **Evidência Obrigatória (`WarningEvidenceBinder`)**: Nenhuma previsão (forecast) pode ser criada "no vazio". Todo sinal gerado pelo Early Warning deve vir embasado por instâncias reais preexistentes, como falhas em Workflows, alertas do Knowledge Graph ou desvios de Benchmarking.
2. **Read-Only Financeiro Absoluto**: O Early Warning não acessa raw data de BP ou DRE nem reescreve o `Advisory` matemático original. Ele processa metadados secundários (*meta-analysis*), como frequência de aprovações e anomalias de grafo.
3. **Escopo Preditivo Restrito**: Para evitar a Síndrome de Previsões Caóticas (IA Alucinatória), o sistema atrela a geração de avisos unicamente a categorias cadastradas na ontologia institucional (ex: *Liquidity Suffocation*, *Governance Collapse*).
4. **Isolamento de UI**: O Front-End (React) está proibido de calcular previsões locais. É uma infraestrutura cega que apenas plota o que a *Truth Layer* atestar. Nenhuma anomalia é desenhada via algoritmos rodando em navegador.

## Engines e Agregadores
- **`PredictiveGovernanceDetector`**: Observa anomalias em Workflows. (ex: "As escaladas em liberações de capital aumentaram 400% no mês").
- **`GraphPatternWarningEngine`**: Identifica estrangulamentos ou ciclos tóxicos na rede semântica (Knowledge Graph).
- **`BenchmarkDeviationDetector`**: Monitora o afastamento perigoso contra a mediana do setor de forma anonimizada (*K-Anonymity*).
- **`ScenarioDeteriorationWatcher`**: Analisa se a capacidade de sobrevivência em stress-tests está caindo continuamente.
- **`RiskSignalAggregator`**: Centraliza os inputs, computa pesos passivos e gera o score consolidado de deterioração sem alterar origens.

## Auditoria Ativa (`runEarlyWarningGovernanceAudit.ts`)
Para garantir o rigor preditivo, o sistema rejeita código em `npm run governance:audit` caso a UI:
- Chame bibliotecas randômicas para forjar alertas (`Math.random`).
- Recalcule Confidence nativamente no React (`ConfidenceTimelineEngine.override`).
- Esconda sinais em `localStorage` impedindo o *Garbage Collection* no reset do Workspace.
- Ou se a Engine for identificada criando sinais sem usar o `WarningEvidenceBinder`.
