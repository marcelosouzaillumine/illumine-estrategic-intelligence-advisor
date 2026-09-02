import Anthropic from '@anthropic-ai/sdk';
import type { MentoringSession, MenteeProfile, OKR, SessionPreBrief } from '../domain';

const client = new Anthropic({
  apiKey: import.meta.env.VITE_ANTHROPIC_API_KEY,
  dangerouslyAllowBrowser: true,
});

export interface PreBriefInput {
  session: Pick<MentoringSession, 'id' | 'sessionNumber' | 'agenda' | 'scheduledAt' | 'durationMinutes' | 'format'>;
  menteeProfile: Pick<MenteeProfile, 'displayName' | 'bio' | 'developmentContext'>;
  activeOKRs: OKR[];
  lastSession?: Pick<MentoringSession, 'synthesis'>;
}

export class PreBriefEngine {
  static async generate(input: PreBriefInput): Promise<SessionPreBrief> {
    const { session, menteeProfile, activeOKRs, lastSession } = input;

    const okrContext = activeOKRs.map(okr =>
      `- ${okr.objective} (${okr.overallProgress}% progresso)\n` +
      okr.keyResults.map(kr => `  • ${kr.description}: ${kr.currentValue}/${kr.targetValue} ${kr.unit ?? ''}`).join('\n')
    ).join('\n');

    const lastSummary = lastSession?.synthesis?.executiveSummary ?? 'Primeira sessão do par.';
    const lastActions = lastSession?.synthesis?.actionItems
      ?.map(a => `• [${a.owner}] ${a.description}`)
      .join('\n') ?? '';

    const prompt = `Você é um motor de inteligência para mentoria executiva da plataforma Illumine.

## Contexto do Mentorado
Nome: ${menteeProfile.displayName}
Cargo: ${menteeProfile.developmentContext.currentRole}
Setor: ${menteeProfile.developmentContext.industry}
Estágio: ${menteeProfile.developmentContext.careerStage}
Desafio central: ${menteeProfile.developmentContext.biggestChallenge}
Áreas prioritárias: ${menteeProfile.developmentContext.priorityAreas.join(', ')}
Objetivos de desenvolvimento: ${menteeProfile.developmentContext.developmentGoals.join('; ')}

## OKRs Ativos
${okrContext || 'Nenhum OKR cadastrado ainda.'}

## Última Sessão
Resumo: ${lastSummary}
Ações pendentes:
${lastActions || 'Nenhuma ação pendente registrada.'}

## Sessão Atual
Número: #${session.sessionNumber}
Data: ${new Date(session.scheduledAt).toLocaleDateString('pt-BR')}
Duração: ${session.durationMinutes} minutos
Formato: ${session.format}
Pauta proposta: ${session.agenda ?? 'Sem pauta definida'}

## Tarefa
Gere um Pre-Brief executivo e objetivo para o MENTOR, com:
1. Contexto do mentorado em 3 parágrafos concisos
2. 3-5 tópicos sugeridos para a sessão (priorizados por relevância estratégica)
3. Status dos OKRs abertos que merecem atenção
4. Dicas de preparação específicas para este mentor nesta sessão
5. Resumo da sessão anterior

Responda em JSON com esta estrutura exata:
{
  "menteeContext": "string com 3 parágrafos",
  "suggestedTopics": ["tópico 1", "tópico 2", "tópico 3"],
  "openOKRs": ["OKR status 1", "OKR status 2"],
  "lastSessionSummary": "string",
  "preparationTips": ["dica 1", "dica 2", "dica 3"]
}`;

    const response = await client.messages.create({
      model: 'claude-sonnet-5',
      max_tokens: 1500,
      messages: [{ role: 'user', content: prompt }],
    });

    const content = response.content[0];
    if (content.type !== 'text') throw new Error('UNEXPECTED_RESPONSE_TYPE');

    const jsonMatch = content.text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('INVALID_JSON_RESPONSE');

    const parsed = JSON.parse(jsonMatch[0]);

    return {
      generatedAt: new Date().toISOString(),
      menteeContext: parsed.menteeContext,
      suggestedTopics: parsed.suggestedTopics,
      openOKRs: parsed.openOKRs,
      lastSessionSummary: parsed.lastSessionSummary,
      preparationTips: parsed.preparationTips,
    };
  }
}
