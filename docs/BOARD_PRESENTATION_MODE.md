# Modo de Apresentação de Conselho (Board Presentation Mode)

Este documento especifica o funcionamento técnico e fiduciário do modo de apresentação em tela cheia (fullscreen) guiado para reuniões de conselho e comitês executivos.

## 1. Jornada Guiada do Conselho (Guided Board Journey)
O modo de apresentação opera como um visualizador sequencial rígido da jornada de inteligência executiva. O fluxo segue uma sequência de fases bem definida:

```
SUMMARY ➔ CONTEXT ➔ FINANCIAL_HEALTH ➔ CAUSALITY ➔ PROPAGATION ➔ MITIGATION_PLAN
```

### Regras de Transição Fiduciária
- **Sem Saltos Diretos**: O conselho não pode pular do resumo inicial (`SUMMARY`) diretamente para as recomendações finais (`MITIGATION_PLAN`) sem passar pela verificação do contexto e das causas.
- **Enforcement de Estado**: A navegação retrocede de forma livre, mas o avanço exige a conclusão e a validação visual do passo anterior.

## 2. Modo de Evidência Contábil (BOARD_EVIDENCE_MODE)
O `BOARD_EVIDENCE_MODE` é uma funcionalidade fiduciária de transparência total em tempo de apresentação. Quando ativado pelo conselheiro ou apresentador, ele expande um painel de auditoria que exibe as seguintes evidências e proveniências técnicas diretas do Runtime:

- **Lineage (Linhagem)**: Rastreabilidade do arquivo importado, Connector ID de origem e hashes de segurança.
- **Causal Chains (Cadeias Causais)**: O fluxo de propagação causal mapeado de forma lógica (ex: OPEX alto gerando drenagem de caixa).
- **Confidence (Confiança)**: O nível de confiança projetado (`HIGH_CONFIDENCE`, `MEDIUM_CONFIDENCE`, `LOW_CONFIDENCE`) com as penalidades detalhadas.
- **Warnings (Alertas)**: A lista de alertas de staging ativos que não foram suprimidos.
- **Runtime Metadata (Metadados do Runtime)**: Latência de processamento, profundidade de recursão e tracing operacional.
- **Source Provenance (Proveniência)**: Quem enviou os dados, quando e por qual canal (ex: upload de arquivo manual por CPF/e-mail).
- **Calibration Profile (Perfil de Calibração)**: O perfil de calibração ativo (`balanced`, `conservative`, etc.) e a versão do motor que gerou o relatório.
- **Export Snapshot Reference (Snapshot de Exportação)**: ID do snapshot permanente gerado para assegurar reprodutibilidade total histórica da ata do conselho.
