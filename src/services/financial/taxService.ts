
import { DATA } from '../../data';

export interface SimplesNacionalFaixa {
  ate: number;
  aliq: number;
  deducao: number;
}

export interface SimplesNacionalAnexo {
  anexo: string;
  descricao: string;
  fatorR?: string;
  obs?: string;
  faixas: SimplesNacionalFaixa[];
}

export const calculateSimplesNacional = (rbt12: number, anexoStr: string, faturamentoMes: number) => {
  const anexoMatch = anexoStr.match(/Anexo (I|II|III|IV|V)/);
  if (!anexoMatch) return { aliqEfetiva: 0, valorSimples: 0 };

  const anexoNum = anexoMatch[1];
  const anexoData = (DATA as any).premissas.tributarias.simplesNacional.find((a: any) => a.anexo === anexoNum);
  
  if (!anexoData) return { aliqEfetiva: 0, valorSimples: 0 };

  const faixa = anexoData.faixas.find((f: any) => rbt12 <= f.ate) || anexoData.faixas[anexoData.faixas.length - 1];

  // Fórmula: ((RBT12 * Alíquota Nominal) - Dedução) / RBT12
  const aliqEfetiva = rbt12 > 0 ? ((rbt12 * faixa.aliq) - faixa.deducao) / rbt12 : faixa.aliq;
  const valorSimples = faturamentoMes * aliqEfetiva;

  return {
    aliqNominal: faixa.aliq,
    deducao: faixa.deducao,
    aliqEfetiva,
    valorSimples
  };
};

export const calculatePayrollBurdens = (salarioBase: number, config: {
  fgts: number;
  inssPatronal: number;
  inssFuncionario: number;
  multaFgts: number;
  tabelaIRRF: { base: number; aliquota: number; deducao: number; }[];
}) => {
  const fgts = salarioBase * (config.fgts / 100);
  const inssPatronal = salarioBase * (config.inssPatronal / 100);
  
  // IRRF Calculation
  const irrfBase = salarioBase - (salarioBase * (config.inssFuncionario / 100)); // Simplified: Base - INSS Func
  const irrfFaixa = (config.tabelaIRRF && config.tabelaIRRF.length > 0) ? 
    (config.tabelaIRRF.find(f => irrfBase <= f.base) || config.tabelaIRRF[config.tabelaIRRF.length - 1]) : 
    { aliquota: 0, deducao: 0 };
  const irrfValue = (irrfBase * (irrfFaixa.aliquota / 100)) - irrfFaixa.deducao;

  const custoTotal = salarioBase + fgts + inssPatronal;
  const provisionFerias13 = salarioBase * (11.11 / 100); // approx 1/12 + 1/3 of 1/12

  return {
    fgts,
    inssPatronal,
    irrfValue: Math.max(0, irrfValue),
    provisionFerias13,
    custoTotal: custoTotal + provisionFerias13
  };
};

export const calculateSeverance = (
  salarioBase: number, 
  admissao: string, 
  config: { multaFgts: number },
  options: { avisoIndenizado: boolean } = { avisoIndenizado: true }
) => {
  const dataAdmissao = new Date(admissao);
  const dataHoje = new Date();
  
  // Tenure in months and years
  const diffTime = Math.abs(dataHoje.getTime() - dataAdmissao.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const diffMonths = diffDays / 30.44;
  const fullYears = Math.floor(diffDays / 365);
  
  // 1. Aviso Prévio (Indemnified)
  // Law 12.506/2011: 30 days + 3 days per full year (max 90 days)
  let diasAviso = 0;
  let valorAviso = 0;
  if (options.avisoIndenizado) {
    diasAviso = Math.min(90, 30 + (fullYears * 3));
    valorAviso = (salarioBase / 30) * diasAviso;
  }

  // 2. Multa FGTS (Estimated)
  // Estimated FGTS balance = 8% of salary per month
  const saldoFgtsEstimado = (salarioBase * 0.08) * diffMonths;
  const valorMultaFgts = saldoFgtsEstimado * (config.multaFgts / 100);

  // 3. 13º Proporcional (current year)
  const mesesNoAno = dataHoje.getMonth() + 1;
  const decimoTerceiroProp = (salarioBase / 12) * mesesNoAno;

  // 4. Férias Proporcionais + 1/3
  // Simplified: months since admission modulo 12
  const mesesFerias = Math.floor(diffMonths % 12) || 12;
  const feriasProp = (salarioBase / 12) * mesesFerias;
  const umTercoFerias = feriasProp / 3;

  const totalRescisao = valorAviso + valorMultaFgts + decimoTerceiroProp + feriasProp + umTercoFerias;

  return {
    diasAviso,
    valorAviso,
    valorMultaFgts,
    decimoTerceiroProp,
    feriasProp,
    umTercoFerias,
    totalRescisao,
    tenureYears: fullYears,
    tenureMonths: Math.floor(diffMonths)
  };
};
