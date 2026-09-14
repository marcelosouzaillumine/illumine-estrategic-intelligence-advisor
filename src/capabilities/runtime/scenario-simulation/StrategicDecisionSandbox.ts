import {
  SimulationInput,
  SimulationOutput,
  SandboxConfig,
  SandboxResult
} from './types';
import { ScenarioMacroProjectionEngine } from './ScenarioMacroProjectionEngine';

export class StrategicDecisionSandbox {
  /**
   * Executa uma simulação de sandbox estratégico aplicando modificadores sobre
   * dados clonados temporários em memória. Nenhuma persistência ocorre.
   */
  public static executeSandbox(
    input: SimulationInput,
    actions: SandboxConfig[]
  ): SandboxResult {
    // 1. Postura Fail-Closed e Validação de Inquilino
    if (!input.tenantId || input.tenantId.trim() === '') {
      throw new Error('FAIL_CLOSED: Sandbox estratégico exige um tenantId válido e isolado.');
    }
    if (!input.lineageHash || !input.correlationId) {
      throw new Error('FAIL_CLOSED: Sandbox estratégico exige lineageHash e correlationId para auditoria.');
    }

    const generatedAt = new Date().toISOString();

    // 2. Clone profundo dos inputs para garantir isolamento e não-mutação
    const clonedInput: SimulationInput = JSON.parse(JSON.stringify(input));

    // 3. Obter output original de linha de base
    const originalOutput = ScenarioMacroProjectionEngine.run(input);

    // 4. Aplicar modificadores de decisão sobre as variáveis contábeis e de governança clonadas
    for (const action of actions) {
      const intensity = Math.min(1.0, Math.max(0.0, action.intensity));

      switch (action.actionType) {
        case 'HIRING_FREEZE':
          // Congelamento de contratações: reduz despesas fixas e estabiliza custos
          if (clonedInput.baseFinancials.despesasFixas) {
            clonedInput.baseFinancials.despesasFixas -= (clonedInput.baseFinancials.despesasFixas * 0.08 * intensity);
          }
          // Reduz anomalias futuras simuladas
          clonedInput.historicalCycles = clonedInput.historicalCycles.map(c => ({
            ...c,
            anomaliesCount: Math.max(0, c.anomaliesCount - Math.round(1 * intensity))
          }));
          break;

        case 'DEBT_INCREASE':
          // Captação de dívida: aumenta caixa imediato, mas eleva despesas fixas (juros) e anomalias de risco
          if (clonedInput.baseFinancials.caixaEquivalentes) {
            clonedInput.baseFinancials.caixaEquivalentes += (clonedInput.baseFinancials.caixaEquivalentes * 0.3 * intensity);
          } else {
            clonedInput.baseFinancials.caixaEquivalentes = 100000 * intensity;
          }
          if (clonedInput.baseFinancials.despesasFixas) {
            clonedInput.baseFinancials.despesasFixas += (clonedInput.baseFinancials.despesasFixas * 0.12 * intensity);
          }
          break;

        case 'SUPPLIER_CONCENTRATION':
          // Concentração em fornecedores: reduz custos variáveis (escala), mas aumenta violações de compliance (dependência)
          if (clonedInput.baseFinancials.custosVar) {
            clonedInput.baseFinancials.custosVar -= (clonedInput.baseFinancials.custosVar * 0.05 * intensity);
          }
          clonedInput.historicalCycles = clonedInput.historicalCycles.map(c => ({
            ...c,
            violationsCount: c.violationsCount + Math.round(2 * intensity)
          }));
          break;

        case 'RESTRUCTURING':
          // Reestruturação operacional: reduz drasticamente despesas, mas causa anomalias de ciclo imediato
          if (clonedInput.baseFinancials.despesasFixas) {
            clonedInput.baseFinancials.despesasFixas -= (clonedInput.baseFinancials.despesasFixas * 0.15 * intensity);
          }
          clonedInput.historicalCycles = clonedInput.historicalCycles.map(c => ({
            ...c,
            anomaliesCount: c.anomaliesCount + Math.round(3 * intensity)
          }));
          break;

        case 'EXPANSION':
          // Expansão comercial: aumenta receita, mas queima caixa circulante imediato
          if (clonedInput.baseFinancials.receitaLiquida) {
            clonedInput.baseFinancials.receitaLiquida += (clonedInput.baseFinancials.receitaLiquida * 0.2 * intensity);
          }
          if (clonedInput.baseFinancials.caixaEquivalentes) {
            clonedInput.baseFinancials.caixaEquivalentes -= (clonedInput.baseFinancials.caixaEquivalentes * 0.15 * intensity);
          }
          break;

        case 'OPERATIONAL_CONTRACTION':
          // Contração operacional: reduz escala, diminui receita e despesas fixas, preserva caixa
          if (clonedInput.baseFinancials.receitaLiquida) {
            clonedInput.baseFinancials.receitaLiquida -= (clonedInput.baseFinancials.receitaLiquida * 0.1 * intensity);
          }
          if (clonedInput.baseFinancials.despesasFixas) {
            clonedInput.baseFinancials.despesasFixas -= (clonedInput.baseFinancials.despesasFixas * 0.12 * intensity);
          }
          break;
      }
    }

    // 5. Executar simulação sobre o input modificado
    const simulatedOutput = ScenarioMacroProjectionEngine.run(clonedInput);

    // 6. Calcular o delta de stress (score simulado - score original)
    const stressDelta = simulatedOutput.projectedDeterioration.score - originalOutput.projectedDeterioration.score;

    // 7. Adicionar marcações fiduciárias de SANDBOX
    simulatedOutput.assumptions.unshift('ESTE É UM RELATÓRIO DE SANDBOX. Modificadores artificiais foram aplicados em memória.');
    simulatedOutput.limitations.unshift('Dados de saída simulados não representam o estado real e persistente do inquilino.');

    return {
      isSandbox: true,
      appliedActions: actions,
      originalOutput,
      simulatedOutput,
      stressDelta,
      generatedAt
    };
  }
}
