# Protocolo de Entrega Executiva (Executive Delivery Protocol)

Este documento define os princípios fiduciários e a arquitetura de apresentação de relatórios executivos e Board Packs na plataforma Illumine.

## Princípios de Entrega Fiduciária

1. **Doutrina Passiva Absoluta**: A camada de visualização (UI) e de empacotamento (Export Engines) é estritamente passiva. Ela consome dados pré-calculados do Core Runtime (`ExecutiveIntelligenceReport`). É proibido recalcular scores, reclassificar severidades ou reordenar prioridades com base em regras de negócio locais.
2. **Lineage e Auditoria Contínuas**: Todas as exportações devem carregar o `ExportSnapshotMetadata` contendo hashes de lineage e metadados de calibração ativa para fins de compliance regulatório.
3. **Restrição às Supressões**: Alertas do sistema e modos degradados do runtime não podem ser ocultados ou suprimidos pela camada de visualização, garantindo transparência fiduciária completa aos membros do conselho.

## Sequenciamento Oficial de Apresentação

O sequenciamento padrão executado pelo `ExecutiveDeliveryOrchestrator` é:
1. `SUMMARY` (Visão geral de saúde contábil-financeira)
2. `PRIORITIES` (Foco estratégico mapeado pelo core)
3. `FINANCIAL_HEALTH` (Decomposição detalhada dos scores)
4. `CAUSALITY` (Causas contábeis-raiz)
5. `STRESS_PROPAGATION` (Vulnerabilidades e buffers)
6. `SCENARIOS` (Simulações de projeções)
7. `RISKS` (Mapa de riscos críticos e secundários)
8. `ACTION_FOCUS` (Mitigações prioritárias)
9. `BOARD_CONCLUSION` (Rastreabilidade, assinaturas e lineage)
