# INTERCOMPANY ELIMINATION ENGINE (FASE 3)
## Architectural Blueprint & Mathematics

**OBJETIVO DA ENGINE:**
Implementar a primeira camada de eliminação contábil intragrupo da plataforma Illumine. A engine é projetada para remover a dupla contagem financeira originada de mútuos e receitas/despesas cruzadas entre entidades de um mesmo ecossistema (holding, filiais, subsidiárias), evitando a inflação artificial de EBITDA, Caixa e Ativos na visão consolidada.

---

## 1. ESCOPO INICIAL DE ELIMINAÇÃO
Esta engine cobre exclusivamente as seguintes operações intercompany:
*   **Mútuos cruzados**: Ativo (Contas a Receber Intercompany) de uma entidade contrapondo Passivo (Mútuo a Pagar) de outra.
*   **Contas a receber e pagar intragrupo**: Originadas da operação diária.
*   **Receitas e despesas cruzadas**: Por exemplo, *Management Fee* cobrado pela Holding sobre a Filial.
*   **Transferências financeiras internas**: Injeções de capital sem lastro de patrimônio (socorro de caixa).

### Exclusões da Fase 3
O motor operará sob a premissa de consolidação global 100% (Integral). **NÃO SERÃO IMPLEMENTADOS**:
*   Equivalência Patrimonial.
*   Minority Interests (Participações de Não Controladores).
*   Consolidação Proporcional.
*   Hedge Accounting.

---

## 2. REGRAS DE MATCHING
A espinha dorsal da eliminação é a conciliação entre duas peças contábeis teoricamente independentes. O motor classifica as operações em:
*   **Matching Exato (`EXACT_MATCH`)**: O valor reportado na Entidade A corresponde exatamente ao valor contrapartida na Entidade B.
*   **Matching Aproximado (`PROBABLE_MATCH`)**: Existe divergência, mas ela está dentro da Tolerância Percentual (ex: < 1% devido a câmbio ou arredondamento).
*   **Mismatch Material (`LOW_CONFIDENCE_MATCH`)**: Existe a intenção declarada da operação, porém os valores diferem substancialmente. *Requer warning explícito.*
*   **Operação Não Reconhecida (`UNRECONCILED`)**: A Entidade A declara um direito contra a Entidade B, mas a Entidade B não acusa a obrigação. *Bloqueio de eliminação automática.*

---

## 3. CONFIDENCE E GOVERNANÇA DE RECONCILIAÇÃO
O nível de certeza da eliminação afeta a pontuação geral da topologia corporativa.
*   A presença de operações `UNRECONCILED` ou `LOW_CONFIDENCE_MATCH` gera rebaixamento na métrica `eliminationConfidence`.
*   As eliminações de `LOW_CONFIDENCE_MATCH` geram um *warning* obrigatório alertando os executivos de que o EBITDA do grupo pode estar super/subestimado.

---

## 4. SISTEMA DE VIOLATIONS
Cada divergência detectada na varredura cruzada emitirá uma `ConsolidatedViolation`:
1.  **Intercompany Não Conciliado**: Detecção de uma perna vazia no lançamento.
2.  **Diferença Material**: Disparidade de saldos além dos limites toleráveis.
3.  **Duplicidade**: Lançamentos idênticos registrados em contas redundantes.
4.  **Ausência de Contraparte**: O CNPJ referenciado na transação não está incluído no perímetro de consolidação submetido.
5.  **Mismatch Temporal**: Defasagem no reconhecimento do passivo/ativo em meses distintos.

---

## 5. RASTREABILIDADE: LINEAGE & AUDIT TRAIL
A plataforma opera sob a premissa de **Explicabilidade Matemática**.
*   Nenhum número desaparece sem rastro.
*   Toda eliminação recebe um `eliminationId` gerado criptograficamente/sequencialmente.
*   O *Adjustment Trail* guarda: `{ origem, entidadeOrigem, entidadeDestino, contasAfetadas, valorEliminado, saldoRestante }`.
*   A reversibilidade é garantida: é possível recuperar o balanço bruto somando as entradas expurgadas mapeadas no *Audit Trail*.

---

## 6. INTEGRAÇÃO COM O CONSOLIDATED RUNTIME
O ciclo de vida multi-entidade evolui para a seguinte esteira:
1.  **EntityRuntimeExecutor**: Avalia `Entidade A` e `Entidade B` individualmente.
2.  **IntercompanyEliminationEngine**: Cruza os inputs gerados pelo Executor. Procura por lançamentos intercompany, categoriza o *Matching*, aplica a subtração nos valores e emite os logs e violações no `ConsolidatedAdjustmentRegistry`.
3.  **ConsolidatedOutputAssembler**: Monta a saída, que agora será enriquecida pelas eliminações de fato.
4.  *(Futuro) Stress Engine e Advisory*: Consumirão as ineficiências reveladas pelo motor (ex: Mútuos impagáveis inflando NCG).

---

## 7. CONTRATO DO OUTPUT CONSOLIDADO (EXPANDIDO)
A estrutura emitirá as seguintes chaves referentes à Fase 3:
*   `eliminatedEntries`: Coleção de `EliminationAuditTrail` aprovadas.
*   `unreconciledIntercompany`: Operações em *limbo* financeiro.
*   `eliminationConfidence`: Status isolado da máquina de eliminação.
*   `eliminationWarnings`: Avisos não bloqueantes para o CFO/Board.
*   `consolidationAdjustments`: Linha do tempo dos decréscimos matemáticos executados.

---

## 8. CONCLUSÃO
A Fase 3 encerra o papel fundamental de transformar um "agregador simplório" em um verdadeiro **Consolidador Corporativo**. Ao remover as *gorduras intercompany*, a plataforma revela o verdadeiro EBITDA sistêmico e o caixa líquido livre do grupo econômico auditado.
