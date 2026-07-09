import { useState, useEffect, useCallback } from 'react';

import { FirestoreSystemAssumptionsAdapter } from '../persistence/FirestoreSystemAssumptionsAdapter';
import { FirestoreAuthAdapter } from '../persistence/FirestoreAuthAdapter';
import { DATA } from '../../data';

export function usePremissasEconomicasAdapter() {
  const [econData, setEconData] = useState(DATA.premissas.economicas);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSync, setLastSync] = useState<string | null>(null);
  const [lastSyncFull, setLastSyncFull] = useState<string | null>(null);

  useEffect(() => {
    const unsub = FirestoreSystemAssumptionsAdapter.listenToEconomicPremises((data) => {
      if (data.econData) setEconData(data.econData);
      if (data.lastSync) setLastSync(data.lastSync);
      if (data.lastSyncFull) setLastSyncFull(data.lastSyncFull);
    });
    return () => unsub();
  }, []);

  const handleSync = useCallback(async () => {
    if (isSyncing) return;
    
    const isMaster = FirestoreAuthAdapter.isMasterAdmin();
    if (!isMaster) {
      alert("Apenas administradores master podem forçar a sincronização de mercado.");
      return;
    }

    setIsSyncing(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));

      const now = new Date();
      const formattedDate = now.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
      const formattedMonthYear = now.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });

      let currentSelic = 14.50;
      let currentDollar = 4.9809; 
      let currentEuro = 5.772;
      let currentIpca = 4.39;

      try {
        const [currencyRes, selicRes, ipcaRes, ptaxRes] = await Promise.all([
          fetch('https://economia.awesomeapi.com.br/last/USD-BRL,EUR-BRL').then(r => r.json()).catch(() => null),
          fetch('https://api.bcb.gov.br/dados/serie/bcdata.sgs.432/dados/ultimos/1?formato=json').then(r => r.json()).catch(() => null),
          fetch('https://api.bcb.gov.br/dados/serie/bcdata.sgs.13522/dados/ultimos/1?formato=json').then(r => r.json()).catch(() => null),
          fetch('https://api.bcb.gov.br/dados/serie/bcdata.sgs.1/dados/ultimos/1?formato=json').then(r => r.json()).catch(() => null)
        ]);

        if (ptaxRes?.[0]?.valor) {
          currentDollar = parseFloat(ptaxRes[0].valor);
        } else if (currencyRes?.USDBRL) {
          currentDollar = parseFloat(currencyRes.USDBRL.bid);
        }

        if (currencyRes?.EURBRL) currentEuro = parseFloat(currencyRes.EURBRL.bid);
        if (selicRes?.[0]?.valor) currentSelic = parseFloat(selicRes[0].valor);
        if (ipcaRes?.[0]?.valor) currentIpca = parseFloat(ipcaRes[0].valor);
      } catch (e) {
        console.warn("Falha na sincronização em tempo real.");
      }

      const updatedData = econData.map(secao => {
        const cat = secao.categoria.toLowerCase();
        const isSelic = cat.includes('taxas') || cat.includes('juros');
        const isCambio = cat.includes('câmbio') || cat.includes('moedas');
        const isInflacao = cat.includes('inflação');

        return {
          ...secao,
          indicadores: secao.indicadores.map((ind: any) => {
            let val = ind.valor;
            let status = 'Sincronizado';
            const nome = ind.nome.toLowerCase();

            if (isSelic && nome.includes('selic')) {
              val = `${currentSelic.toFixed(2)}% a.a.`;
            } else if (isCambio && nome.includes('dólar')) {
              val = `R$ ${currentDollar.toFixed(4).replace('.', ',')}`;
            } else if (isCambio && nome.includes('euro')) {
              val = `R$ ${currentEuro.toFixed(3).replace('.', ',')}`;
            } else if (isInflacao && nome.includes('ipca')) {
              val = `${currentIpca.toFixed(2)}%`;
            } else {
              status = 'Atualizado';
            }

            return {
              ...ind,
              valor: val,
              status: status,
              obs: (ind.obs.includes('Ref') || ind.obs.includes('Cotação') || ind.obs.includes('Referência'))
                ? `${ind.obs.split(':')[0]}: ${formattedDate}`
                : ind.obs
            };
          })
        };
      });

      await FirestoreSystemAssumptionsAdapter.updateEconomicPremises(updatedData, formattedDate, formattedMonthYear);

    } catch (error) {
      console.error("Erro na sincronização de mercado:", error);
    } finally {
      setIsSyncing(false);
    }
  }, [econData, isSyncing]);

  useEffect(() => {
    const isMaster = FirestoreAuthAdapter.isMasterAdmin();
    const today = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
    if (isMaster && lastSync && lastSync !== today) {
      handleSync();
    }
  }, [lastSync, handleSync]);

  return {
    econData,
    isSyncing,
    lastSync,
    lastSyncFull,
    handleSync
  };
}
