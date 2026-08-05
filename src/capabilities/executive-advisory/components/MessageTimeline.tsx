import { useEffect, useRef, Fragment, useState } from 'react';
import { AdvisoryMessage } from '../types/advisory.types';
import { ArrowRight, MessageSquare, Sparkles, Loader2, CheckCircle2, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ExecutiveBriefCard } from './ExecutiveBriefCard';

interface MessageTimelineProps {
  messages: AdvisoryMessage[];
  isTyping: boolean;
  thinkingText?: string | null;
  onSelectOption: (msgId: string, optionId: string, value?: any) => void;
}

export function MessageTimeline({ messages, isTyping, thinkingText, onSelectOption }: MessageTimelineProps) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const prevMessagesLength = useRef(messages.length);
  const [isScrolledUp, setIsScrolledUp] = useState(false);
  const [showNewMessageAlert, setShowNewMessageAlert] = useState(false);

  const calculateReadingDelay = (text: string | any) => {
    if (typeof text !== 'string') return 1500;
    const baseFactor = 30; // 30ms per char
    return Math.min(Math.max(text.length * baseFactor, 1500), 4000);
  };

  const handleScroll = () => {
    if (!containerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    const isUp = scrollHeight - scrollTop - clientHeight > 100;
    setIsScrolledUp(isUp);
    if (!isUp) {
      setShowNewMessageAlert(false);
    }
  };

  useEffect(() => {
    if (messages.length > prevMessagesLength.current) {
      if (isScrolledUp) {
        setShowNewMessageAlert(true);
      } else {
        const newMsgCount = messages.length - prevMessagesLength.current;
        const firstNewMsg = messages[messages.length - newMsgCount];
        
        if (firstNewMsg && containerRef.current) {
          setTimeout(() => {
            const el = document.getElementById(`msg-${firstNewMsg.id}`);
            if (el && containerRef.current) {
              const targetTop = el.offsetTop - 60; // Leave 60px of context from previous messages
              containerRef.current.scrollTo({ top: targetTop, behavior: 'smooth' });
            } else {
              bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
          }, 50);
        } else {
          bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }
    }
    prevMessagesLength.current = messages.length;
  }, [messages.length, isScrolledUp]);

  // 5. Scroll happens only once when new messages are added,
  // since height is pre-allocated and doesn't change on phase transitions.

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    setShowNewMessageAlert(false);
  };

  const handleOptionClick = (msgId: string, optId: string, value?: any) => {
    scrollToBottom();
    onSelectOption(msgId, optId, value);
  };

  return (
    <div 
      ref={containerRef}
      onScroll={handleScroll}
      className="p-5 bg-[#050506] flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-5 font-sans relative"
    >
      {messages.map((msg) => (
        <Fragment key={msg.id}>
          {msg.role === 'executive' ? (
            <div id={`msg-${msg.id}`} className="shrink-0 bg-amber-500/10 border border-amber-500/20 text-amber-500 rounded-2xl p-3 px-4 rounded-tr-none self-end max-w-[85%] animate-in fade-in slide-in-from-bottom-2 duration-300 shadow-sm">
              <p className="text-[13px] md:text-sm font-medium">{msg.content}</p>
            </div>
          ) : (
            <div id={`msg-${msg.id}`} className="relative w-full flex flex-col gap-2">
              <div 
                className={`transition-opacity duration-500 flex flex-col gap-2 ${
                  msg.phase === 'queued' || msg.phase === 'thinking' ? 'opacity-0' : 'opacity-100'
                }`}
              >
                {msg.type === 'bot' && (
                  <div className="shrink-0 bg-[#121214] border border-white/5 rounded-2xl p-4 rounded-tl-none shadow-sm max-w-[90%]">
                    <p className="text-[13px] md:text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
                      {msg.content}
                    </p>
                  </div>
                )}

                {msg.type === 'insight' && (
                  <div className="shrink-0 bg-transparent border-l-2 border-amber-500 pl-4 py-1 my-2">
                    <p className="text-[13px] md:text-sm text-slate-400 font-medium leading-relaxed italic">
                      {msg.content}
                    </p>
                  </div>
                )}

                {msg.type === 'summary' && (
                  <div className="shrink-0 bg-[#121214] border border-white/5 rounded-2xl p-4 shadow-sm w-full relative overflow-hidden">
                     <div className="absolute top-0 left-0 w-1 h-full bg-blue-500/50" />
                     <p className="text-[13px] md:text-sm text-slate-300 font-medium leading-relaxed">
                       {msg.content}
                     </p>
                  </div>
                )}

                {msg.type === 'executive_brief' && (
                  <ExecutiveBriefCard content={msg.content} ctas={msg.ctas} />
                )}

                {msg.type === 'advisor_card' && (
                  <div className="shrink-0 bg-[#121214] border border-white/10 rounded-2xl overflow-hidden shadow-lg w-full mt-2">
                    <div className="p-4 border-b border-white/5 bg-black/40">
                      <h4 className="text-white font-bold text-sm mb-1">{msg.content}</h4>
                      <p className="text-[11px] text-slate-400">Utilize a Executive Intelligence Platform para ampliar sua prática.</p>
                    </div>
                    <div className="p-4 bg-white/[0.02]">
                      <ul className="space-y-2.5">
                        {['Executive Advisory™', 'Executive Intelligence™', 'Frameworks proprietários', 'Memória institucional', 'Executive Assessment™', 'Certificação'].map(benefit => (
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
                  <div className="shrink-0 flex flex-col gap-3 mt-4">
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

                {msg.options && msg.options.length > 0 && (
                  <div className={`shrink-0 flex flex-col gap-2 mt-1 transition-all duration-700 ${
                    msg.phase === 'completed' || !msg.phase 
                      ? 'opacity-100 translate-y-0' 
                      : 'opacity-0 translate-y-2 pointer-events-none'
                  }`}>
                    {msg.options.map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => handleOptionClick(msg.id, opt.id, opt.value)}
                        className="text-left w-full p-3 md:p-3.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors text-[13px] md:text-sm font-medium text-amber-500/90 hover:text-amber-400 flex items-center justify-between group shadow-sm"
                      >
                        <span>{opt.label}</span>
                        <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {(msg.phase === 'queued' || msg.phase === 'thinking') && (
                <div className="absolute top-0 left-0 bg-[#121214] border border-white/5 rounded-2xl p-4 rounded-tl-none shadow-sm min-w-[60px] z-10 animate-in fade-in duration-300">
                  {thinkingText && (
                    <span className="text-[11px] text-amber-500/80 font-medium italic animate-pulse whitespace-nowrap block mb-2">{thinkingText}</span>
                  )}
                  <div className="flex items-center gap-1.5 py-1">
                    <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce"></span>
                  </div>
                </div>
              )}
            </div>
          )}
        </Fragment>
      ))}
      
      <div ref={bottomRef} />

      {showNewMessageAlert && (
        <div className="sticky bottom-2 flex justify-center animate-in slide-in-from-bottom-2 z-10 w-full pointer-events-none">
          <button 
            onClick={scrollToBottom}
            className="pointer-events-auto bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/30 text-amber-500 text-[11px] font-bold uppercase tracking-wider py-1.5 px-4 rounded-full shadow-lg flex items-center gap-2 backdrop-blur-sm transition-all"
          >
            Nova análise disponível
            <ArrowRight className="w-3 h-3 rotate-90" />
          </button>
        </div>
      )}
    </div>
  );
}
