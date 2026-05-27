# Perfis de Comunicação Executiva (Executive Communication Profiles)

Para adaptar a exibição de dados complexos para diferentes públicos sem comprometer as regras fiduciárias do core, o sistema disponibiliza perfis de preferências de visualização.

## Perfis Suportados

1. **CEO_PROFILE**:
   - Foco primário: Destaques Estratégicos (KPIs e eficiências)
   - Densidade de tabelas: Média
   - Verbocidade narrativa: Sumário estruturado

2. **BOARD_PROFILE** (Conselho):
   - Foco primário: Destaques Estratégicos e Mitigações
   - Densidade de tabelas: Baixa (foco visual premium)
   - Verbocidade narrativa: Concisa (primeiros parágrafos)

3. **INVESTOR_PROFILE** (Acionistas/Investidores):
   - Foco primário: Métricas financeiras puras e liquidez
   - Densidade de tabelas: Média
   - Verbocidade narrativa: Sumário estruturado

4. **ADVISOR_PROFILE** (Conselheiros/Consultores técnicos):
   - Foco primário: Causalidade contábil e causas-raiz
   - Densidade de tabelas: Alta (maior nível de detalhes)
   - Verbocidade narrativa: Detalhada

5. **OPERATIONAL_PROFILE** (Membros operacionais):
   - Foco primário: Status de contas individuais e performance
   - Densidade de tabelas: Alta
   - Verbocidade narrativa: Detalhada

## Regras Importantes de Visualização

- Todos os perfis utilizam o mesmo `ExecutiveIntelligenceReport` de forma idêntica.
- Nenhuma métrica financeira é recalculada ou ocultada devido ao perfil.
- Os perfis governam exclusivamente a formatação narrativa e densidade da interface.
