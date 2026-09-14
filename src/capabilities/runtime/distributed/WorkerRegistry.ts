import { AsyncJob, AsyncJobQueue } from './AsyncJobQueue';
import { RuntimePartitionManager, RuntimePartitionType } from './RuntimePartitionManager';
import { DataAccessContext } from '../../../core/security/data-access-context';
import { getErrorMessage } from '../../../types/runtime/RuntimeErrorGuards';

export type WorkerStatus = 'IDLE' | 'BUSY' | 'STOPPED';

export interface WorkerInfo {
  workerId: string;
  jobType: string;
  partitionName: RuntimePartitionType;
  status: WorkerStatus;
  failuresCount: number;
  activeJobId: string | null;
  lastHeartbeatAt: string;
}

export type JobExecutor = (job: AsyncJob) => Promise<any>;

export class WorkerRegistry {
  private static workers = new Map<string, WorkerInfo>();
  private static executors = new Map<string, JobExecutor>();
  private static pollingIntervals = new Map<string, any>();

  // Regista um executor personalizado para um tipo de tarefa
  static registerExecutor(jobType: string, executor: JobExecutor) {
    this.executors.set(jobType, executor);
  }

  // Registra e inicia um worker especializado
  static registerWorker(
    workerId: string,
    jobType: string,
    partitionName: RuntimePartitionType,
    context: DataAccessContext
  ) {
    const worker: WorkerInfo = {
      workerId,
      jobType,
      partitionName,
      status: 'IDLE',
      failuresCount: 0,
      activeJobId: null,
      lastHeartbeatAt: new Date().toISOString()
    };

    this.workers.set(workerId, worker);
    
    // Inicia loop de polling (ex: a cada 1.5s)
    const intervalId = setInterval(async () => {
      await this.pollNextJob(workerId, context);
    }, 1500);

    this.pollingIntervals.set(workerId, intervalId);
    console.log(`[WorkerRegistry] Worker registered: ${workerId} for jobType ${jobType}`);
  }

  // Desativa e cancela polling de um worker (Load Shedding manual ou automático)
  static stopWorker(workerId: string) {
    const worker = this.workers.get(workerId);
    if (worker) {
      worker.status = 'STOPPED';
      const intervalId = this.pollingIntervals.get(workerId);
      if (intervalId) {
        clearInterval(intervalId);
        this.pollingIntervals.delete(workerId);
      }
      console.log(`[WorkerRegistry] Worker stopped: ${workerId}`);
    }
  }

  // Retorna workers ativos
  static getWorkers(): WorkerInfo[] {
    return Array.from(this.workers.values());
  }

  static getWorker(workerId: string): WorkerInfo | undefined {
    return this.workers.get(workerId);
  }

  // Executa polling e processamento do próximo job
  private static async pollNextJob(workerId: string, context: DataAccessContext) {
    const worker = this.workers.get(workerId);
    if (!worker || worker.status === 'STOPPED' || worker.status === 'BUSY') return;

    // Atualiza heartbeat do worker
    worker.lastHeartbeatAt = new Date().toISOString();

    try {
      worker.status = 'BUSY';
      
      // Constrói contexto de acesso baseado no tenant e escopo do worker
      const targetJobType = worker.jobType;
      
      // Busca job elegível
      const job = await AsyncJobQueue.claimNextJob(context, targetJobType, workerId);
      
      if (job) {
        worker.activeJobId = job.jobId;
        const startTime = Date.now();

        // Heartbeat inicial do job
        await AsyncJobQueue.updateHeartbeat(job.jobId);

        try {
          // Busca o executor correspondente
          const executor = this.executors.get(targetJobType);
          if (!executor) {
            throw new Error(`NO_EXECUTOR_FOUND: No execution logic registered for jobType ${targetJobType}`);
          }

          // Executa a tarefa assíncrona
          await executor(job);

          // Sucesso
          await AsyncJobQueue.completeJob(job.jobId);
          
          const latency = Date.now() - startTime;
          RuntimePartitionManager.registerExecution(worker.partitionName, latency, false);

        } catch (execErr: unknown) {
          console.error(`[WorkerRegistry] Worker ${workerId} failed to execute job ${job.jobId}:`, execErr);
          
          worker.failuresCount++;
          await AsyncJobQueue.failJob(job.jobId, getErrorMessage(execErr));
          
          const latency = Date.now() - startTime;
          RuntimePartitionManager.registerExecution(worker.partitionName, latency, true, true);
        } finally {
          worker.activeJobId = null;
        }
      }
    } catch (claimErr) {
      console.error(`[WorkerRegistry] Error claiming job for worker ${workerId}:`, claimErr);
    } finally {
      if ((worker.status as WorkerStatus) !== 'STOPPED') {
        worker.status = 'IDLE';
      }
    }
  }

  static clear() {
    for (const intervalId of this.pollingIntervals.values()) {
      clearInterval(intervalId);
    }
    this.pollingIntervals.clear();
    this.workers.clear();
    this.executors.clear();
  }
}
