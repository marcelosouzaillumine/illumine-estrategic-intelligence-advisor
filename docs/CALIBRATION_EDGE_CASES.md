# Diário de Calibração: Casos Extremos & Alinhamento

Este diário cataloga casos extremos encontrados durante a simulação e homologação de calibrações no Runtime, auxiliando operadores na escolha de perfis e na blindagem fiduciária do sistema.

## 1. Excesso de Alertas Contábeis (Warning Saturation)
- **Cenário**: O dataset contábil do cliente possui pequenas diferenças de centavos devido a arredondamentos de sistemas ERP legados.
- **Sintoma**: Sob o perfil `conservative`, a tela exibe múltiplos avisos de `MATERIALITY_THRESHOLD_EXCEEDED` e `CASHFLOW_MISMATCH`, poluindo o dashboard e reduzindo artificialmente a confiança para `LOW_CONFIDENCE`.
- **Calibração**: Transicionar para o perfil `board_mode` ou `balanced`, ou aumentar pontualmente a `warningMaterialityThreshold` para `0.05` para acomodar os ruídos insignificantes do ERP.
- **Regra Fiduciária**: Nunca aumentar a tolerância além de `0.10` para evitar mascarar fraudes ou desbalanceamentos estruturais graves.

## 2. Falsos Positivos de Insolvência
- **Cenário**: Uma subsidiária do grupo opera temporariamente com saldo de caixa abaixo de 5% de sua dívida circulante de curto prazo devido a adiantamentos intragrupo.
- **Sintoma**: A sensibilidade de estresse (`stressPropagationSensitivity = 1.5`) força o colapso preditivo da holding durante as simulações do cenário.
- **Calibração**: Utilizar o perfil `balanced` ou diminuir a sensibilidade no console. O motor de eliminação intragrupo deve remover as receitas e mútuos elimináveis antes do cálculo de estresse preditivo.
- **Mitigação**: O `PredictiveStressEngine` deve avaliar a solvência líquida do grupo antes de emitir a condenação final de solvência.

## 3. Baixa Sensibilidade (Under-sensitivity)
- **Cenário**: O grupo apresenta deterioração consecutiva das margens e redução progressiva do fluxo operacional, mas o sistema continua emitindo classificação de severidade `SAUDÁVEL`.
- **Sintoma**: A sensibilidade temporal (`temporalCausalitySensitivity = 0.5`) impede a detecção longitudinal do padrão destrutivo.
- **Calibração**: Ativar o perfil `advisor_mode` ou ajustar a sensibilidade para `1.3`, ativando alertas antecipados baseados em séries históricas.

## 4. Colapso de Confiança Artificial
- **Cenário**: A ausência de um fluxo de caixa (DFC) em uma importação parcial derruba a confiança imediatamente para `LOW_CONFIDENCE`.
- **Sintoma**: A UI bloqueia de forma agressiva a renderização de relatórios do conselho.
- **Calibração**: Utilizar o perfil `board_mode` que tolera visões parciais sem punição extrema, mantendo a confiança em `MEDIUM_CONFIDENCE` para a tomada de decisão focada.
