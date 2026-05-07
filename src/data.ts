export const DATA = {
    clientes: [
      { 
        id: 'C001', 
        razao: 'Cliente Exemplo Saúde Ltda', 
        fantasia: 'Hospital Modelo', 
        cnpj: '00.000.000/0001-01', 
        segmento: 'Saúde', 
        subsetor: 'Hospital', 
        regime: 'Lucro Presumido', 
        porte: 'Médio Porte', 
        cidade: 'Curitiba/PR', 
        status: 'Ativo',
        endereco: 'Rua das Flores, 1234 - Centro, Curitiba - PR, 80010-000',
        cnae: '86.10-1-01 (Atividades de atendimento hospitalar)',
        cnaesSecundarios: [
          '86.30-5-01 (Atividade médica ambulatorial com recursos)',
          '86.40-2-02 (Laboratórios de análise clínica)'
        ],
        dataFundacao: '12/05/1998',
        capitalSocial: 5000000,
        socios: ['Roberto Santos', 'Ana Paula Lima'],
        filiais: [
          { nome: 'Unidade Batel', cidade: 'Curitiba/PR', cnpj: '00.000.000/0002-02' }
        ],
        unidadesNegocio: ['Pronto Socorro', 'Internamento', 'Laboratório', 'Administração'],
        contato: {
          nome: 'Dr. Roberto Santos',
          funcao: 'Diretor Geral',
          telefone: '(41) 3333-4444',
          email: 'roberto.santos@hospitalmodelo.com.br'
        }
      },
      { 
        id: 'C002', 
        razao: 'Cliente Exemplo Indústria Ltda', 
        fantasia: 'Indústria Modelo', 
        cnpj: '11.111.111/0001-11', 
        segmento: 'Indústria', 
        subsetor: 'Alimentos', 
        regime: 'Lucro Real', 
        porte: 'Médio Porte', 
        cidade: 'São Paulo/SP', 
        status: 'Implantação',
        endereco: 'Av. Industrial, 500 - Vila Leopoldina, São Paulo - SP, 05317-020',
        cnae: '10.91-1-01 (Fabricação de produtos de panificação industrial)',
        cnaesSecundarios: [
          '10.91-1-02 (Fabricação de produtos de padaria e confeitaria)'
        ],
        dataFundacao: '20/03/2010',
        capitalSocial: 12500000,
        socios: ['Claudio Silva', 'Holding Investimentos SA'],
        filiais: [],
        unidadesNegocio: ['Produção - Linha A', 'Logística', 'Vendas Corporativas'],
        contato: {
          nome: 'Eng. Claudio Silva',
          funcao: 'Gerente de Operações',
          telefone: '(11) 5555-6666',
          email: 'claudio.silva@industriamodelo.com.br'
        }
      }
    ],
  dre: [
    { id: 'C001', ano: 2026, mes: 1, comp: '2026-01', conta: 'Receita Líquida', valor: 520000 },
    { id: 'C001', ano: 2026, mes: 1, comp: '2026-01', conta: 'Custos', valor: -305000 },
    { id: 'C001', ano: 2026, mes: 1, comp: '2026-01', conta: 'Despesas Operacionais', valor: -125000 },
    { id: 'C001', ano: 2026, mes: 1, comp: '2026-01', conta: 'Despesas Financeiras', valor: -18000 },
    { id: 'C001', ano: 2026, mes: 1, comp: '2026-01', conta: 'Lucro Líquido', valor: 52000 },
    { id: 'C001', ano: 2026, mes: 2, comp: '2026-02', conta: 'Receita Líquida', valor: 545000 },
    { id: 'C001', ano: 2026, mes: 2, comp: '2026-02', conta: 'Custos', valor: -318000 },
    { id: 'C001', ano: 2026, mes: 2, comp: '2026-02', conta: 'Despesas Operacionais', valor: -130000 },
    { id: 'C001', ano: 2026, mes: 2, comp: '2026-02', conta: 'Despesas Financeiras', valor: -17500 },
    { id: 'C001', ano: 2026, mes: 2, comp: '2026-02', conta: 'Lucro Líquido', valor: 61000 },
    { id: 'C001', ano: 2026, mes: 3, comp: '2026-03', conta: 'Receita Líquida', valor: 570000 },
    { id: 'C001', ano: 2026, mes: 3, comp: '2026-03', conta: 'Custos', valor: -332000 },
    { id: 'C001', ano: 2026, mes: 3, comp: '2026-03', conta: 'Despesas Operacionais', valor: -134000 },
    { id: 'C001', ano: 2026, mes: 3, comp: '2026-03', conta: 'Despesas Financeiras', valor: -17000 },
    { id: 'C001', ano: 2026, mes: 3, comp: '2026-03', conta: 'Lucro Líquido', valor: 69000 },
    { id: 'C002', ano: 2026, mes: 1, comp: '2026-01', conta: 'Receita Líquida', valor: 800000 },
    { id: 'C002', ano: 2026, mes: 1, comp: '2026-01', conta: 'Custos', valor: -510000 },
    { id: 'C002', ano: 2026, mes: 1, comp: '2026-01', conta: 'Despesas Operacionais', valor: -160000 },
    { id: 'C002', ano: 2026, mes: 1, comp: '2026-01', conta: 'Despesas Financeiras', valor: -28000 },
    { id: 'C002', ano: 2026, mes: 1, comp: '2026-01', conta: 'Lucro Líquido', valor: 72000 },
    { id: 'C002', ano: 2026, mes: 2, comp: '2026-02', conta: 'Receita Líquida', valor: 830000 },
    { id: 'C002', ano: 2026, mes: 2, comp: '2026-02', conta: 'Custos', valor: -525000 },
    { id: 'C002', ano: 2026, mes: 2, comp: '2026-02', conta: 'Despesas Operacionais', valor: -165000 },
    { id: 'C002', ano: 2026, mes: 2, comp: '2026-02', conta: 'Despesas Financeiras', valor: -30000 },
    { id: 'C002', ano: 2026, mes: 2, comp: '2026-02', conta: 'Lucro Líquido', valor: 78000 },
    { id: 'C002', ano: 2026, mes: 3, comp: '2026-03', conta: 'Receita Líquida', valor: 860000 },
    { id: 'C002', ano: 2026, mes: 3, comp: '2026-03', conta: 'Custos', valor: -548000 },
    { id: 'C002', ano: 2026, mes: 3, comp: '2026-03', conta: 'Despesas Operacionais', valor: -168000 },
    { id: 'C002', ano: 2026, mes: 3, comp: '2026-03', conta: 'Despesas Financeiras', valor: -32000 },
    { id: 'C002', ano: 2026, mes: 3, comp: '2026-03', conta: 'Lucro Líquido', valor: 82000 },
    // 2025 Data for Comparison
    { id: 'C001', ano: 2025, mes: 1, comp: '2025-01', conta: 'Receita Líquida', valor: 480000 },
    { id: 'C001', ano: 2025, mes: 1, comp: '2025-01', conta: 'Custos', valor: -290000 },
    { id: 'C001', ano: 2025, mes: 1, comp: '2025-01', conta: 'Despesas Operacionais', valor: -120000 },
    { id: 'C001', ano: 2025, mes: 1, comp: '2025-01', conta: 'Despesas Financeiras', valor: -20000 },
    { id: 'C001', ano: 2025, mes: 1, comp: '2025-01', conta: 'Lucro Líquido', valor: 50000 },
    { id: 'C001', ano: 2025, mes: 2, comp: '2025-02', conta: 'Receita Líquida', valor: 500000 },
    { id: 'C001', ano: 2025, mes: 2, comp: '2025-02', conta: 'Custos', valor: -300000 },
    { id: 'C001', ano: 2025, mes: 2, comp: '2025-02', conta: 'Despesas Operacionais', valor: -125000 },
    { id: 'C001', ano: 2025, mes: 2, comp: '2025-02', conta: 'Despesas Financeiras', valor: -19000 },
    { id: 'C001', ano: 2025, mes: 2, comp: '2025-02', conta: 'Lucro Líquido', valor: 56000 },
    { id: 'C001', ano: 2025, mes: 3, comp: '2025-03', conta: 'Receita Líquida', valor: 530000 },
    { id: 'C001', ano: 2025, mes: 3, comp: '2025-03', conta: 'Custos', valor: -310000 },
    { id: 'C001', ano: 2025, mes: 3, comp: '2025-03', conta: 'Despesas Operacionais', valor: -130000 },
    { id: 'C001', ano: 2025, mes: 3, comp: '2025-03', conta: 'Despesas Financeiras', valor: -18000 },
    { id: 'C001', ano: 2025, mes: 3, comp: '2025-03', conta: 'Lucro Líquido', valor: 72000 },
    { id: 'C002', ano: 2025, mes: 1, comp: '2025-01', conta: 'Receita Líquida', valor: 750000 },
    { id: 'C002', ano: 2025, mes: 1, comp: '2025-01', conta: 'Custos', valor: -480000 },
    { id: 'C002', ano: 2025, mes: 1, comp: '2025-01', conta: 'Despesas Operacionais', valor: -150000 },
    { id: 'C002', ano: 2025, mes: 1, comp: '2025-01', conta: 'Despesas Financeiras', valor: -25000 },
    { id: 'C002', ano: 2025, mes: 1, comp: '2025-01', conta: 'Lucro Líquido', valor: 65000 },
  ],
  indicadores: [
    { id: 'C001', cl: 'Hospital Modelo', ano: 2026, mes: 1, comp: 'Jan/26', cat: 'Performance', ind: 'Receita Líquida', val: 520000, un: 'R$', ref: '—', sem: 'Verde' },
    { id: 'C001', cl: 'Hospital Modelo', ano: 2026, mes: 1, comp: 'Jan/26', cat: 'Performance', ind: 'EBITDA', val: 90000, un: 'R$', ref: '—', sem: 'Verde' },
    { id: 'C001', cl: 'Hospital Modelo', ano: 2026, mes: 1, comp: 'Jan/26', cat: 'Performance', ind: 'Lucro Líquido', val: 52000, un: 'R$', ref: '—', sem: 'Verde' },
    { id: 'C001', cl: 'Hospital Modelo', ano: 2026, mes: 1, comp: 'Jan/26', cat: 'Liquidez', ind: 'Liquidez Corrente', val: 1.139, un: 'x', ref: '>= 1,20', sem: 'Amarelo' },
    { id: 'C001', cl: 'Hospital Modelo', ano: 2026, mes: 1, comp: 'Jan/26', cat: 'Liquidez', ind: 'Liquidez Seca', val: 0.944, un: 'x', ref: '>= 1,00', sem: 'Amarelo' },
    { id: 'C001', cl: 'Hospital Modelo', ano: 2026, mes: 1, comp: 'Jan/26', cat: 'Liquidez', ind: 'Liquidez Imediata', val: 0.236, un: 'x', ref: '>= 0,10', sem: 'Verde' },
    { id: 'C001', cl: 'Hospital Modelo', ano: 2026, mes: 1, comp: 'Jan/26', cat: 'Liquidez', ind: 'Liquidez Geral', val: 0.982, un: 'x', ref: '>= 1,00', sem: 'Amarelo' },
    { id: 'C001', cl: 'Hospital Modelo', ano: 2026, mes: 1, comp: 'Jan/26', cat: 'Endividamento', ind: 'Endividamento Geral', val: 0.608, un: '%', ref: '<= 60%', sem: 'Amarelo' },
    { id: 'C001', cl: 'Hospital Modelo', ano: 2026, mes: 1, comp: 'Jan/26', cat: 'Endividamento', ind: 'Dívida Líquida / EBITDA', val: 2.5, un: 'x', ref: '<= 2,0x', sem: 'Amarelo' },
    { id: 'C001', cl: 'Hospital Modelo', ano: 2026, mes: 1, comp: 'Jan/26', cat: 'Lucratividade', ind: 'Margem EBITDA', val: 0.173, un: '%', ref: '> 0%', sem: 'Verde' },
    { id: 'C001', cl: 'Hospital Modelo', ano: 2026, mes: 1, comp: 'Jan/26', cat: 'Lucratividade', ind: 'Margem Líquida', val: 0.1, un: '%', ref: '> 0%', sem: 'Verde' },
    { id: 'C001', cl: 'Hospital Modelo', ano: 2026, mes: 1, comp: 'Jan/26', cat: 'Rentabilidade', ind: 'ROE', val: 0.106, un: '%', ref: '> Selic', sem: 'Verde' },
    { id: 'C001', cl: 'Hospital Modelo', ano: 2026, mes: 1, comp: 'Jan/26', cat: 'Rentabilidade', ind: 'ROA', val: 0.0416, un: '%', ref: '> 0%', sem: 'Verde' },
    { id: 'C001', cl: 'Hospital Modelo', ano: 2026, mes: 1, comp: 'Jan/26', cat: 'Capital de Giro', ind: 'NCG', val: 165000, un: 'R$', ref: 'Monitorar', sem: 'Amarelo' },
    { id: 'C001', cl: 'Hospital Modelo', ano: 2026, mes: 1, comp: 'Jan/26', cat: 'Capital de Giro', ind: 'Saldo de Tesouraria', val: -115000, un: 'R$', ref: '> 0', sem: 'Vermelho' },
    { id: 'C001', cl: 'Hospital Modelo', ano: 2026, mes: 1, comp: 'Jan/26', cat: 'Faturamento', ind: 'Faturamento Bruto', val: 620000, un: 'R$', ref: '—', sem: 'Verde' },
    { id: 'C001', cl: 'Hospital Modelo', ano: 2026, mes: 1, comp: 'Jan/26', cat: 'Faturamento', ind: 'Ticket Médio', val: 4500, un: 'R$', ref: '> 4000', sem: 'Verde' },
    { id: 'C001', cl: 'Hospital Modelo', ano: 2026, mes: 1, comp: 'Jan/26', cat: 'Faturamento', ind: 'PMR', val: 42, un: 'dias', ref: '<= 45', sem: 'Verde' },
    { id: 'C001', cl: 'Hospital Modelo', ano: 2026, mes: 1, comp: 'Jan/26', cat: 'Faturamento', ind: 'Inadimplência', val: 0.052, un: '%', ref: '< 5%', sem: 'Amarelo' },
    { id: 'C001', cl: 'Hospital Modelo', ano: 2026, mes: 1, comp: 'Jan/26', cat: 'Caixa', ind: 'Fluxo de Caixa Operacional', val: 85000, un: 'R$', ref: '> 0', sem: 'Verde' },
    { id: 'C001', cl: 'Hospital Modelo', ano: 2026, mes: 2, comp: 'Fev/26', cat: 'Performance', ind: 'Receita Líquida', val: 545000, un: 'R$', ref: '—', sem: 'Verde' },
    { id: 'C001', cl: 'Hospital Modelo', ano: 2026, mes: 2, comp: 'Fev/26', cat: 'Performance', ind: 'EBITDA', val: 97000, un: 'R$', ref: '—', sem: 'Verde' },
    { id: 'C001', cl: 'Hospital Modelo', ano: 2026, mes: 2, comp: 'Fev/26', cat: 'Performance', ind: 'Lucro Líquido', val: 61000, un: 'R$', ref: '—', sem: 'Verde' },
    { id: 'C001', cl: 'Hospital Modelo', ano: 2026, mes: 2, comp: 'Fev/26', cat: 'Liquidez', ind: 'Liquidez Corrente', val: 1.192, un: 'x', ref: '>= 1,20', sem: 'Amarelo' },
    { id: 'C001', cl: 'Hospital Modelo', ano: 2026, mes: 2, comp: 'Fev/26', cat: 'Liquidez', ind: 'Liquidez Seca', val: 0.995, un: 'x', ref: '>= 1,00', sem: 'Amarelo' },
    { id: 'C001', cl: 'Hospital Modelo', ano: 2026, mes: 2, comp: 'Fev/26', cat: 'Liquidez', ind: 'Liquidez Imediata', val: 0.25, un: 'x', ref: '>= 0,10', sem: 'Verde' },
    { id: 'C001', cl: 'Hospital Modelo', ano: 2026, mes: 2, comp: 'Fev/26', cat: 'Liquidez', ind: 'Liquidez Geral', val: 1.01, un: 'x', ref: '>= 1,00', sem: 'Verde' },
    { id: 'C001', cl: 'Hospital Modelo', ano: 2026, mes: 2, comp: 'Fev/26', cat: 'Endividamento', ind: 'Endividamento Geral', val: 0.598, un: '%', ref: '<= 60%', sem: 'Verde' },
    { id: 'C001', cl: 'Hospital Modelo', ano: 2026, mes: 2, comp: 'Fev/26', cat: 'Capital de Giro', ind: 'NCG', val: 174000, un: 'R$', ref: 'Monitorar', sem: 'Amarelo' },
    { id: 'C001', cl: 'Hospital Modelo', ano: 2026, mes: 2, comp: 'Fev/26', cat: 'Capital de Giro', ind: 'Saldo de Tesouraria', val: -109000, un: 'R$', ref: '> 0', sem: 'Vermelho' },
    { id: 'C001', cl: 'Hospital Modelo', ano: 2026, mes: 2, comp: 'Fev/26', cat: 'Faturamento', ind: 'Faturamento Bruto', val: 650000, un: 'R$', ref: '—', sem: 'Verde' },
    { id: 'C001', cl: 'Hospital Modelo', ano: 2026, mes: 2, comp: 'Fev/26', cat: 'Faturamento', ind: 'Ticket Médio', val: 4600, un: 'R$', ref: '> 4000', sem: 'Verde' },
    { id: 'C001', cl: 'Hospital Modelo', ano: 2026, mes: 2, comp: 'Fev/26', cat: 'Faturamento', ind: 'PMR', val: 40, un: 'dias', ref: '<= 45', sem: 'Verde' },
    { id: 'C001', cl: 'Hospital Modelo', ano: 2026, mes: 2, comp: 'Fev/26', cat: 'Faturamento', ind: 'Inadimplência', val: 0.048, un: '%', ref: '< 5%', sem: 'Verde' },
    { id: 'C001', cl: 'Hospital Modelo', ano: 2026, mes: 2, comp: 'Fev/26', cat: 'Caixa', ind: 'Fluxo de Caixa Operacional', val: 90000, un: 'R$', ref: '> 0', sem: 'Verde' },
    { id: 'C001', cl: 'Hospital Modelo', ano: 2026, mes: 3, comp: 'Mar/26', cat: 'Performance', ind: 'Receita Líquida', val: 570000, un: 'R$', ref: '—', sem: 'Verde' },
    { id: 'C001', cl: 'Hospital Modelo', ano: 2026, mes: 3, comp: 'Mar/26', cat: 'Performance', ind: 'EBITDA', val: 104000, un: 'R$', ref: '—', sem: 'Verde' },
    { id: 'C001', cl: 'Hospital Modelo', ano: 2026, mes: 3, comp: 'Mar/26', cat: 'Performance', ind: 'Lucro Líquido', val: 69000, un: 'R$', ref: '—', sem: 'Verde' },
    { id: 'C001', cl: 'Hospital Modelo', ano: 2026, mes: 3, comp: 'Mar/26', cat: 'Liquidez', ind: 'Liquidez Corrente', val: 1.23, un: 'x', ref: '>= 1,20', sem: 'Verde' },
    { id: 'C001', cl: 'Hospital Modelo', ano: 2026, mes: 3, comp: 'Mar/26', cat: 'Liquidez', ind: 'Liquidez Seca', val: 1.031, un: 'x', ref: '>= 1,00', sem: 'Verde' },
    { id: 'C001', cl: 'Hospital Modelo', ano: 2026, mes: 3, comp: 'Mar/26', cat: 'Liquidez', ind: 'Liquidez Imediata', val: 0.28, un: 'x', ref: '>= 0,10', sem: 'Verde' },
    { id: 'C001', cl: 'Hospital Modelo', ano: 2026, mes: 3, comp: 'Mar/26', cat: 'Liquidez', ind: 'Liquidez Geral', val: 1.05, un: 'x', ref: '>= 1,00', sem: 'Verde' },
    { id: 'C001', cl: 'Hospital Modelo', ano: 2026, mes: 3, comp: 'Mar/26', cat: 'Endividamento', ind: 'Endividamento Geral', val: 0.588, un: '%', ref: '<= 60%', sem: 'Verde' },
    { id: 'C001', cl: 'Hospital Modelo', ano: 2026, mes: 3, comp: 'Mar/26', cat: 'Endividamento', ind: 'Dívida Líquida / EBITDA', val: 1.875, un: 'x', ref: '<= 2,0x', sem: 'Verde' },
    { id: 'C001', cl: 'Hospital Modelo', ano: 2026, mes: 3, comp: 'Mar/26', cat: 'Lucratividade', ind: 'Margem EBITDA', val: 0.182, un: '%', ref: '> 0%', sem: 'Verde' },
    { id: 'C001', cl: 'Hospital Modelo', ano: 2026, mes: 3, comp: 'Mar/26', cat: 'Lucratividade', ind: 'Margem Líquida', val: 0.121, un: '%', ref: '> 0%', sem: 'Verde' },
    { id: 'C001', cl: 'Hospital Modelo', ano: 2026, mes: 3, comp: 'Mar/26', cat: 'Capital de Giro', ind: 'NCG', val: 178500, un: 'R$', ref: 'Monitorar', sem: 'Amarelo' },
    { id: 'C001', cl: 'Hospital Modelo', ano: 2026, mes: 3, comp: 'Mar/26', cat: 'Capital de Giro', ind: 'Saldo de Tesouraria', val: -93500, un: 'R$', ref: '> 0', sem: 'Vermelho' },
    { id: 'C001', cl: 'Hospital Modelo', ano: 2026, mes: 3, comp: 'Mar/26', cat: 'Faturamento', ind: 'Faturamento Bruto', val: 690000, un: 'R$', ref: '—', sem: 'Verde' },
    { id: 'C001', cl: 'Hospital Modelo', ano: 2026, mes: 3, comp: 'Mar/26', cat: 'Faturamento', ind: 'Ticket Médio', val: 4800, un: 'R$', ref: '> 4000', sem: 'Verde' },
    { id: 'C001', cl: 'Hospital Modelo', ano: 2026, mes: 3, comp: 'Mar/26', cat: 'Faturamento', ind: 'PMR', val: 38, un: 'dias', ref: '<= 45', sem: 'Verde' },
    { id: 'C001', cl: 'Hospital Modelo', ano: 2026, mes: 3, comp: 'Mar/26', cat: 'Faturamento', ind: 'Inadimplência', val: 0.045, un: '%', ref: '< 5%', sem: 'Verde' },
    { id: 'C001', cl: 'Hospital Modelo', ano: 2026, mes: 3, comp: 'Mar/26', cat: 'Caixa', ind: 'Fluxo de Caixa Operacional', val: 100000, un: 'R$', ref: '> 0', sem: 'Verde' },
    { id: 'C002', cl: 'Indústria Modelo', ano: 2026, mes: 1, comp: 'Jan/26', cat: 'Performance', ind: 'Receita Líquida', val: 800000, un: 'R$', ref: '—', sem: 'Verde' },
    { id: 'C002', cl: 'Indústria Modelo', ano: 2026, mes: 1, comp: 'Jan/26', cat: 'Performance', ind: 'EBITDA', val: 130000, un: 'R$', ref: '—', sem: 'Verde' },
    { id: 'C002', cl: 'Indústria Modelo', ano: 2026, mes: 1, comp: 'Jan/26', cat: 'Performance', ind: 'Lucro Líquido', val: 72000, un: 'R$', ref: '—', sem: 'Verde' },
    { id: 'C002', cl: 'Indústria Modelo', ano: 2026, mes: 1, comp: 'Jan/26', cat: 'Faturamento', ind: 'Faturamento Bruto', val: 950000, un: 'R$', ref: '—', sem: 'Verde' },
    { id: 'C002', cl: 'Indústria Modelo', ano: 2026, mes: 1, comp: 'Jan/26', cat: 'Faturamento', ind: 'Ticket Médio', val: 12500, un: 'R$', ref: '> 10000', sem: 'Verde' },
    { id: 'C002', cl: 'Indústria Modelo', ano: 2026, mes: 1, comp: 'Jan/26', cat: 'Faturamento', ind: 'PMR', val: 55, un: 'dias', ref: '<= 60', sem: 'Amarelo' },
    { id: 'C002', cl: 'Indústria Modelo', ano: 2026, mes: 1, comp: 'Jan/26', cat: 'Faturamento', ind: 'Inadimplência', val: 0.035, un: '%', ref: '< 5%', sem: 'Verde' },
    { id: 'C002', cl: 'Indústria Modelo', ano: 2026, mes: 2, comp: 'Fev/26', cat: 'Performance', ind: 'Receita Líquida', val: 830000, un: 'R$', ref: '—', sem: 'Verde' },
    { id: 'C002', cl: 'Indústria Modelo', ano: 2026, mes: 2, comp: 'Fev/26', cat: 'Performance', ind: 'EBITDA', val: 140000, un: 'R$', ref: '—', sem: 'Verde' },
    { id: 'C002', cl: 'Indústria Modelo', ano: 2026, mes: 2, comp: 'Fev/26', cat: 'Performance', ind: 'Lucro Líquido', val: 78000, un: 'R$', ref: '—', sem: 'Verde' },
    { id: 'C002', cl: 'Indústria Modelo', ano: 2026, mes: 2, comp: 'Fev/26', cat: 'Faturamento', ind: 'Faturamento Bruto', val: 1000000, un: 'R$', ref: '—', sem: 'Verde' },
    { id: 'C002', cl: 'Indústria Modelo', ano: 2026, mes: 2, comp: 'Fev/26', cat: 'Faturamento', ind: 'Ticket Médio', val: 13000, un: 'R$', ref: '> 10000', sem: 'Verde' },
    { id: 'C002', cl: 'Indústria Modelo', ano: 2026, mes: 2, comp: 'Fev/26', cat: 'Faturamento', ind: 'PMR', val: 52, un: 'dias', ref: '<= 60', sem: 'Verde' },
    { id: 'C002', cl: 'Indústria Modelo', ano: 2026, mes: 2, comp: 'Fev/26', cat: 'Faturamento', ind: 'Inadimplência', val: 0.038, un: '%', ref: '< 5%', sem: 'Verde' },
    { id: 'C002', cl: 'Indústria Modelo', ano: 2026, mes: 3, comp: 'Mar/26', cat: 'Performance', ind: 'Receita Líquida', val: 860000, un: 'R$', ref: '—', sem: 'Verde' },
    { id: 'C002', cl: 'Indústria Modelo', ano: 2026, mes: 3, comp: 'Mar/26', cat: 'Performance', ind: 'EBITDA', val: 144000, un: 'R$', ref: '—', sem: 'Verde' },
    { id: 'C002', cl: 'Indústria Modelo', ano: 2026, mes: 3, comp: 'Mar/26', cat: 'Faturamento', ind: 'Faturamento Bruto', val: 1050000, un: 'R$', ref: '—', sem: 'Verde' },
    { id: 'C002', cl: 'Indústria Modelo', ano: 2026, mes: 3, comp: 'Mar/26', cat: 'Faturamento', ind: 'Ticket Médio', val: 13500, un: 'R$', ref: '> 10000', sem: 'Verde' },
    { id: 'C002', cl: 'Indústria Modelo', ano: 2026, mes: 3, comp: 'Mar/26', cat: 'Faturamento', ind: 'PMR', val: 50, un: 'dias', ref: '<= 60', sem: 'Verde' },
    { id: 'C002', cl: 'Indústria Modelo', ano: 2026, mes: 3, comp: 'Mar/26', cat: 'Faturamento', ind: 'Inadimplência', val: 0.032, un: '%', ref: '< 5%', sem: 'Verde' },
  ],
  bp: [
    { id: 'C001', ano: 2026, mes: 1, comp: 'Jan/26', conta: 'Ativo Circulante', val: 410000, tipo: 'ativo' },
    { id: 'C001', ano: 2026, mes: 1, comp: 'Jan/26', conta: 'Estoques', val: 70000, tipo: 'ativo' },
    { id: 'C001', ano: 2026, mes: 1, comp: 'Jan/26', conta: 'Contas a Receber', val: 210000, tipo: 'ativo' },
    { id: 'C001', ano: 2026, mes: 1, comp: 'Jan/26', conta: 'Caixa e Equivalentes', val: 85000, tipo: 'ativo' },
    { id: 'C001', ano: 2026, mes: 1, comp: 'Jan/26', conta: 'Ativo Total', val: 1250000, tipo: 'ativo' },
    { id: 'C001', ano: 2026, mes: 1, comp: 'Jan/26', conta: 'Ativo Não Circulante', val: 840000, tipo: 'ativo' },
    { id: 'C001', ano: 2026, mes: 1, comp: 'Jan/26', conta: 'Passivo Circulante', val: 360000, tipo: 'passivo' },
    { id: 'C001', ano: 2026, mes: 1, comp: 'Jan/26', conta: 'Fornecedores', val: 115000, tipo: 'passivo' },
    { id: 'C001', ano: 2026, mes: 1, comp: 'Jan/26', conta: 'Passivo Total', val: 760000, tipo: 'passivo' },
    { id: 'C001', ano: 2026, mes: 1, comp: 'Jan/26', conta: 'Dívida Bruta', val: 310000, tipo: 'passivo' },
    { id: 'C001', ano: 2026, mes: 1, comp: 'Jan/26', conta: 'Passivo Não Circulante', val: 400000, tipo: 'passivo' },
    { id: 'C001', ano: 2026, mes: 1, comp: 'Jan/26', conta: 'Patrimônio Líquido', val: 490000, tipo: 'passivo' },
    { id: 'C001', ano: 2026, mes: 2, comp: 'Fev/26', conta: 'Ativo Circulante', val: 435000, tipo: 'ativo' },
    { id: 'C001', ano: 2026, mes: 2, comp: 'Fev/26', conta: 'Ativo Total', val: 1280000, tipo: 'ativo' },
    { id: 'C001', ano: 2026, mes: 2, comp: 'Fev/26', conta: 'Passivo Total', val: 765000, tipo: 'passivo' },
    { id: 'C001', ano: 2026, mes: 2, comp: 'Fev/26', conta: 'Patrimônio Líquido', val: 515000, tipo: 'passivo' },
    { id: 'C001', ano: 2026, mes: 3, comp: 'Mar/26', conta: 'Ativo Circulante', val: 455000, tipo: 'ativo' },
    { id: 'C001', ano: 2026, mes: 3, comp: 'Mar/26', conta: 'Ativo Total', val: 1310000, tipo: 'ativo' },
    { id: 'C001', ano: 2026, mes: 3, comp: 'Mar/26', conta: 'Passivo Total', val: 770000, tipo: 'passivo' },
    { id: 'C001', ano: 2026, mes: 3, comp: 'Mar/26', conta: 'Patrimônio Líquido', val: 540000, tipo: 'passivo' },
    { id: 'C002', ano: 2026, mes: 1, comp: 'Jan/26', conta: 'Ativo Total', val: 2100000, tipo: 'ativo' },
    { id: 'C002', ano: 2026, mes: 1, comp: 'Jan/26', conta: 'Passivo Total', val: 1200000, tipo: 'passivo' },
    { id: 'C002', ano: 2026, mes: 1, comp: 'Jan/26', conta: 'Patrimônio Líquido', val: 900000, tipo: 'passivo' },
    { id: 'C002', ano: 2026, mes: 3, comp: 'Mar/26', conta: 'Ativo Total', val: 2180000, tipo: 'ativo' },
    { id: 'C002', ano: 2026, mes: 3, comp: 'Mar/26', conta: 'Passivo Total', val: 1210000, tipo: 'passivo' },
    { id: 'C002', ano: 2026, mes: 3, comp: 'Mar/26', conta: 'Patrimônio Líquido', val: 970000, tipo: 'passivo' },
  ],
  caixa: [
    { id: 'C001', ano: 2026, mes: 1, comp: 'Jan/26', cat: 'Recebimentos Operacionais', tipo: 'Entrada', desc: 'Recebimentos de clientes', val: 440000 },
    { id: 'C001', ano: 2026, mes: 1, comp: 'Jan/26', cat: 'Pagamentos Operacionais', tipo: 'Saída', desc: 'Fornecedores, folha e despesas', val: 355000 },
    { id: 'C001', ano: 2026, mes: 2, comp: 'Fev/26', cat: 'Recebimentos Operacionais', tipo: 'Entrada', desc: 'Recebimentos de clientes', val: 465000 },
    { id: 'C001', ano: 2026, mes: 2, comp: 'Fev/26', cat: 'Pagamentos Operacionais', tipo: 'Saída', desc: 'Fornecedores, folha e despesas', val: 375000 },
    { id: 'C001', ano: 2026, mes: 3, comp: 'Mar/26', cat: 'Recebimentos Operacionais', tipo: 'Entrada', desc: 'Recebimentos de clientes', val: 490000 },
    { id: 'C001', ano: 2026, mes: 3, comp: 'Mar/26', cat: 'Pagamentos Operacionais', tipo: 'Saída', desc: 'Fornecedores, folha e despesas', val: 390000 },
    { id: 'C002', ano: 2026, mes: 1, comp: 'Jan/26', cat: 'Recebimentos Operacionais', tipo: 'Entrada', desc: 'Recebimentos de clientes', val: 700000 },
    { id: 'C002', ano: 2026, mes: 1, comp: 'Jan/26', cat: 'Pagamentos Operacionais', tipo: 'Saída', desc: 'Fornecedores, folha e despesas', val: 590000 },
    { id: 'C002', ano: 2026, mes: 2, comp: 'Fev/26', cat: 'Recebimentos Operacionais', tipo: 'Entrada', desc: 'Recebimentos de clientes', val: 720000 },
    { id: 'C002', ano: 2026, mes: 2, comp: 'Fev/26', cat: 'Pagamentos Operacionais', tipo: 'Saída', desc: 'Fornecedores, folha e despesas', val: 610000 },
    { id: 'C002', ano: 2026, mes: 3, comp: 'Mar/26', cat: 'Recebimentos Operacionais', tipo: 'Entrada', desc: 'Recebimentos de clientes', val: 745000 },
    { id: 'C002', ano: 2026, mes: 3, comp: 'Mar/26', cat: 'Pagamentos Operacionais', tipo: 'Saída', desc: 'Fornecedores, folha e despesas', val: 620000 },
  ],
  fluxoCaixaDetalhado: {
    'C001': {
      Fluxo_Diario: Array.from({ length: 122 }, (_, i) => {
        const date = new Date(2026, 2, 1);
        date.setDate(date.getDate() + i);
        return {
          "Data": date.toISOString().split('T')[0],
          "Saldo Inicial": i === 0 ? -1200000 : 0, // Simplified chain
          "Entradas": Math.floor(Math.random() * 50000) + 10000,
          "Saídas": Math.floor(Math.random() * 40000) + 15000,
          "Saldo Final": 0 // Will be calculated in component or pre-computed
        };
      }).map((row, i, arr) => {
        // Simple chain calculation
        if (i > 0) {
          row["Saldo Inicial"] = (arr[i-1] as any)["Saldo Final"];
        }
        row["Saldo Final"] = row["Saldo Inicial"] + row["Entradas"] - row["Saídas"];
        return row;
      }),
      Contas_Receber: [
        { "Vencimento": "2026-03-25", "Cliente": "Convênio Estrela", "Valor": 125000, "Status": "A Receber" },
        { "Vencimento": "2026-03-28", "Cliente": "Particular", "Valor": 12000, "Status": "Recebido" },
        { "Vencimento": "2026-04-05", "Cliente": "SUS - Repasse", "Valor": 450000, "Status": "A Receber" },
      ],
      Contas_Pagar: [
        { "Vencimento": "2026-03-22", "Fornecedor": "Energia Co.", "Valor": 45000, "Status": "Pago", "Observação": "Fatura Março" },
        { "Vencimento": "2026-03-24", "Fornecedor": "MedSupplies", "Valor": 89000, "Status": "A Vencer", "Observação": "Insumos Cirúrgicos" },
        { "Vencimento": "2026-03-10", "Fornecedor": "Limpeza Ltda", "Valor": 15000, "Status": "Vencido", "Observação": "Serviços Terceirizados" },
      ],
      Passivo_Vencido: [
        { "Credor": "Banco Nacional", "Valor": 850000, "Tipo": "Empréstimo", "Vencimento": "2025-12-30" },
        { "Credor": "Fisco Federal", "Valor": 350000, "Tipo": "Impostos", "Vencimento": "2026-01-15" },
      ],
      KPIs: [
        { "Indicador": "Burn rate médio diário", "Fórmula / Valor": 22500 },
        { "Indicador": "Dias de caixa", "Fórmula / Valor": -53 },
      ]
    }
  },
  contasPagar: [
    { id: '1', clientId: 'C001', fornecedor: 'Energia Co.', documento: '2026/055', emissao: '2026-03-01', vencimento: '2026-03-22', valor: 45000, status: 'Pago' },
    { id: '2', clientId: 'C001', fornecedor: 'MedSupplies', documento: 'NF-889', emissao: '2026-03-10', vencimento: '2026-03-24', valor: 89000, status: 'A vencer' },
    { id: '3', clientId: 'C001', fornecedor: 'Limpeza Ltda', documento: 'SERV-01', emissao: '2026-02-15', vencimento: '2026-03-10', valor: 15000, status: 'Em atraso' },
    { id: '4', clientId: 'C001', fornecedor: 'Aluguel Imóveis', documento: 'ALQ-03', emissao: '2026-03-01', vencimento: '2026-04-01', valor: 25000, status: 'A vencer' },
    { id: '5', clientId: 'C001', fornecedor: 'Folha de Pagamento', documento: 'FOL-03', emissao: '2026-03-25', vencimento: '2026-04-05', valor: 185000, status: 'A vencer' },
    { id: '6', clientId: 'C001', fornecedor: 'MedSupplies', documento: 'NF-902', emissao: '2026-03-15', vencimento: '2026-04-10', valor: 42000, status: 'A vencer' },
  ],
  contasReceber: [
    { id: '1', clientId: 'C001', cliente: 'Convênio Estrela', documento: 'FAT-2026-001', emissao: '2026-03-01', vencimento: '2026-03-25', valor: 125000, status: 'A vencer' },
    { id: '2', clientId: 'C001', cliente: 'Particular', documento: 'REC-552', emissao: '2026-03-10', vencimento: '2026-03-28', valor: 12000, status: 'Pago' },
    { id: '3', clientId: 'C001', cliente: 'SUS - Repasse', documento: 'REP-MAR', emissao: '2026-03-01', vencimento: '2026-04-05', valor: 450000, status: 'A vencer' },
    { id: '4', clientId: 'C001', cliente: 'Convênio Estrela', documento: 'FAT-2026-002', emissao: '2026-03-15', vencimento: '2026-04-10', valor: 88000, status: 'A vencer' },
    { id: '5', clientId: 'C001', cliente: 'Particular', documento: 'REC-553', emissao: '2026-03-20', vencimento: '2026-03-20', valor: 5000, status: 'Em atraso' },
  ],
  viabilidade: [
    { 
      proj: 'P001', 
      cl: 'C001', 
      nome: 'Novo Serviço Diagnóstico', 
      tir: '8,97% a.m.', 
      vpl: 'R$ 157.077', 
      payback: '0 anos, 7 meses e 24 dias', 
      paybackMesNum: 7.8,
      il: '1,63', 
      conclusao: 'Viável',
      fluxo: [
        { mes: 0, valor: -250000, acumulado: -250000 },
        { mes: 1, valor: 35000, acumulado: -215000 },
        { mes: 2, valor: 35000, acumulado: -180000 },
        { mes: 3, valor: 38000, acumulado: -142000 },
        { mes: 4, valor: 40000, acumulado: -102000 },
        { mes: 5, valor: 42000, acumulado: -60000 },
        { mes: 6, valor: 42000, acumulado: -180000 }, // Wait, accumulated should be sum. 
        // Let's fix the accumulation
        { mes: 0, valor: -250000, acumulado: -250000 },
        { mes: 1, valor: 32000, acumulado: -218000 },
        { mes: 2, valor: 32000, acumulado: -186000 },
        { mes: 3, valor: 32000, acumulado: -154000 },
        { mes: 4, valor: 32000, acumulado: -122000 },
        { mes: 5, valor: 32000, acumulado: -90000 },
        { mes: 6, valor: 32000, acumulado: -58000 },
        { mes: 7, valor: 32000, acumulado: -26000 },
        { mes: 8, valor: 32000, acumulado: 6000 }, // Payback here
        { mes: 9, valor: 35000, acumulado: 41000 },
        { mes: 10, valor: 35000, acumulado: 76000 },
        { mes: 11, valor: 35000, acumulado: 111000 },
        { mes: 12, valor: 35000, acumulado: 146000 },
      ].filter((v, i, a) => i === a.findIndex(t => t.mes === v.mes)) // Cleanup duplicates from my thought process
    },
    { 
      proj: 'P002', 
      cl: 'C002', 
      nome: 'Nova Linha Produtiva', 
      tir: '8,39% a.m.', 
      vpl: 'R$ 269.262', 
      payback: '0 anos, 7 meses e 12 dias',
      paybackMesNum: 7.4, 
      il: '1,54', 
      conclusao: 'Viável',
      fluxo: [
        { mes: 0, valor: -500000, acumulado: -500000 },
        { mes: 1, valor: 65000, acumulado: -435000 },
        { mes: 2, valor: 65000, acumulado: -370000 },
        { mes: 3, valor: 65000, acumulado: -305000 },
        { mes: 4, valor: 65000, acumulado: -240000 },
        { mes: 5, valor: 65000, acumulado: -175000 },
        { mes: 6, valor: 65000, acumulado: -110000 },
        { mes: 7, valor: 65000, acumulado: -45000 },
        { mes: 8, valor: 65000, acumulado: 20000 }, // Payback around 8 months
        { mes: 9, valor: 70000, acumulado: 90000 },
        { mes: 10, valor: 70000, acumulado: 160000 },
        { mes: 11, valor: 70000, acumulado: 230000 },
        { mes: 12, valor: 70000, acumulado: 300000 },
      ]
    },
  ],
  emprestimos: [
    {
      id: 'L001',
      cl: 'C001',
      empresa: "HOSPITAL SOBRASA",
      titulo: "Contrato 00331918300000017630 - Santander",
      motivo: "CDC Conversão Conta Garantia 800K + Capital de Giro 200K",
      valorEmprestimo: 1000000,
      parcelaMensal: 37638.92,
      periodoMeses: 36,
      taxaMensal: 0.017441315526512284,
      dataPrimeiroVencimento: "2026-01-22",
      pagosInicialmente: 3,
    }
  ],
  premissas: {
    tributarias: {
      simplesNacional: [
        { 
          anexo: 'I (Comércio)', 
          descricao: 'Empresas de comércio (lojas, varejo, etc.)',
          faixas: [
            { ate: 180000, aliq: 0.04, deducao: 0 },
            { ate: 360000, aliq: 0.073, deducao: 5940 },
            { ate: 720000, aliq: 0.095, deducao: 13860 },
            { ate: 1800000, aliq: 0.107, deducao: 22500 },
            { ate: 3600000, aliq: 0.143, deducao: 87300 },
            { ate: 4800000, aliq: 0.19, deducao: 378000 }
          ]
        },
        { 
          anexo: 'II (Indústria)', 
          descricao: 'Indústrias e fábricas em geral',
          faixas: [
            { ate: 180000, aliq: 0.045, deducao: 0 },
            { ate: 360000, aliq: 0.078, deducao: 5940 },
            { ate: 720000, aliq: 0.10, deducao: 13860 },
            { ate: 1800000, aliq: 0.112, deducao: 22500 },
            { ate: 3600000, aliq: 0.147, deducao: 85500 },
            { ate: 4800000, aliq: 0.30, deducao: 720000 }
          ]
        },
        { 
          anexo: 'III (Serviços)', 
          descricao: 'Locação de bens móveis, serviços de creche, agências de viagem, escritórios contábeis, medicina, etc.',
          fatorR: 'Aplicável: Se Fator R >= 28%, tributa por este anexo. Caso contrário, Anexo V.',
          faixas: [
            { ate: 180000, aliq: 0.06, deducao: 0 },
            { ate: 360000, aliq: 0.112, deducao: 9360 },
            { ate: 720000, aliq: 0.135, deducao: 17640 },
            { ate: 1800000, aliq: 0.16, deducao: 35640 },
            { ate: 3600000, aliq: 0.21, deducao: 125640 },
            { ate: 4800000, aliq: 0.33, deducao: 648000 }
          ]
        },
        { 
          anexo: 'IV (Serviços)', 
          descricao: 'Construção civil, serviços de vigilância, limpeza, advocacia, etc.',
          obs: 'Não inclui a CPP (Contribuição Patronal Previdenciária) na guia do Simples.',
          faixas: [
            { ate: 180000, aliq: 0.045, deducao: 0 },
            { ate: 360000, aliq: 0.09, deducao: 8100 },
            { ate: 720000, aliq: 0.102, deducao: 12420 },
            { ate: 1800000, aliq: 0.14, deducao: 39780 },
            { ate: 3600000, aliq: 0.22, deducao: 183780 },
            { ate: 4800000, aliq: 0.33, deducao: 828000 }
          ]
        },
        { 
          anexo: 'V (Serviços)', 
          descricao: 'Auditoria, jornalismo, tecnologia, publicidade, engenharia, etc.',
          fatorR: 'Aplicável: Se Fator R < 28%, tributa por este anexo. Caso contrário, Anexo III.',
          faixas: [
            { ate: 180000, aliq: 0.155, deducao: 0 },
            { ate: 360000, aliq: 0.18, deducao: 4500 },
            { ate: 720000, aliq: 0.195, deducao: 9900 },
            { ate: 1800000, aliq: 0.205, deducao: 17100 },
            { ate: 3600000, aliq: 0.23, deducao: 62100 },
            { ate: 4800000, aliq: 0.305, deducao: 540000 }
          ]
        }
      ],
      lucroPresumido: {
        presuncao: [
          { atividade: 'Revenda de Combustíveis (Gasolina e Diesel)', irpj: 0.016, csll: 0.12 },
          { atividade: 'Venda de produtos / Mercadorias', irpj: 0.08, csll: 0.12 },
          { atividade: 'Atividades imobiliárias (Loteamento, incorporação)', irpj: 0.08, csll: 0.12 },
          { atividade: 'Serviços de transporte (exceto de carga)', irpj: 0.16, csll: 0.12 },
          { atividade: 'Serviços de transporte de carga', irpj: 0.08, csll: 0.12 },
          { atividade: 'Serviços Hospitalares e Auxiliares de Diagnóstico', irpj: 0.08, csll: 0.12 },
          { atividade: 'Serviços em Geral (Profissões Regulamentadas)', irpj: 0.32, csll: 0.32 },
          { atividade: 'Intermediação de Negócios', irpj: 0.32, csll: 0.32 },
          { atividade: 'Administração, locação ou cessão de bens e direitos', irpj: 0.32, csll: 0.32 }
        ],
        federal: [
          { imposto: 'IRPJ', base: 0.32, aliq: 0.15 },
          { imposto: 'CSLL', base: 0.32, aliq: 0.09 },
          { imposto: 'PIS', base: 1.0, aliq: 0.0065 },
          { imposto: 'COFINS', base: 1.0, aliq: 0.03 }
        ],
        municipal: { imposto: 'ISS', aliq_min: 0.02, aliq_max: 0.05 }
      },
      lucroReal: {
        modelos: [
          {
            nome: 'Não Cumulativo',
            descricao: 'Regra geral para empresas do Lucro Real. Permite o desconto de créditos sobre insumos, energia, aluguéis, etc.',
            pis: 0.0165,
            cofins: 0.076,
            obs: 'Crédito permitido sobre aquisições.'
          },
          {
            nome: 'Cumulativo',
            descricao: 'Aplicável a exceções específicas (ex: receitas de telemarketing, transporte de passageiros, etc.)',
            pis: 0.0065,
            cofins: 0.03,
            obs: 'Sem direito a crédito sobre insumos.'
          },
          {
            nome: 'Híbrido (Misto)',
            descricao: 'Quando a empresa possui receitas tributadas em ambos os regimes (cumulativo e não cumulativo).',
            pis: 'Variável',
            cofins: 'Variável',
            obs: 'Exige segregação de receitas e créditos.'
          }
        ],
        federal: [
          { imposto: 'IRPJ', aliq: 0.15, adicional: 0.10, teto_mensal: 20000, base: 'Lucro Líquido Ajustado' },
          { imposto: 'CSLL', aliq: 0.09, base: 'Lucro Líquido Ajustado' }
        ]
      }
    },
    economicas: [
      { 
        categoria: 'Taxas de Juros e Política Monetária',
        fonte: 'BCB - Histórico de Taxas',
        url: 'https://www.bcb.gov.br/controleinflacao/historicotaxasjuros',
        historico: [
          { data: 'Nov/25', valor: 14.25 },
          { data: 'Jan/26', valor: 14.50 },
          { data: 'Mar/26', valor: 14.65 },
          { data: 'Mai/26', valor: 14.65 }
        ],
        indicadores: [
          { nome: 'Taxa Selic Vigente', valor: '14.65% a.a.', status: 'Estável', obs: 'Referência: Maio/2026' },
          { nome: 'Meta Selic (Próximo Período)', valor: '14.50% a.a.', status: 'Expectativa de Redução', obs: 'Expectativa Copom Focus' },
          { nome: 'CDI Over', valor: '14.55% a.a.', status: 'Sincronizado', obs: 'Média de mercado' }
        ]
      },
      { 
        categoria: 'Tesouro Direto (Rendimento de Títulos)',
        fonte: 'Tesouro Nacional',
        url: 'https://tesourodireto.com.br/produtos/dados-sobre-titulos/rendimento-dos-titulos',
        indicadores: [
          { nome: 'Tesouro Selic 2029', valor: 'Selic + 0.16%', status: 'Alta Demanda', obs: 'Taxa indicativa' },
          { nome: 'Tesouro IPCA+ 2035', valor: '6.22% + IPCA', status: 'Rendimento Real', obs: 'Proteção IPC' },
          { nome: 'Tesouro Prefixado 2026', valor: '11.12% a.a.', status: 'Vencimento Próximo', obs: 'Garantido no vencimento' }
        ]
      },
      { 
        categoria: 'Inflação e Metas (BCB)',
        fonte: 'BCB - Metas de Inflação',
        url: 'https://www.bcb.gov.br/controleinflacao/metainflacao',
        indicadores: [
          { nome: 'Meta de Inflação 2026', valor: '3.00%', status: 'Vigente', obs: 'CMN' },
          { nome: 'Intervalo de Tolerância', valor: '+/- 1.50%', status: 'Vigente', obs: 'Limite Superior: 4.5%' },
          { nome: 'IPCA Esperado (Focus)', valor: '3.85%', status: 'Alinhado', obs: 'Expectativa do Mercado 2026' }
        ]
      },
      { 
        categoria: 'Dados FGV CEQEF (Database)',
        fonte: 'FGV IBRE - CEQEF',
        url: 'https://ceqef.fgv.br/banco-de-dados',
        indicadores: [
          { nome: 'Equity Risk Premium (ERP)', valor: '8.19%', status: 'Atualizado', obs: 'Ref: Fevereiro/2026' },
          { nome: 'IGP-M (Acumulado Mensal)', valor: '0.89%', status: 'Alta', obs: 'Ref: Maio/2026' },
          { nome: 'ICE (Clima Econômico)', valor: '96.2 pts', status: 'Recuperação', obs: 'Ref: Abril/2026' },
          { nome: 'IE (Expectativas)', valor: '98.9 pts', status: 'Otimista', obs: 'Ref: Maio/2026' }
        ]
      },
      { 
        categoria: 'Câmbio e Moedas Estrangeiras',
        fonte: 'Mercado Financeiro (Fechamento Comercial)',
        url: 'https://www.infomoney.com.br/ferramentas/cambio/',
        historico: [
          { data: 'Mai/21', valor: 5.23, label: 'Dólar' },
          { data: 'Nov/21', valor: 5.61, label: 'Dólar' },
          { data: 'Mai/22', valor: 4.80, label: 'Dólar' },
          { data: 'Nov/22', valor: 5.31, label: 'Dólar' },
          { data: 'Mai/23', valor: 4.98, label: 'Dólar' },
          { data: 'Nov/23', valor: 4.85, label: 'Dólar' },
          { data: 'Mai/24', valor: 5.07, label: 'Dólar' },
          { data: 'Nov/24', valor: 5.48, label: 'Dólar' },
          { data: 'Mai/25', valor: 5.25, label: 'Dólar' },
          { data: 'Nov/25', valor: 5.18, label: 'Dólar' },
          { data: 'Mar/26', valor: 5.32, label: 'Dólar' },
          { data: 'Mai/26', valor: 5.3850, label: 'Dólar' }
        ],
        indicadores: [
          { nome: 'Dólar Comercial (Fechamento)', valor: 'R$ 5,385', status: 'Alta', obs: 'Fechamento Real: 04/05/2026' },
          { nome: 'Euro Comercial (Fechamento)', valor: 'R$ 5,824', status: 'Alta', obs: 'Fechamento Real: 04/05/2026' },
          { nome: 'Variação Cambial Mensal', valor: '+1.12%', status: 'Alerta', obs: 'Reflete prêmio de risco' }
        ]
      }
    ]
  },
  accountPlanPadrão: [
    { code: '1', name: 'Ativo', type: 'Ativo', level: 1, status: 'Ativa' },
    { code: '1.1', name: 'Ativo Circulante', type: 'Ativo', level: 2, parentCode: '1', kpiMapping: 'ativo_circulante' },
    { code: '1.1.01', name: 'Caixa e Equivalentes', type: 'Ativo', level: 3, parentCode: '1.1', kpiMapping: 'disponibilidades' },
    { code: '1.1.01.01', name: 'Caixa Geral', type: 'Ativo', level: 4, parentCode: '1.1.01' },
    { code: '1.1.01.02', name: 'Bancos Conta Movimento', type: 'Ativo', level: 4, parentCode: '1.1.01' },
    { code: '1.1.01.03', name: 'Aplicações de Liquidez Imediata', type: 'Ativo', level: 4, parentCode: '1.1.01' },
    { code: '1.1.02', name: 'Contas a Receber', type: 'Ativo', level: 3, parentCode: '1.1', kpiMapping: 'contas_receber' },
    { code: '1.1.02.01', name: 'Clientes Nacionais', type: 'Ativo', level: 4, parentCode: '1.1.02' },
    { code: '1.1.02.02', name: 'Clientes Estrangeiros', type: 'Ativo', level: 4, parentCode: '1.1.02' },
    { code: '1.1.02.03', name: 'Contas a Receber - Clientes Específicos', type: 'Ativo', level: 4, parentCode: '1.1.02' },
    { code: '1.1.02.04', name: '(-) Provisão para Devedores Duvidosos', type: 'Ativo', level: 4, parentCode: '1.1.02' },
    { code: '1.1.03', name: 'Estoques', type: 'Ativo', level: 3, parentCode: '1.1', kpiMapping: 'estoque' },
    { code: '1.1.03.01', name: 'Mercadorias para Revenda', type: 'Ativo', level: 4, parentCode: '1.1.03' },
    { code: '1.1.03.02', name: 'Matérias-Primas', type: 'Ativo', level: 4, parentCode: '1.1.03' },
    { code: '1.1.03.03', name: 'Insumos e Outros Almoxarifados', type: 'Ativo', level: 4, parentCode: '1.1.03' },
    { code: '1.1.04', name: 'Impostos a Recuperar', type: 'Ativo', level: 3, parentCode: '1.1' },
    { code: '1.1.04.01', name: 'ICMS/IPI a Recuperar', type: 'Ativo', level: 4, parentCode: '1.1.04' },
    { code: '1.1.04.02', name: 'PIS/COFINS a Recuperar', type: 'Ativo', level: 4, parentCode: '1.1.04' },
    { code: '1.2', name: 'Ativo Não Circulante', type: 'Ativo', level: 2, parentCode: '1' },
    { code: '1.2.01', name: 'Investimentos', type: 'Ativo', level: 3, parentCode: '1.2' },
    { code: '1.2.02', name: 'Imobilizado', type: 'Ativo', level: 3, parentCode: '1.2' },
    { code: '1.2.03', name: 'Intangível', type: 'Ativo', level: 3, parentCode: '1.2' },
    { code: '2', name: 'Passivo', type: 'Passivo', level: 1, status: 'Ativa' },
    { code: '2.1', name: 'Passivo Circulante', type: 'Passivo', level: 2, parentCode: '2', kpiMapping: 'passivo_circulante' },
    { code: '2.1.01', name: 'Fornecedores', type: 'Passivo', level: 3, parentCode: '2.1', kpiMapping: 'contas_pagar' },
    { code: '2.1.01.01', name: 'Fornecedores Nacionais', type: 'Passivo', level: 4, parentCode: '2.1.01' },
    { code: '2.1.01.02', name: 'Fornecedores Estrangeiros', type: 'Passivo', level: 4, parentCode: '2.1.01' },
    { code: '2.1.02', name: 'Salários e Encargos', type: 'Passivo', level: 3, parentCode: '2.1' },
    { code: '2.1.02.01', name: 'Salários a Pagar', type: 'Passivo', level: 4, parentCode: '2.1.02' },
    { code: '2.1.02.02', name: 'FGTS/INSS a Recolher', type: 'Passivo', level: 4, parentCode: '2.1.02' },
    { code: '2.1.02.03', name: 'Provisões Trabalhistas (13º/Férias)', type: 'Passivo', level: 4, parentCode: '2.1.02' },
    { code: '2.1.03', name: 'Impostos a Recolher', type: 'Passivo', level: 3, parentCode: '2.1' },
    { code: '2.1.03.01', name: 'Impostos sobre Faturamento', type: 'Passivo', level: 4, parentCode: '2.1.03', kpiMapping: 'deducoes' },
    { code: '2.1.03.02', name: 'IRPJ/CSLL a Recolher', type: 'Passivo', level: 4, parentCode: '2.1.03', kpiMapping: 'impostos_lucro' },
    { code: '2.1.03.03', name: 'Retenções na Fonte (ISS/IRRF/Outros)', type: 'Passivo', level: 4, parentCode: '2.1.03' },
    { code: '2.1.04', name: 'Empréstimos e Financiamentos CP', type: 'Passivo', level: 3, parentCode: '2.1', kpiMapping: 'resultado_financeiro' },
    { code: '2.1.04.01', name: 'Parcelas de Empréstimos Bancários CP', type: 'Passivo', level: 4, parentCode: '2.1.04' },
    { code: '2.1.04.02', name: 'Juros a Pagar', type: 'Passivo', level: 4, parentCode: '2.1.04' },
    { code: '2.2', name: 'Passivo Não Circulante', type: 'Passivo', level: 2, parentCode: '2' },
    { code: '3', name: 'Patrimônio Líquido', type: 'Patrimônio Líquido', level: 1, status: 'Ativa' },
    { code: '3.1', name: 'Capital Social', type: 'Patrimônio Líquido', level: 2, parentCode: '3' },
    { code: '3.2', name: 'Reservas de Lucros', type: 'Patrimônio Líquido', level: 2, parentCode: '3' },
    { code: '3.3', name: 'Lucros ou Prejuízos Acumulados', type: 'Patrimônio Líquido', level: 2, parentCode: '3' },
    { code: '4', name: 'Receitas', type: 'Receita', level: 1, status: 'Ativa' },
    { code: '4.1', name: 'Receita Bruta de Vendas', type: 'Receita', level: 2, parentCode: '4', kpiMapping: 'faturamento_bruto' },
    { code: '4.2', name: 'Receita de Serviços', type: 'Receita', level: 2, parentCode: '4' },
    { code: '4.3', name: '(-) Deduções da Receita Bruta', type: 'Receita', level: 2, parentCode: '4', kpiMapping: 'deducoes' },
    { code: '4.4', name: 'Receita Líquida', type: 'Receita', level: 2, parentCode: '4', kpiMapping: 'receita_liquida' },
    { code: '5', name: 'Custos', type: 'Custo', level: 1, status: 'Ativa' },
    { code: '5.1', name: 'CPV / CSP', type: 'Custo', level: 2, parentCode: '5', kpiMapping: 'custos_variaveis' },
    { code: '6', name: 'Despesas', type: 'Despesa', level: 1, status: 'Ativa' },
    { code: '6.1', name: 'Despesas Administrativas', type: 'Despesa', level: 2, parentCode: '6', kpiMapping: 'despesas_operacionais' },
    { code: '6.1.01', name: 'Despesas com Pessoal Administrativo', type: 'Despesa', level: 3, parentCode: '6.1', kpiMapping: 'despesas_pessoal' },
    { code: '6.1.02', name: 'Ocupação e Utilidades', type: 'Despesa', level: 3, parentCode: '6.1' },
    { code: '6.2', name: 'Despesas com Vendas', type: 'Despesa', level: 2, parentCode: '6' },
    { code: '6.2.01', name: 'Marketing e Publicidade', type: 'Despesa', level: 3, parentCode: '6.2', kpiMapping: 'marketing_vendas' },
    { code: '6.2.02', name: 'Comissões de Vendas', type: 'Despesa', level: 3, parentCode: '6.2' },
    { code: '6.3', name: 'Despesas Financeiras', type: 'Despesa', level: 2, parentCode: '6', kpiMapping: 'resultado_financeiro' },
    { code: '6.3.01', name: 'Juros e Variações Monetárias', type: 'Despesa', level: 3, parentCode: '6.3' },
    { code: '6.3.02', name: 'Taxas e Tarifas Bancárias', type: 'Despesa', level: 3, parentCode: '6.3' },
    { code: '7', name: 'Lucro Líquido', type: 'Performance', level: 1, status: 'Ativa', kpiMapping: 'lucro_liquido' },
  ],
  compras: [
    { 
      id: '1', 
      clientId: 'C001', 
      produto: 'Gases Medicinais', 
      centroCusto: 'UTI Adulto', 
      qtd: 150, 
      fornecedores: [
        { nome: 'AirLiquide', valorUnit: 45.0, selecionado: true },
        { nome: 'White Martins', valorUnit: 52.0, selecionado: false },
        { nome: 'IBG', valorUnit: 48.5, selecionado: false }
      ]
    },
    { 
      id: '2', 
      clientId: 'C001', 
      produto: 'Luvas de Procedimento', 
      centroCusto: 'Almoxarifado Geral', 
      qtd: 2000, 
      fornecedores: [
        { nome: 'Medix', valorUnit: 0.18, selecionado: false },
        { nome: 'Talge', valorUnit: 0.15, selecionado: true },
        { nome: 'Supermax', valorUnit: 0.22, selecionado: false }
      ]
    },
    { 
      id: '3', 
      clientId: 'C001', 
      produto: 'Soro Fisiológico 500ml', 
      centroCusto: 'Centro Cirúrgico', 
      qtd: 800, 
      fornecedores: [
        { nome: 'Eurofarma', valorUnit: 3.20, selecionado: true },
        { nome: 'Fresenius', valorUnit: 3.55, selecionado: false },
        { nome: 'B. Braun', valorUnit: 3.80, selecionado: false }
      ]
    }
  ],
  posicaoFinanceira: [
    {
      id: '1',
      clientId: 'C001',
      banco: 'Itaú Unibanco',
      tipoConta: 'Conta Corrente PJ',
      saldoInicial: 120000,
      saldoAtual: 145000,
      dataAtualizacao: '2026-05-04',
      historico: [
        { mes: 'Jan', saldo: 110000 },
        { mes: 'Fev', saldo: 115000 },
        { mes: 'Mar', saldo: 120000 },
        { mes: 'Abr', saldo: 138000 },
        { mes: 'Mai', saldo: 145000 }
      ]
    },
    {
      id: '2',
      clientId: 'C001',
      banco: 'Banco do Brasil',
      tipoConta: 'Conta Convênio SUS',
      saldoInicial: 450000,
      saldoAtual: 420000,
      dataAtualizacao: '2026-05-04',
      historico: [
        { mes: 'Jan', saldo: 400000 },
        { mes: 'Fev', saldo: 430000 },
        { mes: 'Mar', saldo: 450000 },
        { mes: 'Abr', saldo: 440000 },
        { mes: 'Mai', saldo: 420000 }
      ]
    },
    {
      id: '3',
      clientId: 'C001',
      banco: 'XP Investimentos',
      tipoConta: 'Aplicação CDB/Liquidez',
      saldoInicial: 800000,
      saldoAtual: 812000,
      dataAtualizacao: '2026-05-04',
      historico: [
        { mes: 'Jan', saldo: 780000 },
        { mes: 'Fev', saldo: 790000 },
        { mes: 'Mar', saldo: 800000 },
        { mes: 'Abr', saldo: 805000 },
        { mes: 'Mai', saldo: 812000 }
      ]
    }
  ]
};

