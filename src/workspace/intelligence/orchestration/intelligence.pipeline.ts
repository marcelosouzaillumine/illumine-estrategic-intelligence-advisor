import { IntelligenceExecutionLog } from '../repositories/intelligence-audit.repository';

export interface IntelligencePipelineContext {
  tenantId: string;
  periodId: string;
  triggeredBy: string;
}

export abstract class IntelligencePipeline {
  abstract readonly pipelineName: string;

  /**
   * Main entrypoint for any intelligence pipeline.
   * Enforces audit logging and standard lifecycle management.
   */
  async execute(context: IntelligencePipelineContext): Promise<void> {
    const auditLog: IntelligenceExecutionLog = {
      tenantId: context.tenantId,
      pipeline: this.pipelineName,
      startedAt: new Date().toISOString(),
      engines: this.getEnginesUsed(),
      status: 'RUNNING'
    };

    try {
      // In a real application, we would persist this RUNNING log to the repository here.
      
      await this.runProcess(context);

      auditLog.completedAt = new Date().toISOString();
      auditLog.status = 'SUCCESS';
      
      this.persistAuditLog(auditLog);

    } catch (error) {
      auditLog.completedAt = new Date().toISOString();
      auditLog.status = 'FAILED';
      auditLog.error = error instanceof Error ? error.message : String(error);
      
      this.persistAuditLog(auditLog);
      throw error;
    }
  }

  /**
   * The core logic to be implemented by specific domain pipelines (e.g., CfoPipeline).
   */
  protected abstract runProcess(context: IntelligencePipelineContext): Promise<void>;

  /**
   * Returns a list of engine names utilized by this pipeline for audit purposes.
   */
  protected abstract getEnginesUsed(): string[];

  private persistAuditLog(log: IntelligenceExecutionLog) {
    // Fire-and-forget or await persistence
    console.log(`[Governance Audit] ${log.pipeline} - ${log.status} for ${log.tenantId} (Period: ${log.periodId})`);
    if (log.error) {
      console.error(`[Governance Error] ${log.error}`);
    }
    // TODO: Hook up to the actual IntelligenceAuditRepository
  }
}
