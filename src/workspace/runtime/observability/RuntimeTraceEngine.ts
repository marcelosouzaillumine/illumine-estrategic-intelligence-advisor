import { v4 as uuidv4 } from 'uuid';
import { ExecutionStatus, RuntimeExecutionTrace } from './observability-types';
import { RuntimeProfiler } from './RuntimeProfiler';
import { ExecutionLineageTracker } from './ExecutionLineageTracker';
import { ConfidenceTelemetryEngine } from './ConfidenceTelemetryEngine';
import { ExplainabilityEngine } from './ExplainabilityEngine';
import { AdvisoryDecisionTrace } from './AdvisoryDecisionTrace';
import { RuntimeAuditTrail } from './RuntimeAuditTrail';

export class RuntimeTraceEngine {
  private executionId: string;
  private timestamp: string;
  private status: ExecutionStatus = 'STARTED';
  private mode: RuntimeExecutionTrace['runtimeMode'];

  private profiler = new RuntimeProfiler();
  private lineageTracker = new ExecutionLineageTracker();
  private telemetryEngine = new ConfidenceTelemetryEngine();
  private explainabilityEngine = new ExplainabilityEngine();
  private advisoryTrace = new AdvisoryDecisionTrace();
  private auditTrail = new RuntimeAuditTrail();

  constructor(mode: RuntimeExecutionTrace['runtimeMode'] = 'PASS_THROUGH') {
    this.executionId = `exec-${uuidv4()}`;
    this.timestamp = new Date().toISOString();
    this.mode = mode;
  }

  public get ExecutionId() { return this.executionId; }
  public get Profiler() { return this.profiler; }
  public get Lineage() { return this.lineageTracker; }
  public get Telemetry() { return this.telemetryEngine; }
  public get Explainability() { return this.explainabilityEngine; }
  public get AdvisoryTrace() { return this.advisoryTrace; }
  public get AuditTrail() { return this.auditTrail; }

  public setStatus(status: ExecutionStatus) {
    this.status = status;
  }

  public finalizeTrace(): RuntimeExecutionTrace {
    this.profiler.stop();
    const performance = this.profiler.getMetrics();
    const loopsDetected = this.auditTrail.detectLoops(this.lineageTracker.getNodes());
    const excessiveTime = performance.totalExecutionTimeMs > 500;

    return {
      executionId: this.executionId,
      timestamp: this.timestamp,
      runtimeMode: this.mode,
      performance,
      lineage: this.lineageTracker.getNodes(),
      confidenceTelemetry: this.telemetryEngine.getTelemetry(),
      explainability: this.explainabilityEngine.getOutput(),
      advisoryLineage: this.advisoryTrace.getTrace(),
      status: this.status,
      executionLoopsDetected: loopsDetected,
      excessiveExecutionTime: excessiveTime
    };
  }
}
