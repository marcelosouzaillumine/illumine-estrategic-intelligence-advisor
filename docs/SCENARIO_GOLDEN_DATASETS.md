# SCENARIO_GOLDEN_DATASETS

## FINALIDADE
Este documento estabelece os conjuntos de dados de simulação padrão (Golden Datasets) utilizados pela `ScenarioSimulationEngine`. Estes cenários garantem que o motor de simulação bloqueie projeções ilusórias, propague adequadamente as dependências estruturais de caixa e capital, e calcule com fidelidade a continuidade empresarial.

## CONJUNTOS OBRIGATÓRIOS

### 1. Sustainable Growth
**Cenário**: Expansão de receita suportada por margem operacional forte e folga de caixa (Funding Sustentável).
**Entradas**: +20% Receita Líquida, Margem de EBITDA preservada.
**Resultado Esperado**: Runway Estável, Causalidade Positiva, Advisory recomenda reinvestimento.

### 2. Destructive Expansion
**Cenário**: Crescimento acelerado com compressão de margem bruta, consumindo diretamente o capital de giro operacional.
**Entradas**: +30% Receita Líquida, -20% Margem de EBITDA.
**Resultado Esperado**: Queda acentuada no Caixa, Runway Colapsando, Advisory de "Crescimento Tensionado / Destrutivo".

### 3. Runway Collapse
**Cenário**: Empresa com baixo saldo de caixa (ex: 2 meses de cobertura) incorrendo em aumento fixo de gastos operacionais (ex: Headcount).
**Entradas**: +30% Despesas Operacionais, 0% Aumento Receita.
**Resultado Esperado**: Burn rate acelera drasticamente. Runway cai para menos de 1 mês. Score de Resiliência despenca.

### 4. Treasury Stress
**Cenário**: Alongamento crônico de prazo de recebimento contra fornecedores inelásticos. O lucro existe na DRE, mas o DFC afunda.
**Entradas**: +40% Contas a Receber (prazo médio), -10% Caixa Operacional.
**Resultado Esperado**: Lucro Artificial isolado. Risco dominante de "Falso Positivo Operacional". Classificação de "Pressão Extrema de Tesouraria".

### 5. Capital Injection Dependency
**Cenário**: Aporte pontual de sócios que reestabelece saldo bancário momentâneo de uma empresa estruturalmente deficitária (Queima recorrente de caixa operacional).
**Entradas**: +R$ 1M Aporte (Financiamento), -R$ 100K/mês Burn Operacional.
**Resultado Esperado**: Aviso de "Funding Artificial". Runway melhora apenas matematicamente (ex: de 1 para 11 meses), mas Causalidade e Advisory marcam a saúde operacional como "Destrutiva" (Sobrevida Comprada).

### 6. Operational Retraction
**Cenário**: Queda de receita repentina, testando a elasticidade estrutural da empresa (despesas fixas altas).
**Entradas**: -30% Receita, Custo Fixo engessado.
**Resultado Esperado**: Margem comprimida ao extremo. Queda abrupta de resiliência. Ativação de alertas de enxugamento obrigatório (Turnaround).

### 7. Hospital Stress Cycle
**Cenário**: Setup crítico. Operação com passivo trabalhista/tributário enorme, sem caixa e operando no vermelho.
**Entradas**: Passivo > Ativo, Caixa < 1 mês, DRE < 0.
**Resultado Esperado**: Simulação projeta falência. Qualquer tentativa de simular expansão sem aporte prévio deve ser bloqueada.

### 8. Seasonal Shock
**Cenário**: Estresse agudo simulado com reversão da sazonalidade em empresas dependentes de pico de vendas (ex: Q4).
**Entradas**: Modelado via parâmetros modulares da Stability Layer (ex: redução arbitrária de receita sazonal).
**Resultado Esperado**: Damping causal entra em ação. O sistema reconhece a instabilidade temporária e não diagnostica "Colapso" estrutural de longo prazo injustificadamente.

### 9. Debt Expansion
**Cenário**: Captação de empréstimo (nova dívida de longo prazo) para funding.
**Entradas**: Aumento substancial de Passivo e de Saldo Bancário.
**Resultado Esperado**: Runway dispara. Entretanto, dependência financeira é elevada ao máximo. Causalidade é impactada negativamente ("Capitalização Carregada de Risco").

### 10. Turnaround Recovery
**Cenário**: Empresa deficitária cortando drasticamente Opex para nivelar o runway e estancar a drenagem.
**Entradas**: -40% Despesas, 0% Receita.
**Resultado Esperado**: EBITDA recupera (mesmo que base baixa). Runway começa a estabilizar. Advisory reporta "Controle de Sangramento" (Sinal positivo vs colapso eminente).
