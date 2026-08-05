# Type Debt Audit - Sprint 2 (Wave 2B)

Este documento registra erros de tipagem encontrados na camada de Domínio, Dados e Providers que, conforme a regra de "Strict Scope" da Wave 2B de Internacionalização, não devem ser corrigidos automaticamente pela equipe de Experience para prevenir quebras de contratos arquiteturais.

## Erros Identificados

- **Arquivo:** `src/workspace/data/factory/provider.factory.ts`
  - **Erro:** `Cannot find module '../../intelligence/cfo/mock-cfo.provider'`
  - **Motivo:** O módulo foi movido ou renomeado, mas o factory não foi atualizado.

- **Arquivo:** `src/workspace/data/mappers/cfo-snapshot.mapper.ts`
  - **Erro:** `Type is missing the following properties from type 'ExecutiveSnapshotMetadata': schemaVersion, engineVersion, providerVersion, sourceVersion, and 6 more.`
  - **Motivo:** Contrato `ExecutiveSnapshotMetadata` foi expandido, mas o mapper não foi atualizado para preencher as novas propriedades.

- **Arquivo:** `src/workspace/data/providers/mock-cfo.provider.ts`
  - **Erro:** Faltam as mesmas propriedades de `ExecutiveSnapshotMetadata`.

- **Arquivo:** `src/workspace/intelligence/snapshots/snapshot.generator.ts`
  - **Erro:** Faltam as mesmas propriedades de `ExecutiveSnapshotMetadata` ao gerar o snapshot.

## Resolução Esperada
A equipe responsável pela fundação de dados (`Enterprise Data Foundation™`) deverá corrigir a injeção das novas propriedades de metadados (`schemaVersion`, `engineVersion`, etc) diretamente nos mocks e mappers da camada de dados.

- **Arquivo:** `src/App.tsx`
  - **Erro:** `Type 'string | number | bigint | true | Iterable<ReactNode> | Element | Promise<ReactNode>' is not assignable to type 'ReactNode'.`
  - **Motivo:** O método `renderCurrentPage` está retornando tipos incompatíveis com o JSX node esperado pelo React. Isso decorre de alterações no router/App root paralelas à internacionalização.
