import { FinancialIndicatorsFact } from '../domain/types/FinancialIndicatorsFact';
import { ExecutiveIntelligenceContext } from './ExecutiveIntelligenceContext';

export interface FinancialIntelligenceContract {
    analyze(facts: FinancialIndicatorsFact): ExecutiveIntelligenceContext;
}
