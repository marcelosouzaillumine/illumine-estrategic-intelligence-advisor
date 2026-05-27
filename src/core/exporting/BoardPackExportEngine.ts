import { jsPDF } from 'jspdf';
import { ExecutiveIntelligenceReport } from '../runtime/executive-intelligence-runtime';
import { CalibrationEngine } from '../runtime/calibration/CalibrationEngine';
import { ExportSnapshotMetadata } from './ExportTypes';
import { formatValue } from '../../lib/utils';

export interface BoardPackExportOutput {
  pdf: jsPDF;
  metadata: ExportSnapshotMetadata;
}

export class BoardPackExportEngine {
  /**
   * Generates a comprehensive and premium Board Pack PDF for board member review.
   * This class operates passivamente and does NOT recalculate financial indicators.
   */
  public static exportBoardPack(report: ExecutiveIntelligenceReport, actorId: string): BoardPackExportOutput {
    if (!report) {
      throw new Error('[Board Pack Export] Relatório contábil-financeiro inválido.');
    }

    const { context, scores, severity, advisory, compliance, runtimeMetadata, metrics, temporalCausality } = report;

    // 1. Compile immutable ExportSnapshotMetadata
    const exportId = `EXP-BPK-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const rMeta = runtimeMetadata as any;
    const lineage = rMeta?.lineage as any;
    const metadata: ExportSnapshotMetadata = {
      exportId,
      timestamp: new Date().toISOString(),
      tenantId: lineage?.tenantId || 'SANDBOX-TENANT',
      runtimeExecutionId: rMeta?.importId || 'EXEC-N/A',
      calibrationProfile: CalibrationEngine.getActiveProfileId(),
      confidenceSnapshot: compliance.confidenceLevel,
      lineageHash: lineage?.datasetHash || 'HASH-N/A',
      reportVersion: CalibrationEngine.getVersion(),
      generatedBy: actorId || 'SYSTEM'
    };

    const pdf = new jsPDF('p', 'mm', 'a4');

    // Page 1: Premium Cover Page
    pdf.setFillColor(30, 34, 42); // Elegant Slate Dark Blue
    pdf.rect(0, 0, 210, 297, 'F');

    // Accent line
    pdf.setFillColor(255, 133, 82); // Illumine Premium Coral (FF8552)
    pdf.rect(20, 45, 15, 3, 'F');

    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(28);
    pdf.setTextColor(255, 255, 255);
    pdf.text('ILLUMINE ADVISORY', 20, 65);
    
    pdf.setFontSize(22);
    pdf.setTextColor(255, 133, 82); 
    pdf.text('BOARD INTEL PACK', 20, 78);

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(11);
    pdf.setTextColor(170, 180, 195);
    pdf.text('CONFIDENTIAL // EXECUTIVE USE ONLY', 20, 88);

    // Decorative division
    pdf.setDrawColor(60, 70, 85);
    pdf.line(20, 100, 190, 100);

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(12);
    pdf.setTextColor(220, 225, 235);
    pdf.text(`EMPRESA: ${context.segment.toUpperCase()}`, 20, 120);
    pdf.text(`BUSINESS MODEL: ${context.businessModel.toUpperCase()}`, 20, 128);
    pdf.text(`ESTÁGIO OPERACIONAL: ${context.stage.toUpperCase()}`, 20, 136);
    pdf.text(`MODELO DE CAPITAL: ${context.capitalIntensity.toUpperCase()}`, 20, 144);
    
    // Bottom Meta
    pdf.setFontSize(10);
    pdf.setTextColor(150, 160, 175);
    pdf.text(`Export ID: ${metadata.exportId}`, 20, 250);
    pdf.text(`Lineage Hash: ${metadata.lineageHash}`, 20, 256);
    pdf.text(`Data de Emissão: ${new Date(metadata.timestamp).toLocaleString('pt-BR')}`, 20, 262);
    pdf.text(`Emissor Responsável: ${metadata.generatedBy}`, 20, 268);

    // Page 2: Table of Contents & Fiduciary Summary
    pdf.addPage();
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(14);
    pdf.setTextColor(30, 35, 45);
    pdf.text('ÍNDICE DO BOARD PACK', 20, 30);

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(10);
    pdf.setTextColor(80, 90, 105);
    pdf.text('1. Sumário Executivo de Governança', 20, 45);
    pdf.text('2. Destaques Estratégicos (KPIs e Eficiências)', 20, 52);
    pdf.text('3. Evolução Longitudinal e Histórico', 20, 59);
    pdf.text('4. Recomendações e Matriz de Ação', 20, 66);
    pdf.text('5. Rastreabilidade Fiduciária e Assinatura Digital (BOARD_EVIDENCE_MODE)', 20, 73);

    pdf.setDrawColor(225, 230, 235);
    pdf.line(20, 80, 190, 80);

    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(12);
    pdf.setTextColor(30, 35, 45);
    pdf.text('1. SUMÁRIO EXECUTIVO DE GOVERNANÇA', 20, 90);

    const CONFIDENCE_LEVEL_PT: Record<string, string> = {
      'HIGH_CONFIDENCE': 'Alta Confiabilidade',
      'MEDIUM_CONFIDENCE': 'Confiabilidade Moderada',
      'LOW_CONFIDENCE': 'Confiabilidade Reduzida',
      'HIGH': 'Alta',
      'MODERATE': 'Moderada',
      'LOW': 'Baixa',
      'LIMITED_CONTEXT': 'Contexto Limitado',
      'UNVERIFIABLE': 'Insuficiência de Dados'
    };

    const CAUSAL_DEPTH_PT: Record<string, string> = {
      'SHALLOW': 'Superficial',
      'MODERATE': 'Moderada',
      'DEEP': 'Profunda'
    };

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(9.5);
    pdf.setTextColor(50, 55, 65);
    const translatedConf = CONFIDENCE_LEVEL_PT[metadata.confidenceSnapshot] || metadata.confidenceSnapshot;
    pdf.text(`Nível de Confiança do Diagnóstico: ${translatedConf}`, 20, 102);
    pdf.text(`Score de Governança e Solidez: ${scores.governance}/100`, 20, 109);
    pdf.text(`Score Financeiro: ${scores.financial}/100`, 20, 116);
    pdf.text(`Score Estrutural: ${scores.structural}/100`, 20, 123);
    pdf.text(`Score Composto de Saúde: ${scores.composite}/100`, 20, 130);
    pdf.text(`Severidade da Situação: ${severity.level}`, 20, 137);

    pdf.setFont('helvetica', 'bold');
    pdf.text('Parecer Executivo Consolidado:', 20, 148);
    pdf.setFont('helvetica', 'normal');
    const summaryLines = pdf.splitTextToSize(advisory.executiveSummary, 170);
    pdf.text(summaryLines, 20, 155);

    // Page 3: Strategic Highlights (KPIs & Efficiencies)
    pdf.addPage();
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(12);
    pdf.setTextColor(30, 35, 45);
    pdf.text('2. DESTAQUES ESTRATÉGICOS (KPIS E EFICIÊNCIAS)', 20, 30);

    // Render KPIs
    pdf.setFontSize(10);
    pdf.text('Métricas Operacionais e Financeiras de Destaque:', 20, 42);
    
    let yOffset = 50;
    const kpis = metrics?.kpis || [];
    if (kpis.length > 0) {
      pdf.setFont('helvetica', 'bold');
      pdf.text('Indicador', 20, yOffset);
      pdf.text('Valor', 95, yOffset);
      pdf.text('Status', 140, yOffset);
      pdf.text('Tendência', 170, yOffset);
      
      pdf.setDrawColor(210, 215, 220);
      pdf.line(20, yOffset + 2, 190, yOffset + 2);
      yOffset += 8;

      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(9);
      for (const kpi of kpis.slice(0, 8)) {
        pdf.text(String(kpi.name), 20, yOffset);
        pdf.text(formatValue(Number(kpi.val), kpi.unit), 95, yOffset);
        pdf.text(String(kpi.status), 140, yOffset);
        pdf.text(String(kpi.trend), 170, yOffset);
        yOffset += 7;
      }
    } else {
      pdf.setFont('helvetica', 'italic');
      pdf.text('Nenhum KPI reportado nesta execução.', 20, yOffset);
      yOffset += 10;
    }

    // Render Efficiencies
    yOffset += 10;
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(10);
    pdf.setTextColor(30, 35, 45);
    pdf.text('Estrutura de Eficiências Detectadas:', 20, yOffset);
    yOffset += 8;

    const efficiencies = metrics?.efficiencies || [];
    if (efficiencies.length > 0) {
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(9);
      for (const eff of efficiencies) {
        const text = `- [${eff.color.toUpperCase()}] ${eff.name}: ${eff.value}${eff.unit || '%'} - ${eff.desc}`;
        const effLines = pdf.splitTextToSize(text, 170);
        pdf.text(effLines, 20, yOffset);
        yOffset += (effLines.length * 5) + 2;
      }
    } else {
      pdf.setFont('helvetica', 'italic');
      pdf.text('Nenhuma eficiência adicional calculada.', 20, yOffset);
    }

    // Page 4: Timeline & Historical Trends
    pdf.addPage();
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(12);
    pdf.setTextColor(30, 35, 45);
    pdf.text('3. EVOLUÇÃO LONGITUDINAL E HISTÓRICO', 20, 30);

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(9.5);
    pdf.setTextColor(60, 65, 75);
    pdf.text('Esta seção apresenta a linha do tempo de evolução temporal de causalidade reportada pelo core runtime:', 20, 42);

    let tOffset = 52;
    if (temporalCausality && ((temporalCausality.trendSignals && temporalCausality.trendSignals.length > 0) || (temporalCausality.inflectionPoints && temporalCausality.inflectionPoints.length > 0))) {
      if (temporalCausality.trendSignals && temporalCausality.trendSignals.length > 0) {
        pdf.setFont('helvetica', 'bold');
        pdf.text('Sinais de Tendência Longitudinal:', 20, tOffset);
        tOffset += 6;
        pdf.setFont('helvetica', 'normal');
        for (const sig of temporalCausality.trendSignals) {
          pdf.text(`- ${sig.indicator}: ${sig.direction} (Favorável: ${sig.isFavorable ? 'Sim' : 'Não'})`, 25, tOffset);
          tOffset += 5;
          const descLines = pdf.splitTextToSize(sig.description, 160);
          pdf.text(descLines, 25, tOffset);
          tOffset += (descLines.length * 5) + 3;
          if (tOffset > 250) {
            pdf.addPage();
            tOffset = 30;
          }
        }
      }
      if (temporalCausality.inflectionPoints && temporalCausality.inflectionPoints.length > 0) {
        tOffset += 5;
        pdf.setFont('helvetica', 'bold');
        pdf.text('Pontos de Inflexão Histórica:', 20, tOffset);
        tOffset += 6;
        pdf.setFont('helvetica', 'normal');
        for (const inf of temporalCausality.inflectionPoints) {
          pdf.text(`- Período: ${inf.period} | ${inf.indicator} (${inf.type})`, 25, tOffset);
          tOffset += 5;
          const descLines = pdf.splitTextToSize(inf.description, 160);
          pdf.text(descLines, 25, tOffset);
          tOffset += (descLines.length * 5) + 3;
          if (tOffset > 250) {
            pdf.addPage();
            tOffset = 30;
          }
        }
      }
    } else if (metrics?.chartData && metrics.chartData.length > 0) {
      pdf.setFont('helvetica', 'bold');
      pdf.text('Tendências Históricas Registradas:', 20, tOffset);
      tOffset += 8;

      pdf.setFont('helvetica', 'normal');
      for (const cData of metrics.chartData.slice(0, 8)) {
        pdf.text(`Período / Evento: ${cData.name || cData.period || 'N/A'} | Dados: ${JSON.stringify(cData)}`, 25, tOffset);
        tOffset += 6;
      }
    } else {
      pdf.setFont('helvetica', 'italic');
      pdf.text('Histórico longitudinal insuficiente para geração de trajetórias temporais.', 20, tOffset);
    }

    // Page 5: Recommendations & Action Matrix
    pdf.addPage();
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(12);
    pdf.setTextColor(30, 35, 45);
    pdf.text('4. RECOMENDAÇÕES E MATRIZ DE AÇÃO', 20, 30);

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(9.5);
    pdf.setTextColor(60, 65, 75);
    pdf.text(`Foco de Atenção Recomendado pelo Core: ${advisory.priorityFocus}`, 20, 42);

    let recOffset = 52;
    for (const act of advisory.actionMatrix) {
      let actText = '';
      if (act && typeof act === 'object') {
        actText = `[ ] ${act.title || ''}\n    Área: ${act.category || ''} | Prio: ${act.priority || ''} | Prazo: ${act.timeline || ''}`;
        if (act.fiduciaryEvidence) {
          actText += `\n    Evidência: ${act.fiduciaryEvidence}`;
        }
      } else {
        actText = `[ ] ${act}`;
      }
      const actLines = pdf.splitTextToSize(actText, 170);
      pdf.text(actLines, 20, recOffset);
      recOffset += (actLines.length * 5) + 4;
      
      if (recOffset > 260) {
        pdf.addPage();
        recOffset = 30;
      }
    }

    // Page 6: Auditing & Lineage Verification (BOARD_EVIDENCE_MODE)
    pdf.addPage();
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(12);
    pdf.setTextColor(30, 35, 45);
    pdf.text('5. RASTREABILIDADE FIDUCIÁRIA (BOARD_EVIDENCE_MODE)', 20, 30);

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(9);
    pdf.setTextColor(50, 55, 65);
    pdf.text('Para garantia da integridade fiduciária e auditoria dos conselheiros, os hashes e parâmetros do runtime são detalhados abaixo:', 20, 42);

    let appOffset = 52;
    pdf.text(`Identificador do Relatório (Export ID): ${metadata.exportId}`, 20, appOffset);
    appOffset += 7;
    pdf.text(`Assinatura de Lineage do Dataset: ${metadata.lineageHash}`, 20, appOffset);
    appOffset += 7;
    pdf.text(`Identificador de Execução (Import ID): ${metadata.runtimeExecutionId}`, 20, appOffset);
    appOffset += 7;
    pdf.text(`Identificador do Tenant: ${metadata.tenantId}`, 20, appOffset);
    appOffset += 7;
    pdf.text(`Perfil de Calibração Ativo: ${metadata.calibrationProfile}`, 20, appOffset);
    appOffset += 7;
    const translatedConfApp = CONFIDENCE_LEVEL_PT[metadata.confidenceSnapshot] || metadata.confidenceSnapshot;
    pdf.text(`Nível de Confiança de Dados: ${translatedConfApp}`, 20, appOffset);
    appOffset += 7;
    pdf.text(`Completude dos Dados Contábeis: ${(compliance.dataCompleteness * 100).toFixed(1)}%`, 20, appOffset);
    appOffset += 7;
    const translatedDepth = CAUSAL_DEPTH_PT[compliance.causalDepth] || compliance.causalDepth;
    pdf.text(`Grau de Profundidade Causal: ${translatedDepth}`, 20, appOffset);
    appOffset += 7;
    pdf.text(`Versão Oficial do Compilador: ${metadata.reportVersion}`, 20, appOffset);
    appOffset += 7;
    pdf.text(`Data de Geração Fiduciária: ${metadata.timestamp}`, 20, appOffset);
    appOffset += 7;
    pdf.text(`Assinado Digitalmente por: ${metadata.generatedBy}`, 20, appOffset);
    appOffset += 10;

    // Audit alerts or restrictions
    if (compliance.auditFlags && compliance.auditFlags.length > 0) {
      pdf.setFont('helvetica', 'bold');
      pdf.text('Alertas de Auditoria Ativos:', 20, appOffset);
      appOffset += 6;
      pdf.setFont('helvetica', 'normal');
      for (const flag of compliance.auditFlags) {
        pdf.text(`- ALERT: ${flag}`, 25, appOffset);
        appOffset += 5;
      }
      appOffset += 5;
    }

    if (compliance.narrativeRestrictions && compliance.narrativeRestrictions.length > 0) {
      pdf.setFont('helvetica', 'bold');
      pdf.text('Restrições Narrativas de Governança:', 20, appOffset);
      appOffset += 6;
      pdf.setFont('helvetica', 'normal');
      for (const res of compliance.narrativeRestrictions) {
        pdf.text(`- RESTRICTION: ${res}`, 25, appOffset);
        appOffset += 5;
      }
    }

    console.log(`[Board Pack Export] Board Pack gerado com sucesso. ExportId: ${exportId}`);
    return { pdf, metadata };
  }
}
