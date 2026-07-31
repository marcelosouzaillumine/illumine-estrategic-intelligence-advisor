import { SessionContext } from './ExecutiveSessionIntelligence';
import { ExecutiveIdentityContext } from '../../executive-identity-context/src/ExecutiveIdentityContext';
import { TenantIsolationGuard } from './TenantIsolationGuard';

export class ExecutiveBriefingGenerator {
  /**
   * AR-GFC-ERI-005: Persona Consistency & Cognitive Permissions
   * Gera o Briefing cruzando 3 eixos: Persona Executiva + Papel Operacional + Momento da Jornada.
   * Exige Identidade Resolvida (AR-GFC-ERI-007).
   */
  static generateBriefing(identity: ExecutiveIdentityContext, context: SessionContext): string {
    // 1. Identidade não validada = Block
    if (!identity) throw new Error('AR-GFC-ERI-007: Identity Context Requirement failed.');
    
    // 2. Cognitive Permissions Validation
    const { operationalRole, executivePersona } = identity;

    // Default fallbacks if context descriptions are missing (should be caught by AR-GFC-ERI-006)
    const ctx = context.contextDescription || 'Houve uma atualização em seu ambiente.';
    const change = context.changes ? `Foram identificadas ${context.changes} alterações sistêmicas relevantes.` : 'Não há novas alterações registradas.';
    const impact = context.impactDescription || 'Isso pode influenciar seus resultados imediatos.';
    const action = context.potentialAction || 'Recomendo revisar seus dashboards principais.';
    
    // 2.1 Cognitive Permissions Validation por Role
    if (operationalRole === 'ADVISOR' && (ctx.includes('plataforma') || ctx.includes('infraestrutura'))) {
      throw new Error('AR-GFC-ERI-009: Cognitive Permission Violation. Advisor cannot read admin data.');
    }
    if (operationalRole === 'ADMIN' && (ctx.includes('financeiro') || ctx.includes('estratégia'))) {
      throw new Error('AR-GFC-ERI-009: Cognitive Permission Violation. Admin cannot read strategic client data without explicit audit grant.');
    }
    if (operationalRole === 'CLIENT' && (ctx.includes('benchmark privado') || ctx.includes('outros clientes'))) {
      throw new Error('AR-GFC-ERI-009: Cognitive Permission Violation. Client cannot access cross-tenant benchmarks directly.');
    }

    // Pillar 4: Executive Why (Por que importa agora?) - Adaptado via Persona
    let executiveWhy = '';
    
    if (executivePersona === 'CEO') {
      executiveWhy = 'Como líder estratégico, essa movimentação exige sua ciência hoje para garantir o atingimento das metas anuais.';
    } else if (executivePersona === 'CFO') {
      executiveWhy = 'O risco de fluxo de caixa e compliance impõe revisão imediata deste vetor financeiro.';
    } else if (operationalRole === 'ADVISOR') {
      executiveWhy = 'Seus clientes críticos precisam de orientação proativa antes das próximas reuniões de fechamento.';
    } else if (operationalRole === 'ADMIN') {
      executiveWhy = 'A saúde operacional do tenant pode ser afetada se os gargalos não forem resolvidos.';
    } else if (operationalRole === 'CLIENT') {
      executiveWhy = 'Este evento tem o potencial de escalar rapidamente se não for acompanhado de perto.';
    } else if (operationalRole === 'PARTNER') {
      executiveWhy = 'A expansão do ecossistema e o relacionamento entre os elos dependem dessa análise.';
    } else {
      executiveWhy = 'Informação crítica para acompanhamento imediato.';
    }

    // Composição Final (5 Pilares)
    const briefing = `**Contexto:** ${ctx}

**Mudança:** ${change}

**Impacto:** ${impact}

**Atenção Executiva:** ${executiveWhy}

**Próxima Ação:** ${action}`;

    return briefing;
  }
}
