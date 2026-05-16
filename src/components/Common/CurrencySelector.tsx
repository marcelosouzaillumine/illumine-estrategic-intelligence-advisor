import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Wifi, WifiOff, Loader2, RefreshCw } from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export interface SupportedCurrency {
  code: string;
  label: string;
  flag: string;
  symbol: string;
}

export const SUPPORTED_CURRENCIES: SupportedCurrency[] = [
  { code: 'BRL', label: 'Real Brasileiro', flag: '🇧🇷', symbol: 'R$' },
  { code: 'USD', label: 'Dólar Americano', flag: '🇺🇸', symbol: '$' },
  { code: 'EUR', label: 'Euro', flag: '🇪🇺', symbol: '€' },
  { code: 'GBP', label: 'Libra Esterlina', flag: '🇬🇧', symbol: '£' },
];

interface CurrencySelectorProps {
  selected: string;
  onChange: (code: string) => void;
  loading?: boolean;
  error?: boolean;
  lastUpdated?: Date | null;
  rates?: Record<string, number>;
}

export function CurrencySelector({
  selected,
  onChange,
  loading = false,
  error = false,
  lastUpdated,
  rates,
}: CurrencySelectorProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const current = SUPPORTED_CURRENCIES.find((c) => c.code === selected) || SUPPORTED_CURRENCIES[0];

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatTime = (date: Date) =>
    date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

  return (
    <div ref={ref} className="relative shrink-0">
      {/* Trigger Button */}
      <button
        id="currency-selector-trigger"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          'flex items-center gap-2 px-4 py-2.5 rounded-2xl border transition-all duration-200 text-[10px] font-black uppercase tracking-widest',
          open
            ? 'bg-slate-900 text-white border-slate-900 shadow-xl shadow-slate-900/20'
            : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:shadow-md shadow-sm'
        )}
      >
        <span className="text-base leading-none">{current.flag}</span>
        <span>{current.code}</span>
        {loading ? (
          <Loader2 size={10} className="animate-spin text-slate-400" />
        ) : error ? (
          <WifiOff size={10} className="text-amber-400" />
        ) : (
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          </div>
        )}
        <ChevronDown
          size={12}
          className={cn('transition-transform duration-200', open && 'rotate-180')}
        />
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute right-0 top-full mt-2 w-72 bg-white rounded-3xl border border-slate-200 shadow-2xl shadow-slate-900/15 overflow-hidden z-50"
          >
            {/* Header */}
            <div className="px-5 py-4 bg-slate-50 border-b border-slate-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Moeda de Exibição
                  </p>
                  <p className="text-xs font-bold text-slate-600 mt-0.5">
                    Câmbio do dia aplicado
                  </p>
                </div>
                {loading ? (
                  <div className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 rounded-lg">
                    <Loader2 size={10} className="animate-spin text-slate-400" />
                    <span className="text-[9px] font-black text-slate-400 uppercase">Buscando...</span>
                  </div>
                ) : error ? (
                  <div className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 border border-amber-200 rounded-lg">
                    <WifiOff size={10} className="text-amber-500" />
                    <span className="text-[9px] font-black text-amber-600 uppercase">Fallback</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 border border-emerald-200 rounded-lg">
                    <Wifi size={10} className="text-emerald-500" />
                    <span className="text-[9px] font-black text-emerald-600 uppercase">Ao Vivo</span>
                  </div>
                )}
              </div>
              {lastUpdated && !error && (
                <p className="text-[9px] text-slate-400 mt-2 flex items-center gap-1">
                  <RefreshCw size={8} />
                  Atualizado às {formatTime(lastUpdated)}
                </p>
              )}
            </div>

            {/* Currency Options */}
            <div className="p-2">
              {SUPPORTED_CURRENCIES.map((currency) => {
                const isSelected = currency.code === selected;
                const rate = rates?.[currency.code];
                return (
                  <button
                    key={currency.code}
                    id={`currency-option-${currency.code}`}
                    onClick={() => {
                      onChange(currency.code);
                      setOpen(false);
                    }}
                    className={cn(
                      'w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-all duration-150 text-left group',
                      isSelected
                        ? 'bg-slate-900 text-white'
                        : 'hover:bg-slate-50 text-slate-700'
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl leading-none">{currency.flag}</span>
                      <div>
                        <p className={cn(
                          'text-[10px] font-black uppercase tracking-wider',
                          isSelected ? 'text-white' : 'text-slate-800'
                        )}>
                          {currency.code}
                        </p>
                        <p className={cn(
                          'text-[9px] font-medium',
                          isSelected ? 'text-slate-300' : 'text-slate-400'
                        )}>
                          {currency.label}
                        </p>
                      </div>
                    </div>
                    {rate !== undefined && currency.code !== 'BRL' && (
                      <span className={cn(
                        'text-[9px] font-black tabular-nums',
                        isSelected ? 'text-slate-300' : 'text-slate-400'
                      )}>
                        R$ {rate.toFixed(4)}
                      </span>
                    )}
                    {isSelected && (
                      <span className="ml-2 w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Footer note */}
            <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/50">
              <p className="text-[9px] text-slate-400 font-medium leading-relaxed">
                Todos os valores financeiros dos clientes são convertidos pelo câmbio comercial do dia.
                Clientes sem moeda definida assumem BRL.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
