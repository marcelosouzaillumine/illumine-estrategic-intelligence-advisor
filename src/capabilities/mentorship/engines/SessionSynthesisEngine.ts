import Anthropic from '@anthropic-ai/sdk';
import type { MentoringSession, MenteeProfile, OKR, SessionSynthesis } from '../domain';

const client = new Anthropic({
  apiKey: import.meta.env.VITE_ANTHROPIC_API_KEY,
  dangerouslyAllowBrowser: true,
});

export interface SynthesisInput {
  session: Pick<MentoringSession, 'id' | 'sessionNumber' | 'scheduledAt' | 'durationMinutes' | 'notes' | 'agenda'>;
  menteeProfile: Pick<MenteeProfile, 'displayName' | 'developmentContext'>;
  activeOKRs: OKR[];
}

export class SessionSynthesisEngine {
  static async generate(input: SynthesisInput): Promise<SessionSynthesis> {
    const { session, menteeProfile, activeOKRs } = input;

    const mentorNotes = session.notes?.mentorNotes ?? 'Notas do mentor não disponíveis.';
    const menteeNotes = session.notes?.menteeNotes ?? 'Notas do mentorado não disponíveis.';

    const okrContext = activeOKRs.map(okr =>
      `- ${okr.objective} (${okr.overallProgress}%)`
    ).join('\n');

    const prompt = `Você é um motor de síntese de sessões de mentoria da plataforma Illumine.

## Sessão #${session.sessionNumber}
Data: ${new Date(session.scheduledAt).toLocaleDateString('pt-BR')}
Duração: ${session.durationMinutes} minutos
Pauta: ${session.agenda ?? 'Livre'}

## Notas do Mentor
${mentorNotes}

## Notas do Mentorado
${menteeNotes}

## Mentorado
${menteeProfile.displayName} — ${menteeProfile.developmentContext.currentRole}

## OKRs Ativos
${okrContext || 'Sem OKRs ativos.'}

## Tarefa
Sintetize esta sessão de mentoria com:
1. Resumo executivo (3-4 frases sobre o que foi discutido e decidido)
2. Insights chave extraídos da sessão (3-5 insights acionáveis)
3. Ações concretas (quem faz o quê e quando)
4. Progresso nos OKRs mencionados
5. Sugestões para a próxima sessão
6. Score de sentimento e momentum (1-10)

Responda em JSON com esta estrutura exata:
{
  "executiveSummary": "string",
  "keyInsights": ["insight 1", "insight 2", "insight 3"],
  "actionItems": [
    {"description": "string", "owner": "MENTOR|MENTEE", "dueDate": "YYYY-MM-DD ou null"}
  ],
  "okrProgress": ["string descrevendo progresso"],
  "nextSessionSuggestions": ["sugestão 1", "sugestão 2"],
  "sentimentScore": 8
}`;

    const response = await client.messages.create({
      model: 'claude-sonnet-5',
      max_tokens: 1800,
      messages: [{ role: 'user', content: prompt }],
    });

    const content = response.content[0];
    if (content.type !== 'text') throw new Error('UNEXPECTED_RESPONSE_TYPE');

    const jsonMatch = content.text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('INVALID_JSON_RESPONSE');

    const parsed = JSON.parse(jsonMatch[0]);

    return {
      generatedAt: new Date().toISOString(),
      executiveSummary: parsed.executiveSummary,
      keyInsights: parsed.keyInsights,
      actionItems: parsed.actionItems.map((a: { description: string; owner: string; dueDate?: string }) => ({
        description: a.description,
        owner: a.owner as 'MENTOR' | 'MENTEE',
        dueDate: a.dueDate ?? undefined,
      })),
      okrProgress: parsed.okrProgress,
      nextSessionSuggestions: parsed.nextSessionSuggestions,
      sentimentScore: Number(parsed.sentimentScore),
    };
  }
}
