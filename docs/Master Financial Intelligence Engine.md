# MASTER FINANCIAL INTELLIGENCE ENGINE

## 1. Finalidade

Este documento define as regras oficiais de cálculo, classificação, curadoria e interpretação financeira da plataforma Illumine.

Toda análise de Balanço Patrimonial, DRE, Fluxo de Caixa, Indicadores, Scores, Stress Tests e Advisory Narratives deve obedecer a este documento.

Este arquivo é a fonte oficial das fórmulas financeiras da plataforma.

---

## 2. Regra de Precedência

Sempre que houver conflito entre documentos, a ordem de decisão será:

1. MASTER_ARCHITECTURE.md
2. MASTER_FINANCIAL_INTELLIGENCE_ENGINE.md
3. Documentos específicos de módulos
4. Componentes de interface
5. Mock data ou regras locais

A Arquitetura Mestre define a estrutura global da plataforma.

Este documento define a inteligência financeira oficial.

Nenhum componente pode criar fórmula própria se ela já estiver definida aqui.

---

## 3. Princípios da Engine Financeira

A plataforma deve sempre distinguir:

- situação contábil;
- situação econômica;
- situação financeira;
- liquidez tradicional;
- liquidez real;
- risco de curto prazo;
- continuidade empresarial;
- geração operacional;
- solvência patrimonial;
- Insolvência Técnica Patrimonial;
- Insolvência Financeira;
- Insolvência Econômica.

Deixar claro que:
- PL negativo não significa automaticamente inviabilidade operacional;
- EBITDA positivo não elimina risco patrimonial, risco de liquidez ou risco de continuidade.

O sistema nunca deve classificar uma empresa como insolvente apenas por liquidez ruim se o Patrimônio Líquido ainda for positivo.

---

# 4. Estrutura Oficial do Balanço Patrimonial

## 4.1 Equação obrigatória

```text
Ativo Total = Passivo Total + Patrimônio Líquido
```

Se essa equação não fechar, o sistema deve sinalizar erro estrutural.

## 4.2 Grupos obrigatórios

### Ativo

- Ativo Circulante
- Ativo Não Circulante

### Passivo

- Passivo Circulante
- Passivo Não Circulante

### Patrimônio Líquido

- Capital Social
- Reservas
- Lucros ou Prejuízos Acumulados
- Resultado do Exercício

---

# 5. Indicadores Oficiais de Liquidez

## 5.1 Liquidez Corrente

```text
Liquidez Corrente = Ativo Circulante / Passivo Circulante
```

## 5.2 Liquidez Seca

```text
Liquidez Seca = (Ativo Circulante - Estoques) / Passivo Circulante
```

## 5.3 Liquidez Imediata

```text
Liquidez Imediata = (Caixa + Bancos + Aplicações Financeiras de Liquidez Imediata) / Passivo Circulante
```

O sistema não deve considerar apenas Caixa físico.

Deve considerar:

- Caixa
- Bancos
- Aplicações Financeiras de Liquidez Imediata

## 5.4 Liquidez Geral Tradicional

```text
Liquidez Geral = Ativo Total / Passivo Exigível
```

Onde:

```text
Passivo Exigível = Passivo Circulante + Passivo Não Circulante
```

## 5.5 Liquidez Real

A Liquidez Real deve ser indicador separado da Liquidez Geral Tradicional.

A Liquidez Real deve considerar descontos ou exclusões de ativos de baixa conversibilidade.

Exemplo:

- Imobilizado não deve ser tratado como caixa disponível.
- Depósitos judiciais não devem ser tratados como liquidez operacional.
- Títulos de capitalização e participações não devem ser tratados como liquidez imediata.
- Estoques devem ser considerados com prudência.

---

# 6. Classificação de Conversibilidade dos Ativos

## 6.1 Alta Conversibilidade

Ativos com conversão imediata ou quase imediata em caixa:

- Caixa
- Bancos
- Aplicações Financeiras de Liquidez Imediata

## 6.2 Média Conversibilidade

Ativos realizáveis no ciclo operacional:

- Clientes a Receber líquidos
- Cheques a Receber
- Cartão de Crédito a Receber

## 6.3 Baixa Conversibilidade

Ativos que dependem de venda, compensação ou processo operacional:

- Estoques
- Adiantamentos a Fornecedores
- Tributos a Recuperar
- Créditos com Funcionários

## 6.4 Conversibilidade Restrita

