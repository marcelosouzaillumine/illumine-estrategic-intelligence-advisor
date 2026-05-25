# Staging Validation Protocol

## 1. Princípio de Isolamento
Nenhum dado real entra no Runtime oficial sem passar pela camada *Staging* validada.
O *Staging Dataset* existe puramente como um container isolado em estado de quarentena. Enquanto `promotedToRuntime = false`, esse dado não alimenta:
- Runtime Oficial
- UI Produtiva
- Pareceres Executivos (Advisory)
- Simulações de Cenário
- Consolidação Multi-Entidade
- Stress Propagation Layer

## 2. Pipeline de Onboarding
O ciclo de vida obrigatório de um dataset é:
1. **Upload**: Recepção do artefato via Integração/Web.
2. **Parsing**: Extração dos dados do PDF/XLSX.
3. **Normalização**: Estruturação dos dados num formato agnóstico.
4. **Hierarquização**: Construção de árvores de contas (Sintéticas/Analíticas).
5. **Mapping**: Associação das contas importadas à DRE/BP/DFC padrão (Chart of Accounts).
6. **Validation (StagingValidationEngine)**: Verificação financeira/contábil baseada na *StagingValidationPolicy*.
7. **Confidence**: Atribuição do score de telemetria de confiança.
8. **Lineage**: Carimbo da proveniência.
9. **Approval Gate**: Promoção manual/automatizada para `promotedToRuntime = true`.
10. **RuntimeInput**: Consolidação no Runtime Oficial para Advisory.

## 3. Approval Gate
Somente datasets que possuírem `stagingValidationPassed === true` e zero *blocking warnings* são elegíveis à promoção. A publicação no ecossistema (`ImportPublicationEngine.publish()`) barrará terminantemente datasets reprovados.
