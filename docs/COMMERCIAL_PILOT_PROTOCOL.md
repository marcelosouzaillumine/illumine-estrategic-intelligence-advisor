# Protocolo do Piloto Comercial — Illumine Platform

Este protocolo define os limites operacionais, participantes cadastrados, regras de governança e procedimentos de validação comercial controlada para a ativação do Piloto Comercial.

---

## 1. Participantes do Piloto

### 1.1. Advisors Autorizados
- **ADVISOR-01**: Operador principal do ecossistema piloto (Auditor Líder).
- **ADVISOR-ALPHA**: Consultoria estratégica regional de teste.
- **ADVISOR-GAMMA**: Advisor institucional independente.

### 1.2. Tenants Piloto
- **TENANT-1**: Sandbox geral de onboarding.
- **TENANT-ALPHA**: Tenant principal de testes multi-empresa.
- **TENANT-BETA**: Tenant exclusivo de teste do comitê de governança.

### 1.3. Clientes Piloto
- **CLIENT-BETA**: Operação de varejo de teste.
- **CLIENT-GAMMA**: Empresa prestadora de serviços (Asset Light).
- **CLIENT-DELTA**: Unidade de indústria piloto.

---

## 2. Datasets Autorizados

O comitê fiduciário autoriza a ingestão exclusiva dos seguintes formatos e esquemas de dados em staging:
- **Demonstrativos Contábeis (Balanço e DRE)** nos formatos estruturados `.xlsx` e `.csv` contendo códigos de conta hierárquicos válidos (e.g. `1`, `1.1`, `2`, `2.1.1`, `3`).
- **Planilhas de Metadados de Orçamento e Quotas**: Sem permissão de alteração do motor central de inteligência.

---

## 3. Limites Operacionais & Quotas do Piloto

Para proteger os recursos computacionais do runtime e assegurar o isolamento do tenant:
- **Cota Máxima de Ingestão**: 10 datasets por tenant por ciclo de 24 horas.
- **Limite de Sessões Simultâneas**: Máximo de 3 sessões de apresentação do conselho ativas por tenant.
- **Auditoria Obrigatória**: Toda calibração de threshold por advisor exige justificativa contendo no mínimo 10 caracteres (`customRationale`).
