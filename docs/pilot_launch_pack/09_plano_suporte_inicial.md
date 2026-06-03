# Plano de Suporte Inicial B2B (Fase Piloto)

Para assegurar uma transição suave e fiduciariamente segura, o ambiente piloto opera com protocolos de SLA agressivos e matriz de escalonamento rigorosa.

## Níveis de Atendimento (SLA)

### Nível 1: Dúvidas Operacionais (Tenant Admin / Sponsor)
- **Escopo**: Navegação, dificuldade na geração do Board Pack, dúvidas sobre o painel.
- **SLA de Resposta**: 4 horas úteis.
- **Atores**: Equipe de Customer Success ou Fiduciary Auditor de nível primário.

### Nível 2: Dúvidas de Fricção Fiduciária (C-Level)
- **Escopo**: Questionamento ativo sobre o motivo pelo qual a Engine diagnosticou a empresa com Risco de Liquidez ou por que o FCO não bate com a percepção do board.
- **SLA de Resposta**: 8 horas úteis (Exige análise de Lineage Hash).
- **Atores**: Fiduciary Auditor Sênior. Será necessário decifrar o apêndice de explicabilidade (`explainabilityAppendix`).

### Nível 3: Incidentes CRITICAL e Fail-Closed Sistêmico
- **Escopo**: O ambiente trava por quebra estrutural contábil, inconsistência de Tenant ou `CONSTITUTIONAL_QUARANTINE`. Board Pack incapaz de ser gerado, travando reuniões de conselho iminentes.
- **SLA de Resposta**: 1 hora útil. Resolução em até 12h.
- **Atores**: `MASTER_SUPERVISOR` e Engenharia Central EFOS.

## Escalation Matrix

1. **Cliente / Sponsor** reporta anomalia que impede a tomada de decisão.
2. **Fiduciary Auditor** investiga evidências sem intervir nos dados do cliente. Valida se a culpa é de erro primário contábil da organização (ex: enviaram um DFC inválido) ou do motor matemático (falso positivo).
3. **Master Supervisor** intervém apenas se for necessária retificação na doutrina base da plataforma (patching), ou desbloqueio de tenant via override devidamente hash-auditado.
