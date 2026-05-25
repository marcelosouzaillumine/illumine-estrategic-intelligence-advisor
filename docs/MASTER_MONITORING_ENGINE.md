# MASTER CONTINUOUS MONITORING ENGINE

Este documento estipula os dogmas arquiteturais e as restrições fiduciárias da Camada de Monitoramento Contínuo (*Continuous Institutional Monitoring & Alerting*).

A premissa central desta camada é a passividade: **O monitoramento escuta, observa e aponta; ele nunca recalcula, muta ou escreve estados financeiros ou cenários.**

## Arquitetura de Schedulers Híbrida (MVP vs Produção)
Por força de Auditoria Ativa (Active Governance):
- O código Client-Side (React/Vite) **está proibido** de invocar rotinas contínuas, sondagens temporizadas (`setInterval`) ou *polling* incontrolado.
- Durante o MVP, os ciclos de monitoramento (`HOURLY`, `DAILY`) são acionados apenas de forma declarativa e explícita pelo administrador (via botão na interface), acionando o método `MonitoringExecutionScheduler.runManualCycle()`.
- Em produção, esse Scheduler será envelopado num processo Node.js / Lambda engatilhado por CRON, preservando a pureza de *budget* do navegador do usuário.

## Células de Monitoramento

A camada de Inteligência do Monitoramento (`MonitoringRuleEngine`) observa outputs passados através de detectores altamente especializados:

1. **`ConfidenceDriftDetector`**: Caça deteriorações contínuas e longitudinais de *Confidence* (Ex: De *HIGH* para *LOW* em poucas execuções).
2. **`SystemicRiskTrendAnalyzer`**: Avalia aceleração de parasitismo ou pressão intra-grupo.
3. **`LiquidityWatchEngine`**: Cruza DRE e Fluxo de Caixa apenas para apontar *runway* e deterioração temporal sem re-executar os cálculos matemáticos complexos.

## Escalada e Políticas (Escalation Governance)

O *Alert Fatigue* (Fadiga de Alertas) é letal para ferramentas executivas institucionais.
- O `GovernanceEscalationEngine` e o `AlertPolicyResolver` previnem que ruídos menores sujem o Dashboard.
- Alertas são inicialmente persistidos como `INFO` ou `WARNING`. Se não resolvidos, ou se a regra ditar urgência extrema (*Liquidity Deterioration*), ele escala para `HIGH` ou `CRITICAL` emitindo obrigatoriamente um log fiduciário inalterável.
- Todo Alerta nasce com uma referência inquebrável (*Lineage Hash* e *Snapshot Hash*) do momento em que o dado foi calculado pelo *Runtime Consolidado*. Alertas sem Lineage são ilegais sob a governança.

## Alert Channels & Cross-Tenant Borders

Canais são *stubs* no MVP, engatilhando apenas alertas de console ou logs visuais na interface.
- `EmailAlertChannel` e `WebhookAlertChannel` retornarão bloqueios (false) intencionais para prevenir *Data Leakage* externo precoce.
- Quando forem oficializados em fases posteriores, herdarão a checagem restrita de `TenantId` no nível do *Payload Dispatcher*.