Ativos com baixa liquidez econômica no curto prazo:

- Imobilizado
- Depósitos Judiciais
- Títulos de Capitalização
- Participações Societárias
- Mútuos
- Bens de Uso

---

# 7. Capital de Giro e Tesouraria

## 7.1 Capital de Giro Líquido

```text
Capital de Giro Líquido = Ativo Circulante - Passivo Circulante
```

Também pode ser exibido como:

```text
CGL = AC - PC
```

## 7.2 Ativo Circulante Financeiro

Inclui:

- Caixa
- Bancos
- Aplicações Financeiras de Liquidez Imediata

## 7.3 Ativo Circulante Operacional

Inclui:

- Clientes a Receber líquidos
- Estoques
- Impostos a Recuperar
- Adiantamentos a Fornecedores
- Outros créditos operacionais

Exclui:

- Caixa
- Bancos
- Aplicações Financeiras

## 7.4 Passivo Circulante Financeiro

Inclui:

- Empréstimos
- Financiamentos
- Duplicatas Descontadas
- Conta Garantida
- Adiantamentos de Contrato de Câmbio
- Dívidas bancárias de curto prazo

## 7.5 Passivo Circulante Operacional

Inclui:

- Fornecedores
- Impostos a Pagar
- Obrigações Trabalhistas
- Obrigações Previdenciárias
- Provisões Trabalhistas
- Adiantamentos de Clientes
- Contas Operacionais a Pagar

Exclui:

- Empréstimos
- Financiamentos
- Duplicatas Descontadas
- Conta Garantida
- ACC
- Dívidas bancárias

## 7.6 Necessidade de Capital de Giro

```text
NCG = Ativo Circulante Operacional - Passivo Circulante Operacional
```

## 7.7 Saldo de Tesouraria

```text
Saldo de Tesouraria = Capital de Giro Líquido - NCG
```

Interpretação:

- Saldo de Tesouraria positivo: maior folga financeira.
- Saldo de Tesouraria negativo: dependência de capital financeiro ou dívidas de curto prazo para sustentar o giro.

---

# 8. Estrutura de Capital

## 8.1 Passivo Exigível

```text
Passivo Exigível = Passivo Circulante + Passivo Não Circulante
```

## 8.2 Endividamento Geral

```text
Endividamento Geral = Passivo Exigível / Ativo Total
```

## 8.3 Participação de Capital Próprio

```text
Participação de Capital Próprio = Patrimônio Líquido / Ativo Total
```

## 8.4 Capitais de Terceiros sobre PL

```text
Capitais de Terceiros / PL = Passivo Exigível / Patrimônio Líquido
```

Se o Patrimônio Líquido for negativo, o sistema deve sinalizar insolvência técnica.

Se o Patrimônio Líquido for positivo, mas muito baixo, o sistema deve classificar como baixa proteção patrimonial, e não como insolvência técnica.

---

# 9. Classificação de Severidade

## 9.1 Níveis permitidos

A plataforma deve usar os seguintes níveis:

1. Saudável
2. Estável
3. Atenção
4. Pressionado
5. Crítico
6. Estresse Financeiro Severo
7. Insolvência Técnica
8. Risco de Ruptura Operacional

## 9.2 Insolvência Técnica

Usar somente quando:

```text
Patrimônio Líquido < 0
```

## 9.3 Estresse Financeiro Severo

Usar quando houver combinação de:

- Liquidez Corrente inferior a 1;
- Capital de Giro Líquido negativo;
- Saldo de Tesouraria negativo;
- Passivo Circulante muito elevado;
- Patrimônio Líquido ainda positivo.

## 9.4 Risco de Ruptura Operacional

Usar quando houver combinação de:

- Liquidez imediata muito baixa;
- Passivos vencidos ou exigíveis no curto prazo;
- Incapacidade de geração operacional;
- Dependência de bancos ou fornecedores para continuidade;
- Risco concreto de interrupção da operação.

## 9.5 Colapso Financeiro

Evitar o uso automático deste termo.

Só utilizar quando houver evidência combinada de:

- Patrimônio Líquido negativo;
- Liquidez corrente crítico;
- Geração operacional negativa;
- Incapacidade de rolagem de dívida;
- Risco real de descontinuidade.

---

# 10. Score Patrimonial

O Score Patrimonial deve avaliar:

- Liquidez
- Estrutura de Capital
- Capital de Giro
- Solidez Patrimonial
- Evolução Histórica

