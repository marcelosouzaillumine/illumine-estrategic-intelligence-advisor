import test from 'node:test';
import assert from 'node:assert';
import { CausalRegistry, PanelIntent } from '../../core/runtime/dre/DreSemanticRegistry';

test('DRE Causal Driver Alignment Contract', async (t) => {
  await t.test('Critical severity drivers should never map to positive/expansion recommendations', () => {
    const criticalDrivers = CausalRegistry.filter(c => c.severity === 'UNSUSTAINABLE');
    
    for (const driver of criticalDrivers) {
      const lowerRec = driver.recommendedAction.toLowerCase();
      // Não pode haver recomendações de expansão em cenários críticos.
      assert.ok(!lowerRec.includes('acelerar expansão'), `CRITICAL driver has invalid recommendation: ${driver.recommendedAction}`);
      assert.ok(!lowerRec.includes('maximizar volume'), `CRITICAL driver has invalid recommendation: ${driver.recommendedAction}`);
      assert.ok(!lowerRec.includes('aplicar excedente'), `CRITICAL driver has invalid recommendation: ${driver.recommendedAction}`);
      assert.ok(!lowerRec.includes('tese de crescimento'), `CRITICAL driver has invalid recommendation: ${driver.recommendedAction}`);
    }
  });

  await t.test('Weak/Warning severity drivers should focus on restructuring or cost control', () => {
    const weakDrivers = CausalRegistry.filter(c => c.severity === 'PRESSURIZED');
    for (const driver of weakDrivers) {
      const lowerRec = driver.recommendedAction.toLowerCase();
      assert.ok(!lowerRec.includes('acelerar decisões comerciais e otimizar'), `WEAK driver has invalid recommendation: ${driver.recommendedAction}`);
      assert.ok(!lowerRec.includes('solidez confirmada em escala'), `WEAK driver has invalid causalCore: ${driver.causalCore}`);
    }
  });
  
  await t.test('Strong severity drivers should not suggest immediate cost reduction or contingency', () => {
    const strongDrivers = CausalRegistry.filter(c => c.severity === 'STRONG');
    
    for (const driver of strongDrivers) {
      const lowerRec = driver.recommendedAction.toLowerCase();
      assert.ok(!lowerRec.includes('interromper linhas operacionais'), `STRONG driver has invalid recommendation: ${driver.recommendedAction}`);
      assert.ok(!lowerRec.includes('desidratar custos fixos imediatamente'), `STRONG driver has invalid recommendation: ${driver.recommendedAction}`);
      assert.ok(!lowerRec.includes('reestruturação operacional e controle de eficiência em caráter prioritário'), `STRONG driver has invalid recommendation: ${driver.recommendedAction}`);
    }
  });
});
