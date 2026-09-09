# Checklist de Implantação do Piloto Institucional B2B

Este checklist governa a ativação controlada do ambiente piloto para o primeiro cliente corporativo. Nenhuma etapa deve ser ignorada, sob pena de bloqueio institucional (Fail-Closed).

## Fase 1: Qualificação e Acordo Institucional
- [ ] Apresentação do `00_manifesto_fiduciario_governance.md` para o Board/C-Level.
- [ ] Assinatura do termo de adesão ao Piloto (incluindo escopo LGPD - `08_governanca_dados_lgpd.md`).
- [ ] Definição formal dos critérios de aceite (ver `06_criterios_aceite_piloto.md`).
- [ ] Identificação dos Sponsors Executivos (Mínimo 1 C-Level ou Conselheiro).

## Fase 2: Readiness do Ambiente e Segurança
- [ ] Criação do Tenant Isolado (`tenantId` exclusivo gerado criptograficamente).
- [ ] Configuração do Ambiente na Readiness Engine (Deployment Environment = `PILOT`).
- [ ] Desativação compulsória de `mockFactoriesEnabled` e `debugModeEnabled` para o tenant piloto.
- [ ] Validação do Readiness: o sistema deve retornar `FULL_PRODUCTION_READY`.
- [ ] Atribuição de roles (Matriz de Permissões RBAC - `03_matriz_permissoes_rbac.md`). Criação do `MASTER_SUPERVISOR` primário.

## Fase 3: Ingestão de Evidências Fiduciárias
- [ ] Coleta dos Balanços Patrimoniais (BP) dos últimos 3 a 5 anos/ciclos.
- [ ] Coleta das Demonstrações de Resultado do Exercício (DRE) alinhadas aos BPs.
- [ ] Coleta do Fluxo de Caixa (DFC) e Mutação do Patrimônio (DLPA/DMPL) correspondentes.
- [ ] Processamento via **Institutional Evidence Ingestion Layer**.
- [ ] Auditoria fiduciária inicial confirmada (`evidenceStatus === 'VALIDATED'`).

## Fase 4: Geração de Inteligência Base
- [ ] Execução da avaliação longitudinal (`LongitudinalCashGovernanceEngine` e associados).
- [ ] Geração do primeiro **Executive Board Pack**.
- [ ] Verificação da ausência de restrições de bloqueio constitucional (`constitutionalConfidence !== 'BLOCKED'`).
- [ ] Homologação interna do Master Supervisor validando se a narrativa estratégica condiz com a realidade documentada.

## Fase 5: Entrega Executiva (Walkthrough)
- [ ] Execução do `04_pacote_demonstracao_executiva.md` junto ao Sponsor.
- [ ] Coleta das primeiras reações usando o plano de feedback (`07_plano_coleta_feedback.md`).
- [ ] Oficialização do Relatório Final de Readiness para continuidade (`10_relatorio_final_readiness.md`).