Pesos oficiais:

```text
Liquidez: 25%
Estrutura: 25%
Capital de Giro: 20%
Solidez: 20%
Evolução: 10%
```

O score não deve ser baseado apenas em liquidez.

Empresas com Patrimônio Líquido positivo e Ativo Total superior ao Passivo Exigível não devem receber automaticamente diagnóstico de colapso, mesmo com baixa liquidez.

---

# 10.1 Regras de Consistência do Score Patrimonial

## 10.1.1 Travas Estruturais

O sistema deve impedir scores elevados quando houver deterioração estrutural relevante.

### Regra 1 — Patrimônio Líquido Negativo

Se:

```text
PL < 0
```

Então:

```text
Score Patrimonial Máximo = 35/100
```

E classificar:

- Insolvência Técnica
- Estrutura Patrimonial Comprometida

---

### Regra 1.1 — EBITDA Positivo com PL Negativo

Se:

```text
PL < 0
E
EBITDA > 0
```

O Score Patrimonial não deve ser automaticamente zerado.

A classificação correta deve ser:

- Insolvência Técnica Patrimonial com Capacidade Operacional Preservada

O score sugerido deve ficar entre 10 e 24/100, salvo se houver também EBITDA negativo, liquidez real severamente comprometida, tesouraria negativa, incapacidade operacional e risco concreto de descontinuidade.

---

### Regra 2 — Tesouraria Estruturalmente Negativa

Se:

```text
Saldo de Tesouraria < 0
```

E:

```text
CGL < 0
```

Então:

```text
O Score de Capital de Giro não pode exceder 20/100.
```

---

### Regra 3 — Liquidez Real Severamente Comprometida

Se:

```text
Liquidez Real < 0.50
```

Classificar:

```text
Liquidez Econômica Severamente Comprometida
```

E reduzir automaticamente:

- score de liquidez;
- score patrimonial;
- score de continuidade.

---

### Regra 4 — Passivo Circulante Excessivo

Se:

```text
Passivo Circulante > Ativo Circulante
```

Classificar:

```text
Pressão Estrutural de Curto Prazo
```

Evitar:

- confortável;
- equilibrado;
- estável.

---

# 11. Advisory Narratives

Toda narrativa automática deve distinguir quatro dimensões:

## 11.1 Diagnóstico Contábil

Avalia se o balanço fecha e se o Patrimônio Líquido é positivo ou negativo.

## 11.2 Diagnóstico Financeiro

Avalia liquidez, caixa, capital de giro e pressão de curto prazo.

## 11.3 Diagnóstico Econômico

Avalia geração de resultado, EBITDA, EBIT, lucro líquido e margens.

## 11.4 Diagnóstico Estratégico

Avalia sustentabilidade, necessidade de capitalização, rolagem de dívida, eficiência operacional e continuidade.

---

# 11.5 Regras de Governança Narrativa

## 11.5.1 Proibição de Contradição Narrativa

A narrativa jamais poderá contradizer:

- liquidez;
- tesouraria;
- patrimônio líquido;
- capital de giro;
- geração operacional;
- estrutura de passivos.

---

## 11.5.2 Expressões Proibidas

O sistema NÃO pode utilizar expressões otimistas quando houver deterioração estrutural relevante.

### Não utilizar:

- colchão patrimonial;
- conforto financeiro;
- situação equilibrada;
- estabilidade financeira;
- baixa pressão de caixa;
- estrutura sólida.

SE houver:

```text
PL < 0
OU
Liquidez Corrente < 1
OU
Saldo de Tesouraria < 0
```

---

## 11.5.3 EBITDA Positivo

EBITDA positivo NÃO elimina automaticamente:

- insolvência técnica;
- risco de liquidez;
- pressão financeira;
- deterioração patrimonial.

Quando houver:

```text
EBITDA > 0
MAS
PL < 0
OU
Tesouraria negativa
```

A narrativa correta deve ser:

```text
A operação ainda preserva capacidade de geração operacional, porém a estrutura financeira permanece pressionada e dependente de reestruturação.
```

---

## 11.5.4 Liquidez Real vs Liquidez Contábil

Quando:

```text
Liquidez Real < Liquidez Corrente
```

A engine deve reconhecer:

```text
Existe distorção entre liquidez contábil e liquidez econômica real.
```

---

## 11.5.5 Crescimento Acelerado de Passivos Operacionais

Se:

