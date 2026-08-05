# Dynamic Data Boundary Audit

Auditoria da fronteira de dados dinâmicos do Executive Workspace (Wave 2B.4).

## Regras de Internacionalização

| Elemento | Deve traduzir? | Justificativa |
| --- | --- | --- |
| Receita | ✅ | Label de interface (pode ser mapeado em namespaces). |
| Revenue | ✅ | Label de interface. |
| Faturamento | ✅ | Label de interface. |
| `R$ 1.250.000` | ❌ | Dado dinâmico. Deve ser formatado pelo `useExecutiveFormatter()`. |
| `USD 250,000` | ❌ | Dado dinâmico. Deve ser formatado pelo `useExecutiveFormatter()`. |
| EBITDA | ❌ | Termo financeiro protegido (`protected_business_terms`). |
| Nome da empresa | ❌ | Dado do Domínio corporativo (Domain Data). |
| CNPJ | ❌ | Dado estrutural não traduzível. |
| UUID | ❌ | Identificador do sistema. |
| Data de atualização | Depende do Locale | O valor da data não muda, mas a *formatação* sim (via `useExecutiveFormatter()`). |

## Restrições Técnicas

- Nenhum componente visual deve invocar métodos diretos do JS `Intl` (`new Intl.NumberFormat()`, `toLocaleString()`).
- Tudo deve passar pela infraestrutura canônica de resolvers `src/core/localization`.
