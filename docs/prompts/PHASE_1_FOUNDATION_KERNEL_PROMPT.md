# ILLUMINE OS™ — FOUNDATION KERNEL IMPLEMENTATION PROMPT (v20.1)
## FASE 1: @illumine/core & @illumine/metadata

============================================================
PAPEL E MISSÃO
============================================================
Você é o Principal Platform Engineer responsável pela implementação da FASE 1 — Foundation Kernel da Illumine Executable Platform.
Sua missão é transformar os contratos arquiteturais documentados em infraestrutura executável.

A implementação deve respeitar integralmente:
- Executive Visual Constitution (EVC)
- Executive Architecture Constitution (EAC)
- Architecture Governance Framework (AGF)
- Executive Metadata Engine (EME)
- Semantic Execution Engine (SEE)
- MVVM Architecture
- RFC 2119 MUST / SHOULD / MAY Rules

============================================================
OBJETIVO DA FASE 1
============================================================
Construir os dois primeiros pacotes oficiais:
1. `@illumine/core`
2. `@illumine/metadata`

Estes pacotes serão a fundação obrigatória para todos os módulos futuros.
Nenhum pacote posterior pode criar infraestrutura paralela.

============================================================
PRINCÍPIO ARQUITETURAL CENTRAL
============================================================
```text
Application Layer
       │
       ▼
Runtime / Compiler / Agents (@illumine/runtime, @illumine/compiler, @illumine/agent)
       │
       ▼
Metadata Layer (@illumine/metadata)
       │
       ▼
Core Infrastructure Layer (@illumine/core)
```
- `@illumine/core` é o Kernel de infraestrutura.
- `@illumine/metadata` é a fonte declarativa de verdade.

============================================================
PACOTE 01 — @illumine/core
============================================================
Responsabilidade: Criar o núcleo corporativo compartilhado.
Estrutura esperada: `packages/core/src/`
- `container/dependency-container.ts` & `service-provider.ts`
- `events/event-bus.ts` & `event-types.ts`
- `telemetry/metrics.ts` & `tracer.ts`
- `logging/logger.ts`
- `security/security-context.ts`
- `plugins/plugin-registry.ts`
- `errors/platform-error.ts`
- `index.ts`

Eventos internos no EventBus (`MUST`):
`MetadataUpdated`, `RuntimeCompiled`, `CertificationGenerated`, `ArchitectureViolationDetected`, `WorkflowExecuted`.

============================================================
PACOTE 02 — @illumine/metadata
============================================================
Responsabilidade: Implementar o Executive Metadata Engine (EME Registry).
Estrutura esperada: `packages/metadata/src/`
- `registry/metadata-registry.ts`
- `schemas/entity-schema.ts`, `page-schema.ts`, `workflow-schema.ts`, `policy-schema.ts`
- `versioning/migration-engine.ts`
- `storage/metadata-store.ts`
- `validation/schema-validator.ts`
- `index.ts`

Toda alteração de metadata MUST gerar:
1. Evento no EventBus (`MetadataUpdated`)
2. Registro de auditoria
3. Atualização no Registry
4. Novo hash de versão

============================================================
CRITÉRIOS DE ACEITAÇÃO DA FASE 1
============================================================
✓ `@illumine/core` compilando sem erros
✓ `@illumine/metadata` compilando sem erros
✓ Zero dependências circulares
✓ API pública documentada com TypeScript Interfaces
✓ AHS ≥ 90 | GCI ≥ 95

============================================================
FORMATO DE ENTREGA DA IA
============================================================
1. Diagnóstico atual
2. Arquitetura implementada
3. Pacotes alterados
4. Dependências criadas
5. ADR relacionado
6. Código produzido
7. Testes executados
8. Auditoria AGF
9. Impacto DIE
10. Métrica AHS
11. Métrica GCI
12. Próxima etapa recomendada (v20.2 — Governance Tooling)
