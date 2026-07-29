# AGFP-0026 — Runtime Validator

**RFC: Validador em Tempo de Execução de Comportamento e Contratos Arquiteturais (v16.0)**

---

## 1. Contexto & Objetivo
O **Runtime Validator** valida o comportamento da aplicação em tempo de execução, indo além da verificação estática (linters/typecheck) para garantir que contratos de renderização, performance e acessibilidade sejam respeitados na experiência real do usuário.

---

## 2. Pipeline do Runtime Validator

```text
  [Manifest (.page.yml)] ➔ [Runtime Validator] ➔ [Architecture Validator] ➔ [UI & Perf Validator] ➔ [Release Approval]
```
