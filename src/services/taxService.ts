
import { DATA } from '../data';

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
  const irrfFaixa = config.tabelaIRRF.find(f => irrfBase <= f.base) || config.tabelaIRRF[config.tabelaIRRF.length - 1];
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
