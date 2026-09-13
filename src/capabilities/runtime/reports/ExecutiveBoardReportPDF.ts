// src/core/runtime/reports/ExecutiveBoardReportPDF.ts

import { jsPDF } from 'jspdf';
import { ExecutiveBoardReport } from '../esgim/esgimTypes';

export class ExecutiveBoardReportPDF {
  /**
   * Generates a premium 6-page A4 Board Executive PDF Report using jsPDF.
   */
  public static generatePDF(report: ExecutiveBoardReport): jsPDF {
    if (!report) {
      throw new Error('[PDF Export] Relatório inválido.');
    }

    const doc = new jsPDF('p', 'mm', 'a4');
    
    // Page dimensions
    const pageWidth = 210;
    const pageHeight = 297;
    const margin = 20;
    const contentWidth = pageWidth - (2 * margin); // 170mm

    // Branding colors
    const darkNavy = { r: 14, g: 28, b: 44 }; // #0E1C2C
    const coral = { r: 255, g: 133, b: 82 }; // #FF8552
    const sage = { r: 186, g: 184, b: 108 }; // #BAB86C
    const charcoal = { r: 60, g: 60, b: 60 };
    const lightGrey = { r: 245, g: 247, b: 250 };
    const borderGrey = { r: 220, g: 224, b: 230 };

    // Helper: draw header and footer
    const drawHeaderFooter = (pageNum: number) => {
      // Top header band
      doc.setFillColor(darkNavy.r, darkNavy.g, darkNavy.b);
      doc.rect(margin, 10, contentWidth, 1.5, 'F');

      // Top title text
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(sage.r, sage.g, sage.b);
      doc.text('ILLUMINE GOVERNANCE™', margin, 8);

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(150, 150, 150);
      doc.text('RELATÓRIO EXECUTIVO DO CONSELHO (EBRG)', pageWidth - margin - 65, 8);

      // Bottom footer line
      doc.setDrawColor(borderGrey.r, borderGrey.g, borderGrey.b);
      doc.line(margin, pageHeight - 15, pageWidth - margin, pageHeight - 15);

      // Bottom footer text
      doc.setFontSize(8);
      doc.setTextColor(120, 120, 120);
      doc.text('CONSELHO DE ADMINISTRAÇÃO | CONFIDENCIAL', margin, pageHeight - 10);
      doc.text(`Página ${pageNum} de 7`, pageWidth - margin - 20, pageHeight - 10);
    };

    // ==========================================
    // PAGE 1: COVER PAGE
    // ==========================================
    // Dark Navy background
    doc.setFillColor(darkNavy.r, darkNavy.g, darkNavy.b);
    doc.rect(0, 0, pageWidth, pageHeight, 'F');

    // Abstract graphic accent (Coral band at the right)
    doc.setFillColor(coral.r, coral.g, coral.b);
    doc.rect(pageWidth - 6, 0, 6, pageHeight, 'F');

    // Sage accent bar
    doc.setFillColor(sage.r, sage.g, sage.b);
    doc.rect(margin, 50, 12, 12, 'F');

    // Title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(coral.r, coral.g, coral.b);
    doc.text('EXECUTIVE BOARD REPORT', margin, 80);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(28);
    doc.setTextColor(255, 255, 255);
    const companyLines = doc.splitTextToSize(report.companyName.toUpperCase(), contentWidth - 10);
    doc.text(companyLines, margin, 95);

    // Headline
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(14);
    doc.setTextColor(sage.r, sage.g, sage.b);
    const headlineLines = doc.splitTextToSize(`"${report.executiveHeadline}"`, contentWidth);
    doc.text(headlineLines, margin, 120);

    // Meta details container
    doc.setFillColor(255, 255, 255, 0.03);
    doc.rect(margin, 150, contentWidth, 65, 'F');
    doc.setDrawColor(255, 255, 255, 0.1);
    doc.rect(margin, 150, contentWidth, 65, 'S');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(255, 255, 255);
    doc.text('METADADOS DE CONFORMIDADE FIDUCIÁRIA', margin + 8, 160);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(200, 200, 200);
    doc.text(`Report ID: ${report.reportId}`, margin + 8, 172);
    doc.text(`Emitido em: ${new Date(report.generatedAt).toLocaleDateString('pt-BR')} ${new Date(report.generatedAt).toLocaleTimeString('pt-BR')}`, margin + 8, 179);
    doc.text(`contexto de Análise: ${report.scenario}`, margin + 8, 186);
    doc.text(`Nível de Confiança das Inferências: ${report.confidenceLevel}`, margin + 8, 193);
    doc.text(`Compilado por: ${report.generatedBy || 'SYSTEM'}`, margin + 8, 200);
    doc.text(`Modo de Operação: ${report.timelineMode === 'LIVE_HISTORY' ? 'AUDITADO (LIVE_DATA)' : 'SIMULADO (DEMO_SCENARIO)'}`, margin + 8, 207);

    // Footer Cover
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(255, 255, 255);
    doc.text('Illumine Corporate Governance™', margin, pageHeight - 30);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text('Plataforma de Suporte à Decisão Cognitiva de Governança', margin, pageHeight - 24);

    // ==========================================
    // PAGE 2: EXECUTIVE SUMMARY
    // ==========================================
    doc.addPage();
    drawHeaderFooter(2);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(darkNavy.r, darkNavy.g, darkNavy.b);
    doc.text('1. RESUMO EXECUTIVO E PARECER', margin, 35);

    // Headline block
    doc.setFillColor(lightGrey.r, lightGrey.g, lightGrey.b);
    doc.rect(margin, 42, contentWidth, 18, 'F');
    doc.setDrawColor(sage.r, sage.g, sage.b);
    doc.line(margin, 42, margin, 60); // Sage vertical indicator

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(coral.r, coral.g, coral.b);
    doc.text('DIRETRIZ DA MANCHETE DO CONSELHO:', margin + 6, 49);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(darkNavy.r, darkNavy.g, darkNavy.b);
    doc.text(report.executiveHeadline, margin + 6, 55);

    // Composite Assessment & Governance Journey Overview Box (GJL™)
    const journey = report.journeyOverview;
    let nextY = 73; // Default starting Y for Composite Assessment if no journey is present
    
    if (journey) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9.5);
      const narrativeLines = doc.splitTextToSize(journey.boardNarrative, contentWidth - 12);
      const boxHeight = 25 + (narrativeLines.length * 4.5); // 25mm header/meta + narrative height
      
