# EXPERIENCE_CERTIFICATION_FRAMEWORK.md — Framework de Certificação de Experiências (AGC v1.0)

> **Manual e Protocolo de Certificação Automática de Experiências (Level A — Canonical)**  
> *Horizonte Temporal de Estabilidade: 10+ Anos (2026 – 2036+)*  
> *Documentos Complementares: [`docs/CANONICAL_EXPERIENCE_REGISTRY.md`](file:///Users/marcelosouza/Documents/illumine-strategic-intelligence-advisor/docs/CANONICAL_EXPERIENCE_REGISTRY.md) | [`docs/EXPERIENCE_REGISTRY.md`](file:///Users/marcelosouza/Documents/illumine-strategic-intelligence-advisor/docs/EXPERIENCE_REGISTRY.md)*  
> *Status: Homologado & Congelado*

---

## 1. Visão Geral

O **Experience Certification Framework** estabelece o protocolo formal e automatizável de validação de superfícies no Illumine OS™.

Toda nova superfície, página ou módulo desenvolvido DEVE declarar explicitamente seus metadados de *Experience* no seu registro de manifesto ou anotações de runtime. Caso qualquer campo esteja ausente ou haja incompatibilidade entre a experiência, o workspace, o perfil cognitivo e o protocolo de renderização, o pipeline de release emitirá obrigatoriamente: **`Experience Certification Failed`** e o deploy será bloqueado.

---

## 2. Contrato Obrigatório de Declaração de Metadados

Toda superfície deve declarar obrigatoriamente os seguintes 5 campos de metadados fiduciários:

```yaml
experience: DECISION
workspace: EXECUTIVE
classification: EXP-001
cognitiveProfile: EXECUTIVE
renderProtocol: EXECUTIVE
```

### Exemplo por Categoria de Experiência

#### 2.1 Decision Experience
```yaml
experience: DECISION
workspace: EXECUTIVE
classification: EXP-001
cognitiveProfile: EXECUTIVE
renderProtocol: EXECUTIVE
```

#### 2.2 Registration Experience
```yaml
experience: REGISTRATION
workspace: PLATFORM
classification: EXP-002
cognitiveProfile: REGISTRATION
renderProtocol: PLATFORM
```

#### 2.3 Operational Experience
```yaml
experience: OPERATIONAL
workspace: OPERATIONAL
classification: EXP-003
cognitiveProfile: OPERATIONAL
renderProtocol: OPERATIONAL
```

#### 2.4 Intelligence Experience
```yaml
experience: INTELLIGENCE
workspace: INTELLIGENCE
classification: EXP-004
cognitiveProfile: INTELLIGENCE
renderProtocol: INTELLIGENCE
```

---

## 3. As 5 Regras de Validação Automática do Pipeline

Para obter o certificado de release, a superfície deve passar com 100% de sucesso pelas 5 verificações do *Compliance Gate*:

1. **Gate 1 (Classificação Obrigatória)**: O código de classificação (`classification`) DEVE existir no [`docs/CANONICAL_EXPERIENCE_REGISTRY.md`](file:///Users/marcelosouza/Documents/illumine-strategic-intelligence-advisor/docs/CANONICAL_EXPERIENCE_REGISTRY.md) (`EXP-001` a `EXP-004`).
2. **Gate 2 (Workspace Compatível)**: O `workspace` declarado DEVE ser exatamente o cadastrado para aquela `experience` na matriz do [`docs/EXPERIENCE_REGISTRY.md`](file:///Users/marcelosouza/Documents/illumine-strategic-intelligence-advisor/docs/EXPERIENCE_REGISTRY.md).
3. **Gate 3 (Render Protocol Compatível)**: O `renderProtocol` DEVE ser a especialização visual autorizada para aquela `experience`.
4. **Gate 4 (Cognitive Profile Compatível)**: O `cognitiveProfile` DEVE corresponder ao modelo de processamento da experiência declarada.
5. **Gate 5 (Registro na Matriz de Superfícies)**: A página DEVE estar catalogada no [`docs/EXPERIENCE_CLASSIFICATION_MATRIX.md`](file:///Users/marcelosouza/Documents/illumine-strategic-intelligence-advisor/docs/EXPERIENCE_CLASSIFICATION_MATRIX.md).

---

## 4. Tratamento de Falhas de Certificação

Caso ocorra qualquer discrepância:
* O pipeline emitirá o log crítico: **`Experience Certification Failed: [Razão da Incompatibilidade]`**.
* A build de staging/produção será imediatamente abortada.
* O Architecture Council receberá a notificação para correção do manifesto antes de nova tentativa de deploy.
