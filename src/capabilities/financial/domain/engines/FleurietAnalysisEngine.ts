import { FleurietAnalysisResult, FleurietClassificationType, FleurietRiskLevel } from '../types/financial-domain.types';

export class FleurietAnalysisEngine {
  static analyze(cgl: number, ncg: number, treasury: number): FleurietAnalysisResult {
    const isCglPositive = cgl > 0;
    const isNcgPositive = ncg > 0;
    const isTreasuryPositive = treasury > 0;

    let type: FleurietClassificationType = 'TYPE_1';
    let riskLevel: FleurietRiskLevel = 'LOW';
    let classification = '';
    let description = '';

    if (isCglPositive && !isNcgPositive && isTreasuryPositive) {
      type = 'TYPE_1';
      classification = 'EXCELENTE';
      riskLevel = 'LOW';
      description = 'Empresa possui capital de giro próprio suficiente para cobrir sua operação e gera excedente de tesouraria. Estrutura altamente saudável.';
    } else if (isCglPositive && isNcgPositive && isTreasuryPositive) {
      type = 'TYPE_2';
      classification = 'SÓLIDA';
      riskLevel = 'LOW';
      description = 'Empresa financia sua operação com recursos próprios e mantém reserva financeira positiva.';
    } else if (isCglPositive && isNcgPositive && !isTreasuryPositive) {
      type = 'TYPE_3';
      classification = 'ATENÇÃO';
      riskLevel = 'MEDIUM';
      description = 'Empresa possui capital de giro próprio, mas precisa de recursos de curto prazo para financiar a necessidade operacional. Saldo de tesouraria negativo.';
    } else if (!isCglPositive && isNcgPositive && !isTreasuryPositive) {
      type = 'TYPE_4';
      classification = 'RISCO ELEVADO';
      riskLevel = 'HIGH';
      description = 'Empresa opera com insuficiência de capital próprio, dependendo de recursos de curto prazo para bancar sua necessidade operacional. Alta dependência financeira.';
    } else if (!isCglPositive && !isNcgPositive && isTreasuryPositive) {
      type = 'TYPE_5';
      classification = 'ESTRUTURA ATÍPICA';
      riskLevel = 'MEDIUM';
      description = 'Empresa possui capital de giro líquido negativo, mas a operação gera recursos (NCG negativa), resultando em tesouraria positiva. Atenção a prazos.';
    } else { // !isCglPositive && !isNcgPositive && !isTreasuryPositive
      type = 'TYPE_6';
      classification = 'CRÍTICA';
      riskLevel = 'CRITICAL';
      description = 'Empresa opera no limite. A operação e a estrutura dependem integralmente de passivos de curto prazo. Risco de insolvência severo se houver choque operacional.';
    }

    return {
      type,
      classification,
      riskLevel,
      description,
      cgl,
      ncg,
      treasury
    };
  }
}
