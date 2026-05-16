import { useState, useEffect, useCallback } from 'react';
import { DATA } from '../data';

export interface CurrencyRates {
  /** Quantos BRL vale 1 unidade de cada moeda (X → BRL) */
  toBRL: Record<string, number>;
  /** Quantos X vale 1 BRL (BRL → X) */
  fromBRL: Record<string, number>;
}

export interface CurrencyRatesState {
  rates: CurrencyRates;
  loading: boolean;
  error: boolean;
  lastUpdated: Date | null;
}

// Fallback a partir dos valores estáticos de data.ts
function getStaticRates(): CurrencyRates {
  const exchangeSecao = (DATA as any).premissas?.economicas?.find(
    (s: any) => s.categoria?.includes('Câmbio')
  );
  const usd = parseFloat(
    exchangeSecao?.indicadores?.find((i: any) => i.nome?.includes('Dólar'))
      ?.valor.replace('R$ ', '').replace(',', '.') || '4.9809'
  );
  const eur = parseFloat(
    exchangeSecao?.indicadores?.find((i: any) => i.nome?.includes('Euro'))
      ?.valor.replace('R$ ', '').replace(',', '.') || '5.772'
  );
  const gbp = 6.32; // Fallback estático GBP

  return {
    toBRL: { BRL: 1, USD: usd, EUR: eur, GBP: gbp },
    fromBRL: { BRL: 1, USD: 1 / usd, EUR: 1 / eur, GBP: 1 / gbp },
  };
}

export function useCurrencyRates(): CurrencyRatesState {
  const [rates, setRates] = useState<CurrencyRates>(getStaticRates());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchRates = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const response = await fetch(
        'https://economia.awesomeapi.com.br/last/USD-BRL,EUR-BRL,GBP-BRL',
        { signal: AbortSignal.timeout(6000) }
      );
      if (!response.ok) throw new Error('API error');
      const data = await response.json();

      const usd = parseFloat(data['USDBRL']?.bid || '0');
      const eur = parseFloat(data['EURBRL']?.bid || '0');
      const gbp = parseFloat(data['GBPBRL']?.bid || '0');

      if (usd > 0 && eur > 0 && gbp > 0) {
        setRates({
          toBRL: { BRL: 1, USD: usd, EUR: eur, GBP: gbp },
          fromBRL: { BRL: 1, USD: 1 / usd, EUR: 1 / eur, GBP: 1 / gbp },
        });
        setLastUpdated(new Date());
        setError(false);
      } else {
        throw new Error('Invalid data');
      }
    } catch {
      // Fallback para dados estáticos
      setRates(getStaticRates());
      setError(true);
      setLastUpdated(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRates();
  }, [fetchRates]);

  return { rates, loading, error, lastUpdated };
}

/**
 * Converte um valor de uma moeda de origem para uma moeda de destino.
 * Toda conversão passa pelo BRL como base intermediária.
 */
export function convertCurrency(
  amount: number,
  fromCurrency: string,
  toCurrency: string,
  rates: CurrencyRates
): number {
  if (fromCurrency === toCurrency) return amount;
  // amount (fromCurrency) → BRL → toCurrency
  const amountInBRL = amount * (rates.toBRL[fromCurrency] || 1);
  return amountInBRL * (rates.fromBRL[toCurrency] || 1);
}
