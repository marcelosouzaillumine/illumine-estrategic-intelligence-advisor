import { jsPDF } from 'jspdf';
import { ExecutiveIntelligenceReport } from '../runtime/executive-intelligence-runtime';
import { CalibrationEngine } from '../runtime/calibration/CalibrationEngine';
import { ExportSnapshotMetadata } from './ExportTypes';
import { RuntimeComplianceEngine } from '../runtime/compliance/RuntimeComplianceEngine';
import { ExportMetadataAdapter } from './export-metadata-adapter';

export interface PdfExportOutput {
  pdf: jsPDF;
  metadata: ExportSnapshotMetadata;
}

export class ExecutivePdfExportEngine {
  /**
   * Generates a premium executive PDF report from the given ExecutiveIntelligenceReport.
   * This class is strictly passive: it does NOT calculate or change any metrics.
   * It logs a permanent and reproducible ExportSnapshotMetadata.
   */
  public static exportReport(report: ExecutiveIntelligenceReport, actorId: string): PdfExportOutput {
    if (!report) {
      throw new Error('[PDF Export] Relatório de entrada inválido.');
    }

    // Constitutional Compliance Validation (export mode - hard blocks Grade F)
    RuntimeComplianceEngine.validate(report, 'export');

    const { context, scores, severity, advisory, compliance, runtimeMetadata } = report;

    // 1. Generate unique fiduciarily auditable ExportSnapshotMetadata
    const exportId = `EXP-PDF-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const metadata: ExportSnapshotMetadata = {
      exportId,
      timestamp: new Date().toISOString(),
      tenantId: ExportMetadataAdapter.extractTenantId(report),
      runtimeExecutionId: ExportMetadataAdapter.extractExecutionId(report),
      calibrationProfile: CalibrationEngine.getActiveProfileId(),
      confidenceSnapshot: compliance.confidenceLevel,
      lineageHash: ExportMetadataAdapter.extractDatasetHash(report),
      reportVersion: CalibrationEngine.getVersion(),
      generatedBy: actorId || 'SYSTEM'
    };

    // 2. Build PDF structure passivamente using jsPDF (A4 layout)
    // We run it with 'portrait', 'mm', 'a4'
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    // Page 1: Premium Title Page
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(22);
    pdf.setTextColor(255, 133, 82); // Illumine Premium Coral (FF8552)
    pdf.text('ILLUMINE PLATFORM', 20, 40);
    
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(14);
    pdf.setTextColor(60, 60, 60);
    pdf.text('Executive Governance Board Report', 20, 50);

    pdf.setFontSize(10);
    pdf.setTextColor(120, 120, 120);
    pdf.text(`Tenant: ${metadata.tenantId} | Data: ${new Date(metadata.timestamp).toLocaleDateString('pt-BR')}`, 20, 60);
    pdf.text(`Status de Confiança: ${metadata.confidenceSnapshot}`, 20, 65);

    // Section 1: Scores (directly from report)
    pdf.setDrawColor(220, 220, 220);
    pdf.line(20, 75, 190, 75);

    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(12);
    pdf.setTextColor(40, 40, 40);
    pdf.text('ESTADO DE SAÚDE OPERACIONAL E FINANCEIRA', 20, 85);

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(10);
    pdf.text(`Score Composto: ${scores.composite}/100`, 20, 95);
    pdf.text(`Score Financeiro: ${scores.financial}/100`, 20, 100);
    pdf.text(`Score Estrutural: ${scores.structural}/100`, 20, 105);
    pdf.text(`Grau de Severidade: ${severity.level}`, 20, 110);

    // Section 2: Storytelling Narrative
    pdf.line(20, 120, 190, 120);
    pdf.setFont('helvetica', 'bold');
    pdf.text('PARECER EXECUTIVO E MITIGAÇÕES', 20, 130);

    pdf.setFont('helvetica', 'normal');
    const summaryLines = pdf.splitTextToSize(advisory.executiveSummary, 170);
    pdf.text(summaryLines, 20, 140);

    // Page 2: Audit Trail details
    pdf.addPage();
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(12);
    pdf.text('DOCUMENTAÇÃO DE RASTREABILIDADE (LINEAGE & COMPLIANCE)', 20, 30);

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(9);
    pdf.text(`Export ID: ${metadata.exportId}`, 20, 45);
    pdf.text(`Execution ID: ${metadata.runtimeExecutionId}`, 20, 52);
    pdf.text(`Lineage Hash: ${metadata.lineageHash}`, 20, 59);
    pdf.text(`Calibration Active Profile: ${metadata.calibrationProfile}`, 20, 66);
    pdf.text(`Report Compiler Version: ${metadata.reportVersion}`, 20, 73);
    pdf.text(`Exported By: ${metadata.generatedBy}`, 20, 80);

    console.log(`[PDF Export] Relatório exportado com sucesso. ExportId: ${exportId}`);
    return { pdf, metadata };
  }
}