```text
Fornecedores crescerem acima de 80% YoY
```

Interpretar como possível:

```text
Utilização de fornecedores como funding operacional.
```

Se:

```text
Obrigações fiscais/previdenciárias crescerem acima de 100% YoY
```

Interpretar como:

```text
Postergação de obrigações e deterioração do caixa operacional.
```

---

## 11.5.6 Regra de Curadoria para Insolvência Técnica com Operação Ativa

A narrativa obrigatória deve ser:

```text
A empresa apresenta insolvência técnica patrimonial e severa pressão de liquidez, porém ainda preserva capacidade operacional. O principal risco está no descasamento entre obrigações de curto prazo e ativos de baixa conversibilidade econômica, exigindo reestruturação financeira, alongamento de passivos, capitalização e disciplina rigorosa de capital de giro.
```

---

## 11.5.7 Termos Fatalistas Proibidos

A plataforma deve evitar termos como:
- empresa inviável;
- colapso definitivo;
- falência operacional;
- ruptura inevitável;

Salvo quando houver evidência combinada de EBITDA negativo, fluxo operacional negativo recorrente, liquidez imediata próxima de zero, passivos vencidos relevantes, incapacidade de renegociação e risco concreto de paralisação operacional.

---

# 12. Regra para BP com Liquidez Ruim e PL Positivo

Quando a empresa apresentar:

- Patrimônio Líquido positivo;
- Ativo Total maior que Passivo Exigível;
- Liquidez Corrente menor que 1;
- Capital de Giro Líquido negativo;
- Saldo de Tesouraria negativo;

A narrativa correta deve ser:

```text
A empresa apresenta estrutura patrimonial positiva, porém financeiramente pressionada. O principal risco está no descasamento entre obrigações de curto prazo e ativos líquidos disponíveis. A prioridade estratégica deve ser a recomposição do capital de giro, alongamento de passivos, melhoria do ciclo financeiro e preservação da geração operacional.
```

Não usar automaticamente:

```text
Colapso financeiro
Insolvência
Empresa inviável
Falência técnica
```

---

# 13. Stress Tests

Os testes de estresse devem avaliar:

- queda de receita;
- aumento de inadimplência;
- aumento de juros;
- pressão sobre estoques;
- redução de margem;
- vencimento concentrado de dívidas;
- perda de fornecedores estratégicos.

Cada stress test deve indicar:

- impacto sobre liquidez;
- impacto sobre EBITDA;
- impacto sobre lucro líquido;
- impacto sobre capital de giro;
- impacto sobre continuidade.

---

# 14. Regra de Consistência

Antes de gerar qualquer análise, a engine deve validar:

```text
Ativo Total = Passivo Total + Patrimônio Líquido
```

Depois validar:

```text
Ativo Circulante + Ativo Não Circulante = Ativo Total
Passivo Circulante + Passivo Não Circulante = Passivo Total
```

Depois calcular indicadores.

Depois gerar narrativa.

Nunca gerar narrativa antes da validação aritmética.

---

# 15. Proibição de Mock Financeiro

Nenhum card, score, badge ou insight financeiro pode usar mock data quando houver dados reais disponíveis.

Se o dado estiver ausente, exibir:

```text
Pendente
Dados insuficientes
Não calculável
```

Nunca inventar score, tendência ou recomendação.

---

# 16. Validação Esperada para o BP 2024

Com base nos dados reais de 2024, a engine deve reconhecer:

## 16.1 Fechamento Contábil

```text
Ativo Total = R$ 99.999.190,52
Passivo Exigível = R$ 97.618.295,92
Patrimônio Líquido = R$ 2.380.894,60

Ativo Total = Passivo Exigível + Patrimônio Líquido
```

Status esperado:

```text
Balanço fechado e estruturalmente consistente.
```

## 16.2 Indicadores Esperados

```text
Capital de Giro Líquido = R$ -5.233.520,83
Liquidez Corrente ≈ 0,94
Liquidez Seca ≈ 0,73
Liquidez Imediata ≈ 0,07
Liquidez Geral Tradicional ≈ 1,02
```

## 16.3 Diagnóstico Esperado

A empresa deve ser classificada como:

```text
Estrutura Patrimonial Pressionada
Estresse Financeiro Crítico
Risco de Liquidez de Curto Prazo
Baixa Proteção Patrimonial
```

Evitar classificação automática como:

```text
Colapso Financeiro
Insolvência Técnica
Falência Técnica
Empresa inviável
```

