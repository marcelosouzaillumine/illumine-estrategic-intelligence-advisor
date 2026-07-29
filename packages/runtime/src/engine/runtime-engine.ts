import { PageManifest } from './manifest-loader';
import { Logger } from '../../../core/src/logging/logger';
import { eventBus } from '../../../core/src/events/event-bus';

export interface ExecutableComponentNode {
  type: string;
  props: Record<string, any>;
  children?: ExecutableComponentNode[];
}

export class RuntimeEngine {
  public static execute(manifest: PageManifest): ExecutableComponentNode {
    Logger.info(`[ERE Engine] Executando runtime declarativo para página: ${manifest.id}`);

    const rootNode: ExecutableComponentNode = {
      type: manifest.type === 'EAA' ? 'ExecutivePageTemplate' : 'ExecutiveSurface',
      props: { layout: manifest.layout.template },
      children: manifest.widgets.map((widget) => ({
        type: widget,
        props: { key: widget }
      }))
    };

    // Dispara o evento compulsório RuntimeCompiled
    eventBus.publish({
      type: 'RuntimeCompiled',
      payload: { pageId: manifest.id, nodesCount: manifest.widgets.length + 1 },
      timestamp: new Date().toISOString(),
      source: 'RuntimeEngine'
    });

    Logger.info(`[ERE Engine] Compilação de runtime concluída para ${manifest.id}`);
    return rootNode;
  }
}
