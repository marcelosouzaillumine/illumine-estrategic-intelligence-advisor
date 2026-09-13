import React from 'react';

// Apenas um componente de view para iterar sobre mensagens efêmeras, já que
// o estado viverá localmente no CopilotPage (como array de objetos).
// Não teremos store global ou persistência aqui no MVP para não vazar memórias.

export function CopilotSessionHistory({ messages }: { messages: { role: string; content: string }[] }) {
  if (messages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
        <p className="text-sm">Nenhuma conversa ativa.</p>
        <p className="text-xs mt-1">Faça uma pergunta governada sobre a instituição.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {messages.map((m, i) => (
        <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
          <div className={`max-w-[80%] rounded-xl p-4 text-sm ${m.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-surface-container border border-border text-foreground'}`}>
            {m.content}
          </div>
        </div>
      ))}
    </div>
  );
}
