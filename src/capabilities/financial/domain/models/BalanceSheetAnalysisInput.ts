export type BalanceSheetRawData = Record<string, any>;

export interface BalanceSheetAnalysisInput {
    /**
     * O retrato financeiro do ano corrente da análise (ex: o ano selecionado no filtro).
     */
    current: BalanceSheetRawData;
    
    /**
     * A série histórica completa disponível para a empresa.
     * Deve, obrigatoriamente, incluir também o período corrente para fins de comparabilidade temporal íntegra.
     */
    history: BalanceSheetRawData[];

    /**
     * O período absoluto limitador da análise.
     * Nenhum dado com período > analysisPeriod será incluído na análise.
     */
    analysisPeriod: number;
}
