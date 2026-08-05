import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchCommands, ExecutiveCommand } from './command.registry';
import { Search } from 'lucide-react';

export const ExecutiveCommandBar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<ExecutiveCommand[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    setResults(searchCommands(query));
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-start justify-center pt-[20vh]">
      <div className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-2xl shadow-2xl overflow-hidden">
        <div className="flex items-center px-4 py-3 border-b border-slate-800">
          <Search className="w-5 h-5 text-slate-400 mr-3" />
          <input 
            autoFocus
            type="text"
            className="w-full bg-transparent text-slate-200 placeholder-slate-500 outline-none text-lg"
            placeholder="Digite um comando (ex: 'Mostrar risco de caixa')..."
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          <div className="text-xs text-slate-500 px-2 py-1 border border-slate-700 rounded ml-4">ESC</div>
        </div>
        
        {results.length > 0 && (
          <div className="max-h-[60vh] overflow-y-auto py-2">
            {results.map(cmd => (
              <div 
                key={cmd.id}
                className="px-4 py-3 hover:bg-slate-800 cursor-pointer flex justify-between items-center group"
                onClick={() => {
                  setIsOpen(false);
                  navigate(cmd.targetPath);
                }}
              >
                <div>
                  <div className="text-slate-200 font-medium group-hover:text-blue-400 transition-colors">
                    {cmd.title}
                  </div>
                  <div className="text-slate-500 text-sm mt-0.5">
                    {cmd.subtitle}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {query && results.length === 0 && (
          <div className="px-4 py-8 text-center text-slate-500">
            Nenhum comando encontrado para "{query}"
          </div>
        )}
      </div>
    </div>
  );
};
