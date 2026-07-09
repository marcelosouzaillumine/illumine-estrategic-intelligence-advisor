import { 
  FiduciaryRuntimeAdapter, 
  DreExecutiveViewModelBuilder 
} from '../../../services/FiduciaryRuntimeAdapter';
import { FirestoreAuthAdapter } from '../../../adapters/persistence/FirestoreAuthAdapter';
import { FirestoreFinancialAdapter } from '../../../adapters/persistence/FirestoreFinancialAdapter';


export class DREApplicationService {
  static async deleteDREData(clientId: string, year: number): Promise<number> {
    if (!FirestoreAuthAdapter.isAuthenticated()) {
      throw new Error('Você precisa estar logado para excluir dados.');
    }
    
    // Contamos os registros antes de deletar apenas para retornar a quantidade
    const entries = await FirestoreFinancialAdapter.getEntriesByClientAndYear(clientId, year, 'DRE');
    await FirestoreFinancialAdapter.deleteEntriesByClientAndYear(clientId, year, 'DRE');
    
    return entries.length;
  }

  static buildExecutiveViewModel(params: {
    dbData: any[];
    dbDataBP: any[];
    dbDataDLPA: any[];
    dbDataDFC: any[];
    allHistoryData: any[];
    filterYear: number;
    currentClient: any;
    segmentoEmpresa: string;
    docIdsLength: number;
  }) {
    const input = {
      clientProfile: params.currentClient,
      dreData: params.dbData,
      bpData: params.dbDataBP,
      dlpaData: params.dbDataDLPA,
      cashFlowData: params.dbDataDFC,
      rawFinancialData: { 
        filterYear: params.filterYear, 
        segmentoEmpresa: params.segmentoEmpresa,
        allHistoryData: params.allHistoryData 
      },
      historicalCyclesCount: params.docIdsLength,
      isMockData: params.dbData.length === 0,
      historicalSeries: params.allHistoryData
    };
    
    const report = FiduciaryRuntimeAdapter.generateExecutiveReport(input);

    let dreViewModel = null;
    try {
      dreViewModel = DreExecutiveViewModelBuilder.build({
        dreData: params.dbData,
        historicalDreData: params.allHistoryData,
        bpData: params.dbDataBP,
        dlpaData: params.dbDataDLPA,
        dfcData: params.dbDataDFC,
        filterYear: params.filterYear
      });
    } catch (e) {
      console.error(e);
    }

    return {
      executiveReport: report,
      dreViewModel
    };
  }
}
