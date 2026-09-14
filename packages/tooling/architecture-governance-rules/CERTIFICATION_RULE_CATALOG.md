# Certification Rule Catalog

Este catálogo define as regras explícitas que regem a **Certification Engine**. Diferente do GFC, estas regras operam sobre o contexto de certificação lógica dos módulos, e não sobre ASTs literais de código fonte, assegurando um tribunal arquitetural determinístico.

### AR-CERT-001: Evidence Completeness
Toda certificação formal necessita referenciar quais evidências justificaram sua emissão.
- **Operator**: `>`
- **Input**: `CertificationRequest.evidences.length`
- **Threshold**: `0`

### AR-CERT-002: Baseline Integrity
Toda certificação precisa estar amarrada a um baseline físico, garantindo que o escopo julgado é reproduzível (não transitório).
- **Operator**: `==`
- **Input**: `Baseline.status`
- **Threshold**: `"LOCKED"`

### AR-CERT-003: Policy Traceability
A decisão resultante tem de ser associada estritamente à política (versão de leis) avaliada. Uma certificação sem PolicyVersion não tem valor legal.
- **Operator**: `!=`
- **Input**: `CertificationAttempt.policyVersion`
- **Threshold**: `""`

### AR-CERT-004: Certification Reproducibility
As funções de avaliação e emissão de certificados não podem possuir random seeds, chamadas de rede dinâmicas ou variáveis de estado globais que fujam aos parâmetros passados. (Isso é garantido através do GFC-CERT-007).
