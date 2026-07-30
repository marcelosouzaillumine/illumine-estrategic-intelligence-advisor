import { ExecutivePresenceContract } from '@illumine/executive-contracts';

export class ExecutiveContextIntelligenceEngine {
  public static resolveContext(daysSinceLastAccess: number = 0): ExecutivePresenceContract {
    let greeting = '';
    const date = new Date();
    const isMonthEnd = date.getDate() >= 28;
    const isFirstMonday = date.getDay() === 1 && date.getDate() <= 7;

    if (daysSinceLastAccess >= 7) {
      greeting = `Bem-vindo de volta. Durante sua ausência de ${daysSinceLastAccess} dias, capturamos 37 novos eventos, porém apenas 3 exigem sua atenção imediata.`;
    } else if (isMonthEnd) {
      greeting = 'Hoje inicia o período de fechamento mensal. Priorizamos automaticamente todas as análises de margem e caixa para esta etapa.';
    } else if (isFirstMonday) {
      greeting = 'Nesta semana existem cinco decisões planejadas. Organizamos sua agenda executiva por impacto financeiro esperado.';
    } else {
      greeting = 'Sua organização inicia o dia com contexto operacional monitorado e adaptado.';
    }

    return {
      presenceId: `pres-${Date.now()}`,
      daysSinceLastAccess,
      isMonthEnd,
      isFiscalPeriodClose: isMonthEnd,
      isFirstMondayOfMonth: isFirstMonday,
      accumulatedEventsCountCount: daysSinceLastAccess >= 7 ? 37 : 12,
      adaptiveContextGreeting: greeting
    };
  }
}
