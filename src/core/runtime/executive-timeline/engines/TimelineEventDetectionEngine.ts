// src/core/runtime/executive-timeline/engines/TimelineEventDetectionEngine.ts

import { HistoricalRuntimeCycle, TimelineEvent, TimelineInflectionPoint } from '../executive-timeline-types';

export class TimelineEventDetectionEngine {
  
  public static detectInflectionPoints(cycles: HistoricalRuntimeCycle[]): TimelineInflectionPoint[] {
    const inflectionPoints: TimelineInflectionPoint[] = [];
    if (cycles.length < 2) return inflectionPoints;

    const SCORE_INFLECTION_THRESHOLD = 10;
    const METRIC_VARIANCE_THRESHOLD = 0.15; // 15%

    for (let i = 1; i < cycles.length; i++) {
      const prev = cycles[i - 1];
      const curr = cycles[i];
      const cycleRef = curr.cycleReference;

      // 1. Score change >= 10 points
      const scoreDiff = curr.compositeScore - prev.compositeScore;
      if (Math.abs(scoreDiff) >= SCORE_INFLECTION_THRESHOLD) {
        inflectionPoints.push({
          cycleReference: cycleRef,
          metricName: 'compositeScore',
          previousValue: prev.compositeScore,
          newValue: curr.compositeScore,
          direction: scoreDiff > 0 ? 'UP' : 'DOWN',
          fiduciaryImpact: scoreDiff > 0 ? 'POSITIVE' : 'NEGATIVE'
        });
      }

      // 2. Fiduciary Classification changes -> automatic inflection
      if (prev.fiduciaryClassification !== curr.fiduciaryClassification) {
        const prevScore = prev.compositeScore;
        const currScore = curr.compositeScore;
        inflectionPoints.push({
          cycleReference: cycleRef,
          metricName: 'fiduciaryClassification',
          previousValue: prev.fiduciaryClassification,
          newValue: curr.fiduciaryClassification,
          direction: currScore >= prevScore ? 'UP' : 'DOWN',
          fiduciaryImpact: currScore >= prevScore ? 'POSITIVE' : 'NEGATIVE'
        });
      }

      // 3. FAIL_CLOSED/Quarantine or restricted changes -> mandatory inflection
      if (prev.isQuarantined !== curr.isQuarantined || prev.isRestricted !== curr.isRestricted) {
        inflectionPoints.push({
          cycleReference: cycleRef,
          metricName: curr.isQuarantined ? 'quarantineState' : 'restrictionState',
          previousValue: prev.isQuarantined ? 'ACTIVE' : 'INACTIVE',
          newValue: curr.isQuarantined ? 'ACTIVE' : 'INACTIVE',
          direction: curr.isQuarantined || curr.isRestricted ? 'DOWN' : 'UP',
          fiduciaryImpact: curr.isQuarantined || curr.isRestricted ? 'NEGATIVE' : 'POSITIVE'
        });
      }

      // 4. Metric changes >= 15%
      const checkMetric = (name: string, prevVal: number, currVal: number, negativeIsGood: boolean = false) => {
        if (prevVal === 0) return; // avoid division by zero
        const variance = (currVal - prevVal) / Math.abs(prevVal);
        if (Math.abs(variance) >= METRIC_VARIANCE_THRESHOLD) {
          const isUp = currVal > prevVal;
          let impact: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL' = 'NEUTRAL';
          
          if (isUp) {
            impact = negativeIsGood ? 'NEGATIVE' : 'POSITIVE';
          } else {
            impact = negativeIsGood ? 'POSITIVE' : 'NEGATIVE';
          }

          inflectionPoints.push({
            cycleReference: cycleRef,
            metricName: name,
            previousValue: prevVal,
            newValue: currVal,
            direction: isUp ? 'UP' : 'DOWN',
            fiduciaryImpact: impact
          });
        }
      };

      checkMetric('ebitda', prev.ebitda, curr.ebitda);
      checkMetric('netIncome', prev.netIncome, curr.netIncome);
      checkMetric('ocf', prev.ocf, curr.ocf);
      checkMetric('cashEquivalents', prev.cashEquivalents, curr.cashEquivalents);
      checkMetric('equity', prev.equity, curr.equity);
      checkMetric('totalDebt', prev.totalDebt, curr.totalDebt, true); // more debt is negative
      checkMetric('workingCapital', prev.workingCapital, curr.workingCapital);
    }

    return inflectionPoints;
  }

