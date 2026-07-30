# Relatório de Migração de Schema Financeiro (CFDI v2.1)

**Plataforma**: Illumine OS™  
**Pipeline**: FinancialPipelineOrchestrator v2.1.0  
**Data**: 30 de Julho de 2026  

---

## 1. Aliases Encontrados e Mapeados

| Alias Legado Encontrado | Propriedade Canônica no Schema 2.1.0 | Ação do CanonicalFinancialNormalizer |
| :--- | :--- | :--- |
| `conta`, `category`, `account`, `nome` | `accountName: string` | Mapeado e sanitizado como string única |
| `codigo`, `code`, `id` | `accountCode: string` | Normalizado ou gerado via hash |
| `valor`, `value`, `val`, `amount` | `amount: number` | Convertido em número float imutável |
| `tipo`, `type`, `statementType` | `statementType: FinancialStatementType` | Convertido para enum canônico rígido |
| `client_id`, `clientId` | `clientId: string` | Validado via `ClientIdentityResolver` |
| `exercicio`, `period`, `year` | `year: number` | Normalizado como ano numérico |

---

## 2. Registros e Schemas Normalizados
- **Formato Canônico em Runtime**: `Readonly<CanonicalFinancialEntry>`
- **Assinatura Fiduciária**: Fingerprint SHA-256 no `CertifiedFinancialDataset`
- **Coleção de Auditoria no Firestore**: `financial_certifications`

---

## 3. Status de Erros e Inconsistências Corregidas
- **Divergência de Nome de Empresas**: Resolvido.
- **Mistura entre DRE e Balanço**: Eliminado por isolamento rigoroso via `FinancialStatementType`.
- **Geração de Dados Sintéticos de Fallback**: Eliminado. Ausência de dados aciona `FIN-010` e status `FAILED` com bloqueio do runtime.

---

## 4. Inconsistências Remanescentes
- **Zero Inconsistências**. O sistema opera 100% sob a governança da Wave 18.10.5 (CFDI v2.1).
