# Single Cognitive Contract Standard (v1.0)

**Status:** Draft / Active
**Date:** 2026-07-31
**Phase:** 2

Este documento estabelece o **Single Cognitive Contract Layer™**, o registro canônico de contratos cognitivos para a Illumine OS. A partir desta versão, nenhuma operação cognitiva pode ser instanciada, processada ou retornada sem respeitar o envelope deste contrato unificado.

## O Envelope Canônico (Cognitive Operation Payload)

Toda e qualquer operação cognitiva (seja um request para o LLM, uma análise de dados, ou uma inferência de cenário) obrigatoriamente deve herdar e implementar o seguinte contrato padronizado:

```typescript
interface CanonicalCognitiveContract<TPayload, TResult> {
  // 1. Isolamento & Identidade
  tenantBinding: TenantIsolationContext;
  
  // 2. Rastreabilidade Executiva
  traceability: ExecutiveCognitiveTrace;
  
  // 3. Cadeia de Evidências (Auditabilidade)
  evidenceChain: EvidenceChain;
  
  // 4. Linhagem de Decisão (Como chegou a esta conclusão)
  decisionLineage: DecisionLineage;
  
  // 5. Metadados de Confiança e Acurácia
  confidence: ConfidenceMetadata;
  
  // 6. Aprovação do Trust Gate
  governanceStatus: GovernanceStatus;
  
  // 7. Versionamento do Motor/Prompt
  versionIdentity: VersionIdentity;

  // Payload específico da operação
  input: TPayload;
  output?: TResult;
}
```

## Diretrizes de Aplicação

1. **Camada de Isolamento Primária (TenantIsolationContext):**
   Nenhum dado é lido da memória ou do banco de dados sem que o `tenantBinding` seja validado no início do runtime.

2. **Cadeia de Evidências (EvidenceChain):**
   Todos os artefatos, RAG chunks ou dados de mercado utilizados pela inteligência devem ser serializados neste objeto. Se o Copilot apresentar um dado, sua origem DEVE estar mapeada aqui.

3. **Validação Final (GovernanceStatus):**
   A propriedade `governanceStatus` só pode ser modificada por serviços do pacote `cognitive-trust-gate` ou `executive-decision-forensics`. A UI deve, por padrão, rejeitar renderizar `CognitiveServiceResult` cujo status de governança não seja explicitly `APPROVED` ou `SAFE`.

## Governança

Nenhuma inteligência pode existir fora dessa fronteira de contrato. Qualquer serviço (antigo ou novo) que não consiga preencher esse envelope será considerado *Legacy* e agendado para depreciação antes da Wave 16.