  public static detectEvents(cycles: HistoricalRuntimeCycle[]): TimelineEvent[] {
    const events: TimelineEvent[] = [];
    if (cycles.length < 1) return events;

    // Evaluate single cycle indicators for current and transitions
    for (let i = 0; i < cycles.length; i++) {
      const curr = cycles[i];
      const prev = i > 0 ? cycles[i - 1] : null;
      const cycleRef = curr.cycleReference;
      const hash = curr.lineageHash || 'N/A';

      // 1. Constitutional Restriction / Quarantine
      if (curr.isQuarantined) {
        events.push({
          cycleReference: cycleRef,
          eventType: 'CONSTITUTIONAL_RESTRICTION',
          description: 'Ação de execução constitucional ativada. Quarentena de integridade fiduciária iniciada.',
          severity: 'RESTRICTIVE',
          lineageHash: hash
        });
      } else if (curr.isRestricted) {
        events.push({
          cycleReference: cycleRef,
          eventType: 'CONSTITUTIONAL_RESTRICTION',
          description: 'Processo fiduciário sob regime restritivo de conformidade.',
          severity: 'CRITICAL',
          lineageHash: hash
        });
      }

      // 2. EBITDA Inflection
      if (prev) {
        if (prev.ebitda <= 0 && curr.ebitda > 0) {
          events.push({
            cycleReference: cycleRef,
            eventType: 'EBITDA_INFLECTION',
            description: 'Ponto de inflexão operacional: EBITDA reverteu de negativo/nulo para positivo.',
            severity: 'INFO',
            lineageHash: hash
          });
        } else if (prev.ebitda > 0 && curr.ebitda <= 0) {
          events.push({
            cycleReference: cycleRef,
            eventType: 'EBITDA_INFLECTION',
            description: 'Ponto de inflexão operacional crítico: EBITDA declinou e tornou-se negativo/nulo.',
            severity: 'CRITICAL',
            lineageHash: hash
          });
        }

        // 3. Treasury Rupture (Cash Depletion)
        if (curr.cashEquivalents <= 0 && prev.cashEquivalents > 0) {
          events.push({
            cycleReference: cycleRef,
            eventType: 'TREASURY_RUPTURE',
            description: 'Esgotamento completo de disponibilidade de tesouraria. Ruptura de caixa decretada.',
            severity: 'RESTRICTIVE',
            lineageHash: hash
          });
        } else if (curr.ocf < 0 && curr.cashEquivalents < prev.cashEquivalents * 0.5) {
          events.push({
            cycleReference: cycleRef,
            eventType: 'TREASURY_RUPTURE',
            description: 'Compressão severa de liquidez: queima acelerada consumiu mais de 50% das reservas.',
            severity: 'WARNING',
            lineageHash: hash
          });
        }

        // 4. Liquidity Recovery
        if (prev.cashEquivalents < prev.totalDebt * 0.1 && curr.cashEquivalents >= curr.totalDebt * 0.2 && curr.ocf > 0) {
          events.push({
            cycleReference: cycleRef,
            eventType: 'LIQUIDITY_RECOVERY',
            description: 'Recuperação de liquidez: reservas de caixa restabelecidas acima de 20% do endividamento total.',
            severity: 'INFO',
            lineageHash: hash
          });
        }

        // 5. Capital Erosion
        if (curr.equity < prev.equity * 0.85) {
          events.push({
            cycleReference: cycleRef,
            eventType: 'CAPITAL_EROSION',
            description: 'Erosão severa de capital próprio: Patrimônio Líquido sofreu retração superior a 15%.',
            severity: 'WARNING',
            lineageHash: hash
          });
        }

        // 6. Debt Acceleration
        if (curr.totalDebt > prev.totalDebt * 1.15) {
          events.push({
            cycleReference: cycleRef,
            eventType: 'DEBT_ACCELERATION',
            description: 'Aceleração de endividamento: passivo financeiro incrementado em mais de 15% YoY.',
            severity: 'WARNING',
            lineageHash: hash
          });
        }

        // 7. Working Capital Inversion
        if (prev.workingCapital >= 0 && curr.workingCapital < 0) {
          events.push({
            cycleReference: cycleRef,
            eventType: 'WORKING_CAPITAL_INVERSION',
            description: 'Inversão de Capital de Giro: necessidade líquida operacional pressionada abaixo de zero.',
            severity: 'CRITICAL',
            lineageHash: hash
          });
        }
      }
    }

    return events;
  }
}
