# Protocolo de Ativação Controlada (Controlled Activation Protocol)

## 1. Escopo e Propósito
Este protocolo define as regras estritas para ativar a Plataforma Illumine em ambiente produtivo utilizando **dados reais**, sem comprometer a arquitetura `Runtime-First` congelada no RC-1.

## 2. Princípios de Ativação
- **RC-1 Imutável:** Nenhuma engine, orquestrador, ou pipeline causal pode ser alterada para acomodar dados específicos do piloto.
- **Isolamento de Erros:** Exceções de parseamento ou lógicas em dados reais devem ser tratados pelo `RuntimeObservabilityLayer` (Confidence Collapse/Degraded Mode) e não via *if/else* na UI.
- **Rollback 1-Click:** Qualquer ingestão de dados que quebre a topologia Master/Tenant deve ser 100% reversível a nível de dataset (exclusão por lineage trace ID).

## 3. Fluxo de Onboarding Seguro
O fluxo de ingestão de dados deve obrigatoriamente seguir as seguintes etapas:
1. **Upload Seguro:** Recebimento via endpoints dedicados (JSON/PDF).
2. **Staging Layer (Quarentena):** Payload fica em memória/tabela temporária.
3. **Validação Estrutural:** O *Schema Validator* verifica o shape esperado (ex: BP, DRE, Mútuos).
4. **Normalização Institucional:** Dados contábeis brutos são normalizados para o modelo Illumine.
5. **Ingestão com Lineage:** Assinatura criptográfica / Hash de origem gerado (`originHash`).
6. **Aprovação Piloto:** Acesso liberado no Tenant Sandbox.

## 4. Ambiente de Piloto (Sandbox Strategy)
- O acesso inicial será restrito a **Tenants Piloto** designados.
- Serão utilizadas **Feature Flags** nativas (Firebase Remote Config ou banco) para exibir os módulos apenas para contas marcadas como *beta-testers*.
- O escopo financeiro importado será limitado para evitar *timeouts* no Consolidated Orchestrator durante as validações inciais de throughput.