Porque o Patrimônio Líquido ainda é positivo.

---

# 17. Diretriz Final

Toda página, card, módulo, score, insight ou análise financeira deve obedecer este documento.

Se houver divergência entre cálculo local e esta engine, prevalece esta engine.

---

# 18. ENGINE DE CAUSALIDADE FINANCEIRA

## 18.1 Finalidade

A ENGINE DE CAUSALIDADE FINANCEIRA define as relações de causa e efeito entre indicadores financeiros, operacionais, patrimoniais e estratégicos da plataforma Illumine.

O objetivo não é apenas calcular métricas isoladas, mas interpretar:

- origem da deterioração;
- propagação do risco;
- dependências sistêmicas;
- efeitos em cadeia;
- vetores de pressão;
- pontos de ruptura;
- sustentabilidade empresarial.

Toda análise deve considerar que indicadores financeiros possuem interdependência estrutural.

O sistema deve interpretar causalidade e não apenas números isolados.

---

# 18.2 Princípios da Causalidade Financeira

A engine deve reconhecer que:

- problemas de caixa afetam rentabilidade;
- problemas operacionais afetam liquidez;
- alavancagem afeta continuidade;
- capital de giro afeta sobrevivência;
- inadimplência afeta tesouraria;
- pressão financeira afeta margem líquida;
- deterioração patrimonial afeta capacidade de funding.

Nenhum indicador deve ser interpretado de forma isolada.

---

# 18.3 Cadeia Oficial de Causalidade Financeira

## 18.3.1 Tesouraria Negativa

Quando:

```text
Saldo de Tesouraria < 0
```

A engine deve reconhecer possível cadeia causal:

```text
Tesouraria negativa
→ dependência bancária
→ aumento de despesa financeira
→ compressão do lucro líquido
→ deterioração patrimonial
→ piora do score patrimonial
→ aumento do risco de continuidade
```

Impactos esperados:

- pressão de curto prazo;
- aumento do custo de capital;
- dependência de rolagem;
- redução da flexibilidade financeira.

---

## 18.3.2 Crescimento Excessivo de Fornecedores

Quando:

```text
Fornecedores YoY > 80%
```

Interpretar possível causalidade:

```text
Pressão de caixa
→ utilização de fornecedores como funding operacional
→ alongamento informal do ciclo financeiro
→ aumento do risco operacional
→ possível deterioração de crédito comercial
```

A engine deve avaliar simultaneamente:

- liquidez;
- tesouraria;
- dívida bancária;
- capital de giro.

---

## 18.3.3 Crescimento de Obrigações Fiscais e Previdenciárias

Quando:

```text
Obrigações fiscais/previdenciárias YoY > 100%
```

Interpretar:

```text
Pressão de caixa operacional
→ postergação de obrigações legais
→ deterioração do fluxo operacional
→ aumento de contingências
→ elevação do risco jurídico e financeiro
```

---

## 18.3.4 Liquidez Corrente Inferior a 1

Quando:

```text
Liquidez Corrente < 1
```

Interpretar:

```text
Descasamento de curto prazo
→ insuficiência de ativos líquidos
→ pressão sobre caixa
→ necessidade de capital externo
→ aumento de risco de liquidez
```

A severidade aumenta se combinado com:

- tesouraria negativa;
- liquidez imediata baixa;
- inadimplência elevada.

---

## 18.3.5 Liquidez Real Muito Inferior à Liquidez Corrente

Quando:

```text
Liquidez Real < Liquidez Corrente em mais de 40%
```

Interpretar:

```text
Distorção entre liquidez contábil e econômica
→ excesso de ativos de baixa conversibilidade
→ falsa percepção de solvência de curto prazo
→ baixa elasticidade financeira
```

---

## 18.3.6 EBITDA Positivo com Estrutura Financeira Deteriorada

Quando:

```text
EBITDA > 0
```

MAS:

```text
PL < 0
OU
Tesouraria negativa
OU
Fluxo de Caixa Livre negativo
```

Interpretar:

```text
Operação ainda gera resultado primário
→ porém o serviço da dívida e a estrutura financeira consomem valor
→ reduzindo capacidade de recuperação patrimonial
```

A engine NÃO deve interpretar EBITDA positivo como estabilização automática.

---

## 18.3.7 Dependência Bancária Elevada

Quando:

```text
Dívida Financeira / Ativo Total > 35%
```

