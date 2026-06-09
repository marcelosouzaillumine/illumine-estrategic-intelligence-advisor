import { ExecutionBudgetGovernor } from '../core/runtime/budget/ExecutionBudgetGovernor';

function runExplosionTest() {
  console.log('Iniciando Scenario Explosion Test...');

  const isAllowed = ExecutionBudgetGovernor.enforceBudget({ maxScenarios: 1000 });
  
  if (isAllowed) {
    console.error('❌ CRITICAL: Execution Budget permitiu explosão de cenários!');
    process.exit(1);
  }

  console.log('✅ Budget Governor bloqueou explosão combinatória com sucesso.');
}

runExplosionTest();
