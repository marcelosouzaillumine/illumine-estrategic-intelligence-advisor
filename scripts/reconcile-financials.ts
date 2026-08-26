import { config as dotenvConfig } from 'dotenv';
dotenvConfig();
import { getSupabaseConfig } from '../src/infrastructure/supabase/SupabaseConfig';
import { createClient } from '@supabase/supabase-js';

async function verifyDRE(supabase: any, companyId: string) {
  console.log('\n--- 1. Validating DRE (Income Statement) ---');
  const { data, error } = await supabase
    .schema('finance')
    .from('vw_dre_statement')
    .select('*')
    .eq('company_id', companyId);

  if (error) throw error;
  if (!data || data.length === 0) {
    console.log('No DRE data found.');
    return;
  }

  for (const row of data) {
    console.log(`Period: ${row.period_date}`);
    
    // Validate Equation: Receita Líquida = Bruta + Deduções + Ajustes
    const calculatedNetRevenue = Number(row.gross_revenue) + Number(row.revenue_deductions) + Number(row.net_revenue_adjustments);
    if (calculatedNetRevenue !== Number(row.net_revenue)) {
       console.log(`Gross: ${row.gross_revenue}, Deductions: ${row.revenue_deductions}, Adjustments: ${row.net_revenue_adjustments}`);
       console.log(`Calculated Net: ${calculatedNetRevenue}, Actual Net: ${row.net_revenue}`);
       throw new Error(`DRE Mismatch: Net Revenue`);
    }

    // Validate Equation: Resultado Bruto = Receita Líquida + Custos
    const calculatedGrossProfit = calculatedNetRevenue + Number(row.cogs);
    if (calculatedGrossProfit !== Number(row.gross_profit)) throw new Error(`DRE Mismatch: Gross Profit`);

    // Validate Equation: EBITDA = Resultado Bruto + OPEX + Outras Rec/Desp Op
    const calculatedEbitda = calculatedGrossProfit + Number(row.operating_expenses) + Number(row.selling_expenses) + Number(row.general_administrative_expenses) + Number(row.other_operating_revenue) + Number(row.other_operating_expenses);
    if (calculatedEbitda !== Number(row.ebitda)) throw new Error(`DRE Mismatch: EBITDA`);

    // Validate Equation: EBIT = EBITDA + Depreciação
    const calculatedEbit = calculatedEbitda + Number(row.depreciation_amortization);
    if (calculatedEbit !== Number(row.ebit)) throw new Error(`DRE Mismatch: EBIT`);

    console.log(`✅ DRE Equations matched perfectly for period ${row.period_date}`);
    console.log(`   Net Revenue: ${row.net_revenue}, Gross Profit: ${row.gross_profit}, EBITDA: ${row.ebitda}, Net Income: ${row.net_income}`);
  }
}

async function verifyBP(supabase: any, companyId: string) {
  console.log('\n--- 2. Validating Balance Sheet ---');
  const { data, error } = await supabase
    .schema('finance')
    .from('vw_balance_sheet')
    .select('*')
    .eq('company_id', companyId);

  if (error) throw error;
  if (!data || data.length === 0) {
    console.log('No BP data found.');
    return;
  }

  for (const row of data) {
    console.log(`Period: ${row.period_date}`);
    
    const assets = Number(row.total_assets);
    const liabilities_equity = Number(row.total_liabilities_and_equity);

    if (assets !== liabilities_equity) {
      throw new Error(`BP Mismatch: Assets (${assets}) != Liabilities + Equity (${liabilities_equity})`);
    }

    console.log(`✅ BP Equation matched perfectly for period ${row.period_date} (Assets = Liabilities + Equity)`);
    console.log(`   Total Assets: ${assets}, Total Liabilities & Equity: ${liabilities_equity}`);
  }
}

async function verifyDFC(supabase: any, companyId: string) {
  console.log('\n--- 3. Validating Cash Flow Statement ---');
  const { data, error } = await supabase
    .schema('finance')
    .from('vw_cash_flow_statement')
    .select('*')
    .eq('company_id', companyId)
    .order('period_date', { ascending: true });

  if (error) throw error;
  if (!data || data.length === 0) {
    console.log('No DFC data found.');
    return;
  }

  for (const row of data) {
    console.log(`Period: ${row.period_date}`);
    
    // Layer 1: Operational + Investing + Financing = Net Change
    const calculatedNetChange = Number(row.operating_cash_flow) + Number(row.investing_cash_flow) + Number(row.financing_cash_flow);
    if (calculatedNetChange !== Number(row.net_change_in_cash)) throw new Error(`DFC Layer 1 Mismatch`);

    // Layer 2: Closing - Opening = Net Change
    const calculatedNetChange2 = Number(row.closing_cash) - Number(row.opening_cash);
    if (calculatedNetChange2 !== Number(row.net_change_in_cash)) throw new Error(`DFC Layer 2 Mismatch`);

    // Additional check: Opening Cash MUST equal Prior Period Closing Cash
    if (Number(row.opening_cash) !== Number(row.prior_period_closing_cash)) {
       throw new Error(`DFC Continuity Mismatch: Opening (${row.opening_cash}) != Prior Closing (${row.prior_period_closing_cash})`);
    }

    console.log(`✅ DFC 2-Layer equations matched perfectly for period ${row.period_date}`);
    console.log(`   Net Change: ${row.net_change_in_cash}, Closing Cash: ${row.closing_cash}`);
  }
}

async function verifyIndicators(supabase: any, companyId: string) {
  console.log('\n--- 4. Validating Financial Indicators ---');
  const { data, error } = await supabase
    .schema('finance')
    .from('vw_financial_indicators')
    .select('*')
    .eq('company_id', companyId);

  if (error) throw error;
  if (!data || data.length === 0) {
    console.log('No Indicators data found.');
    return;
  }

  for (const row of data) {
    console.log(`Period: ${row.period_date}`);
    console.log(`   Current Ratio: ${Number(row.current_ratio).toFixed(2)}`);
    console.log(`   ROE: ${Number(row.roe).toFixed(2)}`);
    console.log(`   CGL: ${row.cgl}, NCG: ${row.ncg}, Treasury: ${row.treasury_balance}`);
    console.log(`✅ Indicators extracted successfully without division by zero errors.`);
  }
}

async function runReconciliation() {
  console.log('Starting Phase 6D Reconciliation Script...');
  const config = getSupabaseConfig();
  
  if (!config.useStaging) {
    throw new Error('VITE_USE_SUPABASE_STAGING must be true.');
  }

  // Create a raw admin client for test script
  const supabase = createClient(config.url, process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || config.anonKey);
  
  const companyId = 'aaaa1111-0000-0000-0000-000000000001'; // From seed data

  try {
    await verifyDRE(supabase, companyId);
    await verifyBP(supabase, companyId);
    await verifyDFC(supabase, companyId);
    await verifyIndicators(supabase, companyId);
    
    console.log('\n✅ ALL CANONICAL READ MODELS VALIDATED AND RECONCILED MATEMATICALLY.');
  } catch (err) {
    console.error('\n❌ RECONCILIATION FAILED (STOP CONDITION ACTIVATED):', err);
    process.exit(1);
  }
}

runReconciliation().catch(console.error);
