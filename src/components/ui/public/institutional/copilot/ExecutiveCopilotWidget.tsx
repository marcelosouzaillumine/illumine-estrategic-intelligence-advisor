import { useState, useEffect } from 'react';
import { MessageSquare, X, Sparkles, ChevronLeft } from 'lucide-react';
import { useConversationEngine } from './ConversationEngine';
import { MessageTimeline } from './components/MessageTimeline';

export function ExecutiveCopilotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const engine = useConversationEngine();

  // Show the FAB after a short delay
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  // Initialize the engine only when opened for the first time
  const { initialize } = engine;
  useEffect(() => {
    if (isOpen) {
      initialize();
    }
  }, [isOpen, initialize]);

  const handleReset = () => {
    engine.reset();
    setTimeout(() => {
      engine.initialize();
    }, 100);
  };

  if (!isVisible) return null;

  const showBackButton = engine.messages.length > 1;

  return (
    <div className="fixed bottom-6 right-6 z-[1000] font-sans flex flex-col items-end">
      
      {/* Popover */}
      <div 
        className={`mb-4 w-[340px] md:w-[380px] bg-[#0A0A0B] border border-white/10 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden transition-all duration-500 origin-bottom-right flex flex-col h-[550px] max-h-[80vh] ${
          isOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-90 opacity-0 translate-y-8 pointer-events-none'
        }`}
      >
        {/* Header */}
        <div className="p-4 border-b border-white/5 bg-[#121214] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            {showBackButton ? (
              <button onClick={handleReset} className="text-slate-500 hover:text-white transition-colors p-1">
                <ChevronLeft size={18} />
              </button>
            ) : (
              <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center">
                <Sparkles className="text-amber-500 w-4 h-4" />
              </div>
            )}
            <div>
              <h4 className="text-white font-bold text-sm">Illumine Copilot</h4>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                {engine.isTyping ? 'Analisando...' : 'Executive Concierge'}
              </p>
            </div>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="text-slate-500 hover:text-white transition-colors p-1"
          >
            <X size={18} />
          </button>
        </div>
        
        {/* Chat Timeline */}
        <MessageTimeline 
          messages={engine.messages} 
          isTyping={engine.isTyping} 
          onSelectOption={engine.handleUserSelect}
        />
        
      </div>

      {/* FAB Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-500 shadow-[0_0_30px_rgba(245,158,11,0.2)] hover:scale-110
          ${isOpen ? 'bg-[#121214] border border-white/10 text-white rotate-90' : 'bg-amber-500 text-black hover:bg-amber-400'}
        `}
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </button>

    </div>
  );
}