      doc.setFillColor(lightGrey.r, lightGrey.g, lightGrey.b);
      doc.rect(margin, 63, contentWidth, boxHeight, 'F');
      doc.setDrawColor(coral.r, coral.g, coral.b);
      doc.line(margin, 63, margin, 63 + boxHeight); // Coral vertical indicator
      
      // Box Title
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(darkNavy.r, darkNavy.g, darkNavy.b);
      doc.text('JORNADA DE GOVERNANÇA (GJL™)', margin + 6, 69);
      
      // Index Label (Must be clearly labeled as a presentation index)
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(charcoal.r, charcoal.g, charcoal.b);
      doc.text('Governance Journey Index — índice consolidado de navegação executiva:', margin + 6, 75);
      
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(coral.r, coral.g, coral.b);
      doc.text(`${journey.gjiScore}/100`, margin + 115, 75);
      
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(darkNavy.r, darkNavy.g, darkNavy.b);
      doc.text(`Estágio: ${journey.gjiStage}`, margin + 132, 75);
      
      // Board Narrative
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9.5);
      doc.setTextColor(charcoal.r, charcoal.g, charcoal.b);
      doc.text(narrativeLines, margin + 6, 83);
      
      nextY = 63 + boxHeight + 10;
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(darkNavy.r, darkNavy.g, darkNavy.b);
    doc.text('AVALIAÇÃO DE BASE COMPOSITA:', margin, nextY);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(charcoal.r, charcoal.g, charcoal.b);
    doc.text(report.overallAssessment, margin, nextY + 7);

    // Executive Summary Narrative
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(darkNavy.r, darkNavy.g, darkNavy.b);
    doc.text('RELATÓRIO DE SÍNTESE ADVISORY:', margin, nextY + 22);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(charcoal.r, charcoal.g, charcoal.b);
    const summaryLinesSplit = doc.splitTextToSize(report.executiveSummary, contentWidth);
    doc.text(summaryLinesSplit, margin, nextY + 29);

    // ==========================================
    // PAGE 3: RISKS & OPPORTUNITIES
    // ==========================================
    doc.addPage();
    drawHeaderFooter(3);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(darkNavy.r, darkNavy.g, darkNavy.b);
    doc.text('2. REGISTER DE RISCOS E OPORTUNIDADES', margin, 35);

    // Left Column: Risks (Top 5)
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(coral.r, coral.g, coral.b);
    doc.text('TOP 5 RISCOS E EXPOSIÇÕES', margin, 48);

    let riskY = 56;
    report.principalRisks.forEach((risk, i) => {
      doc.setFillColor(lightGrey.r, lightGrey.g, lightGrey.b);
      doc.rect(margin, riskY, contentWidth, 18, 'F');
      doc.setDrawColor(borderGrey.r, borderGrey.g, borderGrey.b);
      doc.rect(margin, riskY, contentWidth, 18, 'S');

      // Highlight Critical/High in Coral/Red
      const isCritical = risk.includes('[CRITICAL]');
      const isHigh = risk.includes('[HIGH]');
      doc.setFillColor(isCritical ? coral.r : isHigh ? 230 : 200, isCritical ? coral.g : isHigh ? 80 : 200, isCritical ? coral.b : isHigh ? 80 : 200);
      doc.rect(margin, riskY, 3, 18, 'F');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(darkNavy.r, darkNavy.g, darkNavy.b);
      const cleanRiskText = risk.replace('[CRITICAL] ', '').replace('[HIGH] ', '').replace('[MODERATE] ', '').replace('[LOW] ', '');
      const riskLines = doc.splitTextToSize(`${i + 1}. ${cleanRiskText}`, contentWidth - 10);
      doc.text(riskLines, margin + 6, riskY + 5);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(120, 120, 120);
      const severityLabel = isCritical ? 'Gravidade: CRITICAL' : isHigh ? 'Gravidade: HIGH' : risk.includes('[MODERATE]') ? 'Gravidade: MODERATE' : 'Gravidade: LOW';
      doc.text(severityLabel, margin + 6, riskY + 14);

      riskY += 21;
    });

    // Opportunities (Top 5)
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(sage.r, sage.g, sage.b);
    doc.text('TOP 5 OPORTUNIDADES DE GERAÇÃO DE VALOR', margin, 168);

    let oppY = 176;
    report.principalOpportunities.forEach((opp, i) => {
      doc.setFillColor(lightGrey.r, lightGrey.g, lightGrey.b);
      doc.rect(margin, oppY, contentWidth, 18, 'F');
      doc.setDrawColor(borderGrey.r, borderGrey.g, borderGrey.b);
      doc.rect(margin, oppY, contentWidth, 18, 'S');

      doc.setFillColor(sage.r, sage.g, sage.b);
      doc.rect(margin, oppY, 3, 18, 'F');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(darkNavy.r, darkNavy.g, darkNavy.b);
      const cleanOppText = opp.replace('[ciclo imediato] ', '').replace('[médio ciclo] ', '').replace('[longo horizonte] ', '');
      const oppLines = doc.splitTextToSize(`${i + 1}. ${cleanOppText}`, contentWidth - 10);
      doc.text(oppLines, margin + 6, oppY + 5);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(120, 120, 120);
      const timeframeLabel = opp.includes('[ciclo imediato]') ? 'Horizonte: ciclo imediato (≤ 90 dias)' : opp.includes('[médio ciclo]') ? 'Horizonte: médio ciclo (≤ 12 meses)' : 'Horizonte: longo horizonte (> 12 meses)';
      doc.text(timeframeLabel, margin + 6, oppY + 14);

      oppY += 21;
    });

    // ==========================================
    // PAGE 4: BOARD PRIORITIES & ROADMAP
    // ==========================================
    doc.addPage();
    drawHeaderFooter(4);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(darkNavy.r, darkNavy.g, darkNavy.b);
    doc.text('3. DIRECIONAMENTO E ROADMAP ESTRATÉGICO', margin, 35);

    // Priorities list
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(darkNavy.r, darkNavy.g, darkNavy.b);
    doc.text('RECOMENDAÇÕES PRIORITÁRIAS DO CONSELHO (BPE™)', margin, 48);

    let priorityY = 56;
    report.boardPriorities.forEach((priority) => {
      doc.setFillColor(lightGrey.r, lightGrey.g, lightGrey.b);
      doc.rect(margin, priorityY, contentWidth, 14, 'F');
      doc.setDrawColor(borderGrey.r, borderGrey.g, borderGrey.b);
      doc.rect(margin, priorityY, contentWidth, 14, 'S');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(darkNavy.r, darkNavy.g, darkNavy.b);
      const prioLines = doc.splitTextToSize(priority, contentWidth - 10);
      doc.text(prioLines, margin + 6, priorityY + 8);

      priorityY += 17;
    });

    // Roadmap highlights (GRE)
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(darkNavy.r, darkNavy.g, darkNavy.b);
    doc.text('CRONOGRAMA DE EVOLUÇÃO E MARCOS (GRE™)', margin, 150);

    let roadmapY = 158;
    report.roadmapHighlights.forEach((highlight) => {
      doc.setFillColor(lightGrey.r, lightGrey.g, lightGrey.b);
      doc.rect(margin, roadmapY, contentWidth, 12, 'F');
      doc.setDrawColor(borderGrey.r, borderGrey.g, borderGrey.b);
      doc.rect(margin, roadmapY, contentWidth, 12, 'S');

      doc.setFillColor(darkNavy.r, darkNavy.g, darkNavy.b);
      doc.rect(margin, roadmapY, 3, 12, 'F');

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(charcoal.r, charcoal.g, charcoal.b);
      const hlLines = doc.splitTextToSize(highlight, contentWidth - 10);
      doc.text(hlLines, margin + 6, roadmapY + 7);

      roadmapY += 15;
    });

    // ==========================================
    // PAGE 5: MONITORING & RECOMMENDED DECISIONS
    // ==========================================
    doc.addPage();
    drawHeaderFooter(5);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(darkNavy.r, darkNavy.g, darkNavy.b);
    doc.text('4. MONITORAMENTO E MATRIZ DE DECISÕES', margin, 35);

    // GML highlights
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(darkNavy.r, darkNavy.g, darkNavy.b);
    doc.text('INDICADORES DE EVOLUÇÃO TEMPORAL (GML™)', margin, 48);

    let monitoringY = 56;
    report.monitoringHighlights.forEach((mon) => {
      doc.setFillColor(lightGrey.r, lightGrey.g, lightGrey.b);
      doc.rect(margin, monitoringY, contentWidth, 12, 'F');
      doc.setDrawColor(borderGrey.r, borderGrey.g, borderGrey.b);
      doc.rect(margin, monitoringY, contentWidth, 12, 'S');

      // Blue marker
      doc.setFillColor(sage.r, sage.g, sage.b);
      doc.rect(margin, monitoringY, 3, 12, 'F');

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(charcoal.r, charcoal.g, charcoal.b);
      const monLines = doc.splitTextToSize(mon, contentWidth - 10);
      doc.text(monLines, margin + 6, monitoringY + 7);

      monitoringY += 15;
    });

    // BRL/BCI/BAI Summary Card
    doc.setFillColor(lightGrey.r, lightGrey.g, lightGrey.b);
    doc.rect(margin, 120, contentWidth, 22, 'F');
    doc.setDrawColor(borderGrey.r, borderGrey.g, borderGrey.b);
    doc.rect(margin, 120, contentWidth, 22, 'S');

    doc.setFillColor(sage.r, sage.g, sage.b);
    doc.rect(margin, 120, 3, 22, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(darkNavy.r, darkNavy.g, darkNavy.b);
    doc.text('BENCHMARKING & EVOLUÇÃO ESTRATÉGICA (BRL™ / BCI™ / BAI™)', margin + 6, 125);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(charcoal.r, charcoal.g, charcoal.b);
    
    const readinessStr = report.benchmarkReadinessStatus 
      ? `${report.benchmarkReadinessStatus.replace('_', ' ')} (${report.benchmarkReadinessScore}/100)`
      : 'N/A';
    const positionStr = report.benchmarkPosition 
      ? `${report.benchmarkPosition.replace('_', ' ')} (BPS™: ${report.bpsScore}/100)`
      : 'N/A';
    const apsStr = report.apsScore !== undefined ? `${report.apsScore}/100` : 'N/A';
    const acsStr = report.advisoryConfidenceScore !== undefined ? `${report.advisoryConfidenceScore}/100` : 'N/A';
    
    doc.text(`Prontidão (BRL™): ${readinessStr}  |  Posicionamento Cohort (BCI™): ${positionStr}`, margin + 6, 131);
    doc.text(`Potencial de Avanço (APS™): ${apsStr}  |  Confiança Advisory (ACS™): ${acsStr}`, margin + 6, 136);
    
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(7);
    doc.setTextColor(100, 100, 100);
    doc.text('Nota: Este roadmap representa recomendação fiduciária metodológica e não substitui a deliberação do conselho ou parecer jurídico.', margin + 6, 140);

    // Governance Execution Status (GDTL)
    let decHeaderY = 155;
    let decY = 163;

    if (report.executionStatus) {
      doc.setFillColor(lightGrey.r, lightGrey.g, lightGrey.b);
      doc.rect(margin, 148, contentWidth, 18, 'F');
      doc.setDrawColor(sage.r, sage.g, sage.b);
      doc.rect(margin, 148, contentWidth, 18, 'S');

      doc.setFillColor(sage.r, sage.g, sage.b);
      doc.rect(margin, 148, 3, 18, 'F');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(darkNavy.r, darkNavy.g, darkNavy.b);
      doc.text('GOVERNANCE EXECUTION STATUS (GDTL™)', margin + 6, 153);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(charcoal.r, charcoal.g, charcoal.b);
      doc.text(report.executionStatus, margin + 6, 160);

      decHeaderY = 175;
      decY = 183;
    }

    // Recommended Decisions
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(darkNavy.r, darkNavy.g, darkNavy.b);
    doc.text('RECOMENDAÇÕES PARA TOMADA DE DECISÃO IMEDIATA', margin, decHeaderY);

    report.recommendedDecisions.forEach((dec) => {
      doc.setFillColor(lightGrey.r, lightGrey.g, lightGrey.b);
      doc.rect(margin, decY, contentWidth, 22, 'F');
      doc.setDrawColor(borderGrey.r, borderGrey.g, borderGrey.b);
      doc.rect(margin, decY, contentWidth, 22, 'S');

      doc.setFillColor(coral.r, coral.g, coral.b);
      doc.rect(margin, decY, 3, 22, 'F');

      // Parse: Decisão | Justificativa | Benefício | Horizonte
      const parts = dec.split(' | ');
      const decisionTitle = parts[0]?.replace('Decisão: ', '') || '';
      const justification = parts[1]?.replace('Justificativa: ', '') || '';
      const benefit = parts[2]?.replace('Benefício: ', '') || '';
      const horizon = parts[3]?.replace('Horizonte: ', '') || '';

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(darkNavy.r, darkNavy.g, darkNavy.b);
      doc.text(`AÇÃO: ${decisionTitle}`, margin + 6, decY + 5);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(charcoal.r, charcoal.g, charcoal.b);
      doc.text(`Justificativa: ${justification}`, margin + 6, decY + 10);
      doc.text(`Benefício: ${benefit}`, margin + 6, decY + 14);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(sage.r, sage.g, sage.b);
      doc.text(`Horizonte: ${horizon}`, margin + 6, decY + 18);

      decY += 25;
    });

    // ==========================================
    // PAGE 6: INSTITUTIONAL LEARNING REVIEW (GLL™)
    // ==========================================
    doc.addPage();
    drawHeaderFooter(6);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(darkNavy.r, darkNavy.g, darkNavy.b);
    doc.text('5. REVISÃO DE APRENDIZADO INSTITUCIONAL (GLL™)', margin, 35);

    const learning = report.learningResult;
    if (learning) {
      // Draw GLI / AAI scores block
      doc.setFillColor(lightGrey.r, lightGrey.g, lightGrey.b);
      doc.rect(margin, 43, contentWidth, 24, 'F');
      doc.setDrawColor(borderGrey.r, borderGrey.g, borderGrey.b);
      doc.rect(margin, 43, contentWidth, 24, 'S');
      
      doc.setFillColor(sage.r, sage.g, sage.b);
      doc.rect(margin, 43, 3, 24, 'F');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(darkNavy.r, darkNavy.g, darkNavy.b);
      doc.text(`ÍNDICE DE APRENDIZADO (GLI™): ${learning.gliScore}/100 | MATURIDADE: ${learning.learningMaturity}`, margin + 6, 50);
      
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(charcoal.r, charcoal.g, charcoal.b);
      doc.text(`Acurácia Consultiva (AAI™): ${learning.aaiScore}% (${learning.aaiLevel.replace(/_/g, ' ')}) | Modo: ${learning.feedbackMode}`, margin + 6, 56);
      
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(8);
      doc.setTextColor(120, 120, 120);
      const sumLines = doc.splitTextToSize(`Sumário: ${learning.executiveSummary}`, contentWidth - 15);
      doc.text(sumLines, margin + 6, 62);

      // Learning observations
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(darkNavy.r, darkNavy.g, darkNavy.b);
      doc.text('OBSERVAÇÕES E LIÇÕES APRENDIDAS', margin, 77);

      let obsY = 83;
      learning.observations.slice(0, 3).forEach((obs) => {
        doc.setFillColor(lightGrey.r, lightGrey.g, lightGrey.b);
        doc.rect(margin, obsY, contentWidth, 20, 'F');
        doc.setDrawColor(borderGrey.r, borderGrey.g, borderGrey.b);
        doc.rect(margin, obsY, contentWidth, 20, 'S');

        const isFailed = obs.status === 'FAILED';
        doc.setFillColor(isFailed ? coral.r : sage.r, isFailed ? coral.g : sage.g, isFailed ? coral.b : sage.b);
        doc.rect(margin, obsY, 2.5, 20, 'F');

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9);
        doc.setTextColor(darkNavy.r, darkNavy.g, darkNavy.b);
        doc.text(`[${obs.source}] ${obs.title} (${obs.status})`, margin + 6, obsY + 5);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.setTextColor(charcoal.r, charcoal.g, charcoal.b);
        doc.text(`Resultado: Esperado: ${obs.expectedOutcome.substring(0, 95)}... / Real: ${obs.actualOutcome.substring(0, 95)}...`, margin + 6, obsY + 10);
        
        const impactStr = obs.expectedImpact !== undefined 
          ? ` | Impacto Projetado: ${obs.expectedImpact} BPS (Real: ${obs.actualImpact} BPS, Var: ${obs.variance} BPS)` 
          : '';
        doc.text(`Lição Aprendida: ${obs.lessonsLearned[0]?.substring(0, 95) || 'N/A'}${impactStr}`, margin + 6, obsY + 14);

        obsY += 23;
      });

      // Strengths & Recurring failures
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(darkNavy.r, darkNavy.g, darkNavy.b);
      doc.text('CAPACIDADES FORTALECIDAS & OBSTÁCULOS RECORRENTES', margin, 160);

      doc.setFillColor(lightGrey.r, lightGrey.g, lightGrey.b);
      doc.rect(margin, 166, contentWidth, 28, 'F');
      doc.setDrawColor(borderGrey.r, borderGrey.g, borderGrey.b);
      doc.rect(margin, 166, contentWidth, 28, 'S');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(darkNavy.r, darkNavy.g, darkNavy.b);
      doc.text('CAPACIDADES EM CONSOLIDAÇÃO:', margin + 6, 172);
      doc.setFont('helvetica', 'normal');
      doc.text(learning.institutionalStrengths.join(' | ') || 'Nenhuma capacidade recorrente mapeada no ciclo.', margin + 6, 177);

      doc.setFont('helvetica', 'bold');
      doc.setTextColor(coral.r, coral.g, coral.b);
      doc.text('OBSTÁCULOS RECORRENTES DETECTADOS:', margin + 6, 184);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(charcoal.r, charcoal.g, charcoal.b);
      doc.text(learning.recurringFailures.join(' | ') || 'Nenhuma falha recorrente detectada nos ciclos avaliados.', margin + 6, 189);
    } else {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(charcoal.r, charcoal.g, charcoal.b);
      doc.text('Métricas de aprendizado indisponíveis.', margin, 45);
    }

    // ==========================================
    // PAGE 7: EXPLAINABILITY APPENDIX (CONCISE)
    // ==========================================
    doc.addPage();
    drawHeaderFooter(7);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(darkNavy.r, darkNavy.g, darkNavy.b);
    doc.text('5. APÊNDICE DE RASTREABILIDADE', margin, 35);

    // Explainability trails
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(darkNavy.r, darkNavy.g, darkNavy.b);
    doc.text('LINHA DE RACIOCÍNIO E ASSINATURA FIDUCIÁRIA', margin, 48);

    let expY = 56;
    report.explainability.forEach((exp) => {
      doc.setFillColor(lightGrey.r, lightGrey.g, lightGrey.b);
      doc.rect(margin, expY, contentWidth, 12, 'F');
      doc.setDrawColor(borderGrey.r, borderGrey.g, borderGrey.b);
      doc.rect(margin, expY, contentWidth, 12, 'S');

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(charcoal.r, charcoal.g, charcoal.b);
      const expLines = doc.splitTextToSize(exp, contentWidth - 10);
      doc.text(expLines, margin + 6, expY + 7);

      expY += 15;
    });

    // Applied Principles (GKL)
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(darkNavy.r, darkNavy.g, darkNavy.b);
    doc.text('PRINCÍPIOS INSTITUCIONAIS VINCULADOS (IWL™)', margin, 120);

    doc.setFillColor(lightGrey.r, lightGrey.g, lightGrey.b);
    doc.rect(margin, 126, contentWidth, 20, 'F');
    doc.setDrawColor(borderGrey.r, borderGrey.g, borderGrey.b);
    doc.rect(margin, 126, contentWidth, 20, 'S');

    doc.setFillColor(sage.r, sage.g, sage.b);
    doc.rect(margin, 126, 3, 20, 'F');

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(charcoal.r, charcoal.g, charcoal.b);
    const principlesText = report.principlesApplied && report.principlesApplied.length > 0
      ? report.principlesApplied.join(' | ')
      : 'Nenhum princípio explicitamente mapeado para esta diretriz de baseline.';
    const principlesLines = doc.splitTextToSize(principlesText, contentWidth - 10);
    doc.text(principlesLines, margin + 6, 132);

    // Cripto Hashes (Lineage Hash)
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(darkNavy.r, darkNavy.g, darkNavy.b);
    doc.text('ASSINATURA CRIPTOGRÁFICA DO RELATÓRIO (LINEAGE HASH)', margin, 155);

    doc.setFillColor(lightGrey.r, lightGrey.g, lightGrey.b);
    doc.rect(margin, 161, contentWidth, 18, 'F');
    doc.setDrawColor(borderGrey.r, borderGrey.g, borderGrey.b);
    doc.rect(margin, 161, contentWidth, 18, 'S');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(sage.r, sage.g, sage.b);
    doc.text('LINEAGE HASH FIDUCIÁRIO:', margin + 6, 168);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text(report.lineageHash, margin + 6, 175);

    // Signatures
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(darkNavy.r, darkNavy.g, darkNavy.b);
    doc.text('ASSINATURAS E HOMOLOGAÇÃO', margin, 195);

    doc.setDrawColor(borderGrey.r, borderGrey.g, borderGrey.b);
    doc.line(margin + 10, 230, margin + 70, 230);
    doc.line(pageWidth - margin - 70, 230, pageWidth - margin - 10, 230);

    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(charcoal.r, charcoal.g, charcoal.b);
    doc.text('CONSELHO DE ADMINISTRAÇÃO', margin + 20, 235);
    doc.text('AUDITOR DE COMPLIANCE', pageWidth - margin - 58, 235);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(120, 120, 120);
    doc.text('Presidente do Board', margin + 27, 239);
    doc.text('Illumine Cognitive System', pageWidth - margin - 56, 239);

    // End of Document marker
    doc.setDrawColor(darkNavy.r, darkNavy.g, darkNavy.b);
    doc.line(margin + 50, 260, pageWidth - margin - 50, 260);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(darkNavy.r, darkNavy.g, darkNavy.b);
    doc.text('FIM DO RELATÓRIO EXECUTIVO', pageWidth / 2 - 25, 267);

    return doc;
  }
}