Interpretar:

```text
Dependência elevada de capital oneroso
→ aumento da sensibilidade a juros
→ compressão do lucro líquido
→ redução da autonomia financeira
→ maior vulnerabilidade a choques macroeconômicos
```

---

## 18.3.8 Patrimônio Líquido Negativo

Quando:

```text
PL < 0
```

Interpretar:

```text
Consumo integral do capital próprio
→ dependência estrutural de terceiros
→ redução da capacidade de funding
→ aumento do risco sistêmico
→ deterioração da continuidade empresarial
```

---

## 18.3.9 Inadimplência Elevada

Quando:

```text
Créditos vencidos / Clientes > 15%
```

Interpretar:

```text
Deterioração da conversão de caixa
→ aumento da pressão sobre tesouraria
→ maior necessidade de capital de giro
→ dependência de bancos e fornecedores
```

---

## 18.3.10 Estoques Elevados com Baixo Giro

Quando:

```text
Estoque elevado
E
Baixa conversão operacional
```

Interpretar:

```text
Capital imobilizado no ciclo operacional
→ redução da liquidez real
→ aumento da necessidade de capital de giro
→ pressão financeira adicional
```

---

# 18.4 Regras de Encadeamento Sistêmico

A engine deve conectar automaticamente:

## Liquidez

com:

- tesouraria;
- dívida;
- capital de giro;
- continuidade.

---

## Endividamento

com:

- despesa financeira;
- lucro líquido;
- patrimônio líquido;
- solvência.

---

## Operação

com:

- EBITDA;
- fluxo de caixa;
- necessidade de capital de giro;
- sustentabilidade operacional.

---

## Patrimônio

com:

- capacidade de absorção de choques;
- funding;
- resiliência estrutural;
- continuidade empresarial.

---

# 18.5 Motor de Agravamento Sistêmico

Quando múltiplos indicadores críticos coexistirem, a engine deve elevar automaticamente a severidade da análise.

Exemplo:

```text
Liquidez Corrente < 1
+
Tesouraria negativa
+
PL negativo
+
Dívida elevada
```

Resultado esperado:

```text
Estrutura Financeira Severamente Comprometida
Risco Elevado de Continuidade
Dependência Crítica de Reestruturação
```

---

# 18.6 Regras de Recomendações Baseadas em Causalidade

A recomendação deve atacar a CAUSA e não apenas o sintoma.

Exemplo incorreto:

```text
"Melhorar liquidez."
```

Exemplo correto:

```text
"Reestruturar o perfil da dívida de curto prazo para reduzir a pressão de tesouraria e restaurar a capacidade operacional de capital de giro."
```

---

# 18.7 Regra de Priorização Estratégica

A engine deve priorizar:

## 1. Sobrevivência financeira

- caixa;
- liquidez;
- tesouraria;
- continuidade.

## 2. Estabilização operacional

- capital de giro;
- fornecedores;
- ciclo financeiro;
- inadimplência.

## 3. Recuperação estrutural

- patrimônio líquido;
- rentabilidade;
- desalavancagem;
- geração de caixa livre.

## 4. Crescimento sustentável

- expansão;
- investimento;
- aumento de capacidade;
- distribuição de resultados.

---

# 18.8 Regra Final da Engine de Causalidade

Toda análise deve responder implicitamente:

```text
O que causou a deterioração?
Como o risco se propaga?
Quais indicadores estão contaminando outros?
Qual é o verdadeiro ponto de ruptura?
O problema é operacional, financeiro, econômico ou estrutural?
```

A plataforma deve interpretar empresas como sistemas financeiros integrados e não como indicadores isolados.

---

# 19. ENGINE DE CONTINUIDADE EMPRESARIAL

## 19.1 Finalidade

A ENGINE DE CONTINUIDADE EMPRESARIAL define as regras oficiais de interpretação da sobrevivência financeira, sustentabilidade operacional, resiliência estrutural e capacidade de recuperação das empresas analisadas pela plataforma Illumine.

A análise deve considerar empresas como sistemas financeiros integrados e dinâmicos.

O objetivo da engine NÃO é apenas identificar deterioração financeira, mas interpretar:

- capacidade de sobrevivência;
- capacidade de reação;
- risco temporal;
- elasticidade financeira;
- possibilidade de recuperação;
- dependência de capital externo;
- sustentabilidade operacional;
- risco de descontinuidade.

A continuidade empresarial não deve ser determinada por um único indicador isolado.

