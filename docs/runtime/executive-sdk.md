# AGFP-0022 — Executive SDK (`@illumine/runtime`)

**RFC: Kit de Desenvolvimento Corporativo e Ferramentas CLI do Illumine OS™ (v15.0)**

---

## 1. Contexto & Objetivo
O **Executive SDK (`@illumine/runtime`)** fornece a infraestrutura de linha de comando (CLI), compiladores, geradores de manifestos, plugins ESLint e auditores para desenvolvedores e pipelines CI/CD.

---

## 2. Estrutura do SDK (`@illumine/runtime`)

```text
@illumine/runtime
├── cli/                  # CLI com comandos `illumine build`, `illumine audit`, `illumine cert`
├── compiler/             # Compilador EUC (AST Engine)
├── runtime/              # Motor ERE (Runtime Executivo)
├── metadata/             # EME Metadata Registry
├── generators/           # Geradores de Manifestos PMS (.yml)
├── eslint-plugin/        # Regras de validação estática de lint (MUST/SHOULD)
└── certification/        # Gerador de Manifestos L4 e Assinatura Digital
```

---

## 3. Principais Comandos da CLI (`illumine-cli`)

```bash
# Validar conformidade AGF de um manifesto
npx illumine audit --manifest src/manifests/consolidated-executive.page.manifest.yml

# Compilar manifestos para a árvore React
npx illumine build --target react

# Gerar o manifesto de certificação L4 assinado
npx illumine cert --page ConsolidatedExecutivePage.tsx --sign
```
