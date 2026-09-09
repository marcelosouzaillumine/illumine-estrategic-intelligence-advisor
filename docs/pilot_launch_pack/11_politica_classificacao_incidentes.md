# Política de Classificação de Incidentes Fiduciários

Esta política estabelece os graus de severidade de anomalias detectadas no ambiente Piloto, bem como o fluxo de resposta adequado. Em um sistema com rigor constitucional determinístico, o silêncio diante de um risco nunca é aceitável.

## Matriz de Severidade

### 1. `LOW` (Aviso / Degradação Leve)
- **Definição**: Anomalias semânticas ou limitações que não comprometem os cálculos matemáticos fundamentais nem a sobrevivência da empresa.
- **Exemplos**: Pequena oscilação temporal em rubricas não críticas; geração de narrativa levemente redundante.
- **Ação**: O sistema emite alerta, mas a geração de board packs e o painel continuam liberados com um *audit flag*.

### 2. `MODERATE` (Alerta Operacional)
- **Definição**: Disparidade contábil parcial em áreas não estruturais ou falta de histórico suficiente (ex: apenas 2 anos de DFC em vez de 3).
- **Exemplos**: Score Longitudinal rebaixado a "NOT_AVAILABLE" por `LongitudinalGovernanceGuard`.
- **Ação**: A Engine alerta a falta de profundidade de dados; certas simulações podem ser desativadas. O *Board Pack* conterá uma advertência clara sobre previsibilidade.

### 3. `HIGH` (Risco Fiduciário Relevante)
- **Definição**: Dados de entrada apresentam lacunas contábeis (ex: balanço não-balanceado) que requerem re-ingestão de evidências ou pressão excessiva de tesouraria foi apontada, ativando diretrizes de proteção de capital.
- **Exemplos**: *Survival Constraint Propagation* ativado, reportando sobrevivência institucional ameaçada.
- **Ação**: A narrativa estratégica se reescreve automaticamente para tom de contingência (quarentena de otimismo). O Tenant Admin é notificado e certas abas do painel ganham status vermelho/restrito.

### 4. `CRITICAL` (Falha Crítica / Risco Sistêmico do Cliente)
- **Definição**: Um problema severo de reconciliação ou uma estrutura de capital matematicamente implodida.
- **Exemplos**: Evidence Ingestion bloqueado por fraude potencial, corrupção profunda de dados contábeis, ou vazamento/cruzamento de metadados entre tenants.
- **Ação**: Ativação sumária de *Fail-Closed*. Geração de Board Packs bloqueada e Cockpit substituto ativado (`InstitutionalUnavailableState` ou `InstitutionalBlockingDialog`).

### 5. `CONSTITUTIONAL_FAIL_CLOSED` (Ruptura de Doutrina Mestra)
- **Definição**: Erro crítico na própria infraestrutura EFOS ou tentativa ilícita de contornar regras fiduciárias globais (ex: overrides na Readiness Layer, modificações de código runtime em produção).
- **Exemplos**: Assinatura do `ConstitutionalEnforcementGate` falha ou o `RuntimeIntegrityStatus` torna-se `COMPROMISED`.
- **Ação**: Todo o ambiente é suspenso iminentemente. Nem mesmo o Sponsor consegue operar. Trilha de auditoria criptografada (Lineage) é selada. Somente o `MASTER_SUPERVISOR` pode restabelecer a infraestrutura após purgar a corrupção.
