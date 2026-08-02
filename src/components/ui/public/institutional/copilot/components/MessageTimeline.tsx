import { useEffect, useRef, Fragment } from 'react';
import { CopilotMessage } from '../types';
import { ArrowRight, MessageSquare, Sparkles, Loader2, CheckCircle2, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface MessageTimelineProps {
  messages: CopilotMessage[];
  isTyping: boolean;
  onSelectOption: (msgId: string, optionId: string, value?: any) => void;
}

export function MessageTimeline({ messages, isTyping, onSelectOption }: MessageTimelineProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isTyping) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [isTyping]);

  return (
    <div className="p-5 bg-[#050506] flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-5 font-sans">
      {messages.map((msg) => (
        <Fragment key={msg.id}>
          {msg.type === 'bot' && (
            <div className="shrink-0 bg-[#121214] border border-white/5 rounded-2xl p-4 rounded-tl-none animate-in fade-in slide-in-from-bottom-2 duration-500 shadow-sm max-w-[90%]">
              <p className="text-[13px] md:text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
                {msg.content}
              </p>
            </div>
          )}

          {msg.type === 'user' && (
            <div className="shrink-0 bg-amber-500/10 border border-amber-500/20 text-amber-500 rounded-2xl p-3 px-4 rounded-tr-none self-end max-w-[85%] animate-in fade-in slide-in-from-bottom-2 duration-300 shadow-sm">
              <p className="text-[13px] md:text-sm font-medium">{msg.content}</p>
            </div>
          )}

          {msg.options && msg.options.length > 0 && (
            <div className="shrink-0 flex flex-col gap-2 mt-1 animate-in fade-in duration-300">
              {msg.options.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => onSelectOption(msg.id, opt.id, opt.value)}
                  className="text-left w-full p-3 md:p-3.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors text-[13px] md:text-sm font-medium text-amber-500/90 hover:text-amber-400 flex items-center justify-between group shadow-sm"
                >
                  <span>{opt.label}</span>
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                </button>
              ))}
            </div>
          )}
          
          {msg.type === 'insight' && (
            <div className="shrink-0 bg-transparent border-l-2 border-amber-500 pl-4 py-1 my-2 animate-in fade-in duration-500">
              <p className="text-[13px] md:text-sm text-slate-400 font-medium leading-relaxed italic">
                {msg.content}
              </p>
            </div>
          )}

          {msg.type === 'summary' && (
            <div className="shrink-0 bg-[#121214] border border-white/5 rounded-2xl p-4 animate-in fade-in duration-500 shadow-sm w-full relative overflow-hidden">
               <div className="absolute top-0 left-0 w-1 h-full bg-blue-500/50" />
               <p className="text-[13px] md:text-sm text-slate-300 font-medium leading-relaxed">
                 {msg.content}
               </p>
            </div>
          )}

          {msg.type === 'advisor_card' && (
            <div className="shrink-0 bg-[#121214] border border-white/10 rounded-2xl overflow-hidden animate-in fade-in duration-500 shadow-lg w-full mt-2">
              <div className="p-4 border-b border-white/5 bg-black/40">
                <h4 className="text-white font-bold text-sm mb-1">{msg.content}</h4>
                <p className="text-[11px] text-slate-400">Utilize a Executive Intelligence Platform para ampliar sua prática.</p>
              </div>
              <div className="p-4 bg-white/[0.02]">
                <ul className="space-y-2.5">
                  {['Executive Copilot™', 'Executive Intelligence™', 'Frameworks proprietários', 'Memória institucional', 'Executive Assessment™', 'Certificação'].map(benefit => (
                    <li key={benefit} className="flex items-center gap-2.5 text-[12px] text-slate-300">
                      <CheckCircle2 size={12} className="text-amber-500" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {msg.type === 'cta' && (
            <div className="shrink-0 flex flex-col gap-3 mt-4 animate-in fade-in duration-500">
              {msg.content && (
                <p className="text-[12px] text-slate-400 text-center px-4 leading-relaxed">
                  {msg.content}
                </p>
              )}
              {msg.ctas && (
                <div className="space-y-2 mt-2">
                  {msg.ctas.map((cta, idx) => (
                    cta.href?.startsWith('http') ? (
                      <a 
                        key={idx}
                        href={cta.href} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className={`w-full flex items-center justify-between p-3.5 rounded-xl border transition-all group shadow-sm
                          ${cta.primary 
                            ? 'border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-amber-500' 
                            : 'border-white/10 bg-white/5 hover:bg-white/10 text-white'
                          }`}
                      >
                        <div className="flex items-center gap-3">
                          {cta.primary ? <Sparkles className="w-4 h-4" /> : <MessageSquare className="w-4 h-4 text-slate-400" />}
                          <span className="text-[13px] font-semibold">{cta.label}</span>
                        </div>
                        <ChevronRight className={`w-4 h-4 ${cta.primary ? 'text-amber-500/50 group-hover:text-amber-500 group-hover:translate-x-1' : 'text-slate-500 group-hover:text-white group-hover:translate-x-1'} transition-all`} />
                      </a>
                    ) : (
                      <Link 
                        key={idx}
                        to={cta.href || '#'}
                        onClick={cta.onClick}
                        className={`w-full flex items-center justify-between p-3.5 rounded-xl border transition-all group shadow-sm
                          ${cta.primary 
                            ? 'border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-amber-500' 
                            : 'border-white/10 bg-white/5 hover:bg-white/10 text-white'
                          }`}
                      >
                        <div className="flex items-center gap-3">
                          {cta.primary ? <Sparkles className="w-4 h-4" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
                          <span className="text-[13px] font-semibold">{cta.label}</span>
                        </div>
                        <ArrowRight className={`w-4 h-4 ${cta.primary ? 'text-amber-500/50 group-hover:text-amber-500 group-hover:translate-x-1' : 'text-slate-500 group-hover:text-white group-hover:translate-x-1'} transition-all`} />
                      </Link>
                    )
                  ))}
                </div>
              )}
            </div>
          )}
        </Fragment>
      ))}

      {isTyping && (
        <div className="bg-[#121214] border border-white/5 rounded-2xl p-4 rounded-tl-none self-start w-16 animate-in fade-in duration-300">
          <Loader2 className="w-4 h-4 text-slate-500 animate-spin" />
        </div>
      )}
      
      <div ref={bottomRef} />
    </div>
  );
}
