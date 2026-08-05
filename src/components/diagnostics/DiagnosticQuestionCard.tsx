import React, { useState } from 'react';
import { DiagnosticQuestion, DiagnosticOption } from '../../intelligence/diagnostics/core/diagnostic-contracts';

interface DiagnosticQuestionCardProps {
  question: DiagnosticQuestion;
  onOptionSelected: (optionId: string) => void;
}

export function DiagnosticQuestionCard({ question, onOptionSelected }: DiagnosticQuestionCardProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleSelect = (option: DiagnosticOption) => {
    setSelectedId(option.id);
    // Add a slight delay to allow the user to see the selection state before advancing
    setTimeout(() => {
      onOptionSelected(option.id);
    }, 400);
  };

  return (
    <div className="w-full max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-2xl font-light text-white mb-8 leading-relaxed">
        {question.text}
      </h2>

      <div className="space-y-3">
        {question.options.map((option) => {
          const isSelected = selectedId === option.id;
          
          return (
            <button
              key={option.id}
              onClick={() => handleSelect(option)}
              disabled={selectedId !== null}
              className={`w-full text-left p-5 rounded-xl border transition-all duration-300 flex items-center gap-4 group ${
                isSelected 
                  ? 'bg-amber-500/10 border-amber-500/50 text-white' 
                  : 'bg-[#121214] border-white/5 text-slate-300 hover:bg-[#1A1A1D] hover:border-white/10 disabled:opacity-50'
              }`}
            >
              <div className={`w-5 h-5 rounded-full border flex-shrink-0 flex items-center justify-center transition-colors ${
                isSelected ? 'border-amber-500 bg-amber-500' : 'border-slate-600 group-hover:border-slate-500'
              }`}>
                {isSelected && <div className="w-2 h-2 rounded-full bg-black" />}
              </div>
              <span className="text-sm font-medium leading-relaxed">
                {option.text}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
