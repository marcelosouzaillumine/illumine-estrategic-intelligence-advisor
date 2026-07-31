# Executive Analytics Contract Registry

Este é o contrato público de inteligência da plataforma Illumine. Nenhuma métrica analítica poderá existir no frontend ou backend sem estar explicitamente homologada neste registro oficial.

## Tabela de Homologação de Contratos (Analytics Purity Ledger)

| Capability | Métrica | Owner | Fórmula Base | Fonte Origem | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `LiquidityCapability` | Liquidez Corrente | Finance Engine | `Ativo Circulante / Passivo Circulante` | Balanço Patrimonial | 🟢 Certified |
| `LiquidityCapability` | Liquidez Imediata | Finance Engine | `Disponível / Passivo Circulante` | Balanço Patrimonial | 🟢 Certified |
| `WorkingCapitalCapability` | NCG (Necessidade Capital Giro) | Finance Engine | `Contas a Receber + Estoques - Fornecedores` | Balanço / DFC | 🟡 Pending |
| `LeverageCapability` | Grau de Endividamento | Finance Engine | `Capital de Terceiros / Passivo Total` | Balanço Patrimonial | 🟡 Pending |
| `LeverageCapability` | Composição do Endividamento | Finance Engine | `Passivo Circulante / Capital de Terceiros` | Balanço Patrimonial | 🟡 Pending |
| `ProfitabilityCapability` | Margem Líquida | Finance Engine | `Lucro Líquido / Receita Líquida` | DRE | 🟡 Pending |

---

*Métricas sinalizadas com "Pending" aguardam a validação de seus respectivos testes no pipeline do `ExecutiveAnalyticsEngine` para atingirem o status "Certified". Nenhuma interface pode consumir métricas Pending sem acionar um warning formal.*
