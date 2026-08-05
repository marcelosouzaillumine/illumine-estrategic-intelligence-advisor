import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { ChevronDown, Wifi, WifiOff, Loader2, RefreshCw } from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { useExecutiveFormatter } from "../../core/localization";

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
    const formatter = useExecutiveFormatter();
  const { translateLabel: t } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const current = SUPPORTED_CURRENCIES.find((c) => c.code === selected) || SUPPORTED_CURRENCIES[0];

  useEffect(() => {
      const formatter = useExecutiveFormatter();
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatTime = (date: Date) =>
    formatter.date(date, { hour: '2-digit', minute: '2-digit' });

  return (
    <div ref={ref} className="relative shrink-0">
      {/* Trigger Button */}
      <button
        id="currency-selector-trigger"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          'flex items-center gap-1 md:gap-2 px-1.5 py-1 min-[400px]:px-2.5 min-[400px]:py-1.5 md:px-3.5 md:py-2 rounded-button border transition-all duration-200 text-[8px] min-[400px]:text-[9px] sm:text-[10px] md:text-xs font-medium uppercase tracking-widest',
          open
            ? 'bg-primary text-primary-foreground border-primary shadow-md'
            : 'bg-background text-foreground border-border hover:border-muted-foreground/30 hover:shadow-sm'
        )}
      >
        <span className="text-sm md:text-base leading-none">{current.flag}</span>
        <span>{current.code}</span>
        {loading ? (
          <Loader2 size={10} className="animate-spin text-muted-foreground" />
        ) : error ? (
          <WifiOff size={10} className="text-amber-400" />
        ) : (
          <div className="flex items-center gap-1">
            <span className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-success-soft0 animate-pulse" />
          </div>
        )}
        <ChevronDown
          className={cn('transition-transform duration-200 w-2.5 h-2.5 md:w-3 md:h-3', open && 'rotate-180')}
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
            className="absolute right-0 top-full mt-2 w-72 bg-background rounded-md border border-border shadow-lg overflow-hidden z-50"
          >
            {/* Header */}
            <div className="px-5 py-4 bg-surface-container border-b border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-body-sm font-medium uppercase tracking-widest text-muted-foreground">
                    Moeda de Exibição
                  </p>
                  <p className="text-body-sm font-medium text-muted-foreground/60 mt-0.5">
                    Câmbio do dia aplicado
                  </p>
                </div>
                {loading ? (
                  <div className="flex items-center gap-1.5 px-2.5 py-1 bg-surface-container-high rounded-button">
                    <Loader2 size={10} className="animate-spin text-muted-foreground" />
                    <span className="text-[9px] font-medium text-muted-foreground uppercase">Buscando...</span>
                  </div>
                ) : error ? (
                  <div className="flex items-center gap-1.5 px-2.5 py-1 bg-warning-soft border border-warning/20 rounded-button">
                    <WifiOff size={10} className="text-warning" />
                    <span className="text-[9px] font-medium text-warning uppercase">Fallback</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 px-2.5 py-1 bg-success-soft border border-success/20 rounded-button">
                    <Wifi size={10} className="text-success" />
                    <span className="text-[9px] font-medium text-success uppercase">Ao Vivo</span>
                  </div>
                )}
              </div>
              {lastUpdated && !error && (
                <p className="text-[9px] text-muted-foreground mt-2 flex items-center gap-1">
                  <RefreshCw size={8} />
                  Atualizado às {formatTime(lastUpdated)}
                </p>
              )}
            </div>

            {/* Currency Options */}
            <div className="p-2">
              {SUPPORTED_CURRENCIES.map((currency) => {
                  const formatter = useExecutiveFormatter();
                const isSelected = currency.code === selected;
                const rate = rates?.[currency.code];
                return (
                  <button
                    key={currency.code}
                    id={`currency-option-${currency.code}`}
                    onClick={() => {
                        const formatter = useExecutiveFormatter();
                      onChange(currency.code);
                      setOpen(false);
                    }}
                    className={cn(
                      'w-full flex items-center justify-between px-4 py-3 rounded-button transition-all duration-150 text-left group',
                      isSelected
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'hover:bg-surface-container text-foreground'
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl leading-none">{currency.flag}</span>
                      <div>
                        <p className={cn(
                          'text-body-sm font-medium uppercase tracking-wider',
                          isSelected ? 'text-primary-foreground' : 'text-foreground'
                        )}>
                          {currency.code}
                        </p>
                        <p className={cn(
                          'text-[9px] font-medium',
                          isSelected ? 'text-muted-foreground' : 'text-muted-foreground'
                        )}>
                          {currency.label}
                        </p>
                      </div>
                    </div>
                    {rate !== undefined && currency.code !== 'BRL' && (
                      <span className={cn(
                        'text-[9px] font-medium tabular-nums',
                        isSelected ? 'text-primary-foreground/60' : 'text-muted-foreground'
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
            <div className="px-5 py-3 border-t border-border bg-surface-container/50">
              <p className="text-[9px] text-muted-foreground font-medium leading-relaxed">
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
