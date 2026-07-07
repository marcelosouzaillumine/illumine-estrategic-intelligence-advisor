import { 
  FiduciaryRuntimeAdapter, 
  DreExecutiveViewModelBuilder 
} from '../../../services/FiduciaryRuntimeAdapter';
import { db, auth } from '../../../lib/firebase';
import { collection, deleteDoc, doc, query, where, getDocs } from 'firebase/firestore';

export class DREApplicationService {
  static async deleteDREData(clientId: string, year: number): Promise<number> {
    if (!auth.currentUser) {
      throw new Error('Você precisa estar logado para excluir dados.');
    }
    const q = query(
      collection(db, 'financial_entries'),
      where('clientId', '==', clientId),
      where('type', '==', 'DRE'),
      where('year', '==', year)
    );
    const snap = await getDocs(q);
    await Promise.all(snap.docs.map((d) => deleteDoc(doc(db, 'financial_entries', d.id))));
    return snap.docs.length;
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
