import { useState, useEffect, useMemo } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAnnualFinancialData } from '../../hooks/useFinancialData';
import { TaxReformDiagnosis, ProductInfo } from '../../lib/taxIntelligence';
import { TaxReformViewModel } from '../../viewmodels/TaxReformViewModel';

export interface UseTaxReformParams {
  clientId: string;
  selectedYear?: number;
}

export function useTaxReform({ clientId, selectedYear }: UseTaxReformParams) {
  const year = selectedYear || new Date().getFullYear();
  const [loadingProducts, setLoadingProducts] = useState(false);

  const [diagnosis, setDiagnosis] = useState<TaxReformDiagnosis>({
    regimeTributario: 'Lucro Real',
    faturamentoMensal: 0,
    faturamentoAnual: 0,
    margemLiquida: 0,
    margemEBITDA: 0,
    folhaPercentual: 0,
    percentualServicos: 0,
    percentualProdutos: 0,
    percentualIndustria: 0,
    percentualComercio: 0,
    percentualExportacao: 0,
    percentualInterestadual: 0,
    creditosAtuais: 0,
    beneficiosFiscais: false,
    aliquotaEfetivaAtual: 0, 
    cargaTributariaEfetiva: 0,
    dependenciaCreditoFiscal: 'Média',
    setorEconomico: '',
    produtos: []
  });

  const { dbData: dreData, loading: loadingDRE } = useAnnualFinancialData(clientId, year, 'DRE');

  // Fetch products from precificacao
  useEffect(() => {
    if (!clientId) return;
    setLoadingProducts(true);
    const q = query(collection(db, 'precificacao'), where('clientId', '==', clientId));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const dbProducts = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          descricao: data.nome,
          ncm: data.ncm || '0000.00.00',
          valorMensal: (data.precoVenda || 0) * 10,
          tipo: 'Produto'
        } as ProductInfo;
      });
      
      setDiagnosis(prev => ({ ...prev, produtos: dbProducts }));
      setLoadingProducts(false);
    });

    return () => unsubscribe();
  }, [clientId]);

  // Sync DRE Values
  useEffect(() => {
    if (dreData && dreData.length > 0) {
      const getValue = (name: string) => {
        const search = name.toLowerCase();
        return dreData
          .filter(d => (d.conta || d.category || '').toLowerCase().includes(search))
          .reduce((acc, d) => acc + (d.val || d.valor || d.value || 0), 0);
      };

      const rb = getValue('receita operacional bruta') || getValue('faturamento');
      const ebitda = getValue('ebitda');
      const lucro = getValue('lucro líquido');

      if (rb > 0) {
        setDiagnosis(prev => ({
          ...prev,
          faturamentoMensal: rb / 12,
          faturamentoAnual: rb,
          margemEBITDA: ebitda / rb,
          margemLiquida: lucro / rb,
        }));
      }
    }
  }, [dreData]);

  const scenarios = useMemo(() => TaxReformViewModel.getTransitionScenarios(), []);
  const [selectedScenario, setSelectedScenario] = useState(scenarios[0]);

  const metrics = useMemo(() => TaxReformViewModel.calculateMetrics(diagnosis, selectedScenario), [diagnosis, selectedScenario]);
  const recommendations = useMemo(() => TaxReformViewModel.calculateRecommendations(diagnosis, metrics), [diagnosis, metrics]);
  const scores = useMemo(() => TaxReformViewModel.calculateScores(diagnosis, metrics), [diagnosis, metrics]);
  const ncmInsights = useMemo(() => TaxReformViewModel.calculateNCMInsights(diagnosis.produtos || []), [diagnosis.produtos]);
  const hasData = useMemo(() => TaxReformViewModel.hasValidData(diagnosis), [diagnosis]);

  const addProduct = (newProduct: Partial<ProductInfo>) => {
    if (newProduct.descricao && newProduct.valorMensal) {
      setDiagnosis(prev => ({
        ...prev,
        produtos: [...(prev.produtos || []), { ...newProduct, id: crypto.randomUUID() } as ProductInfo]
      }));
    }
  };

  const removeProduct = (id: string) => {
    setDiagnosis(prev => ({
      ...prev,
      produtos: (prev.produtos || []).filter(p => p.id !== id)
    }));
  };

  return {
    loading: loadingDRE || loadingProducts,
    diagnosis,
    setDiagnosis,
    scenarios,
    selectedScenario,
    setSelectedScenario,
    metrics,
    recommendations,
    scores,
    ncmInsights,
    hasData,
    addProduct,
    removeProduct
  };
}
