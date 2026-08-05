import { ExecutiveContext } from '../../context/executive-context.types';
import { 
  ExecutiveOperationalHealthScore, 
  ProcessExecutionData, 
  LogisticsSupplyChainData, 
  ProcurementIntelligenceData, 
  OperationalExcellenceData, 
  OperationalExecutiveSummaryData 
} from '../types/operational-intelligence.types';

export interface OperationalIntelligenceProvider {
  getHealthScore(context: ExecutiveContext): Promise<ExecutiveOperationalHealthScore>;
  getProcessExecution(context: ExecutiveContext): Promise<ProcessExecutionData>;
  getLogisticsSupplyChain(context: ExecutiveContext): Promise<LogisticsSupplyChainData>;
  getProcurementIntelligence(context: ExecutiveContext): Promise<ProcurementIntelligenceData>;
  getOperationalExcellence(context: ExecutiveContext): Promise<OperationalExcellenceData>;
  getExecutiveSummary(context: ExecutiveContext): Promise<OperationalExecutiveSummaryData>;
}
