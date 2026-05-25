# Pilot Operation Guidelines

Diretrizes executivas para operar a plataforma Illumine durante a fase de Piloto.

## 1. Acordo Operacional
O piloto não é um ambiente de desenvolvimento. O *Master Orchestrator* é operado em modo passivo. Erros não derrubam a plataforma, mas diminuem o **Confidence Score**.

## 2. Monitoramento Contínuo (Alertas Vermelhos)
A equipe de engenharia/operações deve monitorar os seguintes eventos institucionais nas trilhas de auditoria:
1. **Falhas de Importação:** (Unparseable PDF, JSON corrompido, Out-of-bounds metrics).
2. **Inconsistência Contábil:** BP não bate (Ativo != Passivo), gerando flag automática.
3. **Lineage Quebrado:** Perda de rastreabilidade entre a entidade-mãe e suas filiais consolidadas.
4. **Confidence Collapse:** Score de confiança caindo abaixo de 0.45 em dados de produção (disparador automático de degradação).
5. **Degraded Runtime Modes:** O sistema forçando o modo *Pass-Through* porque o ExecutionDepth ultrapassou os limites do Institutional Enforcer.

## 3. Postura diante de Falhas (No-Bypass Rule)
- Sob nenhuma circunstância a UI deve ser alterada (ex: `if (value === null) return 0`) para consertar má qualidade do dado real.
- O dado ruim entra, o Runtime o classifica como *Low Confidence* ou *Failed*, o Advisory Engine reflete a falta de dados, e a UI exibe o estado "Dados Insuficientes" de forma fiduciária.