export const modelData = {
  fileName: "Modelo_Viabilidade_v1.xlsx",
  inputs: [
    ["Premissa", "Valor", "Unidade", "Descritivo", "", "", "", ""],
    ["Crescimento Anual", 0.15, "%", "Estimativa conservadora de market share", "", "", "", ""],
    ["Taxa de Desconto (WACC)", 0.12, "%", "Custo médio ponderado de capital", "", "", "", ""],
    ["Investimento Inicial", 2500000, "R$", "Capex total para estrutura", "", "", "", ""],
    ["Imposto de Renda", 0.15, "%", "Aliquota padrão (IRPJ + Adicional)", "", "", "", ""],
    ["CSLL", 0.09, "%", "Contribuição Social sobre Lucro Líquido", "", "", "", ""],
    ["Capital de Giro (DSO)", 45, "dias", "Prazo médio de recebimento", "", "", "", ""],
    ["Inflação Projetada", 0.045, "%", "IPCA médio esperado", "", "", "", ""],
  ],
  dreAnual: {
    headers: [2026, 2027, 2028, 2029, 2030],
    rows: [
      { item: "Receita Operacional Bruta", values: [12000000, 13800000, 15870000, 18250500, 20988075] },
      { item: "Impostos s/ Faturamento", values: [-1800000, -2070000, -2380500, -2737575, -3148211] },
      { item: "Receita Líquida", values: [10200000, 11730000, 13489500, 15512925, 17839864] },
      { item: "CPV (Custos)", values: [-5100000, -5865000, -6744750, -7756463, -8919932] },
      { item: "Lucro Bruto", values: [5100000, 5865000, 6744750, 7756463, 8919932] },
      { item: "Despesas Administrativas", values: [-1200000, -1320000, -1452000, -1597200, -1756920] },
      { item: "Investimentos em Marketing", values: [-600000, -690000, -793500, -912525, -1049404] },
      { item: "EBITDA", values: [3300000, 3855000, 4499250, 5246738, 6113608] },
      { item: "Depreciação e Amortização", values: [-250000, -250000, -250000, -250000, -250000] },
      { item: "Lucro Operacional - EBIT", values: [3050000, 3605000, 4249250, 4996738, 5863608] },
      { item: "Resultado Financeiro", values: [-150000, -135000, -121500, -109350, -98415] },
      { item: "LAIR", values: [2900000, 3470000, 4127750, 4887388, 5765193] },
      { item: "Imposto de Renda / CSLL", values: [-986000, -1179800, -1403435, -1661712, -1960166] },
      { item: "Lucro Líquido", values: [1914000, 2290200, 2724315, 3225676, 3805027] },
    ]
  },
  dreMensal: {
    headers: Array.from({ length: 60 }, (_, i) => ({ mes: (i % 12) + 1, ano: 2026 + Math.floor(i / 12) })),
    rows: [
      { item: "Receita Operacional Bruta", sign: "+", values: Array.from({ length: 60 }, (_, i) => 1000000 * Math.pow(1.012, i)) },
      { item: "Custos de Venda", sign: "-", values: Array.from({ length: 60 }, (_, i) => -425000 * Math.pow(1.012, i)) },
      { item: "Margem de Contribuição", sign: "=", values: Array.from({ length: 60 }, (_, i) => 575000 * Math.pow(1.012, i)) },
      { item: "Despesas Fixas", sign: "-", values: Array.from({ length: 60 }, () => -180000) },
      { item: "EBITDA Mensal", sign: "=", values: Array.from({ length: 60 }, (_, i) => (575000 * Math.pow(1.012, i)) - 180000) },
    ]
  },
  bpAnual: {
    headers: [2026, 2027, 2028, 2029, 2030],
    rows: [
      { item: "Caixa", values: [1200000, 2800000, 4950000, 7800000, 11200000] },
      { item: "Ativos Permanentes", values: [2250000, 2000000, 1750000, 1500000, 1250000] },
      { item: "Total de Ativos", values: [3450000, 4800000, 6700000, 9300000, 12450000] },
      { item: "Empréstimos Bancários", values: [1500000, 1200000, 900000, 600000, 300000] },
      { item: "Patrimônio Líquido", values: [1950000, 3600000, 5800000, 8700000, 12150000] },
    ]
  }
};
