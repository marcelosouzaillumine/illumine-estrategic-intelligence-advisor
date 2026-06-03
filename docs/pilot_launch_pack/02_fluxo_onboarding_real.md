# Fluxo Operacional de Onboarding Real (Piloto B2B)

Este documento detalha as etapas procedimentais e de sistema para o upload da base contábil da instituição cliente e a iniciação do tenant no ambiente Piloto.

## 1. Recepção Criptográfica e Quarentena
Toda massa de dados recebida do cliente (BP, DRE, DFC, DLPA/DMPL) deve ser inicialmente tratada em estado `UNVALIDATED`. Nenhuma inferência fiduciária ou projeção estratégica será executada antes que o isolamento do tenant esteja certificado e a massa de dados passe pela integridade contábil.

## 2. Processo de Ingestão e Classificação Documental (Evidence Ingestion)
- **Ingresso**: Os dados estruturados (`rawData`) são importados via `InstitutionalEvidenceOrchestrator`.
- **Classification Engine**: O sistema categoriza as rubricas, detectando órfãos e desvios de padronização corporativa (Compliance com normas contábeis básicas).
- **Validation Engine**: Checagem algorítmica rigorosa (ex: `Ativo === Passivo + PL`). Diferenças acima da tolerância paramétrica travam o fluxo.
- **Reconciliation Engine**: Cruza saldos do DRE com BP e BP com DFC (ex: Variação de Caixa no DFC vs Caixa Final no BP).
- **Lineage Audit Engine**: Emite Hashes inalteráveis documentando a versão exata da evidência que originará a inteligência, vinculando o upload à identidade do usuário responsável (Tenant Admin/Fiduciary Auditor).

## 3. Resolução Fiduciária de Conflitos
Em caso de quebra de validação (ex: Caixa não bate), a Engine aborta e adota **Fail-Closed**. O onboarding entra em suspensão.
O `MASTER_SUPERVISOR` ou o `TENANT_ADMIN` precisa:
1. Requisitar revisão contábil ao cliente (análise externa).
2. Fazer um novo upload da base retificada.
*Nenhuma substituição sintética de dados (mock)* é permitida neste estágio em ambiente produtivo/piloto.

## 4. Liberação do Dashboard Executivo
Uma vez que `evidenceStatus === 'VALIDATED'`, a plataforma desbloqueia:
- O painel de Resiliência (Cash/Treasury).
- A geração sob demanda de Executive Board Packs.
- Os mapas direcionais e matriz de pressões operacionais.

Nesse ponto, o Onboarding está concluído tecnicamente e o "Cockpit" da empresa passa a operar ativamente no EFOS.
