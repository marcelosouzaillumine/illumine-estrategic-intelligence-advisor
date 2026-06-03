# Critérios de Aceite do Piloto Institucional

Para que a transição de **PILOTO** para **OPERAÇÃO ENTERPRISE (GO-LIVE)** seja homologada, os seguintes critérios fiduciários e operacionais devem ser comprovadamente atingidos durante o ciclo do Piloto (normalmente de 3 a 6 semanas).

## 1. Critérios de Acurácia e Lineage Contábil
- [ ] A *Evidence Ingestion Layer* deve ser capaz de ingerir a base do cliente e atingir status `VALIDATED` para pelo menos 1 ciclo histórico sem apontar corrupção que exija intervenção humana externa imprevista.
- [ ] Hashes de Lineage (ex: `BoardPackLineageHash`) devem persistir sem violações em todas as simulações e painéis renderizados ao cliente.
- [ ] A Inteligência Patrimonial (Ativo == Passivo + PL) deve se manter estável; eventuais faltas no DRE devem ser identificadas e tratadas via "Fail-Closed" ou rebaixamento para "MODERATE CONFIDENCE" sem colapsar a aplicação.

## 2. Critérios Executivos (User Success)
- [ ] O usuário (Board/Sponsor) deve ser capaz de gerar e entender um *Executive Board Pack* completo em menos de 5 minutos, comparado ao ciclo manual tradicional de dias.
- [ ] A Quarentena Narrativa deve operar corretamente, limitando as recomendações a pautas conservadoras em cenários em que os indicadores do cliente acionam `SURVIVAL_MODE`.

## 3. Critérios de Estabilidade (Runtime Integrity)
- [ ] Zero incidentes de quebra de isolamento multi-tenant (dados vazados).
- [ ] O `ConstitutionalEnforcementGate` não deve ser acionado para travar o ambiente inteiro, provando estabilidade no mapeamento arquitetural.
- [ ] Em caso de estresse forçado no "Scenario Sandbox" (redução agressiva de receita/caixa), as diretrizes de tesouraria devem refletir o corte correto (ex: suspensão de M&A, capex).

## 4. Critérios Administrativos
- [ ] 100% da matriz RBAC operacional. O C-Level não pode ter permissões de superadmin, o superadmin não pode ter permissões de auditoria.
- [ ] Termo de sigilo finalizado, dados consumíveis higienizados, prontidão para expansão de licenças (Rollout).
