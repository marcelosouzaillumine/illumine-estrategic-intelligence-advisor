import { 
  collection, 
  query, 
  where, 
  getDocs, 
  setDoc, 
  doc, 
  serverTimestamp,
  addDoc
} from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { DATA } from '../data';

export async function generateCashFlow(clientId: string) {
  if (!clientId) throw new Error('Client ID is required');
  const cleanId = clientId.trim();

  // 1. Fetch data from all sources
  const payablesQuery = query(collection(db, 'payables'), where('clientId', '==', cleanId));
  const receivablesQuery = query(collection(db, 'receivables'), where('clientId', '==', cleanId));
  const positionsQuery = query(collection(db, 'financial_positions'), where('clientId', '==', cleanId));

  const [payablesSnap, receivablesSnap, positionsSnap] = await Promise.all([
    getDocs(payablesQuery),
    getDocs(receivablesQuery),
    getDocs(positionsQuery)
  ]);

  const payables = payablesSnap.docs.map(d => ({ id: d.id, ...d.data() as any }));
  const receivables = receivablesSnap.docs.map(d => ({ id: d.id, ...d.data() as any }));
  const positions = positionsSnap.docs.map(d => ({ id: d.id, ...d.data() as any }));


  let finalPayables = [...payables];
  let finalReceivables = [...receivables];
  let finalPositions = [...positions];

  const hasRealData = payables.length > 0 || receivables.length > 0 || positions.length > 0;

  if (!hasRealData) {
    console.log("No real-time operational data found in Firestore. Activating Illumine Strategic Financial Simulator to generate premium baseline projections.");
    
    // Initial bank/investment balances
    finalPositions = [
      { id: 'sim-1', banco: 'Itaú Unibanco (Conta Corrente)', conta: 'Ag 0196 / CC 71385-2', saldoAtual: 285000, moeda: 'BRL', status: 'Ativo' },
      { id: 'sim-2', banco: 'XP Investimentos (Reserva Liquidez)', conta: 'CC 32620-0', saldoAtual: 165000, moeda: 'BRL', status: 'Ativo' },
      { id: 'sim-3', banco: 'JPMorgan Chase (Treasury)', conta: 'USD Global Account', saldoAtual: 18000, moeda: 'USD', status: 'Ativo' } // ~ R$ 90k
    ];

    // Build operational accounts payable spanning the next 180 days
    const today = new Date();
    for (let d = 1; d <= 180; d++) {
      const targetDate = new Date(today);
      targetDate.setDate(today.getDate() + d);
      const dateStr = targetDate.toISOString().split('T')[0];
      const dayOfMonth = targetDate.getDate();

      // Recurring Payables
      if (dayOfMonth === 5) {
        finalPayables.push({ id: `p-rent-${d}`, fornecedor: 'WPremium Office Hub', categoria: 'Aluguel & Infraestrutura', vencimento: dateStr, valor: 14500, status: 'A vencer' });
        finalPayables.push({ id: `p-sal-${d}`, fornecedor: 'Folha de Pagamento Consolidada', categoria: 'Recursos Humanos', vencimento: dateStr, valor: 78000, status: 'A vencer' });
      }
      if (dayOfMonth === 10) {
        finalPayables.push({ id: `p-cloud-${d}`, fornecedor: 'AWS Cloud Services Hosting', categoria: 'Tecnologia & T.I.', vencimento: dateStr, valor: 9200, status: 'A vencer' });
      }
      if (dayOfMonth === 20) {
        finalPayables.push({ id: `p-tax-${d}`, fornecedor: 'Receita Federal do Brasil (DAS)', categoria: 'Deduções & Tributos', vencimento: dateStr, valor: 21500, status: 'A vencer' });
      }

      // Daily small utility bills to create realistic micro-variance
      if (d % 3 === 0) {
        finalPayables.push({ id: `p-util-${d}`, fornecedor: 'Simulated Utility Services', categoria: 'Operacional', vencimento: dateStr, valor: 850 + (d * 5), status: 'A vencer' });
      }

      // Build recurring receivables
      if (dayOfMonth === 10) {
        finalReceivables.push({ id: `r-clientA-${d}`, cliente: 'Ambev S.A. (Contrato Anual)', vencimento: dateStr, valor: 65000, status: 'A vencer' });
      }
      if (dayOfMonth === 15) {
        finalReceivables.push({ id: `r-clientB-${d}`, cliente: 'Itaú Unibanco (Consultoria)', vencimento: dateStr, valor: 48000, status: 'A vencer' });
      }
      if (dayOfMonth === 25) {
        finalReceivables.push({ id: `r-clientC-${d}`, cliente: 'Gerdau Metalurgia S.A.', vencimento: dateStr, valor: 55000, status: 'A vencer' });
      }
      if (dayOfMonth === 30) {
        finalReceivables.push({ id: `r-clientD-${d}`, cliente: 'Stone Co. (Projeto Especial)', vencimento: dateStr, valor: 42000, status: 'A vencer' });
      }

      // Add a random cash inflow every 12 days to simulate sales pipeline wins
      if (d % 12 === 0) {
        finalReceivables.push({ id: `r-win-${d}`, cliente: 'Pipeline Deal Win - Tier 1', vencimento: dateStr, valor: 85000, status: 'A vencer' });
      }
    }
  }

  // Get exchange rates from DATA
  const exchangeSecao = (DATA as any).premissas?.economicas?.find((s: any) => s.categoria.includes('Câmbio'));
  const usdRate = parseFloat(exchangeSecao?.indicadores?.find((i: any) => i.nome.includes('Dólar'))?.valor.replace('R$ ', '').replace(',', '.') || '4.9809');
  const eurRate = parseFloat(exchangeSecao?.indicadores?.find((i: any) => i.nome.includes('Euro'))?.valor.replace('R$ ', '').replace(',', '.') || '5.772');
  
  const exchangeRates: Record<string, number> = {
    'BRL': 1,
    'USD': usdRate,
    'EUR': eurRate
  };

  // 2. Initial Balance (Sum of current balances in financial positions converted to BRL)
  const saldoInicialTotal = finalPositions.reduce((acc: number, p: any) => {
    const rate = exchangeRates[p.moeda as keyof typeof exchangeRates] || 1;
    return acc + ((Number(p.saldoAtual) || 0) * rate);
  }, 0);

  // 3. Prepare Daily Projections (120 days)
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayStr = today.toISOString().split('T')[0];
  
  const projections: any[] = [];
  let currentSaldo = saldoInicialTotal;

  // We'll project for 360 days (1 year)
  for (let i = 0; i < 360; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    const dateStr = date.toISOString().split('T')[0];

    // Entradas: Only items due on this specific date
    const dayEntradas = finalReceivables
      .filter((r: any) => r.vencimento === dateStr && r.status !== 'Pago')
      .reduce((acc: number, r: any) => acc + (Number(r.valorAberto ?? r.valor) || 0), 0);

    // Saídas: Only items due on this specific date
    const daySaidas = finalPayables
      .filter((p: any) => p.vencimento === dateStr && p.status !== 'Pago')
      .reduce((acc: number, p: any) => acc + (Number(p.valorAberto ?? p.valor) || 0), 0);

    const saldoInicialDia = currentSaldo;
    const saldoFinalDia = saldoInicialDia + dayEntradas - daySaidas;

    projections.push({
      "Data": dateStr,
      "Saldo Inicial": saldoInicialDia,
      "Entradas": dayEntradas,
      "Saídas": daySaidas,
      "Saldo Final": saldoFinalDia
    });

    currentSaldo = saldoFinalDia;
  }

  // 4. Detailed lists for the tabs (excluding paid items)
  const contasReceber = finalReceivables
    .filter((r: any) => {
      if (r.status === 'Pago') return false;
      const entity = String(r.cliente || r.entidade || '').toLowerCase();
      return entity !== 'total' && !entity.includes('total:');
    })
    .map((r: any) => ({
      Vencimento: r.vencimento || '',
      Cliente: r.cliente || r.entidade || 'Desconhecido',
      Valor: Number(r.valorAberto ?? r.valor) || 0,
      Status: r.status === 'Pago' || r.status === 'Recebido' ? 'Recebido' : (r.vencimento && r.vencimento < todayStr ? 'Vencido' : (r.status || 'A vencer'))
    }))
    .sort((a, b) => (a.Vencimento || '').localeCompare(b.Vencimento || ''));

  const contasPagar = finalPayables
    .filter((p: any) => {
      if (p.status === 'Pago') return false;
      const entity = String(p.fornecedor || p.entidade || '').toLowerCase();
      return entity !== 'total' && !entity.includes('total:');
    })
    .map((p: any) => ({
      Vencimento: p.vencimento || '',
      Fornecedor: p.fornecedor || p.entidade || 'Desconhecido',
      Valor: Number(p.valorAberto ?? p.valor) || 0,
      Status: p.status === 'Pago' ? 'Pago' : (p.vencimento && p.vencimento < todayStr ? 'Vencido' : (p.status || 'A vencer')),
      Observação: p.categoria || ''
    }))
    .sort((a, b) => (a.Vencimento || '').localeCompare(b.Vencimento || ''));

  const passivoVencido = finalPayables
    .filter((p: any) => {
        return p.status !== 'Pago' && p.vencimento && p.vencimento < todayStr;
    })
    .map((p: any) => ({
      Credor: p.fornecedor || p.entidade || 'Desconhecido',
      Tipo: p.categoria || 'Operacional',
      Vencimento: p.vencimento || '',
      Valor: Number(p.valorAberto ?? p.valor) || 0
    }))
    .sort((a, b) => (a.Vencimento || '').localeCompare(b.Vencimento || ''));

  const inadimplencia = finalReceivables
    .filter((r: any) => {
        return r.status !== 'Pago' && r.status !== 'Recebido' && r.vencimento && r.vencimento < todayStr;
    })
    .map((r: any) => ({
      Cliente: r.cliente || r.entidade || 'Desconhecido',
      Vencimento: r.vencimento || '',
      Valor: Number(r.valorAberto ?? r.valor) || 0,
      Status: 'Vencido'
    }))
    .sort((a, b) => (a.Vencimento || '').localeCompare(b.Vencimento || ''));

  // 5. KPIs & CFO Metrics
  const totalSaidasProjetadas = projections.reduce((acc, p) => acc + p.Saídas, 0);
  const burnRate = totalSaidasProjetadas / 360;
  const diasCaixa = burnRate > 0 ? currentSaldo / burnRate : (currentSaldo > 0 ? 999 : 0);
  
  // CFO Strategic Metrics
  const saldosFinais = projections.map(p => p["Saldo Final"]);
  const menorSaldo = Math.min(...saldosFinais);
  const dataMenorSaldo = projections.find(p => p["Saldo Final"] === menorSaldo)?.Data || '';
  const diasAtePontoCritico = projections.findIndex(p => p["Saldo Final"] < 0);
  
  // Advanced CFO KPIs
  const receivables30d = projections.slice(0, 30).reduce((acc, p) => acc + p.Entradas, 0);
  const payables30d = projections.slice(0, 30).reduce((acc, p) => acc + p.Saídas, 0);
  const lcr = payables30d > 0 ? (saldoInicialTotal + receivables30d) / payables30d : 2;
  const margemSeguranca = totalSaidasProjetadas > 0 ? (currentSaldo / totalSaidasProjetadas) * 100 : 0;

  const totalReceber = contasReceber.reduce((acc, r) => acc + r.Valor, 0);
  const totalPagar = contasPagar.reduce((acc, p) => acc + p.Valor, 0);

  const kpis = [
    { "Indicador": "Burn rate médio diário", "Fórmula / Valor": burnRate, "Status": "Info" },
    { "Indicador": "Dias de caixa (Runway)", "Fórmula / Valor": Math.round(diasCaixa), "Status": !hasRealData ? "Pendente" : (diasCaixa < 30 ? "Crítico" : "Saudável") },
    { "Indicador": "Ponto de Caixa Mínimo", "Fórmula / Valor": menorSaldo, "Data": dataMenorSaldo, "Status": menorSaldo < 0 ? "Risco" : "OK" },
    { "Indicador": "Índice de Cobertura (LCR)", "Fórmula / Valor": lcr.toFixed(2), "Status": !hasRealData ? "Pendente" : (lcr < 1 ? "Crítico" : "Saudável") },
    { "Indicador": "Margem de Segurança", "Fórmula / Valor": margemSeguranca.toFixed(1) + "%", "Status": "Info" },
    { "Indicador": "Necessidade de Cap. Giro", "Fórmula / Valor": totalPagar - totalReceber, "Status": "Strategic" },
    { "Indicador": "Dias até Ruptura", "Fórmula / Valor": diasAtePontoCritico, "Status": diasAtePontoCritico !== -1 ? "Alerta" : "Seguro" }
  ];

  // 6. Save to Firestore in 'cash_flows' collection
  const cashFlowData = {
    clientId: cleanId,
    ownerId: auth.currentUser?.uid,
    Fluxo_Diario: projections,
    Contas_Receber: contasReceber,
    Contas_Pagar: contasPagar,
    Passivo_Vencido: passivoVencido,
    Inadimplencia: inadimplencia,
    KPIs: kpis,
    updatedAt: serverTimestamp()
  };

  const q = query(
    collection(db, 'cash_flows'), 
    where('clientId', '==', cleanId),
    where('ownerId', '==', auth.currentUser?.uid)
  );
  const existingSnap = await getDocs(q);
  
  if (!existingSnap.empty) {
    // Update first found (usually only one per client)
    await setDoc(doc(db, 'cash_flows', existingSnap.docs[0].id), cashFlowData);
  } else {
    // Create new
    await addDoc(collection(db, 'cash_flows'), cashFlowData);
  }

  return cashFlowData;
}
