# Matriz de Permissões RBAC (Role-Based Access Control)

Para assegurar a soberania do dado e a validade constitucional do sistema, as funções no Governance/EFOS são estritamente compartimentadas. Esta matriz rege o ambiente Piloto.

## Perfis e Escopos

### 1. `MASTER_SUPERVISOR` (Suporte N3 / Curador do Algoritmo)
*Perfil restrito à engenharia fiduciária da Illumine.*
- **Onboarding e Tenant**: Permissão para criar e configurar o ambiente do cliente (Tenant).
- **Sobrescrita Constitucional**: Pode revogar ou alterar flags globais (`EFOS_ENV`), sob intensa trilha de auditoria (Lineage Hash).
- **Deployment**: Autoriza transições de ambiente (LOCAL -> PILOT -> PRODUCTION).
- **Acesso ao Dado do Cliente**: Restrito aos metadados (Hashes, Erros). A leitura do balanço puro só é permitida em caso de suporte autorizado pelo cliente.

### 2. `FIDUCIARY_AUDITOR` (Compliance Interno / Auditor)
*Auditoria e suporte, sem poder de sobrescrita.*
- **Readiness e Saúde**: Consegue monitorar o status do ambiente e anomalias sistêmicas.
- **Incidentes**: Recebe alertas de violação `FAIL_CLOSED` e `CONSTITUTIONAL_QUARANTINE`.
- **Relatórios**: Pode ler versões arquivadas do Board Pack gerado pelo C-Level para análise de trilha.

### 3. `TENANT_ADMIN` (Administrador do Cliente Piloto)
*O elo de confiança entre o cliente e a Illumine (ex: CFO, Controller).*
- **Upload de Evidência**: Único perfil autorizado a engatilhar a `Evidence Ingestion Layer` realizando o upload de BPs e DREs reais.
- **Autorização de Usuários**: Convida operadores e conselheiros de seu Tenant.
- **Resolução de Bloqueios**: Único perfil capaz de retificar balanços corrompidos apontados pela plataforma.

### 4. `PILOT_OPERATOR` / `C_LEVEL_EXECUTIVE`
*Os decisores operacionais.*
- **Navegação**: Acessam dashboards analíticos (Cockpit, Treasury, Resilience).
- **Board Pack**: Geram e interagem com Executive Board Packs.
- **Isolamento**: Só enxergam dados rigorosamente do seu Tenant. Operações destrutivas não permitidas.
- **Simulação Estratégica**: Podem executar cenários e estresses matemáticos (sandbox) sem alterar as evidências oficiais fiduciárias.

### 5. `UNAUTHORIZED`
*Estado padrão antes do login ou de permissão validada.*
- Não tem acesso à inteligência e nem aos dados. Painéis travados via `InstitutionalBlockingDialog`.
