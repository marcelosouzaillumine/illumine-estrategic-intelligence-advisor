import { ExecutivePositionSummaryResult } from '../src/core/experience/contracts/FinancialPositionPureViewModel';
const obj: ExecutivePositionSummaryResult = {
  available: true,
  status: { classification: '', narrative: '' },
  strengths: [],
  attentionPoints: [],
  centralQuestion: { question: '' }
};
console.log(obj.available);
