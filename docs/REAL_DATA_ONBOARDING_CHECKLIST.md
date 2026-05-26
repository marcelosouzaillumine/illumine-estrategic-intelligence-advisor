# REAL_DATA_ONBOARDING_CHECKLIST

## Pré-requisitos de Staging
- [ ] O banco de staging está completamente isolado do banco/tabelas de runtime?
- [ ] O `ValidationPolicy` padrão está ativo para lidar com dados legados e transacionais?
- [ ] O LineageTracker está capturando o metadado (IP, User ID, Timestamp, FileHash)?

## Validação de Ingestão Contábil
- [ ] Balanço Patrimonial real mapeado (Ativo = Passivo + PL). Tolerância configurada e bloqueios ativados para desbalanceamentos materiais.
- [ ] Demonstração de Resultados (DRE) hierárquica importada, validando agrupamentos sintéticos sem soma dupla.
- [ ] Demonstração de Fluxo de Caixa (DFC) processada, preservando regime de caixa.
- [ ] A consolidação multi-entidade funciona corretamente com dados reais das entidades envolvidas?
- [ ] As eliminações intercompany foram processadas sem gerar falso faturamento ou dupla contagem de dívida?

## Tolerância e Qualidade (Confidence)
- [ ] Datasets corrompidos (missing columns, unmapped strings) foram bloqueados no portal da alfândega?
- [ ] O `ValidationStatus` exibido na UI para o auditor reflete os warnings e erros críticos corretamente?
- [ ] O sistema não gerou Advisory ou Executive Reports para datasets ainda não promovidos?

## Promoção e Rollback
- [ ] `ImportPublicationEngine` foi testado e comutou com sucesso os dados de Staging para o Runtime?
- [ ] Os orchestrators recarregaram os cenários e dashboards de forma reativa após a promoção dos dados reais?
- [ ] Foi possível executar um *Rollback Lógico* para inativar um dataset real importado equivocadamente?

---
**Status**: PENDENTE (Aguarda injeção dos primeiros datasets piloto).
