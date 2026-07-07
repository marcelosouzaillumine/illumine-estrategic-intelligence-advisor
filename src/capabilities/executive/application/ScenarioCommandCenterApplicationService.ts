import { WarRoomRuntime } from '../../../core/war-room/WarRoomRuntime';
import { MockWarRoomRepository } from '../../../core/war-room/WarRoomRepository';

export interface CrossNavigationPayload {
  tenantId: string;
  sourceWorkspace: string;
  targetWorkspace: string;
  correlationId: string;
  path: string;
}

export class ScenarioCommandCenterApplicationService {
  private static instance: ScenarioCommandCenterApplicationService;

  private constructor() {}

  public static getInstance(): ScenarioCommandCenterApplicationService {
    if (!this.instance) {
      this.instance = new ScenarioCommandCenterApplicationService();
    }
    return this.instance;
  }

  public getWarRoomRuntime(): WarRoomRuntime {
    // Retorna a engine subjacente. Note que num ambiente produtivo real
    // isso poderia estar atrás de um IOC container.
    return new WarRoomRuntime(new MockWarRoomRepository());
  }

  public executeCrossNavigation(payload: CrossNavigationPayload, navigateFn: (path: string, options: any) => void): void {
    const navRef = {
      tenantId: payload.tenantId,
      sourceWorkspace: payload.sourceWorkspace,
      targetWorkspace: payload.targetWorkspace,
      correlationId: payload.correlationId
    };
    navigateFn(payload.path, { state: { navRef } });
  }
}
