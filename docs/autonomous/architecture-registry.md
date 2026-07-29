# AGFP-0024 — Architecture Registry (AR)

**RFC: Registro Vivo de Ativos, Componentes e Dependências (v16.0)**

---

## 1. Contexto & Objetivo
O **Architecture Registry (AR)** é o repositório em tempo real de todos os ativos de software da plataforma. Ele transcende a documentação estática, mantendo o estado vivo de cada primitiva, layout, página, ViewModel, versão e proprietário.

---

## 2. Estrutura de Registro de Ativo (Live Registry Record)

```json
{
  "assetId": "ExecutiveSurface",
  "assetType": "PRIMITIVE_COMPONENT",
  "version": "2.4.0",
  "owner": "Design System Team",
  "status": "STABLE",
  "ahsScore": 100.0,
  "dependencies": ["index.css", "executive-typography.tsx"],
  "consumingPagesCount": 134,
  "consumingLayoutsCount": 17,
  "relatedADRs": ["ADR-0003", "ADR-0012"],
  "relatedAGFPs": ["AGFP-0008"],
  "lastAuditDate": "2026-07-28T02:25:07Z",
  "changelog": [
    { "version": "2.4.0", "date": "2026-07-28", "description": "High contrast soft surface variants" }
  ]
}
```

---

## 3. Fluxo de Atualização do Registro Vivo

```text
  [Git Commit / PR] ➔ [AR Registry Indexer] ➔ [Update Asset Graph & Scores] ➔ [Publish AR Status API]
```