A engine deve interpretar simultaneamente:

- liquidez;
- tesouraria;
- patrimônio líquido;
- geração operacional;
- estrutura de capital;
- qualidade dos ativos;
- dependência financeira;
- capacidade de renegociação;
- resiliência operacional.

---

## 19.2 Princípios da Continuidade Empresarial

A plataforma deve reconhecer que:

- empresas podem sobreviver com Patrimônio Líquido negativo;
- empresas podem quebrar mesmo apresentando lucro contábil;
- EBITDA positivo não garante continuidade;
- liquidez ruim não significa automaticamente falência;
- geração operacional pode sustentar recuperação;
- dependência excessiva de dívida reduz resiliência;
- capital de giro é determinante para sobrevivência;
- continuidade empresarial é fenômeno dinâmico e temporal.

A engine deve avaliar:

- tempo;
- capacidade de reação;
- flexibilidade financeira;
- possibilidade de reestruturação;
- acesso a funding;
- eficiência operacional.

---

## 19.3 Fatores Oficiais de Continuidade Empresarial

### Liquidez Estrutural

A engine deve analisar:

- Liquidez Imediata;
- Liquidez Corrente;
- Liquidez Seca;
- Liquidez Real;
- Saldo de Tesouraria;
- Capital de Giro Líquido.

### Estrutura Financeira

A engine deve avaliar:

- composição da dívida;
- concentração de dívida de curto prazo;
- dependência bancária;
- ACC;
- conta garantida;
- fornecedores como funding operacional;
- pressão financeira estrutural.

### Sustentação Operacional

A continuidade deve considerar:

- EBITDA;
- EBIT;
- Margem Operacional;
- Margem Bruta;
- geração operacional de caixa;
- eficiência operacional.

### Elasticidade Financeira

A engine deve avaliar capacidade de:

- renegociar passivos;
- alongar dívidas;
- reperfilar financiamentos;
- reduzir SG&A;
- preservar caixa;
- converter ativos;
- captar equity;
- ajustar estrutura operacional.

### Qualidade dos Ativos

A plataforma deve separar:

- ativos líquidos;
- ativos operacionais;
- ativos estruturais;
- ativos de baixa conversibilidade;
- ativos ilíquidos.

A continuidade empresarial não pode considerar imobilizado como liquidez operacional.

### Dependência Sistêmica

A engine deve avaliar dependência de:

- bancos;
- fornecedores;
- antecipações;
- capital de terceiros;
- geração operacional contínua;
- renegociação permanente.

---

## 19.4 Classificação Oficial da Continuidade Empresarial

A plataforma deve utilizar:

90–100 → Continuidade Premium
75–89 → Continuidade Forte
60–74 → Continuidade Estável
45–59 → Continuidade Sensível
25–44 → Continuidade Pressionada
10–24 → Alta Fricção / Sobrevivência em Risco
0–9 → Risco Elevado de Descontinuidade

---

## 19.5 Regras Oficiais de Interpretação

### EBITDA Positivo

Quando:

EBITDA > 0

A engine deve reconhecer:

“Existe preservação parcial da capacidade operacional.”

Mesmo que coexistam:

- Patrimônio Líquido negativo;
- tesouraria negativa;
- liquidez crítica;
- pressão financeira elevada.

EBITDA positivo NÃO elimina automaticamente:

- insolvência técnica;
- pressão financeira;
- risco de liquidez;
- deterioração patrimonial.

### Tesouraria Negativa

Quando:

Saldo de Tesouraria < 0

Interpretar:

“Dependência estrutural de funding financeiro ou operacional para sustentação do giro.”

A severidade aumenta quando coexistirem:

- Liquidez Imediata muito baixa;
- dívida financeira elevada;
- concentração de passivos no curto prazo.

### Liquidez Real Muito Baixa

Quando:

Liquidez Real < 0.50

Interpretar:

“Baixa capacidade de absorção de choques de curto prazo.”

A engine deve reconhecer possível:

- falsa percepção de solvência;
- excesso de ativos de baixa conversibilidade;
- fragilidade estrutural de caixa.

### Dívida Financeira Elevada

Quando:

Dívida Financeira / Ativo Total > 35%

Interpretar:

“Alta dependência de capital oneroso e elevada sensibilidade a juros.”

### Crescimento de Obrigações Operacionais

Quando:
- fornecedores crescerem aceleradamente;
- obrigações fiscais crescerem acima da capacidade operacional;
- passivos operacionais crescerem acima da receita;

Interpretar:

“Pressão de caixa operacional e utilização de terceiros como funding indireto da operação.”

---

## 19.6 Regras de Elasticidade Financeira

A continuidade empresarial deve melhorar quando houver:

- EBITDA positivo;
- margem bruta saudável;
- ativos operacionais relevantes;
- possibilidade de renegociação;
- geração operacional recorrente;
- capacidade de alongamento de passivos;
- potencial de capitalização.

A engine deve interpretar:

- flexibilidade financeira;
- capacidade de ajuste;
- velocidade potencial de recuperação;
- capacidade de preservação operacional.

---

## 19.7 Horizonte Temporal de Pressão

A engine deve interpretar:

- ruptura imediata;
- pressão de curto prazo;
- deterioração de médio prazo;
- fragilidade estrutural;
- continuidade condicionada;
- recuperação possível.

A plataforma deve responder implicitamente:

“Qual variável ameaça primeiro a continuidade?”

Exemplos:
- caixa;
- juros;
- inadimplência;
- fornecedores;
- dívida curta;
- capital de giro;
- concentração de vencimentos.

A engine deve reconhecer:

- risco operacional;
- risco financeiro;
- risco estrutural;
- risco sistêmico.

---

## 19.8 Regras de Narrativa

A narrativa deve ser:

- institucional;
- técnica;
- advisory;
- causal;
- não sensacionalista.

Evitar automaticamente:

- empresa quebrada;
- falência inevitável;
- colapso definitivo;
- empresa inviável.

Salvo quando coexistirem:

- EBITDA negativo;
- fluxo operacional negativo recorrente;
- liquidez imediata extremamente baixa;
- incapacidade de renegociação;
- risco concreto de paralisação operacional.

---

## 19.9 Narrativa Oficial para Continuidade Condicionada

Quando houver:

- EBITDA positivo;
- porém liquidez severamente pressionada;
- tesouraria negativa;
- Patrimônio Líquido negativo;

A narrativa oficial deve reconhecer:

“A empresa ainda preserva capacidade operacional, porém sua continuidade depende de reestruturação financeira, recomposição patrimonial, alongamento de passivos e disciplina rigorosa de capital de giro.”

---

## 19.10 Regra Final da Engine de Continuidade

Toda análise deve responder implicitamente:

- A empresa consegue sobreviver?
- Por quanto tempo?
- Qual variável ameaça primeiro a continuidade?
- Qual variável pode restaurar estabilidade?
- Existe recuperação possível?
- O risco é operacional, financeiro ou estrutural?

A plataforma deve interpretar continuidade empresarial como fenômeno:

- dinâmico;
- causal;
- temporal;
- estratégico.

---

# 20. Política de Síntese Executiva

Toda análise financeira deve passar obrigatoriamente pela BOARD_SYNTHESIS_ENGINE antes da renderização final.

A plataforma deve:
- detectar causalidade dominante;
- eliminar redundâncias narrativas;
- consolidar engines correlatas;
- reduzir fragmentação interpretativa;
- priorizar leitura institucional;
- apresentar síntese executiva orientada a decisão.

A análise final deve responder prioritariamente:

1. Qual o problema central;
2. O que causa esse problema;
3. Qual o risco dominante;
4. Qual decisão estratégica é necessária;
5. Qual impacto esperado.

---

# 21. Integração com Executive Orchestration

Toda inteligência financeira deve ser organizada em camadas progressivas de leitura executiva.

A plataforma deve separar:

* Executive Summary;
* Executive Intelligence;
* Technical Analytics.

Nenhuma análise pode apresentar:

* excesso de profundidade inicial;
* múltiplas engines simultâneas sem agrupamento;
* detalhamento técnico antes da síntese executiva.


## Contextual Financial Interpretation

Nenhum indicador pode utilizar benchmark fixo.
Toda interpretação depende estritamente de:
- setor;
- intensidade operacional;
- estágio de maturidade;
- intensidade de capital;
- previsibilidade de fluxo;
- dependência de estoque;
- recorrência operacional.

**REGRA DE OURO:** Indicadores isolados não representam inteligência financeira.

Engloba:
- interpretação dinâmica de liquidez;
- interpretação dinâmica de alavancagem;
- interpretação contextual de capital de giro;
- diferenciação clara entre pressão operacional saudável e risco estrutural.
